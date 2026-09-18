import { NextResponse } from "next/server";
import { AIError, GUARDRAILS, chatJSON, clientIp, lookToText, rateLimit } from "@/lib/ai";
import type { CompareResult } from "@/lib/ai-types";
import { checkCulture, reportToText } from "@/lib/culture";
import { checkHarmony } from "@/lib/harmony";
import { EVENTS } from "@/lib/kb";
import { DEFAULT_LOOK, type LookConfig } from "@/lib/look";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req), 10)) return NextResponse.json({ error: "Đợi một phút rồi thử lại nhé." }, { status: 429 });
  let body: { looks?: { title: string; config: LookConfig }[]; event?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }
  const looks = (body.looks ?? [])
    .slice(0, 3)
    .map((l) => ({ title: String(l.title).slice(0, 80), config: { ...DEFAULT_LOOK, ...l.config } }));
  if (looks.length < 2) return NextResponse.json({ error: "Cần ít nhất 2 bộ phối để so sánh." }, { status: 400 });
  const ev = EVENTS.find((e) => e.id === body.event);

  const described = looks
    .map((l, i) => {
      const r = checkCulture(l.config);
      const h = checkHarmony(l.config);
      return `### Phương án ${i + 1}: ${l.title}\n${lookToText(l.config)}\nĐiểm văn hóa ${r.score}/100, hài hòa màu ${h.score}/100 (${h.scheme})\nCảnh báo:\n${reportToText(r)}`;
    })
    .join("\n\n");

  const system = `Bạn là stylist Việt phục giúp người dùng chọn giữa các phương án phối đồ.
${GUARDRAILS}
Trả về JSON: {"best": số thứ tự phương án nên chọn (bắt đầu từ 1), "verdict": "2-3 câu giải thích lựa chọn", "looks": [{"strength": "điểm mạnh 1 câu", "watch": "điều cần lưu ý 1 câu"}] theo đúng thứ tự phương án}`;

  try {
    const raw = await chatJSON<CompareResult>(
      [
        { role: "system", content: system },
        { role: "user", content: `${ev ? `Dịp: ${ev.name}. ${ev.tip}\n\n` : ""}${described}` },
      ],
      { maxTokens: 700, temperature: 0.4 },
    );
    const best = Math.min(looks.length, Math.max(1, Number(raw.best) || 1));
    const result: CompareResult = {
      best,
      verdict: String(raw.verdict ?? ""),
      looks: looks.map((_, i) => ({
        strength: String(raw.looks?.[i]?.strength ?? ""),
        watch: String(raw.looks?.[i]?.watch ?? ""),
      })),
    };
    return NextResponse.json({ result });
  } catch (e) {
    const err = e instanceof AIError ? e : new AIError("Lỗi không xác định");
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
