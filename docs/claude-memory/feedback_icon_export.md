---
name: Icon export from Figma - exact frame, no guesswork
description: When user shares a Figma icon link, export the exact node as-is into a properly sized SVG - never strip the frame or extract inner vectors
type: feedback
originSessionId: ebc21177-5664-4869-a7ad-5007f566c3eb
---
When the user shares a Figma link to an icon:

1. The user is pointing to the **frame** (e.g. 16×16, 20×20, or 24×24). That frame IS the icon - it includes the correct padding/inset around the vector content.
2. Export the **entire node** as a single SVG with the frame's dimensions as the viewBox (e.g. `viewBox="0 0 16 16"` for a 16×16 frame).
3. If the Figma MCP returns only the inner vector (smaller viewBox), reconstruct the full-frame SVG by translating the vector content by the correct inset (frame size minus vector size, divided by 2, on each side).
4. Replace any CSS variable fills like `var(--fill-0, black)` with the fallback value (`black`).
5. Save to `public/icons/` with a descriptive name.
6. To resize the icon in code, just change `width` and `height` on the `<img>` tag. The SVG scales proportionally - never modify the SVG internals.

**Why:** User was repeatedly frustrated by icons being stripped of their frames, exported at wrong sizes (e.g. 13.33 instead of 16), or having their proportions broken. The frame defines the icon's bounding box and ensures consistent sizing across all icons in the system.

**How to apply:** Every time a Figma icon link is shared, follow this exact process. Do not deviate, do not "improve" it, do not extract inner layers separately.
