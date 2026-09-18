# Form trình bày giải pháp — Việt phục Remix

## Tên giải pháp

Việt phục Remix

## Nhu cầu người dùng và tình huống sử dụng

Người dùng chính là học sinh, sinh viên (Gen Z) muốn mặc Việt phục trong những dịp cụ thể nhưng chưa có công cụ giúp họ vừa phối đẹp vừa hiểu đúng. Từ bối cảnh đề bài, đội xác định ba vấn đề:

1. Không biết mặc gì cho dịp nào: áo tứ thân có hợp đi đám cưới không, đi chùa đầu năm có nên mặc áo nhật bình, áo tấc có mặc đi dạo phố được không.
2. Muốn trông hiện đại, có cá tính, nhưng sợ remix quá đà thành phản cảm: cắt áo dài thành croptop, mặc áo đỏ kèm khăn mấn khi làm khách đám cưới, in rồng lên áo vàng, dùng thổ cẩm không rõ nguồn gốc.
3. Thông tin về trang phục trên mạng rời rạc, lẫn lộn giữa tư liệu lịch sử, cách hiểu dân gian và giai thoại chưa kiểm chứng.

Tình huống sử dụng chính:
- Chuẩn bị đồ chúc Tết, đi chùa đầu năm, lễ hội làng.
- Nhóm lớp chọn trang phục chụp kỷ yếu, lễ tốt nghiệp; so sánh vài phương án trước khi thống nhất.
- Làm khách đám cưới, cần lịch sự và không trùng cô dâu.
- Chụp ảnh phố cổ Hội An, Huế, Hà Nội theo phong cách streetwear nhưng vẫn giữ đặc trưng áo.
- Chuẩn bị tiết mục, gian hàng cho sự kiện văn hóa ở trường và cần giới thiệu ngắn về trang phục mình mặc.
- Xem thời tiết hôm đó để chọn chất liệu, áo khoác, giày dép phù hợp.

## Tóm tắt giải pháp

Việt phục Remix là web app phối Việt phục theo mô hình "làm bài trong vở ô ly": người dùng đi qua từng bài chọn lựa, nhân vật minh họa thay đổi ngay, và "cô giáo văn hóa" khoanh bút đỏ vào những chỗ dễ làm sai lệch đặc trưng trang phục, kèm lý do và nút sửa một chạm.

Trải nghiệm chính:

1. Phối đồ trực quan. Chọn dịp (8 sự kiện), vùng miền (Bắc, Trung, Nam), loại áo (áo dài, tứ thân, ngũ thân, bà ba, nhật bình, áo tấc), màu áo, màu quần hoặc váy, màu phụ kiện (13 màu truyền thống có ý nghĩa), hoa văn, chất liệu, đội đầu, giày dép, áo khoác và phụ kiện. Nhân vật vẽ bằng SVG cập nhật tức thì; có thể chọn tông da, kiểu tóc, hoặc ghép ảnh mặt của mình vào nhân vật.

2. Kiểm tra văn hóa theo thời gian thực. Bộ quy tắc xét dịp và độ trang trọng, cấu trúc áo (áo dài phải còn tà, tứ thân đi cùng váy và thắt lưng), biểu tượng quyền uy (rồng năm móng, hoàng bào), màu mang nghĩa phong tục (khăn trắng gợi tang, đỏ và khăn mấn dễ trùng cô dâu), nguồn gốc cộng đồng (thổ cẩm, khăn rằn), pha trộn vùng miền và thời tiết. Mỗi cảnh báo có mức Lưu ý, Nên sửa, Cần sửa và được đánh số trên hình. Nguyên tắc là cảnh báo để hiểu chứ không cấm.

3. Chấm điểm và hài hòa màu. Khung "Điểm | Lời phê" kết hợp điểm văn hóa và điểm hài hòa màu, nhận diện các cách phối màu kinh điển (nâu non, đen, xanh hoa lý của áo tứ thân; tím trắng xứ Huế) và gợi ý màu phụ kiện tốt hơn.

4. AI stylist. Nhờ AI phê chi tiết: đặt tên bộ phối, giải thích vì sao hợp dịp, góc văn hóa, mẹo mặc và chụp ảnh, caption mạng xã hội, và tối đa ba đề xuất chỉnh sửa áp dụng được ngay. Tải ảnh lên để AI gợi ý bảng màu và loại áo hợp với phong cách hiện tại; nếu ảnh đang mặc Việt phục, AI nhận diện và góp ý.

