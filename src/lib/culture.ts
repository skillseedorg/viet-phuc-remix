import {
  BOTTOMS,
  EXTRAS,
  FEET,
  HEADS,
  OUTERS,
  REGIONS,
  STYLES,
  colorById,
  eventById,
  garmentById,
  names,
  type RegionId,
} from "./kb";
import { withGarment, type LookConfig } from "./look";
import type { WeatherNow } from "./weather";

export type IssueLevel = "note" | "warn" | "stop";
export type Zone = "head" | "top" | "bottom" | "feet" | "whole";

export type Issue = {
  id: string;
  level: IssueLevel;
  zone: Zone;
  title: string;
  detail: string;
  fix?: { label: string; patch: Partial<LookConfig> };
};

export type CultureReport = {
  issues: Issue[];
  score: number;
  remixLevel: 0 | 1 | 2;
  modernItems: string[];
};

const regionName = (r: RegionId) => REGIONS.find((x) => x.id === r)!.name;
const RITUAL_GARMENTS = ["ao-tac", "ao-nhat-binh"] as const;

export function modernItems(look: LookConfig): string[] {
  const out: string[] = [];
  if (BOTTOMS.find((b) => b.id === look.bottom)?.modern) out.push(names.bottom(look.bottom));
  if (OUTERS.find((o) => o.id === look.outer)?.modern) out.push(names.outer(look.outer));
  if (FEET.find((f) => f.id === look.feet)?.modern) out.push(names.feet(look.feet));
  for (const e of look.extras) if (EXTRAS.find((x) => x.id === e)?.modern) out.push(names.extra(e));
  return out;
}

