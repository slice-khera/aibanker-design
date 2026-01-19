# Slice Banker Prototype — Implementation Plan

## Current Status

### Completed ✅
| Feature | Status | Notes |
|---------|--------|-------|
| Month Wrapped FTUE | ✅ Done | 6-slide carousel with stat cards |
| Persona Quiz | ✅ Done | 5 questions, response capture |
| Reality Check | ✅ Done | Dynamic gap analysis |
| Goal Setup | ✅ Done | Choice → timeline → amount → pace → product |
| Pace Calibration | ✅ Done | 3 presets with lever suggestions |
| Product Recommendation | ✅ Done | RD/Autosave based on pace |
| Budget Handshake | ✅ Done | On-track vs off-track paths |
| Steady State Home | ✅ Done | Rotating insights + chip tray |
| Can I Afford subflow | ✅ Done | Goal-aware tradeoffs |
| Worth It subflow | ✅ Done | Regret → action pipeline |
| Find Leaks subflow | ✅ Done | Bucket/cap with tradeoffs |
| Progress subflow | ✅ Done | Boost options |
| Power-ups subflow | ✅ Done | Autosave/RD/FD setup |
| Tradeoff system | ✅ Done | Reduce elsewhere vs extend |
| Config-driven profiles | ✅ Done | Easy persona expansion |
| Dark mode UI | ✅ Done | Polished gradients |
| Animations | ✅ Done | Messages, chips, success states |
| Pinned goal card | ✅ Done | Icon + status display |

### Not Yet Implemented
| Feature | Priority | Notes |
|---------|----------|-------|
| Additional profiles | Low | Config structure ready |
| Receipts drawer content | Low | UI shell exists |
| Typing indicator | Low | Component ready, not wired |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom animations
- **State:** React useState/useCallback (in-memory only)
- **Runtime:** Bun
- **Backend:** None (mock data only)

---

## File Structure

```
aibankerv0.01/
├── app/
│   ├── page.tsx                    # Main flow controller (1092 lines)
│   ├── globals.css                 # Animations + dark theme
│   ├── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── Chat.tsx               # Message list + chips + drawer (215 lines)
│   │   └── WrappedCarousel.tsx    # 6-slide FTUE (137 lines)
│   └── data/
│       ├── flows.ts               # All chip options + slide content
│       ├── mockProfiles.ts        # Weekend baller profile + helpers
│       └── profiles.ts            # Profile registry + lookup
├── docs/
│   ├── prototype-spec.md          # Product specification
│   └── implementation-plan.md     # This file
├── package.json
├── bun.lock
└── tsconfig.json
```

---

## Architecture

### State Machine

```
┌──────────┐    ┌─────────┐    ┌─────────┐    ┌──────┐    ┌────────┐    ┌──────┐
│ wrapped  │───▶│ persona │───▶│ reality │───▶│ goal │───▶│ budget │───▶│ home │
└──────────┘    └─────────┘    └─────────┘    └──────┘    └────────┘    └──────┘
     │               │              │             │            │            │
     │               │              │             │            │            │
   6 slides      5 stages       1 stage      6 stages     7 stages    9 subflows
```

### Flow Step Types

```typescript
type FlowStep = "wrapped" | "persona" | "reality" | "goal" | "budget" | "home";
```

### Sub-state Types

```typescript
// Persona quiz progression
type PersonaStage = "q1" | "q2" | "q2-follow" | "q3" | "q4";

// Goal setup progression
type GoalStage = "choice" | "timeline" | "amount" | "pace" | "budget-review" | "product" | "pinned";

// Budget handshake progression
type BudgetStage = "digest" | "onTrack" | "lever" | "budgetChoice" | "budgetStyle" | "action" | "actionConfirm";

// Home screen subflows
type HomeSubflow =
  | "idle"
  | "afford-amount" | "afford-timing" | "afford-result"
  | "worth-pick" | "worth-rate" | "worth-reason" | "worth-action"
  | "leaks-pick" | "leaks-rate" | "leaks-fix"
  | "progress-view" | "progress-boost"
  | "powerup-pick" | "powerup-amount" | "powerup-confirm"
  | "tradeoff";

// Pace selection
type PaceStage = "summary" | "select";
```

