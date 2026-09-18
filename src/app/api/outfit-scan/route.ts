import { NextResponse } from "next/server";
import { AIError, GUARDRAILS, chatJSON, rateLimit } from "@/lib/ai";
import type { ScanResult } from "@/lib/ai-types";
import { nearestColor } from "@/lib/harmony";
import {
  BOTTOMS,
  EVENTS,
  EXTRAS,
  FABRICS,
  FEET,
  GARMENTS,
  HEADS,
  LENGTHS,
  OUTERS,
  PATTERNS,
  type EventId,
  type GarmentId,
} from "@/lib/kb";
import { DEFAULT_LOOK, withGarment, type LookConfig } from "@/lib/look";
import { userFromRequest } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_LEN = 6_000_000;
type Level = "cao" | "vua" | "thap";

type Raw = {
  hasPerson?: boolean;
  isTraditional?: boolean;
  garment?: string | null;
  length?: string;
  pattern?: string;
  fabric?: string;
  bottom?: string;
  outer?: string;
  head?: string;
  feet?: string | null;
  extras?: string[];
  colors?: { main?: string; secondary?: string; accent?: string };
  confidence?: { garment?: string; colors?: string; accessories?: string };
  notVisible?: string[];
  observations?: string[];
  critique?: { summary?: string; strengths?: string[]; improvements?: string[] };
};

const pick = <T extends string>(v: unknown, allowed: readonly { id: T }[], fallback: T): T =>
  allowed.some((a) => a.id === v) ? (v as T) : fallback;

const level = (v: unknown): Level => (v === "cao" || v === "vua" || v === "thap" ? v : "vua");

