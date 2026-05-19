---
name: Visualizations are flat, never chromed
description: Visualizations must render flat on the chat surface — no border, no shadow, no radius. Card chrome is for widgets only.
type: feedback
originSessionId: 7633999c-f2a3-4f38-a757-66b8ef1d6c12
---
Visualizations render **flat on the chat surface** — no border, no shadow, no radius, no enclosing card chrome. Only padding for breathing room (the existing pattern is `<div style={{ padding: "4px 0 8px" }}>`).

**Why:** The viz vs widget taxonomy ([reference_viz_widget_taxonomy.md](reference_viz_widget_taxonomy.md)) defines this as the core distinction — visualizations are passive data displays flat on surface, widgets are actionable items inside a bordered container. Wearing card chrome on a passive viz blurs the line and contradicts the agreed rule. The user has called this out twice now after I broke it.

**How to apply:** When creating or auditing any visualization (anything in `/playground/visualizations`, or anything passive/read-only that lands inside a chat surface), check it has NO `CARD_BORDER`, `CARD_RADIUS`, `CARD_SHADOW`. Match the existing pattern from `SpendOverviewCard` at [ChatCards.tsx:382](app/components/ChatCards.tsx:382) — just `<div style={{ padding: "4px 0 8px" }}>` (or similar light padding). Card chrome is reserved for widgets (`investment-product`, `add-to-pot`, `goal-progress`, `confirm-list`).

Do NOT rationalize keeping chrome by pointing to other code that already wears it — verify by reading the canonical viz like `SpendOverviewCard` first.
