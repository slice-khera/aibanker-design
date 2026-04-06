# Chat Card Spec

Reference this document whenever building a new card widget. Every card in `ChatCards.tsx` must conform to these rules.

All color values below are drawn from `app/lib/colors.ts` (DLS 2.0 tokens) and all typography from `app/lib/typography.ts`. Prefer importing named constants over raw hex.

---

## Shell

Three shared constants. Every card uses all three — no exceptions.

```ts
const CARD_BG = "#f6f9fc";        // SLATE_10
const CARD_RADIUS = 16;           // px
const CARD_PAD = "16px";          // all sides
```

### Card variant: `"surface"`

When a card renders inline within assistant text (no container), use the surface variant:

```ts
{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: CARD_RADIUS, padding: CARD_PAD }
```

---

## Card Header

Every card has one header row: uppercase label on the left, arrow icon on the right.

**The arrow is always present.** If the card links to a detail view, pass `onArrowTap` and it becomes a button. If not wired yet, omit `onArrowTap` and it renders as a non-interactive placeholder — a visual signal that drill-down will exist eventually.

Use `arrowInvisible` to hide the arrow until a condition is met (e.g. investment card only shows the arrow after the product is activated).

```tsx
<CardHeader label="Goal progress" />
<CardHeader label="Fixed Deposit" onArrowTap={openDetail} />
<CardHeader label="Fixed Deposit" onArrowTap={openDetail} arrowInvisible={!isActivated} />
```

| Element | Value |
|---|---|
| Label style | `typography.metadata` + `textTransform: uppercase` + `color: rgba(0,0,0,0.5)` (TEXT_TERTIARY) |
| Arrow container | `36×36` circle, `rgba(0,0,0,0.05)` background (OUTLINE_SUBTLE) |
| Arrow icon | `13×13` SVG, stroke `rgba(0,0,0,0.5)` (TEXT_TERTIARY), `strokeWidth: 1.6` |
| Arrow fade transition | `opacity 300ms ease` |
| Row bottom margin | `8px` |

---

## Typography Hierarchy

Cards follow a consistent reading order. Use the tokens from `typography.ts` — never raw font values.

### Level 1 — Primary value

The most important piece of information. Two variants depending on card type:

- **Amount-first cards** (Spend Overview, Investment Product): `typography.headerH1` — 32px / 500 weight
- **Name-first cards** (Goal Progress, Savings Plan): `typography.headerH4` — 16px / 500 weight

Color: `rgba(0,0,0,0.9)` (TEXT_PRIMARY)

### Level 2 — Subtitle / signal text

Context for the primary value. Always `typography.caption` (12px / 400 weight). Color varies by semantics — see Signal Colors below.

### Level 3 — Key-value rows

For detail rows (e.g. "Rate · 7.25%", "Monthly · ₹8,500"):

| Side | Token | Color |
|---|---|---|
| Label (left) | `typography.caption` | `rgba(0,0,0,0.5)` (TEXT_TERTIARY) |
| Value (right) | `typography.buttonSmall` | `rgba(0,0,0,0.9)` (TEXT_PRIMARY) |
| Positive value | `typography.buttonSmall` | `#00a63e` (GREEN_500) |

### Level 4 — Micro-labels

For labels above values in footers (e.g. "PAYING FROM"). `typography.metadata` + `textTransform: uppercase` + `color: rgba(0,0,0,0.3)` (TEXT_DISABLED).

---

## Color System

### Surfaces

| Use | Value | Token |
|---|---|---|
| Card background | `#f6f9fc` | SLATE_10 / BG_SURFACE |
| White inset (icon circles, etc.) | `#ffffff` | BG_PRIMARY |

### Text opacity scale (DLS 2 semantic aliases)

| Role | Value | Token |
|---|---|---|
| Primary text | `rgba(0,0,0,0.9)` | TEXT_PRIMARY |
| Secondary text | `rgba(0,0,0,0.7)` | TEXT_SECONDARY |
| Labels / tertiary | `rgba(0,0,0,0.5)` | TEXT_TERTIARY |
| Micro-labels / disabled | `rgba(0,0,0,0.3)` | TEXT_DISABLED |

### Accent colors — DLS 2 palette

| Color | Hex | Token | Belongs to |
|---|---|---|---|
| Brand magenta | `#d30ad7` | VALENTINO_500 | Goals, progress bars, active chips, CTAs |
| Green | `#00a63e` | GREEN_500 | Positive signals: interest rates, ahead-of-pace, success |
| Red | `#ce1d26` | RED_500 | Negative signals: behind pace, over budget |
| Orange | `#ff9a17` | ORANGE_500 | Warning / on-track status |
| Blue | `#2b6acf` | BLUE_500 | Informational: timelines, neutral detail |
| Slate | `#8e949d` | SLATE_300 | Neutral / "Other" category |

### Dividers

