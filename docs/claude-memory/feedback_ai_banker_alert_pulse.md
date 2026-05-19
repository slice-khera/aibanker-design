---
name: AI banker chip alert state is always the pulsing halo
description: The two-halo pulse on the Ryan/Byron chip is the confirmed design for ANY alert state on the chip - never use a separate badge, dot, or color change for "needs attention"
type: feedback
originSessionId: 95beaefc-97a4-4444-93be-a49c652cb022
---
The pulsating double-halo animation on the AI banker chip (spec'd in `reference_dls_ai_banker_chip.md`) is the canonical alert treatment. The pulse IS the alert signal - no separate dot badge, count badge, or color override is needed when Ryan/Byron needs the user's attention.

**Why:** Confirmed by the user on 2026-05-19 after seeing the playground "Ryan is ready" variant. The animation has been spec'd, prototyped in the standalone `AIBankerChip` component, and approved as the only "needs attention" treatment for this surface. Going forward, any code path that previously thought about a notification dot, a count, or a color swap on the Ryan chip should use `state="alert"` on `AIBankerChip` (or the equivalent `animate` prop on `PayScreen`) instead.

**How to apply:**
- Whenever rendering the Ryan/Byron entry chip in an "attention needed" moment (onboarding ready, retry/error needing a re-tap, fresh insight to surface), use the pulse - not a dot, not a badge, not a new color.
- The `AIBankerChip` component at `app/components/AIBankerChip.tsx` already implements this correctly. `PayScreen` should delegate its first pill to `AIBankerChip` rather than re-implementing the chip - so the pulse and any future chip-state work happens in one place.
- Three states only: `firstTime` (Meet Ryan, static) / `alert` (Ryan is ready, pulsing) / `default` (Chat with Ryan, static). No other states - if a future flow needs "Ryan thinking" or "Ryan offline", raise it as a design question; do not invent a fourth state in code.
