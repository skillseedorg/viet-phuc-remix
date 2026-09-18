import Studio from "@/components/studio/Studio";
import { GARMENTS, EVENTS } from "@/lib/kb";
import { DEFAULT_LOOK, decodeLook, withGarment } from "@/lib/look";

export const metadata = {
  title: "Phối đồ — Việt phục Remix",
  description: "Phối Việt phục trong 5 bước: chọn dịp, áo, màu, phụ kiện. Nhân vật đổi ngay, cô giáo văn hóa khoanh đỏ chỗ cần sửa.",
  openGraph: { type: "website", locale: "vi_VN", siteName: "Việt phục Remix", title: "Phối đồ — Việt phục Remix", description: "Phối Việt phục trong 5 bước: chọn dịp, áo, màu, phụ kiện. Nhân vật đổi ngay, cô giáo văn hóa khoanh đỏ chỗ cần sửa.", images: [{ url: "/og/phoi-do.png", width: 1200, height: 630, alt: "Phối Việt phục trong 5 bước: nhân vật áo dài có vòng bút đỏ và bảng màu truyền thống" }] },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const decoded = decodeLook(sp.l);
  let initial = decoded?.config ?? null;
  const ao = GARMENTS.find((g) => g.id === sp.ao)?.id;
  const dip = EVENTS.find((e) => e.id === sp.dip)?.id;
  if (!initial && (ao || dip)) {
    initial = { ...(ao ? withGarment(DEFAULT_LOOK, ao) : DEFAULT_LOOK), ...(dip ? { event: dip } : {}) };
  }
  return <Studio initial={initial} initialTitle={decoded?.title} />;
}