---

## Detailed Flow Documentation

### 1. Month Wrapped Flow

**Entry:** App load
**Exit:** `handleWrappedComplete()` → persona stage

```
User opens app
    │
    ▼
WrappedCarousel renders 6 slides
    │
    ├── Slide 1: Intro (no stat)
    ├── Slide 2: Top category (stat: 28%)
    ├── Slide 3: Pattern (stat: After 10pm)
    ├── Slide 4: Leak (stat: 2-3/week)
    ├── Slide 5: Saving vibe (stat: Save later)
    └── Slide 6: CTA (Start button)
              │
              ▼
         onComplete()
              │
              ▼
         setStep("persona")
         Show first quiz question
```

**Key code:**
```typescript
const handleWrappedComplete = () => {
  setStep("persona");
  setPersonaStage("q1");
  setMessages([
    { id: "persona-intro", role: "assistant", text: "Alright, let's see how well you know yourself." },
    { id: "persona-q1", role: "assistant", text: personaQuestions[0].text },
  ]);
  setActiveChips(toChips(personaQuestions[0].chips));
};
```

---

### 2. Persona Quiz Flow

**Entry:** After wrapped complete
**Exit:** `startReality()` → reality check

```
Q1: Savings guess
    │
    ▼ (user picks chip)
Q2: Disposable category
    │
    ▼
Q2-follow: Category share
    │
    ▼
Q3: Persona self-ID
    │
    ▼
Q4: Confidence
    │
    ▼
startReality()
```

**Response capture:**
```typescript
setUserResponses((prev) => ({ ...prev, [personaStage]: chip.id }));
```

**Progression logic:**
```typescript
const stages: PersonaStage[] = ["q1", "q2", "q2-follow", "q3", "q4"];
const currentIdx = stages.indexOf(personaStage);
if (currentIdx >= stages.length - 1) {
  startReality();
  return;
}
const nextStage = stages[currentIdx + 1];
```

---

### 3. Reality Check Flow

**Entry:** After persona complete
**Exit:** `startGoal()` → goal setup

```
Show personalized gap analysis
(violet gradient styling)
    │
    ▼ (user picks any chip)
startGoal()
```

**Dynamic copy generation:**
```typescript
const realityText = getRealityCheckText(profile, {
  savingsGuess: userResponses["q1"] || undefined,
  personaGuess: userResponses["q3"] || undefined,
});
addMessage("assistant", realityText, "reality-check");
```

---

### 4. Goal Setup Flow

**Entry:** After reality check
**Exit:** `finishBudget({ skipInsight: true })` → home

```
Stage: choice
    │ (user picks goal or types)
    ▼
Stage: timeline
    │ (3mo / 6mo / 12mo / someday)
    ▼
Stage: amount
    │ (₹50k / ₹1L / ₹5L / ₹10L / Skip)
    ▼
Stage: pace (summary)
    │
    ├── "Looks good" → Stage: budget-review
    │
    └── "Tweak pace" → Stage: pace (select)
                            │
                            ▼
                       Pick aggressive/balanced/relaxed
                            │
                            ▼
                       Back to pace (summary)
    │
    ▼
Stage: budget-review
    │ (show category budgets + buffer bucket)
    │
    ├── "Looks good" → Stage: product
    └── "Edit budgets" → Free text edit → Stage: product
    │
    ▼
Stage: product
    │
    ├── Primary CTA → Success message → finishBudget({ skipInsight: true })
    ├── Secondary CTA → Show alternatives
    ├── Change pace → Back to pace (select)
    └── Skip → Skip message → finishBudget({ skipInsight: true })
```

