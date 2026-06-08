# AA Flow

The Account Aggregator (AA) flow is the bank-linking journey. It lives in a single component,
[AASim.tsx](../app/preview/AASim.tsx), and is the one source of truth: both onboarding
([OnboardingSim.tsx](../app/preview/OnboardingSim.tsx)) and the
[flows playground](../app/(main)/playground/flows/page.tsx) render it, so any change here
cascades everywhere the flow is called.

Preview: `/preview?component=AA`. Playground: `/playground/flows` → "Account aggregator".

---

## Flow (happy path)

| # | Screen | Notes |
|---|--------|-------|
| 1 | Value prop | Benefit list + inline "Learn more" link. FAB starts account discovery → OTP. |
| 2 | Learn more (overlay) | Slides up; X to close; supported banks + 4 benefits + aggregator logos. |
| 3 | OTP (discovery) | 4-digit OTP, clear button, countdown + Resend. Continue → Link bank accounts. |
| 4 | Link bank accounts | Scrollable list of fetched accounts; each a bordered card. Selected rows get a purple border (no checkbox). Confirm enabled once ≥1 is selected → Approve consent. |
| 5 | Approve consent | Selected accounts as a flat list (one row each), "Personal finance management" consent card with a chevron that opens the consent detail, Onemoney footer. "Skip" (purple) top-right. Approve → confirm OTP. |
| 6 | Consent detail (overlay) | Opened by tapping the consent card. Per-row icons, info `(i)` opens a bottom sheet. |
| 7 | OTP (confirm) | Same OTP screen reused to confirm consent. Continue ends the flow (`onComplete`). |

The two OTP steps are the same screen driven by an `otpContext` flag (`discovery` vs `confirm`):
discovery routes forward to Link bank accounts, confirm completes the flow.

### Link bank accounts (screen 4)

- Title "Link bank accounts", short subtitle.
- Rows come from `AA_FETCHED_ACCOUNTS` in
  [onboardingFixture.ts](../app/preview/fixtures/onboardingFixture.ts) — currently 5 mock
  accounts, two sharing a bank (HDFC), to exercise grouping.
- Each row reuses [ListItemControl](../app/components/ListItemControl.tsx) in its `card` form
  (no trailing control, `kind="none"`) with a leading bank-logo avatar. Selection is shown by a
  2px VALENTINO_500 border on the card; unselected rows use the subtle outline (Figma node
  188:3861).
- Multi-select; the chosen accounts are carried into the Approve consent screen.

### Approve consent (screen 5)

- Top-right CTA is **Skip** (VALENTINO_500); it dismisses the flow via `onClose`.
- The selected accounts are listed as a flat set of rows (Figma node 188:4110): a bank-logo
  avatar, a `Bank xxmask` title and the account type as subtext. No grouping, no dividers.
- A single consent card ("Personal finance management") from `AA_CONSENT_CARDS`, showing
  Frequency and Time period in two columns. A chevron on the card opens the consent detail
  overlay (where the info `(i)` bottom sheets live). Footer keeps the Onemoney logo.

---

## Branch states (playground variants)

Switch via the toggle on the "Account aggregator" card.

| Variant | Start | Notes |
|---|---|---|
| Happy | value-prop | Full end-to-end happy path above. |
| No accounts | no-accounts (empty) | Illustration empty state + Change phone number CTA. |
| Alternates | no-accounts (with list) | "Other accounts found" list; tapping a tile carries it into Approve consent. |
| Out of attempts | OTP (errored) | Pre-filled "1234", red underline + "OUT OF ATTEMPTS" + disabled Continue. |

---

## DLS 2.0 notes

- No raw hex in [AASim.tsx](../app/preview/AASim.tsx) or the AA fixtures; colors, spacing, radii,
  elevation and typography all come from the DLS token libs.
- The selectable account row is the DLS list-item-control component (card + checkbox variant),
  not a bespoke tile.
- All bank and aggregator logos referenced exist under `public/icons/banks/` and
  `public/icons/aggregators/`.

## Outstanding / copy to confirm

- "Consent validity" and "Data life" info-sheet bodies in `AA_INFO_TOOLTIPS` are review-ready
  drafts; adjust copy as needed.
