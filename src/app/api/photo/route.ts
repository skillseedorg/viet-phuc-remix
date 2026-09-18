import { NextResponse } from "next/server";
import { AIError, ALLOWED_VALUES, GUARDRAILS, chatJSON, clientIp, rateLimit, sanitizePatch } from "@/lib/ai";
import { COLORS, EVENTS, GARMENTS, type ColorId } from "@/lib/kb";
import type { PhotoResult } from "@/lib/ai-types";

export const runtime = "nodejs";

const MAX_LEN = 6_000_000;

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req), 8)) return NextResponse.json({ error: "Bạn gửi ảnh hơi nhanh, đợi một phút nhé." }, { status: 429 });

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

  const system = `Bạn là stylist Việt phục. Người dùng gửi một ảnh (thường là ảnh chân dung hoặc ảnh đang mặc đồ) để nhận gợi ý phối Việt phục.
${GUARDRAILS}
- Chỉ quan sát trang phục, màu sắc tổng thể của ảnh, ánh sáng, bối cảnh và phong cách đang mặc. Không đánh giá khuôn mặt, cơ thể.
- Nếu người trong ảnh đang mặc trang phục truyền thống, hãy nhận diện loại áo (nếu chắc chắn) và góp ý tôn trọng về cách phối.
- Nếu ảnh không có người hoặc không phù hợp, đặt hasPerson=false và vẫn gợi ý dựa trên màu sắc bối cảnh.

Trả về JSON:
{
  "hasPerson": true,
  "observations": ["2-3 quan sát ngắn về màu sắc, phong cách, bối cảnh ảnh"],
  "outfit": {"isTraditional": false, "garmentGuess": "một id trong ${GARMENTS.map((g) => g.id).join(", ")} hoặc null", "comments": ["0-3 góp ý nếu đang mặc Việt phục"]},
  "palette": ["3 id màu hợp nhất, lấy từ danh sách"],
  "paletteReason": "1 câu vì sao bảng màu này hợp",
  "recommendation": {"label": "tên gợi ý ngắn", "reason": "1-2 câu", "patch": {"garment": "...", "main": "...", "secondary": "...", "accent": "...", "style": "...", "head": "...", "extras": []}}
}
Danh sách màu: ${COLORS.map((c) => `${c.id} (${c.name} ${c.hex})`).join(", ")}
Giá trị patch hợp lệ: ${JSON.stringify(ALLOWED_VALUES)}`;

  try {
    const raw = await chatJSON<PhotoResult>(
      [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: `Gợi ý Việt phục cho mình${ev ? ` để đi ${ev.name.toLowerCase()}` : ""}.` },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      { maxTokens: 900, temperature: 0.5 },
    );
    const colorIds = COLORS.map((c) => c.id) as string[];
    const guess = raw.outfit?.garmentGuess;
    const result: PhotoResult = {
      hasPerson: Boolean(raw.hasPerson),
      observations: Array.isArray(raw.observations) ? raw.observations.map(String).slice(0, 4) : [],
      outfit: {
        isTraditional: Boolean(raw.outfit?.isTraditional),
        garmentGuess: guess && GARMENTS.some((g) => g.id === guess) ? guess : null,
        comments: Array.isArray(raw.outfit?.comments) ? raw.outfit.comments.map(String).slice(0, 3) : [],
      },
      palette: (Array.isArray(raw.palette) ? raw.palette : [])
        .map((c) => {
          const v = String(c).toLowerCase();
          return COLORS.find((x) => v === x.id || v.startsWith(x.id + " ") || v.includes(x.name.toLowerCase()))?.id;
        })
        .filter((c): c is ColorId => Boolean(c) && colorIds.includes(c!))
        .filter((c, i, arr) => arr.indexOf(c) === i)
        .slice(0, 3),
      paletteReason: String(raw.paletteReason ?? ""),
      recommendation: {
        label: String(raw.recommendation?.label ?? "Gợi ý cho bạn").slice(0, 60),
        reason: String(raw.recommendation?.reason ?? ""),
        patch: sanitizePatch(raw.recommendation?.patch),
      },
    };
    return NextResponse.json({ result });
  } catch (e) {
    const err = e instanceof AIError ? e : new AIError("Lỗi không xác định");
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
