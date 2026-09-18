# Việt phục Remix

> **Powered by Google Gemini 3.8 Flash** | Built for Antigravity AI Engine

Web app giúp học sinh, sinh viên khám phá và phối trang phục truyền thống Việt Nam (áo dài, áo tứ thân, áo ngũ thân, áo bà ba, áo nhật bình, áo tấc) theo sự kiện, vùng miền, thời tiết và phong cách cá nhân, có bộ kiểm tra văn hóa và AI stylist tích hợp Google Gemini.

## Tài liệu dự án

- 📘 [GEMINI.md](GEMINI.md) — Hướng dẫn phát triển & tích hợp Google Gemini API
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) — Kiến trúc hệ thống & luồng xử lý AI
- 🎨 [DESIGN.md](DESIGN.md) — Design system & phong cách giao diện Vở ô ly
- 📦 [PRODUCT.md](PRODUCT.md) — Hồ sơ sản phẩm & chân dung người dùng
- 📝 [NOP_BAI.md](NOP_BAI.md) — Báo cáo giải pháp chi tiết


## Tính năng

| Yêu cầu đề thi | Ở đâu |
|---|---|
| Chọn loại trang phục hoặc sự kiện | `/phoi-do` Bài 1, Bài 2 |
| Chọn màu sắc, phụ kiện, phong cách | `/phoi-do` Bài 3, 4, 5 |
| Xem kết quả dạng hình ảnh, thẻ gợi ý, mockup | Nhân vật SVG cập nhật tức thì, thẻ lookbook, xuất PNG |
| Thông tin nguồn gốc, ý nghĩa | `/kham-pha`, `/kham-pha/[id]` (có nhãn độ tin cậy + nguồn) |
| Tải ảnh / chọn nhân vật đại diện | Bài 5: tông da, kiểu tóc, ghép mặt từ ảnh, AI phân tích ảnh |
| Gợi ý theo thời tiết và sự kiện | Hộp thời tiết (Open-Meteo) + mẹo theo dịp |
| Kiểm tra hài hòa màu | `src/lib/harmony.ts`, gợi ý màu phụ kiện tốt hơn |
| So sánh các phương án | `/so-sanh` (tối đa 3 bộ, AI chọn giúp) |
| Tạo và chia sẻ lookbook | `/lookbook`, link `/xem?l=...` (không cần DB), `/lookbook/[id]` (công khai) |
| Cảnh báo sai lệch văn hóa | `src/lib/culture.ts`, vòng bút đỏ trên nhân vật, nút "Sửa giúp" |

## Chạy thử

```bash
npm install
cp .env.example .env.local   # điền khóa
npm run dev                  # http://localhost:3000
```

Biến môi trường:

| Biến | Ghi chú |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL dự án Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (an toàn cho trình duyệt, dữ liệu được bảo vệ bằng RLS) |
| `GEMINI_API_KEY` | Google Gemini, chỉ dùng phía server, không bao giờ thêm tiền tố `NEXT_PUBLIC_` |
| `GEMINI_MODEL` | Mặc định `gemini-3.8-flash` |
| `DEEPSEEK_API_KEY` | Không bắt buộc. Dự phòng khi Gemini lỗi (khóa, quyền, quá tải). `AI_FALLBACK=off` để tắt |

## Tạo bảng Supabase

Mở Supabase Dashboard → SQL Editor → dán và chạy toàn bộ [supabase/schema.sql](supabase/schema.sql). File tạo:

- `profiles`: tên hiển thị, tự tạo khi đăng ký (trigger).
- `looks`: bộ phối (`config` jsonb, `ai` jsonb, `is_public`), RLS: ai cũng đọc được bộ công khai, chỉ chủ sở hữu sửa/xóa.
- `content_reports`: báo thông tin sai, ai cũng gửi được, không đọc được qua API công khai.

Khi chưa chạy SQL, app vẫn hoạt động: bộ phối lưu trong trình duyệt và giao diện hiện hướng dẫn.

Nếu bật xác nhận email trong Supabase Auth, người dùng cần bấm link trong email trước khi đăng nhập. Thêm URL triển khai vào Auth → URL Configuration.

## Kiến trúc

```
src/lib/kb.ts          Kho tri thức văn hóa (áo, dịp, màu, hoa văn, phụ kiện, nguồn)
src/lib/culture.ts     Bộ quy tắc kiểm tra văn hóa (thuần hàm, chạy client + server)
src/lib/harmony.ts     Chấm hài hòa màu theo HSL
src/lib/weather.ts     Open-Meteo + gợi ý chất liệu
src/lib/ai.ts          Gọi Gemini (JSON mode, suy luận tối thiểu), dự phòng DeepSeek, guardrails, lọc patch
src/app/api/*          stylist, photo (ảnh), ask (hỏi đáp), compare
src/components/Figure  Nhân vật SVG
```

## Triển khai lên Cloudflare

App có SSR và API routes nên chạy trên **Cloudflare Workers** qua adapter [OpenNext](https://opennext.js.org/cloudflare) (Cloudflare Pages chỉ hợp với bản xuất tĩnh). Cấu hình có sẵn: [wrangler.jsonc](wrangler.jsonc), [open-next.config.ts](open-next.config.ts), [.env.production](.env.production) (giá trị công khai của Supabase, được nhúng lúc build).

Deploy từ máy:

```bash
npx wrangler login
npx wrangler secret put GEMINI_API_KEY     # dán khóa Gemini
npx wrangler secret put DEEPSEEK_API_KEY   # không bắt buộc, dùng làm dự phòng
npm run deploy                             # build + deploy
```

Chạy thử trên runtime Cloudflare trước khi deploy: tạo `.dev.vars` có `GEMINI_API_KEY=...` rồi `npm run preview`.

Deploy tự động từ Git: đẩy code lên GitHub, vào Cloudflare Dashboard → Workers & Pages → Create → Import a repository, đặt build command `npx opennextjs-cloudflare build`, deploy command `npx wrangler deploy`, rồi thêm secret `GEMINI_API_KEY` (và `DEEPSEEK_API_KEY` nếu muốn dự phòng) trong Settings → Variables and Secrets.

Domain chính: **https://vietphuc.site** (gắn vào Worker trong Cloudflare Dashboard). Thêm domain này vào Supabase → Authentication → URL Configuration: Site URL `https://vietphuc.site`, Redirect URLs `https://vietphuc.site/**`. Đổi domain thì sửa `NEXT_PUBLIC_SITE_URL` trong `.env.production` rồi deploy lại.
