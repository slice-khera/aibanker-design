# AIBanker: Data-Driven AI Chat Experience

## Context

The app is a hardcoded prototype -- chips, wrapped slides, budgets, and insights are all static strings. Real bank data (`ups_crunched.json`, 341 transactions) exists but is unused. Goal:

1. Make all flow content dynamic from real transaction data
2. Add free-form AI chat (Claude) on home screen after onboarding
3. Integrate Mem0 Platform API for persistent user memories
4. All use cases: spend analysis, proactive insights, goal coaching, affordability checks

Running locally only -- no data security concerns.

---

## Architecture

```
page.tsx ──imports──→ financial-data.ts ──imports──→ ups_crunched.json
    │
    │── chip flows use dynamic data from financial-data.ts
    │── free-form chat calls /api/chat (needs server for API keys)
    │
    └──→ /api/chat (single API route)
            ├── Claude SDK (streaming response)
            ├── Mem0 client (search + store memories)
            └── financial-data.ts (load data for system prompt)
```

- **Financial data** is imported directly via utility functions (no API route needed)
- **Single API route** (`/api/chat`) handles Claude + Mem0 (API keys must stay server-side)
- **Mem0 storage** for onboarding decisions goes through a lightweight `/api/memory` route
- Everything else stays client-side

---

## New Files (7)

### 1. `app/lib/types.ts` (~100 lines)
TypeScript types for `ups_crunched.json` schema, API request/response shapes, and `DerivedProfile` extending `MockProfile`.

### 2. `app/lib/financial-data.ts` (~250 lines)
Core data processing module. Transforms `ups_crunched.json` into all the shapes the app needs:

```ts
import rawData from "../../ups_crunched.json";

export function deriveProfile(): DerivedProfile { ... }
export function computeWrappedSlides(): WrappedSlide[] { ... }
export function computeSuggestedBudgets(): SuggestedBudgets { ... }
export function computePacePresets(goalAmount: number): PacePreset[] { ... }
export function getLifestyleCategories(): CategorySummary[] { ... }
export function generateInsights(): InsightCard[] { ... }
```

Key data mappings:

| MockProfile field | Source in ups_crunched.json |
|---|---|
| `wrapped.top_category_label` | Top lifestyle category (excl. self-transfers, CC, real estate) |
| `persona.actual_savings_pct` | `investmentActivity.totalInvested / totalCredits` |
| `suggested_budgets.categories` | Monthly averages per lifestyle category |
| `receipts[]` | Recent Swiggy, Amazon, food transactions |
| `goal.accumulated_savings` | Sum from `investmentActivity` |

### 3. `app/lib/mem0.ts` (~60 lines)
Mem0 client wrapper:
```ts
import MemoryClient from "mem0ai";

export function getMem0Client(): MemoryClient { ... }
export async function storeMemory(userId: string, messages: Message[]) { ... }
export async function searchMemories(userId: string, query: string) { ... }
export async function storeDecision(userId: string, type: string, value: string) { ... }
```

### 4. `app/lib/ai.ts` (~120 lines)
Claude API wrapper:
```ts
import Anthropic from "@anthropic-ai/sdk";

export function buildSystemPrompt(profile, memories, context): string { ... }
export async function streamChat(messages, systemPrompt): Promise<ReadableStream> { ... }
```

**System prompt personality:** Casual, warm, slightly cheeky -- "smart friend who knows your bank balance." Short sentences, INR formatting (₹X,XXX), max ~150 words. Always ties advice back to user's goal. Never reveals raw narrations or account numbers.

### 5. `app/api/chat/route.ts` (~80 lines)
`POST /api/chat` -- the main AI endpoint:
1. Search Mem0 for relevant memories (injected into system prompt as "What I Remember")
2. Load financial summary via `deriveProfile()`
3. Build system prompt with data + memories + goal/budget context
4. Stream Claude response
5. **Store full conversation turn in Mem0** -- Mem0 auto-extracts preferences from natural language (e.g., "I prefer eating out" → stored as "User prefers eating out and doesn't want food budget reduced")

### 6. `app/api/memory/route.ts` (~40 lines)
`POST /api/memory` -- stores onboarding decisions in Mem0 (goal chosen, pace selected, budget style, spend ratings).

### 7. `.env.local`
```
ANTHROPIC_API_KEY=sk-ant-...
MEM0_API_KEY=m0-...
```

---

## What Gets Stored in Mem0

