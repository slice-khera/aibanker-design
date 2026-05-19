# What changed since the afternoon push: 2026-05-19 evening

Everything that landed on `main` *after* the afternoon push (the last commit on origin/main before this doc was `bd798df Update afternoon changelog: add Roast Me + rollback/re-apply note`). Five commits in total — four work commits plus a single merge — authored between 4:00 PM and 8:54 PM IST.

## TL;DR

The evening was a tightening pass on top of the afternoon's bigger structural moves. Two widgets (investment product + add-to-pot) got a new `chips` variant with an autopay CTA. The returning-user **on-track mosaic** stopped being a scripted typewriter mock — every capability card now opens a real flow, "Roast me" routes through a single shared helper, and the older `DegenModeSimV1` sim was retired in the process. The Goal-Budget Planning (GBP) flow got a careful audit — streaming gates, dedup'd bold rendering, no more duplicate user bubbles. And the entire app + sims + fixtures got swept for em-dashes, accidental "Slice" capitalizations, and Title-Case category leaks.

---

## 1. Investment & add-to-pot widgets: chips variant + autopay (`912d7ba`)

Two new variants on `ChatCards` surface the suggested amounts as **tappable chips** plus a "Custom" chip that focuses an inline numeric input. Both widgets now share:

- A tertiary text-link CTA: **"Add & set up autopay"**.
- The shared `PAYING FROM` footer (consistency with the rest of the pay flow).

The widgets playground was updated so `single` and `chips` are exposed as true variants, not stuck in one shape.

---

## 2. On-track mosaic wired to real flows + unified "Roast me" (`1ca2811`)

The returning-user "on-track" mosaic on the chat surface used to be a scripted typewriter mock — taps would echo back a fake assistant reply. Now every card opens a real flow:

- **Can I afford it?** → `startAffordFlow`.
- **Analyse my spends** → a new last-month recap built from `BudgetSummaryViz` + `CategoryBudgetsViz`.
- **Roast me** → a data-driven `buildRoast` helper with three branches (over-cap / food-heavy / top-category) and an optional viz attachment.
- **Make Ryan smarter** → a deliberate placeholder, ready for the next pass.

### One "Roast me", everywhere
Every Roast me surface in the repo (production mosaic, `OnboardingSim` playground, `RefreshSessionSimV2` popover) now routes through the same `buildRoast` helper. The hard-coded `PLAYGROUND_BYRON_ROASTS` string pool is gone. `DegenModeSimV1` was retired entirely — the on-track mosaic now lives only in production.

### Fixes uncovered while wiring
- Mosaic no longer typewriter-streams its intro before showing cards (looked janky).
- Mosaic taps no longer post a user echo bubble (the echo was lighting the rainbow processing band incorrectly).
- `AssistantOptionsCard` now renders `message.card` alongside chips so the last viz attached to a chip-bearing message stops getting dropped.

---

## 3. GBP flow audit: streaming, bold, dedup (`b27a95f`)

Follow-up audit on the Goal-Budget Planning sim. The flow ran, but on close inspection a few things were off — bold rendering inconsistent, chips appearing before Ryan finished typing, duplicate user bubbles in handoffs.

### Shared highlight helper
`highlightValues` (the parser that bolds `**foo**`, currencies, and percentages) had four near-identical copies across Chat, Onboarding, RefreshSession, and Degen. Extracted to `app/lib/chat-highlight.tsx` and adopted by GBP + Savings. Every Ryan / Byron surface now renders bold / currency / percentages the same way.

### Streaming gates with latched-open behavior
GBP chips, visualizations, and cards now sit behind per-element anchor IDs — nothing actionable shows up before its preceding Ryan message finishes streaming. Crucially, the gate **latches open** once unlocked, so a viz stays mounted when a new Ryan message starts streaming below.

### Cleaner prompts
- Stories 2 + 3 dropped the redundant inline option-restating bold; rewritten as single-sentence questions so the chips do the actionable work.
- The confirm-list card is now the single source of "Looks right": added `defaultAllSelected` so rows land pre-checked, dropped `BUCKET_CONFIRM_CHIPS`, and routed bucket advancement through the card's own `onSubmit`.

