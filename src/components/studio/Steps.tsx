"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import Figure from "../Figure";
import WeatherBox from "./WeatherBox";
import { Choice, InkTick, cx } from "../ui";
import { checkHarmony, inkOn } from "@/lib/harmony";
import {
  BOTTOMS,
  COLORS,
  EVENTS,
  EXTRAS,
  FABRICS,
  FEET,
  GARMENTS,
  HEADS,
  LENGTHS,
  OUTERS,
  PATTERNS,
  REGIONS,
  colorById,
  eventById,
  garmentById,
  type ColorId,
} from "@/lib/kb";
import { withGarment, type LookConfig } from "@/lib/look";
import type { WeatherNow } from "@/lib/weather";

export type StepProps = { look: LookConfig; update: (patch: Partial<LookConfig>) => void };

function Group({ title, note, children }: { title: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[15px] font-bold text-ink-deep">{title}</legend>
      {children}
      {note && <p className="mt-2 text-[13.5px] leading-snug text-muted">{note}</p>}
    </fieldset>
  );
}

const REMIX_HINT = ["Không remix", "Remix nhẹ", "Remix thoải mái"] as const;

/* ------------------------------ Bước 1: Dịp ------------------------------ */

export function StepOccasion({ look, update, weather, onWeather }: StepProps & { weather: WeatherNow | null; onWeather: (w: WeatherNow | null) => void }) {
  const ev = look.event ? eventById(look.event) : null;
  return (
    <div className="space-y-7">
      <div role="radiogroup" aria-label="Dịp" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {EVENTS.map((e) => {
          const selected = look.event === e.id;
          return (
            <button
              key={e.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => update({ event: selected ? null : e.id })}
              className={cx(
                "relative flex min-h-[76px] flex-col justify-between rounded-[12px] border-[1.5px] bg-white p-3 text-left transition-colors",
                selected ? "border-ink bg-ink-soft" : "border-grid hover:border-ink/60",
              )}
            >
              <span className={cx("pr-5 text-[14.5px] font-bold leading-tight", selected ? "text-ink-deep" : "text-text")}>{e.name}</span>
              <span className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
                <span className="flex gap-0.5" aria-label={`Trang trọng ${e.formality} trên 3`}>
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={cx("h-1.5 w-3 rounded-full", n <= e.formality ? "bg-redpen" : "bg-grid")} />
                  ))}
                </span>
                {REMIX_HINT[e.maxRemix]}
              </span>
              {selected && <InkTick className="absolute right-2 top-2 size-5 text-ink" />}
            </button>
          );
        })}
      </div>

      {ev && (
        <p className="fade-up rounded-[12px] bg-white/80 px-4 py-3 text-[14.5px] leading-relaxed">
          <span className="hand text-[20px] text-ink">Mẹo: </span>
          {ev.tip}
        </p>
      )}

      <Group title="Vùng miền (không bắt buộc)" note={look.region ? REGIONS.find((r) => r.id === look.region)!.hint : "Chọn vùng để được nhắc khi pha trộn phụ kiện của vùng khác."}>
        <div role="radiogroup" aria-label="Vùng miền" className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <Choice key={r.id} type="radio" selected={look.region === r.id} onClick={() => update({ region: look.region === r.id ? null : r.id })}>
              {r.name}
            </Choice>
          ))}
        </div>
      </Group>

      <details className="group rounded-[12px] border-[1.5px] border-dashed border-ink/30 bg-white/60 open:bg-white/80" open={Boolean(weather)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-[14.5px] font-bold text-ink-deep [&::-webkit-details-marker]:hidden">
          Xem thời tiết để chọn chất liệu
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="px-3 pb-3">
          <WeatherBox event={look.event} weather={weather} onWeather={onWeather} onApply={update} />
        </div>
      </details>
    </div>
  );
}

/* ------------------------------ Bước 2: Áo ------------------------------ */

