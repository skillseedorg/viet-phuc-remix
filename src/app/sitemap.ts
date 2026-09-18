import type { MetadataRoute } from "next";
import { GARMENTS } from "@/lib/kb";
import { SITE_URL } from "@/lib/site";


const PAGES = ["", "/phoi-do", "/cham-outfit", "/kham-pha", "/lookbook", "/so-sanh", "/cam-ket", "/quyen-rieng-tu", "/dieu-khoan", "/ban-quyen", "/lien-he"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...GARMENTS.map((g) => ({ url: `${SITE_URL}/kham-pha/${g.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