### Small bug fixes
- Two duplicate user-bubble bugs in the destination-pick and ladder-pick handoffs.
- Bumped the ladder-ack → footprint-walk gap so the ack has time to type out.
- Added `animate-chat-message-in` to GBP chips / viz / card wrappers.

---

## 4. Copy sweep: em-dashes, slice lowercase, sentence-case categories (`861f798`)

Three rules from the design memory had drifted in the codebase. One pass to fix them all.

### Em-dashes (rule: `feedback_no_em_dashes.md`)
Removed literal em-dashes *and* pseudo em-dashes (`--` etc.) from Ryan / Byron dialogue across the in-device app, every preview sim, and fixtures.

### slice lowercase (rule: `feedback_slice_lowercase.md`)
Restored `slice` lowercase in the page title and in the GBP proactive messages.

### Sentence-case categories (rule: `feedback_sentence_case.md`)
Upstream fixture data was Title Case (`Food`, `Bills`, `Shopping`) but UI labels should render sentence case. Added sentence-case keys to `CATEGORY_ICONS` / `CATEGORY_COLORS` / `CATEGORY_TAG_INTENT` plus a `displayCategoryName()` helper so the Title-Case data renders sentence case at the UI boundary — no data migration needed.

### Other small leaks fixed
- "Roast me" Ryan voice leak (a line that had drifted out of Byron's voice).
- All-caps `OUT OF ATTEMPTS` source string for OTP.
- Stale `Reply to Ryan` placeholder on the Byron-capable refresh screen.
- AA learn-more grammar.
- Playground hub descriptions.
- A few small period / grammar items.

---

## 5. Merge commit (`b9bcf1f`)

Merge commit for the copy sweep branch (`claude/friendly-morse-35d121`) into main. No content of its own.

---

## File-level inventory

Across all four work commits: 27 files touched, **+939 / -955** lines (net deletion driven by the removal of `DegenModeSimV1`).

### New files
- `app/lib/chat-highlight.tsx` — shared `highlightValues` (bold / currency / percentages).
- `app/lib/roast.ts` — single `buildRoast` helper for every Roast me surface.

### Deleted files
- `app/preview/DegenModeSimV1.tsx` — retired; on-track mosaic now lives only in production.

### Updated
- `app/(main)/app/[persona]/page.tsx`
- `app/(main)/playground/flows/page.tsx`, `playground/page.tsx`, `playground/widgets/page.tsx`
- `app/components/Chat.tsx`, `ChatCards.tsx`
- `app/layout.tsx`
- `app/lib/debug-fixtures.ts`, `financial-data.ts`, `types.ts`
- `app/preview/GBPFlowSim.tsx`, `OnboardingSim.tsx`, `RefreshSessionSimV2.tsx`, `DrawerExperienceSim.tsx`, `RedditSimV1.tsx`, `SavingsFlowSimBottom.tsx`
- `app/preview/_shared/integration-manifest.json`, `lint-passes.json`, `status-generated.ts`
- `app/preview/fixtures/gbpFlowFixture.ts`, `onboardingFixture.ts`, `savingsFlowFixture.ts`, `savingsTierQuestion.ts`, `wrappedFixture.ts`

---

## Commit list (oldest to newest, by author time)

| Hash | Time (IST) | Message |
|------|------------|---------|
| `912d7ba` | 16:00 | Add chips variant + autopay CTA to investment & add-to-pot widgets |
| `1ca2811` | 16:04 | Wire on-track mosaic cards to real flows + unify Roast me |
| `b27a95f` | 20:39 | Fix streaming gate + bold rendering + dedup chips in GBP flow |
| `861f798` | 20:48 | Sweep copy: em-dashes, slice lowercase, sentence-case categories |
| `b9bcf1f` | 20:54 | Merge copy sweep from claude/friendly-morse-35d121 |
