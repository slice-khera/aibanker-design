# Chat Card Spec

Reference this document whenever building a new card widget. Every card in `ChatCards.tsx` must conform to these rules.

---

## Shell

Three shared constants. Every card uses all three — no exceptions.

```ts
const CARD_BG = "#eef2f5";
const CARD_RADIUS = 20;       // px
const CARD_PAD = "16px 18px"; // vertical · horizontal
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
| Label style | `typography.caption` + `textTransform: uppercase` + `color: rgba(0,0,0,0.4)` |
| Arrow container | `30×30` circle, `rgba(0,0,0,0.06)` background |
| Arrow icon | `13×13` SVG, stroke `rgba(0,0,0,0.45)`, `strokeWidth: 1.6` |
| Arrow fade transition | `opacity 300ms ease` |
| Row bottom margin | `10px` |

---

## Typography Hierarchy

Cards follow a consistent two-level reading order. Use the tokens from `typography.ts` — never raw font values.

### Level 1 — Primary value

The most important piece of information. Two variants depending on card type:

- **Amount-first cards** (Spend Overview, Investment Product): `typography.headerH1` — 32px / 500 weight
- **Name-first cards** (Goal Progress, Savings Plan): `typography.headerH4` — 16px / 500 weight

Color: `rgba(0,0,0,0.9)`

### Level 2 — Subtitle / signal text

Context for the primary value. Always `typography.caption` (12px / 400 weight). Color varies by semantics — see Signal Colors below.

### Level 3 — Key-value rows

For detail rows (e.g. "Rate · 7.25%", "Monthly · ₹8,500"):

| Side | Token | Color |
|---|---|---|
| Label (left) | `typography.caption` | `rgba(0,0,0,0.45)` |
| Value (right) | `typography.buttonSmall` | `rgba(0,0,0,0.85)` |
| Positive value | `typography.buttonSmall` | `#16a34a` |

### Level 4 — Micro-labels

For labels above values in footers (e.g. "PAYING FROM"). `typography.metadata` + `textTransform: uppercase` + `color: rgba(0,0,0,0.35)`.

---

## Color System

### Surfaces

| Use | Value |
|---|---|
| Card background | `#eef2f5` |
| White inset (icon circles, etc.) | `#ffffff` |

### Text opacity scale

| Role | Value |
|---|---|
| Primary text | `rgba(0,0,0,0.9)` |
| Secondary text | `rgba(0,0,0,0.85)` |
| Labels / secondary | `rgba(0,0,0,0.45)` |
| Header label / muted | `rgba(0,0,0,0.4)` |
| Micro-labels | `rgba(0,0,0,0.35)` |

### Accent colors — semantic, not decorative

| Color | Hex | Belongs to |
|---|---|---|
| Brand magenta | `#D30AD7` | Goals, progress bars, active chips, CTAs |
| Violet | `#7c3aed` | Spend analytics — chart lines, area fills, timeline pills |
| Green | `#16a34a` | Positive signals: interest rates, ahead-of-pace, success states |
| Amber | `#f59e0b` | Neutral / warning: on-track status |
| Red | `#ef4444` | Negative signals: behind pace, over budget |
| Orange | `#e67e22` | Spend comparison delta (slightly over average) |

**The magenta / violet distinction is load-bearing.** Violet belongs to *understanding spend*. Magenta belongs to *taking action or tracking goals*. Never use violet for a goal progress bar, never use magenta in a spend chart.

### Dividers

```ts
{ height: 1, backgroundColor: "rgba(0,0,0,0.07)" }
```

All dividers use the same opacity. Do not vary it.

### Track backgrounds (progress bars, bar rows)

```ts
backgroundColor: "rgba(0,0,0,0.07)"
```

Same value as dividers — intentional, keeps the palette minimal.

---

## Progress Bars

Single dominant progress bar (Goal Progress, Savings Plan):

| Property | Value |
|---|---|
| Height | `7px` |
| Track | `rgba(0,0,0,0.07)`, `borderRadius: 4`, `overflow: hidden` |
| Fill | `#D30AD7` (always magenta for goals) |
| Fill radius | `borderRadius: 4` |

Per-row category bars (Category Breakdown) are a distinct element — `6px` tall, `borderRadius: 3` — because they repeat in a list and need to be visually lighter.

---

## Status / Context Pills

A one-line verdict pill at the bottom of a card. Used for goal status and plan timelines.

```ts
padding: "5px 12px"
borderRadius: 14
typography.caption
```

| Status | Background | Text |
|---|---|---|
| Ahead | `rgba(22,163,74,0.10)` | `#16a34a` |
| Behind | `rgba(239,68,68,0.10)` | `#ef4444` |
| On track | `rgba(245,158,11,0.10)` | `#f59e0b` |
| Timeline / neutral | `rgba(124,58,237,0.08)` | `#7c3aed` |

---

## Toggle Chips (Amount Selectors)

Used when offering a set of discrete options (e.g. investment amounts). One row, horizontally laid out.

```ts
padding: "10px 20px"
borderRadius: 24
border: 1.5px solid
typography.buttonSmall
```

| State | Border | Text | Background |
|---|---|---|---|
| Selected | `1.5px solid #D30AD7` | `#D30AD7` | `transparent` |
| Unselected | `1.5px solid rgba(0,0,0,0.08)` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.03)` |

Transition: `all 150ms ease`

---

## CTA Button

One per card maximum. Always bottom-right, paired with a footer label on the left. Disappears (fades out) once the action is completed.

```ts
typography.buttonNormal
padding: "14px 36px"
borderRadius: 28
backgroundColor: "#D30AD7"
color: "#fff"
border: none
```

Fade-out transition: `opacity 300ms ease`

---

## Spacing Reference

| Context | Value |
|---|---|
| Card padding | `16px 18px` |
| Header bottom margin | `10px` |
| Between primary value and subtitle | `3–4px` |
| Between subtitle and next section | `14–20px` |
| Between detail rows | `10px` |
| Between category rows | `18px` |
| Divider bottom margin | `12–16px` |
| Category icon size | `44×44` |
| Category icon gap to content | `12px` |

The slight variation in margins (e.g. 3px vs 4px, 14px vs 20px) reflects visual rhythm tuning per card — not inconsistency. When in doubt, use the larger value.

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
- [ ] Accent color choice follows the magenta / violet semantic rule
- [ ] Progress bar (if any) uses `#D30AD7` and is `7px` tall
- [ ] Dividers are `rgba(0,0,0,0.07)` and `1px`
- [ ] Status pill (if any) follows the color table above
- [ ] CTA button (if any) is `#D30AD7`, bottom-right, max one per card
