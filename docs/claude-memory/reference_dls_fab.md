---
name: DLS 2.0 FAB
description: Floating action button - circular 56px, 4 states, used in onboarding flows and PDP screens
type: reference
originSessionId: ede62465-cc53-4096-b925-4945426b9c7b
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, node `640:2036`

## Description
A circular, elevated button fixed at the bottom of the screen, used for contextual actions; primarily during onboarding flows.

## Layout
- Circle: 56x56px
- Border radius: circle (100px)
- Padding (inner): S (12px) - icon sits centered
- Container row: flex, justify-end
- Container padding: `0 XL(32px) L(24px)` (sides + bottom)
- Optional GestureNav sits directly below (toggleable)

## Icon
- Default: Interface/Arrow (right-facing, 24x24, white)
- Slot: accepts custom 24x24 icon
- Loading: replaces icon with 32px circular spinner

## States

| State | Background | Icon color |
|-------|-----------|-----------|
| Default | main/primary (#D30AD7) | white |
| Pressed | main/primary-medium (#A008A3) | white |
| Disabled | background/disabled (#EAEBED) | disabled gray |
| Loading | main/primary (#D30AD7) | spinner replaces icon |

## Token mapping
- Default bg: `VALENTINO_500`
- Pressed bg: `VALENTINO_600`
- Disabled bg: `BG_DISABLED` / `SLATE_50`
- Icon color: `ALPHA_WHITE_FF`
- Radius: `RADIUS_CIRCLE`
- Inner padding: `SPACE_S`
- Container side padding: `SPACE_XL`
- Container bottom padding: `SPACE_L`

## Props
- `state`: Default | Pressed | Disabled | Loading
- `icon`: ReactNode slot (defaults to right arrow)
- `gestureNav`: boolean (whether GestureNav renders below)
