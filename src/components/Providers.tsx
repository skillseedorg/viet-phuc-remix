"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { cloud, local } from "@/lib/store";
import type { LookConfig, SavedLook, StylistResult } from "@/lib/look";

export type CloudStatus = "checking" | "ready" | "missing-tables" | "signed-out" | "unconfigured" | "error";

type SaveInput = { title: string; config: LookConfig; note?: string; ai?: StylistResult | null; isPublic?: boolean };

type Ctx = {
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  displayName: string | null;
  signOut: () => Promise<void>;
  looks: SavedLook[];
  cloudStatus: CloudStatus;
  cloudMessage: string | null;
  refreshLooks: () => Promise<void>;
  saveLook: (input: SaveInput) => Promise<{ look: SavedLook; where: "cloud" | "local"; reason?: string }>;
  removeLook: (look: SavedLook) => Promise<void>;
  setLookPublic: (look: SavedLook, isPublic: boolean) => Promise<boolean>;
  compare: SavedLook[];
  toggleCompare: (look: SavedLook) => void;
  clearCompare: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const sb = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [localLooks, setLocalLooks] = useState<SavedLook[]>([]);
  const [cloudLooks, setCloudLooks] = useState<SavedLook[]>([]);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(supabaseConfigured ? "checking" : "unconfigured");
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [compare, setCompare] = useState<SavedLook[]>([]);

  const user = session?.user ?? null;
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    (user?.email ? user.email.split("@")[0] : null);

  useEffect(() => {
    setLocalLooks(local.looks());
    setCompare(local.compare());
    if (!sb) {
      setAuthLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const refreshLooks = useCallback(async () => {
    setLocalLooks(local.looks());
    if (!sb) return setCloudStatus("unconfigured");
    if (!user) {
      setCloudLooks([]);
      return setCloudStatus("signed-out");
    }
    // Bảo đảm có profile (người dùng tạo trước khi chạy trigger)
    const prof = await sb
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName }, { onConflict: "id", ignoreDuplicates: true });
    const res = await cloud.myLooks(sb, user.id);
    if (res.ok) {
      setCloudLooks(res.data);
      setCloudStatus("ready");
      setCloudMessage(null);
    } else {
      setCloudStatus(res.missingTables ? "missing-tables" : "error");
      setCloudMessage(prof.error?.message ?? res.message);
    }
  }, [sb, user, displayName]);

  useEffect(() => {
    if (!authLoading) void refreshLooks();
  }, [authLoading, refreshLooks]);

  const saveLook: Ctx["saveLook"] = async (input) => {
    if (sb && user && cloudStatus === "ready") {
      const res = await cloud.saveLook(sb, user.id, { ...input, isPublic: input.isPublic ?? false });
      if (res.ok) {
        setCloudLooks((prev) => [res.data, ...prev]);
        return { look: res.data, where: "cloud" };
      }
      if (res.missingTables) setCloudStatus("missing-tables");
      const look = local.saveLook(input);
      setLocalLooks(local.looks());
      return { look, where: "local", reason: res.message };
    }
    const look = local.saveLook(input);
    setLocalLooks(local.looks());
    const reason =
      cloudStatus === "missing-tables"
        ? "Database chưa có bảng, đã lưu trên máy này."
        : !user
          ? "Bạn chưa đăng nhập, bộ phối được lưu trên máy này."
          : undefined;
    return { look, where: "local", reason };
  };

  const removeLook: Ctx["removeLook"] = async (look) => {
    if (look.source === "cloud" && sb) {
      const res = await cloud.removeLook(sb, look.id);
      if (res.ok) setCloudLooks((prev) => prev.filter((l) => l.id !== look.id));
    } else {
      local.removeLook(look.id);
      setLocalLooks(local.looks());
    }
    const next = compare.filter((c) => c.id !== look.id);
    setCompare(next);
    local.setCompare(next);
  };

  const setLookPublic: Ctx["setLookPublic"] = async (look, isPublic) => {
    if (!sb || look.source !== "cloud") return false;
    const res = await cloud.setPublic(sb, look.id, isPublic);
    if (res.ok) setCloudLooks((prev) => prev.map((l) => (l.id === look.id ? { ...l, isPublic } : l)));
    return res.ok;
  };

  const toggleCompare = (look: SavedLook) => {
    setCompare((prev) => {
      const exists = prev.some((c) => c.id === look.id);
      const next = exists ? prev.filter((c) => c.id !== look.id) : [...prev, look].slice(-3);
      local.setCompare(next);
      return next;
    });
  };

  const clearCompare = () => {
    setCompare([]);
    local.setCompare([]);
  };

  const signOut = async () => {
    await sb?.auth.signOut();
    setCloudLooks([]);
  };

  const value: Ctx = {
    user,
    session,
    authLoading,
    displayName,
    signOut,
    looks: [...cloudLooks, ...localLooks],
    cloudStatus,
    cloudMessage,
    refreshLooks,
    saveLook,
    removeLook,
    setLookPublic,
    compare,
    toggleCompare,
    clearCompare,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
