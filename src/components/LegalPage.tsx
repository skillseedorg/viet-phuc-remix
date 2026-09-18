import Link from "next/link";
import SiteFooter from "./SiteFooter";

import { CONTACT_EMAIL } from "@/lib/site";

export { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME } from "@/lib/site";

export type LegalSection = { id: string; heading: string; body: React.ReactNode };

const LEGAL_LINKS = [
  { href: "/quyen-rieng-tu", label: "Quyền riêng tư" },
  { href: "/dieu-khoan", label: "Điều khoản sử dụng" },
  { href: "/ban-quyen", label: "Bản quyền" },
  { href: "/lien-he", label: "Liên hệ" },
];

/** Khung trang văn bản (chính sách, điều khoản, bản quyền, liên hệ) theo phong cách tờ giấy ô ly. */
export default function LegalPage({
  title,
  accent,
  updated,
  intro,
  sections,
  current,
}: {
  title: string;
  accent?: string;
  updated?: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  current: string;
}) {
  return (
    <>
      <main className="mx-auto max-w-[1080px] px-2 pb-16 pt-4 sm:px-6 sm:pt-6">
        <article className="paper sheet-shadow rounded-[14px] px-5 py-8 sm:px-12 sm:pl-20 lg:py-12">
          <nav aria-label="Văn bản pháp lý" className="mb-8 flex flex-wrap gap-2">
            {LEGAL_LINKS.map((l) => (
              <Link prefetch={false}
                key={l.href}
                href={l.href}
                aria-current={l.href === current ? "page" : undefined}
                className={
                  l.href === current
                    ? "rounded-full bg-ink px-3 py-1.5 text-[13.5px] font-bold text-white"
                    : "rounded-full bg-white px-3 py-1.5 text-[13.5px] font-semibold text-ink-deep hover:bg-ink-soft"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <h1 className="max-w-[20ch] text-[clamp(32px,4.2vw,52px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-deep">
            {title} {accent && <span className="hand font-normal text-redpen">{accent}</span>}
          </h1>
          {updated && <p className="mt-3 text-[14px] font-semibold text-muted">Cập nhật lần cuối: {updated}</p>}
          <div className="mt-5 max-w-[68ch] text-[16.5px] leading-relaxed text-text">{intro}</div>

          {sections.length > 3 && (
            <nav aria-label="Mục lục" className="mt-8 max-w-[68ch] rounded-[12px] bg-white/80 px-5 py-4">
              <p className="hand text-[20px] text-ink">Mục lục</p>
              <ol className="mt-1 grid gap-x-6 gap-y-1 text-[14.5px] sm:grid-cols-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-ink-deep underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {i + 1}. {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="legal mt-10 max-w-[68ch] space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-[22px] font-extrabold tracking-[-0.015em] text-ink-deep">
                  {sections.length > 3 ? `${i + 1}. ` : ""}
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-text">{s.body}</div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

export function Mail({ subject }: { subject?: string }) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
      className="font-semibold text-ink underline underline-offset-4"
    >
      {CONTACT_EMAIL}
    </a>
  );
}
