---
name: Screenshot-verify every visual change
description: Use Playwright to screenshot after any frontend change - verify before reporting done
type: feedback
originSessionId: 950e5466-e9ba-4ddf-8c98-3f5039021bc0
---
After any frontend/visual change, take a screenshot with Playwright MCP and verify the result before telling the user it's done. Do this proactively every time - never wait to be reminded.

**Why:** Catches layout issues, styling bugs, and rendering problems that build checks miss. User had to remind multiple times - this is non-negotiable.

**How to apply:** Edit code → start dev server if needed → navigate to the relevant page → screenshot → review → fix if wrong → then report done. Never skip this step.
