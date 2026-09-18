import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Patrick_Hand } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { Providers } from "@/components/Providers";
import { SITE_URL } from "@/lib/site";

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const hand = Patrick_Hand({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-hand-face",
  display: "swap",
});

const DESCRIPTION =
  "Chọn áo dài, áo tứ thân, áo ngũ thân, áo bà ba theo sự kiện và vùng miền, phối màu và phụ kiện, xem mockup, kiểm tra văn hóa và tạo lookbook Việt phục.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Việt phục Remix — Phối trang phục truyền thống theo phong cách Gen Z",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Việt phục Remix",
    title: "Việt phục Remix — Phối trang phục truyền thống theo phong cách Gen Z",
    description: DESCRIPTION,
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Việt phục Remix: ba nhân vật mặc áo dài, áo tứ thân, áo bà ba trên bìa vở tím, kèm điểm 9.5 viết bút đỏ" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#3a27a3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${body.variable} ${hand.variable}`}>
      <body className="min-h-dvh antialiased">
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Phối Việt phục như làm một bài tập trong vở ô ly: chọn từng "bài", cô giáo văn hóa phê bằng bút đỏ. Từ chối kiểu poster Tết đỏ vàng sơn mài và kiểu shop thời trang trắng tối giản.
OWN-WORLD: Bìa vở tím mực, trang giấy trắng kẻ ô ly có lề đỏ đôi, mực tím cho lựa chọn, bút đỏ cho cảnh báo và điểm, nhãn vở viền đôi, mẫu vải cắt răng cưa, băng keo vàng dán ảnh.
STORY: Học sinh chọn dịp, áo, màu, phụ kiện; thấy nhân vật đổi ngay; đọc lời phê; sửa bằng một chạm; lưu vào lookbook và chia sẻ.
FIRST VIEWPORT: Trang chủ là bìa vở với nhãn vở lớn và nhân vật mẫu; studio là vở mở đôi, trang trái nhân vật có vòng bút đỏ, trang phải là các bài chọn; nút lưu và chia sẻ trong khung Điểm | Lời phê.
FORM: Vở ô ly học sinh Việt Nam, ứng viên số 6 trong danh sách, seed 3bc22f9b.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
