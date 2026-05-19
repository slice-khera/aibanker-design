---
name: typography.metadata always renders UPPERCASE
description: The metadata typography token is a visual layer (small uppercase label) - applies to DlsTag AND every section/card header that uses it
type: feedback
originSessionId: cf25066a-4d4d-4dea-9ff6-114d08dd7787
---
Any element styled with `typography.metadata` renders UPPERCASE via `textTransform: "uppercase"`. This applies to:
- `DlsTag` status pills (e.g. `COMFORTABLE`, `BIGGEST CUT`)
- Card section headers via the shared `CardHeader` function in `app/components/ChatCards.tsx`
- Inline section labels in components, viz, widgets, and screens (e.g. `INCOME SOURCES`, `SUMMARY`, `CATEGORY BUDGETS`, `SAVINGS TIERS`, `PAYING FROM`, `ADDING FROM`, `GOAL`, `POOL`, status badges like `AHEAD` / `BEHIND` / `ON TRACK`)

Source strings in code stay sentence case (e.g. `"Income sources"`); the CSS transform does the uppercasing. The string is the copy; the token is the visual layer. Specs (.md files), copy decks, and fixture data write sentence case - rendering is automatic.

**Why:** The `typography.metadata` token is defined for that purpose in the DLS - 10px regular with 0.4px tracking only reads as a "label" when uppercased. The DLS 2.0 spec (`reference_dls_section_header.md`, `reference_dls_tags.md`) is sourced from Figma and explicitly prescribes uppercase for this token. Earlier in development, we removed the uppercase under a misapplication of the sentence-case rule - the sentence-case rule is about copy content (`bodySmall`, `bodyNormal`, `headerH*`, etc.), not about the metadata visual layer.

**How to apply:**
- When adding a new section label / card title / status pill at the metadata typography tier: include `textTransform: "uppercase"` in the inline style (or use the shared `CardHeader` / `DlsTag` which already do).
- When writing source strings or fixture data: stay sentence case (`"Income sources"`, not `"INCOME SOURCES"`). The CSS uppercases at render time.
- When auditing for sentence-case compliance: skip anything using `typography.metadata`. It is exempt by design.
- `typography.caption` (12px) is NOT metadata - it stays sentence case. The 12px viz card titles like "May spends" follow the normal sentence-case rule.
