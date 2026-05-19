---
name: DLS 2.0 Header (above button group)
description: Header that sits above a button group. Trust builder, T&C disclaimer line, or T&C with checkbox. Companion to ButtonGroup.
type: reference
originSessionId: 4b2a90b3-c21a-4903-af70-54347425e5ca
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, nodes `893:38265`, `893:38276`

Sits above the button group. Carries a small trust signal or a legal disclaimer line directly above the primary CTA. This is the slot used for early-access disclaimers, T&C lines, and the like.

## Trust builder
- `General/Shield` 16×16px icon + green text, 4px gap, centered
- Font: 12px regular, 16px lh, 0.24px tracking, colour #00a63e (Extended/Text&Icons/Positive)
- Padding-top: 8px

## T&C
- Height: 24px, centered (allow wrap to a second line if content forces it)
- Sample copy: "By continuing, you accept **T&C** and **Privacy Policy**"
- Base colour: rgba(0,0,0,0.5) (Text&Icons/Default/Tertiary)
- Link colour: #d30ad7 (Valentino 500), bold
- Font: 12px regular, 16px lh, 0.24px tracking

## T&C with checkbox
- Row: Checkbox 48×48px target (24×24px control) + text
- Link colour: #d30ad7

## Placeholder
- 312×48px dashed box, bg #f6f9fc, "Replace with local component"

## Shipped examples
- Onemoney consent OTP footer in `app/preview/AASim.tsx` (T&C variant inlined above a full-width primary CTA)
- Meet Ryan PDP footer in `app/components/FeaturePDP.tsx` (disclaimer line with placeholder icon above a full-width primary CTA)