5. Sổ tay văn hóa. Mỗi loại áo có nguồn gốc, ý nghĩa, cấu tạo, cách phối truyền thống, cách remix nên thử và cần cân nhắc, nguồn tham khảo. Mọi nhận định mang nhãn "Có tư liệu", "Cách hiểu dân gian" hoặc "Còn nhiều giả thuyết". Người dùng có thể hỏi đáp với AI, và AI chỉ trả lời trong phạm vi sổ tay.

6. Gợi ý theo thời tiết. Lấy thời tiết thực của 8 thành phố để gợi ý chất liệu, áo khoác, giày dép, áp dụng bằng một nút.

7. So sánh và lookbook. Đưa tối đa ba bộ vào khay so sánh, chấm theo cùng một dịp, nhờ AI chọn giúp. Lưu bộ phối vào lookbook (trên máy hoặc tài khoản), công khai lên lookbook cộng đồng, chia sẻ bằng link hoặc tải thẻ lookbook dạng ảnh PNG.

8. Kênh báo sai. Người dùng báo thông tin chưa chính xác; báo cáo được lưu kèm trạng thái để ban biên tập đối chiếu nguồn.

## Tác động kỳ vọng

Với người dùng:
- Tự tin mặc Việt phục đúng dịp, giảm lo lắng "mặc sai" và tránh những tình huống khó xử như trùng cô dâu hay mặc lễ phục đi chơi.
- Hiểu vì sao một cách phối hợp hay chưa hợp, thay vì chỉ làm theo; mỗi lần phối đồ là một lần học về cấu tạo, màu sắc và biểu tượng.
- Phân biệt được tư liệu lịch sử với cách hiểu dân gian nhờ nhãn độ tin cậy, hình thành thói quen kiểm chứng thông tin.
- Tiết kiệm thời gian khi cả nhóm cần chọn trang phục cho kỷ yếu, sự kiện trường: so sánh phương án và chia sẻ lookbook trong một nơi.

Với cộng đồng:
- Lookbook cộng đồng và thẻ chia sẻ lan tỏa hình ảnh Việt phục được phối đẹp và đúng lên mạng xã hội, nơi người trẻ dành nhiều thời gian.
- Caption và ghi chú văn hóa đi kèm bộ ảnh giúp người xem cũng hiểu thêm về trang phục, không chỉ người mặc.
- Kênh báo sai tạo cơ chế để người am hiểu cùng góp phần làm nội dung chính xác hơn.

Với bảo tồn và phát huy giá trị văn hóa:
- Khuyến khích sáng tạo có giới hạn: người trẻ được remix nhưng luôn biết đâu là đặc trưng không nên đánh mất (tà áo dài, cấu trúc năm thân, ý nghĩa của biểu tượng cung đình).
- Đưa những trang phục ít quen thuộc hơn áo dài (áo tứ thân, ngũ thân, nhật bình, áo tấc, bà ba) đến gần người trẻ, kèm bối cảnh vùng miền.
- Nêu rõ nguồn gốc cộng đồng của các yếu tố như thổ cẩm, khăn rằn, góp phần tránh chiếm dụng văn hóa thiếu ghi nhận.
- Kho tri thức và bộ quy tắc có cấu trúc, dễ mở rộng sang trang phục của các dân tộc khác khi có sự tham gia thẩm định của nhà nghiên cứu, bảo tàng và các nhóm phục dựng cổ phục.

## Hướng tiếp cận và giải pháp kỹ thuật

Kiến trúc tổng quan
- Frontend và backend: Next.js 16 (App Router, React 19, TypeScript), Tailwind CSS 4. Trang tĩnh cho sổ tay văn hóa (sinh sẵn khi build), trang động cho studio, chia sẻ và API.
- Xác thực và cơ sở dữ liệu: Supabase (đăng nhập bằng Google hoặc email, PostgreSQL). Client dùng publishable key; dữ liệu được bảo vệ bằng Row Level Security.
- AI: Google Gemini `gemini-3.8-flash` (đa phương thức, nhận ảnh đầu vào), gọi qua API route phía server để không lộ khóa; bật chế độ trả JSON, đặt mức suy luận tối thiểu để phản hồi nhanh; tự chuyển sang mô hình dự phòng khi dịch vụ chính gặp lỗi.
- Thời tiết: Open-Meteo (miễn phí, không cần khóa).
- Triển khai: Cloudflare Workers qua adapter OpenNext, phục vụ tại biên mạng gần người dùng.

