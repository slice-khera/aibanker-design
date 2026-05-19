---
name: .md files are the single source of truth
description: Never reference .ts files in specs or instructions. The user owns .md files, Claude owns .ts files and keeps them in sync.
type: feedback
originSessionId: 1171b0be-b819-46a9-b409-86941ab54d85
---
The user is a designer. `.md` files are their interface - they read, edit, and review them.

- `.md` memory files = source of truth for all design tokens, component specs, and project instructions
- `.ts` code files = Claude's job to create and maintain from the `.md` files
- Never reference `.ts` files in CLAUDE.md, specs, or conversation as something the user should look at
- When a `.md` file changes, update the matching `.ts` file automatically
- CLAUDE.md itself should never mention specific `.ts` filenames

**Why:** The user explicitly called this out - `.ts` references kept leaking into instructions. The agreement is clear: `.md` is theirs, `.ts` is mine, and I keep them in sync.
**How to apply:** Any time I write or update CLAUDE.md, memory files, or instructions, reference the `.md` spec, never the `.ts` implementation.
