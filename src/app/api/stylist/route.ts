import { NextResponse } from "next/server";
import { AIError, ALLOWED_VALUES, GUARDRAILS, chatJSON, clientIp, garmentContext, lookToText, rateLimit, sanitizePatch } from "@/lib/ai";
import { checkCulture, reportToText } from "@/lib/culture";
import { checkHarmony } from "@/lib/harmony";
import { eventById, garmentById } from "@/lib/kb";
import { DEFAULT_LOOK, type LookConfig, type StylistResult } from "@/lib/look";
import type { WeatherNow } from "@/lib/weather";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req))) return NextResponse.json({ error: "Bạn thao tác hơi nhanh, đợi một phút nhé." }, { status: 429 });

  let body: { look?: LookConfig; weather?: WeatherNow | null; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }
  const look: LookConfig = { ...DEFAULT_LOOK, ...(body.look ?? {}) };
  const note = (body.note ?? "").slice(0, 300);
  const report = checkCulture(look, body.weather ?? null);
  const harmony = checkHarmony(look);
  const ev = look.event ? eventById(look.event) : null;

  const system = `Bạn là "cô giáo Việt phục": stylist am hiểu trang phục truyền thống Việt Nam, giúp học sinh sinh viên phối đồ vừa hiện đại vừa tôn trọng văn hóa.
${GUARDRAILS}

Trả về đúng một JSON object với các khóa:
{
  "title": "tên bộ phối ngắn, sáng tạo, tối đa 6 từ",
  "vibe": "3-5 từ mô tả tinh thần",
  "summary": "lời phê 2-3 câu, nói thẳng điểm mạnh và điều cần sửa",
  "whyItWorks": ["2-3 ý vì sao bộ phối hợp dịp, mỗi ý 1 câu"],
  "culturalNote": "1-2 câu kiến thức văn hóa liên quan, lấy từ kho tri thức, nêu rõ nếu là cách hiểu dân gian",
  "tips": ["2-3 mẹo thực tế: chất liệu, tạo dáng chụp ảnh, di chuyển, bảo quản"],
  "caption": "một caption mạng xã hội ngắn bằng tiếng Việt cho bộ ảnh, có thể dí dỏm, không emoji",
  "suggestions": [{"label": "tên thao tác ngắn, ví dụ 'Đổi khăn sang xanh ngọc'", "patch": {"khóa": "giá trị"}}]
}
suggestions: 0-3 phương án chỉnh sửa. patch chỉ dùng các khóa và giá trị sau:
${JSON.stringify(ALLOWED_VALUES)}
Màu (main = áo, secondary = quần/váy, accent = phụ kiện và khăn) dùng id trước ngoặc. extras là mảng đầy đủ sau khi sửa.`;

  const user = `BỘ PHỐI:
${lookToText(look)}
${note ? `Mong muốn thêm của người dùng: ${note}` : ""}
${body.weather ? `Thời tiết: ${body.weather.city} ${Math.round(body.weather.temp)}°C, ${body.weather.label}, khả năng mưa ${body.weather.rainChance}%` : ""}

CẢNH BÁO VĂN HÓA (hệ thống đã kiểm tra, điểm ${report.score}/100, mức remix ${report.remixLevel}/2):
${reportToText(report)}

HÀI HÒA MÀU: ${harmony.scheme}, ${harmony.score}/100. ${harmony.notes.join(" ")}

KHO TRI THỨC:
${garmentContext(garmentById(look.garment))}
${ev ? `## Dịp ${ev.name}\n${ev.tip}` : ""}`;

  try {
    const raw = await chatJSON<StylistResult>(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { maxTokens: 1200 },
    );
    const result: StylistResult = {
      title: String(raw.title ?? "Bộ phối của bạn").slice(0, 60),
      vibe: String(raw.vibe ?? "").slice(0, 60),
      summary: String(raw.summary ?? ""),
      whyItWorks: Array.isArray(raw.whyItWorks) ? raw.whyItWorks.map(String).slice(0, 4) : [],
      culturalNote: String(raw.culturalNote ?? ""),
      tips: Array.isArray(raw.tips) ? raw.tips.map(String).slice(0, 4) : [],
      caption: String(raw.caption ?? ""),
      suggestions: Array.isArray(raw.suggestions)
        ? raw.suggestions
            .map((s) => ({ label: String(s?.label ?? "").slice(0, 60), patch: sanitizePatch(s?.patch) }))
            .filter((s) => s.label && Object.keys(s.patch).length)
            .slice(0, 3)
        : [],
    };
    return NextResponse.json({ result, report, harmony });
  } catch (e) {
    const err = e instanceof AIError ? e : new AIError("Lỗi không xác định");
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
