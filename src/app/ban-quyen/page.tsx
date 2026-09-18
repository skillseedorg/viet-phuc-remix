import Link from "next/link";
import LegalPage, { Mail, SITE_NAME } from "@/components/LegalPage";
import { SOURCES } from "@/lib/kb";

export const metadata = {
  title: "Bản quyền — Việt phục Remix",
  description: "Quyền sở hữu nội dung, hình minh họa của Việt phục Remix, nguồn tham khảo và giấy phép của các thành phần bên thứ ba.",
  alternates: { canonical: "/ban-quyen" },
};

const THIRD_PARTY = [
  { name: "Be Vietnam Pro", role: "Phông chữ giao diện", license: "SIL Open Font License 1.1", url: "https://fonts.google.com/specimen/Be+Vietnam+Pro" },
  { name: "Patrick Hand", role: "Phông chữ viết tay", license: "SIL Open Font License 1.1", url: "https://fonts.google.com/specimen/Patrick+Hand" },
  { name: "Lucide", role: "Bộ biểu tượng", license: "ISC License", url: "https://lucide.dev/license" },
  { name: "Open-Meteo", role: "Dữ liệu thời tiết", license: "CC BY 4.0", url: "https://open-meteo.com/" },
  { name: "Next.js, React", role: "Nền tảng ứng dụng", license: "MIT License", url: "https://github.com/vercel/next.js/blob/canary/license.md" },
  { name: "Supabase JS", role: "Thư viện kết nối cơ sở dữ liệu", license: "MIT License", url: "https://github.com/supabase/supabase-js" },
  { name: "Tailwind CSS", role: "Thư viện giao diện", license: "MIT License", url: "https://github.com/tailwindlabs/tailwindcss" },
];

export default function Copyright() {
  const year = new Date().getFullYear();
  return (
    <LegalPage
      current="/ban-quyen"
      title="Bản quyền"
      accent="và ghi nguồn"
      updated="17/09/2026"
      intro={
        <p>
          © {year} {SITE_NAME}. Bảo lưu mọi quyền đối với các thành phần do đội phát triển tạo ra, trừ các nội dung và thành phần của bên thứ ba
          được ghi nguồn bên dưới.
        </p>
      }
      sections={[
        {
          id: "cua-chung-toi",
          heading: "Nội dung thuộc Việt phục Remix",
          body: (
            <>
              <ul>
                <li>Mã nguồn, thiết kế giao diện và bộ nhận diện theo phong cách vở ô ly.</li>
                <li>Hình minh họa nhân vật và trang phục được vẽ bằng SVG, cùng các ảnh xem trước khi chia sẻ.</li>
                <li>Bộ quy tắc kiểm tra văn hóa, cách chấm điểm hài hòa màu và nội dung tóm tắt trong sổ tay Việt phục.</li>
              </ul>
              <p>
                Hình nhân vật là hình minh họa, không mô tả chính xác từng chi tiết của trang phục lịch sử và không phải ảnh tư liệu.
              </p>
            </>
          ),
        },
        {
          id: "nguon",
          heading: "Nguồn tham khảo văn hóa",
          body: (
            <>
              <p>
                Thông tin về trang phục được biên soạn lại bằng lời của đội, tham khảo từ các nguồn sau. Bản quyền của tài liệu gốc thuộc về tác
                giả và đơn vị phát hành.
              </p>
              <ul>
                {Object.values(SOURCES).map((s) => (
                  <li key={s.title}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      <b>{s.title}</b>
                    )}
                    {s.note ? `. ${s.note}` : ""}
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          id: "ben-thu-ba",
          heading: "Thành phần của bên thứ ba",
          body: (
            <ul>
              {THIRD_PARTY.map((t) => (
                <li key={t.name}>
                  <a href={t.url} target="_blank" rel="noreferrer">
                    {t.name}
                  </a>{" "}
                  ({t.role}): {t.license}.
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "nguoi-dung",
          heading: "Nội dung của người dùng",
          body: (
            <p>
              Bộ phối, tên, ghi chú và ảnh do người dùng tạo thuộc về người dùng. Xem thêm phạm vi hiển thị nội dung công khai tại{" "}
              <Link href="/dieu-khoan#noi-dung">Điều khoản sử dụng</Link>.
            </p>
          ),
        },
        {
          id: "khieu-nai",
          heading: "Báo vi phạm bản quyền",
          body: (
            <p>
              Nếu bạn cho rằng nội dung trên {SITE_NAME} vi phạm bản quyền hoặc quyền hình ảnh của mình, vui lòng gửi email tới{" "}
              <Mail subject="Báo vi phạm bản quyền" /> kèm đường link tới nội dung, mô tả tác phẩm gốc và thông tin liên hệ. Chúng tôi sẽ xem xét và
              gỡ nội dung vi phạm.
            </p>
          ),
        },
      ]}
    />
  );
}
