"use client";

import { useState } from "react";
import { Crown, PencilLine, WandSparkles, X } from "lucide-react";
import Figure from "../Figure";
import { overallScore } from "../LookCard";
import { useApp } from "../Providers";
import { Button, cx } from "../ui";
import { checkCulture } from "@/lib/culture";
import { checkHarmony } from "@/lib/harmony";
import { EVENTS, REMIX_LABEL, colorById, eventById, garmentById, names, type EventId } from "@/lib/kb";
import { EXAMPLE_LOOKS, encodeLook, uid } from "@/lib/look";
import { postJSON, type CompareResult } from "@/lib/ai-types";

export default function Compare() {
  const { compare, toggleCompare, clearCompare, looks } = useApp();
  const [event, setEvent] = useState<EventId | "">("");
  const [ai, setAi] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = compare.map((l) => {
    const cfg = event ? { ...l.config, event } : l.config;
    return { look: l, cfg, report: checkCulture(cfg), harmony: checkHarmony(cfg), score: overallScore(cfg) };
  });
  const bestLocal = rows.length ? rows.reduce((a, b) => (b.score > a.score ? b : a)).look.id : null;

  const askAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const { result } = await postJSON<{ result: CompareResult }>("/api/compare", {
        looks: rows.map((r) => ({ title: r.look.title, config: r.cfg })),
        event: event || undefined,
      });
      setAi(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const available = looks.filter((l) => !compare.some((c) => c.id === l.id));

  return (
    <main className="mx-auto max-w-[1320px] px-2 pb-16 pt-4 sm:px-6 sm:pt-6">
      <div className="paper sheet-shadow rounded-[14px] px-4 py-8 sm:px-10 sm:pl-20 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(32px,4.4vw,54px)] font-extrabold leading-[1] tracking-[-0.03em] text-ink-deep">
              So sánh <span className="hand font-normal text-redpen">phương án</span>
            </h1>
            <p className="mt-2 max-w-[58ch] text-[15.5px] text-muted">
              Đặt tối đa ba bộ phối cạnh nhau, chấm theo cùng một dịp để chọn ra bộ hợp nhất.
            </p>
          </div>
          {compare.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="cmp-event" className="text-[14px] font-semibold text-ink-deep">
                Chấm theo dịp
              </label>
              <select
                id="cmp-event"
                value={event}
                onChange={(e) => {
                  setEvent(e.target.value as EventId | "");
                  setAi(null);
                }}
                className="h-10 rounded-[10px] border-[1.5px] border-grid bg-white px-2 text-[15px]"
              >
                <option value="">Theo dịp của từng bộ</option>
                {EVENTS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                Xóa khay
              </Button>
            </div>
          )}
        </div>

        {compare.length === 0 ? (
          <div className="mt-8">
            <p className="hand text-[28px] text-ink">Khay so sánh đang trống.</p>
            <p className="mt-1 max-w-[52ch] text-[15.5px] text-muted">
              Trong vở phối đồ, bấm So sánh để đưa bộ phối hiện tại vào đây. Hoặc thử ngay với các bộ mẫu.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  EXAMPLE_LOOKS.forEach((ex) =>
                    toggleCompare({ id: uid(), title: ex.title, config: ex.config, createdAt: new Date().toISOString(), source: "local" }),
                  )
                }
              >
                So sánh 3 bộ mẫu
              </Button>
              <Button variant="outline" href="/phoi-do">
                Mở vở phối đồ
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={cx("mt-8 grid gap-4", compare.length === 1 ? "md:grid-cols-2" : compare.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
              {rows.map((r, i) => {
                const g = garmentById(r.cfg.garment);
                const isBest = ai ? ai.best === i + 1 : r.look.id === bestLocal && compare.length > 1;
                return (
                  <article
                    key={r.look.id}
                    className={cx(
                      "relative flex flex-col rounded-[16px] bg-white p-4",
                      isBest ? "ring-[2.5px] ring-redpen" : "ring-1 ring-grid",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCompare(r.look)}
                      className="absolute right-2 top-2 grid size-9 place-items-center rounded-full text-muted hover:bg-ink-soft hover:text-ink"
                      aria-label={`Bỏ ${r.look.title} khỏi so sánh`}
                    >
                      <X className="size-4" />
                    </button>
                    {isBest && (
                      <span className="hand absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-redpen px-2.5 text-[17px] text-white">
                        <Crown className="size-4" aria-hidden /> {ai ? "AI chọn" : "Điểm cao nhất"}
                      </span>
                    )}
                    <h2 className="hand pr-8 text-[25px] leading-tight text-ink">{r.look.title}</h2>
                    <p className="text-[13.5px] font-semibold text-muted">
                      {g.name} · {r.cfg.event ? eventById(r.cfg.event).name : "Tự do"}
                    </p>
                    <div className="paper-plain mt-3 rounded-[10px]">
                      <Figure
                        look={r.cfg}
                        marks={r.report.issues.map((iss, n) => ({ zone: iss.zone, level: iss.level, n: n + 1 }))}
                        className="mx-auto h-[340px] w-full"
                        title={r.look.title}
                      />
                    </div>
                    <dl className="mt-3 divide-y divide-dashed divide-ink/20 text-[14.5px]">
                      {[
                        ["Điểm chung", <span key="s" className="hand text-[24px] leading-none text-redpen">{r.score}</span>],
                        ["Văn hóa", `${r.report.score}/100`],
                        ["Hài hòa màu", `${r.harmony.score}/100 · ${r.harmony.scheme}`],
                        ["Mức remix", REMIX_LABEL[r.report.remixLevel]],
                        [
                          "Màu",
                          <span key="c" className="flex gap-1">
                            {[r.cfg.main, r.cfg.secondary, r.cfg.accent].map((c, ci) => (
                              <span key={ci} title={colorById(c).name} className="pinked block size-5" style={{ background: colorById(c).hex }} />
                            ))}
                          </span>,
                        ],
                        ["Phụ kiện", [names.head(r.cfg.head), names.feet(r.cfg.feet)].join(", ")],
                      ].map(([k, v]) => (
                        <div key={String(k)} className="flex items-center justify-between gap-3 py-1.5">
                          <dt className="font-semibold text-muted">{k}</dt>
                          <dd className="text-right text-text">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {r.report.issues.length > 0 && (
                      <ul className="mt-2 space-y-1 text-[13.5px]">
                        {r.report.issues.slice(0, 3).map((iss, n) => (
                          <li key={iss.id} className={iss.level === "note" ? "text-ink" : "text-redpen"}>
                            {n + 1}. {iss.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    {ai?.looks[i] && (
                      <div className="mt-3 space-y-1 rounded-[10px] bg-ink-soft px-3 py-2 text-[14px]">
                        <p>
                          <span className="font-bold text-ink-deep">Điểm mạnh: </span>
                          {ai.looks[i].strength}
                        </p>
                        <p>
                          <span className="font-bold text-redpen">Lưu ý: </span>
                          {ai.looks[i].watch}
                        </p>
                      </div>
                    )}
                    <Button size="sm" variant="outline" href={`/phoi-do?l=${encodeLook(r.cfg, r.look.title)}`} className="mt-auto self-start">
                      <PencilLine className="size-4" aria-hidden /> Sửa bộ này
                    </Button>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="red" onClick={askAI} loading={loading} disabled={compare.length < 2}>
                {!loading && <WandSparkles className="size-4" aria-hidden />} Nhờ AI chọn giúp
              </Button>
              {compare.length < 2 && <span className="text-[14px] text-muted">Cần ít nhất 2 bộ phối.</span>}
              {error && (
                <span role="alert" className="text-[14px] text-redpen">
                  {error}
                </span>
              )}
            </div>
            {ai && <p className="hand fade-up mt-4 max-w-[70ch] text-[22px] leading-snug text-redpen">{ai.verdict}</p>}
          </>
        )}

        {available.length > 0 && compare.length < 3 && (
          <section className="mt-10 border-t border-dashed border-ink/30 pt-6">
            <h2 className="text-[18px] font-extrabold text-ink-deep">Thêm từ lookbook của bạn</h2>
            <ul className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {available.map((l) => (
                <li key={l.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleCompare(l)}
                    className="flex w-36 flex-col items-center rounded-[12px] border-[1.5px] border-grid bg-white p-2 hover:border-ink"
                  >
                    <Figure look={l.config} className="h-32 w-full" title={l.title} />
                    <span className="line-clamp-2 text-center text-[13px] font-semibold text-ink-deep">{l.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
