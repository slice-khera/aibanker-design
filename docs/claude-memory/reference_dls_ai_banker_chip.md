---
name: DLS 2.0 AI Banker Chip
description: Ryan's entry-point pill on the pay screen. Progresses Meet → Ready → Chat → Attention.
type: reference
originSessionId: a33d0411-6d63-42f9-a0ca-86375f2e538a
---
The AI Banker chip is the tappable purple pill that sits in the pay-screen header pill row, just above the spend amount. It's the user's affordance into a conversation with the AI banker persona (Ryan or Byron). Sits alongside the static "5 new sparks" and "3 fires left" info pills - but only this one is interactive.

## Anatomy
- Shape: pill, fully rounded
- Height: 32px (10px vertical padding + 12px caption text)
- Padding: 10px 16px
- Icon: 16×16, leading
- Gap between icon and label: 4px
- Background: `VALENTINO_400` (#DE45E1) - closest DLS token to Figma's `#d828dc`; one step lighter than the surface so the pill reads as distinct
- Surface it sits on: `VALENTINO_500` (#D30AD7) - the pay-screen brand magenta
- Border: 1.5px `ALPHA_WHITE_05`
- Label: `typography.caption` (12/16, Rubik 400), color `rgba(255,255,255,0.9)`
- Press feedback: `active:scale(0.97)`
- Wrapper span: `position: relative; display: inline-flex; flex-shrink: 0; z-index: 1`. The `flex-shrink: 0` is required because the chip lives inside a flex row that would otherwise blockify the wrapper's `inline-flex` to `flex` and shrink it below the button's content width, clipping the halo on the right. The `z-index: 1` keeps the halo painting on top of sibling pills (sparks/fires) so the pulse isn't covered.

## States

| State | Default label | Behavior |
|---|---|---|
| `firstTime` | "Meet Ryan" | Static. First-time invitation - Ryan hasn't been opened yet. |
| `alert` | "Ryan is ready" | **Pulsing.** Ryan has finished prep and is waiting - the "ready" moment is itself the notification, so this state shows the animated halo to pull the eye. |
| `default` | "Chat with Ryan" | Static. After the first interaction, the chip becomes the persistent re-entry point. |

Labels can be overridden per persona (e.g. "Byron is ready" for the Byron voice) via a `label` prop - the state defines the visual treatment, not the copy.

## Alert pulse - animation spec
- Two pill-shaped halos sit behind the chip, each animating a `box-shadow` ring that grows uniformly outward on all sides (top + bottom + left + right). The second halo runs at `animation-delay: 1.1s` (half-cycle offset) so one wave is always visible - the eye reads continuous motion rather than a once-per-cycle blink
- Keyframes: `box-shadow: 0 0 0 0 rgba(255,255,255,0.15)` → `0 0 0 12px rgba(255,255,255,0)` - soft white-alpha, contained reach, so the ring reads against the magenta surface without shouting
- Duration: 2.2s, easing: `ease-out`, loop: infinite
- No layout shift - halos are absolutely positioned within the chip's relative wrapper
- Halos only mount when `state === "alert"` so the animation isn't running idle
- **Halo needs vertical breathing room.** The host row's `overflow-x: auto` forces `overflow-y` to also clip, so the halo's 12px top/bottom reach would be cut off. Whatever row hosts the chip in the alert state must give itself `paddingTop`/`paddingBottom` ≥ 12px (use `SPACE_S`) and compensate the position with an equal `transform: translateY(-12px)` on the outer wrapper to keep the pills at the original visual line. PayScreen does this; any new host should too.

## Placement
- Pay-screen pill row at ~17% from the top of the screen (with `translateY(-SPACE_S)` to offset the row's vertical padding so the chip still lands on the 17% line)
- First (leftmost) slot in the row; sparks + fires pills sit to its right
- Row layout: `gap: SPACE_S` (12px between pills), `paddingLeft/Right: SPACE_L` (24px row inset), `paddingTop/Bottom: SPACE_S` (12px to contain the halo)
- Static sibling pills (sparks/fires) share the chip's surface color (`VALENTINO_400`), border, radius and padding
- Horizontal scroll allowed on the row, but the chip is always the first item

## When to use which state
- `firstTime` - pre-onboarding, before the user has met Ryan
- `alert` - during onboarding (or any later moment when Ryan needs the user's attention). The pulse IS the alert signal - no separate badge needed
- `default` - steady state after first interaction

## Tokens
- `VALENTINO_400` - chip fill (closest token to Figma `#d828dc`; no raw hex)
- `rgba(255,255,255,0.15) → 0` - pulse ring colour (raw rgba inside `box-shadow` string; no DLS alpha token matches)
- `ALPHA_WHITE_05` - border
- `ALPHA_WHITE_90` - label colour
- `typography.caption` - label type
- `RADIUS_XL` - pill radius
- `SPACE_S` - row gap, row paddingTop/Bottom, and the row's compensating `translateY`
- `SPACE_L` - row paddingLeft/Right
- Icon: `/icons/placeholder.svg` (placeholder - real Ryan/Byron avatar icon TBD)

## Notes
- The two static info pills ("5 new sparks", "3 fires left") share the same visual skin but are not interactive and aren't part of this component - they remain inline in PayScreen.
- Persona-aware copy (Ryan vs Byron) flows in through the `label` override, not through new states.
