# Workspace Rules — Việt Phục Remix (Gemini Edition)

> These rules apply across all Antigravity and Gemini subagents operating on the Việt Phục Remix codebase.

@GEMINI.md

## 1. Security & Environment Variable Rules
- **NEVER** expose `GEMINI_API_KEY` or any private service keys to the client.
- All Gemini API calls must take place inside server-side Next.js route handlers (`src/app/api/*`) or server actions.
- Client components may only consume `NEXT_PUBLIC_` variables (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).

## 2. Gemini API Conventions
- When interacting with Google Gemini API, use the implementation defined in [`src/lib/ai.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/ai.ts).
- Default to `gemini-3.8-flash` model.
- Always use `responseMimeType: "application/json"` for structured AI outputs.
- Pass `thinkingConfig: { thinkingLevel: "minimal" }` to ensure ultra-fast response times for interactive styling.

## 3. Cultural Knowledge Base Integrity
- Do NOT invent or alter traditional Vietnamese garment definitions, historic names, or ceremonial etiquette without referencing [`src/lib/kb.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/kb.ts).
- Always maintain the distinction between historical facts ("Có tư liệu"), folk customs ("Cách hiểu dân gian"), and academic hypotheses ("Còn nhiều giả thuyết").

## 4. UI Design System Guidelines
- Adhere to the **Student Grid Notebook (Vở ô ly)** aesthetic specified in [`DESIGN.md`](file:///c:/Users/Admin/Downloads/aiarena/DESIGN.md).
- Use color tokens (`cover`, `paper`, `ink`, `redpen`, `margin`) defined in `globals.css`.
- Keep SVG figure rendering in [`src/components/Figure`](file:///c:/Users/Admin/Downloads/aiarena/src/components/Figure) reactive and lightweight.

## 5. Next.js & Cloudflare Edge Deployment Compatibility
- Maintain compatibility with Cloudflare Workers runtime via OpenNext.
- Avoid using Node.js native binary dependencies or un-polyfilled APIs inside edge-deployed server routes.
