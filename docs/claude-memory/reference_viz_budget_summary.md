---
name: Budget summary visualization
description: Passive viz showing the income/obligations/savings/daily-pool math used in the GBP flow.
type: reference
originSessionId: 7633999c-f2a3-4f38-a757-66b8ef1d6c12
---
# Budget summary (visualization)

Passive data display. Stacks the monthly money equation as four rows, **flat on the chat surface** (no border, no shadow, no radius — visualizations are flat per the viz/widget taxonomy):

```
+   Income           ₹82,000
−   Obligations      ₹28,318
−   Savings target   ₹12,000
———————————————————————————
=   Daily pool       ₹41,682   (bold)
```

Component: `app/components/BudgetSummaryViz.tsx`. Wraps in `<div style={{ padding: "4px 0 8px" }}>` only — same pattern as `SpendOverviewCard` and the other flat viz.

**Sign column** is 20px wide, color-coded: `+` GREEN_500, `−` RED_500, `=` TEXT_TERTIARY. Label uses TEXT_SECONDARY, amount uses TEXT_PRIMARY. The `= Daily pool` row uses `typography.headerH4` (bold); the three input rows use `typography.bodySmall`.

**Divider** between the input rows and the result row uses OUTLINE_SUBTLE, 1px tall, 4px margin top/bottom.

**Section header** "SUMMARY" uses `typography.metadata` (uppercase, TEXT_TERTIARY).

## Used in
- GBP (Goal-Budget Planning) flow, `spending-plan` phase — paired with category-budgets viz that follows.
- Playground: /playground/visualizations → "Budget summary".

## Data shape
```ts
type Plan = {
  income: number;
  obligations: number;
  savingsTarget: number;
  dailyPool: number;
};
```

## Reuse
This viz pairs with `category-budgets` but is independent — either can appear alone in a refresh-session "here's where you stand" beat or as a pre-month preview on the budget screen.
