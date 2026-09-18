import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[720px] px-3 py-16">
      <div className="paper sheet-shadow rounded-[14px] px-6 py-12 sm:pl-20">
        <p className="hand text-[40px] leading-none text-redpen">Trang này bị xé mất rồi.</p>
        <p className="mt-3 text-[16px] text-muted">Link có thể đã sai, hoặc bộ phối đã bị xóa hay chuyển sang riêng tư.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/phoi-do" className="inline-flex h-11 items-center rounded-[10px] bg-ink px-5 font-bold text-white hover:bg-ink-deep">
            Mở vở phối đồ
          </Link>
          <Link href="/" className="inline-flex h-11 items-center rounded-[10px] border-[1.5px] border-ink px-5 font-bold text-ink hover:bg-ink-soft">
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
