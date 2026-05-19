---
name: Never recreate - always reuse existing components
description: Must search for and reuse existing components before writing any new UI - the #1 recurring mistake
type: feedback
---
Never recreate UI from scratch when an existing component already does the job.

**Why:** Corrected 3+ times. Rebuilding from scratch (chat UI, cards, app bars) always produces visual/behavioral deviations caught via screenshots.

**How to apply - mandatory checklist before writing any UI:**
1. Search `app/components/` for an existing match
2. Read its props interface
3. If a match exists - import and use it, pass hardcoded props
4. If a partial match exists - adapt via props/slots, never fork or rebuild
5. If no match exists - stop and tell the user before building anything new
6. When wrapping a component in a new context, the wrapper handles layout only - the inner component renders as-is