export function StepGarment({ look, update }: StepProps) {
  const ev = look.event ? eventById(look.event) : null;
  const g = garmentById(look.garment);
  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label="Loại áo" className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 xl:grid-cols-3">
        {GARMENTS.map((item) => {
          const selected = look.garment === item.id;
          const recommended = ev?.recommended.includes(item.id);
          const avoid = ev?.avoid.some((a) => a.garment === item.id);
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => update({ garment: item.id })}
              className={cx(
                "relative grid grid-cols-[56px_1fr] items-center gap-2 rounded-[12px] border-[1.5px] bg-white p-2 pr-3 text-left transition-colors",
                selected ? "border-ink bg-ink-soft" : "border-grid hover:border-ink/60",
              )}
            >
              <Figure look={withGarment({ ...look, garment: item.id }, item.id)} className="h-24 w-full" title="" />
              <span className="min-w-0">
                <span className={cx("block text-[15px] font-bold leading-tight", selected ? "text-ink-deep" : "text-text")}>{item.name}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{item.tagline}</span>
                {recommended && <span className="hand mt-1 inline-block rounded-full bg-redpen px-2 text-[14px] leading-5 text-white">hợp dịp</span>}
                {avoid && <span className="mt-1 inline-block text-[12.5px] font-semibold text-redpen">chưa hợp dịp</span>}
              </span>
              {selected && <InkTick className="absolute right-2 top-2 size-5 text-ink" />}
            </button>
          );
        })}
      </div>

      <p className="text-[14.5px] leading-relaxed">
        <span className="font-bold text-ink-deep">{g.name}.</span> {g.summary}{" "}
        <Link href={`/kham-pha/${g.id}`} className="inline-flex items-center gap-0.5 font-semibold text-ink underline underline-offset-4">
          Đọc thêm <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </p>

      {look.garment === "ao-dai" && (
        <Group title="Độ dài tà" note={LENGTHS.find((l) => l.id === look.length)!.info}>
          <div role="radiogroup" aria-label="Độ dài tà" className="flex flex-wrap gap-2">
            {LENGTHS.map((l) => (
              <Choice key={l.id} type="radio" selected={look.length === l.id} onClick={() => update({ length: l.id })}>
                {l.name}
              </Choice>
            ))}
          </div>
        </Group>
      )}
    </div>
  );
}

/* ------------------------------ Bước 3: Màu ------------------------------ */

export type ColorSlot = "main" | "secondary" | "accent";

const PALETTES: { name: string; colors: [ColorId, ColorId, ColorId] }[] = [
  { name: "Đỏ vàng ngày Tết", colors: ["do-son", "trang-nga", "vang-hoa-hoe"] },
  { name: "Tím trắng xứ Huế", colors: ["tim-hue", "trang-nga", "vang-hoa-hoe"] },
  { name: "Nâu non, hoa lý", colors: ["nau-non", "den-lanh", "xanh-hoa-ly"] },
  { name: "Trắng đen Nam Bộ", colors: ["trang-nga", "den-lanh", "do-son"] },
  { name: "Xanh ngọc thanh lịch", colors: ["xanh-ngoc", "trang-nga", "vang-hoa-hoe"] },
  { name: "Hồng đào dịu dàng", colors: ["hong-dao", "trang-nga", "xanh-hoa-ly"] },
  { name: "Chàm mộc", colors: ["cham", "trang-nga", "nau-non"] },
];

