"use client";

import { Check, Copy, WandSparkles } from "lucide-react";
import { Button, inputCls } from "../ui";
import type { LookConfig, StylistResult } from "@/lib/look";

export default function AIReview({
  ai,
  loading,
  error,
  note,
  onNote,
  onAsk,
  onApply,
  onCopied,
}: {
  ai: StylistResult | null;
  loading: boolean;
  error: string | null;
  note: string;
  onNote: (v: string) => void;
  onAsk: () => void;
  onApply: (patch: Partial<LookConfig>) => void;
  onCopied: () => void;
}) {
  return (
    <div>
      <label htmlFor="note" className="mb-1 block text-[14px] font-semibold text-ink-deep">
        Mong muốn thêm (không bắt buộc)
      </label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => onNote(e.target.value)}
        maxLength={300}
        rows={2}
        placeholder="Ví dụ: chụp ảnh nhóm 5 bạn, muốn nổi bật nhưng không quá lố"
        className={inputCls}
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button variant="red" onClick={onAsk} loading={loading}>
          {!loading && <WandSparkles className="size-4" aria-hidden />} {ai ? "Phê lại bộ hiện tại" : "Nhờ AI phê chi tiết"}
        </Button>
        <span className="text-[13px] text-muted">AI chỉ dùng kho tri thức có nguồn của ứng dụng.</span>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[14px] text-redpen">
          {error}
        </p>
      )}
      {loading && !ai && <p className="hand mt-3 text-[20px] text-redpen">Cô đang chấm bài...</p>}
      {ai && (
        <div className="fade-up mt-4 rounded-[14px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,.08),0_14px_30px_-20px_rgba(33,23,102,.6)] sm:p-5">
          <p className="hand text-[30px] leading-tight text-ink">{ai.title}</p>
          {ai.vibe && <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">{ai.vibe}</p>}
          {ai.whyItWorks.length > 0 && (
            <>
              <h4 className="mt-4 text-[14px] font-extrabold text-ink-deep">Vì sao hợp</h4>
              <ul className="mt-1 space-y-1 text-[14.5px]">
                {ai.whyItWorks.map((w) => (
                  <li key={w} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </>
          )}
          {ai.culturalNote && (
            <p className="mt-3 rounded-[10px] bg-ink-soft px-3 py-2 text-[14.5px] text-ink-deep">
              <span className="font-bold">Góc văn hóa: </span>
              {ai.culturalNote}
            </p>
          )}
          {ai.tips.length > 0 && (
            <>
              <h4 className="mt-4 text-[14px] font-extrabold text-ink-deep">Mẹo nhỏ</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-[14.5px] marker:text-ink">
                {ai.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}
          {ai.suggestions.length > 0 && (
            <>
              <h4 className="mt-4 text-[14px] font-extrabold text-ink-deep">Thử sửa nhanh</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {ai.suggestions.map((s) => (
                  <Button key={s.label} size="sm" variant="outline" onClick={() => onApply(s.patch)}>
                    {s.label}
                  </Button>
                ))}
              </div>
            </>
          )}
          {ai.caption && (
            <div className="mt-4 flex items-start gap-2 border-t border-dashed border-grid pt-3">
              <p className="hand flex-1 text-[19px] text-ink">“{ai.caption}”</p>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(ai.caption).then(onCopied)}
                className="grid size-10 place-items-center rounded-full text-ink hover:bg-ink-soft"
                aria-label="Chép caption"
              >
                <Copy className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