Dữ liệu
- Kho tri thức văn hóa (`kb.ts`): 6 loại áo (nguồn gốc, ý nghĩa, cấu tạo, phối truyền thống, remix nên thử và cần cân nhắc, chất liệu, nguồn), 8 sự kiện (độ trang trọng, mức remix tối đa, áo khuyên dùng, màu nên và màu cần cân nhắc), 3 vùng miền, 13 màu truyền thống, 9 hoa văn, phụ kiện và 5 phong cách. Mỗi nhận định gắn mức độ tin cậy và nguồn tham khảo (sách khảo cứu, bảo tàng, tư liệu lịch sử).
- Bảng Supabase: `profiles` (tạo tự động bằng trigger khi đăng ký), `looks` (cấu hình bộ phối dạng jsonb, kết quả AI, trạng thái công khai), `content_reports` (báo sai kèm trạng thái xử lý). Chính sách RLS: ai cũng đọc được bộ phối công khai, chỉ chủ sở hữu được sửa, xóa; ai cũng gửi được báo cáo nhưng không đọc được qua API công khai.

Luồng xử lý chính
1. Người dùng thay đổi lựa chọn, cấu hình bộ phối (một object gồm loại áo, dịp, vùng, màu, hoa văn, phụ kiện, nhân vật) cập nhật trong trình duyệt.
2. Nhân vật SVG được vẽ lại từ cấu hình: mỗi loại áo có hình khối riêng (tà áo dài, vạt tứ thân và yếm, thân con và khuy chéo của ngũ thân, tay thụng áo tấc, cổ bình lĩnh nhật bình), hoa văn dùng SVG pattern, chất liệu thể hiện bằng độ bóng.
3. Bộ quy tắc văn hóa (hàm thuần, xác định) và bộ chấm màu (tính toán trên không gian màu HSL: tương đồng, bổ túc, tam giác màu, độ chói) chạy ngay trên máy, trả về danh sách cảnh báo có vùng trên cơ thể, mức độ và bản vá gợi ý. Vì không phụ thuộc AI, kết quả nhất quán, kiểm thử được và không tốn chi phí.
4. Khi nhờ AI phê, server chạy lại bộ quy tắc, ghép cấu hình, kết quả kiểm tra, điểm màu và đoạn kho tri thức liên quan vào prompt. AI trả JSON theo lược đồ cố định; server lọc lại mọi đề xuất chỉnh sửa, chỉ giữ giá trị hợp lệ trước khi gửi về client.
5. Phân tích ảnh: ảnh được thu nhỏ trong trình duyệt (tối đa 900px), gửi tới API, chuyển thẳng cho mô hình và không lưu trên máy chủ. Tính năng ghép mặt cắt ảnh ngay trên trình duyệt.
6. Lưu và chia sẻ: nếu đã đăng nhập và có bảng, lưu vào Supabase; nếu không, lưu trong trình duyệt. Link chia sẻ mã hóa toàn bộ cấu hình vào URL nên hoạt động kể cả khi không có cơ sở dữ liệu; bộ công khai có trang riêng theo id. Thẻ lookbook xuất ra ảnh PNG bằng html-to-image.

Bảo đảm thông tin văn hóa phù hợp
- Một nguồn sự thật duy nhất: mọi nội dung hiển thị và mọi prompt AI đều lấy từ kho tri thức có nguồn.
- Nhãn độ tin cậy cho từng nhận định.
- Guardrails cho AI: chỉ dựa trên kho tri thức, không bịa năm tháng hay nhân vật, nói rõ khi là cách hiểu dân gian, nói thẳng khi chưa có dữ liệu, không mâu thuẫn với cảnh báo của bộ quy tắc, không nhận xét cơ thể, khuôn mặt, tuổi, dân tộc, tôn giáo trong ảnh.
- Kênh báo sai và quy trình trạng thái để ban biên tập đối chiếu nguồn; hướng tới mời chuyên gia thẩm định.

An toàn và vận hành
- Khóa AI chỉ nằm ở biến môi trường phía server.
- Giới hạn tần suất gọi API theo IP, giới hạn kích thước ảnh và độ dài câu hỏi, thời gian chờ tối đa cho AI.
- Thông báo lỗi bằng tiếng Việt, chỉ rõ cách khắc phục; ứng dụng vẫn dùng được khi chưa cấu hình cơ sở dữ liệu.
- Giao diện đáp ứng từ điện thoại đến máy tính, hỗ trợ bàn phím, nhãn ARIA và giảm chuyển động khi người dùng bật tùy chọn này.
