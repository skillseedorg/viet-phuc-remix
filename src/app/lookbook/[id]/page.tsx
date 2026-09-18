import { notFound } from "next/navigation";
import SharedLook from "@/components/SharedLook";
import { getSupabase } from "@/lib/supabase";
import { cloud } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

const UUID = /^[0-9a-f-]{36}$/i;

async function load(id: string) {
  if (!UUID.test(id)) return null;
  const sb = getSupabase();
  if (!sb) return null;
  const res = await cloud.getLook(sb, id);
  return res.ok ? res.data : null;
}

export async function generateMetadata({ params }: Props) {
  const look = await load((await params).id);
  return { title: look ? `${look.title} — Lookbook Việt phục` : "Không tìm thấy bộ phối" };
}

export default async function Page({ params }: Props) {
  const look = await load((await params).id);
  if (!look) notFound();
  return <SharedLook look={look.config} title={look.title} owner={look.owner} ai={look.ai} />;
}
