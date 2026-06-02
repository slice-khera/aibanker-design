---
name: Playground conventions (cards, variants vs states)
description: PlaygroundCard wrapper rules + states are controls not variants. Consolidates earlier playground feedback into one place.
type: feedback
originSessionId: 4b2a90b3-c21a-4903-af70-54347425e5ca
---
The playground at `/playground` is the gallery for every component, viz, widget, screen, and flow. Two rules govern how items are added and presented.

## 1. PlaygroundCard wrapper + visual hierarchy

Every item uses the shared `PlaygroundCard` component.

- **Variant switcher:** monochrome segmented control under the title.
- **Viz / Widgets:** 360px white content box with 24px padding inside the card. No device frame.
- **Screens / Flows:** `DeviceFrame` bezel wrapper inside the card.

**Why:** the user needs to see exact component footprint at device width and switch between variants without confusing them for content.

**How to apply:** always use `PlaygroundCard` for new playground items. Only use device frames for full-screen layouts (screens, flows).

## 2. States are controls, not variants

When wiring a component into `/playground/components`:

- A **variant** is a structurally distinct version of the component — different layout, different typography, different size, something that isn't reachable by toggling a prop. Example: OTP 4-digit vs 6-digit (different cell sizes per Figma). Example: AppChrome standard vs degen.
- A **state** is any prop the component already exposes: `disabled`, `status="error"`, `helperText`, `leading`, `selected`, etc. States are NEVER separate variant chips.

**Why:** adding a chip per state explodes the playground (a 5-prop component would mean dozens of chips), buries the actual variants, and makes it impossible to combine states (e.g. "error AND disabled"). The user has called this out as a recurring mistake to stop making.

**How to apply:**
1. Identify true variants (almost always 1 — sometimes 2-3 like OTP length).
2. For everything else use `useControlPanel` + `useSlotControls(panel)` from `app/preview/_shared/ControlPanel.tsx`. Reference implementation: `SnackbarPlayground` in `app/(main)/playground/components/page.tsx`.
3. Default playground variant name when there's only one: `"playground"`.

If you find yourself writing more than 3 variant chips for a single component, stop and ask whether they're real variants or states.
