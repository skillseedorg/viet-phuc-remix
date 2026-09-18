import type { SupabaseClient } from "@supabase/supabase-js";
import { isMissingTable } from "./supabase";
import { DEFAULT_LOOK, uid, type LookConfig, type SavedLook, type StylistResult } from "./look";

const LS_LOOKS = "vpr:looks";
const LS_COMPARE = "vpr:compare";
const LS_DRAFT = "vpr:draft";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------ Cục bộ ------------------------------ */

export const local = {
  looks: () => readJSON<SavedLook[]>(LS_LOOKS, []),
  saveLook(input: { title: string; config: LookConfig; note?: string; ai?: StylistResult | null }): SavedLook {
    const look: SavedLook = {
      id: uid(),
      title: input.title,
      config: input.config,
      note: input.note,
      ai: input.ai ?? null,
      createdAt: new Date().toISOString(),
      source: "local",
    };
    writeJSON(LS_LOOKS, [look, ...local.looks()].slice(0, 60));
    return look;
  },
  removeLook(id: string) {
    writeJSON(LS_LOOKS, local.looks().filter((l) => l.id !== id));
  },
  compare: () => readJSON<SavedLook[]>(LS_COMPARE, []),
  setCompare: (looks: SavedLook[]) => writeJSON(LS_COMPARE, looks.slice(0, 3)),
  draft: () => ({ ...DEFAULT_LOOK, ...readJSON<Partial<LookConfig>>(LS_DRAFT, {}) }),
  setDraft: (look: LookConfig) => writeJSON(LS_DRAFT, look),
};

/* ------------------------------ Supabase ------------------------------ */

type Row = {
  id: string;
  user_id: string;
  title: string;
  config: LookConfig;
  note: string | null;
  ai: StylistResult | null;
  is_public: boolean;
  created_at: string;
  profiles?: { display_name: string | null } | null;
};

const toSaved = (r: Row): SavedLook => ({
  id: r.id,
  title: r.title,
  config: { ...DEFAULT_LOOK, ...r.config },
  note: r.note ?? undefined,
  ai: r.ai,
  isPublic: r.is_public,
  createdAt: r.created_at,
  owner: r.profiles?.display_name ?? null,
  source: "cloud",
});

export type CloudResult<T> = { ok: true; data: T } | { ok: false; missingTables: boolean; message: string };

const fail = (error: { code?: string; message?: string }): CloudResult<never> => ({
  ok: false,
  missingTables: isMissingTable(error),
  message: error.message ?? "Lỗi không xác định",
});

export const cloud = {
  async myLooks(sb: SupabaseClient, userId: string): Promise<CloudResult<SavedLook[]>> {
    const { data, error } = await sb
      .from("looks")
      .select("id,user_id,title,config,note,ai,is_public,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return fail(error);
    return { ok: true, data: (data as Row[]).map(toSaved) };
  },

  async publicLooks(sb: SupabaseClient, limit = 24): Promise<CloudResult<SavedLook[]>> {
    const { data, error } = await sb
      .from("looks")
      .select("id,user_id,title,config,note,ai,is_public,created_at,profiles(display_name)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return fail(error);
    return { ok: true, data: (data as unknown as Row[]).map(toSaved) };
  },

  async getLook(sb: SupabaseClient, id: string): Promise<CloudResult<SavedLook | null>> {
    const { data, error } = await sb
      .from("looks")
      .select("id,user_id,title,config,note,ai,is_public,created_at,profiles(display_name)")
      .eq("id", id)
      .maybeSingle();
    if (error) return fail(error);
    return { ok: true, data: data ? toSaved(data as unknown as Row) : null };
  },

  async saveLook(
    sb: SupabaseClient,
    userId: string,
    input: { title: string; config: LookConfig; note?: string; ai?: StylistResult | null; isPublic: boolean },
  ): Promise<CloudResult<SavedLook>> {
    const { data, error } = await sb
      .from("looks")
      .insert({
        user_id: userId,
        title: input.title,
        config: input.config,
        note: input.note ?? null,
        ai: input.ai ?? null,
        is_public: input.isPublic,
      })
      .select("id,user_id,title,config,note,ai,is_public,created_at")
      .single();
    if (error) return fail(error);
    return { ok: true, data: toSaved(data as Row) };
  },

  async setPublic(sb: SupabaseClient, id: string, isPublic: boolean): Promise<CloudResult<true>> {
    const { error } = await sb.from("looks").update({ is_public: isPublic }).eq("id", id);
    if (error) return fail(error);
    return { ok: true, data: true };
  },

  async removeLook(sb: SupabaseClient, id: string): Promise<CloudResult<true>> {
    const { error } = await sb.from("looks").delete().eq("id", id);
    if (error) return fail(error);
    return { ok: true, data: true };
  },

  async report(
    sb: SupabaseClient,
    input: { userId?: string | null; topic: string; message: string; contact?: string },
  ): Promise<CloudResult<true>> {
    const { error } = await sb.from("content_reports").insert({
      user_id: input.userId ?? null,
      topic: input.topic,
      message: input.message,
      contact: input.contact ?? null,
    });
    if (error) return fail(error);
    return { ok: true, data: true };
  },
};
