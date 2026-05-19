---
name: Screen transition conventions
description: Push left/right for flow navigation, slide up/down for modal overlays - matches iOS conventions
type: feedback
---
Two transition patterns:

1. **Flow navigation** (e.g. list → detail → back): push right-to-left forward, left-to-right back
2. **Modal overlay** (e.g. opening chat, bottom sheet): slide bottom-to-top to present, top-to-bottom to dismiss

**Why:** Matches iOS native conventions. Push = lateral stack navigation. Present = modal overlay from below.

**How to apply:** Determine if the transition is a push (navigating deeper) or a present (overlaying a new context). Use the corresponding direction.
