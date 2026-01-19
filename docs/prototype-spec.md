# Slice Banker Prototype Spec (Chat-First)

## Implementation Status

### Completed Features
- [x] Month Wrapped FTUE (6-slide carousel with visual stat cards)
- [x] Persona Quiz (5 questions with chip responses)
- [x] Reality Check (personalized gap analysis with dynamic copy)
- [x] Goal Setting (choice → timeline → amount → pace → product)
- [x] Pace Calibration (aggressive/balanced/relaxed with lever suggestions)
- [x] Product Recommendation (RD/Autosave based on pace)
- [x] Budget Handshake (on-track vs off-track paths)
- [x] Steady State Home (rotating insights + 5 chip actions)
- [x] Can I Afford subflow (with goal-aware tradeoffs)
- [x] Worth It subflow (with regret handling)
- [x] Find Leaks subflow (with bucket/cap tradeoffs)
- [x] Progress subflow (boost options)
- [x] Power-ups subflow (autosave/RD/FD)
- [x] Tradeoff system (reduce elsewhere vs extend timeline)
- [x] Success animations for RD/Autosave setup
- [x] Dark mode with polished UI
- [x] Config-driven profiles for easy persona expansion

---

## Purpose
- Shippable prototype that feels real without real AI or math.
- Focus on chat-first flow, chips, and scripted insights.
- Convey: "this understands me," "my behavior impacts my goal," and "Slice can operationalize actions."

## IA + Navigation
- Entry flow: Month Wrapped → Persona Quiz → Reality Check → Goal Setup → Chat Home.
- From Chat Home: Receipts drawer (stub), Edit goal/budgets, Power-ups.

---

## 1) Month Wrapped (6-slide FTUE)

**Format:**
- Swipeable slides, 1 message each, mostly % + patterns, not ₹.
- Visual stat cards per slide (gradient cards with label/value/caption).
- Single Continue/Start button (no per-slide chips).
- Progress indicator with animated dots (clickable).
- Smooth slide transitions with directional awareness.

**Slides (copy):**

| # | Headline | Punchline | Stat Card |
|---|----------|-----------|-----------|
| 1 | Your Month Wrapped 🎬 | Your spending had a personality this month. Let's diagnose it in 60 seconds. | — |
| 2 | Top category | Your #1 category was Food & Delivery. It dominated ~28% of your variable spend. | Top category share: 28% |
| 3 | Your pattern | You tend to crave late-night munchies. Most delivery happens after 10pm. | Peak time: After 10pm |
| 4 | A leak (no judgment) | You had 2–3 spike days/week where spending jumps. Usually weekends. | Spike days: 2–3 / week |
| 5 | Your saving vibe | You seem like a "save later" person. You prefer flexibility over strict budgets. | Saving vibe: Save later |
| 6 | Ready for the fun part? | Tell me what you think you do… then I'll show you reality. | — |

---

## 2) Persona Quiz (Perceived behavior)

**Goal:** Capture perceived savings, category split, persona, confidence.

**Format:** Chat bubbles with chips; 5 questions total; always include "I don't know" option.

| Stage | Question | Chips |
|-------|----------|-------|
| Q1 | Be honest — roughly what % of your income do you save each month? | 0–5% / 5–10% / 10–20% / 20%+ / No idea |
| Q2 | Of your disposable money (after bills), where does most go? | Food / Shopping / Travel / Subscriptions / Nights out / Other |
| Q2-follow | Pick the biggest one's share: | 10% / 20% / 30% / 40%+ / No idea |
| Q3 | What's your spending persona according to you? | Disciplined / Weekend splurger / Impulse buyer / Convenience spender / Subscription collector / I'm complicated |
| Q4 | How confident are you in those answers? | Very / Somewhat / Guessing |

---

## 3) Reality Check (Delight + motivation)

**Format:** Single message with violet gradient styling, comparing user guesses to reality.

**Copy template:**
```
Alright. Reality check time 👀 Here's how close you were:

Savings: You guessed {user_guess}% → actual ~{actual}% (gap {gap} pts)
Food: You guessed {guess_category}% → actual ~{actual_category}% (gap {category_gap} pts)
Persona: You guessed "{persona_guess}" → reality "{persona_actual}" 😅

Good news: you're not bad with money — your money just has habits.
```

**Chips:**
- Help me save more
- Help me control Food
- Help me control Shopping

*(Skip to goal chip removed — goal setup always follows)*

---

## 4) Goal Setting

### Stage 1: Goal Choice
**Prompt:** "Now tell me what we're building toward. Pick one or type your own."

**Chips:** Trip / Big purchase / Emergency fund / Increase savings / Quit-job fund

**Free text support:** Users can type custom goals like "Save 10L so I can quit"

### Stage 2: Timeline
**Prompt:** "When do you want this by?"

**Chips:** 3 months / 6 months / 12 months / Just someday

### Stage 3: Amount
**Prompt:** "If you know the amount, drop it. Or skip."

**Chips:** ₹50k / ₹1L / ₹5L / ₹10L / Skip

