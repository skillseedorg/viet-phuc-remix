import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, TriangleAlert } from "lucide-react";
import Figure from "@/components/Figure";
import SiteFooter from "@/components/SiteFooter";
import AskBox from "@/components/explore/AskBox";
import { CONFIDENCE_LABEL, EVENTS, GARMENTS, REGIONS, SOURCES, type Confidence, type Fact } from "@/lib/kb";
import { previewLook } from "@/lib/look";

export function generateStaticParams() {
  return GARMENTS.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = GARMENTS.find((x) => x.id === id);
  return { title: g ? `${g.name} — Sổ tay Việt phục` : "Không tìm thấy" };
}

const CONF_STYLE: Record<Confidence, string> = {
  "tu-lieu": "bg-ink-soft text-ink-deep",
  "dan-gian": "bg-tape/60 text-ink-deep",
  "gia-thuyet": "bg-redpen-soft text-redpen",
};

function Facts({ facts }: { facts: Fact[] }) {
  return (
    <ul className="space-y-3">
      {facts.map((f) => (
        <li key={f.text} className="text-[16px] leading-relaxed text-text">
          {f.text}{" "}
          <span className={`ml-1 inline-block whitespace-nowrap rounded-full px-2 py-px align-[2px] text-[12px] font-bold ${CONF_STYLE[f.confidence]}`}>
            {CONFIDENCE_LABEL[f.confidence]}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function GarmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = GARMENTS.find((x) => x.id === id);
  if (!g) notFound();
  const look = previewLook(g.id);
  const events = EVENTS.filter((e) => e.recommended.includes(g.id));
  const idx = GARMENTS.indexOf(g);
  const next = GARMENTS[(idx + 1) % GARMENTS.length];

  return (
    <>
      <main className="mx-auto max-w-[1320px] px-2 pb-16 pt-4 sm:px-6 sm:pt-6">
        <article className="paper sheet-shadow overflow-clip rounded-[14px]">
          <div className="grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="relative border-b border-dashed border-ink/25 px-5 pb-6 pt-5 sm:px-10 sm:pl-20 lg:border-b-0 lg:border-r">
              <Link href="/kham-pha" className="inline-flex items-center gap-1 text-[14px] font-semibold text-ink hover:underline">
                <ArrowLeft className="size-4" aria-hidden /> Sổ tay
              </Link>
              <div className="lg:sticky lg:top-24">
                <Figure look={look} className="mx-auto mt-2 h-[480px] w-full max-w-[300px]" title={`Minh họa ${g.name}`} />
                <p className="text-center text-[13px] text-muted">Hình minh họa, không phải ảnh tư liệu</p>
                <ol className="mt-5 space-y-2">
                  {g.anatomy.map((a, i) => (
                    <li key={a.part} className="grid grid-cols-[28px_1fr] gap-2 text-[14.5px]">
                      <span className="hand grid size-7 place-items-center rounded-full border-2 border-ink/60 text-[17px] text-ink">{i + 1}</span>
                      <span>
                        <span className="font-bold text-ink-deep">{a.part}.</span> {a.desc}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="px-5 py-8 sm:px-10 lg:py-10">
              <h1 className="text-[clamp(38px,5vw,64px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink-deep">{g.name}</h1>
              <p className="hand mt-2 text-[26px] leading-tight text-redpen">{g.tagline}</p>
              <p className="mt-2 text-[14px] font-semibold text-muted">
                {g.era} · {g.regions === "ca-nuoc" ? "Cả nước" : g.regions.map((r) => REGIONS.find((x) => x.id === r)!.name).join(", ")}
              </p>
              <p className="mt-5 max-w-[68ch] text-[18px] leading-relaxed text-text">{g.summary}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/phoi-do?ao=${g.id}`} className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-ink px-5 font-bold text-white hover:bg-ink-deep">
                  Phối thử {g.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
                </Link>
                {events.slice(0, 3).map((e) => (
                  <Link key={e.id} href={`/phoi-do?ao=${g.id}&dip=${e.id}`} className="inline-flex h-12 items-center rounded-[12px] border-[1.5px] border-ink px-4 font-semibold text-ink hover:bg-ink-soft">
                    Mặc đi {e.name.toLowerCase()}
                  </Link>
                ))}
              </div>

              <section className="mt-12 max-w-[72ch]">
                <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-ink-deep">Nguồn gốc</h2>
                <div className="mt-3">
                  <Facts facts={g.origin} />
                </div>
              </section>

              <section className="mt-10 max-w-[72ch]">
                <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-ink-deep">Ý nghĩa</h2>
                <div className="mt-3">
                  <Facts facts={g.meaning} />
                </div>
              </section>

              <section className="mt-10">
                <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-ink-deep">Remix thế nào cho đúng</h2>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="hand text-[22px] text-ink">Nên thử</h3>
                    <ul className="mt-2 space-y-2">
                      {g.remixOk.map((t) => (
                        <li key={t} className="grid grid-cols-[22px_1fr] gap-2 text-[15px] leading-snug">
                          <Check className="mt-0.5 size-5 text-ink" aria-hidden />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="hand text-[22px] text-redpen">Cần cân nhắc</h3>
                    <ul className="mt-2 space-y-2">
                      {g.remixCareful.map((t) => (
                        <li key={t} className="grid grid-cols-[22px_1fr] gap-2 text-[15px] leading-snug">
                          <TriangleAlert className="mt-0.5 size-5 text-redpen" aria-hidden />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mt-10 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-[20px] font-extrabold text-ink-deep">Phối truyền thống</h2>
                  <p className="mt-2 text-[15px] leading-relaxed">{g.traditionalWith.join(", ")}.</p>
                </div>
                <div>
                  <h2 className="text-[20px] font-extrabold text-ink-deep">Chất liệu thường dùng</h2>
                  <p className="mt-2 text-[15px] leading-relaxed">{g.fabrics.join(", ")}.</p>
                </div>
              </section>

              <section className="mt-10 max-w-[72ch]">
                <h2 className="text-[20px] font-extrabold text-ink-deep">Nguồn tham khảo</h2>
                <ul className="mt-2 space-y-1.5 text-[14.5px]">
                  {g.sources.map((s) => {
                    const src = SOURCES[s];
                    return (
                      <li key={s}>
                        {src.url ? (
                          <a href={src.url} target="_blank" rel="noreferrer" className="font-semibold text-ink underline underline-offset-2">
                            {src.title}
                          </a>
                        ) : (
                          <span className="font-semibold text-text">{src.title}</span>
                        )}
                        {src.note && <span className="text-muted">. {src.note}</span>}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-[13.5px] text-muted">
                  Nội dung được biên soạn tóm tắt để phục vụ học tập. Thấy chỗ chưa chính xác?{" "}
                  <Link href={`/cam-ket?chu-de=${g.id}#bao-sai`} className="font-semibold text-ink underline">
                    Báo cho ban biên tập
                  </Link>
                  .
                </p>
              </section>

              <div className="mt-10 max-w-[560px]">
                <AskBox garment={g.id} />
              </div>

              <Link href={`/kham-pha/${next.id}`} className="group mt-12 flex items-center justify-between gap-3 border-t border-dashed border-ink/30 pt-5">
                <span>
                  <span className="block text-[13px] font-semibold text-muted">Trang tiếp</span>
                  <span className="block text-[22px] font-extrabold text-ink-deep">{next.name}</span>
                </span>
                <ArrowRight className="size-6 text-ink transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
