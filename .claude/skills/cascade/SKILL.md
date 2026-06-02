---
description: Propagate a confirmed design change (DLS token, component, viz/widget, screen, flow, or copy) across the entire codebase. Use when the user has just approved a change in one place and wants it reflected everywhere else without re-explaining scope.
---

# Cascade

Take a confirmed change at one layer of the design system and ripple it through every downstream reference in the codebase. The user is a designer — they should not have to spell out the blast radius each time.

## Source of truth

`.md` files are the source of truth. Always update the relevant `.md` spec first, then sync `.ts`/`.tsx` to match. Never edit code before the spec.

## Pipeline layers

Changes cascade forward through this order. Identify which layer the confirmed change lives at, then walk forward only — never backward.

**DLS tokens → Components → Visualizations/Widgets → Screens → Flows → Main app**

| Change at | Cascade reaches |
|---|---|
| DLS token | token `.md` + `app/lib/*.ts`, every component spec citing it, every viz/widget, every screen, playground swatches |
| Component | component `.md` + `app/components/<Name>.tsx`, playground entry, every screen/flow using it, preview route variants |
| Viz / widget | its `.md` + `.tsx`, `reference_viz_widget_taxonomy.md` if classification shifts, playground, any screen embedding it |
| Screen | screen `.md` + `.tsx`, flows that include it, preview route, transitions |
| Flow | flow `.md`, screens it composes, navigation/overlay rules |
| Copy / voice | `reference_copy_voice.md`, every string instance in screens, chat sim streamed messages, playground labels |

## Procedure

### 1. Identify the change

Read the most recently confirmed change from the conversation. The user invoked `/cascade` because something just got approved.

If the change is ambiguous (multiple recent edits, unclear which is "confirmed", or scope spans layers), **stop and ask** before doing anything: "I see X and Y were both touched recently — which am I cascading from, and is the source spec the `.md` or the `.tsx` I should pull from?"

### 2. Classify the layer

Determine which row of the table above the change lives at. If the change is a multi-component composition on a screen, treat the **screen** as the source and reconcile component usages against it.

### 3. Confirm the blast radius

Always show the user the proposed blast radius before writing anything:

- List every file that will be touched, grouped by layer.
- For each, one-line note on what changes.
- End with: "Proceed, or scope this down?"

Wait for explicit go-ahead. If they scope down, narrow the file list and re-confirm.

### 4. Update the `.md` source first

Edit the spec `.md` to reflect the confirmed change. This is the canonical record.

### 5. Cascade to downstream files

Edit every file in the confirmed blast radius. Use `grep` / `Edit` — never `Write` over a whole file unless creating new.

Honor these standing rules at every edit site:

- **DLS tokens only** — never raw hex, never raw px values that have a token. Pull from `app/lib/colors.ts`, `app/lib/radii.ts`, etc.
- **Reuse, never recreate** — if a component already exists, import it. Do not duplicate logic.
- **Sentence case** for UI labels. Never Title Case.
- **`typography.metadata` renders UPPERCASE** — source strings stay sentence case.
- **No em dashes** in code, copy, or `.md`.
- **"slice"** and slice product names (monies, sparks, slice in 3) are always lowercase.
- **Never substitute assets** — if a referenced asset is missing, stop and ask.
- **Single overlay slot** — X for entry, back for deeper, no stacking.
- **Push left/right for nav, slide up/down for overlays.**
- **ShadCN chrome stays brand-neutral** — no DLS tokens, no raw hex, no inline styles in chrome UI.

### 6. Verify

Run all three, in order:

1. `npx tsc --noEmit` — must pass.
2. The `design-lint` skill — must report zero findings on touched files.
3. Playwright screenshot every affected screen via the preview route. Use the port from `.env.local` (set by `./scripts/dev.sh`). Start the dev server with `./scripts/dev.sh` if it is not already running.

If any step fails, fix the underlying cause and re-run. Do not skip.

### 7. Report

Output a final summary grouped by layer:

```
DLS:
  - <file>: <one-line change>
Components:
  - <file>: <one-line change>
Screens:
  - <file>: <one-line change>
Verification:
  - tsc: ✓
  - design-lint: ✓
  - screenshots: <N> screens captured
```

Flag anything that could not be auto-resolved at the bottom.

## Invocation shapes

- `/cascade` — use the last confirmed change in conversation
- `/cascade <thing>` — explicit subject, e.g. `/cascade button radius` or `/cascade pay screen`
- `/cascade --dry-run` — show the blast radius and proposed edits only, no writes

## What NOT to cascade

- Work-in-progress edits the user has not explicitly confirmed
- Anything that would change `app/lib/colors.ts` or `app/lib/radii.ts` token definitions themselves (those are owned by the user; flag for review instead)
- Chrome UI styling (ShadCN defaults stay untouched)
- Anything where the source spec `.md` does not yet exist — stop and ask the user to define it first
