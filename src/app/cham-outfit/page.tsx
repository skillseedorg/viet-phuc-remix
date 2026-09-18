import SiteFooter from "@/components/SiteFooter";
import OutfitScan from "@/components/scan/OutfitScan";

export const metadata = {
  title: "Chấm outfit từ ảnh — Việt phục Remix",
  description: "Tải ảnh bạn mặc Việt phục, AI nhận diện áo, màu, phụ kiện rồi chấm điểm văn hóa và hài hòa màu.",
  openGraph: { type: "website", locale: "vi_VN", siteName: "Việt phục Remix", title: "Chấm outfit từ ảnh — Việt phục Remix", description: "Tải ảnh bạn mặc Việt phục, AI nhận diện áo, màu, phụ kiện rồi chấm điểm văn hóa và hài hòa màu.", images: [{ url: "/og/cham-outfit.png", width: 1200, height: 630, alt: "Chấm outfit từ ảnh chụp: ảnh dán băng keo và thẻ điểm 9.5 viết bút đỏ" }] },
};

export default function Page() {
  return (
    <>
      <OutfitScan />
      <SiteFooter />
    </>
  );
}
