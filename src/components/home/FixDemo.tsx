"use client";

import { useState } from "react";
import Figure from "../Figure";
import { checkCulture } from "@/lib/culture";
import { DEFAULT_LOOK, type LookConfig } from "@/lib/look";
import { Button, cx } from "../ui";

const WRONG: LookConfig = {
  ...DEFAULT_LOOK,
  garment: "ao-dai",
  event: "dam-cuoi",
  region: "bac",
  style: "thanh-lich",
  main: "do-son",
  secondary: "do-son",
  accent: "vang-hoa-hoe",
  pattern: "tron",
  fabric: "lua",
  length: "ngan",
  bottom: "quan-lua",
  head: "khan-man",
  feet: "cao-got",
  extras: [],
  skin: "s3",
  hair: "bui",
};

export default function FixDemo() {
  const [look, setLook] = useState<LookConfig>(WRONG);
  const report = checkCulture(look);
  const fixable = report.issues.filter((i) => i.fix);

  return (
    <div className="grid items-center gap-6 md:grid-cols-[300px_1fr]">
      <div className="relative mx-auto w-full max-w-[300px]">
        <Figure
          look={look}
          marks={report.issues.map((i, n) => ({ zone: i.zone, level: i.level, n: n + 1 }))}
          className="h-[440px] w-full"
          title="Nhân vật làm khách đám cưới"
        />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-muted">Đề bài: làm khách đám cưới bạn thân</p>
        <ol className="mt-3 space-y-3">
          {report.issues.map((i, n) => (
            <li key={i.id} className="fade-up grid grid-cols-[32px_1fr] gap-2">
              <span
                className={cx(
                  "hand grid size-8 place-items-center rounded-full border-2 text-[18px]",
                  i.level === "note" ? "border-ink/60 text-ink" : "border-redpen text-redpen",
                )}
              >
                {n + 1}
              </span>
              <div>
                <p className="font-bold text-text">{i.title}</p>
                <p className="text-[14.5px] text-muted">{i.detail}</p>
              </div>
            </li>
          ))}
          {report.issues.length === 0 && (
            <li className="hand text-[26px] leading-tight text-redpen">Đúng rồi! Lịch sự, nổi bật, không trùng cô dâu. 10 điểm.</li>
          )}
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          {fixable.length > 0 ? (
            <Button variant="red" onClick={() => setLook((l) => ({ ...l, ...fixable[0].fix!.patch }))}>
              Sửa giúp: {fixable[0].fix!.label}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setLook(WRONG)}>
              Làm lại đề
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
