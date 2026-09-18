import "server-only";

import {
  COLORS,
  CONFIDENCE_LABEL,
  EVENTS,
  EXTRAS,
  FEET,
  GARMENTS,
  HEADS,
  PATTERNS,
  SOURCES,
  STYLES,
  colorById,
  eventById,
  garmentById,
  names,
  type Garment,
} from "./kb";
import type { LookConfig } from "./look";

type Content = string | ({ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } })[];
export type ChatMessage = { role: "system" | "user" | "assistant"; content: Content };
type Opts = { maxTokens?: number; temperature?: number };

export class AIError extends Error {
  constructor(
    message: string,
    public status = 502,
    /** Lỗi do nhà cung cấp (khóa, quyền, model, quá tải): nên thử nhà cung cấp dự phòng. */
    public retryable = false,
  ) {
    super(message);
  }
}

const TIMEOUT_MS = 45_000;
const UNAVAILABLE = "Dịch vụ AI tạm thời chưa dùng được, bạn thử lại sau ít phút nhé.";

function parseJSON<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        /* rơi xuống lỗi bên dưới */
      }
    }
    throw new AIError("AI trả về dữ liệu không đúng định dạng.");
  }
}

async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } catch (e) {
    if (e instanceof AIError) throw e;
    if ((e as Error).name === "AbortError") throw new AIError("AI phản hồi quá lâu, thử lại nhé.", 504, true);
    throw new AIError("Không kết nối được tới dịch vụ AI.", 502, true);
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------- Google Gemini ------------------------------- */

const GEMINI_BASE = process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

function toGeminiParts(content: Content): GeminiPart[] {
  if (typeof content === "string") return [{ text: content }];
  return content.map((p) => {
    if (p.type === "text") return { text: p.text };
    const m = p.image_url.url.match(/^data:([^;]+);base64,(.*)$/);
    if (!m) throw new AIError("Ảnh gửi lên không hợp lệ.", 400);
    return { inlineData: { mimeType: m[1], data: m[2] } };
  });
}

async function geminiJSON<T>(key: string, messages: ChatMessage[], opts: Opts): Promise<T> {
  const system = messages.filter((m) => m.role === "system").map((m) => (typeof m.content === "string" ? m.content : "")).join("\n\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: toGeminiParts(m.content) }));

  const call = (signal: AbortSignal, thinking: boolean) =>
    fetch(`${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: opts.temperature ?? 0.7,
          maxOutputTokens: (opts.maxTokens ?? 1400) + 1024,
          // Suy luận ở mức thấp nhất để phản hồi nhanh
          ...(thinking ? { thinkingConfig: { thinkingLevel: "minimal" } } : {}),
        },
      }),
    });

  return withTimeout(async (signal) => {
    let res = await call(signal, true);
    // Nếu model không hỗ trợ thinkingLevel, gọi lại không kèm cấu hình này
    if (res.status === 400) {
      const text = await res.text();
      if (/thinking/i.test(text)) res = await call(signal, false);
      else {
        console.error("Gemini 400:", text.slice(0, 500));
        throw new AIError(UNAVAILABLE, 502, true);
      }
    }
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new AIError("AI đang quá tải, thử lại sau ít giây.", 429, true);
      console.error(`Gemini ${res.status}:`, text.slice(0, 500));
      throw new AIError(UNAVAILABLE, 502, true);
    }
    const data = await res.json();
    const cand = data.candidates?.[0];
    if (!cand) {
      const reason = data.promptFeedback?.blockReason;
      throw new AIError(reason ? "AI không xử lý nội dung hoặc ảnh này. Thử ảnh khác nhé." : "AI không trả về kết quả.", 422);
    }
    if (cand.finishReason === "SAFETY" || cand.finishReason === "PROHIBITED_CONTENT") {
      throw new AIError("AI không xử lý nội dung hoặc ảnh này. Thử ảnh khác nhé.", 422);
    }
    const text = (cand.content?.parts ?? [])
      .filter((p: { thought?: boolean; text?: string }) => !p.thought && typeof p.text === "string")
      .map((p: { text: string }) => p.text)
      .join("");
    return parseJSON<T>(text);
  });
}

/* --------------------------- DeepSeek (dự phòng) --------------------------- */

const DEEPSEEK_BASE = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-flash";

async function deepseekJSON<T>(key: string, messages: ChatMessage[], opts: Opts): Promise<T> {
  return withTimeout(async (signal) => {
    const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        max_tokens: opts.maxTokens ?? 1400,
        temperature: opts.temperature ?? 0.7,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new AIError("AI đang quá tải, thử lại sau ít giây.", 429, true);
      console.error(`DeepSeek ${res.status}:`, text.slice(0, 500));
      throw new AIError(UNAVAILABLE, 502, true);
    }
    const data = await res.json();
    return parseJSON<T>(data.choices?.[0]?.message?.content ?? "");
  });
}

/**
 * Gọi AI và nhận về JSON. Mặc định dùng Gemini; nếu Gemini lỗi phía nhà cung cấp
 * (khóa, quyền truy cập, model, quá tải, mạng) và có DEEPSEEK_API_KEY thì dùng DeepSeek.
 * Đặt AI_FALLBACK=off để tắt dự phòng.
 */
export async function chatJSON<T>(messages: ChatMessage[], opts: Opts = {}): Promise<T> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const deepseekKey = process.env.AI_FALLBACK === "off" ? undefined : process.env.DEEPSEEK_API_KEY;
  if (!geminiKey && !deepseekKey) throw new AIError("Máy chủ chưa cấu hình GEMINI_API_KEY.", 500);

  if (geminiKey) {
    try {
      return await geminiJSON<T>(geminiKey, messages, opts);
    } catch (e) {
      const err = e instanceof AIError ? e : new AIError("Không kết nối được tới dịch vụ AI.", 502, true);
      if (!deepseekKey || !err.retryable) throw err;
      console.error("Gemini failed, falling back to DeepSeek");
    }
  }
  return deepseekJSON<T>(deepseekKey!, messages, opts);
}

/* ------------------------ Ngữ cảnh từ kho tri thức ------------------------ */

export function garmentContext(g: Garment) {
  return [
    `## ${g.name} (${g.era})`,
    g.summary,
    "Nguồn gốc:",
    ...g.origin.map((f) => `- ${f.text} [${CONFIDENCE_LABEL[f.confidence]}]`),
    "Ý nghĩa:",
    ...g.meaning.map((f) => `- ${f.text} [${CONFIDENCE_LABEL[f.confidence]}]`),
    "Cấu tạo: " + g.anatomy.map((a) => `${a.part} (${a.desc})`).join("; "),
    "Phối truyền thống: " + g.traditionalWith.join(", "),
    "Remix phù hợp: " + g.remixOk.join("; "),
    "Remix cần cân nhắc: " + g.remixCareful.join("; "),
    "Nguồn tham khảo: " + g.sources.map((s) => SOURCES[s].title).join("; "),
  ].join("\n");
}

export function lookToText(look: LookConfig) {
  const g = garmentById(look.garment);
  return [
    `Trang phục: ${g.name}${look.garment === "ao-dai" ? ` (${names.length(look.length)})` : ""}`,
    `Sự kiện: ${look.event ? eventById(look.event).name : "chưa chọn"}`,
    `Vùng miền: ${look.region ? names.region(look.region) : "chưa chọn"}`,
    `Phong cách: ${names.style(look.style)}`,
    `Màu áo: ${colorById(look.main).name}; màu quần/váy: ${colorById(look.secondary).name}; màu phụ kiện: ${colorById(look.accent).name}`,
    `Hoa văn: ${names.pattern(look.pattern)}; chất liệu: ${names.fabric(look.fabric)}`,
    `Phần dưới: ${names.bottom(look.bottom)}; áo khoác: ${names.outer(look.outer)}`,
    `Đội đầu: ${names.head(look.head)}; giày dép: ${names.feet(look.feet)}`,
    `Phụ kiện: ${look.extras.map(names.extra).join(", ") || "không"}`,
  ].join("\n");
}

export const ALLOWED_VALUES = {
  garment: GARMENTS.map((g) => g.id),
  event: EVENTS.map((e) => e.id),
  color: COLORS.map((c) => `${c.id} (${c.name})`),
  pattern: PATTERNS.map((p) => p.id),
  head: HEADS.map((h) => h.id),
  feet: FEET.map((f) => f.id),
  extras: EXTRAS.map((x) => x.id),
  style: STYLES.map((s) => s.id),
  bottom: ["quan-lua", "vay-dai", "jeans", "chan-vay-midi"],
  outer: ["none", "blazer", "denim", "cardigan"],
  fabric: ["lua", "gam", "dui", "voan", "nhung"],
  length: ["dai", "qua-goi", "ngan"],
};

export const GUARDRAILS = `Nguyên tắc bắt buộc:
- Chỉ khẳng định các thông tin lịch sử, văn hóa có trong KHO TRI THỨC được cung cấp. Không bịa năm tháng, nhân vật, truyền thuyết hay số liệu.
- Nếu một ý thuộc "cách hiểu dân gian" hoặc "còn nhiều giả thuyết", phải nói rõ như vậy.
- Không bao giờ mâu thuẫn với các CẢNH BÁO VĂN HÓA đã được hệ thống kiểm tra; hãy giải thích nhẹ nhàng và gợi ý cách sửa.
- Không nhận xét về cân nặng, vóc dáng, ngoại hình cơ thể hay đoán tuổi, dân tộc, tôn giáo của người trong ảnh.
- Giọng văn: tiếng Việt tự nhiên, thân thiện với học sinh sinh viên, ngắn gọn, không sáo rỗng, không dùng emoji.`;

/** Kiểm tra và lọc patch AI đề xuất để chỉ còn giá trị hợp lệ. */
export function sanitizePatch(patch: unknown): Partial<LookConfig> {
  if (!patch || typeof patch !== "object") return {};
  const p = patch as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  const colorIds = COLORS.map((c) => c.id) as string[];
  const one = (key: string, allowed: string[]) => {
    if (typeof p[key] === "string" && allowed.includes(p[key] as string)) out[key] = p[key];
  };
  one("garment", ALLOWED_VALUES.garment);
  one("pattern", ALLOWED_VALUES.pattern);
  one("head", ALLOWED_VALUES.head);
  one("feet", ALLOWED_VALUES.feet);
  one("style", ALLOWED_VALUES.style);
  one("bottom", ALLOWED_VALUES.bottom);
  one("outer", ALLOWED_VALUES.outer);
  one("fabric", ALLOWED_VALUES.fabric);
  one("length", ALLOWED_VALUES.length);
  one("main", colorIds);
  one("secondary", colorIds);
  one("accent", colorIds);
  if (Array.isArray(p.extras)) out.extras = p.extras.filter((x) => typeof x === "string" && ALLOWED_VALUES.extras.includes(x as never));
  return out as Partial<LookConfig>;
}

/* ------------------------------ Giới hạn tần suất ------------------------------ */

const hits = new Map<string, number[]>();

export function rateLimit(ip: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length <= limit;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}
