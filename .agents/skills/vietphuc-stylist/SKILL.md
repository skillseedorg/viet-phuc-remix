---
name: vietphuc-stylist
description: Cultural fashion stylist & Gemini AI prompt engineering guide for traditional Vietnamese garments (Áo Dài, Áo Tứ Thân, Áo Ngũ Thân, Áo Bà Ba, Áo Nhật Bình, Áo Tấc).
---

# Việt Phục Stylist Skill

This skill provides domain knowledge and rules for managing traditional Vietnamese fashion styling, cultural etiquette validation, and Google Gemini prompt construction in **Việt Phục Remix**.

## 👘 Garment Taxonomy (`kb.ts`)

| Garment Key | Vietnamese Name | Cultural Context & Key Features |
|---|---|---|
| `ao-dai` | Áo Dài | Iconic Vietnamese national dress, high collar, two side slits. |
| `tu-than` | Áo Tứ Thân | Northern four-panel traditional robe worn with yếm (breast cloth) & headscarf. |
| `ngu-than` | Áo Ngũ Thân | Five-panel traditional noble gown with standing collar & buttoned side flap. |
| `ba-ba` | Áo Bà Ba | Southern casual silk pyjama shirt with button front & scoop collar. |
| `nhat-binh` | Áo Nhật Bình | Rectangular-collared royal court gown for royal women (Nguyen Dynasty). |
| `ao-tac` | Áo Tấc | Ceremonial wide-sleeved five-panel robe worn for official rituals & weddings. |

## 🎨 Cultural Rule Check Logic (`culture.ts`)

When constructing or verifying cultural rules:
1. **Occasion Respect**: Formal rituals (temples, weddings, funerals) strictly disallow casual/remixed versions (e.g. short hems, inappropriate color combos).
2. **Color Symbolism**:
   - White headbands/garments in specific contexts evoke mourning ("khăn tang").
   - Red + Mấn headpiece worn at a wedding can clash with the bride's attire.
   - Five-claw dragons & Imperial yellow were historically reserved for royalty.
3. **Rule Output Levels**:
   - `Lưu ý` (Note): Subtle stylistic recommendation.
   - `Nên sửa` (Recommended Edit): Cultural misalignment.
   - `Cần sửa` (Critical Edit): Major breach of traditional etiquette.

## 🤖 Gemini AI Prompt Design

When designing prompts for Gemini API in [`src/lib/ai.ts`](file:///c:/Users/Admin/Downloads/aiarena/src/lib/ai.ts):
- Always serialize the current `LookConfig` alongside the rules evaluation output from `evaluateCulture()`.
- Use JSON response mode (`responseMimeType: "application/json"`).
- Keep AI responses encouraging, educational, and respectful of Gen Z creativity while safeguarding historical accuracy.
