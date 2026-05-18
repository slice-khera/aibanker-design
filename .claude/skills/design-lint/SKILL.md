---
description: Audit and fix DLS 2.0 token compliance across the pipeline (DLS → Components → Screens → Flows). Run before commits or after adding new components.
---

# Design lint

Run a full consistency sweep across the codebase to ensure DLS tokens are used everywhere instead of raw values, shared components are imported (not reimplemented locally), and dead code is cleaned up.

## Pipeline order

Check consistency flowing forward through: **DLS → Viz/Widgets/Components → Screens → Flows → Main App**

## What to check

### 1. DLS token compliance

Scan all `.tsx` files under `app/components/`, `app/preview/`, and `app/(main)/` for:

**Colors** — replace raw values with tokens from `app/lib/colors.ts`:
- `#fff` / `#ffffff` → `BG_PRIMARY`
- `#d30ad7` → `VALENTINO_500`
- `rgba(0,0,0,0.05)` → `ALPHA_BLACK_05` or `OUTLINE_SUBTLE`
- `rgba(0,0,0,0.1)` → `ALPHA_BLACK_10` or `OUTLINE_BOLD`
- `rgba(0,0,0,0.2)` → `ALPHA_BLACK_20` or `TEXT_DISABLED`
- `rgba(0,0,0,0.3)` → `ALPHA_BLACK_30` or `BG_OVERLAY`
- `rgba(0,0,0,0.4)` → `ALPHA_BLACK_40`
- `rgba(0,0,0,0.5)` → `ALPHA_BLACK_50` or `TEXT_TERTIARY`
- `rgba(0,0,0,0.7)` → `ALPHA_BLACK_70` or `TEXT_SECONDARY`
- `rgba(0,0,0,0.9)` → `ALPHA_BLACK_90` or `TEXT_PRIMARY`

**Border radius** — replace with tokens from `app/lib/radii.ts`:
- `borderRadius: 8` → `RADIUS_S`
- `borderRadius: 16` → `RADIUS_M`
- `borderRadius: 24` → `RADIUS_L`
- `borderRadius: 64` → `RADIUS_PILL`
- `borderRadius: 100` → `RADIUS_CIRCLE`

**Rules:**
- Do NOT modify `app/lib/colors.ts` or `app/lib/radii.ts` (token definitions)
- Do NOT create new tokens — only use existing ones
- Do NOT replace values inside `boxShadow`, `textShadow`, `filter`, or gradient strings
- Do NOT replace SVG `fill`/`stroke` string attributes
- Do NOT replace Tailwind classes
- Do NOT replace values that don't have an exact matching token
- Prefer semantic tokens over raw alpha tokens when the context matches (e.g., use `TEXT_PRIMARY` over `ALPHA_BLACK_90` for text color)

### 2. Component reuse

Check that components in `app/components/` are imported — not reimplemented locally in sims or flows:
- `PersonaToggle` — should be imported from `app/components/PersonaToggle.tsx`
- `GoalTracker` — should be imported from `app/components/GoalTracker.tsx`
- `AppChrome` (StatusBar, AppBar, etc.) — should be imported from `app/components/AppChrome.tsx`
- `QuestionnaireOverlay` — should be imported from `app/components/QuestionnaireOverlay.tsx`
- `PlanCruncherV2` — should be imported from `app/components/PlanCruncherV2.tsx`

Flag any local function that duplicates a shared component.

### 3. Dead code

- Find files in `app/preview/` that are not imported by any playground page or flow
- Find unused imports in component files
- Flag orphaned fixture files

## Output

1. Report findings grouped by category (tokens, reuse, dead code)
2. Ask the user before making fixes
3. Commit each category separately for easy rollback
4. Run `npx tsc --noEmit` after each commit to verify

## Recording a pass (for the playground chip)

When the user asks you to lint a specific playground item (e.g., "run design-lint on plan-cruncher-v2") **and the item passes cleanly with zero findings**, record the pass so the playground chip flips to `confirmed`:

1. Read `app/preview/_shared/lint-passes.json`.
2. Add or replace the entry: `"<id>": "<current ISO timestamp>"`.
3. Write the file back.
4. Run `node scripts/scan-playground-status.mjs` to regenerate `status-generated.ts`.

The id must match one defined in `app/preview/_shared/integration-manifest.json`. If the item is already `integrated` (its symbol is used in real app code), the lint pass is still recorded but the chip stays `integrated` — code wins over confirmation.

Any subsequent edit to the item's source files invalidates the pass automatically (the scan compares file mtimes against `lintedAt`), so the chip drops back to `exploring` until you re-lint.