### A. Onboarding decisions (via `/api/memory`, structured)
Stored at specific chip-flow decision points:
- Persona quiz answers: "User thinks they save 10-20%. Identifies as weekend splurger."
- Goal set: "User set goal: Emergency fund, ₹5L, 12 months"
- Pace chosen: "User chose balanced pace"
- Budget style: "User prefers chill budget over strict"
- Spend ratings: "User rated late-night Swiggy orders as regret"

### B. Chat preferences (via `/api/chat`, automatic extraction)
After every chat exchange, Mem0 receives the full user+assistant turn and **auto-extracts preferences**:
- "I prefer eating out, don't cut my food budget" → *"User prefers eating out and doesn't want food spending reduced"*
- "I don't want to touch my SIPs" → *"User wants SIP investments protected from budget cuts"*
- "I'm planning a Japan trip in March" → *"User planning Japan trip, may need travel budget"*
- "Don't suggest credit cards" → *"User doesn't want credit card recommendations"*

Memories are **retrieved before every AI response** via semantic search, injected into Claude's system prompt, ensuring preferences are always respected.

---

## Modified Files (4)

### `app/page.tsx`
**Changes (~120 lines added, ~25 modified):**
- Import `deriveProfile()`, `computeWrappedSlides()`, `getLifestyleCategories()` from `financial-data.ts`
- Replace `const profile = getProfileById(...)` with `deriveProfile()` output
- Add `userId` state (UUID from localStorage) for Mem0
- Add `showInput={true}` when `step === "home"` and wire up `handleChatSubmit`
- Add background `fetch('/api/memory')` calls at key decision points
- Use dynamic wrapped slides and category chips

**Dead-end flows → AI handoff:**
Currently, many subflows end abruptly with `returnToSteadyState()` showing just 4 chips. With the text input always visible on the home screen, these become natural handoff points:

1. **Always-visible text input:** When `step === "home"`, `showInput` is always `true` alongside chips
2. **Stubbed flows handled by AI:** "Set weekend cap", "Automate savings", "Tighten Food budget", etc. route to AI chat for real follow-through
3. **Context carry-over:** AI has full context of the chip flow via message history + Mem0

### `app/components/Chat.tsx`
**Changes (~30 lines added):**
- Add streaming message rendering
- Add `isStreaming` prop to disable input during AI response

### `app/data/flows.ts`
**Changes (~50 lines added):**
- Add `buildWrappedSlides(stats)` for real slide content
- Add `buildDynamicChips(categories)` for data-driven chip options
- Existing static arrays kept as fallbacks

### `app/data/mockProfiles.ts`
**Changes (~15 lines added):**
- Add `DerivedProfile` type extending `MockProfile`

---

## Implementation Order

### Phase 1: Data Layer
1. `bun add @anthropic-ai/sdk mem0ai`
2. Create `.env.local` with API keys
3. Create `app/lib/types.ts`
4. Create `app/lib/financial-data.ts` with `deriveProfile()` + `computeWrappedSlides()`
5. Update `page.tsx` to use `deriveProfile()` instead of `getProfileById()`

**Checkpoint:** App works as before but profile numbers come from real data.

### Phase 2: Dynamic Content
6. Add `buildWrappedSlides()` to `flows.ts`
7. Update `page.tsx` to use dynamic wrapped slides
8. Add `getLifestyleCategories()` and `buildDynamicChips()` to `flows.ts`
9. Update `page.tsx` to use dynamic category chips

**Checkpoint:** Wrapped slides and chips reflect actual spending data.

### Phase 3: Mem0
10. Create `app/lib/mem0.ts`
11. Create `app/api/memory/route.ts`
12. Add memory storage calls in `page.tsx` at key decision points

**Checkpoint:** Decisions persist in Mem0.

### Phase 4: AI Chat
13. Create `app/lib/ai.ts` with system prompt + streaming
14. Create `app/api/chat/route.ts`
15. Update `Chat.tsx` with streaming support
16. Wire up `handleChatSubmit` in `page.tsx` for home screen

**Checkpoint:** Free-form chat works with financial context + memory.

### Phase 5: Polish
17. Error handling (fallback to static data)
18. Loading states
19. End-to-end test: wrapped → persona → goal → budget → home → AI chat

---

## Verification
1. **Wrapped slides** show real stats (e.g., "7 months analyzed", actual top category)
2. **Category chips** show real categories (Swiggy, Amazon, etc.) not hardcoded ones
3. **AI chat:** "How much did I spend on food?" → ₹6,354 (Swiggy + Instamart + Dineout)
4. **Memory:** Set a goal, ask AI about it in new session → Mem0 provides context
5. **Affordability:** "Can I afford a ₹5000 dinner?" → Claude checks budget and goal
6. **Dead-end recovery:** After any chip flow ends, user can type follow-up and get AI response
