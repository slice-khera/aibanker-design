---
name: DLS 2.0 Underlined Input Field
description: Single-line text input with bottom underline. States × Types matrix.
type: reference
originSessionId: 8dd0fae8-3d2d-4f59-9ce1-2991ea296875
---
Figma source: `ncGqxiE6wUOqgOURwHx6Hp`, node `687:7108`.

Single-line text input with a bottom underline (no rounded background, no full border). Use for free-text, phone numbers, currency entry, and any other inline text capture.

## Matrix
5 states × 4 types.

### States
- **Empty** - no value, not focused. Placeholder visible in TEXT_TERTIARY.
- **Focused** - cursor active, no value yet (or being typed).
- **Typing** - value being entered. Same visual as Focused with value.
- **Filled** - value present, not focused.
- **Disabled** - non-interactive. Text in TEXT_DISABLED.

### Types
- **Default** - input only. 48px tall total.
- **Help text** - input + caption below. Helper text in TEXT_TERTIARY.
- **Error** - input + caption below in Negative (`RED_500`). Underline turns Negative.
- **Success** - input + caption below in Positive (`GREEN_500`). Underline turns Positive.

## Spec
- Input row: `bodyNormal` (16/24/0.32). Min-height 32.
- Placeholder color: TEXT_TERTIARY.
- Value color: TEXT_PRIMARY (TEXT_DISABLED when disabled).
- Underline thickness: 1px when empty / disabled, 2px when active (focused / has value / status≠default).
- Underline color:
  - Empty / Disabled → OUTLINE_SUBTLE
  - Focused / Typing / Filled → ALPHA_BLACK_20 (Figma "Outline Bold")
  - Error → RED_500
  - Success → GREEN_500
- Underline transition: 150ms ease on color + height.
- Padding/S (12px) between input row and underline, and between underline and helper text.
- Caption typography (12/16/0.24) for helper / error / success text.
- Optional leading slot (prefix glyph or short text, e.g. `+91-`, `₹`).
- Optional trailing clear (24px X) - appears when value is present + interactive.

## Implementation
Use [app/components/InputField.tsx](../../app/components/InputField.tsx). Props:
- `value`, `onChange` (controlled)
- `placeholder`
- `leading` (ReactNode, optional prefix)
- `helperText`
- `status: "default" | "error" | "success"`
- `disabled`
- `onClear` () - when provided, renders the trailing X once value is non-empty
- `type: "text" | "tel" | "number"`
- `maxLength`, `inputMode`, `autoFocus`, `ariaLabel`

## Notes
- The active underline is dark grey (`ALPHA_BLACK_20`), not brand magenta. Earlier versions of this codebase used Valentino for the focused underline; current Figma DLS uses Outline Bold.
- For OTP/PIN entry use [reference_dls_otp.md](reference_dls_otp.md) instead - OTP is a separate DLS component (segmented digits).
