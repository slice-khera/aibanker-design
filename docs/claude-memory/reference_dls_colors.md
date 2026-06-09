---
name: DLS 2.0 Colors
description: Complete color token system - primitives, semantic, extended, component tokens, gradients, light + dark modes
type: reference
originSessionId: 32063eca-fa80-41b3-a9a0-534d30272a05
---
Figma source: file `ncGqxiE6wUOqgOURwHx6Hp`, node `2466:58841` (semantic/component) and `145:29980` (primitives).

## Light + Dark modes
The app supports a full dark mode. Primitives are mode-agnostic. **Semantic tokens that change between modes are implemented as CSS variables** (`var(--dls-*)`) in `app/lib/colors.ts`, with light values under `:root` and dark values under `.dark` in `app/globals.css`. A `ThemeProvider`/`useTheme` (`app/lib/theme.tsx`) toggles a `.dark` class on the phone-frame surface (DeviceFrame inner div + the `/app/[persona]` frame). Chrome/gallery never gets `.dark`, so it stays light. Toggle lives in the `(main)` layout header ("Dark mode" switch). Mode-stable tokens (brand purple, on-color text, info/positive/warning) stay literal in colors.ts.

## Primitives (full ramps, mode-agnostic)

### Valentino (Brand Purple)
- 50 #FAE2FA · 100 #F3BAF4 · 200 #EA89EC · 300 #E362E5 · 400 #DE45E1 · 500 #D30AD7 · 600 #A008A3 · 700 #87068A · 800 #650567 · 900 #3F0341 · 950 #260227

### Slate (Neutral)
- 10 #F6F9FC · 30 #F0F4F7 · 50 #EAEBED · 100 #CDD0D4 · 200 #AAAFB6 · 300 #8E949D · 400 #78808B · 500 #4E5866 · 600 #3B434E · 700 #323841 · 800 #252A31 · 900 #171A1F · 950 #090B0C

### Blue
- 50 #E6EDF9 · 100 #C4D5F2 · 200 #99B7E8 · 300 #77A0E0 · 400 #5E8EDB · 500 #2B6ACF · 600 #21519D · 700 #1C4484 · 800 #153363 · 900 #0D203E · 950 #081325

### Green
- 50 #E0F4E8 · 100 #B8E6C9 · 200 #85D4A2 · 300 #5CC683 · 400 #3DBB6C · 500 #00A63E · 600 #007E2F · 700 #006A28 · 800 #00501E · 900 #003213 · 950 #001E0B

### Red
- 50 #F9E4E5 · 100 #F1C0C2 · 200 #E79397 · 300 #E06E74 · 400 #DA535A · 500 #CE1D26 · 600 #9D161D · 700 #841318 · 800 #630E12 · 900 #3E090B · 950 #250507

### Orange (REVISED — old values were #FF9A17/#FFB24F/#FFF3E3/#C27511/#2E1C04)
- 50 #FFF0E0 · 100 #FFDCB8 · 200 #FFC385 · 300 #FFAE5C · 400 #FF9F3D · 500 #FF8100 · 600 #C26200 · 700 #A35300 · 800 #7A3E00 · 900 #4D2700 · 950 #2E1700

### Alpha/Black
- ff #000000 · a90 0.9 · a80 0.8 · a70 0.7 · a60 0.6 · a50 0.5 · a40 0.4 · a30 0.3 · a20 0.2 · a10 0.1 · a05 0.05 · a00 0

### Alpha/White
- ff #FFFFFF · a90 0.9 · a80 0.8 · a70 0.7 · a60 0.6 · a50 0.5 · a40 0.4 · a30 0.3 · a20 0.2 · a10 0.1 · a05 0.05 · a00 0

### Physical
- Device bezel `DEVICE_BEZEL` #1A1A1E (phone housing, never themed)

## Semantic tokens — LIGHT → DARK
Format `light → dark`; "(same)" = identical in both modes.

### Main
- Primary Valentino/500 (same) · Primary bold Valentino/700 (same) · Primary medium Valentino/600 (same)
- Primary subtle Valentino/50 → **Valentino/950 #260227**

