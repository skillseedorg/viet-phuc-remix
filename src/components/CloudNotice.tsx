"use client";

import Link from "next/link";
import { useApp } from "./Providers";

/** Thông báo trạng thái lưu trữ đám mây, hiển thị khi cần hành động. */
export default function CloudNotice() {
  const { cloudStatus, cloudMessage, user } = useApp();
  if (cloudStatus === "ready" || cloudStatus === "checking") return null;

  if (cloudStatus === "signed-out" || (!user && cloudStatus !== "unconfigured"))
    return (
      <p className="rounded-[12px] bg-tape/60 px-4 py-3 text-[14.5px] text-ink-deep">
        Bộ phối đang được lưu trên máy này.{" "}
        <Link href="/dang-nhap" className="font-bold underline">
          Đăng nhập
        </Link>{" "}
        để lưu lên tài khoản, mở trên thiết bị khác và chia sẻ lên lookbook cộng đồng.
      </p>
    );

  if (cloudStatus === "missing-tables")
    return (
      <div className="rounded-[12px] bg-redpen-soft px-4 py-3 text-[14.5px] text-text">
        <p className="font-bold text-redpen">Database Supabase chưa có bảng của ứng dụng.</p>
        <p className="mt-1">
          Mở Supabase Dashboard, vào SQL Editor và chạy toàn bộ file <code className="rounded bg-white px-1">supabase/schema.sql</code> trong mã nguồn. Trong lúc đó, bộ phối vẫn được lưu trên máy này.
        </p>
      </div>
    );

  if (cloudStatus === "unconfigured")
    return (
      <p className="rounded-[12px] bg-tape/60 px-4 py-3 text-[14.5px] text-ink-deep">
        Ứng dụng chưa cấu hình Supabase, bộ phối được lưu trên máy này.
      </p>
    );

  return (
    <p className="rounded-[12px] bg-redpen-soft px-4 py-3 text-[14.5px] text-redpen">
      Không kết nối được lookbook trên mây{cloudMessage ? `: ${cloudMessage}` : ""}. Bộ phối mới vẫn được lưu trên máy này.
    </p>
  );
}
