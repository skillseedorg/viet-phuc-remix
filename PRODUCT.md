# Product

<!-- impeccable:product-schema 1 -->

> Ghi chú: hồ sơ này được suy ra từ đề thi "Việt phục Remix" (đề Audition) do người dùng cung cấp; không có vòng phỏng vấn. Các mục đánh dấu *(suy luận)* cần đội xác nhận.

## Platform

web

## Stack

delegated: Next.js 16 (App Router, TypeScript) + Tailwind CSS 4. Supabase cho auth và database. Google Gemini (`gemini-3.8-flash`) làm AI engine chính, gọi qua API route phía server để bảo mật khóa API. Gemini được chọn vì hỗ trợ đa phương thức (xử lý ảnh), JSON mode trực tiếp, và phản hồi nhanh với cấu hình thinkingLevel minimal.

## Users

Học sinh, sinh viên Việt Nam (Gen Z) muốn mặc Việt phục cho một dịp cụ thể: Tết, chụp kỷ yếu, lễ tốt nghiệp, đi chùa/lễ hội, làm khách đám cưới, sự kiện văn hóa ở trường, chụp ảnh ở phố cổ. Họ muốn trông hiện đại, hợp cá tính, nhưng sợ mặc "sai" hoặc thiếu hiểu biết về ý nghĩa trang phục. *(suy luận: đa số dùng điện thoại, quyết định nhanh, hay chia sẻ lên mạng xã hội)*

## Product Purpose

Giúp người trẻ khám phá và phối trang phục truyền thống Việt Nam theo sự kiện, vùng miền, thời tiết hoặc phong cách cá nhân; xem kết quả dạng mockup; đọc thông tin ngắn về nguồn gốc/ý nghĩa; và nhận cảnh báo khi phối có thể làm sai lệch đặc trưng văn hóa. Thành công = người dùng tạo được một bộ phối tự tin mặc, hiểu vì sao bộ đó phù hợp, và lưu/chia sẻ lookbook.

## Positioning

Không phải ứng dụng thời trang chung: mọi gợi ý đều đi qua một lớp "kiểm tra văn hóa" dựa trên kho tri thức được biên soạn và có nguồn, AI chỉ diễn giải trong phạm vi kho tri thức đó. Remix được khuyến khích, nhưng có giới hạn được giải thích rõ.

## Operating Context

Người dùng chọn loại áo (áo dài, tứ thân, ngũ thân, bà ba, nhật bình, áo tấc…), sự kiện, vùng miền, màu, hoa văn, phụ kiện (nón lá, khăn vấn, khăn đóng, nón quai thao, guốc mộc, khăn rằn…) và phong cách remix. Có thể tải ảnh để AI gợi ý, xem thời tiết thành phố, so sánh tối đa 3 phương án, lưu và chia sẻ lookbook.

## Capabilities and Constraints

- Auth và lưu lookbook qua Supabase; chỉ có publishable key phía client, nên schema được cung cấp dưới dạng file SQL để chạy thủ công. App phải chạy được (lưu cục bộ) khi bảng chưa tồn tại.
- AI: `deepseek-flash`, hỗ trợ ảnh đầu vào, không tạo ảnh. Mockup trang phục phải được vẽ bằng SVG phía client.
- Thông tin văn hóa phải thận trọng: ghi nguồn tham khảo, nêu rõ chỗ còn nhiều giả thuyết, có kênh báo sai sót.

## Brand Commitments

Tên: "Việt phục Remix". Khẩu hiệu từ đề: "Phối trang phục truyền thống theo phong cách Gen Z". Giao diện tiếng Việt.

## Evidence on Hand

Không có ảnh, người dùng thật, số liệu hay lời chứng thực. Không được bịa số người dùng, đối tác hay chứng nhận của chuyên gia. Mockup và lookbook mẫu phải được đánh dấu là minh họa.

## Product Principles

1. Tôn trọng trước, sáng tạo sau: remix luôn đi kèm lời giải thích văn hóa.
2. Cảnh báo để hiểu, không để cấm: nói rõ vì sao và gợi ý cách sửa.
3. Kết quả phải nhìn thấy được ngay: mỗi lựa chọn cập nhật mockup tức thì.
4. Không bịa: AI chỉ dựa trên kho tri thức có nguồn; chỗ không chắc thì nói không chắc.

## Accessibility & Inclusion

Trang phục không gắn cứng giới tính trong giao diện; hiển thị nhiều tông da cho nhân vật đại diện. Văn bản tiếng Việt có dấu đầy đủ, tương phản đạt WCAG AA.
