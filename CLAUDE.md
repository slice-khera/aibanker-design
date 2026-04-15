# AI Banker v0.01 — Project Instructions

## Design Mode

When the user says **"design mode"**, follow these strict rules:

### Allowed
- Modify files in `app/components/`, `app/preview/`, and CSS/token files (`app/lib/colors.ts`, `app/lib/typography.ts`)
- Hardcode any data needed directly in preview fixtures or inline in components
- Reference existing mock data shapes from `app/data/mockProfiles.ts` and `app/data/flows.ts`
- Create new variant entries in `app/preview/registry.ts`

### Forbidden
- **Never** touch `app/page.tsx`, `app/api/`, `app/lib/` (except colors/typography), hooks, or state logic
- **Never** add API calls, state mutations, or hook changes
- **Never** modify data flow or business logic

### Workflow
1. Create named variants in the preview registry (e.g., `GoalTracker/ring-pct`, `GoalTracker/minimal`)
2. Each variant is a self-contained render with hardcoded data
3. Iterate on individual variants independently
4. Screenshot-verify every visual change via Playwright

## Finalize

When the user says **"finalize [Component/variant-name]"**:
1. Copy the winning variant's code into the real component file
2. Remove **all** variant entries for that component from `app/preview/registry.ts`
3. Delete any variant-specific component files if created
4. Clean up dead code — no stale branches, unused props, or orphaned functions

## Preview Route

`/preview` — Component isolation gallery for visual exploration.
- `/preview?component=GoalTracker` — shows all registered variants in a swipeable gallery
- Registry: `app/preview/registry.ts` — only active explorations live here
- Fixtures: `app/preview/fixtures.ts` — shared hardcoded prop data

## DLS 2.0

Always reference the DLS 2.0 memory files and `app/lib/colors.ts` for any frontend/UI work. Use design tokens, not raw hex values.

## Transitions

- Push left/right for flow navigation
- Slide up/down for presenting layers/overlays

---

## Behavioral Guidelines (Karpathy Rules)

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with verification checks.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
