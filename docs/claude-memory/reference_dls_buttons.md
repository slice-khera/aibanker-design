---
name: DLS 2.0 Buttons
description: Button types (Primary/Secondary/Tertiary/Grey), sizes (Regular/Small), states, on-color variants
type: reference
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, node `232:33896`

## Types

| Type | Background | Text | Border | Pressed bg |
|------|-----------|------|--------|-----------|
| Primary | #D30AD7 | white | none | #A008A3 |
| Secondary | transparent | #D30AD7 | 1px solid rgba(0,0,0,0.2) | #FAE2FA |
| Tertiary | transparent | #D30AD7 | none | #EAEBED |
| Grey | #F0F4F7 | rgba(0,0,0,0.9) | none | #EAEBED |

Disabled bg (all): #EAEBED

## Sizes

| Property | Regular | Small |
|----------|---------|-------|
| Height | 48px | 36px |
| Padding | 12px 24px | 8px 16px |
| Font | 16px medium, 24px lh, 0.32px tracking | 14px medium, 20px lh, 0.28px tracking |
| Icon | 24x24 | 20x20 |

## Common
- Border radius: 100px (pill)
- Gap icon↔text: 8px
- Layout: flex, items-center, justify-center
- States: Default, Pressed, Disabled, Loading
- Icon-only button: 48x48 (regular), 36x36 (small)

## On Color (for use on colored backgrounds)
- Primary: white bg, text rgba(0,0,0,0.9)
- Secondary: transparent, border rgba(255,255,255,0.3), text white
- Grey: rgba(0,0,0,0.1) bg, text white
- Tertiary: transparent, text white
