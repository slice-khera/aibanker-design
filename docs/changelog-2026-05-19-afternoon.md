# What changed since the morning push: 2026-05-19 afternoon

Everything that landed on `main` *after* the 10:38 AM push (`f11d42d Add 48-hour changelog`). Ten commits in total, made between 12:58 PM and 2:45 PM IST.

This document exists because the afternoon work was first pushed to GitHub in one unintended batch at 2:13 PM, then rolled back, then re-pushed cleanly along with this doc. The doc itself sits in the history *before* the work it describes (a quirk of the rollback), but everything listed here is on `main` right now.

## TL;DR

The afternoon was almost entirely about the **spending-plan flow** and the **playground**. The standalone `SpendingPlanCard` and `SavingsLadder` were both retired; their jobs are now done by the overlay system and by two new flat visualizations on the chat surface. The widgets / screens / components playground gained the missing pay screen, fixed several "looks broken" interactions, and stopped reusing stale state across variants. The Ryan chip's pulsing-alert animation, which had been spec'd but never actually rendered on `PayScreen`, finally fires. Plus a date-format standardization pass across the entire app, a `BudgetScreen` viz tightening, removal of the AI disclaimer from the feedback bar, and a Refresh-Session simplification (one variant only, "Roast me" replaces "Save taxes" / "Surprise me", mosaic restructured to a 2×2 grid).

---

## 1. Spending plan flow: card → two flat visualizations

This is the headline change. The `SpendingPlanCard` chrome (a single bundled card with rows inside it) is gone. In its place, the Goal-Budget Planning (GBP) flow sends **two sequential Ryan messages** in the spending-plan phase, each rendering as a flat visualization on the chat surface per the viz/widget taxonomy (no card chrome).

### 1.1 `BudgetSummaryViz` (`7dfcd77`)
Income / obligations / savings / daily-pool math, four rows, rendered flat on the surface. Speccd in `reference_viz_budget_summary.md`.

### 1.2 `CategoryBudgetsViz` (`7dfcd77`)
Per-category caps shown against current spend, with a color-coded delta:
- **Red** when the cap is a cut from where you're currently spending.
- **Green** when the cap leaves headroom.
- **Grey** when the cap matches current spend (no change).

Replaces `rangeMin / rangeMax` on the `CategoryBudget` type with a single `currentSpend` value so the viz can show *today → cap* honestly. Speccd in `reference_viz_category_budgets.md`.

### 1.3 New design rule: flat visualizations have no chrome
The taxonomy distinction (visualizations sit flat on the surface; widgets are enclosed and actionable) was codified as a memory rule: `feedback_viz_flat_no_chrome.md`. This is why both new visualizations render without a card wrapper.

### 1.4 Retire `SavingsLadder` (`622772c`)
`SavingsLadder` was an older inline component from before the overlay-nav system existed. The savings-tier question is now asked via `QuestionnaireOverlay` (following the overlay-nav rules) and the standalone component is deleted. The tier question moved into a shared fixture (`savingsTierQuestion.ts`) so the playground and the flow sim import the same config.

---

## 2. Pay screen and the Ryan chip alert pulse (`f2b97e7`)

The purple pay screen is the home surface of the live app, but it was missing from the screens playground gallery. Added.

More importantly: the documented "two-halo pulse" alert state on the Ryan chip was spec'd but never actually rendered. `PayScreen` accepted an `animate` prop but did nothing with it. `PayScreen` now delegates its first pill to `AIBankerChip`, so the pulse fires automatically anywhere `PayScreen` is mounted with `animate=true` — most importantly the onboarding sim's "Ryan is ready" moment, which had been a silent no-op.

This is now the canonical alert state — captured in `feedback_ai_banker_alert_pulse.md`: pulse halo on the Ryan chip *is* the alert, never use a separate badge or dot.

---

## 3. Playground fixes

Three bugs in the playground that made cards look broken when reviewing them:

### 3.1 Widgets weren't interactive (`084b858`)
The obligations list and the investment product looked broken in the widgets playground: the "Looks right" submit CTA never appeared, and "Set up" was a dead click. `ChatCard` correctly requires callbacks for these actions (production screens inject them at render time), but the widgets page was rendering raw fixture data with no callbacks attached. Added a small `InteractiveWidgetFixture` wrapper that injects local-state callbacks per card type (`confirm-list → onSubmit`, `investment-product → onContinue`, `add-to-pot → onAdd`). Mirrors the `FootprintCard` pattern already on the components page.

