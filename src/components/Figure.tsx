import { colorById, type LengthId } from "@/lib/kb";
import { hexToHsl, shade } from "@/lib/harmony";
import { SKINS, type LookConfig } from "@/lib/look";
import type { IssueLevel, Zone } from "@/lib/culture";

/**
 * Nhân vật đại diện vẽ bằng SVG (viewBox 320x600).
 * Mọi hình khối dùng tọa độ nửa trái và được lấy đối xứng qua trục x = 160.
 */

export type FigureMark = { zone: Zone; level: IssueLevel; n: number };

type Props = {
  look: LookConfig;
  face?: string | null;
  marks?: FigureMark[];
  className?: string;
  title?: string;
  /** Khi có, các vùng đầu, áo, phần dưới, giày trở thành nút bấm. */
  onZoneClick?: (zone: Exclude<Zone, "whole">) => void;
};

const HIT_ZONES: { zone: Exclude<Zone, "whole">; label: string; x: number; y: number; w: number; h: number }[] = [
  { zone: "head", label: "Sửa đồ đội đầu", x: 60, y: 0, w: 200, h: 112 },
  { zone: "top", label: "Sửa áo", x: 56, y: 112, w: 208, h: 214 },
  { zone: "bottom", label: "Sửa phần dưới", x: 90, y: 326, w: 140, h: 226 },
  { zone: "feet", label: "Sửa giày dép", x: 100, y: 552, w: 120, h: 44 },
];

const W = 320;
const r2 = (n: number) => Math.round(n * 100) / 100;
const mx = (x: number) => W - x;

