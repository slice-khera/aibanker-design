---
name: Always use DLS 2.0 semantic tokens
description: All frontend work must use semantic token imports - never hardcode values. .md files are source of truth, .ts files are code translations.
type: feedback
originSessionId: ebc21177-5664-4869-a7ad-5007f566c3eb
---
## System

- **`.md` memory files** = source of truth. The user (a designer) maintains these in plain English.
- **`.ts` code files** = code translation of the `.md` files. I create and maintain these so components can import semantic tokens.
- When a `.md` file is updated, I must update the matching `.ts` file to stay in sync.

## Token files

| `.md` memory file | `.ts` code file |
|---|---|
| `reference_dls_colors.md` | `app/lib/colors.ts` |
| `reference_dls_spacing.md` | `app/lib/spacing.ts` |
| `reference_dls_corner_radius.md` | `app/lib/radii.ts` |
| `reference_dls_elevation.md` | `app/lib/elevation.ts` |
| (typography defined in code) | `app/lib/typography.ts` |

## Rules

1. **Never hardcode values.** Always import the semantic token (`TEXT_PRIMARY`, `RADIUS_M`, `ELEVATION_CARD`, `SPACE_L`).
2. **Use semantic names, not raw values** in conversation - say "TEXT_PRIMARY", not "rgba(0,0,0,0.9)".
3. If a needed token doesn't exist in the `.ts` file, add it there first, then use it.
4. Component spec `.md` files (buttons, cards, etc.) contain design RULES - these guide which tokens to use and how.

**Why:** The user is a designer. `.md` files must be readable and updatable by them. `.ts` files are purely for code consumption. No duplication of responsibility - `.md` is the spec, `.ts` is the implementation.
