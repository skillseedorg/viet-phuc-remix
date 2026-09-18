# System Architecture — Việt Phục Remix

> **Technical Blueprint**: Next.js 16 App Router + Google Gemini API (`gemini-3.8-flash`) + Supabase RLS + Cloudflare Workers via OpenNext.

---

## 🏗️ Architecture Overview

Việt Phục Remix is architected around a **Deterministic Rule Engine + Multimodal LLM** pattern. This ensures instant client feedback for cultural rules while leveraging Google Gemini for natural language styling advice and image analysis.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BROWSER CLIENT                                   │
│                                                                             │
│  ┌─────────────────────────┐                ┌────────────────────────────┐  │
│  │ Studio Component (UI)   │───────────────►│ Dynamic SVG Avatar Figure  │  │
│  └────────────┬────────────┘                └────────────────────────────┘  │
│               │                                                             │
│               ▼                                                             │
│  ┌─────────────────────────┐                ┌────────────────────────────┐  │
│  │ Culture Engine (Client) │───────────────►│ Harmony Engine (HSL)       │  │
│  │   src/lib/culture.ts    │                │    src/lib/harmony.ts      │  │
│  └────────────┬────────────┘                └────────────────────────────┘  │
└───────────────┼─────────────────────────────────────────────────────────────┘
                │ Async API Request (/api/stylist, /api/photo, /api/ask)
                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE WORKERS / SERVERLESS                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Next.js App Router API Route Handler                                  │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Google Gemini Integration Client (src/lib/ai.ts)                      │  │
│  │ - Key protection (Server env only)                                    │  │
│  │ - Prompt context builder from kb.ts                                   │  │
│  │ - JSON Mode & minimal thinking configuration                          │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ HTTPS REST API
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE GEMINI API SERVICE                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ gemini-3.8-flash (generateContent Endpoint)                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Key Architecture Components

### 1. Cultural Knowledge Base (`src/lib/kb.ts`)
- Pure TypeScript constants mapping all garment types, traditional color palettes, pattern meanings, occasions, accessories, and historical sources.
- Serves as the single source of truth for both the UI and Gemini prompt injections.

### 2. Rule & Harmony Engines (`src/lib/culture.ts` & `src/lib/harmony.ts`)
- **Deterministic**: Standard JavaScript functions execution with 0ms network latency.
- Evaluates garment compatibility against event formality, regional traditions, and color harmony.

### 3. Google Gemini AI Engine (`src/lib/ai.ts`)
- Calls Google Gemini REST API (`gemini-3.8-flash`).
- Formats prompts with structured data from `kb.ts` and `culture.ts`.
- Configured with `responseMimeType: "application/json"` and `thinkingConfig: { thinkingLevel: "minimal" }` for low-latency interactive styling responses.
- Implements multimodal vision capabilities for photo palette extraction and avatar matching.

### 4. Database & Auth Layer (`supabase/schema.sql`)
- PostgreSQL database hosted on Supabase.
- User management (`profiles`), lookbook storage (`looks`), and user feedback reporting (`content_reports`).
- Fully secured with Supabase Row Level Security (RLS) policies.

---

## 🚀 Deployment Pipeline

```
GitHub Repository ──► OpenNext Cloudflare Adapter ──► Cloudflare Workers Edge Network
```

- **Runtime**: OpenNext adapter (`opennextjs-cloudflare`) compiles Next.js App Router server routes to Workers V8 isolate workers.
- **Secrets Management**: Secrets like `GEMINI_API_KEY` are encrypted via Cloudflare Wrangler secrets (`npx wrangler secret put GEMINI_API_KEY`).