**Pace selection:**
```typescript
const getDefaultPaceId = (timeline?: string) => {
  if (!timeline) return "balanced";
  if (timeline === "3 months" || timeline === "6 months") return "aggressive";
  if (timeline === "12 months") return "balanced";
  return "relaxed";
};
```

**Success confirmation:**
```typescript
if (chip.id === "product-primary") {
  addMessage(
    "assistant",
    `${action.headline} is now active.\n\nYou'll hit ${goalName} in ${eta}.`,
    "success",  // Triggers green gradient + checkmark animation
  );
}
finishBudget({ skipInsight: true });  // Skip insight on goal completion
```

---

### 5. Budget Handshake Flow

**Entry:** From "Show plan" in pinned goal chips
**Exit:** `finishBudget()` → home

```
Stage: digest
    │
    ├── "I'm okay with this pace" → Stage: onTrack
    │                                  │
    │                                  ├── "Make it automatic" → budgetChoice
    │                                  ├── "Just keep me posted" → finishBudget()
    │                                  └── "Set backup buffer" → budgetChoice
    │
    └── "Show me what to cut" → Stage: lever
                                   │
                                   ├── Pick a lever → budgetChoice
                                   └── "Don't change" → finishBudget()
    │
    ▼
Stage: budgetChoice
    │
    ├── "Yes, set it" → actionConfirm
    ├── "No, just track" → actionConfirm
    └── "Let me choose" → budgetStyle
                            │
                            ▼
                       Pick strict/chill/bucket
                            │
                            ▼
                       actionConfirm
    │
    ▼
Stage: actionConfirm
    │
    ▼
finishBudget()
```

---

### 6. Home Subflows

**Entry:** After goal complete or budget complete
**Default state:** Show insight + 5 chip tray

#### 6a. Can I Afford Subflow

**Two paths based on affordability:**

```
afford-amount
    │ (pick ₹1.5k / ₹3k / ₹5k / ₹10k)
    ▼
afford-timing
    │ (pick This week / Before month end / Next month)
    ▼
Affordability check
    │
    ├── EASY PATH (status: "safe")
    │   │ Show: "Based on current & projected spends, 
    │   │        you can easily incorporate this."
    │   └──> "Go for it!" → returnToSteadyState()
    │
    └── TRADEOFF PATH (status: "tight" or "risky")
        │ Show goal impact: "Risky. Behind by ~3 days"
        ▼
    afford-result
        │
        ├── "Treat" → tradeoff (treat-choice)
        │               │
        │               ├── Update buffer → bucket-select → decision
        │               ├── Cap → decision
        │               └── Nudge → returnToSteadyState()
        │
        └── "Plan" → tradeoff (plan-choice)
                        │
                        ├── Add to goal → returnToSteadyState()
                        ├── Reduce elsewhere → leaks-fix
                        └── Extend timeline → returnToSteadyState()
```

#### 6b. Worth It Subflow

```
worth-pick
    │ (pick transaction from receipts)
    ▼
worth-rate
    │
    ├── "Worth it" → "Joy is valid" → returnToSteadyState()
    ├── "Meh" → "We all have those" → returnToSteadyState()
    └── "Regret" → worth-reason
                      │
                      ▼
                   worth-action
                      │
                      ├── "Nudge" → returnToSteadyState()
                      ├── "Set cap" → startBucketTradeoff()
                      └── "Mute" → returnToSteadyState()
```

#### 6c. Find Leaks Subflow

```
leaks-pick
    │ (pick suspect: Food spike / Shopping / Subscriptions)
    ▼
leaks-rate
    │
    ├── "Joy" → "Want a guilt-free bucket?"
    └── "Regret" → "Let's fix it"
    │
    ▼
leaks-fix
    │
    ├── "Bucket" → startBucketTradeoff()
    ├── "Cap" → startBucketTradeoff()
    ├── "Nudge" → returnToSteadyState()
    └── "Mute" → returnToSteadyState()
