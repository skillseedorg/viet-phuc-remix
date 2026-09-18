import { COLORS, colorById, type ColorId } from "./kb";
import type { LookConfig } from "./look";

type HSL = { h: number; s: number; l: number };

export function hexToHsl(hex: string): HSL {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

const hueDiff = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

const isNeutral = (c: HSL) => c.s < 0.2 || c.l > 0.9 || c.l < 0.16;

/** Những bộ ba màu đã quen mắt trong trang phục truyền thống. */
const CLASSIC: { colors: ColorId[]; name: string }[] = [
  { colors: ["nau-non", "den-lanh", "xanh-hoa-ly"], name: "Bộ màu tứ thân quen thuộc" },
  { colors: ["do-son", "vang-hoa-hoe"], name: "Đỏ vàng ngày Tết" },
  { colors: ["tim-hue", "trang-nga"], name: "Tím trắng xứ Huế" },
  { colors: ["den-lanh", "trang-nga"], name: "Đen trắng bà ba Nam Bộ" },
  { colors: ["cham", "trang-nga"], name: "Chàm và trắng mộc" },
];

export type Harmony = {
  score: number;
  scheme: string;
  notes: string[];
  classic?: string;
};

export function scoreColors(ids: [ColorId, ColorId, ColorId]): Harmony {
  const [main, second, accent] = ids.map((id) => hexToHsl(colorById(id).hex));
  const chroma = [main, second, accent].filter((c) => !isNeutral(c));
  const notes: string[] = [];
  let score: number;
  let scheme: string;

  if (chroma.length <= 1) {
    scheme = "Nhấn một màu";
    score = 86;
    notes.push("Nền trung tính giúp màu chính nổi bật, rất dễ mặc.");
  } else if (chroma.length === 2) {
    const d = hueDiff(chroma[0].h, chroma[1].h);
    if (d < 48) {
      scheme = "Tương đồng";
      score = 88;
      notes.push("Hai màu gần nhau trên vòng màu, cảm giác êm và liền mạch.");
    } else if (d >= 150) {
      scheme = "Bổ túc";
      score = 80;
      notes.push("Hai màu đối nhau tạo điểm nhấn mạnh, nên để một màu chiếm diện tích nhỏ.");
      if (chroma[0].s > 0.55 && chroma[1].s > 0.55 && Math.abs(chroma[0].l - chroma[1].l) < 0.15) {
        score -= 16;
        notes.push("Cả hai màu đều rực và cùng độ sáng nên dễ bị chói.");
      }
    } else if (d >= 100) {
      scheme = "Bổ túc lệch";
      score = 76;
      notes.push("Tương phản vừa đủ, hợp ảnh chụp ngoài trời.");
    } else {
      scheme = "Tương phản gần";
      score = 62;
      notes.push("Hai màu không đủ gần để êm, cũng không đủ xa để thành điểm nhấn. Thử đổi một màu sang trung tính.");
    }
  } else {
    const diffs = [hueDiff(main.h, second.h), hueDiff(second.h, accent.h), hueDiff(main.h, accent.h)];
    const maxD = Math.max(...diffs);
    if (maxD < 60) {
      scheme = "Tương đồng ba màu";
      score = 86;
      notes.push("Ba màu cùng một vùng vòng màu, rất hài hòa.");
    } else if (diffs.every((d) => d > 90)) {
      scheme = "Tam giác màu";
      score = 70;
      notes.push("Ba màu cách đều nhau khá rực rỡ, nên chọn một màu làm chủ đạo.");
    } else {
      scheme = "Đa sắc";
      score = 58;
      notes.push("Ba màu rực cùng lúc dễ rối. Đưa quần hoặc phụ kiện về màu trung tính sẽ gọn hơn.");
    }
  }

  if (Math.abs(main.l - second.l) < 0.07 && hueDiff(main.h, second.h) < 20 && !(isNeutral(main) && isNeutral(second))) {
    score -= 6;
    notes.push("Áo và quần gần như trùng màu, có thể thiếu chiều sâu.");
  }

  const classic = CLASSIC.find((c) => c.colors.every((id) => ids.includes(id)));
  if (classic) {
    score = Math.max(score, 80) + 8;
    scheme = "Phối màu kinh điển";
    notes.length = 0;
    notes.push(`${classic.name}: cách phối màu đã quen mắt trong trang phục truyền thống.`);
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), scheme, notes, classic: classic?.name };
}

export function checkHarmony(look: LookConfig): Harmony & { betterAccents: ColorId[] } {
  const base = scoreColors([look.main, look.secondary, look.accent]);
  const betterAccents = COLORS.map((c) => ({ id: c.id, s: scoreColors([look.main, look.secondary, c.id]).score }))
    .filter((x) => x.id !== look.accent && x.s > base.score)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.id);
  return { ...base, betterAccents };
}

/** Chọn màu chữ đọc được trên một nền bất kỳ. */
export function inkOn(hex: string) {
  return hexToHsl(hex).l > 0.62 ? "#1D1B22" : "#FFFFFF";
}

export function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 + amount))));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function hexToLab(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = lin((n >> 16) & 255);
  const g = lin((n >> 8) & 255);
  const b = lin(n & 255);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

/** Tìm màu truyền thống gần nhất với một mã hex quan sát được (khoảng cách CIELAB). */
export function nearestColor(hex: string | undefined | null): ColorId | null {
  if (!hex || !/^#?[0-9a-f]{6}$/i.test(hex.trim())) return null;
  const target = hexToLab(hex.trim().startsWith("#") ? hex.trim() : `#${hex.trim()}`);
  let best: ColorId | null = null;
  let bestD = Infinity;
  for (const c of COLORS) {
    const [l, a, b] = hexToLab(c.hex);
    const d = (l - target[0]) ** 2 + (a - target[1]) ** 2 + (b - target[2]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c.id;
    }
  }
  return best;
}
