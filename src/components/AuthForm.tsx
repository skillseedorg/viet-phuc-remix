"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleButton from "./GoogleButton";
import { getSupabase } from "@/lib/supabase";
import { useApp } from "./Providers";
import { Button, Field, NhanVo, cx, inputCls } from "./ui";

const ERRORS: [RegExp, string][] = [
  [/invalid login credentials/i, "Email hoặc mật khẩu chưa đúng."],
  [/email not confirmed/i, "Email chưa được xác nhận. Mở hộp thư và bấm link xác nhận trước nhé."],
  [/already registered|already been registered/i, "Email này đã có tài khoản. Chuyển sang Đăng nhập nhé."],
  [/password should be at least/i, "Mật khẩu cần ít nhất 6 ký tự."],
  [/rate limit|too many/i, "Bạn thử quá nhiều lần, đợi vài phút rồi thử lại."],
  [/invalid.*email|unable to validate email/i, "Địa chỉ email chưa hợp lệ."],
];

const vi = (msg: string) => ERRORS.find(([re]) => re.test(msg))?.[1] ?? `Có lỗi: ${msg}`;

export default function AuthForm() {
  const router = useRouter();
  const nextParam = useSearchParams().get("next") ?? "/lookbook";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/lookbook";
  const { user, displayName, signOut } = useApp();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (user)
    return (
      <div className="sheet-shadow rounded-[18px]">
        <NhanVo
          className="px-8 pb-8 pt-6"
          title="Nhãn vở"
          rows={[
            ["Họ và tên", displayName],
            ["Email", user.email],
          ]}
        />
        <div className="-mt-4 flex gap-2 rounded-b-[18px] bg-white px-8 pb-6">
          <Button href={next}>{next === "/cham-outfit" ? "Chấm outfit" : "Mở lookbook"}</Button>
          <Button variant="outline" onClick={signOut}>
            Đăng xuất
          </Button>
        </div>
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return setError("Ứng dụng chưa cấu hình Supabase.");
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "in") {
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
        if (error) return setError(vi(error.message));
        router.push(next);
      } else {
        if (name.trim().length < 2) return setError("Tên hiển thị cần ít nhất 2 ký tự.");
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() }, emailRedirectTo: `${location.origin}${next}` },
        });
        if (error) return setError(vi(error.message));
        if (data.session) router.push(next);
        else setInfo("Đã tạo tài khoản. Mở email và bấm link xác nhận, sau đó quay lại đăng nhập.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="paper-plain sheet-shadow rounded-[18px] p-6 sm:p-8">
      <div role="tablist" className="mb-6 grid grid-cols-2 rounded-[12px] bg-white p-1">
        {(
          [
            ["in", "Đăng nhập"],
            ["up", "Tạo tài khoản"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => {
              setMode(id);
              setError(null);
            }}
            className={cx("h-10 rounded-[9px] text-[14.5px] font-bold", mode === id ? "bg-ink text-white" : "text-ink hover:bg-ink-soft")}
          >
            {label}
          </button>
        ))}
      </div>
      <GoogleButton next={next} />
      <div className="my-5 flex items-center gap-3 text-[13px] font-semibold text-muted">
        <span className="h-px flex-1 bg-grid" />
        hoặc dùng email
        <span className="h-px flex-1 bg-grid" />
      </div>
      <div className="space-y-4">
        {mode === "up" && (
          <Field label="Tên hiển thị">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="nickname" className={inputCls} required />
          </Field>
        )}
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputCls} required />
        </Field>
        <Field label="Mật khẩu" hint={mode === "up" ? "Ít nhất 6 ký tự." : undefined}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className={inputCls}
            required
          />
        </Field>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-[14.5px] text-redpen">
          {error}
        </p>
      )}
      {info && (
        <p role="status" className="hand mt-4 text-[20px] leading-snug text-ink">
          {info}
        </p>
      )}
      <Button type="submit" size="lg" loading={loading} className="mt-6 w-full">
        {mode === "in" ? "Đăng nhập" : "Tạo tài khoản"}
      </Button>
      <p className="mt-4 text-center text-[13px] leading-snug text-muted">
        Khi tiếp tục, bạn đồng ý với{" "}
        <Link href="/dieu-khoan" className="font-semibold text-ink underline underline-offset-2">
          Điều khoản sử dụng
        </Link>{" "}
        và{" "}
        <Link href="/quyen-rieng-tu" className="font-semibold text-ink underline underline-offset-2">
          Chính sách quyền riêng tư
        </Link>
        .
      </p>
    </form>
  );
}
