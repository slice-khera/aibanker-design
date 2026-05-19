---
name: ShadCN for all chrome UI
description: All tooling chrome (top bars, control panels, persona pickers, playground) must use ShadCN defaults - no brand colors, no raw hex, no inline styles
type: feedback
originSessionId: 45cee53b-4fa5-426a-bbdc-8041642058b6
---
Chrome UI (everything outside the phone simulator) must use ShadCN components with their default neutral theme. Never put brand/DLS colors (magenta, valentino, etc.) into chrome - that's only for inside the app.

**Why:** The user found the control panel "looking like crap" because brand colors were mixed into ShadCN components, raw hex values overrode theme tokens, and custom cards replaced what ShadCN handles out of the box. The result was an inconsistent, broken-looking UI.

**How to apply:**
- Use ShadCN components as-is with minimal className overrides
- Never use raw hex - only ShadCN semantic tokens (bg-card, text-muted-foreground, bg-accent, etc.)
- Never use DlsTag, VALENTINO_*, or any DLS tokens in chrome - use Badge, Button, Card, etc. from @/components/ui
- Never use the typography object in chrome - use Tailwind text utilities
- Never use inline style attributes in chrome - always Tailwind classes
- This applies everywhere: main page, playground, preview, all non-app surfaces