### Utility
- Info Blue/500 (same) · Positive Green/500 (same) · Warning Orange/500 #FF8100 (same)
- Negative Red/500 → **Red/400 #DA535A**

### Reverse
- Black #000 → **#FFF** · White #FFF → **#000**

### Background
- Brand Valentino/500 → **Slate/950 #090B0C** · Card #FFF → **white a05** · Disabled Slate/50 → **white a05**
- Overlay black a30 → **white a30** · Primary #FFF → **Slate/950** · Secondary Slate/10 → **Slate/900** · Tertiary Slate/10 → **white a10**

### Text & Icons / Default
- Primary black a90 → **#FFF** · Secondary black a70 → **white a70** · Tertiary black a50 → **white a50** · Disabled black a20 → **white a20**

### Text & Icons / On Color (same in dark) — use for text/icons on coloured/brand surfaces
- Primary #FFF · Secondary white a70 · Tertiary white a40 · Disabled white a30

### Outline / Default
- Bold black a10 → **white a10** · Subtle black a05 → **white a05**
### Outline / On Color (same)
- Bold white a30 · Subtle white a20

### Extended / Background — Bold (dark = light, except Reverse)
- Info Blue/500 · Main Valentino/500 · Negative Red/400 · Neutral Slate/800 · Positive Green/500 · Warning Orange/500 · Reverse #000 → **#FFF**
### Extended / Background — Subtle (flip /50 → /950)
- Info Blue/50→950 · Main Val/50→950 · Negative Red/50→950 · Neutral Slate/10→900 · Positive Green/50→950 · Warning Orange/50→950

### Extended / Text & Icons (brighten /500 → /400 in dark)
- Info Blue/500→**400** · Main Val/500→**400** · Negative Red/500→**400** · Positive Green/500→**400** · Warning Orange/500→**400** · Neutral Slate/800 (same) · Reverse #FFF → **#000**

### Extended / Outline (same in dark)
- Info Blue/500 · Main Selected Valentino/500 · Negative Red/500 · Positive Green/500 · Warning Orange/500

### Decorative — Subtle (flip /50 → /950) / Bold (same, except Slate)
- Subtle: Blue/Green/Orange/Red/Valentino /50→/950; Slate/50→**Slate/900**
- Bold: Blue/500 · Green/400 · Orange/400 · Red/400 · Valentino/500 (same); Slate/400→**Slate/500**

### Component / Button
- Grey default Slate/30→**Slate/700** · Grey pressed Slate/50→**Slate/600**
- On-color default #FFF (same) · On-color pressed Slate/10 (same)
- Primary default Valentino/500 (same) · Primary pressed Valentino/600 (same) · Primary disabled Slate/50→**black a10**
- Secondary default/disabled transparent (white a00→black a00) · Secondary pressed Valentino/50→**Valentino/950** · Tertiary pressed Slate/50→**Valentino/500 #D30AD7**
- Button text Primary/Secondary Valentino/500 (same)

### Component / Toggle
- Track Slate/100 → **Slate/500 #4E5866**

### Component / Bottom nav
- Gradient start white a00→**black a00** · Gradient stop #FFF→**Slate/950** · Primary bg #FFF→**white a20** · Secondary bg black a10→**white a20** · Selected black a40→**white a60**

### Gradient (mode-stable)
- Brand: linear-gradient left→right, Valentino/500 → Blue/500

## Carve-outs (NOT themed — left literal by design)
Illustration art with no DLS dark spec (Trip-to-Japan / pot scene gradients: pinks #fdd9e1/#f2a7be/#d98bac/#bf66a5/#e8899e/#ffe6ed/#ffe0ea, dark purples #4a2d5e/#3a1f4a/#5c3347; pot scene sky #87CEEB, greens #6abf69/#5cb85c/#3d8b3d/#b8e6b8, pot #ff6b35), scrim/textShadow rgba sitting on those illustrations, box-shadow elevation rgba, PlanMode confetti palette, and the #1a1a1e bezel. The slice pay screen stays magenta (brand image surface). The mock iOS keyboard stays light (OS render).
