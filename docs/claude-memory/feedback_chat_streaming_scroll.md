---
name: Chat streaming and scroll rules
description: Universal rules for typewriter streaming, streaming-before-actions, scroll behavior, and flow continuity across all chat sims
type: feedback
originSessionId: f0adbf04-4cf6-4928-a8a1-f528ee34dc45
---

## The streaming-before-actions rule (UNIVERSAL)

Ryan's text must ALWAYS finish streaming before any actionable element (button, chip, card, widget, overlay) appears below it. This applies to every chat sim in the codebase, not just OnboardingSim.

**Why:** The user reported buttons appearing mid-stream repeatedly. It breaks the chat rhythm and makes the app feel broken - users see a clickable button before they've read what Ryan is saying.

**Three approved patterns to enforce this:**

1. **Step separation** (preferred for normal flow): Text and actions in separate steps - `onDone → advanceStep()` renders the next step's actions. Used in OnboardingSim's normal AA/clarify chip flow.
2. **State gate** (for inline/conditional content like dismiss nudges): Add a `xxxStreamed` boolean, set it via `onDone` callback on `RyanLine`, gate the action element on `{xxxStreamed && (...)}`. Used in OnboardingSim's AA/pref dismiss nudges.
3. **Schedule timer** (for timed sequences): Delay action appearance with `setTimeout`. Used in SavingsFlowSim, RedditSim.

**Never render a `RyanLine` and an actionable element as siblings without one of these gates.**

Existing correct implementations to reference:
- `typingDone` / `followupDone` gates in RefreshSessionSimV2, DegenModeSimV1
- `surfaceDone` gate in Chat.tsx's AssistantOptionsCard
- `showClarifyChips` timer in SavingsFlowSim/RedditSim
- `aaNudgeStreamed` / `prefNudgeStreamed` gates in OnboardingSim

## Streaming rules

Every Ryan-authored message must use `RyanLine` with `active={isLast}`. No raw `<p>` tags for Ryan's voice - including dismiss nudges, error messages, and edge-case copy.

**How to apply:**
- Dismiss nudges (AA close, questionnaire close) → `RyanLine` with `active={isLast && dismissedState}` + `onDone` gate for the button
- Chips/buttons below Ryan text → gated on streaming completion, appear with `animate-chat-message-in` fade
- If text should NOT stream (e.g., review mode quips), pass `instant={true}` to the underlying typewriter

## Scroll rules

1. **User picks a chip** → snap-scroll their reply bubble to just below chrome, Ryan's response streams below it
2. **Ryan's text finishes streaming** → gentle auto-scroll to keep latest content visible (`scrollTo({ top: scrollHeight, behavior: "smooth" })`)
3. **Snap-scroll always wins** over auto-scroll. Use `isSnappingRef` guard. Lock duration: animation (400ms) + 200ms buffer only - never longer
4. **During overlay animations** (open/close) → delay scroll by `OVERLAY_DURATION` to avoid calculating position against a mid-animation viewport
5. **Cancel pending snaps** if a new snap is requested (`clearTimeout` the previous one)

## Flow rules

Every user action (chip pick, overlay dismiss) must either:
- Call `advanceStep()` to continue the flow, OR
- Produce a visible Ryan response (streaming nudge message + retry button)

No silent dead-ends. If the user dismisses something, Ryan acknowledges it and gives them a path back.

## Edge cases

- User exits wrapped story mid-way → carousel auto-scrolls horizontally to center the first unrevealed card
- User taps revealed card → story opens in review mode with quips shown instantly (no typewriter delay)
- User dismisses AA flow → Ryan nudge streams + "Connect account" button
- User dismisses questionnaire → Ryan nudge streams + "Set a goal" button
- `paddingBottom` on chat container is always `SPACE_L` (24px) - the bottom spacer element handles quiz clearance (260px when open, 80px otherwise)
