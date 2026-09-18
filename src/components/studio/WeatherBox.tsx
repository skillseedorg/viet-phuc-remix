"use client";

import { useState } from "react";
import { CloudSun } from "lucide-react";
import { CITIES, adviseForWeather, fetchWeather, type WeatherNow } from "@/lib/weather";
import { garmentById, names, type EventId } from "@/lib/kb";
import type { LookConfig } from "@/lib/look";
import { Button } from "../ui";

export default function WeatherBox({
  event,
  weather,
  onWeather,
  onApply,
}: {
  event: EventId | null;
  weather: WeatherNow | null;
  onWeather: (w: WeatherNow | null) => void;
  onApply: (patch: Partial<LookConfig>) => void;
}) {
  const [city, setCity] = useState("ha-noi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advice = weather ? adviseForWeather(weather, event) : null;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      onWeather(await fetchWeather(CITIES.find((c) => c.id === city)!));
    } catch {
      setError("Không tải được thời tiết. Kiểm tra kết nối mạng rồi thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[12px] border-[1.5px] border-dashed border-ink/35 bg-white/70 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <CloudSun className="size-5 text-ink" aria-hidden />
        <label htmlFor="city" className="text-[14px] font-semibold text-ink-deep">
          Thời tiết hôm nay ở
        </label>
        <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="h-10 rounded-[10px] border-[1.5px] border-grid bg-white px-2 text-[15px] text-text focus:border-ink focus:outline-none">
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button size="sm" variant="outline" onClick={load} loading={loading}>
          Xem
        </Button>
      </div>
      {error && <p className="mt-2 text-[14px] text-redpen">{error}</p>}
      {weather && advice && (
        <div className="fade-up mt-3 space-y-2">
          <p className="text-[14.5px]">
            <span className="hand text-[24px] text-ink">{Math.round(weather.temp)}°C</span>{" "}
            <span className="font-semibold">{weather.city}</span> · {weather.label} · thấp {Math.round(weather.min)}° cao{" "}
            {Math.round(weather.max)}° · mưa {weather.rainChance}%
          </p>
          <ul className="space-y-1 text-[14px] text-text">
            {advice.lines.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
                {l}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => onApply({ fabric: advice.fabric, outer: advice.outer, ...(weather.rainy ? { feet: "sandal" } : {}) })}
            >
              Áp dụng: {names.fabric(advice.fabric).toLowerCase()}
              {advice.outer !== "none" ? ` + ${names.outer(advice.outer).toLowerCase()}` : ""}
              {weather.rainy ? " + sandal" : ""}
            </Button>
            <span className="text-[13px] text-muted">Hợp nhất: {advice.garments.map((g) => garmentById(g).name).join(", ")}</span>
            <button type="button" className="ml-auto text-[13px] font-semibold text-muted underline" onClick={() => onWeather(null)}>
              Bỏ thời tiết
            </button>
          </div>
          <p className="text-[12px] text-muted">
            Dữ liệu thời tiết:{" "}
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">
              Open-Meteo.com
            </a>{" "}
            (CC BY 4.0)
          </p>
        </div>
      )}
    </div>
  );
}
