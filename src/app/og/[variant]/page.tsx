import { notFound } from "next/navigation";
import Figure from "@/components/Figure";
import { LogoMark } from "@/components/SiteHeader";
import { checkCulture } from "@/lib/culture";
import { COLORS, GARMENTS } from "@/lib/kb";
import { DEFAULT_LOOK, EXAMPLE_LOOKS, previewLook, type LookConfig } from "@/lib/look";

/**
 * Khung dựng ảnh Open Graph 1200x630. Chỉ dùng khi chạy script tạo ảnh (OG_PREVIEW=1);
 * ảnh PNG kết quả được lưu thành opengraph-image.png trong từng route.
 */
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const COPY = {
  home: {
    title: ["Việt phục", "Remix"],
    sub: "Phối áo dài, tứ thân, ngũ thân, bà ba theo phong cách Gen Z mà vẫn đúng văn hóa.",
    note: "Cô giáo văn hóa khoanh đỏ chỗ cần sửa",
  },
  "phoi-do": {
    title: ["Phối Việt phục", "trong 5 bước"],
    sub: "Chọn dịp, áo, màu, phụ kiện. Nhân vật đổi ngay, lời phê hiện ngay.",
    note: "Chạm vào nhân vật để sửa từng phần",
  },
  "cham-outfit": {
    title: ["Chấm outfit", "từ ảnh chụp"],
    sub: "Tải ảnh lên, AI nhận diện Việt phục rồi chấm điểm văn hóa và màu sắc.",
    note: "Kèm bản gợi ý đã sửa",
  },
  "kham-pha": {
    title: ["Sổ tay", "Việt phục"],
    sub: "Nguồn gốc, ý nghĩa và cách remix đúng của 6 loại áo truyền thống, có ghi nguồn.",
    note: "Có tư liệu · Dân gian · Giả thuyết",
  },
} as const;

type Variant = keyof typeof COPY;

function Score({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`relative grid size-[92px] place-items-center ${className ?? ""}`}>
      <svg viewBox="0 0 80 64" className="absolute inset-0" aria-hidden>
        <path d="M12,36 Q10,8 40,7 Q72,8 70,32 Q70,58 40,58 Q9,58 14,28" fill="none" stroke="var(--color-redpen)" strokeWidth={2.6} strokeLinecap="round" />
      </svg>
      <span className="hand relative text-[46px] leading-none text-redpen">{value}</span>
    </div>
  );
}

