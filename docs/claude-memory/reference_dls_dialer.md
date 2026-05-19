---
name: DLS 2.0 Dialer
description: Circular radial slider for amount selection - Monies (cash) and Repayment variants
type: reference
---
Figma source: `HBoBlZN1CrmVwO3rXeZjY0`, nodes `2938:1313`, `3383:15748`, `3383:15769`, `3383:15727`

## Structure
- Container: 316×360px (monies) or square (repayment)
- Track ring: circular bg track, ~84% of container, soft shadow/inset
- Progress arc: gradient-colored arc showing selected proportion
- Handle: 40×40px white circle, double-chevron (‹›) via `Interface/Chevron` 12×12px
- Start dot: 12 o'clock position
- Center content: amount + label, vertically centered

## Typography

| Element | Font | Size/lh | Color |
|---------|------|---------|-------|
| Amount | Rubik Medium | 32/40 | rgba(0,0,0,0.9) |
| Label ("CASH") | Rubik Regular | 12/16, 0.24px tracking | rgba(0,0,0,0.5) |
| Sub-label | Rubik Regular | 10/12, 0.4px tracking | rgba(0,0,0,0.5) |

## Monies (Cash)
Arc gradient: magenta/pink

| Progress | Amount | Handle Position |
|----------|--------|-----------------|
| 0% | ₹0 | Top (12 o'clock) |
| 70% | ₹300 | ~8 o'clock |
| 100% | ₹300 | Top (full circle) |

## Repayment
Three color themes: **Blue** (default), **Green** (no-interest), **Orange** (partial)

All show: centered amount, "NO INTEREST CHARGES" label, plan point dots along arc, handle with rotated chevrons, start/end dots.

Handle snaps to plan points. Arc fills following handle position.
