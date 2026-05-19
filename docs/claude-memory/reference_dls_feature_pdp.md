---
name: DLS 2.0 Feature PDP
description: Product detail page template - hero illustration, feature highlight label, 3 feature rows, FAB, used for onboarding interstitials
type: reference
originSessionId: ede62465-cc53-4096-b925-4945426b9c7b
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, node `2063:87946`

## Description
A full-screen product detail page used as an interstitial before a flow begins. Showcases a feature with illustration, highlight label, title, subtitle, and 3 benefit rows. Primary CTA is the FAB at bottom-right.

## Structure (top to bottom)

### 1. App bar (Standard)
- StatusBar (44px) + app bar row (64px) = 108px total
- Leading: back chevron (24x24 in 48x48 touch target, 12px padding)
- No title text
- Background: white (`BG_PRIMARY`)

### 2. Content container
- Top offset: 108px (below app bar)
- Horizontal padding: XL (32px)
- Gap between sections: L (24px)
- Centered horizontally in 360px frame

### 3. Illustration
- Size: 128x128px
- Alignment: right-aligned within container (`justify-end`)
- Slot: accepts any ReactNode (default is abstract gradient shapes)

### 4. Feature highlight label (optional)
- Row: icon (16x16) + text, gap 2XS (4px)
- Text: buttonSmall (14px medium, 20px lh, 0.28px tracking)
- Text color: decorative/bold/green (`GREEN_400` / `#3DBB6C`)
- Icon color: matches text (green)
- Visibility: toggleable via `showFeatureHeader` prop
- Icon default: General/Privacy (lock icon, 16px)

### 5. Product info (title + subtitle)
- Gap between title and subtitle: XS (8px)
- Title: headerH1 (32px medium, 40px lh)
- Title color: `TEXT_PRIMARY`
- Subtitle: bodyNormal (16px regular, 24px lh, 0.32px tracking)
- Subtitle color: `TEXT_TERTIARY`

### 6. Feature rows (×3)
- Gap between rows: L (24px) - inherited from container gap
- Each row layout: flex, items-start, gap S (12px)
- **Icon**: 24x24, default is green checkmark (Status/Tick-rounded)
  - Checkmark color: green (`GREEN_400` / `#3DBB6C`)
  - Slot: accepts custom icon per row
- **Title**: headerH4 (16px medium, 20px lh, 0.32px tracking)
  - Color: `TEXT_PRIMARY`
- **Subtitle**: bodySmall (14px regular, 20px lh, 0.28px tracking)
  - Color: `TEXT_TERTIARY`

### 7. FAB (bottom-right)
- See `reference_dls_fab.md` for full spec
- Positioned absolute at bottom, justify-end
- Includes GestureNav below

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| illustration | ReactNode | abstract shapes | Hero image slot |
| showFeatureHeader | boolean | true | Toggle green label row |
| featureIcon | ReactNode | Privacy/lock 16px | Icon next to highlight text |
| featureText | string | "Feature highlight" | Green label text |
| productName | string | "Product name" | H1 title |
| subtitle | string | "Subtitle giving more context" | Body text below title |
| features | Array<{icon?, title, subtitle}> | 3 default rows | Feature benefit rows |
| onBack | () => void | - | Back chevron handler |
| onAction | () => void | - | FAB tap handler |

## Token mapping summary

| Element | Typography | Color |
|---------|-----------|-------|
| Feature label | buttonSmall | GREEN_400 |
| Product name | headerH1 | TEXT_PRIMARY |
| Subtitle | bodyNormal | TEXT_TERTIARY |
| Feature title | headerH4 | TEXT_PRIMARY |
| Feature subtitle | bodySmall | TEXT_TERTIARY |
| Checkmark icon | - | GREEN_400 |
| FAB | - | VALENTINO_500 |
| Background | - | BG_PRIMARY |
