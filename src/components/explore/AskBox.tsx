"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { postJSON, type AskResult } from "@/lib/ai-types";
import { garmentById, type GarmentId } from "@/lib/kb";
import { Button, inputCls } from "../ui";

const CONF = {
  cao: "Dựa trên tư liệu trong sổ tay",
  vua: "Có phần là cách hiểu phổ biến",
  thap: "Chưa có dữ liệu kiểm chứng",
} as const;

const SAMPLES: Record<string, string[]> = {
  default: ["Áo ngũ thân khác áo dài thế nào?", "Đi đám cưới có nên mặc áo dài đỏ?", "Vì sao gọi là áo tứ thân?"],
};

export default function AskBox({ garment }: { garment?: GarmentId }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<AskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async (question = q) => {
    if (question.trim().length < 4) return setError("Bạn viết câu hỏi rõ hơn một chút nhé.");
    setQ(question);
    setLoading(true);
    setError(null);
    try {
      const { result } = await postJSON<{ result: AskResult }>("/api/ask", { question, garment });
      setRes(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const samples = garment
    ? [`${garmentById(garment).name} hợp mặc dịp nào?`, `Remix ${garmentById(garment).name.toLowerCase()} thế nào cho đúng?`]
    : SAMPLES.default;

  return (
    <div className="rounded-[14px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,.08),0_14px_30px_-22px_rgba(33,23,102,.7)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask();
        }}
      >
        <label htmlFor={`ask-${garment ?? "all"}`} className="hand block text-[22px] leading-tight text-ink">
          Hỏi cô giáo văn hóa
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id={`ask-${garment ?? "all"}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={400}
            placeholder="Ví dụ: khăn vấn và khăn đóng khác nhau ra sao?"
            className={inputCls}
          />
          <Button type="submit" loading={loading} aria-label="Gửi câu hỏi" className="w-12 shrink-0 px-0">
            {!loading && <Send className="size-4" aria-hidden />}
          </Button>
        </div>
      </form>
      {!res && !loading && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {samples.map((s) => (
            <button key={s} type="button" onClick={() => ask(s)} className="rounded-full bg-ink-soft px-2.5 py-1 text-[13px] font-medium text-ink-deep hover:bg-grid">
              {s}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-[14px] text-redpen">
          {error}
        </p>
      )}
      {res && (
        <div className="fade-up mt-3 border-t border-dashed border-grid pt-3" aria-live="polite">
          <p className="text-[15px] leading-relaxed text-text">{res.answer}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
            <span className={res.confidence === "thap" ? "font-semibold text-redpen" : "font-semibold text-ink"}>{CONF[res.confidence]}</span>
            {res.related.map((id) => (
              <Link key={id} href={`/kham-pha/${id}`} className="font-semibold text-ink underline underline-offset-2">
                {garmentById(id).name}
              </Link>
            ))}
            <Link href="/cam-ket#bao-sai" className="ml-auto text-muted underline">
              Thấy sai? Báo cho ban biên tập
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
