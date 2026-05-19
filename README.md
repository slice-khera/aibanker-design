# AI Banker v0.1

An AI-powered personal banking assistant built with Next.js, Anthropic Claude, and Mem0.

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** (comes with Node.js)
- An **Anthropic API key** — get one at https://console.anthropic.com
- A **Mem0 API key** — get one at https://app.mem0.ai

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Link the shared Claude memory (one-time)**

```bash
./scripts/link-claude-memory.sh
```

This makes Claude on your machine read the team-shared design rules, DLS specs, and copy rules that live at `docs/claude-memory/`. The script is idempotent — safe to re-run.

3. **Run the dev server**

```bash
./scripts/dev.sh
```

(Picks a free port and writes it to `.env.local`. Avoid `npm run dev` directly if you need multiple worktrees running side-by-side.)

4. Open the URL printed by the dev script in your browser.

## Claude memory

This repo ships its Claude memory in `docs/claude-memory/`. After running the link script above, anything Claude saves to memory during a session lands there too, so memory updates flow through git like any other change. The index lives at `docs/claude-memory/MEMORY.md`.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS 4**
- **Anthropic Claude** for AI chat and flow assistance
- **Mem0** for conversational memory