```ts
{ height: 1, backgroundColor: "rgba(0,0,0,0.05)" }  // OUTLINE_SUBTLE
```

All dividers use `OUTLINE_SUBTLE`. Do not vary it.

### Track backgrounds (progress bars, bar rows)

Category bars use a `/50` tint from the same DLS palette as the fill color (e.g. `#fae2fa` for Valentino, `#e0f4e8` for Green). Goal progress bars use `VALENTINO_50` (`#fae2fa`) as the track.

---

## Progress Bars

Goal progress bars (Goal Progress, Savings Plan):

| Property | Value |
|---|---|
| Height | `8px` |
| Track | VALENTINO_50 `#fae2fa`, `borderRadius: 100`, `overflow: hidden` |
| Fill | VALENTINO_500 `#d30ad7` (always magenta for goals) |
| Fill radius | `borderRadius: 100` |

Per-row category bars (Category Breakdown) are `8px` tall, `borderRadius: 100`, with a color-matched `/50` track.

---

## Status Tags (DLS 2 Tag)

Uses the `DlsTag` component — a pill with `typography.metadata`, uppercase text. Six intents, two emphasis levels (subtle / bold).

### Subtle emphasis (used for status pills on cards)

| Intent | Background | Text |
|---|---|---|
| Positive (ahead) | GREEN_50 `#e0f4e8` | GREEN_500 `#00a63e` |
| Warning (on-track) | ORANGE_50 `#fff3e3` | ORANGE_600 `#c27511` |
| Negative (behind) | RED_50 `#f9e4e5` | RED_500 `#ce1d26` |
| Brand | VALENTINO_50 `#fae2fa` | VALENTINO_500 `#d30ad7` |
| Info (timeline) | BLUE_50 `#e6edf9` | BLUE_500 `#2b6acf` |
| Neutral | SLATE_10 `#f6f9fc` | SLATE_800 `#252a31` |

### Bold emphasis

White text on the intent's `/500` fill color (RED_400 `#da535a` for negative).

### Tag dimensions

```ts
padding: "4px 8px"
borderRadius: 100
typography.metadata
textTransform: "uppercase"
```

---

## CTA Button

One per card maximum. Appears in the footer row, paired with a detail label on the left. Disappears (fades out) once the action is completed and a `ConfirmedRow` replaces it.

### Filled CTA (Add to Pot, Chat action cards)

```ts
typography.buttonSmall
padding: "8px 20px"
borderRadius: 100
backgroundColor: "#d30ad7"  // VALENTINO_500
color: "#fff"
border: "none"
```

### Text-only CTA (Investment Product "Set up")

```ts
typography.buttonSmall
color: "#d30ad7"  // VALENTINO_500
background: "transparent"
border: "none"
```

---

## Confirmed Row

Shown after a card action succeeds. Green check circle + label + optional arrow.

```ts
// Check circle
width: 20, height: 20, borderRadius: "50%", backgroundColor: "#00a63e"  // GREEN_500

// Label
typography.buttonSmall, color: "#00a63e"  // GREEN_500
```

---

## Spacing Reference

| Context | Value |
|---|---|
| Card padding | `16px` all sides |
| Header bottom margin | `8px` |
| Between primary value and subtitle | `4px` |
| Between subtitle and next section | `16px` |
| Between detail rows | `8px` (via `gap: 8`) |
| Divider bottom margin | `12–16px` |
| Category icon size | `40×40` |
| Category icon gap to content | via `gap` in flex |
| Category bar height | `8px` |

---

## SVG / Chart Text

SVG text can't use the CSS token system, so match values manually:

| Role | fontSize | fontWeight | letterSpacing | fontFamily |
|---|---|---|---|---|
| Chart axis labels | `12` | `400` | `2%` | `var(--font-rubik), sans-serif` |
| Pill / badge labels | `10` | `400` | `4%` | `var(--font-rubik), sans-serif` |

These match `typography.caption` and `typography.metadata` respectively.

---

## Card Anatomy Checklist

Before shipping a new card, verify:

- [ ] Uses `CARD_BG`, `CARD_RADIUS`, `CARD_PAD` from shared constants
- [ ] Has `<CardHeader>` with a label and arrow (pass `onArrowTap` if action is wired)
- [ ] All font values come from `typography.*` tokens — no raw `fontSize` or `fontWeight`
- [ ] Accent colors come from `colors.ts` DLS 2 palette — no ad-hoc hex
- [ ] Text colors use the four DLS opacity tiers (0.9 / 0.7 / 0.5 / 0.3)
- [ ] Progress bar (if any) uses VALENTINO_500 fill, VALENTINO_50 track, `8px` tall
- [ ] Dividers are `rgba(0,0,0,0.05)` (OUTLINE_SUBTLE) and `1px`
- [ ] Status tag (if any) uses `DlsTag` or follows the intent table above
- [ ] CTA button (if any) is VALENTINO_500, max one per card
