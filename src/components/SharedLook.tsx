import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LookCard from "./LookCard";
import SiteFooter from "./SiteFooter";
import { checkCulture } from "@/lib/culture";
import { garmentById } from "@/lib/kb";
import { encodeLook, type LookConfig, type StylistResult } from "@/lib/look";

export default function SharedLook({
  look,
  title,
  owner,
  ai,
}: {
  look: LookConfig;
  title: string;
  owner?: string | null;
  ai?: StylistResult | null;
}) {
  const g = garmentById(look.garment);
  const report = checkCulture(look);

  return (
    <>
      <main className="mx-auto max-w-[1080px] px-3 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="sheet-shadow rounded-[18px]">
            <LookCard look={look} title={title} owner={owner} caption={ai?.caption} />
          </div>
          <div className="paper-plain sheet-shadow rounded-[14px] px-5 py-6 sm:px-7">
            {ai?.summary ? (
              <>
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted">Lời phê</h2>
                <p className="hand mt-1 text-[22px] leading-snug text-redpen">{ai.summary}</p>
              </>
            ) : (
              <h2 className="hand text-[26px] leading-tight text-ink">Một bộ {g.name.toLowerCase()} được phối trên Việt phục Remix</h2>
            )}
            {ai?.culturalNote && <p className="mt-4 rounded-[10px] bg-ink-soft px-3 py-2 text-[15px] text-ink-deep">{ai.culturalNote}</p>}

            <h3 className="mt-6 text-[17px] font-extrabold text-ink-deep">Về {g.name.toLowerCase()}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-text">{g.summary}</p>

            {report.issues.length > 0 && (
              <>
                <h3 className="mt-6 text-[17px] font-extrabold text-ink-deep">Ghi chú văn hóa</h3>
                <ul className="mt-2 space-y-2">
                  {report.issues.slice(0, 4).map((i) => (
                    <li key={i.id} className="text-[14.5px]">
                      <span className={i.level === "note" ? "font-bold text-ink" : "font-bold text-redpen"}>{i.title}.</span>{" "}
                      <span className="text-muted">{i.detail}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/phoi-do?l=${encodeLook(look, title)}`} className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-ink px-5 font-bold text-white hover:bg-ink-deep">
                Phối lại theo ý mình <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={`/kham-pha/${g.id}`} className="inline-flex h-12 items-center rounded-[12px] border-[1.5px] border-ink px-4 font-semibold text-ink hover:bg-ink-soft">
                Tìm hiểu {g.name.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
