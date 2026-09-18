import { Suspense } from "react";
import SiteFooter from "@/components/SiteFooter";
import ReportForm from "@/components/ReportForm";
import { CONFIDENCE_LABEL, SOURCES, type Confidence } from "@/lib/kb";

export const metadata = { title: "Cam kết văn hóa — Việt phục Remix" };

const CONF_DESC: Record<Confidence, string> = {
  "tu-lieu": "Có trong sách khảo cứu, tư liệu bảo tàng hoặc ghi chép lịch sử.",
  "dan-gian": "Cách lý giải được lưu truyền rộng rãi, đẹp và có giá trị, nhưng không phải sự kiện lịch sử.",
  "gia-thuyet": "Các nhà nghiên cứu chưa thống nhất, ứng dụng nêu rõ để người đọc không hiểu nhầm.",
};

const RULES = [
  ["Dịp và độ trang trọng", "Đi chùa không remix, đám cưới tránh trùng cô dâu, lễ phục không đi cùng đồ thể thao."],
  ["Cấu trúc trang phục", "Áo dài phải còn tà dài, áo tứ thân đi cùng váy và thắt lưng, khăn đóng không thuộc bộ tứ thân."],
  ["Biểu tượng quyền uy", "Rồng năm móng và áo vàng từng dành cho vua; phượng, trống đồng cần được đặt trang trọng."],
  ["Màu mang nghĩa phong tục", "Toàn trắng kèm khăn trắng gợi tang lễ; toàn đen ngày Tết; đỏ rực khi làm khách đám cưới."],
  ["Nguồn gốc cộng đồng", "Thổ cẩm thuộc về từng dân tộc cụ thể, khăn rằn liên hệ với khăn krama của người Khmer."],
  ["Vùng miền", "Pha trộn phụ kiện Kinh Bắc với áo Nam Bộ được phép, nhưng ứng dụng nhắc ghi chú rõ để không hiểu nhầm."],
  ["Thời tiết", "Gợi ý chất liệu, áo khoác, giày dép theo nhiệt độ và khả năng mưa thực tế."],
];

export default function Commitment() {
  return (
    <>
      <main className="mx-auto max-w-[1080px] px-2 pb-16 pt-4 sm:px-6 sm:pt-6">
        <article className="paper sheet-shadow rounded-[14px] px-5 py-8 sm:px-12 sm:pl-20 lg:py-12">
          <h1 className="max-w-[18ch] text-[clamp(32px,4.4vw,54px)] font-extrabold leading-[1] tracking-[-0.03em] text-ink-deep">
            Remix được, <span className="hand font-normal text-redpen">nhưng không làm sai</span>
          </h1>
          <p className="mt-4 max-w-[64ch] text-[17px] leading-relaxed text-text">
            Việt phục Remix khuyến khích người trẻ sáng tạo với trang phục truyền thống. Để sự sáng tạo không làm sai lệch giá trị văn hóa, ứng dụng dựa trên bốn lớp bảo đảm dưới đây.
          </p>

          <section className="mt-12">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">1. Kho tri thức có nguồn và có nhãn độ tin cậy</h2>
            <p className="mt-2 max-w-[68ch] text-[16px] leading-relaxed text-text">
              Mọi thông tin về nguồn gốc và ý nghĩa trang phục được biên soạn trong một kho tri thức duy nhất, kèm nguồn tham khảo. Mỗi nhận định mang một trong ba nhãn:
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Object.keys(CONFIDENCE_LABEL) as Confidence[]).map((c) => (
                <div key={c} className="rounded-[12px] bg-white p-4">
                  <dt className="font-bold text-ink-deep">{CONFIDENCE_LABEL[c]}</dt>
                  <dd className="mt-1 text-[14.5px] leading-snug text-muted">{CONF_DESC[c]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">2. Bộ quy tắc kiểm tra văn hóa</h2>
            <p className="mt-2 max-w-[68ch] text-[16px] leading-relaxed text-text">
              Mỗi lần bạn đổi một lựa chọn, bộ quy tắc chạy ngay trên trình duyệt và khoanh bút đỏ vào chỗ cần xem lại, kèm lý do và nút sửa. Quy tắc là mã nguồn cố định, không phụ thuộc AI, nên kết quả nhất quán và kiểm tra được.
            </p>
            <dl className="mt-5 divide-y divide-dashed divide-ink/25">
              {RULES.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-6">
                  <dt className="font-bold text-ink-deep">{k}</dt>
                  <dd className="text-[15px] leading-snug text-text">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="hand mt-4 text-[21px] leading-snug text-redpen">
              Cảnh báo để hiểu, không để cấm: bạn vẫn có thể lưu bộ phối, nhưng sẽ biết vì sao nó có thể gây hiểu nhầm.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">3. AI có giới hạn</h2>
            <ul className="mt-3 max-w-[68ch] list-disc space-y-2 pl-5 text-[16px] leading-relaxed marker:text-ink">
              <li>AI chỉ được dùng thông tin trong kho tri thức, không được bịa năm tháng, nhân vật hay truyền thuyết.</li>
              <li>AI phải nêu rõ khi một ý là cách hiểu dân gian hoặc còn giả thuyết, và nói thẳng khi chưa có dữ liệu.</li>
              <li>AI nhận kết quả của bộ quy tắc và không được mâu thuẫn với các cảnh báo văn hóa.</li>
              <li>Mọi đề xuất chỉnh sửa của AI được kiểm tra lại, chỉ giữ các giá trị hợp lệ trong ứng dụng.</li>
              <li>Khi phân tích ảnh, AI không nhận xét về cơ thể, khuôn mặt, tuổi, dân tộc hay tôn giáo. Ảnh không được lưu trên máy chủ.</li>
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">4. Cộng đồng cùng sửa sai</h2>
            <p className="mt-2 max-w-[68ch] text-[16px] leading-relaxed text-text">
              Bất kỳ ai cũng có thể báo thông tin chưa chính xác. Báo cáo được lưu lại với trạng thái mới, đang xem, đã sửa hoặc không sửa, để ban biên tập đối chiếu với nguồn tư liệu. Hướng phát triển tiếp theo là mời giảng viên, nhà nghiên cứu trang phục và các nhóm phục dựng cổ phục cùng thẩm định nội dung.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink-deep">Nguồn tham khảo</h2>
            <ul className="mt-3 space-y-1.5 text-[15px]">
              {Object.values(SOURCES).map((s) => (
                <li key={s.title}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold text-ink underline underline-offset-2">
                      {s.title}
                    </a>
                  ) : (
                    <span className="font-semibold">{s.title}</span>
                  )}
                  {s.note && <span className="text-muted">. {s.note}</span>}
                </li>
              ))}
            </ul>
          </section>

          <section id="bao-sai" className="mt-12 scroll-mt-24">
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink-deep">Báo thông tin sai</h2>
            <div className="mt-4 max-w-[620px]">
              <Suspense>
                <ReportForm />
              </Suspense>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
