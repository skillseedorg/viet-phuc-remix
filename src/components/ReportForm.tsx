"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GARMENTS } from "@/lib/kb";
import { getSupabase } from "@/lib/supabase";
import { cloud } from "@/lib/store";
import { useApp } from "./Providers";
import { Button, Field, inputCls } from "./ui";

export default function ReportForm() {
  const params = useSearchParams();
  const { user } = useApp();
  const [topic, setTopic] = useState(params.get("chu-de") ?? "chung");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) {
      setError("Bạn mô tả rõ hơn chỗ chưa đúng nhé (ít nhất 5 ký tự).");
      return;
    }
    setState("sending");
    setError(null);
    const sb = getSupabase();
    if (!sb) {
      setState("error");
      setError("Ứng dụng chưa kết nối database nên chưa gửi được báo cáo.");
      return;
    }
    const res = await cloud.report(sb, { userId: user?.id ?? null, topic, message: message.trim(), contact: contact.trim() || undefined });
    if (res.ok) {
      setState("done");
      setMessage("");
    } else {
      setState("error");
      setError(
        res.missingTables
          ? "Database chưa có bảng content_reports (cần chạy supabase/schema.sql). Báo cáo chưa được gửi."
          : `Chưa gửi được: ${res.message}`,
      );
    }
  };

  if (state === "done")
    return (
      <div className="rounded-[14px] bg-white p-5" role="status">
        <p className="hand text-[26px] text-ink">Cảm ơn bạn!</p>
        <p className="mt-1 text-[15px] text-text">Ban biên tập sẽ đối chiếu với nguồn tư liệu trước khi sửa nội dung.</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setState("idle")}>
          Gửi báo cáo khác
        </Button>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[14px] bg-white p-5">
      <Field label="Nội dung liên quan">
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}>
          <option value="chung">Chung, nhiều mục</option>
          {GARMENTS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
          <option value="phu-kien">Phụ kiện, màu sắc, hoa văn</option>
          <option value="canh-bao">Cảnh báo văn hóa chưa hợp lý</option>
          <option value="ai">Câu trả lời của AI</option>
        </select>
      </Field>
      <Field label="Chỗ nào chưa đúng, và theo bạn nên sửa thế nào?" hint="Nếu có, ghi kèm nguồn tham khảo (sách, bảo tàng, bài nghiên cứu).">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={2000} className={inputCls} />
      </Field>
      <Field label="Liên hệ (không bắt buộc)" hint="Email hoặc mạng xã hội, nếu bạn muốn ban biên tập phản hồi.">
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} className={inputCls} />
      </Field>
      {error && (
        <p role="alert" className="text-[14px] text-redpen">
          {error}
        </p>
      )}
      <Button type="submit" variant="red" loading={state === "sending"}>
        Gửi báo cáo
      </Button>
    </form>
  );
}
