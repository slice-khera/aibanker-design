---
name: DLS 2.0 Search
description: Pill-shaped search bar - 4 states (Default/Focused/Typing/Filled), optional filter button
type: reference
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, nodes `678:611`, `1956:21399`

## Structure
- Container: 360px wide, bg white, padding `8px 24px`, gap 8px
- Search pill: flex-1, pill (100px radius), border 2px solid
- Back icon: 48×48px target, 20×20px `Interface/Chevron` left, 14px padding
- Input: flex-1, ellipsis overflow
- Clear icon: 48×48px target, 20×20px `Interface/Cross` (Typing/Filled only)
- Filter button (optional): 48×48px circle, settings icon, 2px border

## Typography
- Placeholder: 14px regular, 20px lh, 0.28px tracking, rgba(0,0,0,0.5)
- Input text: 14px medium, 20px lh, 0.28px tracking, rgba(0,0,0,0.9)

## States

| State | Border color | Shows clear icon |
|-------|-------------|-----------------|
| Default | rgba(0,0,0,0.05) | No |
| Focused | #d30ad7 | No |
| Typing | #d30ad7 | Yes |
| Filled | rgba(0,0,0,0.2) | Yes |

## Filter Button Border

| State | Border |
|-------|--------|
| Default / Focused / Typing | rgba(0,0,0,0.05) |
| Filled | rgba(0,0,0,0.2) |

## Dark Mode
- bg: #090b0c | border subtle: rgba(255,255,255,0.05) | border bold: rgba(255,255,255,0.1)
- Focused: #d30ad7 (same) | text primary: white | text tertiary: rgba(255,255,255,0.5)
