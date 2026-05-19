---
name: DLS 2.0 App Bar
description: Standard app bar (L1+) and L0 app bar - layout, spacing, scroll shadow behavior
type: reference
originSessionId: 089e3071-d5fa-4ce0-912e-ea99b874924b
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, node `668:3876`

## Standard (L1 and deeper)

Types: **Button**, **Icon**, **Alt button** (trailing slot variants)

### Layout
- Total height: 108px (44px status bar + 64px bar)
- Bar padding: `8px 12px` (XS vertical, S horizontal)
- Background: white
- Scroll state: adds Below shadow `0px 6px 8px rgba(0,0,0,0.05)`

### Leading (nav icon)
- Touch target: 48x48 | Icon: 24x24 | Padding: 12px
- Default: back chevron, always left side

### Title
- Typography: H3 - 20px medium, 24px line-height, 0.4px tracking
- Color: rgba(0,0,0,0.9)
- Layout: flex-1, left-aligned (not centered), overflow ellipsis

### Trailing
- **Button**: brand color text, buttonSmall (14px medium), pill, `16px 8px` padding
- **Icon**: up to 2 icon buttons, 48x48 with 24px icons
- **Alt button**: pill with `1px solid rgba(0,0,0,0.05)` border, 16px icon + 14px text, `8px 12px` padding, 24px radius

## L0 (top-level pods)

Per-pod variants: Banking, Explore, Credit, Activity, Payments

### Layout
- Height: 64px (excluding 44px status bar)
- Padding: `8px` vertical, `24px` left, `20px` right
- Gap: 8px between title and trailing

### Title
- Typography: H2 - 24px medium, 32px line-height, 0.48px tracking
- Color: rgba(0,0,0,0.9), left-aligned

### Trailing
- Avatar (40px in 48px target) and/or icon buttons
- Scroll state: adds Below shadow

## Chat (transparent overlay)

Used **inside chat surfaces** - once the user is in a conversation with Ryan/Byron. Sits on top of scrolling chat content with no background fill, so messages and gradients show through.

Component: `ChatAppBar` in [AppChrome](app/components/AppChrome.tsx). Use `absolute` to position over scroll content; add `reserveSpace` if the parent layout doesn't already account for the 108px bar height.

### Layout
- Total height: 108px (44 status + 64 bar)
- Bar padding: `8px` on all sides
- Background: **transparent** (StatusBar also transparent)
- Title slot is absolutely positioned and **truly centered on the bar width**, not on remaining flex space, so leading/trailing never shift the center.

### Leading & trailing - circular white containers
- 48×48 circle: `borderRadius: RADIUS_CIRCLE`, `backgroundColor: BG_PRIMARY`, `border: 1px solid OUTLINE_SUBTLE`, `boxShadow: ELEVATION_CARD`
- Icon: bare 24×24 stroke SVG (close or back chevron)
- Trailing slot is a free `ReactNode` (e.g. `GoalTracker`); reserve 48×48 even when empty so center stays centered.

### Two variants

**First time** (`variant="firstTime"`) - center shows just the persona name as text. Used before the user has been introduced to Byron, or anywhere you want a single-persona header.
- Typography: `headerH4` (20px medium), centered, `TEXT_PRIMARY`
- Text comes from `voice` prop: "Ryan" or "Byron"

**Degen** (`variant="degen"`) - center shows the `PersonaToggle` pill (Ryan ↔ Byron). Used after onboarding when both personas exist.
- Requires `onVoiceChange` callback
- Pill spec: see `reference_dls_chips.md` - pill: RADIUS_CIRCLE, ELEVATION_CARD, BG_PRIMARY, 1px OUTLINE_SUBTLE; active tab: BG_SECONDARY + 36×36 character avatar

### When to use which app bar type
- Slice app screens (Budget, Pot, Activity, etc.) → `AppBar` (Standard)
- Inside any chat surface (Chat, OnboardingSim chat step, DegenModeSim, RefreshSession, GBP/Savings/Reddit sims) → `ChatAppBar`
- ChatInitialScreen (the "Ask Ryan" entry) → `ChatAppBar firstTime` - treat entry through messaging as one continuous chat surface
