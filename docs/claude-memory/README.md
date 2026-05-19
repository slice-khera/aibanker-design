# DLS 2.0 - Claude Code Memory Files

Design system reference files for Claude Code. These give Claude full context on colors, typography, spacing, elevation, components, and design workflow rules.

## Setup

1. Find your Claude Code memory path:
   ```
   ~/.claude/projects/<encoded-project-path>/memory/
   ```
   Ask Claude _"where is your memory directory?"_ if unsure.

2. Create the folder if it doesn't exist:
   ```bash
   mkdir -p ~/.claude/projects/<your-project-path>/memory
   ```

3. Copy all `.md` files (except this README) into that folder.

4. Start a new conversation. Claude picks up memory files automatically.

## What's Inside

### Design Rules (7 files)
Workflow constraints: use DLS tokens (not raw hex), match Figma 1:1, reuse existing components, design mode workflow, screenshot verification, transition conventions, asset handling.

### Foundation Tokens (6 files)
- **Colors** - Primitives, semantic, extended, component tokens, gradients
- **Spacing** - 10-level scale from 2px to 64px
- **Elevation** - Card, Above, Below shadow types
- **Corner Radius** - S(8), M(16), L(24), Circle(100)
- **Dividers** - Default (solid/dashed) and Big (8px section break)
- **Iconography** - Icon grid (24px/56px), 15 categories, ~236 icons

### Component Specs (26 files)
App Bar, Buttons, Button Group, Bottom Sheet, Input Field, Cards, List Items, Section Header, Chips, Tabs, Tags, Controls, Progress, Tooltip, Badge, Avatar, Dot Indicator, Carousel, Bottom Nav, Accordion, Dialer, File Upload, Footer & Header, Search, Slider, Snackbar

### Index
- **MEMORY.md** - Master index Claude reads to find relevant files

## Notes
- Don't rename files - Claude uses filenames to locate them.
- Source Figma file: `HBoBlZN1CrmVwO3rXeZjY0`
