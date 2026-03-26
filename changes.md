# Changelog — Last 18 Hours (26 Mar 2026)

All changes made since the evening of 25 Mar 2026. No commits were created — all changes exist as unstaged diffs against the last commit (`7d588ce`).

---

## Files Changed

| File | Type of Change |
|------|---------------|
| `app/components/ChatCards.tsx` | Major — new card type, redesigned card, bug fixes, visual polish |
| `app/page.tsx` | Major — new debug fixtures, month standardisation, new card wiring |
| `app/components/MyMoney.tsx` | Minor — month label standardisation |

---

## 1. Bug Fixes

### Spend Overview — month tap not working
The month labels below the spend overview chart (Sep, Oct, Nov, etc.) were rendered as plain `<span>` elements with no `onClick` handler. Only dragging on the SVG worked. Added `onClick={() => setActiveIndex(i)}` to each inactive month label.

### Spend Overview — text case inconsistency
Unselected months used `typography.caption` (sentence case) while the selected month used `DlsTag` (uppercase). Changed unselected months to use `typography.metadata` with `textTransform: "uppercase"` to match.

---

## 2. Colour Coding — Insight Line (3rd Line of Text)

The comparison text below the main amount (e.g. "17% higher than your average") was previously hardcoded to orange (`#ff9a17`) in all cases. Now dynamically colour-coded:

- **Green** (`#00a63e`) — at or below average (spending less)
- **Orange** (`#ff9a17`) — up to 15% over average
- **Red** (`#ce1d26`) — more than 15% over average

Applied to: **Spend Overview**, **Category MoM**, **Spend Trend**.

### Spending Heatmap — insight line colour
"Highest spends on Saturdays" changed from neutral grey to Valentino/500 (`#d30ad7`) since it's an insight/callout, not a neutral descriptor.

---

## 3. Month Name Standardisation

All month references across all cards and data fixtures standardised to 3-letter format:

| Before | After |
|--------|-------|
| `"February"` | `"Feb"` |
| `"March 2026"` (MyMoney) | `"Mar 2026"` |

**Files affected**: `page.tsx` (7 occurrences of `month: "February"` → `"Feb"`), `MyMoney.tsx` (1 occurrence).

---

## 4. Transaction List — Dividers Removed

Removed `borderBottom` dividers between list item rows in both the **Transaction Table** and **Big Expenses** cards, giving a cleaner look.

---

## 5. Category Breakdown — Subtext Update

Changed the 3rd line from static `"Top 5 categories + other"` to `"across 12 categories"` to reflect the actual total number of categories, not just the 5 shown.

---

## 6. New Card Type: `spend-trend`

A new bar chart visualisation that shows the same monthly spend data as the line-chart spend overview, but as vertical bars.

### Type definition added
```typescript
{ type: "spend-trend"; variant?: CardVariant; month: string; chartData: { label: string; value: number }[]; average: number; highlightIndex: number }
```

### Visual design
- Vertical bars: Valentino/500 (`#d30ad7`) for active month, Valentino/50 (`#fae2fa`) for others
- Dashed average line overlay
- Y-axis labels (left-aligned, rounded to nearest ₹1k/₹10k)
- HTML month labels below (caption style, bold for selected)
- Interactive: tap a bar or label to select it, tap empty area to reset to default
- Header updates dynamically: title, amount, comparison text with colour coding

### Debug panel
Added "Trend" button next to existing MoM "V1" button. Uses same chart data as spend overview fixture.

---

## 7. Category MoM Card — Complete Redesign

The month-over-month comparison card was redesigned while keeping the grouped vertical bar chart format.

### Before (problems)
- Legend rendered as SVG text inside the chart (inconsistent)
- Horizontal grid lines cluttered the view
- Category labels rendered as SVG text (truncated at 8 chars)
- No interactivity
- Each category had its own colour for both bars (rainbow of colours)
- Y-axis labels were right-aligned/indented

