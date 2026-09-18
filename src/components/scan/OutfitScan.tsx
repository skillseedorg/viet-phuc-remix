"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookmarkPlus, Camera, Check, Columns3, ImagePlus, PencilLine, RotateCcw, TriangleAlert } from "lucide-react";
import Figure from "../Figure";
import { overallScore } from "../LookCard";
import GoogleButton from "../GoogleButton";
import { useApp } from "../Providers";
import { Button, Choice, cx } from "../ui";
import { applyAllFixes, checkCulture } from "@/lib/culture";
import { checkHarmony } from "@/lib/harmony";
import { imageFileError, resizeImage } from "@/lib/image";
import { EVENTS, colorById, eventById, garmentById, names, type EventId } from "@/lib/kb";
import { encodeLook, uid, type LookConfig } from "@/lib/look";
import { postJSON, type ScanResult } from "@/lib/ai-types";

const CONF = {
  cao: { label: "chắc chắn", cls: "bg-ink-soft text-ink-deep" },
  vua: { label: "khá chắc", cls: "bg-tape/60 text-ink-deep" },
  thap: { label: "chưa chắc", cls: "bg-redpen-soft text-redpen" },
} as const;

const LEVEL = {
  note: { label: "Lưu ý", ink: "text-ink", ring: "border-ink/60" },
  warn: { label: "Nên sửa", ink: "text-redpen", ring: "border-redpen" },
  stop: { label: "Cần sửa", ink: "text-redpen", ring: "border-redpen" },
} as const;

function ScoreBox({ score, label }: { score: number; label: string }) {
  return (
    <div className="relative grid size-[76px] shrink-0 place-items-center" aria-label={`${label}: ${score} trên 10`}>
      <svg key={score} viewBox="0 0 80 64" className="ink-draw absolute inset-0" aria-hidden>
        <path d="M12,36 Q10,8 40,7 Q72,8 70,32 Q70,58 40,58 Q9,58 14,28" pathLength={1} fill="none" stroke="var(--color-redpen)" strokeWidth={2.4} strokeLinecap="round" />
      </svg>
      <span className="hand relative text-[38px] leading-none text-redpen">{score}</span>
    </div>
  );
}