function Art({ variant }: { variant: Variant }) {
  if (variant === "kham-pha") {
    return (
      <div className="paper grid h-full grid-cols-3 content-center gap-x-2 gap-y-1 rounded-[18px] px-10 py-6">
        {GARMENTS.map((g) => (
          <div key={g.id} className="flex flex-col items-center">
            <Figure look={previewLook(g.id)} className="h-[210px] w-full" title={g.name} />
            <span className="-mt-1 text-[17px] font-extrabold text-ink-deep">{g.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cham-outfit") {
    const look: LookConfig = { ...DEFAULT_LOOK, event: "dam-cuoi", main: "hong-dao", secondary: "trang-nga", accent: "xanh-ngoc", pattern: "tron", head: "none", extras: [] };
    return (
      <div className="relative flex h-full items-center justify-center gap-6">
        <div className="-rotate-3 bg-white p-3 pb-10 shadow-[0_18px_40px_-16px_rgba(0,0,0,.6)]">
          <span className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2" />
          <div className="paper-plain grid h-[400px] w-[250px] place-items-center">
            <Figure look={look} className="h-[380px] w-full" title="Outfit" />
          </div>
          <span className="hand absolute bottom-2 left-4 text-[22px] text-ink">ảnh của bạn</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-[18px] bg-white px-6 py-5 text-center shadow-[0_18px_40px_-16px_rgba(0,0,0,.6)]">
            <Score value={9.5} className="mx-auto" />
            <p className="mt-2 text-[16px] font-bold text-ink-deep">Văn hóa 97 · Màu 88</p>
            <p className="hand mt-1 max-w-[210px] text-[21px] leading-tight text-redpen">Lịch sự, nổi bật, không trùng cô dâu.</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "phoi-do") {
    const look: LookConfig = { ...DEFAULT_LOOK, event: "dam-cuoi", head: "khan-man", length: "qua-goi" };
    const marks = checkCulture(look).issues.map((i, n) => ({ zone: i.zone, level: i.level, n: n + 1 }));
    return (
      <div className="paper relative flex h-full items-center gap-2 rounded-[18px] pl-12 pr-6">
        <Figure look={look} marks={marks} className="h-[500px] w-[230px] shrink-0" title="Bộ phối" />
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {["Dịp", "Áo", "Màu", "Phụ kiện", "Hoàn thiện"].map((s, i) => (
              <span key={s} className={`flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[15px] font-bold ${i === 2 ? "bg-ink text-white" : "bg-white text-ink-deep"}`}>
                <span className={`grid size-6 place-items-center rounded-full text-[13px] ${i === 2 ? "bg-white text-ink" : "bg-ink-soft text-ink"}`}>{i + 1}</span>
                {s}
              </span>
            ))}
          </div>
          <div className="grid w-[260px] grid-cols-5 gap-2">
            {COLORS.slice(0, 10).map((c) => (
              <span key={c.id} className="pinked block size-11" style={{ background: c.hex }} />
            ))}
          </div>
          <p className="hand max-w-[280px] text-[25px] leading-tight text-redpen">Khăn mấn thường dành cho cô dâu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-end justify-center gap-2 pb-6">
      {EXAMPLE_LOOKS.map((ex, i) => (
        <div key={ex.title} className={`flex flex-col items-center ${i === 1 ? "-translate-y-8" : ""}`}>
          <Figure look={ex.config} className="h-[440px] w-[180px] drop-shadow-[0_18px_18px_rgba(10,4,40,.35)]" title={ex.title} />
          <span
            className="mt-1 whitespace-nowrap rounded-full border-[3px] border-white px-3 py-0.5 text-[16px] font-bold text-ink-deep shadow-[0_3px_6px_rgba(0,0,0,.25)]"
            style={{ background: ["#c8e04a", "#f06ea9", "#f6e27a"][i], rotate: `${[-4, 3, -2][i]}deg` }}
          >
            {ex.title}
          </span>
        </div>
      ))}
      <div className="absolute right-4 top-2 rotate-6">
        <Score value={9.5} />
      </div>
    </div>
  );
}

export default async function OgFrame({ params }: { params: Promise<{ variant: string }> }) {
  if (process.env.OG_PREVIEW !== "1") notFound();
  const { variant } = await params;
  if (!(variant in COPY)) notFound();
  const v = variant as Variant;
  const copy = COPY[v];

  return (
    <div className="fixed inset-0 z-[100] overflow-auto bg-[#1b1340]">
      <div id="og" className="cover relative grid h-[630px] w-[1200px] grid-cols-[520px_1fr] gap-8 overflow-hidden p-12">
        <div className="nhan-vo flex flex-col px-10 pb-9 pt-9 text-cover">
          <div className="flex items-center gap-3">
            <LogoMark className="size-11" />
            <span className="text-[20px] font-extrabold tracking-[-0.01em] text-ink-deep">Việt phục Remix</span>
          </div>
          <h1 className={`mt-7 font-extrabold leading-[0.95] tracking-[-0.035em] text-ink-deep ${copy.title[0].length > 12 ? "text-[56px]" : "text-[68px]"}`}>
            {copy.title[0]}
            <span className="hand block text-[64px] font-normal leading-[1.05] tracking-normal text-redpen">{copy.title[1]}</span>
          </h1>
          <p className="mt-5 text-[23px] leading-snug text-text">{copy.sub}</p>
          <p className="hand mt-auto border-t-2 border-dotted border-muted/50 pt-3 text-[25px] text-ink">{copy.note}</p>
        </div>
        <div className="min-w-0">
          <Art variant={v} />
        </div>
      </div>
    </div>
  );
}