const strings = (v: unknown, max: number) => (Array.isArray(v) ? v.map(String).filter(Boolean).slice(0, max) : []);

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập để dùng tính năng chấm outfit." }, { status: 401 });
  if (!rateLimit(`scan:${user.id}`, 6)) {
    return NextResponse.json({ error: "Bạn chấm hơi nhanh, đợi một phút rồi thử lại nhé." }, { status: 429 });
  }

  let body: { image?: string; event?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }
  const image = body.image ?? "";
  if (!/^data:image\/(png|jpe?g|webp);base64,/.test(image)) {
    return NextResponse.json({ error: "Chỉ nhận ảnh PNG, JPG hoặc WEBP." }, { status: 400 });
  }
  if (image.length > MAX_LEN) return NextResponse.json({ error: "Ảnh quá lớn, hãy chọn ảnh dưới 4MB." }, { status: 413 });
  const ev = EVENTS.find((e) => e.id === body.event);

  const list = <T extends { id: string; name: string }>(items: T[]) => items.map((i) => `${i.id} (${i.name})`).join(", ");

  const system = `Bạn là chuyên gia nhận diện trang phục truyền thống Việt Nam. Nhiệm vụ: nhìn ảnh outfit và mô tả nó bằng đúng các giá trị có trong hệ thống, sau đó nhận xét.
${GUARDRAILS}
- Chỉ mô tả trang phục, màu, phụ kiện nhìn thấy. Không nhận xét khuôn mặt, vóc dáng, cơ thể.
- Nếu một phần không nhìn thấy (ví dụ giày bị che), ghi vào notVisible và chọn giá trị phổ biến nhất cho loại áo đó.
- Đồ cầm tay để chụp ảnh (hoa, quạt, đèn lồng) và bối cảnh không phải phụ kiện; không lấy màu của chúng. Nếu không có khăn, nón, thắt lưng hay phụ kiện màu nổi bật, dùng màu viền hoặc màu thứ hai của áo cho accent.
- Gợi ý cải thiện phải khớp với loại áo: khăn đóng đi cùng áo ngũ thân, áo tấc; khăn mỏ quạ, nón quai thao đi cùng áo tứ thân; khăn mấn thường dành cho cô dâu.
- Nếu ảnh không có người mặc trang phục, đặt hasPerson=false.
- Nếu người trong ảnh không mặc Việt phục, đặt isTraditional=false và chọn loại áo gần nhất về dáng.

Cách phân biệt loại áo:
${GARMENTS.map((g) => `- ${g.id}: ${g.name}. ${g.tagline}. ${g.anatomy.map((a) => `${a.part}: ${a.desc}`).join(" ")}`).join("\n")}

Giá trị hợp lệ:
- garment: ${list(GARMENTS)}
- length (chỉ áo dài): ${list(LENGTHS)}
- pattern: ${list(PATTERNS)}
- fabric: ${list(FABRICS)}
- bottom: ${list(BOTTOMS)}
- outer: ${list(OUTERS)}
- head: ${list(HEADS)}
- feet: ${list(FEET)}
- extras: ${list(EXTRAS)}

Trả về JSON:
{
  "hasPerson": true,
  "isTraditional": true,
  "garment": "id",
  "length": "id",
  "pattern": "id",
  "fabric": "id",
  "bottom": "id",
  "outer": "id",
  "head": "id",
  "feet": "id",
  "extras": ["id"],
  "colors": {"main": "#rrggbb màu chủ đạo của áo", "secondary": "#rrggbb màu quần hoặc váy", "accent": "#rrggbb màu khăn, nón, thắt lưng hoặc phụ kiện nổi bật nhất"},
  "confidence": {"garment": "cao|vua|thap", "colors": "cao|vua|thap", "accessories": "cao|vua|thap"},
  "notVisible": ["phần không thấy rõ, tiếng Việt"],
  "observations": ["2-4 chi tiết bạn thấy trong ảnh giúp nhận diện, tiếng Việt"],
  "critique": {
    "summary": "lời phê 2-3 câu về outfit${ev ? ` cho dịp ${ev.name.toLowerCase()}` : ""}",
    "strengths": ["1-3 điểm mạnh"],
    "improvements": ["1-3 gợi ý cải thiện cụ thể, tôn trọng văn hóa"]
  }
}`;

  try {
    const raw = await chatJSON<Raw>(
      [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: `Nhận diện và chấm outfit trong ảnh${ev ? `, mình định mặc đi ${ev.name.toLowerCase()}` : ""}.` },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      { maxTokens: 1200, temperature: 0.2 },
    );

    const garment = pick<GarmentId>(raw.garment, GARMENTS, "ao-dai");
    const base = withGarment({ ...DEFAULT_LOOK, event: (ev?.id ?? null) as EventId | null, region: null, style: "thanh-lich" }, garment);
    const main = nearestColor(raw.colors?.main) ?? base.main;
    const secondary = nearestColor(raw.colors?.secondary) ?? base.secondary;
    const accent = nearestColor(raw.colors?.accent) ?? base.accent;

    const config: LookConfig = {
      ...base,
      garment,
      main,
      secondary,
      accent,
      length: garment === "ao-dai" ? pick(raw.length, LENGTHS, "dai") : "dai",
      pattern: pick(raw.pattern, PATTERNS, "tron"),
      fabric: pick(raw.fabric, FABRICS, base.fabric),
      bottom: pick(raw.bottom, BOTTOMS, base.bottom),
      outer: pick(raw.outer, OUTERS, "none"),
      head: pick(raw.head, HEADS, "none"),
      feet: pick(raw.feet, FEET, base.feet),
      extras: strings(raw.extras, 7).filter((x): x is LookConfig["extras"][number] => EXTRAS.some((e) => e.id === x)),
    };
    const modern = [config.bottom, config.outer, config.feet, ...config.extras].filter((id) =>
      [...BOTTOMS, ...OUTERS, ...FEET, ...EXTRAS].some((i) => i.id === id && "modern" in i && i.modern),
    ).length;
    config.style = modern >= 2 ? "street" : modern === 1 ? "thanh-lich" : "chuan";

    const result: ScanResult = {
      hasPerson: raw.hasPerson !== false,
      isTraditional: raw.isTraditional !== false,
      config,
      detectedHex: {
        main: /^#[0-9a-f]{6}$/i.test(raw.colors?.main ?? "") ? raw.colors!.main! : null,
        secondary: /^#[0-9a-f]{6}$/i.test(raw.colors?.secondary ?? "") ? raw.colors!.secondary! : null,
        accent: /^#[0-9a-f]{6}$/i.test(raw.colors?.accent ?? "") ? raw.colors!.accent! : null,
      },
      confidence: {
        garment: level(raw.confidence?.garment),
        colors: level(raw.confidence?.colors),
        accessories: level(raw.confidence?.accessories),
      },
      notVisible: strings(raw.notVisible, 5),
      observations: strings(raw.observations, 5),
      critique: {
        summary: String(raw.critique?.summary ?? ""),
        strengths: strings(raw.critique?.strengths, 3),
        improvements: strings(raw.critique?.improvements, 3),
      },
    };
    return NextResponse.json({ result });
  } catch (e) {
    const err = e instanceof AIError ? e : new AIError("Lỗi không xác định");
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
