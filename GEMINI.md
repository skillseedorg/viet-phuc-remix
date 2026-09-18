# GEMINI.md — Việt Phục Remix

> **Powered by Google Gemini** (`gemini-3.8-flash`) | Built with Next.js 16, TypeScript, Tailwind CSS 4 & Cloudflare Workers

Welcome to **Việt Phục Remix**, an AI-powered cultural fashion exploration platform that helps high school and university students (Gen Z) discover, mix, and style traditional Vietnamese garments (Áo Dài, Áo Tứ Thân, Áo Ngũ Thân, Áo Bà Ba, Áo Nhật Bình, Áo Tấc) with personal flair while respecting historical and cultural accuracy.

This document serves as the primary project guide and technical reference for **Google Gemini** models and **Antigravity** AI agents working on this codebase.

---

## 🌟 System Overview & AI Architecture

```
                                  ┌────────────────────────┐
                                  │   User Interface UI    │
                                  │ (Interactive SVG Fig)  │
                                  └───────────┬────────────┘
                                              │
                                              ▼
┌───────────────────────┐         ┌────────────────────────┐
│  Cultural KB (kb.ts)  │────────►│ Rule Engine (culture)  │
└───────────────────────┘         │ Harmony Engine (color) │
                                  └───────────┬────────────┘
                                              │ Fast client/server rules
                                              ▼
                                  ┌────────────────────────┐
                                  │   Next.js API Route    │
                                  │   (Server Environment) │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │   Google Gemini API    │
                                  │   (gemini-3.8-flash)   │
                                  └────────────────────────┘
```

Việt Phục Remix uses a **Hybrid AI Architecture**:
1. **Deterministic Cultural Rule Engine (`src/lib/culture.ts`)**: Runs locally (instant, 0ms latency) to check garment structure, occasion appropriateness, and cultural warnings.
2. **Google Gemini Multimodal AI Engine (`src/lib/ai.ts`)**: Evaluates complex stylistic nuances, generates custom styling advice, analyzes uploaded user photos, provides captions, and powers the interactive cultural Q&A.

---

## 🛠️ Tech Stack & Environment

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | React 19, Server Components, TypeScript |
| **Styling** | Tailwind CSS 4 + Custom Tokens | Notebook aesthetic (`cover`, `paper`, `ink`, `redpen`) |
| **Primary AI Engine** | **Google Gemini API** | Model: `gemini-3.8-flash` (via native REST API) |
| **Database & Auth** | Supabase | PostgreSQL with Row Level Security (RLS) |
| **Deployment** | Cloudflare Workers | OpenNext adapter (`opennextjs-cloudflare`) |
| **Weather Integration** | Open-Meteo API | Free live weather data for outfit recommendations |

---

## 🤖 Google Gemini Integration Guidelines

### 1. API Key & Endpoint Configuration
- **Server-Side Only**: `GEMINI_API_KEY` must **NEVER** be prefixed with `NEXT_PUBLIC_`. All AI calls go through server-side API routes (`/api/stylist`, `/api/photo`, `/api/ask`, `/api/compare`).
- **Default Model**: `gemini-3.8-flash` (configurable via `GEMINI_MODEL` environment variable).
- **Base Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`.

### 2. Request Protocol & JSON Mode
All Gemini API requests use native structured output:
```json
{
  "systemInstruction": { "parts": [{ "text": "..." }] },
  "contents": [...],
  "generationConfig": {
    "responseMimeType": "application/json",
    "temperature": 0.7,
    "maxOutputTokens": 2424,
    "thinkingConfig": { "thinkingLevel": "minimal" }
  }
}
```

### 3. Guardrails & AI Safety
- **Single Source of Truth**: Prompts inject contextual knowledge snippets from [`src/lib/kb.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/kb.ts).
- **Factuality Strictness**: Gemini must not hallucinate historical dates, dynastic lineages, or non-existent cultural sources.
- **Strict Data Sanitization**: All AI-suggested outfit patch proposals are validated against the rule engine before being returned to the client.

---

## 📁 Repository & Codebase Map

- [`src/lib/ai.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/ai.ts) — Core Google Gemini API client integration, prompt handler, fallback manager, and JSON parser.
- [`src/lib/kb.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/kb.ts) — Cultural knowledge base: garments, occasions, traditional color symbolism, pattern meanings, and historic sources.
- [`src/lib/culture.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/culture.ts) — Deterministic cultural validation engine checking occasion, etiquette, and garment boundaries.
- [`src/lib/harmony.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/harmony.ts) — HSL color harmony analyzer scoring color palettes against classic Vietnamese combinations.
- [`src/lib/weather.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/weather.ts) — Open-Meteo client providing location-based weather data and fabric suitability tips.
- [`src/components/Figure`](file:///c:/Users/Admin/Downloads/aiarena/src/components/Figure) — Dynamic SVG avatar renderer supporting layered garment assets, skin tones, hairstyles, and face swapping.
- [`src/app/api`](file:///c:/Users/Admin/Downloads/aiarena/src/app/api) — Next.js serverless API routes powering Gemini endpoints (`/api/stylist`, `/api/photo`, `/api/ask`, `/api/compare`).
- [`supabase/schema.sql`](file:///c:/Users/Admin/Downloads/aiarena/supabase/schema.sql) — Supabase database schema (`profiles`, `looks`, `content_reports`) with strict RLS policies.
- [`wrangler.jsonc`](file:///c:/Users/Admin/Downloads/aiarena/wrangler.jsonc) & [`open-next.config.ts`](file:///c:/Users/Admin/Downloads/aiarena/open-next.config.ts) — Cloudflare Workers edge deployment configuration.

---

## 🎨 Visual Identity & Theme Tokens

The app follows a **"Student Grid Notebook" (Vở ô ly)** aesthetic:
- **`cover` (`#3a27a3`)**: Deep violet notebook cover.
- **`paper` (`#fdfdff`)**: Clean white paper background with double red margin line (`#e36a80`).
- **`ink` (`#3d2aa8`)**: Blue-violet ink used for titles, active selections, and interactive controls.
- **`redpen` (`#cf1f3a`)**: Red pen ink reserved for teacher feedback, scores, and cultural warnings.
- **Typography**: `Be Vietnam Pro` (interface text) + `Patrick Hand` (handwritten comments & scores).

---

## ⚡ Quickstart Commands

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server (http://localhost:3000)
npm run dev

# Preview Cloudflare Workers build locally
npm run preview

# Deploy to Cloudflare Workers
npm run deploy
```

---

## 📄 Related Documentation
- [`PRODUCT.md`](file:///c:/Users/Admin/Downloads/aiarena/PRODUCT.md) — Product positioning, user personas, and design commitments.
- [`DESIGN.md`](file:///c:/Users/Admin/Downloads/aiarena/DESIGN.md) — UI design system, color tokens, typography, and motion guidelines.
- [`ARCHITECTURE.md`](file:///c:/Users/Admin/Downloads/aiarena/ARCHITECTURE.md) — Detailed architecture diagram and AI request lifecycle.
- [`NOP_BAI.md`](file:///c:/Users/Admin/Downloads/aiarena/NOP_BAI.md) — Full solution submission proposal and technical rationale.