export const ZONE_ANCHOR: Record<Zone, [number, number]> = {
  head: [160, 58],
  top: [160, 205],
  bottom: [160, 420],
  feet: [160, 566],
  whole: [160, 300],
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

const HEM: Record<LengthId, number> = { dai: 548, "qua-goi": 440, ngan: 304 };

export default function Figure({ look, face, marks = [], className, title, onZoneClick }: Props) {
  const id = "f" + hash(JSON.stringify(look) + (face ? "p" : ""));
  const main = colorById(look.main).hex;
  const second = colorById(look.secondary).hex;
  const accent = colorById(look.accent).hex;
  const skin = SKINS.find((s) => s.id === look.skin) ?? SKINS[1];
  const hair = "#231C1A";
  const mainDark = shade(main, -0.18);
  const line = shade(main, -0.42);
  const lightMain = hexToHsl(main).l > 0.6;
  const patInk = lightMain ? shade(accent, -0.1) : hexToHsl(accent).l > 0.35 ? accent : "#F1ECE2";
  const pat = look.pattern !== "tron" ? `url(#${id}-pat)` : null;
  const sheenOpacity = { voan: 0.1, lua: 0.22, dui: 0.05, gam: 0.16, nhung: 0.04 }[look.fabric];

  /* ------------------------- Hình khối dùng chung ------------------------- */

  const fabric = (d: string, fill: string, key: string, stroke = line) => (
    <g key={key}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
      {pat && <path d={d} fill={pat} />}
      <path d={d} fill={`url(#${id}-sheen)`} opacity={sheenOpacity} />
    </g>
  );

  const narrowSleeve = (x = 0) =>
    `M${108 - x},140 Q${94 - x},200 ${84 - x},306 L${110 + x * 0.3},310 Q${118},240 ${124},184 Z`;
  const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, a, b) => `${mx(+a)},${b}`);

  const hands = (y = 318, spread = 0) => (
    <g fill={skin.hex} stroke={skin.shade} strokeWidth={1.2}>
      <ellipse cx={97 - spread} cy={y} rx={9} ry={11} />
      <ellipse cx={mx(97 - spread)} cy={y} rx={9} ry={11} />
    </g>
  );

  /* ------------------------------ Phần dưới ------------------------------ */

  const bottomColor = look.bottom === "jeans" ? "#4F6F9A" : second;
  const bottom = (() => {
    switch (look.bottom) {
      case "jeans":
        return (
          <g>
            <path d="M132,248 L188,248 L200,556 L166,556 L160,330 L154,556 L120,556 Z" fill={bottomColor} stroke="#2F4668" strokeWidth={1.6} />
            <path d="M142,300 L150,550 M178,300 L170,550" stroke="#7A95BA" strokeWidth={1.2} strokeDasharray="4 4" fill="none" />
            <path d="M120,538 L154,538 M166,538 L200,538" stroke="#7A95BA" strokeWidth={3} />
          </g>
        );
      case "vay-dai":
        return fabric("M128,248 L192,248 Q206,400 214,554 Q160,564 106,554 Q114,400 128,248 Z", second, "skirt", shade(second, -0.4));
      case "chan-vay-midi":
        return (
          <g>
            <path d="M141,460 L153,460 L152,556 L140,556 Z M167,460 L179,460 L180,556 L168,556 Z" fill={skin.hex} stroke={skin.shade} />
            {fabric("M128,248 L192,248 L220,468 Q160,480 100,468 Z", second, "midi", shade(second, -0.4))}
          </g>
        );
      default:
        return fabric("M130,248 L190,248 L206,556 Q186,560 166,556 L160,338 L154,556 Q134,560 114,556 Z", second, "pants", shade(second, -0.35));
    }
  })();

  /* ------------------------------- Giày dép ------------------------------ */

  const shoe = (() => {
    const pair = (el: (flip: boolean) => React.ReactNode) => (
      <g>
        {el(false)}
        <g transform={`translate(${W},0) scale(-1,1)`}>{el(true)}</g>
      </g>
    );
    switch (look.feet) {
      case "sneaker":
        return pair(() => (
          <g>
            <path d="M118,560 Q118,550 132,550 L150,550 Q160,552 160,566 L160,574 L118,574 Z" fill="#FAFAF7" stroke="#6D6A73" strokeWidth={1.4} />
            <path d="M118,574 L160,574 L160,580 L118,580 Z" fill="#DEDBD3" stroke="#6D6A73" strokeWidth={1.2} />
            <path d="M136,554 L148,556 M134,559 L148,561" stroke="#6D6A73" strokeWidth={1.2} />
          </g>
        ));
      case "cao-got":
        return pair(() => (
          <g>
            <path d="M130,552 Q136,548 146,552 L154,568 Q150,576 138,576 L128,576 Q124,566 130,552 Z" fill={skin.hex} stroke={skin.shade} />
            <path d="M126,566 Q140,562 156,570 L154,578 L126,578 Z" fill="#2A2530" />
            <path d="M152,574 L154,588" stroke="#2A2530" strokeWidth={3} strokeLinecap="round" />
          </g>
        ));
      case "giay-hai":
        return pair(() => (
          <g>
            <path d="M124,576 Q122,556 140,554 Q154,554 158,566 Q164,572 156,578 L128,578 Z" fill={accent} stroke={shade(accent, -0.45)} strokeWidth={1.4} />
            <path d="M156,568 Q166,560 162,572" stroke={shade(accent, -0.45)} fill="none" strokeWidth={1.4} />
            <circle cx={140} cy={566} r={2.4} fill={patInk} />
          </g>
        ));
      case "sandal":
        return pair(() => (
          <g>
            <ellipse cx={140} cy={564} rx={13} ry={9} fill={skin.hex} stroke={skin.shade} />
            <rect x={124} y={572} width={32} height={6} rx={3} fill="#7A5A3E" />
            <path d="M128,564 L152,564" stroke="#7A5A3E" strokeWidth={4} strokeLinecap="round" />
          </g>
        ));
      default:
        return pair(() => (
          <g>
            <ellipse cx={140} cy={562} rx={13} ry={9} fill={skin.hex} stroke={skin.shade} />
            <rect x={124} y={568} width={32} height={10} rx={2} fill="#A67A4B" stroke="#6E4D2C" />
            <path d="M127,562 L153,562" stroke={accent} strokeWidth={6} strokeLinecap="round" />
          </g>
        ));
    }
  })();

  /* ------------------------------ Thân áo -------------------------------- */

  const garment = (() => {
    switch (look.garment) {
      case "ao-dai": {
        const H = HEM[look.length];
        const front = `M146,124 Q160,132 174,124 L208,140 Q200,160 198,182 Q192,215 188,250 Q192,268 196,288 L${look.length === "ngan" ? 196 : 206},${H} Q160,${H + 6} ${look.length === "ngan" ? 124 : 114},${H} L124,288 Q128,268 132,250 Q128,215 122,182 Q120,160 112,140 Z`;
        return {
          back: look.length === "ngan" ? null : fabric(`M126,284 L194,284 L216,${H - 4} L104,${H - 4} Z`, mainDark, "back"),
          body: (
            <g>
              {fabric(front, main, "front")}
              {fabric(narrowSleeve(), main, "sl")}
              {fabric(mirror(narrowSleeve()), main, "sr")}
              <path d="M146,110 L174,110 L176,128 Q160,134 144,128 Z" fill={main} stroke={line} strokeWidth={1.6} />
              {[
                [177, 128],
                [186, 142],
                [193, 157],
                [197, 173],
                [198, 190],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={patInk} stroke={line} strokeWidth={0.6} />
              ))}
            </g>
          ),
        };
      }
      case "ao-ngu-than":
      case "ao-tac": {
        const tac = look.garment === "ao-tac";
        const H = tac ? 536 : 470;
        const torso = `M144,124 Q160,132 176,124 L210,140 Q204,170 202,200 L204,300 L210,${H} Q160,${H + 6} 110,${H} L116,300 L118,200 Q116,170 110,140 Z`;
        const sleeve = tac
          ? "M110,140 Q84,190 70,262 L62,352 Q88,366 118,352 L122,252 Q124,200 122,182 Z"
          : "M110,140 Q94,200 82,306 L112,312 Q120,240 124,184 Z";
        return {
          back: fabric(`M112,330 L208,330 L216,${H + 2} L104,${H + 2} Z`, mainDark, "back"),
          body: (
            <g>
              {fabric(torso, main, "torso")}
              <path d={`M160,132 Q182,150 196,176 L198,${H - 6}`} stroke={line} strokeWidth={1.4} fill="none" />
              <path d={`M116,${tac ? 420 : 380} L114,${H - 2} M204,${tac ? 420 : 380} L206,${H - 2}`} stroke={line} strokeWidth={1.2} />
              {fabric(sleeve, main, "sl")}
              {fabric(mirror(sleeve), main, "sr")}
              {tac && (
                <path d="M62,352 Q88,366 118,352 M258,352 Q232,366 202,352" stroke={second} strokeWidth={4} fill="none" />
              )}
              <path d="M146,112 L174,112 L176,128 Q160,134 144,128 Z" fill={main} stroke={line} strokeWidth={1.6} />
              {[
                [172, 127],
                [182, 140],
                [192, 154],
                [198, 170],
                [200, 188],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={patInk} stroke={line} strokeWidth={0.6} />
              ))}
            </g>
          ),
          handY: tac ? 360 : 318,
          handSpread: tac ? 4 : 1,
        };
      }
      case "ao-nhat-binh": {
        const H = 522;
        const torso = `M142,124 Q160,132 178,124 L212,142 Q206,176 204,210 L208,${H} Q160,${H + 6} 112,${H} L116,210 Q114,176 108,142 Z`;
        const sleeve = "M110,140 Q90,196 78,300 L74,334 Q98,344 120,334 L122,244 Q124,200 122,184 Z";
        const collar = "M142,120 Q160,128 178,120 L216,146 Q226,180 208,210 Q188,226 168,228 L160,262 L152,228 Q132,226 112,210 Q94,180 104,146 Z";
        return {
          back: null,
          body: (
            <g>
              {fabric(torso, main, "torso")}
              {fabric(sleeve, main, "sl")}
              {fabric(mirror(sleeve), main, "sr")}
              <path d="M74,334 Q98,344 120,334 M246,334 Q222,344 200,334" stroke={accent} strokeWidth={6} fill="none" />
              <path d={`M112,${H - 16} Q160,${H - 10} 208,${H - 16}`} stroke={accent} strokeWidth={8} fill="none" />
              <path d={`M160,262 L160,${H}`} stroke={line} strokeWidth={1.4} />
              {fabric(collar, second, "collar", shade(second, -0.4))}
              <path d={collar} fill="none" stroke={accent} strokeWidth={4} strokeLinejoin="round" />
              <path d="M152,248 Q146,270 150,292 M168,248 Q174,270 170,292" stroke={accent} strokeWidth={3} fill="none" strokeLinecap="round" />
            </g>
          ),
          handY: 344,
          handSpread: 2,
        };
      }
      case "ao-ba-ba": {
        const torso = "M142,126 Q160,140 178,126 L210,140 Q204,170 202,200 L205,318 L115,318 L118,200 Q116,170 110,140 Z";
        return {
          back: null,
          body: (
            <g>
              {fabric(torso, main, "torso")}
              {fabric(narrowSleeve(), main, "sl")}
              {fabric(mirror(narrowSleeve()), main, "sr")}
              <path d="M142,126 Q160,142 178,126" stroke={line} strokeWidth={2.2} fill="none" />
              <path d="M160,136 L160,318" stroke={line} strokeWidth={1.2} />
              {[160, 196, 232, 268, 300].map((y) => (
                <circle key={y} cx={160} cy={y} r={2.4} fill={patInk} stroke={line} strokeWidth={0.6} />
              ))}
              <path d="M126,276 h24 v26 h-24 Z M170,276 h24 v26 h-24 Z" fill="none" stroke={line} strokeWidth={1.3} />
              <path d="M116,300 L118,318 M204,300 L202,318" stroke={line} strokeWidth={1.3} />
            </g>
          ),
        };
      }
      case "ao-tu-than": {
        const yem = shade(accent, 0.18);
        const left = "M147,124 L108,140 Q98,200 112,300 L118,430 Q136,436 154,430 L156,258 Q152,190 147,124 Z";
        return {
          back: fabric("M110,170 L210,170 L216,436 L104,436 Z", mainDark, "back"),
          body: (
            <g>
              <path d="M146,124 L174,124 L184,196 L160,256 L136,196 Z" fill={yem} stroke={shade(yem, -0.4)} strokeWidth={1.4} />
              {fabric(narrowSleeve(), main, "sl")}
              {fabric(mirror(narrowSleeve()), main, "sr")}
              {fabric(left, main, "fl")}
              {fabric(mirror(left), main, "fr")}
            </g>
          ),
        };
      }
    }
  })();

  /* ------------------------------ Áo khoác ------------------------------- */

  const outer = (() => {
    if (look.outer === "none") return null;
    const c = { blazer: "#2E2B38", denim: "#5B7EAA", cardigan: "#B9A488" }[look.outer];
    const edge = shade(c, -0.35);
    const hem = { blazer: 312, denim: 262, cardigan: 330 }[look.outer];
    const panel = `M148,124 L106,140 Q100,${hem - 100} 112,${hem} L152,${hem + 4} L152,236 Z`;
    const sleeve = "M106,138 Q90,200 80,300 L112,306 Q120,236 126,180 Z";
    return (
      <g>
        <path d={sleeve} fill={c} stroke={edge} strokeWidth={1.6} />
        <path d={mirror(sleeve)} fill={c} stroke={edge} strokeWidth={1.6} />
        <path d={panel} fill={c} stroke={edge} strokeWidth={1.6} />
        <path d={mirror(panel)} fill={c} stroke={edge} strokeWidth={1.6} />
        {look.outer === "blazer" && <path d="M148,124 L136,190 L152,236 M172,124 L184,190 L168,236" stroke={edge} strokeWidth={1.6} fill="none" />}
        {look.outer === "denim" && (
          <path d="M116,170 h26 v18 h-26 Z M178,170 h26 v18 h-26 Z M112,240 L208,240" stroke="#E0B25C" strokeWidth={1.2} fill="none" strokeDasharray="3 3" />
        )}
        {look.outer === "cardigan" && (
          <g>
            {[180, 230, 280].map((y) => (
              <circle key={y} cx={148} cy={y} r={2.5} fill={edge} />
            ))}
            <path d={`M112,${hem - 12} L152,${hem - 8} M168,${hem - 8} L208,${hem - 12}`} stroke={edge} strokeWidth={1.2} />
          </g>
        )}
      </g>
    );
  })();

  /* ---------------------------- Phụ kiện thân ---------------------------- */

  const handY = "handY" in garment! ? (garment as { handY: number }).handY : 318;
  const handSpread = "handSpread" in garment! ? (garment as { handSpread: number }).handSpread : 0;

  const extras = (
    <g>
      {look.extras.includes("that-lung") && (
        <g>
          <path d="M122,246 Q160,254 198,246 L198,262 Q160,270 122,262 Z" fill={accent} stroke={shade(accent, -0.4)} strokeWidth={1.4} />
          <path d="M156,262 Q150,320 146,384 L158,386 Q160,320 162,264 M164,262 Q170,320 176,380 L188,378 Q176,316 168,262" fill={accent} stroke={shade(accent, -0.4)} strokeWidth={1.2} />
          <circle cx={160} cy={258} r={7} fill={accent} stroke={shade(accent, -0.4)} strokeWidth={1.4} />
        </g>
      )}
      {look.extras.includes("kieng-bac") && (
        <path d="M140,128 Q160,152 180,128" stroke="#C7CCD4" strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
      {look.extras.includes("khan-ran") && (
        <g>
          <path d="M138,118 Q160,140 182,118 L186,134 Q160,156 134,134 Z" fill={`url(#${id}-ran)`} stroke="#2A2530" strokeWidth={1.2} />
          <path d="M170,140 L184,142 L190,224 L176,226 Z" fill={`url(#${id}-ran)`} stroke="#2A2530" strokeWidth={1.2} />
        </g>
      )}
      {look.extras.includes("tui-tote") && (
        <g>
          <path d={`M${mx(97 - handSpread) - 6},${handY - 4} Q${mx(97 - handSpread) + 14},${handY - 40} ${mx(97 - handSpread) + 30},${handY + 6}`} stroke="#7A6F5E" strokeWidth={3} fill="none" />
          <rect x={mx(97 - handSpread) - 14} y={handY + 6} width={52} height={60} rx={3} fill="#EDE6D8" stroke="#7A6F5E" strokeWidth={1.6} />
          <path d={`M${mx(97 - handSpread) - 2},${handY + 30} h28`} stroke={accent} strokeWidth={4} />
        </g>
      )}
      {look.extras.includes("tui-gam") && (
        <g>
          <path d={`M${97 - handSpread},${handY + 4} L${97 - handSpread},${handY + 20}`} stroke={shade(accent, -0.4)} strokeWidth={2} />
          <path
            d={`M${83 - handSpread},${handY + 22} Q${97 - handSpread},${handY + 14} ${111 - handSpread},${handY + 22} Q${118 - handSpread},${handY + 52} ${97 - handSpread},${handY + 56} Q${76 - handSpread},${handY + 52} ${83 - handSpread},${handY + 22} Z`}
            fill={accent}
            stroke={shade(accent, -0.45)}
            strokeWidth={1.6}
          />
          <circle cx={97 - handSpread} cy={handY + 38} r={5} fill="none" stroke={patInk} strokeWidth={1.4} />
        </g>
      )}
    </g>
  );

  /* ------------------------------ Đầu & tóc ------------------------------ */

  const coversHair = ["mo-qua", "khan-van", "khan-dong", "khan-man"].includes(look.head);
  const head = (
    <g>
      {look.hair === "buoc" && <path d="M178,82 Q196,110 190,168 Q182,172 176,166 Q182,120 170,92 Z" fill={hair} />}
      <rect x={151} y={96} width={18} height={32} fill={skin.hex} stroke={skin.shade} strokeWidth={1.2} />
      <ellipse cx={160} cy={72} rx={29} ry={34} fill={skin.hex} stroke={skin.shade} strokeWidth={1.4} />
      {face ? (
        <g>
          <clipPath id={`${id}-face`}>
            <ellipse cx={160} cy={72} rx={29} ry={34} />
          </clipPath>
          <image href={face} x={126} y={36} width={68} height={74} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-face)`} />
          <ellipse cx={160} cy={72} rx={29} ry={34} fill="none" stroke={skin.shade} strokeWidth={1.4} />
        </g>
      ) : (
        <g>
          <path d="M145,76 q4,-4 8,0 M167,76 q4,-4 8,0" stroke="#231C1A" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx={144} cy={88} rx={5} ry={3} fill="#E0806F" opacity={0.35} />
          <ellipse cx={176} cy={88} rx={5} ry={3} fill="#E0806F" opacity={0.35} />
          <path d="M154,94 q6,5 12,0" stroke="#9C4A3F" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      )}
      {!coversHair && !face && (
        <g fill={hair}>
          {look.hair === "bui" && <circle cx={160} cy={34} r={15} />}
          {look.hair === "ngan" ? (
            <path d="M129,84 Q122,38 160,34 Q198,38 191,84 Q188,60 172,54 Q150,64 134,62 Q130,70 129,84 Z" />
          ) : (
            <path d="M131,74 Q128,40 160,38 Q192,40 189,74 Q184,54 160,52 Q136,54 131,74 Z" />
          )}
        </g>
      )}
      {!coversHair && face && look.hair === "bui" && <circle cx={160} cy={30} r={13} fill={hair} />}
    </g>
  );

  const headwear = (() => {
    const edge = shade(accent, -0.45);
    switch (look.head) {
      case "non-la":
        return (
          <g>
            <path d="M138,62 Q142,104 160,110 Q178,104 182,62" stroke={accent} strokeWidth={2.4} fill="none" />
            <path d="M66,62 L160,2 L254,62 Q160,80 66,62 Z" fill="#E4CC8E" stroke="#9E8148" strokeWidth={1.6} strokeLinejoin="round" />
            {[92, 118, 144, 176, 202, 228].map((x) => (
              <path key={x} d={`M160,4 L${x},${66 + Math.abs(160 - x) * -0.08}`} stroke="#B89A5E" strokeWidth={1} />
            ))}
            <path d="M84,58 Q160,72 236,58" stroke="#B89A5E" strokeWidth={1} fill="none" />
          </g>
        );
      case "quai-thao":
        return (
          <g>
            <path d="M92,48 Q108,96 138,104 M228,48 Q212,96 182,104" stroke={accent} strokeWidth={2.4} fill="none" />
            {[132, 136, 140].map((x) => (
              <path key={x} d={`M${x},102 l-2,16 M${mx(x)},102 l2,16`} stroke={accent} strokeWidth={1.6} />
            ))}
            <ellipse cx={160} cy={44} rx={98} ry={17} fill="#EADCB0" stroke="#9E8148" strokeWidth={1.6} />
            <ellipse cx={160} cy={42} rx={40} ry={7} fill="none" stroke="#B89A5E" strokeWidth={1.2} />
            <ellipse cx={160} cy={44} rx={80} ry={13} fill="none" stroke="#B89A5E" strokeWidth={0.8} />
          </g>
        );
      case "khan-van":
        return (
          <g>
            <path d="M131,74 Q128,40 160,38 Q192,40 189,74 Q184,54 160,52 Q136,54 131,74 Z" fill={hair} />
            <path d="M124,58 Q160,24 196,58 Q202,70 192,74 Q160,50 128,74 Q118,70 124,58 Z" fill={accent} stroke={edge} strokeWidth={1.6} />
            {[136, 150, 164, 178].map((x) => (
              <path key={x} d={`M${x},${x < 160 ? 48 - (x - 136) / 4 : 42 + (x - 164) / 3} l10,14`} stroke={edge} strokeWidth={1.2} />
            ))}
          </g>
        );
      case "khan-dong":
        return (
          <g>
            <path d="M128,64 Q126,30 160,28 Q194,30 192,64 Q160,54 128,64 Z" fill={accent} stroke={edge} strokeWidth={1.6} />
            {[38, 46, 54].map((y) => (
              <path key={y} d={`M${130 + (y - 38) * -0.1},${y + 4} Q160,${y - 6} ${190},${y + 4}`} stroke={edge} strokeWidth={1.1} fill="none" />
            ))}
            <path d="M152,58 L160,48 L168,58" stroke={edge} strokeWidth={1.2} fill="none" />
          </g>
        );
      case "mo-qua":
        return (
          <path d="M124,90 Q116,30 160,24 Q204,30 196,90 L188,92 Q188,58 172,52 L160,66 L148,52 Q132,58 132,92 Z" fill={accent} stroke={edge} strokeWidth={1.6} strokeLinejoin="round" />
        );
      case "khan-man":
        return (
          <g>
            <path d="M108,62 Q160,-4 212,62 Q220,78 206,82 Q160,40 114,82 Q100,78 108,62 Z" fill={accent} stroke={edge} strokeWidth={1.6} />
            {[124, 144, 164, 184].map((x) => (
              <path key={x} d={`M${x},${x < 160 ? 40 - (x - 124) / 5 : 30 + (x - 164) / 3} q10,6 14,20`} stroke={edge} strokeWidth={1.2} fill="none" />
            ))}
          </g>
        );
      default:
        return null;
    }
  })();

  const faceExtras = (
    <g>
      {look.extras.includes("kinh-ram") && (
        <g fill="#1F1C24" stroke="#1F1C24">
          <rect x={138} y={68} width={19} height={13} rx={5} />
          <rect x={163} y={68} width={19} height={13} rx={5} />
          <path d="M157,73 L163,73" strokeWidth={2} />
        </g>
      )}
      {look.extras.includes("tram-cai") && !["non-la", "quai-thao", "khan-man"].includes(look.head) && (
        <g>
          <path d="M136,30 L186,42" stroke="#8A5A3B" strokeWidth={3} strokeLinecap="round" />
          <circle cx={186} cy={42} r={4.5} fill={accent} stroke={shade(accent, -0.4)} />
        </g>
      )}
    </g>
  );

  /* ----------------------------- Hoa văn defs ---------------------------- */

  const patternShapes = (() => {
    const s = { stroke: patInk, fill: "none", strokeWidth: 1.4, opacity: 0.85 } as const;
    switch (look.pattern) {
      case "hoa-sen":
        return (
          <g {...s}>
            <path d="M18,24 Q12,14 18,6 Q24,14 18,24 Z M18,24 Q8,20 6,12 Q16,14 18,24 Z M18,24 Q28,20 30,12 Q20,14 18,24 Z" fill={patInk} fillOpacity={0.25} />
          </g>
        );
      case "hoa-mai":
        return (
          <g fill={patInk} opacity={0.85}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={r2(14 + 5 * Math.cos((a * Math.PI) / 180))} cy={r2(14 + 5 * Math.sin((a * Math.PI) / 180))} r={3.4} />
            ))}
            <circle cx={14} cy={14} r={2} fill={main} />
          </g>
        );
      case "may-hac":
        return (
          <g {...s}>
            <path d="M4,20 q4,-8 10,-3 q3,-7 10,-2 q6,-2 6,5" />
            <path d="M22,6 q4,-3 8,0" />
          </g>
        );
      case "phuong":
        return (
          <g {...s}>
            <path d="M6,26 Q14,4 30,8 Q20,12 18,22 Q26,16 30,22 Q20,24 6,26 Z" fill={patInk} fillOpacity={0.2} />
          </g>
        );
      case "rong":
        return (
          <g {...s}>
            <path d="M2,20 Q8,8 16,16 T30,12" />
            <path d="M6,15 l-2,-4 M12,14 l0,-5 M18,16 l2,-4 M24,14 l2,-4" />
          </g>
        );
      case "trong-dong":
        return (
          <g {...s}>
            <circle cx={16} cy={16} r={10} />
            <circle cx={16} cy={16} r={5} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <path key={a} d={`M16,16 L${r2(16 + 5 * Math.cos((a * Math.PI) / 180))},${r2(16 + 5 * Math.sin((a * Math.PI) / 180))}`} />
            ))}
          </g>
        );
      case "ke-ran":
        return (
          <g fill={patInk} opacity={0.5}>
            <rect x={0} y={0} width={10} height={10} />
            <rect x={16} y={16} width={10} height={10} />
          </g>
        );
      case "tho-cam":
        return (
          <g {...s}>
            <path d="M0,16 L8,8 L16,16 L24,8 L32,16" />
            <path d="M8,24 L12,20 L16,24 L12,28 Z" fill={patInk} />
          </g>
        );
      default:
        return null;
    }
  })();

  return (
    <svg viewBox="0 0 320 600" className={className} role="img" aria-label={title ?? "Nhân vật mặc bộ phối"}>
      <defs>
        <pattern id={`${id}-pat`} width={look.pattern === "ke-ran" ? 26 : 32} height={look.pattern === "ke-ran" ? 26 : 32} patternUnits="userSpaceOnUse">
          {patternShapes}
        </pattern>
        <pattern id={`${id}-ran`} width={10} height={10} patternUnits="userSpaceOnUse">
          <rect width={10} height={10} fill="#F4F1EA" />
          <rect width={5} height={5} fill={accent === colorById("trang-nga").hex ? "#2A2530" : accent} />
          <rect x={5} y={5} width={5} height={5} fill="#2A2530" />
        </pattern>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.7" stopColor="#fff" stopOpacity={0.5} />
          <stop offset="1" stopColor="#000" stopOpacity={0.2} />
        </linearGradient>
      </defs>

      <ellipse cx={160} cy={584} rx={78} ry={9} fill="#3B2D7A" opacity={0.08} />
      {garment!.back}
      {bottom}
      {shoe}
      {garment!.body}
      {hands(handY, handSpread)}
      {outer}
      {extras}
      {head}
      {headwear}
      {faceExtras}

      {marks.map((m, i) => {
        const [x, y] = ZONE_ANCHOR[m.zone];
        const r = m.zone === "whole" ? 112 : m.zone === "top" ? 70 : m.zone === "bottom" ? 90 : 46;
        const color = m.level === "note" ? "#7C5CD6" : "#D7263D";
        const off = (i % 3) * 7;
        return (
          <g key={`${m.zone}-${m.n}`} className="ink-draw">
            <path
              d={`M${x - r - off},${y + 4} Q${x - r},${y - r * 0.7} ${x},${y - r * 0.72 - off / 2} Q${x + r + 6},${y - r * 0.6} ${x + r + off / 2},${y + 6} Q${x + r - 4},${y + r * 0.7} ${x - 4},${y + r * 0.7} Q${x - r - 6},${y + r * 0.62} ${x - r - off + 2},${y - 10}`}
              fill="none"
              stroke={color}
              strokeWidth={2.4}
              strokeLinecap="round"
              pathLength={1}
              opacity={0.9}
            />
            <text x={Math.min(296, x + r * 0.78 + 6)} y={y - r * 0.5 + i * 20} fill={color} fontSize={22} fontFamily="var(--font-hand)" fontWeight={700}>
              {m.n}
            </text>
          </g>
        );
      })}

      {onZoneClick &&
        HIT_ZONES.map((z) => (
          <rect
            key={z.zone}
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            rx={14}
            className="zone-hit"
            role="button"
            tabIndex={0}
            aria-label={z.label}
            onClick={(e) => {
              // Bỏ viền focus khi bấm chuột, giữ nguyên khi dùng bàn phím
              if (e.detail > 0) (e.currentTarget as SVGRectElement).blur();
              onZoneClick(z.zone);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onZoneClick(z.zone);
              }
            }}
          >
            <title>{z.label}</title>
          </rect>
        ))}
    </svg>
  );
}
