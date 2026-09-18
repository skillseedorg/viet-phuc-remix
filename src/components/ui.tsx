"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { inkOn } from "@/lib/harmony";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ------------------------------ Nút ------------------------------ */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ink" | "outline" | "ghost" | "red" | "paper";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  href?: string;
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 select-none whitespace-nowrap";

const btnVariant = {
  ink: "bg-ink text-white shadow-[0_1px_1px_rgba(33,23,102,.35),0_8px_18px_-10px_rgba(33,23,102,.8)] hover:bg-ink-deep",
  outline: "border-[1.5px] border-ink text-ink bg-white/80 hover:bg-ink-soft",
  ghost: "text-ink hover:bg-ink-soft",
  red: "bg-redpen text-white hover:bg-[#a9152c] shadow-[0_8px_18px_-10px_rgba(160,20,40,.8)]",
  paper: "bg-white text-ink-deep hover:bg-ink-soft shadow-[0_1px_1px_rgba(0,0,0,.2),0_10px_22px_-12px_rgba(0,0,0,.6)]",
};

const btnSize = { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-[15px]", lg: "h-13 px-6 text-base" };

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "ink", size = "md", loading, className, children, href, ...rest },
  ref,
) {
  const cls = cx(btnBase, btnVariant[variant], btnSize[size], className);
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button ref={ref} className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

/* ------------------------- Ô chọn đánh dấu ------------------------- */

export function InkTick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx("tick", className)} aria-hidden>
      <path d="M4 13.5 L9.5 18.5 L20.5 5" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Choice({
  selected,
  onClick,
  children,
  hint,
  tone = "ink",
  className,
  type = "check",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
  tone?: "ink" | "modern";
  className?: string;
  type?: "check" | "radio";
}) {
  return (
    <button
      type="button"
      role={type === "radio" ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={onClick}
      title={hint}
      className={cx(
        "group relative inline-flex min-h-10 items-center gap-2 rounded-[10px] border-[1.5px] bg-white px-2.5 py-1.5 text-left text-[14px] leading-tight transition-colors",
        selected ? "border-ink bg-ink-soft text-ink-deep" : "border-grid text-text hover:border-ink/60",
        className,
      )}
    >
      <span
        className={cx(
          "grid size-5 shrink-0 place-items-center border-[1.5px] bg-white",
          type === "radio" ? "rounded-full" : "rounded-[4px]",
          selected ? "border-ink text-ink" : "border-muted/50 text-transparent",
        )}
      >
        {selected && <InkTick className="size-4" />}
      </span>
      <span className="font-medium">{children}</span>
      {tone === "modern" && (
        <span className="hand ml-0.5 rounded bg-cover-lime/60 px-1 text-[13px] leading-5 text-ink-deep">mới</span>
      )}
    </button>
  );
}

/* ---------------------------- Mẫu vải ---------------------------- */

export function Swatch({
  hex,
  name,
  selected,
  onClick,
  size = 44,
}: {
  hex: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      title={name}
      onClick={onClick}
      className="group relative grid place-items-center"
      style={{ width: size + 12, height: size + 12 }}
    >
      <span
        className="pinked block transition-transform duration-150 group-hover:-rotate-3 group-hover:scale-105"
        style={{ width: size, height: size, background: hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)" }}
      />
      {selected && (
        <>
          <svg viewBox="0 0 60 60" className="ink-draw pointer-events-none absolute inset-0 size-full" aria-hidden>
            <path
              d="M8,32 Q6,8 30,6 Q55,6 54,30 Q54,55 30,55 Q7,55 9,28"
              pathLength={1}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute" style={{ color: inkOn(hex) }}>
            <InkTick className="size-5" />
          </span>
        </>
      )}
    </button>
  );
}

/* ---------------------------- Nhãn vở ---------------------------- */

export function NhanVo({
  rows,
  title,
  className,
  color = "var(--color-cover)",
}: {
  rows: [string, React.ReactNode][];
  title?: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cx("nhan-vo px-6 pb-5 pt-4", className)} style={{ color }}>
      {title && <div className="mb-2 text-center text-[13px] font-extrabold uppercase tracking-[0.14em]">{title}</div>}
      <dl className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2 text-[14px]">
            <dt className="shrink-0 font-semibold text-muted">{k}:</dt>
            <dd className="hand min-w-0 flex-1 truncate border-b border-dotted border-muted/60 text-[19px] leading-6 text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------ Tiêu đề bài tập ------------------------ */

export function Exercise({
  n,
  title,
  aside,
  children,
  id,
}: {
  n: number;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-extrabold text-ink-deep">
          <span className="underline decoration-ink/40 decoration-2 underline-offset-4">Bài {n}.</span> {title}
        </h3>
        {aside}
      </header>
      {children}
    </section>
  );
}

/* ---------------------------- Sticker ---------------------------- */

export function Sticker({ children, color = "#c8e04a", className }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border-[3px] border-white px-2.5 py-0.5 text-[12.5px] font-bold text-ink-deep shadow-[0_2px_4px_rgba(0,0,0,.18)]",
        className,
      )}
      style={{ background: color }}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[14px] font-semibold text-ink-deep">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[13px] text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-[10px] border-[1.5px] border-grid bg-white px-3 py-2.5 text-[15px] text-text placeholder:text-muted/80 focus:border-ink focus:outline-none";