### 3.2 Variants kept stale state (`0b47ec8`)
Switching variants in the playground reused the same component instance, so any child relying on `useState(prop)` for initial state kept its old value (e.g. `AddToPotCard`'s Activated state failed to render after switching from Default). Including `activeVariantIndex` in the playground's children key forces a remount on every variant change. Matches the existing reset behavior and immunizes the playground against this whole bug class.

### 3.3 Missing items + jump-to-recent pill (`dc59bca`)
Items that existed in the codebase but weren't surfaced in the playground are now listed. The onboarding sim's "jump to recent" pill (the affordance that scrolls you to the most recent state) was also fixed.

---

## 4. `BudgetScreen` viz tightening (`657555d`)

Spacing and information-hierarchy pass on the budget visualization:

- **Pacing chip** promoted back above the headline. Hidden when the user is over-budget.
- **Date label** moved under the amount as `MAY '26 · MONTHLY BUDGET` metadata.
- **Spent / Budget two-column split** dropped — that information is already encoded by the bar itself.
- **Goal card**: replaced the `GOAL` superlabel with the actual end-date (`DEC 2026`).
- **Pool card**: dropped the redundant `POOL` superlabel.
- **Categories**: sliced to top 3 for demo clarity.
- **Padding**: bumped to DLS L (24px) around the divider, M (16px) between rows.

---

## 5. Date format standardization (`bcb977f`)

Date labels across the app had drifted into mutually inconsistent shapes (`28 Feb' 25`, `26 Feb 2026`, `Mon Feb 28`, `Dec 2026`, etc). Introduced `app/lib/format-date.ts` as the single source of truth with three context-driven forms:

- **short** — `4 Jun '26`
- **day-only** — `4 Jun`
- **month** — `Jun '26`

Plus a range formatter that elides duplicate year / month when both sides match (so a same-year range collapses sensibly). Every UI date label was swept to the new form, and the weekday prefix that only existed on receipts is gone.

This is the rule going forward: `D MMM 'YY`, sentence case, no weekday prefixes.

---

## 6. Drop the "Ryan is AI and can make mistakes" disclaimer (`a02e2ea`)

The AI disclaimer caption is gone from `FeedbackBar` and from every sim that had hand-rolled its own copy of it (Refresh Session V1/V2, Degen Mode V1, Reddit V1/V2). The now-unused `voice` and `showDisclaimer` props on `FeedbackBar` are removed, the shared `DISCLAIMERS` fixture is deleted, and the DLS spec for the feedback bar (`reference_dls_feedback_bar.md`) is updated to match.

---

## 7. Refresh-Session simplification + "Roast me" (`83d892c`)

The Refresh Session flow had two parallel variants (V1 and V2) that the team had to keep in sync. V1 is retired; V2 is now the only Refresh-Session variant. The V2 popover also got a copy + interaction refresh:

- **`RefreshSessionSimV1.tsx` deleted.** V2 is the single source of truth.
- **V2 chrome**: swap the plus icon for `placeholder.svg` inlined with `TEXT_PRIMARY` fill; switch to the `degen` `ChatAppBar` so the Ryan / Byron persona toggle sits in the header.
- **"Roast me" replaces "Save taxes" + "Surprise me"** as the single quick-action in the V2 popover, in `Chat.tsx`'s on-track mosaic, and in the `DegenModeSimV1` mosaic.
- **Mosaic restructure**: the on-track mosaic moves from the older "tall card + two stacked halves" layout to a clean 2×2 grid.

Integration manifest and the relevant docs are updated to reflect the single-variant flow.

---

## File-level inventory

Across all ten commits: roughly 45 files touched, balancing additions and deletions (the bulk of deletions come from removing `SpendingPlanCard`, `SavingsLadder`, and `RefreshSessionSimV1`).

**New components**
- `app/components/BudgetSummaryViz.tsx`
- `app/components/CategoryBudgetsViz.tsx`

**Deleted components**
- `app/components/SavingsLadder.tsx`
- `app/components/SpendingPlanCard.tsx`

**New utilities / fixtures**
- `app/lib/format-date.ts`
- `app/preview/fixtures/savingsTierQuestion.ts`

**New design-system memory**
- `docs/claude-memory/feedback_viz_flat_no_chrome.md`
- `docs/claude-memory/feedback_ai_banker_alert_pulse.md`
- `docs/claude-memory/reference_viz_budget_summary.md`
- `docs/claude-memory/reference_viz_category_budgets.md`

**Updated**
- `BudgetScreen`, `Chat`, `ChatCards`, `FeedbackBar`, `PayScreen`
- Every playground page (`components`, `screens`, `widgets`, `visualizations`)
- Every sim that referenced the AI disclaimer (`OnboardingSim`, `DegenModeSimV1`, `RedditSimV1/V2`, `RefreshSessionSimV1/V2`)
- `app/lib/types.ts`, `app/lib/financial-data.ts`, `app/lib/gbp-logic.ts`, `app/lib/debug-fixtures.ts`
- `app/data/userStatePresets.ts`
- `app/preview/_shared/PlaygroundCard.tsx`, `integration-manifest.json`, `lint-passes.json`, `status-generated.ts`
- `app/preview/fixtures/gbpFlowFixture.ts`, `wrappedFixture.ts`
- `docs/claude-memory/MEMORY.md`, `reference_dls_feedback_bar.md`

---

## Commit list (oldest → newest, by author time)

Note: hashes below are the *original* commit hashes from when the work was authored. Because the work was rolled back and re-applied, the hashes you see on `main` today are different (cherry-picks). The content is identical.

| Original hash | Time | Message |
|------|------|---------|
| `622772c` | 12:58 | Retire SavingsLadder, use QuestionnaireOverlay for tier picker |
| `f2b97e7` | 13:21 | Add pay screen to playground + wire Ryan chip alert pulse |
| `a02e2ea` | 13:22 | Remove "Ryan is AI and can make mistakes" disclaimer from feedback bar |
| `bcb977f` | 13:23 | Standardize date formats to D MMM 'YY across the app |
| `657555d` | 13:23 | Tighten BudgetScreen viz: bring back pacing chip, rework subtext, loosen spacing |
| `0b47ec8` | 13:27 | Remount playground children when variant changes |
| `084b858` | 13:48 | Wire callbacks into widgets playground so cards are actually interactive |
| `dc59bca` | 14:11 | Surface missing playground items + fix onboarding jump-to-recent pill |
| `83d892c` | 14:20 | Drop refresh-button sim variant and shorten Ryan capability list |
| `7dfcd77` | 14:45 | Split spending plan card into two flat visualizations |