### Stage 4: Pace Calibration

Based on timeline, system suggests a default pace and shows what it takes:

| Pace | Copy Template |
|------|---------------|
| Aggressive | Pace: Aggressive (7 months). To make this real, you'd need to cut about ₹10k/month. {feasibility_note}. Top ways: {lever_examples}. Suggested action: Start an RD at month start. |
| Balanced | Pace: Balanced (10 months). To make this real, you'd need to cut about ₹5k/month. {feasibility_note}. Top ways: {lever_examples}. Suggested action: Daily autosave ₹150/day. |
| Relaxed | Pace: Relaxed (14 months). To make this real, you'd need to cut about ₹2k/month. {feasibility_note}. Top ways: {lever_examples}. Suggested action: Set up a light autosave. |

**Chips:** Looks good, continue / Let me tweak the pace

If "tweak pace" → show pace picker: Aggressive / Balanced / Relaxed

### Stage 5: Budget Review

After pace confirmed, show category-wise budgets and buffer bucket:

**Copy:**
```
Based on your last few months, I've set up these budgets:

Overall monthly budget: {overall_budget}
Buffer bucket (miscellaneous): {buffer_amount}

Category budgets:
• {category_1}: {budget_1}
• {category_2}: {budget_2}
• {category_3}: {budget_3}
• ...

This keeps you on track for your goal. Any edits?
```

**Chips:** Looks good / Edit budgets

**Edit flow:** Users can type edits like "update Food to ₹10k" or "update buffer to ₹5k"

### Stage 6: Product Recommendation

After budget approved, show lever review + product CTA:

**Copy:**
```
If you want the {pace} pace for {goal_name}, here are the most realistic levers:
• {lever_1}
• {lever_2}
• {lever_3}

{Product headline}
{Product copy}
```

**Chips (primary CTA highlighted in green):**
- ✓ Start an RD at month start (or daily autosave variant)
- Show smaller options
- Change pace
- Skip for now

### Stage 7: Success Confirmation

On primary CTA click, show success animation with green gradient:

**Copy:** "{Headline} is now active. You'll hit {goal_name} in {timeline}."

Then transition directly to home (no redundant insights).

---

## 5) Budget + Plan Handshake

**Digest (shows after "Show plan" from pinned goal):**
```
Based on your current habits:
• You're saving ~{current_savings_pct} right now.
• To hit the {pace} pace, you'd need to cut about {required_cut}/month.

You can either keep going (if you're already on track) or change one thing.
```

**Chips:** I'm okay with this pace / Show me what to cut

### On-Track Path
**Copy:** "You're on track for the {pace} pace. Want to keep it steady with a small system?"

**Chips:** Make it automatic / Just keep me posted / Set a backup buffer

### Off-Track Path
**Copy:** "To hit the {pace} pace, we need to free up about {amount}/month. Pick one lever that feels realistic:"

**Levers:** Trim Shopping / Trim Food / Kill subscriptions / Nights out / Don't change anything

### Budget Style Selection
**Prompt:** "Pick a vibe — strict, chill, or buffer bucket?"

**Chips:** Strict / Chill / Buffer bucket

---

## 6) Action Suggestions (Autosave / RD / FD)

**Template A (cut + autosave):**
```
Option 1: Cut Shopping by ~₹2,000/month. I can set up a ₹70/day autosave so it quietly disappears before you spend it.
```
Chips: Turn on ₹70/day / Make it smaller / No thanks

**Template B (idle cash → RD):**
```
Option 2: You tend to have ~₹10k idle each month. Start an RD of ₹10k and you'll hit your goal ~1 month faster.
```
Chips: Start RD ₹10k / Show other amounts / Not now

**Template C (FD on surplus):**
```
You've had surplus sitting untouched for weeks. Want to park it in an FD (still goal-aligned)?
```
Chips: Create FD / Keep liquid / Explain FD vs RD

---

## 7) Steady State: One Insight on Reopen

**Insight types rotate by category:**

| Type | Example |
|------|---------|
| Goal progress | "You're ahead of goal pace this week. Don't fumble 😌" |
| Risk | "Uh oh — you might run short for a bill due soon. Want a mini survival plan?" |
| Behavior | "Late-night munchies are back 👀 Is this joy or regret?" |
| Opportunity | "You could safely save a bit today without affecting your buffer." |
| Playful | "3 Swiggy orders this week. At this rate you'll fund Zomato's next ad campaign." |

**Styling:** Amber gradient for insights.

---

## 8) Chip Flows (Mini-journeys)

**Default tray (max 5):** Can I afford… / Worth it? / Progress / Find leaks / Power-ups

### Flow: Can I Afford…

