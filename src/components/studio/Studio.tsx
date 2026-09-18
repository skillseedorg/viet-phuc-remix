"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookmarkPlus, Check, ChevronDown, Columns3, Download, Link2, RotateCcw, Shuffle, Undo2 } from "lucide-react";
import Figure from "../Figure";
import LookCard, { overallScore } from "../LookCard";
import PhotoCoach from "./PhotoCoach";
import AIReview from "./AIReview";
import { StepAccessories, StepColor, StepGarment, StepOccasion, type ColorSlot } from "./Steps";
import { useApp } from "../Providers";
import { Button, Choice, InkTick, cx, inputCls } from "../ui";
import { checkCulture, type Issue, type Zone } from "@/lib/culture";
import { checkHarmony } from "@/lib/harmony";
import { EVENTS, REMIX_LABEL, STYLES, eventById, garmentById } from "@/lib/kb";
import { DEFAULT_LOOK, EXAMPLE_LOOKS, HAIRS, SKINS, encodeLook, uid, withGarment, type LookConfig, type StylistResult } from "@/lib/look";
import { local } from "@/lib/store";
import { postJSON } from "@/lib/ai-types";
import type { WeatherNow } from "@/lib/weather";

const LEVEL = {
  note: { label: "Lưu ý", ink: "text-ink", ring: "border-ink/60" },
  warn: { label: "Nên sửa", ink: "text-redpen", ring: "border-redpen" },
  stop: { label: "Cần sửa", ink: "text-redpen", ring: "border-redpen" },
} as const;

const STEPS = [
  { label: "Dịp", title: "Bạn mặc đi đâu?", hint: "Cô sẽ chấm theo độ trang trọng của dịp bạn chọn." },
  { label: "Áo", title: "Chọn loại áo", hint: "Áo có nhãn “hợp dịp” là lựa chọn an toàn nhất." },
  { label: "Màu", title: "Tô màu, chọn hoa văn", hint: "Chọn nhanh một bộ màu, hoặc tự tô từng phần." },
  { label: "Phụ kiện", title: "Phụ kiện và cách phối", hint: "Đồ truyền thống giữ nét chuẩn, đồ hiện đại tạo chất remix." },
  { label: "Hoàn thiện", title: "Nhân vật, lời phê và lưu", hint: "Chỉnh nhân vật cho giống bạn, nhờ AI phê rồi lưu lại." },
] as const;

/** Chạm vào vùng nào trên nhân vật thì mở bước và nhóm tương ứng. */
const ZONE_TARGET: Record<Exclude<Zone, "whole">, { step: number; anchor?: string }> = {
  head: { step: 3, anchor: "nhom-dau" },
  top: { step: 1 },
  bottom: { step: 3, anchor: "nhom-duoi" },
  feet: { step: 3, anchor: "nhom-giay" },
};

function autoComment(look: LookConfig, issues: Issue[], scheme: string) {
  const g = garmentById(look.garment).name.toLowerCase();
  const ev = look.event ? eventById(look.event).name.toLowerCase() : null;
  const serious = issues.filter((i) => i.level !== "note").length;
  if (serious) return `Có ${serious} chỗ cần xem lại, cô đã khoanh đỏ trên hình. Sửa xong là đẹp và đúng tinh thần ${g} hơn nhiều.`;
  if (issues.length) return `Bài ổn rồi! Còn ${issues.length} lưu ý nhỏ để bộ ${g} chỉn chu hơn.`;
  return `Bài làm tốt! Bộ ${g} giữ đúng đặc trưng${ev ? ` và hợp dịp ${ev}` : ""}. Màu sắc: ${scheme.toLowerCase()}.`;
}

