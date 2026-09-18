import type {
  BottomId,
  ColorId,
  EventId,
  ExtraId,
  FabricId,
  FeetId,
  GarmentId,
  HeadId,
  LengthId,
  OuterId,
  PatternId,
  RegionId,
  StyleId,
} from "./kb";

export type SkinId = "s1" | "s2" | "s3" | "s4";
export type HairId = "bui" | "ngan" | "buoc";

export const SKINS: { id: SkinId; hex: string; shade: string }[] = [
  { id: "s1", hex: "#F3D2B8", shade: "#E3B899" },
  { id: "s2", hex: "#E2B48F", shade: "#CE9A72" },
  { id: "s3", hex: "#C18A62", shade: "#A7714B" },
  { id: "s4", hex: "#8C5B3E", shade: "#744630" },
];

export const HAIRS: { id: HairId; name: string }[] = [
  { id: "bui", name: "Búi" },
  { id: "buoc", name: "Buộc thấp" },
  { id: "ngan", name: "Tóc ngắn" },
];

export type LookConfig = {
  garment: GarmentId;
  event: EventId | null;
  region: RegionId | null;
  style: StyleId;
  main: ColorId;
  secondary: ColorId;
  accent: ColorId;
  pattern: PatternId;
  fabric: FabricId;
  length: LengthId;
  bottom: BottomId;
  outer: OuterId;
  head: HeadId;
  feet: FeetId;
  extras: ExtraId[];
  skin: SkinId;
  hair: HairId;
};

export type SavedLook = {
  id: string;
  title: string;
  config: LookConfig;
  note?: string;
  ai?: StylistResult | null;
  isPublic?: boolean;
  createdAt: string;
  owner?: string | null;
  source: "local" | "cloud";
};

export type StylistResult = {
  title: string;
  vibe: string;
  summary: string;
  whyItWorks: string[];
  culturalNote: string;
  tips: string[];
  caption: string;
  suggestions: { label: string; patch: Partial<LookConfig> }[];
};

export const DEFAULT_LOOK: LookConfig = {
  garment: "ao-dai",
  event: "tet",
  region: "bac",
  style: "thanh-lich",
  main: "do-son",
  secondary: "trang-nga",
  accent: "vang-hoa-hoe",
  pattern: "hoa-mai",
  fabric: "lua",
  length: "dai",
  bottom: "quan-lua",
  outer: "none",
  head: "khan-van",
  feet: "guoc-moc",
  extras: ["tui-gam"],
  skin: "s2",
  hair: "bui",
};

/** Cách phối gốc khi đổi sang một loại áo — giữ màu người dùng đã chọn. */
export const GARMENT_PRESET: Record<GarmentId, Partial<LookConfig>> = {
  "ao-dai": { bottom: "quan-lua", head: "non-la", feet: "guoc-moc", length: "dai", extras: [] },
  "ao-tu-than": { bottom: "vay-dai", head: "mo-qua", feet: "guoc-moc", extras: ["that-lung"], secondary: "den-lanh" },
  "ao-ngu-than": { bottom: "quan-lua", head: "khan-van", feet: "giay-hai", extras: ["tui-gam"] },
  "ao-ba-ba": { bottom: "quan-lua", head: "non-la", feet: "guoc-moc", extras: ["khan-ran"], secondary: "den-lanh", pattern: "tron" },
  "ao-nhat-binh": { bottom: "quan-lua", head: "khan-van", feet: "giay-hai", extras: ["tram-cai"], pattern: "may-hac", fabric: "gam" },
  "ao-tac": { bottom: "quan-lua", head: "khan-dong", feet: "giay-hai", extras: [], secondary: "trang-nga", fabric: "gam" },
};

export const EXAMPLE_LOOKS: { title: string; config: LookConfig }[] = [
  { title: "Chúc Tết nhà ngoại", config: { ...DEFAULT_LOOK } },
  {
    title: "Hội Lim mớ ba",
    config: {
      ...DEFAULT_LOOK,
      garment: "ao-tu-than",
      event: "le-hoi",
      region: "bac",
      style: "chuan",
      main: "nau-non",
      secondary: "den-lanh",
      accent: "xanh-hoa-ly",
      pattern: "tron",
      fabric: "dui",
      bottom: "vay-dai",
      head: "quai-thao",
      feet: "guoc-moc",
      extras: ["that-lung"],
      skin: "s3",
      hair: "buoc",
    },
  },
  {
    title: "Phố cổ Hội An, bản street",
    config: {
      ...DEFAULT_LOOK,
      garment: "ao-ba-ba",
      event: "dao-pho",
      region: "trung",
      style: "street",
      main: "xanh-ngoc",
      secondary: "cham",
      accent: "vang-hoa-hoe",
      pattern: "tron",
      fabric: "dui",
      bottom: "jeans",
      outer: "none",
      head: "non-la",
      feet: "sneaker",
      extras: ["khan-ran", "tui-tote"],
      skin: "s1",
      hair: "ngan",
    },
  },
];

export function withGarment(look: LookConfig, garment: GarmentId): LookConfig {
  return { ...look, ...GARMENT_PRESET[garment], garment };
}

/* ---------------- Chia sẻ qua URL (không cần database) ---------------- */

const KEYS: (keyof LookConfig)[] = [
  "garment", "event", "region", "style", "main", "secondary", "accent", "pattern",
  "fabric", "length", "bottom", "outer", "head", "feet", "extras", "skin", "hair",
];

export function encodeLook(look: LookConfig, title?: string): string {
  const arr = KEYS.map((k) => {
    const v = look[k];
    return Array.isArray(v) ? v.join("+") : (v ?? "");
  });
  if (title) arr.push(title);
  return encodeURIComponent(arr.join("~"));
}

export function decodeLook(raw: string | null | undefined): { config: LookConfig; title?: string } | null {
  if (!raw) return null;
  try {
    const parts = decodeURIComponent(raw).split("~");
    if (parts.length < KEYS.length) return null;
    const out: Record<string, unknown> = {};
    KEYS.forEach((k, i) => {
      const v = parts[i];
      if (k === "extras") out[k] = v ? v.split("+") : [];
      else if (k === "event" || k === "region") out[k] = v || null;
      else out[k] = v;
    });
    return { config: { ...DEFAULT_LOOK, ...(out as Partial<LookConfig>) }, title: parts[KEYS.length] };
  } catch {
    return null;
  }
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const PREVIEW_COLORS: Record<GarmentId, [ColorId, ColorId, ColorId]> = {
  "ao-dai": ["xanh-lam", "trang-nga", "vang-hoa-hoe"],
  "ao-tu-than": ["nau-non", "den-lanh", "xanh-hoa-ly"],
  "ao-ngu-than": ["do-son", "trang-nga", "vang-hoa-hoe"],
  "ao-ba-ba": ["trang-nga", "den-lanh", "do-son"],
  "ao-nhat-binh": ["tim-hue", "vang-hoa-hoe", "hong-dao"],
  "ao-tac": ["cham", "trang-nga", "vang-hoa-hoe"],
};

/** Bộ phối đại diện để minh họa từng loại áo. */
export function previewLook(garment: GarmentId): LookConfig {
  const [main, secondary, accent] = PREVIEW_COLORS[garment];
  return { ...withGarment(DEFAULT_LOOK, garment), main, secondary, accent, pattern: "tron", event: null };
}
