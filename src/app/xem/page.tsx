import { notFound } from "next/navigation";
import SharedLook from "@/components/SharedLook";
import { garmentById } from "@/lib/kb";
import { decodeLook } from "@/lib/look";

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ searchParams }: Props) {
  const decoded = decodeLook((await searchParams).l);
  if (!decoded) return { title: "Bộ phối — Việt phục Remix" };
  return {
    title: `${decoded.title ?? "Bộ phối"} — Việt phục Remix`,
    description: `Bộ ${garmentById(decoded.config.garment).name.toLowerCase()} được phối trên Việt phục Remix.`,
  };
}

export default async function Page({ searchParams }: Props) {
  const decoded = decodeLook((await searchParams).l);
  if (!decoded) notFound();
  return <SharedLook look={decoded.config} title={decoded.title ?? "Bộ phối Việt phục"} />;
}
