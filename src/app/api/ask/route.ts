import { NextResponse } from "next/server";
import { AIError, GUARDRAILS, chatJSON, clientIp, garmentContext, rateLimit } from "@/lib/ai";
import type { AskResult } from "@/lib/ai-types";
import { COLORS, EVENTS, EXTRAS, GARMENTS, HEADS, PATTERNS, type GarmentId } from "@/lib/kb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req), 15)) return NextResponse.json({ error: "Bạn hỏi hơi nhanh, đợi một phút nhé." }, { status: 429 });
  let body: { question?: string; garment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }
  const question = (body.question ?? "").trim().slice(0, 400);
  if (question.length < 4) return NextResponse.json({ error: "Câu hỏi hơi ngắn, bạn viết rõ hơn nhé." }, { status: 400 });

  const focus = GARMENTS.find((g) => g.id === body.garment);
  const kb = [
    ...(focus ? [garmentContext(focus)] : []),
    ...GARMENTS.filter((g) => g !== focus).map(garmentContext),
    "## Phụ kiện",
    ...[...HEADS, ...EXTRAS].filter((x) => x.info).map((x) => `- ${x.name}: ${x.info}`),
    "## Màu sắc",
    ...COLORS.map((c) => `- ${c.name}: ${c.meaning}`),
    "## Hoa văn",
    ...PATTERNS.map((p) => `- ${p.name}: ${p.meaning} ${p.note ?? ""}`),
    "## Dịp",
    ...EVENTS.map((e) => `- ${e.name}: ${e.tip}`),
  ].join("\n");

  const system = `Bạn trả lời câu hỏi về trang phục truyền thống Việt Nam cho học sinh sinh viên, CHỈ dựa trên KHO TRI THỨC dưới đây.
${GUARDRAILS}
- Nếu kho tri thức không có thông tin để trả lời, nói thẳng là chưa có dữ liệu đã kiểm chứng, gợi ý nguồn tìm hiểu (bảo tàng, sách trong kho tri thức), đặt confidence="thap".
- Nếu câu hỏi không liên quan đến trang phục, văn hóa Việt Nam, đặt inScope=false và từ chối lịch sự.
- Trả lời tối đa 120 từ.

Trả về JSON: {"answer": "...", "confidence": "cao|vua|thap", "inScope": true, "related": ["id áo liên quan trong ${GARMENTS.map((g) => g.id).join(", ")}"]}

KHO TRI THỨC:
${kb}`;

  try {
    const raw = await chatJSON<AskResult>(
      [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
      { maxTokens: 600, temperature: 0.3 },
    );
    const result: AskResult = {
      answer: String(raw.answer ?? ""),
      confidence: (["cao", "vua", "thap"] as const).includes(raw.confidence) ? raw.confidence : "vua",
      inScope: raw.inScope !== false,
      related: (Array.isArray(raw.related) ? raw.related : []).filter((id): id is GarmentId => GARMENTS.some((g) => g.id === id)),
    };
    return NextResponse.json({ result });
  } catch (e) {
    const err = e instanceof AIError ? e : new AIError("Lỗi không xác định");
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
