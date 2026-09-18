"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Columns3, Globe, Lock, PencilLine, Share2, Trash2 } from "lucide-react";
import LookCard from "../LookCard";
import CloudNotice from "../CloudNotice";
import { useApp } from "../Providers";
import { Button, cx } from "../ui";
import { getSupabase } from "@/lib/supabase";
import { cloud } from "@/lib/store";
import { EXAMPLE_LOOKS, encodeLook, type SavedLook } from "@/lib/look";

type Tab = "cua-toi" | "cong-dong";

export default function Lookbook() {
  const { looks, removeLook, setLookPublic, compare, toggleCompare, user } = useApp();
  const [tab, setTab] = useState<Tab>("cua-toi");
  const [community, setCommunity] = useState<SavedLook[] | null>(null);
  const [communityNote, setCommunityNote] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (tab !== "cong-dong" || community) return;
    const sb = getSupabase();
    if (!sb) {
      setCommunity([]);
      return;
    }
    cloud.publicLooks(sb).then((res) => {
      if (res.ok) setCommunity(res.data);
      else {
        setCommunity([]);
        setCommunityNote(res.missingTables ? "Lookbook cộng đồng sẽ hoạt động sau khi chạy supabase/schema.sql." : res.message);
      }
    });
  }, [tab, community]);

  const shareLink = (l: SavedLook) =>
    l.source === "cloud" && l.isPublic ? `${location.origin}/lookbook/${l.id}` : `${location.origin}/xem?l=${encodeLook(l.config, l.title)}`;

  const copy = async (l: SavedLook) => {
    try {
      await navigator.clipboard.writeText(shareLink(l));
      setCopied(l.id);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      window.open(shareLink(l), "_blank");
    }
  };

  const list = tab === "cua-toi" ? looks : community ?? [];

  return (
    <main className="mx-auto max-w-[1320px] px-2 pb-16 pt-4 sm:px-6 sm:pt-6">
      <div className="paper sheet-shadow rounded-[14px] px-4 py-8 sm:px-10 sm:pl-20 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(32px,4.4vw,54px)] font-extrabold leading-[1] tracking-[-0.03em] text-ink-deep">
              Lookbook <span className="hand font-normal text-redpen">Việt phục</span>
            </h1>
            <p className="mt-2 max-w-[56ch] text-[15.5px] text-muted">
              Các bộ phối bạn đã lưu. Mở lại để sửa, gom vào khay so sánh, hoặc chia sẻ link cho bạn bè.
            </p>
          </div>
          <div role="tablist" aria-label="Lookbook" className="flex rounded-[12px] bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,.08)]">
            {(
              [
                ["cua-toi", `Của tôi (${looks.length})`],
                ["cong-dong", "Cộng đồng"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cx("h-10 rounded-[9px] px-4 text-[14.5px] font-bold", tab === id ? "bg-ink text-white" : "text-ink hover:bg-ink-soft")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === "cua-toi" && (
          <div className="mt-6">
            <CloudNotice />
          </div>
        )}
        {tab === "cong-dong" && communityNote && <p className="mt-6 rounded-[12px] bg-tape/60 px-4 py-3 text-[14.5px] text-ink-deep">{communityNote}</p>}

        {tab === "cong-dong" && community === null && <p className="hand mt-8 text-[22px] text-ink">Đang mở lookbook cộng đồng...</p>}

        {list.length === 0 && (tab === "cua-toi" || community !== null) && (
          <div className="mt-8 grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="hand text-[28px] leading-tight text-ink">
                {tab === "cua-toi" ? "Trang vở còn trống." : "Chưa có bộ phối công khai nào."}
              </p>
              <p className="mt-2 max-w-[44ch] text-[15.5px] text-muted">
                {tab === "cua-toi"
                  ? "Phối một bộ rồi bấm Lưu, bộ phối sẽ xuất hiện ở đây. Hoặc bắt đầu từ một bộ mẫu bên cạnh."
                  : user
                    ? "Khi lưu bộ phối, bật Công khai lên cộng đồng để bạn bè cùng xem."
                    : "Đăng nhập và lưu bộ phối ở chế độ công khai để mở màn lookbook cộng đồng."}
              </p>
              <Button href="/phoi-do" className="mt-4">
                Mở vở phối đồ
              </Button>
            </div>
            <div className="grid gap-3">
              <p className="text-[13px] font-semibold text-muted">Bộ mẫu minh họa</p>
              {EXAMPLE_LOOKS.slice(1).map((ex) => (
                <Link key={ex.title} href={`/phoi-do?l=${encodeLook(ex.config, ex.title)}`} className="block transition-transform hover:-translate-y-0.5">
                  <LookCard look={ex.config} title={ex.title} compact />
                </Link>
              ))}
            </div>
          </div>
        )}

        {list.length > 0 && (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((l) => {
              const inCompare = compare.some((c) => c.id === l.id);
              const mine = tab === "cua-toi";
              return (
                <li key={`${l.source}-${l.id}`} className="flex flex-col gap-2">
                  <LookCard look={l.config} title={l.title} owner={mine ? null : l.owner} compact />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button size="sm" href={`/phoi-do?l=${encodeLook(l.config, l.title)}`}>
                      <PencilLine className="size-4" aria-hidden /> Mở lại
                    </Button>
                    <Button size="sm" variant={inCompare ? "ink" : "outline"} onClick={() => toggleCompare(l)} aria-pressed={inCompare}>
                      <Columns3 className="size-4" aria-hidden /> {inCompare ? "Đang so sánh" : "So sánh"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copy(l)} aria-label="Sao chép link chia sẻ">
                      <Share2 className="size-4" aria-hidden /> {copied === l.id ? "Đã chép" : "Link"}
                    </Button>
                    {mine && l.source === "cloud" && (
                      <Button size="sm" variant="ghost" onClick={() => setLookPublic(l, !l.isPublic)} title={l.isPublic ? "Đang công khai" : "Đang riêng tư"}>
                        {l.isPublic ? <Globe className="size-4" aria-hidden /> : <Lock className="size-4" aria-hidden />}
                        {l.isPublic ? "Công khai" : "Riêng tư"}
                      </Button>
                    )}
                    {mine && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Xóa bộ phối "${l.title}"?`)) void removeLook(l);
                        }}
                        className="ml-auto grid size-9 place-items-center rounded-full text-muted hover:bg-redpen-soft hover:text-redpen"
                        aria-label={`Xóa ${l.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[12.5px] text-muted">
                    {l.source === "local" ? "Lưu trên máy này" : "Lưu trên tài khoản"} · {new Date(l.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
