import SiteFooter from "@/components/SiteFooter";
import Lookbook from "@/components/lookbook/Lookbook";

export const metadata = { title: "Lookbook Việt phục — Việt phục Remix" };

export default function Page() {
  return (
    <>
      <Lookbook />
      <SiteFooter />
    </>
  );
}
