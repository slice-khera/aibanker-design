---
name: Dev port from .env.local
description: Always read the dev server port from .env.local (managed by scripts/dev.sh) - never hardcode 3000
type: feedback
originSessionId: b4aa0644-929b-46f0-8665-db4b0dba95b8
---
Each worktree gets a unique dev port assigned by `scripts/dev.sh`, which writes `PORT=<port>` into `.env.local`. Multiple worktrees can run concurrently without colliding on port 3000.

**Why:** Designer runs parallel Claude Code sessions across multiple worktrees. Hardcoding 3000 means one session steals another's port and the second server fails to start. Lost time + confusion.

**How to apply:**
- To start: `./scripts/dev.sh` (allocates next free port from 3000 upward, writes to `.env.local`, exports `PORT`).
- To read the current port: `grep ^PORT= .env.local | cut -d= -f2` (or just `cat .env.local`).
- All `curl`, `preview_*` URLs, and browser checks must use that port.
- If `.env.local` was created by a different worktree (e.g. cloned in), delete it before running `./scripts/dev.sh` so a fresh port is allocated.
- When telling the user "the dev server is running", state the port explicitly.
