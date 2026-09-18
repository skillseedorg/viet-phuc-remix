# Design — Việt phục Remix

Ghi lại từ giao diện đã dựng (không phải bản kế hoạch). Nguồn token: `src/app/globals.css`.

## Thế giới hình ảnh: vở ô ly học sinh

Phối Việt phục như làm bài tập trong vở: bìa vở tím, trang giấy kẻ ô ly có lề đỏ đôi, lựa chọn đánh dấu bằng mực tím, cảnh báo văn hóa và điểm số viết bằng bút đỏ của cô giáo.

## Màu

| Token | Giá trị | Vai trò |
|---|---|---|
| `cover` | `#3a27a3` | Bìa vở: nền trang, header, thanh điều hướng di động |
| `paper` | `#fdfdff` | Trang giấy (luôn kèm lớp kẻ ô ly `.paper` hoặc `.paper-plain`) |
| `ink` / `ink-deep` | `#3d2aa8` / `#211766` | Mực tím: nút chính, lựa chọn đang chọn, tiêu đề |
| `ink-soft` | `#ebe7fb` | Nền lựa chọn đang chọn, hover |
| `redpen` / `redpen-soft` | `#cf1f3a` / `#fde9ec` | Bút đỏ: lời phê, điểm, cảnh báo "Nên sửa/Cần sửa" |
| `margin` | `#e36a80` | Lề đỏ đôi trên giấy |
| `cover-lime`, `tape` | `#c8e04a`, `#f6e27a` | Sticker, băng keo, nhãn "mới" |
| `text` / `muted` | `#1d1a2e` / `#595476` | Chữ thường / chữ phụ |

Chiến lược: Committed. Tím bìa vở chiếm vùng lớn, giấy trắng lạnh (không dùng kem), đỏ chỉ dành cho lời phê.

## Chữ

- **Be Vietnam Pro** (400–800): toàn bộ giao diện. Tiêu đề 800, tracking âm (-0.02 đến -0.035em).
- **Patrick Hand** (`.hand`): chữ viết tay cho lời phê, điểm, nhãn vở, từ nhấn trong tiêu đề. Không dùng cho đoạn văn dài.
- Cả hai đều có subset tiếng Việt.

## Thành phần đặc trưng

- **Khung Điểm | Lời phê**: bảng hai ô như tờ bài kiểm tra; điểm khoanh tròn bằng nét bút đỏ vẽ dần.
- **Nhãn vở** (`.nhan-vo`): thẻ trắng viền đôi, hàng "Nhãn: giá trị viết tay" trên dòng chấm. Dùng cho hero, thẻ lookbook.
- **Choice**: ô vuông/tròn, khi chọn hiện dấu tick mực tím vẽ dần; món hiện đại gắn nhãn "mới" màu lime.
- **Swatch**: mẫu vải cắt răng cưa (`.pinked`), khi chọn được khoanh tròn bằng mực.
- **Vòng bút đỏ trên nhân vật**: đánh số theo danh sách lời phê; đỏ cho Nên sửa/Cần sửa, tím cho Lưu ý.
- **Gáy vở**: dải gradient có hai ghim bấm giữa hai trang ở studio desktop.
- **Nhân vật SVG** (`Figure.tsx`): 6 loại áo, hoa văn, chất liệu, phụ kiện, tông da, kiểu tóc, ghép ảnh mặt.

## Bố cục

- Studio desktop: vở mở đôi `5fr | 26px gáy | 7fr`, trang trái dính khi cuộn. Di động: xếp dọc, có nút xem nhanh nhân vật cố định góc phải.
- Trang đọc: một tờ giấy lớn, lề đỏ bên trái (`pl-20` trên desktop), độ dài dòng 60–72ch.
- Thanh điều hướng: tab trên bìa vở (desktop, tab đang mở nối liền với tờ giấy), thanh dưới 5 mục (di động).

## Chuyển động

Một chuyển động chính: nét mực vẽ dần (`.ink-draw`, `.tick`) cho dấu tick, vòng khoanh, điểm số. Nội dung mới hiện bằng `.fade-up`. Tắt khi `prefers-reduced-motion`.

## Không làm

Không poster đỏ vàng sơn mài, không nền kem, không gradient chữ, không emoji làm icon (dùng lucide-react), không bóng đổ khối cứng.
