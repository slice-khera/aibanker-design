---
name: Always use sentence case for UI labels
description: All user-facing text (labels, titles, descriptions) must use sentence case, never Title Case
type: feedback
originSessionId: 3f755b5f-8d59-4c46-843f-e2c5adbd5780
---
Always use sentence case for all UI labels, titles, card names, descriptions, and any user-facing text. Never use Title Case.

**Why:** User preference for consistent, clean typography. Title Case looks overly formal and noisy.

**How to apply:** "Goal on track" not "Goal On Track". "New user" not "New User". First word capitalized, rest lowercase (unless proper nouns).

**Exception:** The `typography.metadata` token is a visual layer that always renders UPPERCASE (DlsTag pills, card section headers, etc.). Source strings still stay sentence case ("Income sources" in code) - the CSS transform uppercases them at render. See `feedback_metadata_uppercase.md`.