### After
- **Legend**: HTML, below the chart, `typography.caption` (sentence case), rounded square swatches
- **Grid lines**: Removed — only 3 Y-axis labels remain (₹0, mid, max)
- **Y-axis labels**: Left-aligned to match header text, rounded to nearest ₹1k
- **Category labels**: HTML with `flex: 1`, `typography.caption`, properly centered under bar groups
- **Bar colours**: Valentino/50 (`#fae2fa`) for last month, Valentino/500 (`#d30ad7`) for this month — consistent across all categories
- **Unselected state**: Full opacity for all bars, lowered opacity (0.3) when a specific category is selected
- **Header**: Changed from "Month-over-month" to "{thisMonth} spends" so the 3 lines read as a narrative: "Feb spends → ₹66,000 → 2% more than Jan"

### Interactivity (new)
- Tap any category label or bar pair to select it
- Header updates to: "Feb {category} spends" (lowercase), shows that category's amount and % change vs last month
- Other bars fade to 30% opacity
- Selected label becomes bold/dark
- Tap anywhere else on the card (header, empty space, legend) to deselect back to total view

### Layout improvements
- `padL` reduced from 48 → 32, `padR` reduced from 8 → 0 to use full card width
- SVG viewBox widened from 280 → 320 for more breathing room between category groups
- Category labels no longer truncated (threshold raised from 8 → 10 chars, and wider SVG means names fit)

---

## 8. DLS Consistency Audit — Fixes Applied

### Non-DLS red colour replaced
`#d92d20` → `#ce1d26` (DLS Red/500) in 3 locations across spend-overview, category-mom, and spend-trend.

### Title line typography standardised
Spending Heatmap and Payment Mode Donut cards used `typography.bodySmall` with `rgba(0,0,0,0.7)` for the title line. Changed to `typography.caption` with `rgba(0,0,0,0.5)` to match all other cards (4 occurrences: surface + card variants of both).

---

## 9. Other `page.tsx` Changes (pre-existing, not from this session but unstaged)

These changes were already in the working tree and are part of the overall diff, but were not made in this session:

- **New debug fixtures**: Added `DBG_MERCHANT_BAR`, `DBG_CATEGORY_MOM`, `DBG_HEATMAP`, `DBG_DONUT_V2`, `DBG_TXN_TABLE`, `DBG_OBLIGATIONS_V2`, `DBG_BIG_EXPENSES` for all card types in the debug panel
- **Debug panel expansion**: Added rows for Merchants, Heatmap, Donut, Txn List, Onboard (Oblig + Big Exp)
- **Card variant**: All cards now render in `"surface"` variant by default (no card background)
- **Obligation + Big Expense detail sheets**: New bottom sheet UI for tapping into obligation/expense items
- **Conversation memory**: Added fire-and-forget POST to `/api/memory/conversation` after assistant responses
- **Goal onboarding**: Consolidated 3 separate messages into 1, reduced setTimeout nesting
- **Processing glow**: Re-enabled `onProcessingStateChange` handler
- **Restart**: Now opens chat overlay on restart

---

## Summary of Visual Changes at a Glance

| What | Before | After |
|------|--------|-------|
| Month labels | "February", "March 2026" | "Feb", "Mar 2026" |
| Insight line colour | Always orange | Green/orange/red based on % |
| Heatmap insight | Grey | Valentino/500 |
| MoM bars | Rainbow per-category | Valentino/50 + Valentino/500 |
| MoM legend | SVG text, above chart, uppercase | HTML, below chart, sentence case |
| MoM grid lines | 5 horizontal lines | Removed |
| MoM axis labels | Right-aligned, precise amounts | Left-aligned, rounded (₹13k) |
| MoM interactivity | None | Tap category to drill down |
| MoM title | "Month-over-month" | "{month} spends" |
| Spend Trend | New card type | Vertical bars + average line |
| Transaction dividers | 1px between rows | Removed |
| Category subtext | "Top 5 categories + other" | "across 12 categories" |
| Title typography | bodySmall in 2 cards | caption everywhere |
| Red colour token | #d92d20 (non-DLS) | #ce1d26 (DLS Red/500) |
