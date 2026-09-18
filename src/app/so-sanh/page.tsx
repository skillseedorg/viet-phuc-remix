import SiteFooter from "@/components/SiteFooter";
import Compare from "@/components/compare/Compare";

export const metadata = { title: "So sánh bộ phối — Việt phục Remix" };

export default function Page() {
  return (
    <>
      <Compare />
      <SiteFooter />
    </>
  );
}
