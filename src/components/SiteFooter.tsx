import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

const LINKS = [
  { href: "/cam-ket", label: "Cam kết văn hóa" },
  { href: "/cam-ket#bao-sai", label: "Báo thông tin sai" },
  { href: "/quyen-rieng-tu", label: "Quyền riêng tư" },
  { href: "/dieu-khoan", label: "Điều khoản" },
  { href: "/ban-quyen", label: "Bản quyền" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="cover border-t border-white/10 pb-24 text-white/75 lg:pb-0">
      <div className="mx-auto max-w-[1320px] px-4 py-7 text-[14px] sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-semibold text-white">Việt phục Remix</span>
          <nav aria-label="Liên kết cuối trang" className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((l) => (
              <Link prefetch={false} key={l.href} href={l.href} className="hover:text-white hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-white/65">
          <span>© {year} Việt phục Remix. Bảo lưu mọi quyền.</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white hover:underline">
            {CONTACT_EMAIL}
          </a>
          <span className="sm:ml-auto">Nhân vật và bộ phối mẫu là hình minh họa.</span>
        </div>
      </div>
    </footer>
  );
}
