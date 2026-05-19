---
name: Overlay nav icon logic - single layer, no stacking
description: One overlay slot over PayScreen. Entry screen gets X, deeper screens get back. PDP is one-time intro only.
type: feedback
originSessionId: ede62465-cc53-4096-b925-4945426b9c7b
---
Never stack overlays on top of overlays. There is one overlay slot on top of the PayScreen. The content inside it changes as the user moves forward in the flow.

**Nav icon rule:**
- **Close (X):** The screen is the entry point of the overlay - dismisses back to PayScreen
- **Back (<):** The screen is deeper in a forward flow - goes back to previous screen within the overlay

**Onboarding flow (first time):**
1. Pill tap → overlay slides up with FeaturePDP (X icon - it's the entry)
2. FAB tap → overlay content pushes to chat (back icon - came from PDP)
3. Closing chat → goes back to PDP, not PayScreen
4. Flow continues through onboarding phases within the same overlay

**Post-onboarding (returning):**
- PDP is skipped - it was a one-time intro
- Pill tap → overlay slides up with chat directly (X icon - it's now the entry)

**Why:** Stacking overlays is not how native apps work. One overlay, content changes inside it. The nav icon tells the user whether they can dismiss (X) or go back (<).

**How to apply:** When wiring screens into the overlay, determine if it's the entry point or a deeper screen. Use X for entry, back for deeper. Never mount a second overlay on top of the first.
