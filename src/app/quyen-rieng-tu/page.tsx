import Link from "next/link";
import LegalPage, { Mail, SITE_DOMAIN, SITE_NAME } from "@/components/LegalPage";

export const metadata = {
  title: "Chính sách quyền riêng tư — Việt phục Remix",
  description: "Việt phục Remix thu thập những dữ liệu gì, dùng vào việc gì, chia sẻ với ai và bạn có những quyền gì với dữ liệu của mình.",
  alternates: { canonical: "/quyen-rieng-tu" },
};

export default function Privacy() {
  return (
    <LegalPage
      current="/quyen-rieng-tu"
      title="Chính sách"
      accent="quyền riêng tư"
      updated="17/09/2026"
      intro={
        <>
          <p>
            Chính sách này giải thích {SITE_NAME} (tại {SITE_DOMAIN}) xử lý dữ liệu của bạn như thế nào. Nguyên tắc của chúng tôi: chỉ thu thập
            những gì cần để ứng dụng hoạt động, không bán dữ liệu, không chạy quảng cáo và không dùng công cụ theo dõi hành vi.
          </p>
          <p className="mt-3">
            Bạn không cần tài khoản để phối đồ, đọc sổ tay văn hóa hay hỏi AI. Khi không đăng nhập, bộ phối được lưu ngay trên trình duyệt của
            bạn.
          </p>
        </>
      }
      sections={[
        {
          id: "thu-thap",
          heading: "Dữ liệu chúng tôi thu thập",
          body: (
            <>
              <p>
                <b>Khi bạn tạo tài khoản hoặc đăng nhập:</b> địa chỉ email và tên hiển thị. Nếu đăng nhập bằng Google, chúng tôi nhận email, họ tên
                và ảnh đại diện mà Google cung cấp. Mật khẩu được mã hóa và quản lý bởi dịch vụ xác thực Supabase; chúng tôi không thể đọc mật khẩu
                của bạn.
              </p>
              <p>
                <b>Khi bạn lưu bộ phối lên tài khoản:</b> tên bộ phối, cấu hình trang phục (loại áo, màu, phụ kiện, dịp), ghi chú, lời phê của AI
                và trạng thái công khai hay riêng tư.
              </p>
              <p>
                <b>Khi bạn báo thông tin sai:</b> nội dung báo cáo, chủ đề và thông tin liên hệ nếu bạn tự điền.
              </p>
              <p>
                <b>Dữ liệu kỹ thuật:</b> khi truy cập trang, hạ tầng máy chủ ghi nhận thông tin kỹ thuật như địa chỉ IP, loại trình duyệt và thời
                điểm yêu cầu để vận hành, chống lạm dụng và gỡ lỗi. Địa chỉ IP còn được dùng tạm thời trong bộ nhớ để giới hạn số lần gọi AI.
              </p>
            </>
          ),
        },
        {
          id: "anh",
          heading: "Ảnh bạn tải lên",
          body: (
            <>
              <p>
                Ảnh chỉ được dùng khi bạn chủ động bấm các nút phân tích: gợi ý màu từ ảnh, hoặc chấm outfit từ ảnh. Ảnh được thu nhỏ ngay trên
                trình duyệt rồi gửi tới nhà cung cấp AI để phân tích. <b>Máy chủ của {SITE_NAME} không lưu ảnh</b> và không ghi ảnh vào nhật ký.
              </p>
              <p>
                Tính năng ghép mặt vào nhân vật được xử lý hoàn toàn trên trình duyệt của bạn; ảnh không được gửi đi đâu cả.
              </p>
              <p>
                Chúng tôi yêu cầu AI chỉ nhận xét trang phục và màu sắc, không nhận xét khuôn mặt, vóc dáng, tuổi, dân tộc hay tôn giáo. Vui lòng
                chỉ tải ảnh của chính bạn hoặc ảnh bạn đã được người trong ảnh đồng ý.
              </p>
            </>
          ),
        },
        {
          id: "muc-dich",
          heading: "Chúng tôi dùng dữ liệu để làm gì",
          body: (
            <ul>
              <li>Cho phép bạn đăng nhập, lưu và mở lại lookbook trên nhiều thiết bị.</li>
              <li>Hiển thị bộ phối bạn chọn công khai trên lookbook cộng đồng, kèm tên hiển thị của bạn.</li>
              <li>Tạo lời phê, gợi ý phối đồ và chấm điểm outfit bằng AI khi bạn yêu cầu.</li>
              <li>Tiếp nhận và xử lý báo cáo sai sót nội dung văn hóa.</li>
              <li>Bảo vệ dịch vụ khỏi lạm dụng và khắc phục lỗi kỹ thuật.</li>
            </ul>
          ),
        },
        {
          id: "chia-se",
          heading: "Bên thứ ba xử lý dữ liệu",
          body: (
            <>
              <p>Chúng tôi không bán hay cho thuê dữ liệu. Để vận hành, một số dữ liệu được xử lý bởi các nhà cung cấp sau:</p>
              <ul>
                <li>
                  <b>Supabase</b>: xác thực tài khoản và cơ sở dữ liệu lưu hồ sơ, lookbook, báo cáo.
                </li>
                <li>
                  <b>Cloudflare</b>: lưu trữ và phân phối trang web, ghi nhật ký kỹ thuật.
                </li>
                <li>
                  <b>Google</b>: đăng nhập bằng Google (nếu bạn chọn) và mô hình AI Gemini để phân tích văn bản và ảnh.
                </li>
                <li>
                  <b>DeepSeek</b>: mô hình AI dự phòng, chỉ được gọi khi Gemini tạm thời không phản hồi. Máy chủ của DeepSeek đặt ngoài Việt Nam.
                </li>
                <li>
                  <b>Open-Meteo</b>: dữ liệu thời tiết. Trình duyệt chỉ gửi tọa độ của thành phố bạn chọn, không gửi thông tin cá nhân.
                </li>
              </ul>
              <p>
                Dữ liệu gửi tới các nhà cung cấp này có thể được xử lý tại máy chủ ở nước ngoài và chịu thêm chính sách riêng của từng nhà cung
                cấp.
              </p>
            </>
          ),
        },
        {
          id: "trinh-duyet",
          heading: "Lưu trữ trên trình duyệt",
          body: (
            <p>
              Ứng dụng dùng bộ nhớ cục bộ của trình duyệt (localStorage) để lưu bản nháp đang phối, bộ phối lưu khi chưa đăng nhập, khay so sánh
              và phiên đăng nhập. Chúng tôi không dùng cookie quảng cáo hay công cụ phân tích hành vi. Bạn có thể xóa các dữ liệu này bất kỳ lúc
              nào bằng cách xóa dữ liệu trang web trong cài đặt trình duyệt.
            </p>
          ),
        },
        {
          id: "cong-khai",
          heading: "Nội dung công khai",
          body: (
            <p>
              Bộ phối bạn bật công khai sẽ hiển thị cho mọi người trên lookbook cộng đồng và có thể truy cập qua đường link, kèm tên hiển thị của
              bạn. Link chia sẻ dạng <code>/xem?l=…</code> chứa toàn bộ cấu hình bộ phối ngay trong đường link và không kèm thông tin tài khoản.
              Bạn có thể chuyển bộ phối về riêng tư hoặc xóa trong trang Lookbook.
            </p>
          ),
        },
        {
          id: "luu-giu",
          heading: "Thời gian lưu giữ",
          body: (
            <p>
              Hồ sơ và lookbook được lưu cho tới khi bạn xóa hoặc yêu cầu xóa tài khoản. Báo cáo sai sót được lưu để ban biên tập đối chiếu và có
              thể được giữ lại dưới dạng không gắn với tài khoản sau khi tài khoản bị xóa. Nhật ký kỹ thuật được lưu trong thời gian ngắn theo cấu
              hình của nhà cung cấp hạ tầng.
            </p>
          ),
        },
        {
          id: "quyen",
          heading: "Quyền của bạn",
          body: (
            <>
              <p>Bạn có quyền:</p>
              <ul>
                <li>Xem, sửa tên hiển thị và các bộ phối của mình.</li>
                <li>Xóa từng bộ phối ngay trong ứng dụng.</li>
                <li>Yêu cầu nhận bản sao dữ liệu, xóa tài khoản và toàn bộ dữ liệu gắn với tài khoản.</li>
                <li>Rút lại sự đồng ý bằng cách ngừng sử dụng và yêu cầu xóa dữ liệu.</li>
              </ul>
              <p>
                Gửi yêu cầu tới <Mail subject="Yêu cầu về dữ liệu cá nhân" /> từ email bạn dùng để đăng nhập. Chúng tôi sẽ phản hồi trong thời gian
                sớm nhất có thể.
              </p>
            </>
          ),
        },
        {
          id: "tre-em",
          heading: "Người dùng chưa thành niên",
          body: (
            <p>
              {SITE_NAME} hướng tới học sinh, sinh viên. Nếu bạn chưa đủ 16 tuổi, hãy hỏi ý kiến cha mẹ hoặc người giám hộ trước khi tạo tài khoản
              hoặc tải ảnh lên. Nếu phát hiện dữ liệu của trẻ em được cung cấp mà chưa có sự đồng ý phù hợp, vui lòng liên hệ để chúng tôi xóa.
            </p>
          ),
        },
        {
          id: "bao-mat",
          heading: "Bảo mật",
          body: (
            <p>
              Kết nối tới trang được mã hóa HTTPS. Khóa truy cập dịch vụ AI chỉ nằm trên máy chủ. Dữ liệu trong cơ sở dữ liệu được bảo vệ bằng phân
              quyền theo từng dòng: chỉ bạn sửa và xóa được bộ phối của mình, người khác chỉ xem được bộ bạn đã công khai. Không hệ thống nào an
              toàn tuyệt đối; nếu phát hiện lỗ hổng, vui lòng báo cho chúng tôi.
            </p>
          ),
        },
        {
          id: "thay-doi",
          heading: "Thay đổi chính sách và liên hệ",
          body: (
            <p>
              Khi chính sách thay đổi, chúng tôi cập nhật ngày ở đầu trang. Mọi câu hỏi về quyền riêng tư, vui lòng gửi tới{" "}
              <Mail subject="Câu hỏi về quyền riêng tư" /> hoặc xem trang <Link href="/lien-he">Liên hệ</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