export function StepColor({ look, update, slot, onSlot }: StepProps & { slot: ColorSlot; onSlot: (s: ColorSlot) => void }) {
  const harmony = checkHarmony(look);
  const slots: { id: ColorSlot; label: string }[] = [
    { id: "main", label: "Áo" },
    { id: "secondary", label: look.garment === "ao-tu-than" ? "Váy" : "Quần, váy" },
    { id: "accent", label: "Khăn, phụ kiện" },
  ];

  return (
    <div className="space-y-7">
      <Group title="Phối màu có sẵn" note="Chạm một lần để tô cả áo, quần và phụ kiện.">
        <div className="flex flex-wrap gap-2">
          {PALETTES.map((p) => {
            const active = p.colors[0] === look.main && p.colors[1] === look.secondary && p.colors[2] === look.accent;
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={active}
                onClick={() => update({ main: p.colors[0], secondary: p.colors[1], accent: p.colors[2] })}
                className={cx(
                  "inline-flex h-10 items-center gap-2 rounded-full border-[1.5px] bg-white pl-1.5 pr-3 text-[13.5px] font-semibold",
                  active ? "border-ink bg-ink-soft text-ink-deep" : "border-grid text-text hover:border-ink/60",
                )}
              >
                <span className="flex -space-x-1.5">
                  {p.colors.map((c, i) => (
                    <span key={i} className="block size-6 rounded-full ring-2 ring-white" style={{ background: colorById(c).hex }} />
                  ))}
                </span>
                {p.name}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Hoặc tự tô từng phần">
        <div role="tablist" aria-label="Phần cần tô màu" className="grid grid-cols-3 gap-2">
          {slots.map((s) => {
            const active = slot === s.id;
            const c = colorById(look[s.id]);
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSlot(s.id)}
                className={cx(
                  "flex items-center gap-2 rounded-[12px] border-[1.5px] bg-white p-2 text-left transition-colors",
                  active ? "border-ink bg-ink-soft" : "border-grid hover:border-ink/60",
                )}
              >
                <span className="pinked block size-8 shrink-0" style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)" }} />
                <span className="min-w-0">
                  <span className={cx("block text-[13.5px] font-bold leading-tight", active ? "text-ink-deep" : "text-text")}>{s.label}</span>
                  <span className="block truncate text-[12px] text-muted">{c.name}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div role="radiogroup" aria-label={`Màu cho ${slots.find((s) => s.id === slot)!.label}`} className="mt-3 grid grid-cols-4 gap-x-1 gap-y-3 sm:grid-cols-7">
          {COLORS.map((c) => {
            const selected = look[slot] === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                title={c.meaning}
                onClick={() => update({ [slot]: c.id })}
                className="group flex flex-col items-center gap-1"
              >
                <span className="relative grid size-11 place-items-center">
                  <span
                    className="pinked block size-9 transition-transform duration-150 group-hover:scale-105"
                    style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)" }}
                  />
                  {selected && (
                    <span className="absolute" style={{ color: inkOn(c.hex) }}>
                      <InkTick className="size-5" />
                    </span>
                  )}
                  {selected && <span className="absolute inset-0 rounded-full ring-[2.5px] ring-ink" aria-hidden />}
                </span>
                <span className={cx("text-center text-[11.5px] leading-tight", selected ? "font-bold text-ink-deep" : "text-muted")}>{c.name}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[13.5px] leading-snug text-muted">{colorById(look[slot]).meaning}</p>
      </Group>

      <div className="rounded-[12px] bg-white/85 px-4 py-3 text-[14px]">
        <p>
          <span className="hand text-[20px] text-redpen">
            {harmony.scheme} · {harmony.score}/100
          </span>{" "}
          {harmony.notes.join(" ")}
        </p>
        {harmony.betterAccents.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink-deep">Khăn, phụ kiện hợp hơn:</span>
            {harmony.betterAccents.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => update({ accent: c })}
                className="inline-flex items-center gap-1.5 rounded-full border border-grid bg-white py-0.5 pl-0.5 pr-2.5 text-[13.5px] hover:border-ink"
              >
                <span className="block size-6 rounded-full" style={{ background: colorById(c).hex }} />
                {colorById(c).name}
              </button>
            ))}
          </div>
        )}
      </div>

      <Group title="Hoa văn" note={PATTERNS.find((p) => p.id === look.pattern)!.note ?? PATTERNS.find((p) => p.id === look.pattern)!.meaning}>
        <div role="radiogroup" aria-label="Hoa văn" className="flex flex-wrap gap-2">
          {PATTERNS.map((p) => (
            <Choice key={p.id} type="radio" selected={look.pattern === p.id} onClick={() => update({ pattern: p.id })}>
              {p.name}
            </Choice>
          ))}
        </div>
      </Group>

      <Group title="Chất liệu" note={FABRICS.find((f) => f.id === look.fabric)!.info}>
        <div role="radiogroup" aria-label="Chất liệu" className="flex flex-wrap gap-2">
          {FABRICS.map((f) => (
            <Choice key={f.id} type="radio" selected={look.fabric === f.id} onClick={() => update({ fabric: f.id })}>
              {f.name}
            </Choice>
          ))}
        </div>
      </Group>
    </div>
  );
}

/* ---------------------------- Bước 4: Phụ kiện ---------------------------- */

type Option = { id: string; name: string; info: string; modern?: boolean };

function OptionRows({
  label,
  items,
  isSelected,
  onPick,
  multi,
  groupId,
}: {
  label: string;
  items: Option[];
  isSelected: (id: string) => boolean;
  onPick: (id: string) => void;
  multi?: boolean;
  groupId: string;
}) {
  const trad = items.filter((i) => !i.modern);
  const modern = items.filter((i) => i.modern);
  const selected = items.filter((i) => isSelected(i.id) && i.info);
  return (
    <fieldset id={groupId} className="min-w-0 scroll-mt-40">
      <legend className="mb-2 text-[15px] font-bold text-ink-deep">{label}</legend>
      <div role={multi ? "group" : "radiogroup"} aria-label={label} className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {trad.map((it) => (
            <Choice key={it.id} type={multi ? "check" : "radio"} selected={isSelected(it.id)} onClick={() => onPick(it.id)}>
              {it.name}
            </Choice>
          ))}
        </div>
        {modern.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted">
              <Sparkles className="size-3.5" aria-hidden /> Remix hiện đại
            </span>
            {modern.map((it) => (
              <Choice key={it.id} type={multi ? "check" : "radio"} selected={isSelected(it.id)} onClick={() => onPick(it.id)}>
                {it.name}
              </Choice>
            ))}
          </div>
        )}
      </div>
      {selected.length > 0 && <p className="mt-2 text-[13.5px] leading-snug text-muted">{selected.map((s) => `${s.name}: ${s.info}`).join(" ")}</p>}
    </fieldset>
  );
}

export function StepAccessories({ look, update }: StepProps) {
  return (
    <div className="space-y-7">
      <OptionRows groupId="nhom-dau" label="Đội đầu" items={HEADS} isSelected={(id) => look.head === id} onPick={(id) => update({ head: id as LookConfig["head"] })} />
      <OptionRows groupId="nhom-duoi" label="Phần dưới" items={BOTTOMS} isSelected={(id) => look.bottom === id} onPick={(id) => update({ bottom: id as LookConfig["bottom"] })} />
      <OptionRows groupId="nhom-giay" label="Giày dép" items={FEET} isSelected={(id) => look.feet === id} onPick={(id) => update({ feet: id as LookConfig["feet"] })} />
      <OptionRows groupId="nhom-khoac" label="Áo khoác" items={OUTERS} isSelected={(id) => look.outer === id} onPick={(id) => update({ outer: id as LookConfig["outer"] })} />
      <OptionRows
        groupId="nhom-them"
        label="Phụ kiện thêm (chọn nhiều)"
        multi
        items={EXTRAS}
        isSelected={(id) => look.extras.includes(id as LookConfig["extras"][number])}
        onPick={(id) => {
          const x = id as LookConfig["extras"][number];
          update({ extras: look.extras.includes(x) ? look.extras.filter((e) => e !== x) : [...look.extras, x] });
        }}
      />
    </div>
  );
}
