"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2, WandSparkles } from "lucide-react";
import { postJSON, type PhotoResult } from "@/lib/ai-types";
import { colorById, garmentById, type EventId } from "@/lib/kb";
import type { LookConfig } from "@/lib/look";
import { Button } from "../ui";
import { imageFileError, resizeImage } from "@/lib/image";

/** Cắt vùng vuông phía trên giữa ảnh để làm mặt nhân vật. */
async function cropFace(dataUrl: string): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.src = dataUrl;
  });
  const side = Math.min(img.width, img.height) * 0.72;
  const sx = (img.width - side) / 2;
  const sy = img.height > img.width ? img.height * 0.08 : (img.height - side) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = 220;
  canvas.height = 240;
  canvas.getContext("2d")!.drawImage(img, sx, sy, side, side * 1.09, 0, 0, 220, 240);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function PhotoCoach({
  event,
  face,
  onFace,
  onApply,
}: {
  event: EventId | null;
  face: string | null;
  onFace: (f: string | null) => void;
  onApply: (patch: Partial<LookConfig>, label: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file?: File) => {
    if (!file) return;
    setError(null);
    setResult(null);
    const invalid = imageFileError(file);
    if (invalid) return setError(invalid);
    try {
      setPhoto(await resizeImage(file));
    } catch {
      setError("Không đọc được ảnh này, thử ảnh JPG hoặc PNG khác.");
    }
  };

  const analyze = async () => {
    if (!photo) return;
    setLoading(true);
    setError(null);
    try {
      const { result } = await postJSON<{ result: PhotoResult }>("/api/photo", { image: photo, event });
      setResult(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      {!photo ? (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void pick(e.dataTransfer.files?.[0]);
          }}
          className="flex w-full items-center gap-3 rounded-[12px] border-[1.5px] border-dashed border-ink/40 bg-white/70 p-4 text-left hover:border-ink hover:bg-ink-soft/60"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink-soft text-ink">
            <ImagePlus className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-semibold text-ink-deep">Tải ảnh của bạn</span>
            <span className="block text-[13.5px] text-muted">
              Ghép mặt vào nhân vật hoặc nhờ AI gợi ý màu hợp với bạn. Ảnh chỉ được gửi tới AI khi bạn bấm phân tích và không được lưu trên máy chủ.
            </span>
          </span>
        </button>
      ) : (
        <div className="flex flex-wrap items-start gap-3">
          <div className="relative -rotate-2 bg-white p-1.5 pb-5 shadow-[0_2px_4px_rgba(0,0,0,.12),0_10px_20px_-12px_rgba(0,0,0,.5)]">
            <span className="tape absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-3" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="Ảnh bạn đã tải lên" className="h-32 w-28 object-cover" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Button size="sm" onClick={analyze} loading={loading}>
              <WandSparkles className="size-4" aria-hidden /> Nhờ AI gợi ý từ ảnh
            </Button>
            <Button size="sm" variant="outline" onClick={async () => onFace(face ? null : await cropFace(photo))}>
              <Camera className="size-4" aria-hidden /> {face ? "Bỏ mặt khỏi nhân vật" : "Ghép mặt vào nhân vật"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setPhoto(null);
                setResult(null);
                onFace(null);
              }}
            >
              <Trash2 className="size-4" aria-hidden /> Xóa ảnh
            </Button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-[14px] text-redpen">
          {error}
        </p>
      )}
      {loading && <p className="hand text-[18px] text-ink">AI đang xem ảnh của bạn...</p>}
      {result && (
        <div className="fade-up space-y-2 rounded-[12px] bg-white p-3 text-[14.5px] shadow-[0_1px_2px_rgba(0,0,0,.08)]">
          <ul className="space-y-1">
            {result.observations.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
                {o}
              </li>
            ))}
          </ul>
          {result.outfit.isTraditional && (
            <div className="rounded-[10px] bg-redpen-soft p-2.5">
              <p className="font-semibold text-redpen">
                Bạn đang mặc {result.outfit.garmentGuess ? garmentById(result.outfit.garmentGuess).name.toLowerCase() : "Việt phục"}
              </p>
              {result.outfit.comments.map((c) => (
                <p key={c} className="hand text-[18px] leading-snug text-redpen">
                  {c}
                </p>
              ))}
            </div>
          )}
          {result.palette.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {result.palette.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 text-[13px]">
                  <span className="pinked block size-6" style={{ background: colorById(c).hex }} />
                  {colorById(c).name}
                </span>
              ))}
              <span className="w-full text-[13.5px] text-muted">{result.paletteReason}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-grid pt-2">
            <p className="min-w-0 flex-1">
              <span className="font-semibold text-ink-deep">{result.recommendation.label}.</span> {result.recommendation.reason}
            </p>
            {Object.keys(result.recommendation.patch).length > 0 && (
              <Button size="sm" onClick={() => onApply(result.recommendation.patch, result.recommendation.label)}>
                Mặc thử
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
