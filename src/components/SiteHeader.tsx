"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Camera, Columns3, LogIn, NotebookPen, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "./Providers";
import { cx } from "./ui";

const NAV = [
  { href: "/phoi-do", label: "Phối đồ", icon: Sparkles, mobile: true },
  { href: "/cham-outfit", label: "Chấm outfit", icon: Camera, mobile: true },
  { href: "/kham-pha", label: "Khám phá", icon: BookOpenText, mobile: true },
  { href: "/lookbook", label: "Lookbook", icon: NotebookPen, mobile: true },
  { href: "/so-sanh", label: "So sánh", icon: Columns3, mobile: true },
  { href: "/cam-ket", label: "Cam kết văn hóa", icon: ShieldCheck, mobile: false },
];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="1" y="1" width="38" height="38" rx="9" fill="#fff" />
      <path d="M5,25 L20,8 L35,25 Q20,29 5,25 Z" fill="#E4CC8E" stroke="#3a27a3" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20,9 L14,26 M20,9 L26,26" stroke="#3a27a3" strokeWidth="1.2" opacity=".5" />
      <path d="M11,31 L17,35 L31,19" fill="none" stroke="#cf1f3a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SiteHeader() {
  const path = usePathname();
  const { user, displayName, compare, authLoading } = useApp();
  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <>
      <header className="cover sticky top-0 z-40 border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-4 px-4 sm:px-6">
          <Link prefetch={false} href="/" className="flex items-center gap-2.5 text-white" aria-label="Việt phục Remix, trang chủ">
            <LogoMark className="size-9" />
            <span className="text-[17px] font-extrabold tracking-[-0.02em]">
              Việt phục <span className="hand text-[22px] font-normal text-cover-lime">Remix</span>
            </span>
          </Link>

          <nav aria-label="Chính" className="ml-4 hidden items-stretch gap-1 lg:flex">
            {NAV.map((n) => (
              <Link prefetch={false}
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={cx(
                  "relative flex h-10 items-center gap-1.5 rounded-t-[10px] px-2.5 text-[14.5px] font-semibold transition-colors xl:px-3",
                  active(n.href) ? "bg-paper text-ink-deep" : "text-white/85 hover:bg-white/10 hover:text-white",
                )}
                style={active(n.href) ? { marginBottom: -12, height: 52, paddingBottom: 12 } : undefined}
              >
                {n.label}
                {n.href === "/so-sanh" && compare.length > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-redpen text-[11px] font-bold text-white">{compare.length}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {authLoading ? null : user ? (
              <Link prefetch={false}
                href="/tai-khoan"
                className="flex h-10 max-w-[180px] items-center gap-2 rounded-full bg-white/10 pl-1 pr-3 text-[14px] font-semibold text-white hover:bg-white/20"
              >
                <span className="grid size-8 place-items-center rounded-full bg-cover-lime text-[14px] font-extrabold uppercase text-ink-deep">
                  {(displayName ?? "?").slice(0, 1)}
                </span>
                <span className="truncate">{displayName}</span>
              </Link>
            ) : (
              <Link prefetch={false}
                href="/dang-nhap"
                className="flex h-10 items-center gap-2 rounded-[10px] bg-white px-3.5 text-[14px] font-bold text-ink-deep hover:bg-ink-soft"
              >
                <LogIn className="size-4" aria-hidden /> Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav
        aria-label="Chính (di động)"
        className="cover fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/15 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV.filter((n) => n.mobile).map((n) => (
          <Link prefetch={false}
            key={n.href}
            href={n.href}
            aria-current={active(n.href) ? "page" : undefined}
            className={cx(
              "relative flex h-15 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
              active(n.href) ? "text-cover-lime" : "text-white/80",
            )}
          >
            <n.icon className="size-5" aria-hidden />
            <span className="max-w-full truncate px-1">{n.label}</span>
            {n.href === "/so-sanh" && compare.length > 0 && (
              <span className="absolute right-[22%] top-2 grid size-4 place-items-center rounded-full bg-redpen text-[10px] font-bold text-white">
                {compare.length}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