```
┌─────────────────┐
│  Start: Amount  │
│  ₹1.5k / ₹3k /  │
│  ₹5k / ₹10k     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Timing         │
│  This week /    │
│  Before month   │
│  end / Next mo  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Affordability  │
│  Check          │
└───────┬─┬───────┘
        │ │
   Easy │ │ Tradeoff
        │ │ Needed
        ▼ ▼
┌────────────┐  ┌──────────────┐
│ Easy Path  │  │ Tradeoff Path│
│            │  │              │
│"Based on   │  │"Risky. Behind│
│ current &  │  │ by ~3 days"  │
│ projected  │  │              │
│ spends, you│  │"Treat or     │
│ can easily │  │ Plan?"       │
│ incorporate│  │              │
│ this."     │  │Treat  Plan   │
│            │  │  │      │    │
│"Go for it!"│  │  ▼      ▼    │
│            │  │Buffer  Reduce│
│[END]       │  │Update  /Extend│
└────────────┘  └──────────────┘
```

**Easy path:** When current buffer + projected spends allow the expense without any adjustments
**Tradeoff path:** When expense requires adjustments to buffer, categories, or timeline
  - **Treat branch:** Update buffer bucket, set soft cap, or nudges
  - **Plan branch:** Add to goal, reduce elsewhere, or extend timeline

### Flow: Worth It?

```
┌─────────────────┐
│  Pick recent    │
│  transaction    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rate it        │
│  Worth / Meh /  │
│  Regret         │
└───────┬─┬───────┘
        │ │
   Worth│ │Regret
        │ │
        ▼ ▼
┌──────────────────┐
│  If regret:      │
│  Why? Impulse /  │
│  Convenience /   │
│  Social pressure │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Action         │
│  Nudge / Cap /  │
│  Mute           │
└─────────────────┘
```

**Cap selection leads to tradeoff:** Reduce elsewhere vs extend timeline

### Flow: Find Leaks

```
┌─────────────────┐
│  Top suspects   │
│  (from patterns)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Joy or Regret? │
└───────┬─┬───────┘
        │ │
    Joy │ │Regret
        │ │
        ▼ ▼
┌─────────────────┐
│  Fix options    │
│  Bucket / Cap / │
│  Nudge / Mute   │
└────────┬────────┘
         │
         ▼ (if bucket/cap)
┌─────────────────┐
│  Tradeoff       │
│  Reduce vs      │
│  Extend         │
└─────────────────┘
```

### Flow: Progress

```
┌─────────────────┐
│  Progress       │
│  summary        │
│  "~3 days ahead"│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Adjust?        │
│  Boost / Keep / │
│  Pause          │
└───────┬─────────┘
        │ Boost
        ▼
┌─────────────────┐
│  How?           │
│  Autosave / RD /│
│  Cut something  │
└─────────────────┘
```

### Flow: Power-ups

```
┌─────────────────┐
│  Pick power-up  │
│  Autosave / RD /│
│  FD             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Amount options │
│  (context-aware)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Confirm        │
│  (success anim) │
└─────────────────┘
```

---

## 9) Tradeoff System

When user selects a cap or bucket that impacts the goal, show tradeoff:

**Copy:**
```
A {monthly_cost} bucket means:
• {extend_timeline} for {goal_name}

If you don't want to extend the timeline, we can:
• {reduce_elsewhere}

Which should we do?
```

**Chips:** Reduce elsewhere / Extend timeline

---

## 10) Mock Data Requirements

**Profiles:** Currently implemented: Weekend baller + food delivery

**Future profiles (config-ready):**
- Subscription collector
- Disciplined cashflow tight
- High surplus lazy saver
- Irregular income

**Minimum fields per profile:**
- Wrapped: top_category_label, top_category_share_pct, late_night_spend_flag, weekend_spike_flag, money_personality_label
- Persona: user_guess_savings_pct, actual_savings_pct, persona_guess, persona_actual
- Goal: goal_name, goal_amount, horizon, current_savings_pct, days_ahead_behind
- Action: suggested_cut_amount_month, suggested_autosave_day, suggested_rd_month
- Pace presets: 3 presets with lever_examples, recommended_product, feasibility_note
- Tradeoff rules: bucket_options with extend_timeline, reduce_elsewhere
- Insights: 10–15 cards across goal/risk/behavior/opportunity/playful categories

---

## 11) Visual Design

### Theme
- Dark mode by default (zinc-900/950 base)
- Subtle gradient backgrounds with blur effects
- Glass-morphism on cards

### Message Styling
| Type | Style |
|------|-------|
| User | White bubble, slide from right |
| Assistant | White/10 opacity, slide from left |
| Reality check | Violet gradient border |
| Goal pinned | Emerald gradient border |
| Insight | Amber gradient border |
| Success | Emerald gradient with checkmark animation |

### Animations
- Messages: Slide in with staggered timing
- Chips: Fade in with stagger delay
- Success: Pop + checkmark draw animation
- Carousel: Directional slide transitions

### Pinned Goal Card
- Icon + goal name + amount + timeline + pace
- "On track" status with days ahead/behind

---

## 12) Success Criteria

- [x] Users feel understood within 2 minutes (persona mismatch reveal + goal framing)
- [x] Users see behavior impacts goal (days faster/slower copy)
- [x] Users believe Slice can operationalize actions (autosave/RD/FD)
- [x] Users can always use chips or free text
- [x] Flow feels polished with animations and visual feedback
