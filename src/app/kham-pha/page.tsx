import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Figure from "@/components/Figure";
import SiteFooter from "@/components/SiteFooter";
import AskBox from "@/components/explore/AskBox";
import { COLORS, EVENTS, EXTRAS, GARMENTS, HEADS, PATTERNS, REGIONS, garmentById } from "@/lib/kb";
import { previewLook } from "@/lib/look";

export const metadata = {
  title: "Sổ tay Việt phục — Việt phục Remix",
  description: "Nguồn gốc, ý nghĩa và cách remix đúng của áo dài, áo tứ thân, áo ngũ thân, áo bà ba, áo nhật bình, áo tấc.",
  openGraph: { type: "website", locale: "vi_VN", siteName: "Việt phục Remix", title: "Sổ tay Việt phục — Việt phục Remix", description: "Nguồn gốc, ý nghĩa và cách remix đúng của áo dài, áo tứ thân, áo ngũ thân, áo bà ba, áo nhật bình, áo tấc.", images: [{ url: "/og/kham-pha.png", width: 1200, height: 630, alt: "Sổ tay Việt phục: minh họa sáu loại áo truyền thống trên giấy ô ly" }] },
};


export default function Explore() {
  return (
    <>
      <main className="mx-auto max-w-[1320px] px-2 pb-16 pt-4 sm:px-6 sm:pt-6">
        <div className="paper sheet-shadow rounded-[14px] px-5 py-8 sm:px-10 sm:pl-20 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
            <div>
              <h1 className="text-[clamp(32px,4.4vw,56px)] font-extrabold leading-[1] tracking-[-0.03em] text-ink-deep">
                Sổ tay <span className="hand font-normal text-redpen">Việt phục</span>
              </h1>
              <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-muted">
                Sáu loại áo truyền thống của người Việt qua ba miền: nguồn gốc, cấu tạo, ý nghĩa và cách remix sao cho vẫn giữ được đặc trưng. Thông tin được gắn nhãn độ tin cậy và ghi nguồn tham khảo.
              </p>
            </div>
            <AskBox />
          </div>

          <ol className="mt-10 grid gap-x-8 gap-y-2 md:grid-cols-2">
            {GARMENTS.map((g) => {
              const look = previewLook(g.id);
              return (
                <li key={g.id}>
                  <Link
                    href={`/kham-pha/${g.id}`}
                    className="group grid grid-cols-[96px_1fr] items-center gap-4 rounded-[14px] border-b border-dashed border-ink/25 px-2 py-4 hover:bg-white/70"
                  >
                    <Figure look={look} className="h-40 w-full" title={g.name} />
                    <div className="min-w-0">
                      <h2 className="flex items-center gap-2 text-[24px] font-extrabold tracking-[-0.015em] text-ink-deep">
                        {g.name}
                        <ArrowRight className="size-5 text-ink opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
                      </h2>
                      <p className="hand text-[19px] leading-snug text-redpen">{g.tagline}</p>
                      <p className="mt-1 text-[14.5px] leading-snug text-muted">{g.summary}</p>
                      <p className="mt-2 text-[13px] font-semibold text-ink">
                        {g.era} · {g.regions === "ca-nuoc" ? "Cả nước" : g.regions.map((r) => REGIONS.find((x) => x.id === r)!.name).join(", ")}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="paper-plain sheet-shadow rounded-[14px] px-5 py-7 sm:px-8">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">Mặc gì cho dịp nào</h2>
            <dl className="mt-4 divide-y divide-dashed divide-ink/20">
              {EVENTS.map((e) => (
                <div key={e.id} className="grid gap-1 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
                  <dt>
                    <Link href={`/phoi-do?dip=${e.id}`} className="font-bold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {e.name}
                    </Link>
                    <span className="mt-1 flex gap-1" aria-label={`Độ trang trọng ${e.formality} trên 3`}>
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={`h-1.5 w-5 rounded-full ${n <= e.formality ? "bg-redpen" : "bg-grid"}`} />
                      ))}
                    </span>
                  </dt>
                  <dd className="text-[14.5px] leading-snug text-text">
                    <span className="font-semibold">{e.recommended.map((id) => garmentById(id).name).join(", ")}.</span> {e.tip}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="paper-plain sheet-shadow rounded-[14px] px-5 py-7 sm:px-8">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">Màu sắc và ý nghĩa</h2>
            <ul className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {COLORS.map((c) => (
                <li key={c.id} className="grid grid-cols-[36px_1fr] gap-3">
                  <span className="pinked mt-0.5 block size-9" style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)" }} />
                  <span>
                    <span className="block font-bold text-ink-deep">{c.name}</span>
                    <span className="block text-[13.5px] leading-snug text-muted">{c.meaning}</span>
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">Hoa văn</h2>
            <ul className="mt-3 space-y-2 text-[14.5px]">
              {PATTERNS.filter((p) => p.id !== "tron").map((p) => (
                <li key={p.id}>
                  <span className="font-bold text-ink-deep">{p.name}.</span> {p.meaning}
                  {p.note && <span className="hand ml-1 text-[18px] text-redpen">{p.note}</span>}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">Phụ kiện truyền thống</h2>
            <ul className="mt-3 space-y-2 text-[14.5px]">
              {[...HEADS, ...EXTRAS]
                .filter((x) => x.id !== "none" && !("modern" in x && x.modern))
                .map((x) => (
                  <li key={x.id}>
                    <span className="font-bold text-ink-deep">{x.name}.</span> {x.info}
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
