import Link from "next/link";
import LegalPage, { Mail, SITE_DOMAIN, SITE_NAME } from "@/components/LegalPage";

export const metadata = {
  title: "Điều khoản sử dụng — Việt phục Remix",
  description: "Điều kiện sử dụng Việt phục Remix: tài khoản, nội dung người dùng, giới hạn của AI và thông tin văn hóa.",
  alternates: { canonical: "/dieu-khoan" },
};

export default function Terms() {
  return (
    <LegalPage
      current="/dieu-khoan"
      title="Điều khoản"
      accent="sử dụng"
      updated="17/09/2026"
      intro={
        <p>
          Khi truy cập hoặc sử dụng {SITE_NAME} tại {SITE_DOMAIN}, bạn đồng ý với các điều khoản dưới đây và với{" "}
          <Link href="/quyen-rieng-tu">Chính sách quyền riêng tư</Link>. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
        </p>
      }
      sections={[
        {
          id: "dich-vu",
          heading: "Dịch vụ",
          body: (
            <p>
              {SITE_NAME} là ứng dụng web miễn phí giúp người dùng tìm hiểu và phối trang phục truyền thống Việt Nam: chọn trang phục theo dịp và
              vùng miền, xem mô phỏng, nhận cảnh báo văn hóa, hỏi đáp và chấm điểm bằng AI, lưu và chia sẻ lookbook. Dịch vụ phục vụ mục đích học
              tập và tham khảo, được cung cấp theo hiện trạng và có thể thay đổi, tạm ngừng hoặc kết thúc mà không cần báo trước.
            </p>
          ),
        },
        {
          id: "tai-khoan",
          heading: "Tài khoản",
          body: (
            <ul>
              <li>Phần lớn tính năng dùng được không cần tài khoản. Một số tính năng như chấm outfit từ ảnh và lookbook trên mây cần đăng nhập.</li>
              <li>Bạn chịu trách nhiệm giữ an toàn cho tài khoản và mọi hoạt động diễn ra dưới tài khoản của mình.</li>
              <li>Nếu chưa đủ 16 tuổi, bạn cần có sự đồng ý của cha mẹ hoặc người giám hộ trước khi tạo tài khoản.</li>
              <li>Chúng tôi có thể tạm khóa tài khoản vi phạm điều khoản.</li>
            </ul>
          ),
        },
        {
          id: "noi-dung",
          heading: "Nội dung của bạn",
          body: (
            <>
              <p>
                Bạn giữ quyền đối với bộ phối, tên, ghi chú và ảnh mà bạn tạo hoặc tải lên. Khi bật công khai một bộ phối, bạn cho phép{" "}
                {SITE_NAME} hiển thị bộ phối đó cùng tên hiển thị của bạn trên lookbook cộng đồng và qua đường link, miễn phí, cho tới khi bạn
                chuyển về riêng tư hoặc xóa.
              </p>
              <p>Bạn cam kết không:</p>
              <ul>
                <li>Tải lên ảnh của người khác khi chưa được đồng ý, hoặc ảnh có nội dung khiêu dâm, bạo lực, xúc phạm.</li>
                <li>Đặt tên, ghi chú mang tính xúc phạm, phân biệt đối xử hoặc chế giễu văn hóa, dân tộc, tín ngưỡng.</li>
                <li>Vi phạm bản quyền, quyền hình ảnh hoặc quyền riêng tư của người khác.</li>
                <li>Dùng công cụ tự động gửi số lượng lớn yêu cầu, dò quét, phá hoại hoặc vượt qua giới hạn của hệ thống.</li>
                <li>Dùng dịch vụ cho mục đích trái pháp luật Việt Nam.</li>
              </ul>
              <p>Chúng tôi có quyền ẩn hoặc xóa nội dung công khai vi phạm các cam kết trên.</p>
            </>
          ),
        },
        {
          id: "ai",
          heading: "Kết quả từ AI",
          body: (
            <>
              <p>
                Lời phê, gợi ý, câu trả lời và điểm chấm outfit được tạo tự động bởi mô hình AI kết hợp bộ quy tắc của ứng dụng. AI có thể nhận diện
                sai trang phục, màu sắc hoặc diễn đạt chưa chính xác. Điểm số chỉ mang tính tham khảo cho việc phối đồ, không phải đánh giá về con
                người trong ảnh.
              </p>
              <p>Bạn tự cân nhắc trước khi dựa vào kết quả AI để quyết định trang phục cho các dịp quan trọng.</p>
            </>
          ),
        },
        {
          id: "van-hoa",
          heading: "Thông tin văn hóa",
          body: (
            <p>
              Nội dung về nguồn gốc, ý nghĩa trang phục được biên soạn tóm tắt từ các nguồn tham khảo được ghi rõ và gắn nhãn độ tin cậy (có tư
              liệu, cách hiểu dân gian, còn nhiều giả thuyết). Nội dung không thay thế cho tài liệu nghiên cứu chuyên sâu. Phong tục có thể khác
              nhau giữa các gia đình, địa phương và cộng đồng. Nếu phát hiện sai sót, vui lòng <Link href="/cam-ket#bao-sai">báo cho ban biên tập</Link>.
            </p>
          ),
        },
        {
          id: "so-huu",
          heading: "Quyền sở hữu trí tuệ",
          body: (
            <p>
              Mã nguồn, giao diện, hình minh họa nhân vật, bộ quy tắc văn hóa và nội dung biên soạn của {SITE_NAME} thuộc về đội phát triển, trừ
              các thành phần của bên thứ ba được liệt kê tại trang <Link href="/ban-quyen">Bản quyền</Link>. Bạn được dùng thẻ lookbook và ảnh xuất
              từ ứng dụng cho mục đích cá nhân, học tập và chia sẻ trên mạng xã hội.
            </p>
          ),
        },
        {
          id: "mien-tru",
          heading: "Giới hạn trách nhiệm",
          body: (
            <p>
              Trong phạm vi pháp luật cho phép, {SITE_NAME} không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không
              thể sử dụng dịch vụ, từ kết quả AI hoặc từ nội dung do người dùng khác đăng công khai. Dịch vụ có thể gián đoạn do nhà cung cấp hạ
              tầng, AI hoặc bảo trì.
            </p>
          ),
        },
        {
          id: "thay-doi",
          heading: "Thay đổi điều khoản và luật áp dụng",
          body: (
            <p>
              Chúng tôi có thể cập nhật điều khoản và sẽ ghi ngày cập nhật ở đầu trang. Việc tiếp tục sử dụng sau khi điều khoản thay đổi đồng nghĩa
              với việc bạn chấp nhận nội dung mới. Điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi thắc mắc, vui lòng liên hệ{" "}
              <Mail subject="Câu hỏi về điều khoản sử dụng" />.
            </p>
          ),
        },
      ]}
    />
  );
}
