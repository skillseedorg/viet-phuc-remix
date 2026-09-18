import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseConfigured = Boolean(url && key);

let browserClient: SupabaseClient | null = null;

/** Client dùng trong trình duyệt: giữ phiên đăng nhập. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (typeof window === "undefined") {
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce", storageKey: "vpr-auth" },
    });
  }
  return browserClient;
}

/** Bảng chưa được tạo (chưa chạy supabase/schema.sql). */
export function isMissingTable(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return error.code === "PGRST205" || error.code === "42P01" || /does not exist|schema cache/i.test(error.message ?? "");
}

/** Đọc danh sách nhà cung cấp đăng nhập đang bật trên Supabase. */
export async function authProviders(): Promise<Record<string, boolean>> {
  if (!supabaseConfigured) return {};
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
    if (!res.ok) return {};
    const data = await res.json();
    return data.external ?? {};
  } catch {
    return {};
  }
}

/** Xác thực access token phía server; trả về user hoặc null. */
export async function userFromRequest(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !supabaseConfigured) return null;
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await sb.auth.getUser(token);
  return error ? null : data.user;
}
