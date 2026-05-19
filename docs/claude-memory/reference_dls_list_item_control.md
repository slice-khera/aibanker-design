---
name: DLS 2.0 List item/Control
description: All-purpose selection row - title + optional subtext + trailing radio/checkbox
type: reference
originSessionId: 8dd0fae8-3d2d-4f59-9ce1-2991ea296875
---
Figma source: `qo0U58MJSHQ3o4E0QUaDRK`, parent component `166:2751`, demo instance `166:2763`.

The DLS-blessed list item for any "pick one" or "pick many" surface (questionnaire options, ladder pickers, settings toggles). Use this instead of hand-rolling a row when the layout is title + optional subtext + radio/checkbox.

## Anatomy
- Root: button, padding `16px 24px`, gap `12` between content and trailing
- Content (flex column, gap `4`):
  - Title row (flex, items center, gap `4`): title text + optional inline slot for chip / info icon
  - Subtext (optional): single paragraph below title
- Trailing slot: 40px wide, right-aligned, holds the control

## Tokens
- Title: `typography.bodyNormal` (16/24, 400) - TEXT_PRIMARY
- Subtext: `typography.caption` (12/16, 400) - TEXT_SECONDARY
- Selected control fill: VALENTINO_500
- Empty control stroke: ALPHA_BLACK_20
- Control scale-in: `transform 150ms ease`, scale `0.9 → 1`

## Props
- `title` (string, required)
- `titleTrailing` (ReactNode) - inline element after the title (chip, info icon)
- `subtext` (string)
- `kind`: "radio" | "checkbox" - default "radio"
- `selected` (bool, required)
- `disabled` (bool)
- `onSelect` () => void

## When to use vs other list items
- **Use Control** when the row has a built-in selection state (radio/checkbox) and the user is choosing from a list.
- **Use Standard** when the row links somewhere (chevron trailing) or has no selection state.
- **Use Selection** (52px height, 296px width, see `reference_dls_list_items.md`) for the compact pill-style picker on flat surfaces.
