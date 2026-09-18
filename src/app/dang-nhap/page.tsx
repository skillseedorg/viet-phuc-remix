import { Suspense } from "react";
import SiteFooter from "@/components/SiteFooter";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Đăng nhập — Việt phục Remix" };

export default function Page() {
  return (
    <>
      <main className="mx-auto grid max-w-[1080px] items-center gap-10 px-3 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_440px] lg:pt-14">
        <div className="text-white">
          <h1 className="text-[clamp(34px,4.6vw,58px)] font-extrabold leading-[1] tracking-[-0.03em]">
            Giữ lookbook <span className="hand block font-normal text-cover-lime">theo bạn đi khắp nơi</span>
          </h1>
          <ul className="mt-6 max-w-[46ch] space-y-2.5 text-[16px] text-white/85">
            <li>Lưu bộ phối lên tài khoản, mở lại trên điện thoại hay máy tính.</li>
            <li>Công khai bộ phối đẹp nhất lên lookbook cộng đồng.</li>
            <li>Gửi link lookbook cho nhóm bạn trước buổi chụp kỷ yếu.</li>
          </ul>
          <p className="mt-6 text-[14px] text-white/70">Không đăng nhập vẫn phối đồ, hỏi AI và lưu trên máy được.</p>
        </div>
        <Suspense>
          <AuthForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
