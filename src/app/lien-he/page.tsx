import Link from "next/link";
import LegalPage, { CONTACT_EMAIL, Mail } from "@/components/LegalPage";

export const metadata = {
  title: "Liên hệ — Việt phục Remix",
  description: `Liên hệ đội Việt phục Remix qua email ${CONTACT_EMAIL}: góp ý, báo lỗi, yêu cầu về dữ liệu cá nhân, bản quyền.`,
  alternates: { canonical: "/lien-he" },
};

const TOPICS = [
  { subject: "Góp ý Việt phục Remix", title: "Góp ý và hợp tác", desc: "Ý tưởng tính năng, hợp tác nội dung với câu lạc bộ, nhóm phục dựng cổ phục, giảng viên." },
  { subject: "Báo lỗi kỹ thuật", title: "Báo lỗi kỹ thuật", desc: "Trang không tải được, nút không hoạt động, AI trả kết quả lạ. Ghi kèm thiết bị, trình duyệt và các bước gặp lỗi." },
  { subject: "Yêu cầu về dữ liệu cá nhân", title: "Dữ liệu cá nhân", desc: "Nhận bản sao dữ liệu, xóa tài khoản. Gửi từ email bạn dùng để đăng nhập." },
  { subject: "Báo vi phạm bản quyền", title: "Bản quyền", desc: "Nội dung vi phạm bản quyền hoặc quyền hình ảnh. Gửi kèm đường link tới nội dung." },
];

export default function Contact() {
  return (
    <LegalPage
      current="/lien-he"
      title="Liên hệ"
      accent="với đội"
      intro={
        <>
          <p>Mọi liên hệ với đội phát triển Việt phục Remix vui lòng gửi qua email:</p>
          <p className="mt-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hand inline-block rounded-[12px] bg-white px-5 py-3 text-[28px] leading-none text-ink shadow-[0_1px_2px_rgba(0,0,0,.08),0_12px_24px_-16px_rgba(33,23,102,.7)] hover:text-ink-deep"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-4">
            Thấy thông tin văn hóa chưa chính xác? Dùng <Link href="/cam-ket#bao-sai">form báo sai</Link> để ban biên tập tiếp nhận nhanh nhất.
          </p>
        </>
      }
      sections={TOPICS.map((t) => ({
        id: t.subject.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-"),
        heading: t.title,
        body: (
          <>
            <p>{t.desc}</p>
            <p>
              Gửi tới <Mail subject={t.subject} />
            </p>
          </>
        ),
      }))}
    />
  );
}
