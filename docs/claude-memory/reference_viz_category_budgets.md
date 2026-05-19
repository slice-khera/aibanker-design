---
name: Category budgets visualization
description: Passive viz showing per-category spending caps positioned inside their realistic range, with a "biggest cut" highlight.
type: reference
originSessionId: 7633999c-f2a3-4f38-a757-66b8ef1d6c12
---
# Category budgets (visualization)

Passive data display. Shows the new per-category cap alongside the user's current monthly spend, so the user can see at a glance whether each cap is reachable or requires a behavior change.

Component: `app/components/CategoryBudgetsViz.tsx`. Renders **flat on the chat surface** (no border, no shadow, no radius — visualizations are flat per the viz/widget taxonomy). Wraps in `<div style={{ padding: "4px 0 8px" }}>` only.

## Per-row layout
No bar. Each row is a single horizontal flex row, icon vertically centered against a 2-line center column, delta on the right also vertically centered.

Three-column structure:
1. **Leading (40×40):** circular icon from `CATEGORY_ICONS`, white background, 1px SLATE_30 border. Falls back to "Miscellaneous" icon.
2. **Center (flex 1):** stacks vertically with 2px gap.
   - Line 1: category name (TEXT_PRIMARY, bodyNormal).
   - Line 2: `{currentSpend} → {cap}` with a tertiary-colored arrow, full INR values (e.g. `₹9,000 → ₹8,000`), no k/L abbreviation. Caption, TEXT_TERTIARY.
3. **Trailing:** single line, vertically centered against the 2-line center, right-aligned. Delta amount (no sign — color carries direction):
   - Cut (`currentSpend > cap`): `₹X` in RED_400.
   - Headroom (`cap > currentSpend`): `₹X` in GREEN_500.
   - Equal: `No change` in TEXT_TERTIARY.
   - bodyNormal weight matches the category name so the row reads as `[name] ... [delta]` on the top baseline.

Vertical padding 14px top and bottom. Row gap 12px. Rows separated by whitespace only.

## Why no bar
Iterated through three bar designs — `BudgetBar` (% of cap), range-position bar (slider semantics in progress shape), shared-scale before/after bar with overhang — each created a different misreading because bar shapes default to "% of budget used." This viz isn't tracking; it's proposing a new cap. The today → cap arrow and color-coded delta carry the full message without a primitive that lies about the situation.

The `isBiggestCut` flag in the data model is currently unused by this viz — the absolute delta amount already surfaces magnitude (Transport's `₹2,000` is visibly larger than Food's `₹1,000`). Kept on the type for downstream uses (verdict copy, etc).

## Section header
"CATEGORY BUDGETS" uses `typography.metadata` (uppercase, TEXT_TERTIARY).

## Used in
- GBP (Goal-Budget Planning) flow, `spending-plan` phase — lands as Ryan's second message after the budget-summary viz.
- Playground: /playground/visualizations → "Category budgets".

## Data shape
```ts
type Plan = {
  categoryBudgets: {
    name: string;
    cap: number;          // the new commitment
    currentSpend: number; // user's current monthly spend on this category
    isBiggestCut?: boolean;
  }[];
};
```

## Reuse
Pairs with `budget-summary` viz but is independent. Could appear standalone in BudgetScreen as a pre-month preview, or in a refresh-session beat.