```

#### 6d. Progress Subflow

```
progress-view
    │ (show: "~3 days ahead this month")
    │
    ├── "Boost" → progress-boost
    │               │
    │               ├── Autosave → show suggestion
    │               ├── RD → show suggestion
    │               └── Cut something → show levers
    │
    ├── "Keep as is" → returnToSteadyState()
    └── "Pause" → returnToSteadyState()
```

#### 6e. Power-ups Subflow

```
powerup-pick
    │ (Autosave / RD / FD)
    ▼
powerup-amount
    │ (context-specific options)
    ▼
powerup-confirm
    │
    ├── "Confirm" → Success message → returnToSteadyState()
    └── "Cancel" → returnToSteadyState()
```

#### 6f. Tradeoff Subflow

```
tradeoff (bucket-select)
    │ (pick bucket size: ₹2k / ₹3k / ₹5k)
    ▼
tradeoff (decision)
    │
    ├── "Reduce elsewhere" → show reduction copy
    └── "Extend timeline" → show extension copy
    │
    ▼
returnToSteadyState()
```

---

## Data Model

### MockProfile Type

```typescript
type MockProfile = {
  id: string;
  label: string;
  
  wrapped: {
    top_category_label: string;
    top_category_share_pct: string;
    second_category_label: string;
    second_category_share_pct: string;
    late_night_spend_flag: "low" | "med" | "high";
    late_night_intensity: string;
    weekend_spike_flag: boolean;
    spike_days_per_week: string;
    money_personality_label: string;
    saving_vibe: string;
  };
  
  persona: {
    user_guess_savings_pct: string;
    actual_savings_pct: string;
    savings_gap: string;
    user_guess_category: string;
    user_guess_category_pct: string;
    actual_category_pct: string;
    category_gap: string;
    persona_guess: string;
    persona_actual: string;
  };
  
  goal: {
    goal_name: string;
    goal_type: string;
    goal_amount: string;
    horizon: string;
    required_savings_pct: string;
    current_savings_pct: string;
    savings_gap_pct: string;
    is_on_track: boolean;
    days_ahead_behind: string;
  };
  
  action: {
    suggested_cut_amount_month: string;
    suggested_cut_category: string;
    suggested_cut_description: string;
    suggested_autosave_day: string;
    suggested_rd_month: string;
    idle_cash_claim: string;
    bill_risk_event: string;
    surplus_amount: string;
  };
  
  receipts: Receipt[];
  
  suggested_budgets: {
    overall_budget: string;
    buffer_bucket: string;
    categories: Array<{
      name: string;
      budget: string;
    }>;
  };
  
  pace_presets: PacePreset[];
  tradeoff_rules: TradeoffRules;
  goal_completion_actions: GoalCompletionAction[];
  insights: InsightCard[];
};
```

### PacePreset Type

```typescript
type PacePreset = {
  id: "aggressive" | "balanced" | "relaxed";
  label: string;
  pace_window: string;
  required_monthly_cut: string;
  lever_examples: string[];
  feasibility_note: string;
  recommended_product: {
    type: "rd" | "autosave";
    label: string;
    copy: string;
  };
};
```

### TradeoffRule Type

```typescript
type TradeoffRule = {
  id: string;
  label: string;
  monthly_cost: string;
  extend_timeline: string;
  reduce_elsewhere: string;
  nudge_text: string;
  cap_text: string;
};
```

### GoalCompletionAction Type

```typescript
type GoalCompletionAction = {
  pace_id: "aggressive" | "balanced" | "relaxed";
  headline: string;
  copy: string;
  primary_cta: string;
  secondary_cta: string;
};
```

---

## UI Components

### Chat.tsx

**Props:**
```typescript
type ChatProps = {
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  chips: ChatChip[];
  onChipSelect: (chip: ChatChip) => void;
  showInput?: boolean;
  inputPlaceholder?: string;
  onSubmit?: (value: string) => void;
  headerActions?: HeaderAction[];
  drawerContent?: React.ReactNode;
  pinnedContent?: React.ReactNode;
  showTyping?: boolean;
};
```

**Message types:**
```typescript
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  special?: "reality-check" | "goal-pinned" | "insight" | "success";
};
```

**Chip variants:**
```typescript
type ChatChip = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "destructive" | "success";
};
```

### WrappedCarousel.tsx

**Props:**
```typescript
type WrappedCarouselProps = {
  slides: WrappedSlide[];
  onComplete: () => void;
};
```

**Slide type:**
```typescript
type WrappedSlide = {
  id: string;
  headline: string;
  punchline: string;
  stat?: {
    label: string;
    value: string;
    caption?: string;
  };
  receipts?: boolean;
};
```

---

## Animations (globals.css)

| Animation | Use Case |
|-----------|----------|
| `fadeInUp` | Messages appearing |
| `slideInRight` | User messages |
| `slideInLeft` | Assistant messages |
| `successPop` | Success confirmation |
| `checkmark` | SVG checkmark draw |
| `pulse` | Typing indicator dots |
| `scaleIn` | Stat cards in carousel |
| `shimmer` | Loading states |
| `float` | Subtle hover effects |
| `glow` | Success state glow |

**Stagger delays:**
```css
.animate-delay-1 { animation-delay: 0.05s; }
.animate-delay-2 { animation-delay: 0.1s; }
.animate-delay-3 { animation-delay: 0.15s; }
.animate-delay-4 { animation-delay: 0.2s; }
.animate-delay-5 { animation-delay: 0.25s; }
```

---

## Running the Prototype

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Default port
open http://localhost:3000

# If port in use, try
bun dev --port 3005
```

