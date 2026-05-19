---
name: Always include screen chrome
description: Every screen must have status bar, app bar (per DLS spec), and bottom safe area - never skip
type: feedback
originSessionId: 24578ede-4a35-45c1-975f-21382ed74656
---
Every screen must include full chrome:
- **Top:** Status bar (44px) + app bar (64px) = 108px total
- **Bottom:** Gesture nav indicator (20px - 4px pill, 128px wide, centered, py-8px)

Never build a screen without these.

**Why:** The user has had to remind me multiple times. These are fundamental to every screen - not optional.

**How to apply:** When building or modifying any screen/stage, always start with the standard shell: StatusBar + app bar (108px) at top, gesture nav (20px) at bottom. Content lives between. The gesture nav is the bottommost element on every screen.
