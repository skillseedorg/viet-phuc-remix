import Figure from "./Figure";
import { checkCulture } from "@/lib/culture";
import { checkHarmony } from "@/lib/harmony";
import { colorById, eventById, garmentById, names, REMIX_LABEL } from "@/lib/kb";
import type { LookConfig } from "@/lib/look";

export function overallScore(look: LookConfig) {
  const c = checkCulture(look).score;
  const h = checkHarmony(look).score;
  return Math.round(((c * 0.6 + h * 0.4) / 10) * 2) / 2;
}

/** Thẻ lookbook dạng nhãn vở — dùng cho chia sẻ, xuất ảnh, lưới lookbook. */
export default function LookCard({
  look,
  title,
  owner,
  caption,
  face,
  compact,
}: {
  look: LookConfig;
  title: string;
  owner?: string | null;
  caption?: string;
  face?: string | null;
  compact?: boolean;
}) {
  const g = garmentById(look.garment);
  const report = checkCulture(look);
  const harmony = checkHarmony(look);
  const score = overallScore(look);
  const accessories = [look.head !== "none" ? names.head(look.head) : null, names.feet(look.feet), ...look.extras.map(names.extra)]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="relative overflow-hidden rounded-[18px] bg-white text-text" style={{ outline: "2px solid var(--color-cover)", outlineOffset: -8 }}>
      <div className={compact ? "grid grid-cols-[42%_1fr] gap-1 p-4" : "grid grid-cols-[44%_1fr] gap-2 p-6"}>
        <div className="paper-plain relative rounded-[10px]">
          <Figure look={look} face={face} className="mx-auto h-full max-h-[420px] w-full" title={`${title}: ${g.name}`} />
        </div>
        <div className="flex min-w-0 flex-col py-1">
          <h3 className={`hand leading-tight text-ink ${compact ? "text-[22px]" : "text-[30px]"}`}>{title}</h3>
          {owner && <p className="text-[12.5px] text-muted">của {owner}</p>}
          <dl className={`mt-3 space-y-1.5 ${compact ? "text-[12.5px]" : "text-[14px]"}`}>
            {[
              ["Áo", `${g.name}${look.garment === "ao-dai" && look.length !== "dai" ? `, ${names.length(look.length).toLowerCase()}` : ""}`],
              ["Dịp", look.event ? eventById(look.event).name : "Tự do"],
              ["Chất liệu", `${names.fabric(look.fabric)}, hoa văn ${names.pattern(look.pattern).toLowerCase()}`],
              ["Phối cùng", `${names.bottom(look.bottom)}${look.outer !== "none" ? `, ${names.outer(look.outer).toLowerCase()}` : ""}`],
              ["Phụ kiện", accessories],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[78px_1fr] gap-1.5">
                <dt className="font-semibold text-muted">{k}</dt>
                <dd className="min-w-0 border-b border-dotted border-muted/50 pb-0.5 text-text">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-center gap-1.5">
            {[look.main, look.secondary, look.accent].map((c, i) => (
              <span key={i} className="pinked block size-7" style={{ background: colorById(c).hex }} title={colorById(c).name} />
            ))}
            <span className="ml-1 text-[12.5px] text-muted">{harmony.scheme}</span>
          </div>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div className="text-[12px] leading-snug text-muted">
              <div>{REMIX_LABEL[report.remixLevel]}</div>
              <div>
                Văn hóa {report.score} · Màu {harmony.score}
              </div>
            </div>
            <div className="relative grid size-16 shrink-0 place-items-center" aria-label={`Điểm ${score} trên 10`}>
              <svg viewBox="0 0 64 64" className="absolute inset-0" aria-hidden>
                <path d="M10,34 Q8,8 34,7 Q58,8 57,32 Q57,57 32,57 Q7,57 11,30" fill="none" stroke="var(--color-redpen)" strokeWidth={2.5} strokeLinecap="round" />
              </svg>
              <span className="hand text-[28px] leading-none text-redpen">{score}</span>
            </div>
          </div>
        </div>
      </div>
      {caption && !compact && <p className="hand border-t border-dashed border-grid px-6 py-3 text-[18px] text-ink">“{caption}”</p>}
    </article>
  );
}
