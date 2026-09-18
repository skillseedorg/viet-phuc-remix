import type { ColorId, GarmentId } from "./kb";
import type { LookConfig } from "./look";

export type PhotoResult = {
  hasPerson: boolean;
  observations: string[];
  outfit: { isTraditional: boolean; garmentGuess: GarmentId | null; comments: string[] };
  palette: ColorId[];
  paletteReason: string;
  recommendation: { label: string; reason: string; patch: Partial<LookConfig> };
};

export type AskResult = {
  answer: string;
  confidence: "cao" | "vua" | "thap";
  inScope: boolean;
  related: GarmentId[];
};

export type CompareResult = {
  best: number;
  verdict: string;
  looks: { strength: string; watch: string }[];
};

export async function postJSON<T>(url: string, body: unknown, token?: string | null): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  let data: { error?: string } & T;
  try {
    data = await res.json();
  } catch {
    throw new Error("Máy chủ phản hồi không hợp lệ, thử lại sau.");
  }
  if (!res.ok) throw new Error(data.error ?? "Có lỗi xảy ra, thử lại sau.");
  return data;
}

export type ScanResult = {
  hasPerson: boolean;
  isTraditional: boolean;
  config: LookConfig;
  detectedHex: { main: string | null; secondary: string | null; accent: string | null };
  confidence: { garment: "cao" | "vua" | "thap"; colors: "cao" | "vua" | "thap"; accessories: "cao" | "vua" | "thap" };
  notVisible: string[];
  observations: string[];
  critique: { summary: string; strengths: string[]; improvements: string[] };
};
