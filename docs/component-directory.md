# Component Directory

Living index of every component in the app. Each entry links to its playground preview.

---

## Chat & Messaging

### Chat
Main chat interface with bubbles, typewriter animation, suggestion chips, and streaming indicator.
- Preview: `/preview?component=Chat`
- Status: Active

### ChatCards
20+ embedded data visualization cards (spend overview, category breakdown, goals, investments, transactions, obligations, heatmap, etc.).
- Preview: `/preview?component=ChatCards`
- Status: Active

### ChatInitialScreen
Welcome screen shown before first interaction — suggested prompts and greeting.
- Status: Active (rendered inside Chat)

---

## Goal System

### GoalTracker
Animated circular progress rings for 0-3 savings goals. Supports pct/icon inner variants, ahead/behind/on-track status.
- Preview: `/preview?component=GoalTracker`
- Status: Active

### GoalListScreen
Full-screen list of all savings goals with push-left navigation.
- Status: Active (overlay in main app)

### PotDetail
Drill-down detail view for a single savings pot/goal.
- Status: Active (overlay in main app)

---

## Planning & Onboarding

### PlanMode
Step checklist with animated progress ring — shows plan stages (saving for, timeline, amount, pace, etc.).
- Preview: `/preview?component=PlanMode`
- Status: Active

### PlanCruncherV2
Spinner-based "crunching your plan" animation with celebration state.
- Status: Active (used inside PlanMode sims)

### QuestionnaireOverlay
Multi-step question/answer modal for goal creation and budget setup.
- Status: Active

### QuizCardStack
Swipeable card-based quiz format for onboarding personality quiz.
- Status: Active

### InsightCarousel
Horizontal scrollable carousel of insight/stat cards (used in onboarding Wrapped).
- Status: Active

### WrappedCarousel
Story-style full-screen carousel (Spotify Wrapped format) for month review.
- Status: Kept (no active consumers, preserved for future use)

---

## App Shell

### AppChrome
Status bar, app bar (Standard/L1), NavButton (back/close), FooterInset, GestureNav.
- Preview: `/preview?component=AppChrome`
- Status: Active

### PayScreen
Static payment/UPI screen used as the background layer behind chat.
- Status: Active

### MockKeyboard
Simulated mobile keyboard for input field previews in sims.
- Status: Active (preview sims only)

---

## Drawer & Navigation

### DrawerExperience
Experimental push-up/pull-down drawer with My Money layer + Chat sheet overlay.
- Preview: `/preview?component=DrawerExperience`
- Status: Exploration

---

## Design Tokens

All tokens live in `app/lib/`:

| Token | File | Examples |
|-------|------|---------|
| Colors | `colors.ts` | VALENTINO_500, GREEN_500, TEXT_PRIMARY, BG_SURFACE |
| Typography | `typography.ts` | headerH4, bodySmall, caption, metadata, buttonSmall |
| Spacing | `spacing.ts` | SPACE_XS (4px), SPACE_M (16px), SPACE_L (24px) |
| Radii | `radii.ts` | RADIUS_PILL, RADIUS_CIRCLE |
| Elevation | `elevation.ts` | Card, Above, Below shadow levels |

---

## User State Personas

Available via `/?persona=<id>` on the main app:

| Persona | Description |
|---------|-------------|
| `new-user` | First open, no data |
| `mid-onboarding` | Finished Wrapped, no goal yet |
| `onboarded-idle` | Post-onboarding, home, no goal |
| `goal-on-track` | Active goal, balanced, ~50% |
| `goal-behind` | Active goal, behind schedule |
| `goal-completed` | Goal at 100% |
| `post-budget` | Goal + budget done, guardrails active |
| `multiple-goals` | 2-3 goals at different stages |
| `returning` | 2+ weeks absent, re-engagement |
