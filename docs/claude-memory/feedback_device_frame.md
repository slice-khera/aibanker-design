---
name: Consistent device frame
description: Never add custom phone frames in registry - always use the standard gallery frame from page.tsx
type: feedback
originSessionId: ebc21177-5664-4869-a7ad-5007f566c3eb
---
All preview variants must use the single standard device frame defined in `app/preview/page.tsx` (360×780, borderRadius 26). Never set `noFrame: true` or wrap render functions in custom phone frame divs in the registry. The gallery handles framing consistently.

**Why:** User was repeatedly frustrated by inconsistent device frame sizes across explorations. Each exploration was bringing its own frame wrapper, leading to visual mismatches.

**How to apply:** When adding new explorations to `app/preview/registry.tsx`, the render function should return only the sim component (e.g., `() => <MySim />`). No wrapping divs, no custom frames, no `noFrame` flag.
