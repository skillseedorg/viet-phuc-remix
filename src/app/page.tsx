import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Figure from "@/components/Figure";
import FixDemo from "@/components/home/FixDemo";
import SiteFooter from "@/components/SiteFooter";
import { EXAMPLE_LOOKS, encodeLook } from "@/lib/look";
import { EVENTS, GARMENTS, REGIONS } from "@/lib/kb";

const STICKERS = ["#c8e04a", "#f06ea9", "#f6e27a"];

export default function Home() {
  return (
    <>
      <main className="pb-24 lg:pb-0">
        {/* ----------------------------- Bìa vở ----------------------------- */}
        <section className="cover relative overflow-hidden">
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:pb-20 lg:pt-14">
            <div className="relative">
              <div className="nhan-vo max-w-[560px] px-7 pb-7 pt-6 text-cover sm:px-10 sm:pb-9 sm:pt-8">
                <h1 className="text-[clamp(40px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink-deep">
                  Việt phục <span className="hand block font-normal tracking-normal text-redpen">Remix</span>
                </h1>
                <dl className="mt-6 space-y-2.5 text-[15px]">
                  {[
                    ["Lớp", "Gen Z yêu áo dài, tứ thân, ngũ thân, bà ba"],
                    ["Môn", "Phối Việt phục theo dịp, vùng miền, cá tính"],
                    ["Giáo viên", "Cô giáo văn hóa, phê bằng bút đỏ"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-2">
                      <dt className="w-[76px] shrink-0 font-semibold text-muted">{k}:</dt>
                      <dd className="hand flex-1 border-b border-dotted border-muted/60 text-[21px] leading-7 text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/phoi-do"
                    className="inline-flex h-13 items-center gap-2 rounded-[12px] bg-ink px-6 text-[16px] font-bold text-white shadow-[0_10px_22px_-12px_rgba(33,23,102,.9)] hover:bg-ink-deep"
                  >
                    Mở vở phối đồ <ArrowRight className="size-5" aria-hidden />
                  </Link>
                  <Link
                    href="/kham-pha"
                    className="inline-flex h-13 items-center rounded-[12px] border-[1.5px] border-ink px-5 text-[16px] font-bold text-ink hover:bg-ink-soft"
                  >
                    Tìm hiểu trang phục
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-3 items-end gap-1 sm:gap-3" aria-label="Ba bộ phối mẫu">
              {EXAMPLE_LOOKS.map((ex, i) => (
                <Link
                  key={ex.title}
                  href={`/phoi-do?l=${encodeLook(ex.config, ex.title)}`}
                  className={`group relative flex flex-col items-center ${i === 1 ? "-translate-y-6" : ""}`}
                >
                  <Figure look={ex.config} className="h-[clamp(240px,40vw,470px)] w-full drop-shadow-[0_18px_18px_rgba(10,4,40,.35)] transition-transform duration-300 group-hover:-translate-y-1" title={ex.title} />
                  <span
                    className="mt-1 rounded-full border-[3px] border-white px-2.5 py-0.5 text-center text-[12px] font-bold leading-tight text-ink-deep shadow-[0_3px_6px_rgba(0,0,0,.25)] sm:text-[14px]"
                    style={{ background: STICKERS[i], rotate: `${[-4, 3, -2][i]}deg` }}
                  >
                    {ex.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- Demo sửa bài --------------------------- */}
        <section className="bg-cover pb-16">
          <div className="paper sheet-shadow mx-auto max-w-[1080px] rounded-[14px] px-6 py-10 sm:px-12 sm:pl-20 lg:py-14">
            <h2 className="max-w-[20ch] text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink-deep">
              Mặc đẹp chưa đủ, <span className="hand font-normal text-redpen">phải mặc đúng</span>
            </h2>
            <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-muted">
              Mỗi lựa chọn đều đi qua bộ kiểm tra văn hóa: dịp nào hợp áo nào, màu nào dễ trùng cô dâu, chi tiết nào làm mất đặc trưng trang phục. Thử sửa bài dưới đây xem.
            </p>
            <div className="mt-8">
              <FixDemo />
            </div>
          </div>
        </section>

        {/* ---------------------------- Mục lục ---------------------------- */}
        <section className="bg-cover pb-16">
          <div className="mx-auto grid max-w-[1080px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="text-white">
              <h2 className="text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.05] tracking-[-0.025em]">
                Sổ tay <span className="hand font-normal text-cover-lime">văn hóa</span>
              </h2>
              <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-white/80">
                Nguồn gốc, cấu tạo, ý nghĩa và cách remix của từng loại áo. Mỗi thông tin được gắn nhãn: có tư liệu, cách hiểu dân gian hay còn nhiều giả thuyết.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {EVENTS.slice(0, 6).map((e) => (
                  <Link key={e.id} href={`/phoi-do?dip=${e.id}`} className="rounded-full bg-white/10 px-3 py-1.5 text-[14px] font-semibold text-white hover:bg-white/20">
                    {e.name}
                  </Link>
                ))}
              </div>
            </div>
            <ol className="paper-plain sheet-shadow divide-y divide-dashed divide-ink/25 overflow-hidden rounded-[14px]">
              {GARMENTS.map((g) => (
                <li key={g.id}>
                  <Link href={`/kham-pha/${g.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 hover:bg-ink-soft/60 sm:px-6">
                    <span className="min-w-0">
                      <span className="block text-[19px] font-extrabold text-ink-deep">{g.name}</span>
                      <span className="block text-[14.5px] text-muted">
                        {g.tagline} ·{" "}
                        {g.regions === "ca-nuoc" ? "cả nước" : g.regions.map((r) => REGIONS.find((x) => x.id === r)!.name).join(", ")}
                      </span>
                    </span>
                    <ArrowRight className="size-5 text-ink transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