export function checkCulture(look: LookConfig, weather?: WeatherNow | null): CultureReport {
  const issues: Issue[] = [];
  const g = garmentById(look.garment);
  const ev = look.event ? eventById(look.event) : null;
  const style = STYLES.find((s) => s.id === look.style)!;
  const modern = modernItems(look);
  const derived = modern.length === 0 ? 0 : modern.length === 1 ? 1 : 2;
  const remixLevel = Math.max(style.remix, derived) as 0 | 1 | 2;
  const isRitual = (RITUAL_GARMENTS as readonly string[]).includes(look.garment);

  /* ---------- Sự kiện ---------- */
  if (ev) {
    const avoid = ev.avoid.find((a) => a.garment === look.garment);
    if (avoid) {
      issues.push({
        id: "event-garment",
        level: "warn",
        zone: "top",
        title: `${g.name} chưa hợp dịp ${ev.name.toLowerCase()}`,
        detail: avoid.reason,
        fix: { label: `Đổi sang ${garmentById(ev.recommended[0]).name}`, patch: { garment: ev.recommended[0] } },
      });
    }

    if (remixLevel > ev.maxRemix) {
      const patch: Partial<LookConfig> = { style: ev.maxRemix === 0 ? "chuan" : "thanh-lich" };
      if (BOTTOMS.find((b) => b.id === look.bottom)?.modern) patch.bottom = look.garment === "ao-tu-than" ? "vay-dai" : "quan-lua";
      if (look.outer !== "none") patch.outer = "none";
      if (FEET.find((f) => f.id === look.feet)?.modern) patch.feet = "guoc-moc";
      patch.extras = look.extras.filter((e) => !EXTRAS.find((x) => x.id === e)?.modern);
      issues.push({
        id: "event-remix",
        level: ev.maxRemix === 0 ? "warn" : "note",
        zone: "whole",
        title: ev.maxRemix === 0 ? `Dịp ${ev.name.toLowerCase()} nên giữ nét truyền thống` : "Remix hơi mạnh so với dịp này",
        detail:
          (modern.length ? `Các món hiện đại: ${modern.join(", ")}. ` : "") +
          (ev.maxRemix === 0
            ? "Không gian cần sự trang nghiêm, nên ưu tiên cách phối truyền thống, kín đáo."
            : "Dịp này khá trang trọng, remix nhẹ sẽ an toàn hơn."),
        fix: { label: "Giảm mức remix", patch },
      });
    }

    const careful = ev.carefulColors.find((c) => c.color === look.main);
    if (careful) {
      const isBride = look.event === "dam-cuoi" && look.main === "do-son" && look.head === "khan-man";
      issues.push({
        id: "event-color",
        level: isBride ? "stop" : "warn",
        zone: "top",
        title: isBride ? "Dễ bị nhầm là cô dâu" : `Màu ${colorById(look.main).name.toLowerCase()} cần cân nhắc`,
        detail: isBride ? "Áo dài đỏ kèm khăn mấn gần như là trang phục cưới của cô dâu." : careful.reason,
        fix: { label: `Đổi sang ${colorById(ev.goodColors[0]).name}`, patch: { main: ev.goodColors[0] } },
      });
    }

    if (look.head === "khan-man" && look.event === "dam-cuoi" && look.main !== "do-son") {
      issues.push({
        id: "guest-man",
        level: "warn",
        zone: "head",
        title: "Khăn mấn thường dành cho cô dâu",
        detail: "Là khách mời, bạn nên để khăn mấn lại cho cô dâu.",
        fix: { label: "Bỏ khăn mấn", patch: { head: "none" } },
      });
    }

    if (look.event === "di-chua" && look.extras.includes("kinh-ram")) {
      issues.push({
        id: "pagoda-glasses",
        level: "warn",
        zone: "head",
        title: "Tháo kính râm trong chùa",
        detail: "Đeo kính râm trong điện thờ bị xem là thiếu lễ.",
        fix: { label: "Bỏ kính râm", patch: { extras: look.extras.filter((e) => e !== "kinh-ram") } },
      });
    }

    if ((look.event === "di-chua" || look.event === "le-hoi") && look.feet === "cao-got") {
      issues.push({
        id: "heels",
        level: "note",
        zone: "feet",
        title: "Giày cao gót bất tiện",
        detail: "Sân chùa, sân đình thường lát gạch hoặc đất, lại hay phải tháo giày. Guốc hoặc sandal tiện hơn.",
        fix: { label: "Đổi sang guốc mộc", patch: { feet: "guoc-moc" } },
      });
    }
  }

  /* ---------- Cấu trúc trang phục ---------- */
  if (look.garment === "ao-dai") {
    if (look.length === "ngan") {
      issues.push({
        id: "crop-ao-dai",
        level: "warn",
        zone: "top",
        title: "Tà ngắn làm mất đặc trưng áo dài",
        detail: "Hai tà dài xẻ hông là đặc điểm nhận diện của áo dài. Cắt ngang hông thì nên gọi là áo lấy cảm hứng từ áo dài, không nên gọi là áo dài.",
        fix: { label: "Đổi sang tà qua gối", patch: { length: "qua-goi" } },
      });
    } else if (look.length === "qua-goi" && ev?.formality === 3) {
      issues.push({
        id: "short-formal",
        level: "note",
        zone: "top",
        title: "Dịp trang trọng hợp tà dài hơn",
        detail: "Áo dài cách tân qua gối vẫn đẹp, nhưng tà dài truyền thống trang nhã hơn ở dịp này.",
        fix: { label: "Chọn tà dài", patch: { length: "dai" } },
      });
    }
    if (look.bottom === "chan-vay-midi") {
      issues.push({
        id: "ao-dai-skirt",
        level: ev?.formality === 3 ? "warn" : "note",
        zone: "bottom",
        title: "Áo dài phối chân váy là cách tân",
        detail: "Cách phối này đã khá phổ biến khi chụp ảnh, nhưng áo dài truyền thống luôn đi cùng quần.",
        fix: { label: "Trở lại quần lụa", patch: { bottom: "quan-lua" } },
      });
    }
  }

  if (look.garment === "ao-tu-than") {
    if (look.bottom !== "vay-dai") {
      issues.push({
        id: "tu-than-bottom",
        level: look.bottom === "jeans" ? "warn" : "note",
        zone: "bottom",
        title: "Áo tứ thân đi cùng váy dài",
        detail: `Bộ tứ thân truyền thống gồm yếm, áo, váy dài và thắt lưng. ${names.bottom(look.bottom)} khiến dáng áo khác hẳn.`,
        fix: { label: "Dùng váy dài sẫm màu", patch: { bottom: "vay-dai" } },
      });
    }
    if (!look.extras.includes("that-lung")) {
      issues.push({
        id: "tu-than-belt",
        level: "note",
        zone: "top",
        title: "Thiếu thắt lưng lụa",
        detail: "Thắt lưng buông đuôi phía trước là chi tiết làm nên dáng áo tứ thân.",
        fix: { label: "Thêm thắt lưng", patch: { extras: [...look.extras, "that-lung"] } },
      });
    }
    if (look.head === "khan-dong") {
      issues.push({
        id: "tu-than-khan-dong",
        level: "warn",
        zone: "head",
        title: "Khăn đóng không thuộc bộ áo tứ thân",
        detail: "Khăn đóng thường đi cùng áo ngũ thân, áo tấc. Áo tứ thân đi với khăn mỏ quạ hoặc nón quai thao.",
        fix: { label: "Đổi sang khăn mỏ quạ", patch: { head: "mo-qua" } },
      });
    }
  }

  if (look.garment !== "ao-tu-than" && look.extras.includes("that-lung")) {
    issues.push({
      id: "belt-other",
      level: "note",
      zone: "top",
      title: "Thắt lưng lụa là chi tiết của áo tứ thân",
      detail: `Buộc thắt lưng ngoài ${g.name.toLowerCase()} sẽ che mất dáng áo. Nếu cố ý remix, hãy chú thích ý tưởng.`,
      fix: { label: "Bỏ thắt lưng", patch: { extras: look.extras.filter((e) => e !== "that-lung") } },
    });
  }

  if (isRitual) {
    const casual = [
      look.feet === "sneaker" && "sneaker",
      look.bottom === "jeans" && "quần jeans",
      look.outer === "denim" && "áo khoác denim",
      look.extras.includes("tui-tote") && "túi tote",
    ].filter(Boolean) as string[];
    if (casual.length) {
      issues.push({
        id: "ritual-casual",
        level: "warn",
        zone: "whole",
        title: `${g.name} là lễ phục`,
        detail: `Phối cùng ${casual.join(", ")} làm nhẹ đi ý nghĩa nghi lễ của áo. Nếu muốn remix, hãy chọn áo ngũ thân tay chẽn hoặc áo dài.`,
        fix: {
          label: "Trả về cách phối lễ phục",
          patch: {
            feet: "giay-hai",
            bottom: "quan-lua",
            outer: "none",
            extras: look.extras.filter((e) => e !== "tui-tote"),
          },
        },
      });
    }
    if (look.outer !== "none" && look.outer !== "denim") {
      issues.push({
        id: "ritual-outer",
        level: "note",
        zone: "top",
        title: "Áo khoác che mất dáng áo",
        detail: look.garment === "ao-tac" ? "Tay thụng là điểm nhấn của áo tấc." : "Cổ bình lĩnh là điểm nhấn của áo nhật bình.",
        fix: { label: "Bỏ áo khoác", patch: { outer: "none" } },
      });
    }
  }

  if ((look.garment === "ao-ngu-than") && look.bottom === "chan-vay-midi") {
    issues.push({
      id: "ngu-than-skirt",
      level: "note",
      zone: "bottom",
      title: "Áo ngũ thân vốn mặc cùng quần",
      detail: "Chân váy là remix; với dịp lễ, quần ống rộng giữ đúng tinh thần áo hơn.",
      fix: { label: "Dùng quần lụa", patch: { bottom: "quan-lua" } },
    });
  }

  /* ---------- Màu & hoa văn ---------- */
  if (look.pattern === "rong") {
    const imperial = look.main === "vang-hoa-hoe" && (isRitual || look.garment === "ao-ngu-than");
    issues.push({
      id: "dragon",
      level: imperial ? "warn" : "note",
      zone: "top",
      title: imperial ? "Dễ bị hiểu là mô phỏng hoàng bào" : "Hoa văn rồng mang ý nghĩa quyền uy",
      detail: imperial
        ? "Dưới triều Nguyễn, áo vàng thêu rồng năm móng là trang phục dành riêng cho vua. Hãy đổi màu nền hoặc chọn hoa văn mây, hạc."
        : "Rồng năm móng từng dành riêng cho vua. Dùng được trong concept cổ phục, nhưng nên tránh in rồng lên đồ mặc thường ngày.",
      fix: { label: "Đổi sang hoa văn mây, hạc", patch: { pattern: "may-hac" } },
    });
  }
  if (look.pattern === "phuong" && look.style === "street") {
    issues.push({
      id: "phoenix-street",
      level: "note",
      zone: "top",
      title: "Phượng là họa tiết cung đình",
      detail: "Phối phượng với streetwear vẫn được, nhưng nên giữ bố cục thêu trang trọng thay vì in tràn.",
    });
  }
  if (look.pattern === "tho-cam") {
    issues.push({
      id: "brocade",
      level: "note",
      zone: "top",
      title: "Thổ cẩm thuộc về một cộng đồng cụ thể",
      detail: "Mỗi dân tộc có hoa văn và ý nghĩa riêng. Khi chia sẻ, hãy ghi rõ nguồn (ví dụ thổ cẩm Mường, Thái, H'Mông) và tránh hoa văn dùng trong nghi lễ tín ngưỡng.",
    });
  }
  if (look.pattern === "trong-dong" && remixLevel === 2) {
    issues.push({
      id: "dongson-street",
      level: "note",
      zone: "top",
      title: "Trống đồng là biểu tượng quốc gia",
      detail: "Họa tiết Đông Sơn nên được đặt ở vị trí trang trọng như thân áo, tránh đặt ở giày hay gấu quần.",
    });
  }

  const whiteAll = look.main === "trang-nga" && look.secondary === "trang-nga" && look.accent === "trang-nga";
  if (whiteAll && ["khan-van", "khan-dong", "mo-qua"].includes(look.head)) {
    issues.push({
      id: "mourning",
      level: ev && ev.formality >= 2 && look.event !== "ky-yeu" ? "warn" : "note",
      zone: "head",
      title: "Toàn trắng kèm khăn trắng gợi trang phục tang",
      detail: "Trong phong tục Việt, khăn trắng quấn đầu là dấu hiệu để tang. Hãy đổi màu khăn hoặc phụ kiện.",
      fix: { label: "Đổi khăn sang vàng hoa hòe", patch: { accent: "vang-hoa-hoe" } },
    });
  }

  /* ---------- Vùng miền ---------- */
  if (look.region) {
    if (g.regions !== "ca-nuoc" && !g.regions.includes(look.region)) {
      issues.push({
        id: "region-garment",
        level: "note",
        zone: "top",
        title: `${g.name} gắn với ${g.regions.map(regionName).join(", ")}`,
        detail: `Mặc ở ${regionName(look.region)} vẫn đẹp. Nếu chụp ảnh giới thiệu văn hóa địa phương, hãy ghi chú đúng vùng gốc của áo.`,
      });
    }
    const borrowed = [
      ...HEADS.filter((h) => h.id === look.head),
      ...EXTRAS.filter((x) => look.extras.includes(x.id)),
    ].filter((x) => x.regions && !x.regions.includes(look.region!));
    for (const b of borrowed) {
      issues.push({
        id: `region-${b.id}`,
        level: "note",
        zone: HEADS.some((h) => h.id === b.id) ? "head" : "top",
        title: `${b.name} là nét của ${b.regions!.map(regionName).join(", ")}`,
        detail: "Pha trộn vùng miền là một cách remix. Hãy chú thích để người xem không hiểu nhầm đây là trang phục địa phương.",
      });
    }
  }

  /* ---------- Thời tiết ---------- */
  if (weather) {
    if (weather.temp <= 17 && look.fabric === "voan" && look.outer === "none") {
      issues.push({
        id: "cold",
        level: "note",
        zone: "whole",
        title: `Trời ${Math.round(weather.temp)}°C, voan mỏng sẽ lạnh`,
        detail: "Chọn gấm, nhung hoặc khoác thêm cardigan, blazer.",
        fix: { label: "Khoác cardigan", patch: { outer: "cardigan" } },
      });
    }
    if (weather.temp >= 32 && (look.fabric === "nhung" || look.fabric === "gam")) {
      issues.push({
        id: "hot",
        level: "note",
        zone: "whole",
        title: `Trời ${Math.round(weather.temp)}°C, vải dày sẽ bí`,
        detail: "Lụa, đũi hoặc voan thoáng mát hơn.",
        fix: { label: "Đổi sang lụa", patch: { fabric: "lua" } },
      });
    }
    if (weather.rainy && look.feet === "guoc-moc") {
      issues.push({
        id: "rain",
        level: "note",
        zone: "feet",
        title: "Trời mưa, guốc mộc dễ trơn",
        detail: "Sandal quai hậu an toàn hơn khi đường ướt.",
        fix: { label: "Đổi sang sandal", patch: { feet: "sandal" } },
      });
    }
  }

  const weight = { note: 3, warn: 14, stop: 30 } as const;
  const score = Math.max(0, 100 - issues.reduce((s, i) => s + weight[i.level], 0));
  const order = { stop: 0, warn: 1, note: 2 } as const;
  issues.sort((a, b) => order[a.level] - order[b.level]);

  return { issues, score, remixLevel, modernItems: modern };
}

/** Tóm tắt dạng văn bản để đưa vào prompt AI. */
export function reportToText(r: CultureReport): string {
  if (!r.issues.length) return "Không có cảnh báo văn hóa.";
  return r.issues.map((i) => `- [${i.level}] ${i.title}: ${i.detail}`).join("\n");
}

/** Áp dụng lần lượt các gợi ý sửa cho tới khi hết lỗi có thể sửa. */
export function applyAllFixes(look: LookConfig, weather?: WeatherNow | null): { look: LookConfig; applied: string[] } {
  let current = look;
  const applied: string[] = [];
  for (let i = 0; i < 8; i++) {
    const fix = checkCulture(current, weather).issues.find((x) => x.fix && !applied.includes(x.id));
    if (!fix?.fix) break;
    applied.push(fix.id);
    const patch = fix.fix.patch;
    current = patch.garment && patch.garment !== current.garment ? { ...withGarment(current, patch.garment), ...patch } : { ...current, ...patch };
  }
  return { look: current, applied };
}