---

## Testing Checklist

### FTUE Flow
- [x] Wrapped carousel shows all 6 slides
- [x] Visual stat cards appear on slides 2-5
- [x] Progress dots are clickable
- [x] Back/Next navigation works
- [x] Swipe gestures work
- [x] Start button transitions to persona

### Persona Quiz
- [x] All 5 questions appear in sequence
- [x] User responses are captured in state
- [x] Quiz completes and transitions to reality check

### Reality Check
- [x] Shows personalized gap analysis
- [x] Uses violet gradient styling
- [x] Dynamic copy based on user guesses
- [x] Any chip leads to goal setup

### Goal Setup
- [x] Chip selection works
- [x] Free text input works
- [x] Timeline follow-up appears
- [x] Amount follow-up appears
- [x] Pace calibration shows (aggressive/balanced/relaxed)
- [x] Pace can be changed
- [x] Budget review shows category budgets and buffer bucket
- [x] Budget review can be approved
- [x] Budget review can be edited (free text)
- [x] Product recommendation shows after budget approval
- [x] Primary CTA has green variant
- [x] Success animation on confirm
- [x] No redundant insight after goal completion

### Budget Handshake
- [x] Digest shows current vs selected pace
- [x] On-track path offers budget setup
- [x] Off-track path shows levers
- [x] Budget style options appear
- [x] Confirmation transitions to home

### Steady State (Home)
- [x] Insight appears (unless skipInsight)
- [x] Chip tray shows 5 options
- [x] Receipts drawer toggles
- [x] Pinned goal card shows

### Subflows
- [x] Can I afford: amount → timing → affordability check
  - [x] Easy path: Shows "easily incorporate" message and ends
  - [x] Tradeoff path: Shows impact → treat/plan → tradeoff options
- [x] Worth it: transaction → rating → reason → action
- [x] Find leaks: suspect → rating → fix → tradeoff
- [x] Progress: summary → boost options
- [x] Power-ups: type → amount → confirm → success

### Tradeoff System
- [x] Bucket size selection
- [x] Reduce vs extend choice
- [x] Goal-aware copy throughout

### Visual Polish
- [x] Dark mode consistent
- [x] Message animations (slide in)
- [x] Chip animations (stagger fade)
- [x] Success animations (pop + checkmark)
- [x] Gradient backgrounds
- [x] Custom scrollbar

### Reset
- [x] Restart button resets all state
- [x] Flow begins from wrapped again