export default function Studio({ initial, initialTitle }: { initial?: LookConfig | null; initialTitle?: string }) {
  const { saveLook, toggleCompare, compare, user, cloudStatus } = useApp();
  const [look, setLook] = useState<LookConfig>(initial ?? DEFAULT_LOOK);
  const [history, setHistory] = useState<LookConfig[]>([]);
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [slot, setSlot] = useState<ColorSlot>("main");
  const [anchor, setAnchor] = useState<string | null>(null);
  const [showAllIssues, setShowAllIssues] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [face, setFace] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [note, setNote] = useState("");
  const [ai, setAi] = useState<StylistResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle ?? "");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; href?: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!initial) setLook(local.draft());
    hydrated.current = true;
  }, [initial]);

  useEffect(() => {
    if (hydrated.current) local.setDraft(look);
  }, [look]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Thanh xem trước trên di động hiện khi nhân vật đã cuộn khỏi màn hình
  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sau khi đổi bước từ thao tác chạm nhân vật, cuộn tới đúng nhóm
  useEffect(() => {
    if (!anchor) return;
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setAnchor(null);
  }, [anchor, step]);

  const report = useMemo(() => checkCulture(look, weather), [look, weather]);
  const harmony = useMemo(() => checkHarmony(look), [look]);
  const score = overallScore(look);
  const g = garmentById(look.garment);
  const autoTitle = `${g.name}${look.event ? ` đi ${eventById(look.event).name.toLowerCase()}` : ""}`;
  const finalTitle = (title || ai?.title || autoTitle).slice(0, 80);
  const serious = report.issues.filter((i) => i.level !== "note").length;

  const update = (patch: Partial<LookConfig>) => {
    setHistory((h) => [...h.slice(-19), look]);
    setLook((l) => (patch.garment && patch.garment !== l.garment ? { ...withGarment(l, patch.garment), ...patch } : { ...l, ...patch }));
  };

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      setLook(h[h.length - 1]);
      return h.slice(0, -1);
    });
  };

  const goTo = (n: number, scroll = true) => {
    setStep(n);
    setVisited((v) => new Set(v).add(n));
    if (scroll) {
      const top = stepsRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 64 || top > window.innerHeight * 0.6) stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onZone = (zone: Exclude<Zone, "whole">) => {
    const t = ZONE_TARGET[zone];
    goTo(t.step, !t.anchor);
    if (t.anchor) setAnchor(t.anchor);
  };

  const surprise = () => {
    const ev = look.event ? eventById(look.event) : EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const garment = ev.recommended[Math.floor(Math.random() * ev.recommended.length)];
    const main = ev.goodColors[Math.floor(Math.random() * ev.goodColors.length)];
    const base = withGarment({ ...look, event: ev.id }, garment);
    const accents = checkHarmony({ ...base, main }).betterAccents;
    update({ ...base, main, accent: accents[0] ?? base.accent });
  };

  const askAI = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const data = await postJSON<{ result: StylistResult }>("/api/stylist", { look, weather, note });
      setAi(data.result);
    } catch (e) {
      setAiError((e as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/xem?l=${encodeLook(look, finalTitle)}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: finalTitle, text: ai?.caption ?? "Bộ Việt phục mình vừa phối", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast({ text: "Đã sao chép link chia sẻ bộ phối." });
    } catch {
      setToast({ text: "Không sao chép được, hãy mở trang chia sẻ.", href: url });
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await saveLook({ title: finalTitle, config: look, note, ai, isPublic: Boolean(user) && isPublic });
      setToast({
        text: res.where === "cloud" ? "Đã lưu vào lookbook của bạn." : `Đã lưu trên máy này. ${res.reason ?? ""}`,
        href: "/lookbook",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCompare = () => {
    if (compare.length >= 3) {
      setToast({ text: "Khay so sánh đã đủ 3 bộ. Bỏ bớt một bộ để thêm.", href: "/so-sanh" });
      return;
    }
    toggleCompare({ id: uid(), title: finalTitle, config: look, createdAt: new Date().toISOString(), source: "local", ai });
    setToast({ text: `Đã thêm vào so sánh (${compare.length + 1}/3).`, href: "/so-sanh" });
  };

  const download = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#3a27a3" });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `viet-phuc-remix-${finalTitle.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-")}.png`;
      a.click();
    } catch {
      setToast({ text: "Chưa xuất được ảnh, thử lại hoặc chụp màn hình thẻ nhé." });
    } finally {
      setExporting(false);
    }
  };

  const marks = report.issues.map((i, n) => ({ zone: i.zone, level: i.level, n: n + 1 }));
  const issues = showAllIssues ? report.issues : report.issues.slice(0, 3);
  const current = STEPS[step];

  return (
    <main className="mx-auto max-w-[1320px] px-2 pb-28 pt-4 sm:px-6 sm:pt-6 lg:pb-12">
      {/* ------------------------ Thanh xem trước (di động) ------------------------ */}
      <div
        aria-hidden={!showBar}
        className={cx(
          "fixed inset-x-0 top-16 z-30 px-2 pt-1.5 transition-[opacity,transform] duration-200 lg:hidden",
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <div className="paper-plain sheet-shadow flex items-center gap-2 rounded-[14px] p-1.5 pr-2">
          <button
            type="button"
            tabIndex={showBar ? 0 : -1}
            onClick={() => figureRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            aria-label="Xem lại nhân vật"
          >
            <span className="grid h-16 w-11 shrink-0 place-items-center rounded-[10px] bg-white">
              <Figure look={look} face={face} className="h-15 w-10" title="" />
            </span>
            <span className="hand grid size-11 shrink-0 place-items-center rounded-full border-2 border-redpen text-[22px] leading-none text-redpen">{score}</span>
            <span className="min-w-0 text-[13px] leading-tight">
              <span className="block truncate font-bold text-ink-deep">{g.name}</span>
              <span className={cx("block truncate", serious ? "text-redpen" : "text-muted")}>
                {serious ? `${serious} chỗ cần sửa` : report.issues.length ? `${report.issues.length} lưu ý nhỏ` : "Không lỗi văn hóa"}
              </span>
            </span>
          </button>
          <Button size="sm" onClick={save} loading={saving} tabIndex={showBar ? 0 : -1}>
            {!saving && <BookmarkPlus className="size-4" aria-hidden />} Lưu
          </Button>
        </div>
      </div>

      <div className="sheet-shadow grid overflow-clip rounded-[14px] lg:grid-cols-[minmax(0,5fr)_26px_minmax(0,7fr)]">
        {/* ------------------------------ Trang trái ------------------------------ */}
        <section aria-label="Bộ phối của bạn" className="paper relative min-w-0 px-5 py-5 sm:px-8 lg:pl-16 lg:pr-6">
          <div className="lg:sticky lg:top-20">
            <div className="grid grid-cols-[88px_1fr] border-[1.5px] border-text/70 bg-white/75">
              <div className="border-r-[1.5px] border-text/70">
                <div className="border-b border-text/40 py-1 text-center text-[11.5px] font-bold uppercase tracking-wider text-text">Điểm</div>
                <div className="relative grid h-[72px] place-items-center" aria-label={`Điểm ${score} trên 10`}>
                  <svg key={score} viewBox="0 0 80 64" className="ink-draw absolute inset-1" aria-hidden>
                    <path d="M12,36 Q10,8 40,7 Q72,8 70,32 Q70,58 40,58 Q9,58 14,28" pathLength={1} fill="none" stroke="var(--color-redpen)" strokeWidth={2.4} strokeLinecap="round" />
                  </svg>
                  <span className="hand relative text-[38px] leading-none text-redpen">{score}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="border-b border-text/40 py-1 text-center text-[11.5px] font-bold uppercase tracking-wider text-text">Lời phê của cô giáo</div>
                <p className="hand px-3 pt-1.5 text-[18.5px] leading-[1.22] text-redpen" aria-live="polite">
                  {ai?.summary ?? autoComment(look, report.issues, harmony.scheme)}
                </p>
                <p className="px-3 pb-1.5 pt-1 text-[12px] text-muted">
                  Văn hóa {report.score} · Màu {harmony.score} · {REMIX_LABEL[report.remixLevel]}
                </p>
              </div>
            </div>

            <div ref={figureRef} className="relative mx-auto mt-2 max-w-[380px]">
              <Figure
                look={look}
                face={face}
                marks={marks}
                onZoneClick={onZone}
                className="h-[min(46vh,420px)] w-full lg:h-[min(52vh,500px)]"
                title={`Nhân vật mặc ${g.name}`}
              />
              <div className="absolute right-0 top-1 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!history.length}
                  className="grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-ink-soft disabled:opacity-40"
                  aria-label="Hoàn tác"
                  title="Hoàn tác"
                >
                  <Undo2 className="size-5" />
                </button>
              </div>
              <p className="text-center text-[12.5px] text-muted">Chạm vào đầu, áo, quần hoặc giày để sửa phần đó</p>
            </div>

            {report.issues.length > 0 ? (
              <div className="mt-3">
                <ol className="space-y-2.5" aria-label="Các lời phê">
                  {issues.map((i, n) => (
                    <li key={i.id} className="fade-up grid grid-cols-[30px_1fr] gap-2">
                      <span className={cx("hand grid size-7 place-items-center rounded-full border-2 text-[17px]", LEVEL[i.level].ink, LEVEL[i.level].ring)}>{n + 1}</span>
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-bold leading-snug text-text">
                          <span className={cx("mr-1.5 text-[12px] font-extrabold uppercase tracking-wide", LEVEL[i.level].ink)}>{LEVEL[i.level].label}</span>
                          {i.title}
                        </p>
                        <p className="mt-0.5 text-[14px] leading-snug text-muted">{i.detail}</p>
                        {i.fix && (
                          <button
                            type="button"
                            onClick={() => update(i.fix!.patch)}
                            className={cx(
                              "mt-1.5 inline-flex h-8 items-center gap-1 rounded-full border-[1.5px] px-3 text-[13px] font-bold",
                              i.level === "note" ? "border-ink/50 text-ink hover:bg-ink-soft" : "border-redpen/60 text-redpen hover:bg-redpen-soft",
                            )}
                          >
                            <Check className="size-3.5" aria-hidden /> {i.fix.label}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
                {report.issues.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllIssues((v) => !v)}
                    className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ink underline underline-offset-4"
                    aria-expanded={showAllIssues}
                  >
                    {showAllIssues ? "Thu gọn" : `Xem thêm ${report.issues.length - 3} lời phê`}
                    <ChevronDown className={cx("size-4 transition-transform", showAllIssues && "rotate-180")} aria-hidden />
                  </button>
                )}
              </div>
            ) : (
              <p className="hand mt-3 flex items-center gap-2 text-[20px] text-ink">
                <Check className="size-5" aria-hidden /> Không có lỗi văn hóa nào. Tuyệt!
              </p>
            )}

            <div className="mt-4 space-y-2.5 border-t border-dashed border-ink/30 pt-4">
              <label htmlFor="look-title" className="block text-[13.5px] font-semibold text-ink-deep">
                Tên bộ phối
              </label>
              <input
                id="look-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={ai?.title ?? autoTitle}
                maxLength={80}
                className={`${inputCls} h-11 py-2`}
              />
              {user && cloudStatus === "ready" && (
                <label className="flex items-center gap-2 text-[14px] text-text">
                  <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="size-4 accent-[var(--color-ink)]" />
                  Công khai lên lookbook cộng đồng
                </label>
              )}
              <Button onClick={save} loading={saving} className="w-full">
                {!saving && <BookmarkPlus className="size-4" aria-hidden />} Lưu vào lookbook
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={share}>
                  <Link2 className="size-4" aria-hidden /> Chia sẻ
                </Button>
                <Button variant="outline" size="sm" onClick={download} loading={exporting}>
                  {!exporting && <Download className="size-4" aria-hidden />} Tải ảnh
                </Button>
                <Button variant="outline" size="sm" onClick={addCompare}>
                  <Columns3 className="size-4" aria-hidden /> So sánh
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------- Gáy vở -------------------------------- */}
        <div aria-hidden className="relative hidden bg-[linear-gradient(90deg,#e9e7f4,#c9c4e3_45%,#b9b3d8_50%,#c9c4e3_55%,#e9e7f4)] lg:block">
          {["22%", "72%"].map((top) => (
            <span key={top} className="absolute left-1/2 h-12 w-[5px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8d8a99] via-[#e7e6ee] to-[#8d8a99] shadow" style={{ top }} />
          ))}
        </div>

        {/* ------------------------------ Trang phải ------------------------------ */}
        <section aria-label="Các bước phối đồ" className="paper min-w-0 px-5 py-6 sm:px-8 lg:pl-16 lg:pr-8">
          <h1 className="text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink-deep">
            Phối Việt phục <span className="hand font-normal text-redpen">trong 5 bước</span>
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[13.5px] font-semibold text-muted">Bắt đầu nhanh:</span>
            {EXAMPLE_LOOKS.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => {
                  update(ex.config);
                  setTitle(ex.title);
                  setAi(null);
                }}
                className="hand h-9 rounded-full bg-tape/70 px-3 text-[17px] text-ink-deep hover:bg-tape"
              >
                {ex.title}
              </button>
            ))}
            <button type="button" onClick={surprise} className="inline-flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-ink/40 bg-white px-3 text-[13.5px] font-semibold text-ink hover:border-ink">
              <Shuffle className="size-4" aria-hidden /> Gợi ý ngẫu nhiên
            </button>
            <button
              type="button"
              onClick={() => {
                update(DEFAULT_LOOK);
                setTitle("");
                setAi(null);
                goTo(0, false);
              }}
              className="inline-flex h-9 items-center gap-1 px-1 text-[13.5px] font-semibold text-muted underline"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Làm lại
            </button>
          </div>

          <div ref={stepsRef} className="scroll-mt-20 lg:scroll-mt-4">
            <nav
              aria-label="Các bước"
              className="paper -mx-5 mt-6 overflow-x-auto border-b-[1.5px] border-ink/25 px-5 scrollbar-thin sm:-mx-8 sm:px-8 lg:sticky lg:top-16 lg:z-10 lg:-ml-16 lg:-mr-8 lg:pl-16 lg:pr-8"
            >
              <ol className="flex min-w-max gap-1">
                {STEPS.map((s, i) => {
                  const active = i === step;
                  const done = !active && visited.has(i);
                  return (
                    <li key={s.label}>
                      <button
                        type="button"
                        onClick={() => goTo(i, false)}
                        aria-current={active ? "step" : undefined}
                        className={cx(
                          "relative flex h-12 items-center gap-2 rounded-t-[10px] px-3 text-[14.5px] font-bold transition-colors",
                          active ? "bg-white text-ink-deep shadow-[inset_0_-3px_0_var(--color-ink)]" : "text-muted hover:bg-white/60 hover:text-ink-deep",
                        )}
                      >
                        <span
                          className={cx(
                            "grid size-6 place-items-center rounded-full text-[12.5px]",
                            active ? "bg-ink text-white" : done ? "bg-ink-soft text-ink" : "border-[1.5px] border-muted/40 text-muted",
                          )}
                        >
                          {done ? <InkTick className="size-4" /> : i + 1}
                        </span>
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div key={step} className="fade-up pt-6">
              <h2 className="text-[21px] font-extrabold tracking-[-0.01em] text-ink-deep">{current.title}</h2>
              <p className="mb-5 mt-1 text-[14.5px] text-muted">{current.hint}</p>

              {step === 0 && <StepOccasion look={look} update={update} weather={weather} onWeather={setWeather} />}
              {step === 1 && <StepGarment look={look} update={update} />}
              {step === 2 && <StepColor look={look} update={update} slot={slot} onSlot={setSlot} />}
              {step === 3 && <StepAccessories look={look} update={update} />}
              {step === 4 && (
                <div className="space-y-8">
                  <fieldset>
                    <legend className="mb-2 text-[15px] font-bold text-ink-deep">Phong cách</legend>
                    <div role="radiogroup" aria-label="Phong cách" className="grid gap-2 sm:grid-cols-2">
                      {STYLES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={look.style === s.id}
                          onClick={() => update({ style: s.id })}
                          className={cx(
                            "rounded-[12px] border-[1.5px] bg-white px-3 py-2.5 text-left transition-colors",
                            look.style === s.id ? "border-ink bg-ink-soft" : "border-grid hover:border-ink/60",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="font-bold text-ink-deep">{s.name}</span>
                            <span className="text-[12px] font-semibold text-muted">{REMIX_LABEL[s.remix]}</span>
                          </span>
                          <span className="block text-[13.5px] leading-snug text-muted">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 text-[15px] font-bold text-ink-deep">Nhân vật giống bạn</legend>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <div role="radiogroup" aria-label="Tông da" className="flex items-center gap-2">
                        <span className="text-[14px] text-muted">Tông da</span>
                        {SKINS.map((s, i) => (
                          <button
                            key={s.id}
                            type="button"
                            role="radio"
                            aria-checked={look.skin === s.id}
                            aria-label={`Tông da ${i + 1}`}
                            onClick={() => update({ skin: s.id })}
                            className={cx("size-9 rounded-full border-2", look.skin === s.id ? "border-ink ring-2 ring-ink/30" : "border-white shadow")}
                            style={{ background: s.hex }}
                          />
                        ))}
                      </div>
                      <div role="radiogroup" aria-label="Kiểu tóc" className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] text-muted">Tóc</span>
                        {HAIRS.map((h) => (
                          <Choice key={h.id} type="radio" selected={look.hair === h.id} onClick={() => update({ hair: h.id })}>
                            {h.name}
                          </Choice>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <PhotoCoach
                        event={look.event}
                        face={face}
                        onFace={setFace}
                        onApply={(patch, label) => {
                          update(patch);
                          setToast({ text: `Đã áp dụng: ${label}` });
                        }}
                      />
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 text-[15px] font-bold text-ink-deep">Lời phê chi tiết từ AI</legend>
                    <AIReview
                      ai={ai}
                      loading={aiLoading}
                      error={aiError}
                      note={note}
                      onNote={setNote}
                      onAsk={askAI}
                      onApply={update}
                      onCopied={() => setToast({ text: "Đã chép caption." })}
                    />
                  </fieldset>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-dashed border-ink/30 pt-5">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => goTo(step - 1)}>
                    <ArrowLeft className="size-4" aria-hidden /> {STEPS[step - 1].label}
                  </Button>
                ) : (
                  <span />
                )}
                {step < STEPS.length - 1 ? (
                  <Button onClick={() => goTo(step + 1)}>
                    Tiếp: {STEPS[step + 1].label} <ArrowRight className="size-4" aria-hidden />
                  </Button>
                ) : (
                  <Button onClick={save} loading={saving}>
                    {!saving && <BookmarkPlus className="size-4" aria-hidden />} Lưu vào lookbook
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Thẻ ẩn để xuất ảnh PNG */}
      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0">
        <div ref={cardRef} className="cover w-[640px] p-6">
          <LookCard look={look} title={finalTitle} caption={ai?.caption} face={face} />
          <p className="mt-3 text-center text-[13px] font-semibold text-white/85">Việt phục Remix · phối Việt phục theo cách của bạn</p>
        </div>
      </div>

      {toast && (
        <div role="status" className="fade-up fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-[12px] bg-ink-deep px-4 py-3 text-[14.5px] text-white shadow-xl lg:bottom-6">
          <span className="flex-1">{toast.text}</span>
          {toast.href && (
            <Link href={toast.href} className="font-bold text-cover-lime underline">
              Xem
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
