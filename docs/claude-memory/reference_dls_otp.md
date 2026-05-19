---
name: DLS 2.0 OTP
description: Segmented digit input - 4 or 6 circular cells, auto-advance focus
type: reference
originSessionId: 8dd0fae8-3d2d-4f59-9ce1-2991ea296875
---
Figma source: `ncGqxiE6wUOqgOURwHx6Hp`, node `791:24031`.

Segmented one-time-passcode entry. Each digit lives in its own circular cell; focus auto-advances as the user types. Use this for any code/PIN entry - not the underlined input field.

## Variants
- **4-digit** - 4 cells, 52×52 each, 16px gap, body large digit (18/28).
- **6-digit** - 6 cells, 40×40 each, 8px gap, body small digit (14/20).

## States
- **Default** - all cells empty. Stroke ALPHA_BLACK_20.
- **Focused** - input has focus, no digits yet. Stroke ALPHA_BLACK_20 on all cells; the active (first) cell gets VALENTINO_500 stroke.
- **Active** - some digits entered. Cells with digits keep ALPHA_BLACK_20; the next-to-fill cell shows VALENTINO_500.
- **Filled** - all cells have a digit. All cells ALPHA_BLACK_20.
- **Disabled** - cells filled with BG_DISABLED, no border, no digits shown.
- **Error** - every cell stroked RED_500, digits visible, optional error caption below in Caption / RED_500.

## Spec
- Cell shape: perfect circle (`RADIUS_CIRCLE` / 100% radius).
- Border: 1px regular stroke.
- Background: BG_PRIMARY (or BG_DISABLED when disabled).
- Digit color: TEXT_PRIMARY.
- Error caption margin: 12px (Padding/S) from the cell row.
- Transition: 150ms ease on border-color.

## Implementation
Use [app/components/OtpInput.tsx](../../app/components/OtpInput.tsx). Props:
- `length: 4 | 6`
- `value`, `onChange` (controlled string of digits)
- `status: "default" | "error"`
- `errorText` (only rendered when status === "error")
- `disabled`
- `autoFocus`

Internally renders a hidden `<input type="tel" inputMode="numeric">` layered over the cells. Clicking anywhere on the row focuses it. Paste fills cells. Backspace clears the last digit.

## When to use
- Phone OTP, email OTP, transaction OTP.
- Never use the underlined input for OTP entry - the DLS pattern is segmented.
