---
name: DLS 2.0 Snackbar
description: Toast notification bar. Default (dark) and Negative (red), optional icon and action button.
type: reference
originSessionId: b4aa0644-929b-46f0-8665-db4b0dba95b8
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, nodes `670:240`, `1910:22720`

## Container
- 328px wide | Radius: 12px | Padding-right: 8px

## Types

| Type | Background | Shadow |
|------|-----------|--------|
| Default | #252a31 (neutral) | 0px 2px 32px rgba(0,0,0,0.05) |
| Negative | #da535a (red) | 0px 2px 32px rgba(0,0,0,0.3) |

## Typography
- Text: 14px regular, 20px lh, 0.28px tracking, white
- Action: 14px medium, 20px lh, 0.28px tracking, white

## Slots
- **Icon** (optional): 20×20px, left side, padding-left 16px (e.g. `Status/Tick`)
- **Text**: flex-1, padding 16px
- **Action** (optional): pill button, padding `8px 16px` (e.g. "Reload")

Combinations: text only, text+icon, text+action, text+icon+action.

## Behavior

Source: Material Design (Android-first DLS).

### Position
- Bottom-center, horizontally centered.
- 16px above the footer if present (button group, chat input, tab bar).
- 16px above the gesture nav indicator otherwise.

### Animation
| Phase | Transform | Opacity | Duration | Easing |
|-------|-----------|---------|----------|--------|
| Enter | `translateY(100%) → 0` | `0 → 1` | 250ms | `cubic-bezier(0, 0, 0.2, 1)` (decelerate) |
| Exit  | `translateY(0) → 100%` | `1 → 0` | 200ms | `cubic-bezier(0.4, 0, 1, 1)` (accelerate) |

### Auto-dismiss
- No action: dismisses after **4000ms**.
- With action: **persists** until action tap (or programmatic close).

### Dismiss interactions
- ✅ Action tap dismisses.
- ✅ Auto-dismiss timer (when no action).
- ✅ Programmatic close via `onClose`.
- ❌ No tap-on-bar / swipe / × button.

### Stacking
None. A second snackbar replaces the current one (current exits as new enters). Per Material: appear one at a time.

### API
Component-only (no global `toast()`). Use `<SnackbarHost open onClose ... />`; caller owns `open` state.
