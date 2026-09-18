import type { EventId, FabricId, GarmentId, OuterId } from "./kb";

export type City = { id: string; name: string; lat: number; lon: number };

export const CITIES: City[] = [
  { id: "ha-noi", name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
  { id: "bac-ninh", name: "Bắc Ninh", lat: 21.1861, lon: 106.0763 },
  { id: "hue", name: "Huế", lat: 16.4637, lon: 107.5909 },
  { id: "da-nang", name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
  { id: "hoi-an", name: "Hội An", lat: 15.8801, lon: 108.338 },
  { id: "da-lat", name: "Đà Lạt", lat: 11.9404, lon: 108.4583 },
  { id: "tp-hcm", name: "TP. Hồ Chí Minh", lat: 10.7769, lon: 106.7009 },
  { id: "can-tho", name: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
];

export type WeatherNow = {
  city: string;
  temp: number;
  feels: number;
  humidity: number;
  rainChance: number;
  rainy: boolean;
  code: number;
  label: string;
  max: number;
  min: number;
};

const CODE_LABEL: [number[], string][] = [
  [[0], "Trời quang"],
  [[1, 2], "Ít mây"],
  [[3], "Nhiều mây"],
  [[45, 48], "Sương mù"],
  [[51, 53, 55, 56, 57], "Mưa phùn"],
  [[61, 63, 65, 66, 67, 80, 81, 82], "Có mưa"],
  [[95, 96, 99], "Dông"],
];

export async function fetchWeather(city: City): Promise<WeatherNow> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không lấy được dữ liệu thời tiết");
  const d = await res.json();
  const code = d.current.weather_code as number;
  const rainChance = d.daily.precipitation_probability_max?.[0] ?? 0;
  return {
    city: city.name,
    temp: d.current.temperature_2m,
    feels: d.current.apparent_temperature,
    humidity: d.current.relative_humidity_2m,
    rainChance,
    rainy: d.current.precipitation > 0 || rainChance >= 60 || code >= 51,
    code,
    label: CODE_LABEL.find(([codes]) => codes.includes(code))?.[1] ?? "Thay đổi",
    max: d.daily.temperature_2m_max[0],
    min: d.daily.temperature_2m_min[0],
  };
}

export type WeatherAdvice = {
  fabric: FabricId;
  outer: OuterId;
  garments: GarmentId[];
  lines: string[];
};

export function adviseForWeather(w: WeatherNow, event: EventId | null): WeatherAdvice {
  const lines: string[] = [];
  let fabric: FabricId = "lua";
  let outer: OuterId = "none";
  let garments: GarmentId[] = ["ao-dai", "ao-ngu-than"];

  if (w.feels >= 33) {
    fabric = "voan";
    garments = ["ao-ba-ba", "ao-dai"];
    lines.push(`Cảm giác ${Math.round(w.feels)}°C: chọn voan, lụa mỏng, màu sáng. Nón lá vừa đẹp vừa che nắng.`);
  } else if (w.feels >= 26) {
    fabric = "lua";
    lines.push(`Khoảng ${Math.round(w.temp)}°C, dễ chịu: lụa hoặc đũi là vừa đẹp.`);
  } else if (w.feels >= 18) {
    fabric = "gam";
    lines.push(`Se lạnh ${Math.round(w.temp)}°C: gấm dày dặn giữ ấm, hợp áo ngũ thân và áo dài.`);
  } else {
    fabric = "nhung";
    outer = "cardigan";
    garments = ["ao-ngu-than", "ao-dai"];
    lines.push(`Lạnh ${Math.round(w.temp)}°C: nhung hoặc gấm, mặc áo giữ nhiệt mỏng bên trong và khoác cardigan khi di chuyển.`);
  }

  if (w.rainy) lines.push(`Khả năng mưa ${w.rainChance}%: tránh guốc mộc và vải voan sáng màu dễ lộ khi ướt; mang sandal quai hậu.`);
  if (w.humidity >= 85 && w.temp >= 25) lines.push("Độ ẩm cao: tránh vải dày, ưu tiên đũi thấm hút.");
  if (event === "le-hoi" && w.feels >= 30) lines.push("Lễ hội ngoài trời: mang theo nón và nước, tránh nhiều lớp áo mớ ba.");

  return { fabric, outer, garments, lines };
}