export default function OutfitScan() {
  const { user, session, authLoading, saveLook, toggleCompare } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [event, setEvent] = useState<EventId | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; href?: string } | null>(null);

  const look: LookConfig | null = useMemo(() => (scan ? { ...scan.config, event } : null), [scan, event]);
  const report = useMemo(() => (look ? checkCulture(look) : null), [look]);
  const harmony = useMemo(() => (look ? checkHarmony(look) : null), [look]);
  const fixed = useMemo(() => (look ? applyAllFixes(look) : null), [look]);

  if (authLoading) return <main className="mx-auto max-w-[1180px] px-3 py-10" aria-busy="true" />;

  if (!user)
    return (
      <main className="mx-auto grid max-w-[1080px] items-center gap-10 px-3 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:pt-14">
        <div className="text-white">
          <h1 className="text-[clamp(34px,4.6vw,58px)] font-extrabold leading-[1] tracking-[-0.03em]">
            Chấm outfit <span className="hand block font-normal text-cover-lime">từ ảnh chụp của bạn</span>
          </h1>
          <p className="mt-5 max-w-[48ch] text-[16.5px] leading-relaxed text-white/85">
            Tải ảnh bạn đang mặc Việt phục. Hệ thống nhận diện loại áo, màu, hoa văn, phụ kiện, dựng lại thành bộ phối trên nhân vật, rồi chấm điểm văn hóa và hài hòa màu kèm lời phê.
          </p>
          <p className="mt-4 text-[14px] text-white/70">Tính năng dành cho tài khoản đã đăng nhập.</p>
        </div>
        <div className="paper-plain sheet-shadow rounded-[18px] p-6 sm:p-8">
          <p className="hand text-[26px] leading-tight text-ink">Đăng nhập để bắt đầu chấm</p>
          <GoogleButton next="/cham-outfit" className="mt-5" />
          <Button variant="outline" href="/dang-nhap?next=/cham-outfit" className="mt-3 w-full">
            Đăng nhập bằng email
          </Button>
          <p className="mt-4 text-center text-[13px] leading-snug text-muted">
            Khi tiếp tục, bạn đồng ý với{" "}
            <Link href="/dieu-khoan" className="font-semibold text-ink underline underline-offset-2">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link href="/quyen-rieng-tu" className="font-semibold text-ink underline underline-offset-2">
              Chính sách quyền riêng tư
            </Link>
            .
          </p>
        </div>
      </main>
    );

  const pick = async (file?: File) => {
    if (!file) return;
    const invalid = imageFileError(file);
    if (invalid) return setError(invalid);
    setError(null);
    setScan(null);
    try {
      setPhoto(await resizeImage(file, 1024));
    } catch {
      setError("Không đọc được ảnh này, thử ảnh JPG hoặc PNG khác.");
    }
  };

  const run = async () => {
    if (!photo) return;
    setLoading(true);
    setError(null);
    try {
      const { result } = await postJSON<{ result: ScanResult }>("/api/outfit-scan", { image: photo, event }, session?.access_token);
      if (!result.hasPerson) {
        setScan(null);
        setError("Không thấy ai đang mặc trang phục trong ảnh. Hãy chọn ảnh chụp rõ người, thấy từ vai xuống chân càng tốt.");
      } else setScan(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhoto(null);
    setScan(null);
    setError(null);
  };

  const save = async (config: LookConfig, label: string) => {
    const res = await saveLook({
      title: `${label} ${new Date().toLocaleDateString("vi-VN")}`.slice(0, 80),
      config,
      note: scan?.critique.summary.slice(0, 500),
      isPublic: false,
    });
    setToast({ text: res.where === "cloud" ? "Đã lưu vào lookbook." : `Đã lưu trên máy này. ${res.reason ?? ""}`, href: "/lookbook" });
    setTimeout(() => setToast(null), 5000);
  };

  const score = look ? overallScore(look) : 0;
  const fixedScore = fixed ? overallScore(fixed.look) : 0;
  const g = look ? garmentById(look.garment) : null;

  return (
    <main className="mx-auto max-w-[1240px] px-2 pb-24 pt-4 sm:px-6 sm:pt-6 lg:pb-12">
      <div className="paper sheet-shadow rounded-[14px] px-4 py-7 sm:px-10 sm:pl-20 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(30px,4.2vw,52px)] font-extrabold leading-[1] tracking-[-0.03em] text-ink-deep">
              Chấm outfit <span className="hand font-normal text-redpen">từ ảnh</span>
            </h1>
            <p className="mt-2 max-w-[60ch] text-[15.5px] text-muted">
              Ảnh chỉ được gửi tới AI để nhận diện, không lưu trên máy chủ (
              <Link href="/quyen-rieng-tu#anh" className="font-semibold text-ink underline underline-offset-2">
                chi tiết
              </Link>
              ). Chỉ tải ảnh của bạn hoặc ảnh đã được người trong ảnh đồng ý.
            </p>
          </div>
          {photo && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden /> Chấm ảnh khác
            </Button>
          )}
        </div>

        {/* ---------------------------- Tải ảnh ---------------------------- */}
        <div className="mt-7 grid gap-6 md:grid-cols-[260px_1fr]">
          <div>
            <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
            {photo ? (
              <div className="relative mx-auto w-fit -rotate-2 bg-white p-2 pb-7 shadow-[0_2px_4px_rgba(0,0,0,.12),0_14px_28px_-14px_rgba(0,0,0,.55)]">
                <span className="tape absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-3" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Ảnh outfit bạn tải lên" className="max-h-[360px] w-[236px] object-cover" />
                <button type="button" onClick={() => input.current?.click()} className="hand absolute bottom-1 right-2 text-[16px] text-ink underline">
                  đổi ảnh
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => input.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void pick(e.dataTransfer.files?.[0]);
                }}
                className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed border-ink/40 bg-white/70 p-5 text-center hover:border-ink hover:bg-ink-soft/60"
              >
                <span className="grid size-14 place-items-center rounded-full bg-ink-soft text-ink">
                  <ImagePlus className="size-6" aria-hidden />
                </span>
                <span className="font-bold text-ink-deep">Chọn hoặc kéo ảnh vào đây</span>
                <span className="text-[13.5px] text-muted">Ảnh rõ người, thấy từ vai tới chân. PNG, JPG, WEBP dưới 12MB.</span>
              </button>
            )}
          </div>

          <div>
            <p className="text-[15px] font-bold text-ink-deep">Bạn mặc bộ này đi đâu?</p>
            <p className="text-[13.5px] text-muted">Không bắt buộc. Chọn dịp để được chấm theo độ trang trọng phù hợp; đổi dịp sau khi chấm thì điểm cập nhật ngay.</p>
            <div role="radiogroup" aria-label="Dịp" className="mt-3 flex flex-wrap gap-2">
              {EVENTS.map((e) => (
                <Choice key={e.id} type="radio" selected={event === e.id} onClick={() => setEvent(event === e.id ? null : e.id)}>
                  {e.name}
                </Choice>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="red" size="lg" onClick={run} loading={loading} disabled={!photo}>
                {!loading && <Camera className="size-5" aria-hidden />} {scan ? "Chấm lại" : "Chấm điểm outfit"}
              </Button>
              {!photo && <span className="text-[14px] text-muted">Tải ảnh lên trước nhé.</span>}
            </div>
            {loading && <p className="hand mt-3 text-[22px] text-redpen">Cô đang nhìn kỹ từng chi tiết...</p>}
            {error && (
              <p role="alert" className="mt-3 text-[14.5px] text-redpen">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* ---------------------------- Kết quả ---------------------------- */}
        {scan && look && report && harmony && fixed && g && (
          <section aria-label="Kết quả chấm" className="fade-up mt-10 border-t border-dashed border-ink/30 pt-8">
            {!scan.isTraditional && (
              <p className="mb-5 flex gap-2 rounded-[12px] bg-redpen-soft px-4 py-3 text-[14.5px] text-text">
                <TriangleAlert className="mt-0.5 size-5 shrink-0 text-redpen" aria-hidden />
                <span>
                  Ảnh này có vẻ không phải Việt phục. Hệ thống quy về dáng gần nhất là <b>{g.name.toLowerCase()}</b> để chấm, nên điểm chỉ mang tính tham khảo.
                </span>
              </p>
            )}

            <div className="grid grid-cols-[96px_1fr] border-[1.5px] border-text/70 bg-white/75">
              <div className="border-r-[1.5px] border-text/70">
                <div className="border-b border-text/40 py-1 text-center text-[11.5px] font-bold uppercase tracking-wider">Điểm</div>
                <div className="grid place-items-center py-1">
                  <ScoreBox score={score} label="Điểm outfit" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="border-b border-text/40 py-1 text-center text-[11.5px] font-bold uppercase tracking-wider">Lời phê của cô giáo</div>
                <p className="hand px-3 py-2 text-[19.5px] leading-[1.25] text-redpen" aria-live="polite">
                  {scan.critique.summary || "Cô đã nhận diện outfit, xem chi tiết bên dưới nhé."}
                </p>
                <p className="px-3 pb-2 text-[12.5px] text-muted">
                  Văn hóa {report.score} · Màu {harmony.score} ({harmony.scheme}){look.event ? ` · chấm theo dịp ${eventById(look.event).name.toLowerCase()}` : " · chưa chọn dịp"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              {/* Nhân vật dựng lại */}
              <div className="grid grid-cols-2 gap-3">
                <figure className="rounded-[14px] bg-white p-3">
                  <Figure
                    look={look}
                    marks={report.issues.map((i, n) => ({ zone: i.zone, level: i.level, n: n + 1 }))}
                    className="h-[380px] w-full"
                    title="Outfit hệ thống dựng lại từ ảnh"
                  />
                  <figcaption className="mt-1 text-center text-[13.5px] font-semibold text-ink-deep">Dựng lại từ ảnh</figcaption>
                </figure>
                <figure className={cx("rounded-[14px] p-3", fixed.applied.length ? "bg-ink-soft" : "bg-white")}>
                  <Figure look={fixed.look} className="h-[380px] w-full" title="Outfit sau khi sửa theo lời phê" />
                  <figcaption className="mt-1 flex items-center justify-center gap-2 text-center text-[13.5px] font-semibold text-ink-deep">
                    {fixed.applied.length ? (
                      <>
                        Nếu sửa theo lời phê <span className="hand text-[22px] leading-none text-redpen">{fixedScore}</span>
                      </>
                    ) : (
                      "Không có gì cần sửa"
                    )}
                  </figcaption>
                </figure>
              </div>

              {/* Nhận diện */}
              <div>
                <h2 className="text-[20px] font-extrabold text-ink-deep">Hệ thống nhận diện</h2>
                <dl className="mt-2 divide-y divide-dashed divide-ink/20 text-[14.5px]">
                  <div className="grid grid-cols-[104px_1fr] items-center gap-2 py-2">
                    <dt className="font-semibold text-muted">Loại áo</dt>
                    <dd className="flex flex-wrap items-center gap-2">
                      <Link href={`/kham-pha/${g.id}`} className="font-bold text-ink underline underline-offset-2">
                        {g.name}
                      </Link>
                      {look.garment === "ao-dai" && <span>{names.length(look.length).toLowerCase()}</span>}
                      <span className={cx("rounded-full px-2 text-[12px] font-bold", CONF[scan.confidence.garment].cls)}>{CONF[scan.confidence.garment].label}</span>
                    </dd>
                  </div>
                  <div className="grid grid-cols-[104px_1fr] items-center gap-2 py-2">
                    <dt className="font-semibold text-muted">Màu</dt>
                    <dd className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {(["main", "secondary", "accent"] as const).map((slot) => (
                        <span key={slot} className="inline-flex items-center gap-1.5">
                          {scan.detectedHex[slot] && (
                            <span className="block size-5 rounded-full ring-1 ring-black/10" style={{ background: scan.detectedHex[slot]! }} title={`Màu trong ảnh ${scan.detectedHex[slot]}`} />
                          )}
                          <ArrowRight className="size-3 text-muted" aria-hidden />
                          <span className="pinked block size-5" style={{ background: colorById(look[slot]).hex }} />
                          <span className="text-[13.5px]">{colorById(look[slot]).name}</span>
                        </span>
                      ))}
                      <span className={cx("rounded-full px-2 text-[12px] font-bold", CONF[scan.confidence.colors].cls)}>{CONF[scan.confidence.colors].label}</span>
                    </dd>
                  </div>
                  {[
                    ["Hoa văn", `${names.pattern(look.pattern)}, chất liệu ${names.fabric(look.fabric).toLowerCase()}`],
                    ["Phối cùng", `${names.bottom(look.bottom)}${look.outer !== "none" ? `, ${names.outer(look.outer).toLowerCase()}` : ""}`],
                    ["Phụ kiện", [look.head !== "none" ? names.head(look.head) : null, names.feet(look.feet), ...look.extras.map(names.extra)].filter(Boolean).join(", ")],
                  ].map(([k, v], i) => (
                    <div key={k} className="grid grid-cols-[104px_1fr] items-center gap-2 py-2">
                      <dt className="font-semibold text-muted">{k}</dt>
                      <dd className="flex flex-wrap items-center gap-2">
                        {v}
                        {i === 2 && <span className={cx("rounded-full px-2 text-[12px] font-bold", CONF[scan.confidence.accessories].cls)}>{CONF[scan.confidence.accessories].label}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
                {scan.notVisible.length > 0 && (
                  <p className="mt-2 text-[13.5px] text-muted">Không thấy rõ trong ảnh, hệ thống tạm đoán: {scan.notVisible.join(", ")}.</p>
                )}
                {scan.observations.length > 0 && (
                  <ul className="mt-3 space-y-1 text-[14px] text-text">
                    {scan.observations.map((o) => (
                      <li key={o} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-[13.5px] text-muted">
                  Nhận diện chưa đúng?{" "}
                  <Link href={`/phoi-do?l=${encodeLook(look, "Outfit từ ảnh")}`} className="font-semibold text-ink underline">
                    Mở trong vở phối đồ để chỉnh
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-[20px] font-extrabold text-ink-deep">Lời phê chi tiết</h2>
                {report.issues.length === 0 ? (
                  <p className="hand mt-2 flex items-center gap-2 text-[21px] text-ink">
                    <Check className="size-5" aria-hidden /> Không có lỗi văn hóa nào.
                  </p>
                ) : (
                  <ol className="mt-3 space-y-3">
                    {report.issues.map((i, n) => (
                      <li key={i.id} className="grid grid-cols-[30px_1fr] gap-2">
                        <span className={cx("hand grid size-7 place-items-center rounded-full border-2 text-[17px]", LEVEL[i.level].ink, LEVEL[i.level].ring)}>{n + 1}</span>
                        <div>
                          <p className="text-[14.5px] font-bold leading-snug">
                            <span className={cx("mr-1.5 text-[12px] font-extrabold uppercase tracking-wide", LEVEL[i.level].ink)}>{LEVEL[i.level].label}</span>
                            {i.title}
                          </p>
                          <p className="mt-0.5 text-[14px] leading-snug text-muted">{i.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-ink-deep">AI nhận xét ảnh</h2>
                {scan.critique.strengths.length > 0 && (
                  <>
                    <h3 className="hand mt-2 text-[21px] text-ink">Điểm mạnh</h3>
                    <ul className="mt-1 space-y-1.5 text-[14.5px]">
                      {scan.critique.strengths.map((s) => (
                        <li key={s} className="grid grid-cols-[20px_1fr] gap-2">
                          <Check className="mt-0.5 size-4 text-ink" aria-hidden />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {scan.critique.improvements.length > 0 && (
                  <>
                    <h3 className="hand mt-4 text-[21px] text-redpen">Có thể tốt hơn</h3>
                    <ul className="mt-1 space-y-1.5 text-[14.5px]">
                      {scan.critique.improvements.map((s) => (
                        <li key={s} className="grid grid-cols-[20px_1fr] gap-2">
                          <ArrowRight className="mt-0.5 size-4 text-redpen" aria-hidden />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-3 text-[12.5px] text-muted">Nhận xét AI viết theo dịp đã chọn lúc bấm chấm.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 border-t border-dashed border-ink/30 pt-5">
              <Button onClick={() => save(look, "Outfit từ ảnh")}>
                <BookmarkPlus className="size-4" aria-hidden /> Lưu outfit
              </Button>
              {fixed.applied.length > 0 && (
                <Button variant="outline" onClick={() => save(fixed.look, "Outfit đã sửa")}>
                  <BookmarkPlus className="size-4" aria-hidden /> Lưu bản đã sửa
                </Button>
              )}
              <Button variant="outline" href={`/phoi-do?l=${encodeLook(fixed.look, "Outfit đã sửa")}`}>
                <PencilLine className="size-4" aria-hidden /> Tiếp tục phối
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  toggleCompare({ id: uid(), title: "Outfit từ ảnh", config: look, createdAt: new Date().toISOString(), source: "local" });
                  if (fixed.applied.length)
                    toggleCompare({ id: uid(), title: "Outfit đã sửa", config: fixed.look, createdAt: new Date().toISOString(), source: "local" });
                  setToast({ text: "Đã đưa vào khay so sánh.", href: "/so-sanh" });
                }}
              >
                <Columns3 className="size-4" aria-hidden /> So sánh
              </Button>
            </div>
          </section>
        )}
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
