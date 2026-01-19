# Chip Flow Product Redesign Plan

## Overview
Redesign chip flows to better serve the financial planning assistant objective. Remove concepts that don't resonate (buffer buckets, power-ups as separate chip), improve UX with swipe interface, and integrate leaks as system-initiated insights rather than user-initiated chip.

## Product Vision

### Financial Planner Objective:
Help users reach their financial goals by:
1. Guiding spending decisions in real-time (Can I Afford)
2. Learning spending preferences to personalize recommendations (Rate My Spends)
3. Proactively surfacing optimization opportunities (Leaks in insights)
4. Providing flexibility to adjust plans based on life circumstances (Progress)
5. Educating users about their money patterns (Understand My Money)

### Core Product Principles:
- **Single buffer concept**: One overall buffer, not multiple category-specific buffer buckets
- **Proactive optimization**: System suggests leaks via insights, not user-initiated
- **Progressive disclosure**: Show full picture, then guide to decision
- **Engagement**: Use swipe interface for rating spends (Tinder-style)
- **Flexibility**: When ahead offer to relax, when behind offer to adjust

## Steady State Chips (4 total)

1. **Can I afford X?** - Guided decision tree for spending decisions
2. **Rate my spends** - Swipe interface to build spending profile
3. **Progress / Check my plan** - Status check with flexibility options
4. **Understand my money** - Educational insights about money patterns

*Note: "Find Leaks" removed as chip, becomes system-initiated insight*
*Note: "Power-ups" removed as chip, products integrated into other flows*

---

## Problem Summary

### Current Issues:
1. **Can I Afford**: Arbitrary "treat vs plan" branching; buffer buckets concept doesn't work
2. **Worth It**: Transaction-by-transaction is slow; only "Regret" path has action
3. **Find Leaks**: Should be system-initiated, not user chip
4. **Progress**: Offers "Boost" when already ahead (paradox)
5. **Power-ups**: Shouldn't exist as separate chip

## Redesigned Chip Flows

### 1. CAN I AFFORD - Guided Decision Tree

**User Intent:** "I want to spend ₹3k on dinner this weekend. Can I afford it without messing up my quit-job fund?"

**Product Approach:** All-in-one flow that provides quick answer, shows full context, suggests actions, and guides behavioral decisions.

**New Flow:**

```
STEP 1: Amount Input
├─ User types or selects amount
├─ Options: ₹500 / ₹1,500 / ₹3,000 / ₹5,000 / Custom

STEP 2: Context (Optional)
├─ "What's this for?" (helps personalize future recommendations)
├─ Categories: Food / Shopping / Entertainment / Bills / Other
├─ Can skip

STEP 3: Full Picture Display
Show comprehensive decision support:

┌─────────────────────────────────────┐
│ CAN I AFFORD ₹3,000?                │
│                                     │
│ ✓ YES - here's the full picture:   │
│                                     │
│ 💰 Your buffer: ₹3k → ₹0 after     │
│ 📊 Goal impact: 2 days behind       │
│ 🚨 Upcoming: Rent due in 5 days    │
│ 📈 Recent similar: 2 dinners (₹5k) │
│                                     │
│ This is your 3rd dinner out this   │
│ month. Pattern emerging?            │
└─────────────────────────────────────┘

STEP 4: Guided Decision Options
Based on context, offer smart choices:

IF buffer can absorb AND no conflicts:
  → [Go for it] - Simple green light, return home

IF buffer tight OR goal impact:
  → [Go for it anyway] - Acknowledge trade-off
  → [Reduce to ₹2k] - Smaller amount suggestion
  → [Delay till next week] - Timing adjustment
  → [Show me alternatives] - Budget adjustments

IF pattern detected (3rd similar expense):
  → [Go for it + set dining cap] - Allow but prevent future
  → [Skip this one] - Behavioral nudge
  → [See my dining pattern] - Educational

STEP 5: Action Execution
Based on user choice:

IF "Go for it anyway":
  → Update buffer: ₹3k → ₹0
  → Update goal: "You're now 2 days behind. Want to see catch-up options?"
  → Options: [Show catch-up] / [I'm okay with this]

IF "Set dining cap":
  → "Set ₹8k/month dining cap? (This keeps goal on track)"
  → Confirm → Update budgets, return home

IF "Show alternatives":
  → "To afford ₹3k comfortably:"
  → Options based on pace levers:
      - Skip 3 food deliveries this month (saves ₹900)
      - Reduce shopping budget by ₹2k
      - Extend goal by 1 week
  → User picks → Execute → Return home
```

**Key Product Features:**
- **Quick answer**: Yes/No with impact shown immediately
- **Full context**: Buffer, goal impact, upcoming bills, recent patterns all visible
- **Smart suggestions**: Alternatives based on actual budget levers from pace
- **Behavioral nudging**: Flags patterns (3rd dinner) to influence decision
- **Flexible outcomes**: Can proceed anyway, adjust, or optimize

**Data Sources:**
- Buffer: `profile.suggested_budgets.buffer_bucket`
- Goal impact: Calculated from `pace_preset.required_monthly_cut`
- Upcoming bills: `profile.action.bill_risk_event`
- Pattern detection: Analyze last 30 days of `profile.receipts` by category
- Pace levers: `pace_preset.lever_examples`

---

### 2. RATE MY SPENDS - Tinder-Style Swipe Interface

**User Intent:** "Help me understand which of my spends are worth it vs wasteful, and optimize my budget based on what I actually value."

**Product Approach:** Engaging swipe interface to rate 5-10 recent transactions, then surface pattern insights and suggest optimizations.

**New Flow:**

```
STEP 1: Entry
├─ User clicks "Rate my spends" chip
├─ Message: "Let's rate your recent spends. Swipe → for worth it, ← for regret, ↑ to skip."
├─ Load last 10 unrated receipts from profile.receipts

STEP 2: Swipe Interface (Tinder-style)
Show transaction cards one at a time:

┌─────────────────────────────────────┐
│      [Merchant Logo/Icon]           │
│                                     │
│      Swiggy - Biryani               │
│      ₹520                           │
│      Sat 10:05pm                    │
│                                     │
│      Food & Delivery                │
└─────────────────────────────────────┘

User actions:
  Swipe RIGHT (→) = Worth it / Joy
  Swipe LEFT (←) = Regret / Waste
  Swipe UP (↑) = Meh / Skip

Store each rating:
{
  txn_id, category, amount, time,
  rating: "worth" | "regret" | "meh",
  timestamp: now()
}

Continue until:
- 5+ transactions rated, OR
- No more recent transactions, OR
- User exits

STEP 3: Pattern Analysis
After swipes complete, analyze patterns:

Patterns to detect:
- Category sentiment: "80% of Food & Delivery = regret"
- Time-based: "Late-night orders (after 10pm) = 90% regret"
- Day-based: "Weekend shopping = 60% worth it"
- Merchant-specific: "Swiggy = regret, Zomato = worth it"
- Amount threshold: "Spends > ₹1k = mostly regret"

STEP 4: Pattern Insights Display
Show findings in digestible format:

┌─────────────────────────────────────┐
│ PATTERNS DETECTED 🔍                │
│                                     │
│ 📉 REGRET PATTERN                   │
│ Late-night delivery (after 10pm)    │
│ 4 out of 5 rated as regret          │
│ Total: ₹1,820 last week             │
│                                     │
│ 📈 JOY PATTERN                      │
│ Weekend shopping                    │
│ 3 out of 3 rated as worth it        │
│ Total: ₹2,050 last weekend          │
│                                     │
│ 😐 MEH PATTERN                      │
│ Subscriptions                       │
│ Netflix, Spotify - you skip rating  │
│ Total: ₹1,200/month                 │
└─────────────────────────────────────┘

STEP 5: Action Suggestions
Based on patterns, offer smart optimizations:

FOR REGRET PATTERNS:
"Late-night delivery = mostly regret. What should we do?"
Options:
  → [Nudge after 10pm] - "Want a snack?" reminder before ordering
  → [Set time cap] - Block orders after 10pm (₹0 budget)
  → [Reduce Food budget by ₹2k] - Cut from regret category
  → [Nothing for now] - Just learned, no action

FOR JOY PATTERNS:
"Weekend shopping = joy for you! Protect it?"
Options:
  → [Allocate ₹2k/month] - Dedicated budget for weekend shopping
  → [Keep flexible] - No budget, just track
  → [Learn more] - Explain budget allocation

FOR MEH PATTERNS:
"Subscriptions seem meh. Review?"
Options:
  → [Review all subs] - Show list, identify unused
  → [Pause ₹500 worth] - Suggest cuts from meh category
  → [Keep them] - No action

STEP 6: Budget Optimization (if user chooses action)
Execute chosen action and show impact:

Example: User chooses "Reduce Food budget by ₹2k"

┌─────────────────────────────────────┐
│ UPDATED YOUR PLAN ✓                 │
│                                     │
│ Reduced Food & Delivery: ₹8k → ₹6k  │
│ (Trimming late-night regrets)       │
│                                     │
│ Goal impact:                        │
│ You're now 4 days AHEAD on quit-job │
│ fund (was 2 days ahead)             │
│                                     │
│ I'll nudge you after 10pm to help.  │
└─────────────────────────────────────┘

Return to steady state
```

**Key Product Features:**
- **Engaging UX**: Swipe interface is fast, fun, addictive
- **Batch processing**: Rate 5-10 at once instead of one-by-one
- **Pattern detection**: Finds time, category, merchant, amount patterns
- **Sentiment analysis**: Learns what user values (joy) vs wastes (regret)
- **Actionable insights**: Every pattern leads to optimization option
- **Goal integration**: Shows how budget changes impact goal progress
- **Cumulative learning**: Builds user preference profile over time

**Data Sources:**
- Recent receipts: `profile.receipts` (last 10-30 unrated)
- Spending patterns: `profile.wrapped` (late_night_flag, weekend_spike_flag)
- Category budgets: `profile.suggested_budgets.categories`
- Goal data: `profile.goal.days_ahead_behind`
- Pace levers: `pace_preset.lever_examples` for cut suggestions

**State to Track:**
```typescript
type SpendRating = {
  txn_id: string;
  category: string;
  amount: string;
  timestamp: Date;
  time_of_day: "morning" | "afternoon" | "evening" | "late_night";
  day_of_week: string;
  rating: "worth" | "regret" | "meh";
  rated_at: Date;
};

// Build up rating history
spend_ratings: SpendRating[] = [];
```

---

### 3. FIND LEAKS - System-Initiated Insight (NOT a chip)

**Product Decision:** Remove "Find Leaks" as user-initiated chip. Instead, make it a **system-initiated insight** that appears proactively at steady state home.

**Trigger Conditions:**
System should surface leak insights when:
- User is behind on goal (`days_ahead_behind < 0`)
- Category exceeds budget by 20%+ for 2+ weeks
- New pattern emerges (e.g., sudden spike in category)
- User hasn't rated spends in 7+ days (nudge to swipe)

**Insight Format:**
Appears as amber gradient message at home (like current insights):

```
┌─────────────────────────────────────┐
│ 🔍 LEAK DETECTED                    │
│                                     │
│ Late-night delivery spiked to       │
│ ₹1,820 last week (usually ₹900).   │
│                                     │
│ This is pushing you 3 days behind   │
│ on your quit-job fund.              │
│                                     │
│ [Investigate] [Ignore for now]      │
└─────────────────────────────────────┘
```

**Investigation Flow:**
If user clicks [Investigate]:

```
STEP 1: Show Pattern Details
"Here's what I found:"
- 5 late-night orders (after 10pm)
- Total: ₹1,820 last week
- Usual: ₹900/week average
- Impact: Eating into your buffer, 3 days behind goal

STEP 2: Classify Sentiment
"Was this joy or regret spending?"
Options: [Joy] [Regret] [Mixed]

STEP 3A: Joy Path
"Fair enough! Want to budget for late-night joy?"
→ "Allocate ₹2k/month for late-night delivery?"
→ Show impact: "This extends goal by 1 week"
→ Options: [Yes, allocate] [No, I'll cut it]

STEP 3B: Regret Path
"Let's plug this leak. Options:"
→ [Nudge after 10pm] - "Want a snack?" before ordering
→ [Reduce Food by ₹2k] - Cut regret category (from pace levers)
→ [Not now] - Dismiss

Execute action → Update budgets/notifications → Return home
```

**Integration with "Rate My Spends":**
If user has rated spends recently, use that data:
- If late-night orders rated "regret" → Skip sentiment question, go straight to solutions
- If rated "worth it" → Skip sentiment, offer allocation
- If not enough data → Ask sentiment question

**Key Product Features:**
- **Proactive**: System finds leaks, user doesn't have to seek them
- **Timely**: Surfaces when user is behind or pattern spikes
- **Contextual**: Uses existing rating data if available
- **Low friction**: Can ignore if not relevant at the moment
- **Goal-connected**: Always shows goal impact

**Data Sources:**
- Pattern detection: Analyze `profile.receipts` for spikes
- Goal status: `profile.goal.days_ahead_behind`
- User ratings: `spend_ratings[]` from Rate My Spends flow
- Budget data: `profile.suggested_budgets.categories`
- Pace levers: `pace_preset.lever_examples`

**Implementation Note:**
- Remove "Find leaks" from `steadyStateChips` in flows.ts
- Add leak detection logic to insight rotation system
- Trigger leak insights based on conditions above
- Reuse sentiment classification and action flows

---

### 4. PROGRESS / CHECK MY PLAN - Flexibility-Focused

**User Intent:** "How am I doing on my goal? Should I adjust anything?"

**Product Approach:** Status check with flexibility options - when ahead offer to relax, when behind offer to adjust expectations or timeline.

**New Flow:**

```
STEP 1: Progress Display
Parse days_ahead_behind and show contextual status:

┌─────────────────────────────────────┐
│ PROGRESS CHECK 📊                   │
│                                     │
│ Quit-job fund: ₹2.8L / ₹10L         │
│ 28% complete                        │
│                                     │
│ Timeline: 9 months left             │
│ Pace: Balanced (₹5k cuts/month)     │
│                                     │
│ Status: 3 days AHEAD ✓              │
│                                     │
│ Current savings: 12% (vs 10% needed)│
│ You're outperforming!               │
└─────────────────────────────────────┘

STEP 2A: AHEAD Path (days_ahead_behind > 0)
"You're ahead of pace! Want to make a change?"

Options:
  → [Relax my pace] - Reduce monthly cuts while staying on track
  → [Finish faster] - Shorten timeline or increase target
  → [Lock it in] - Automate current pace to protect lead
  → [Keep as is] - No changes

IF user chooses "Relax my pace":
  ├─ Calculate: max_reduction = (days_ahead / 30) * required_monthly_cut
  ├─ Message: "You can reduce cuts by up to ₹1.5k/month and still hit your goal on time."
  ├─ Show levers to ease:
  │   - "Add back ₹1k to Food budget (from ₹6k → ₹7k)"
  │   - "Add back ₹500 to Entertainment"
  ├─ User picks lever
  ├─ Execute → Update budgets → Show new status
  └─ Return home

IF user chooses "Finish faster":
  ├─ Calculate: early_completion = timeline - (days_ahead / 30) months
  ├─ Message: "At this pace, you could finish 2 weeks early. Or increase target?"
  ├─ Options:
  │   - [Finish by [early_date]] - Complete goal sooner
  │   - [Increase target to ₹11L] - Raise goal amount
  │   - [Split the difference] - Finish 1 week early + ₹10.5L target
  ├─ User picks
  ├─ Execute → Update goal → Show new status
  └─ Return home

IF user chooses "Lock it in":
  ├─ Calculate: autosave_amount = (current_monthly_save / 30)
  ├─ Message: "Turn on ₹90/day autosave? (Based on your current pace)"
  ├─ Options: [Yes, automate] [Adjust amount] [Cancel]
  ├─ Execute → Show success animation
  └─ Return home

STEP 2B: BEHIND Path (days_ahead_behind < 0)
"You're 5 days behind pace. What would you like to do?"

Options:
  → [See what happened] - Spending breakdown for last 30 days
  → [Adjust timeline] - Extend goal to realistic date
  → [Help me catch up] - Show strategies to get back on track
  → [Change my goal] - Reduce target amount or change goal

IF user chooses "See what happened":
  ├─ Show category spending vs budgets:
  │   Food: ₹8.5k (budget: ₹6k) 🔴 +₹2.5k over
  │   Shopping: ₹6k (budget: ₹5k) 🟡 +₹1k over
  │   Entertainment: ₹2k (budget: ₹2k) ✓ On track
  ├─ "Food and Shopping went over. Want to fix these?"
  ├─ Options:
  │   - [Tighten Food budget] - Reduce to ₹7k
  │   - [Rate recent spends] - Go to swipe flow
  │   - [Adjust timeline instead] - Go to adjust flow
  └─ Execute choice

IF user chooses "Adjust timeline":
  ├─ Calculate: realistic_timeline = original + (days_behind / 30) months
  ├─ Message: "To keep your current pace realistic, extend to 13 months? (from 12)"
  ├─ Show impact: Same monthly cuts, just longer timeline
  ├─ Options: [Extend to 13mo] [Extend to 14mo] [Cancel]
  ├─ Execute → Update goal → Show new status
  └─ Return home

IF user chooses "Help me catch up":
  ├─ Calculate: gap_amount = (days_behind / 30) * required_monthly_cut
  ├─ Message: "To catch up, you need ₹1.7k more in cuts this month. Options:"
  ├─ Show strategies (ranked by impact):
  │   1. "Trim Food by ₹2k" (from pace.lever_examples)
  │   2. "Skip 2 weekend outings" (behavioral)
  │   3. "Pause subscriptions for 1 month" (₹1.2k)
  │   4. "One-time budget boost" (use surplus if available)
  ├─ User picks strategy
  ├─ Execute → Update budgets → Show new status
  └─ Return home

STEP 2C: ON TRACK Path (days_ahead_behind ≈ 0)
"You're exactly on track for your quit-job fund!"

Options:
  → [Automate pace] - Set autosave to protect current pace
  → [Push harder] - Try to get ahead
  → [Keep manual] - Continue as-is
  → [Adjust goal] - Change target or timeline

Execute based on choice
```

**Key Product Features:**
- **Flexibility first**: Focus on adjusting pace/timeline, not rigid discipline
- **Contextual options**: Different choices when ahead vs behind
- **Realistic adjustments**: Can relax when ahead, extend when behind
- **Root cause analysis**: "See what happened" shows spending breakdown
- **No guilt**: Frame behind as "adjust timeline" not "you failed"
- **Celebrate wins**: When ahead, offer rewards (relax pace, finish early)

**Data Sources:**
- Goal status: `profile.goal.days_ahead_behind`
- Savings rate: `profile.goal.current_savings_pct` vs `required_savings_pct`
- Budget data: `profile.suggested_budgets.categories`
- Pace levers: `pace_preset.lever_examples`
- Timeline: `goalDraft.timeline`

---

### 5. UNDERSTAND MY MONEY - Educational Flow (NEW)

**User Intent:** "Help me understand where my money goes, what my patterns are, and what I can learn from my spending."

**Product Approach:** Educational, insight-driven flow that explains money patterns without pressure to take action. Builds financial literacy.

**New Flow:**

```
STEP 1: Entry
User clicks "Understand my money" chip
Message: "Let's break down your money story. What would you like to explore?"

Options:
  → [Where does my money go?] - Category breakdown
  → [My spending patterns] - Time/behavior patterns
  → [How do I compare?] - Benchmarks (vs averages)
  → [My money personality] - Persona insights

STEP 2A: Where Does My Money Go?
Show visual category breakdown:

┌─────────────────────────────────────┐
│ YOUR MONEY MAP 💰                   │
│                                     │
│ Income: ₹60k/month                  │
│                                     │
│ Fixed (50%): ₹30k                   │
│ • Rent: ₹15k                        │
│ • Bills: ₹5k                        │
│ • EMIs: ₹10k                        │
│                                     │
│ Variable (42%): ₹25k                │
│ • Food & Delivery: ₹8k (32%)        │
│ • Shopping: ₹5k (20%)               │
│ • Entertainment: ₹3k (12%)          │
│ • Transport: ₹3k (12%)              │
│ • Subscriptions: ₹1.5k (6%)         │
│ • Other: ₹4.5k (18%)                │
│                                     │
│ Savings (8%): ₹5k                   │
│ • Goal fund: ₹3k                    │
│ • Buffer: ₹2k                       │
└─────────────────────────────────────┘

"Food & Delivery is your biggest variable spend at 32%. That's pretty common for city dwellers."

Options:
  → [Why does this matter?] - Explain significance
  → [Explore Food spending] - Drill into category
  → [See patterns] - Go to patterns flow
  → [Done learning] - Return home

STEP 2B: My Spending Patterns
Show behavioral insights:

┌─────────────────────────────────────┐
│ YOUR PATTERNS 📈                    │
│                                     │
│ 🌙 Late-night spender              │
│ 68% of your Food & Delivery         │
│ happens after 10pm (₹5.4k/month)    │
│ → This is often convenience-driven  │
│                                     │
│ 🎉 Weekend warrior                  │
│ Fridays-Sundays account for 45%    │
│ of your Shopping (₹2.2k/week)       │
│ → Social context influences this    │
│                                     │
│ 💳 Card preference                  │
│ You use Credit Card for 80% of     │
│ discretionary spends                │
│ → Delayed payment = less friction   │
│                                     │
│ 📊 Savings habit                    │
│ Your savings rate: 8%               │
│ It varies between 5-12% monthly     │
│ → Inconsistent = need automation    │
└─────────────────────────────────────┘

"These patterns aren't good or bad - they're just how your money behaves. Understanding them helps you make better choices."

Options:
  → [Why do I do this?] - Behavioral explanation
  → [Should I change?] - Get recommendations
  → [See category breakdown] - Go to category flow
  → [Done learning] - Return home

STEP 2C: How Do I Compare?
Show benchmarks (no judgment):

┌─────────────────────────────────────┐
│ BENCHMARKS 📊                       │
│                                     │
│ Savings Rate                        │
│ You: 8% | Avg: 10-15% | Goal: 20%  │
│ → You're slightly below average     │
│                                     │
│ Food & Delivery                     │
│ You: 32% | Avg: 20-25%              │
│ → Higher than typical               │
│                                     │
│ Fixed Costs                         │
│ You: 50% | Avg: 40-50% | Ideal: <40%│
│ → Within normal range               │
│                                     │
│ Subscriptions                       │
│ You: 6% | Avg: 8-12%                │
│ → Lower than typical (good!)        │
└─────────────────────────────────────┘

"Benchmarks are guides, not rules. What matters is whether you're hitting YOUR goals."

Options:
  → [What's realistic for me?] - Personalized targets
  → [How to improve?] - Go to recommendations
  → [Done learning] - Return home

STEP 2D: My Money Personality
Show persona insights:

┌─────────────────────────────────────┐
│ YOUR MONEY PERSONALITY 🎭           │
│                                     │
│ You're a "Weekend Splurger"         │
│                                     │
│ Traits:                             │
│ • Disciplined Mon-Thu               │
│ • Loosen up Fri-Sun                 │
│ • Social spending triggers you      │
│ • Prefer flexibility over budgets   │
│                                     │
│ Strengths:                          │
│ ✓ Can control spending when needed  │
│ ✓ Value experiences over things     │
│ ✓ Self-aware about patterns         │
│                                     │
│ Growth areas:                       │
│ • Weekend spends add up fast        │
│ • Hard to say no in social settings │
│ • Savings inconsistent              │
│                                     │
│ Best strategies for your type:      │
│ • Set weekend spending cap          │
│ • Automate savings before weekend   │
│ • Plan one low-cost weekend/month   │
└─────────────────────────────────────┘

Options:
  → [Apply these strategies] - Go to action flow
  → [See other personas] - Educational
  → [Done learning] - Return home

STEP 3: Optional Action Bridge
If user shows interest (clicks "Should I change?" or "Apply strategies"):
"Want to make changes based on what you learned?"

Options:
  → [Yes, optimize] - Route to appropriate flow:
      - If pattern-related → Rate My Spends
      - If behind on goal → Progress flow
      - If curious about spend → Can I Afford
  → [Not right now] - Return home
```

**Key Product Features:**
- **Educational first**: Focus on understanding, not guilt
- **No forced action**: User can learn without committing to changes
- **Contextual insights**: Connects patterns to behavior psychology
- **Benchmarking**: Compare to averages without judgment
- **Personality-driven**: Persona insights with tailored strategies
- **Optional bridge**: Can route to action flows if user wants

**Data Sources:**
- Income/spend breakdown: `profile.wrapped`, `profile.suggested_budgets`
- Patterns: `profile.wrapped` (late_night_flag, weekend_spike_flag)
- Persona: `profile.persona.persona_actual`
- Benchmarks: Could add benchmark data to profile or use static ranges

**Implementation Note:**
- This is a browsing/exploration flow, not action-driven
- Can be entry point for other flows (bridge at end)
- Builds trust by educating before pushing changes

---

### 6. POWER-UPS FLOW - REMOVED

**Product Decision:** Power-ups (Autosave/RD/FD) should not exist as standalone chip.

**New Approach:**
- **Autosave/RD** offered during goal setup (as part of pace calibration)
- **Autosave** offered in Progress flow when user wants to "lock in" pace
- **FD** suggested via system insight when surplus detected (not user-initiated)

Integration points:
1. Goal Setup → After pace selection, offer matching product (RD for aggressive, Autosave for relaxed)
2. Progress → "Lock it in" option → Set autosave based on current pace
3. System Insight → When surplus detected → "Park ₹X in FD?" (proactive suggestion)

**Implementation:**
- Remove "Power-ups" from `steadyStateChips`
- Move product recommendation logic into Goal Setup flow
- Move autosave setup into Progress → Lock it in flow
- Add FD suggestion to insight rotation (triggered by surplus detection)

---

## Cross-Flow Improvements

### 1. Single Buffer System
**Current:** Multiple "buffer buckets" for different categories
**New:** One overall buffer that absorbs all variable spend fluctuations

```typescript
buffer = {
  total: "₹3k",           // Single buffer amount
  remaining: "₹2k",       // After current month's overspends
  refresh: "monthly"      // Resets each month
}
```

Used in:
- Can I Afford: Check if expense fits in remaining buffer
- Progress: Show buffer health as part of status
- System insights: Flag when buffer runs low

### 2. Pattern Learning System
Shared across Rate My Spends and Find Leaks (insights):

```typescript
type Pattern = {
  pattern_id: string;
  type: "time_based" | "category_based" | "merchant" | "amount";
  category?: string;
  time_condition?: string;  // "after_10pm", "weekend", etc.
  merchant?: string;
  amount_threshold?: number;

  // Learning data
  occurrences: number;
  total_amount: string;
  sentiment_breakdown: {
    worth_it: number;
    regret: number;
    meh: number;
  };

  // Status
  detected_at: Date;
  last_occurrence: Date;
  status: "learning" | "confirmed" | "resolved";
};
```

Patterns accumulate across flows:
- Rate My Spends adds sentiment data
- Find Leaks (insights) surfaces confirmed patterns
- System learns and improves recommendations over time

### 3. Smart Routing Between Flows
Flows can route to each other based on context:

```
Can I Afford → If pattern detected → "Rate recent [category] spends?"
Rate My Spends → If regret pattern → System insight triggers leak detection
Progress (behind) → "See what happened" → Category breakdown → "Rate these?"
Understand My Money → "Apply strategies" → Route to relevant flow
```

### 4. Goal Impact Calculator
Unified function used across all flows:

```typescript
function calculateGoalImpact(amount: number, frequency: "once" | "monthly") {
  const monthlyImpact = frequency === "once"
    ? amount
    : amount;

  const daysImpact = (monthlyImpact / required_monthly_cut) * 30;
  const newStatus = current_days_ahead_behind - daysImpact;

  return {
    days_impact: Math.round(daysImpact),
    new_status: newStatus,
    new_timeline: calculateNewTimeline(newStatus),
    message: formatImpactMessage(daysImpact, newStatus)
  };
}
```

Used in:
- Can I Afford: Show days behind/ahead after expense
- Rate My Spends: Show goal impact after budget optimization
- Progress: Calculate timeline changes
- Find Leaks (insights): Show goal impact of leak

---

## Implementation Roadmap

### PHASE 1: Core Product Redesign (HIGH PRIORITY)

#### 1.1 Update Steady State Chips
**File:** `app/data/flows.ts` (lines 254-260)
- Remove: "Find leaks", "Power-ups"
- Update to: ["Can I afford…", "Rate my spends", "Progress", "Understand my money"]
- Add descriptive labels

#### 1.2 Redesign "Can I Afford" Flow
**Files:**
- `app/page.tsx` (lines 706-768 - startAffordFlow through handleAffordResult)
- `app/data/mockProfiles.ts` (lines 470-489 - getAffordOutcome)
- `app/data/flows.ts` (lines 262-292 - affordability chips)

**Changes:**
- Add optional category input after amount
- Build "full picture" display (buffer, goal impact, bills, pattern detection)
- Offer contextual options based on affordability status
- Add pattern detection (3rd similar expense in month)
- Integrate goal impact calculator
- Show alternatives based on pace levers
- Remove "Treat vs Plan" branching
- Implement guided decision tree

#### 1.3 Redesign "Rate My Spends" (formerly "Worth It")
**Files:**
- `app/page.tsx` (lines 770-824 - startWorthFlow through handleWorthAction)
- New component: `app/components/SwipeCard.tsx` (to be created)
- `app/data/flows.ts` (lines 295-319 - worth it chips)

**Changes:**
- Implement Tinder-style swipe interface
- Load last 10 unrated receipts
- Track swipe direction (right = worth, left = regret, up = meh)
- Store ratings in state: `spend_ratings: SpendRating[]`
- After 5-10 swipes, analyze patterns (time, category, merchant, amount)
- Display pattern insights (regret patterns, joy patterns, meh patterns)
- Offer actions based on patterns (nudges, caps, budget allocation)
- Show goal impact of budget optimizations

#### 1.4 Remove "Find Leaks" Chip, Make System-Initiated
**Files:**
- `app/data/flows.ts` (remove leakSuspects, lines 321-339)
- `app/page.tsx` (remove startLeaksFlow, handleLeaksPick, handleLeaksRate, lines 826-869)
- Add to insight rotation system

**Changes:**
- Remove from chip options
- Add leak detection logic to insight rotation
- Trigger conditions: behind on goal, category 20%+ over budget, pattern spike
- Insight message with [Investigate] option
- Investigation flow: show pattern → classify sentiment → offer solutions
- Integrate with spend_ratings data if available

#### 1.5 Redesign "Progress" Flow
**Files:**
- `app/page.tsx` (lines 871-910 - startProgressFlow through handleProgressBoost)
- `app/data/mockProfiles.ts` (lines 492-494 - getProgressSummary)

**Changes:**
- Create three distinct paths: AHEAD, BEHIND, ON TRACK
- AHEAD path: Relax pace / Finish faster / Lock it in / Keep as is
- BEHIND path: See what happened / Adjust timeline / Help me catch up / Change goal
- Remove "Boost" option when ahead (paradox)
- Add spending breakdown ("See what happened")
- Calculate relax amounts when ahead
- Calculate catch-up strategies when behind
- Integrate autosave setup ("Lock it in") - removes need for Power-ups chip

#### 1.6 Remove "Power-ups" Chip
**Files:**
- `app/data/flows.ts` (remove powerup chips, lines 354-387)
- `app/page.tsx` (remove power-up flow, lines 912-961)

**Changes:**
- Remove from steadyStateChips
- Move autosave/RD to goal setup flow
- Move autosave setup to Progress → "Lock it in"
- Add FD suggestion to system insights (when surplus detected)

### PHASE 2: New Feature - "Understand My Money" (MEDIUM PRIORITY)

#### 2.1 Create New Educational Flow
**Files:**
- `app/page.tsx` (add new flow handlers)
- `app/data/flows.ts` (add understand money chips)

**Features:**
- Where does my money go? (category breakdown with percentages)
- My spending patterns (behavioral insights)
- How do I compare? (benchmarks)
- My money personality (persona insights with strategies)
- Optional bridge to action flows at end
- No pressure to take action - educational first

### PHASE 3: Infrastructure Improvements (MEDIUM PRIORITY)

#### 3.1 Implement Single Buffer System
**Files:**
- `app/data/mockProfiles.ts` (update buffer_bucket structure)
- All flows that reference buffer

**Changes:**
- Single buffer: `{ total: "₹3k", remaining: "₹2k", refresh: "monthly" }`
- Remove all "buffer bucket" concepts (multiple category buffers)
- Update Can I Afford to use remaining buffer
- Update Progress to show buffer health

#### 3.2 Build Pattern Learning System
**Files:**
- New: `app/data/patternLearning.ts` (pattern detection and storage)
- `app/page.tsx` (integrate pattern tracking)

**Features:**
- Track patterns across flows
- Store sentiment data from ratings
- Detect time-based, category-based, merchant, amount patterns
- Share patterns between Rate My Spends and Find Leaks insights
- Trigger confirmations after 3+ occurrences

#### 3.3 Create Goal Impact Calculator
**Files:**
- New: `app/utils/goalCalculator.ts`
- Used across: Can I Afford, Rate My Spends, Progress, Find Leaks

**Features:**
- Unified calculation: days_impact, new_status, new_timeline
- Consistent messaging format
- Used by all flows that affect goal

### PHASE 4: Polish & Optimization (LOW PRIORITY)

#### 4.1 Smart Routing Between Flows
- Can I Afford → Rate My Spends (if pattern)
- Rate My Spends → Find Leaks insight (if regret pattern)
- Progress → Rate My Spends ("See what happened")
- Understand My Money → Relevant action flow

#### 4.2 Enhanced Pattern Detection
- Analyze more granular patterns
- Merchant-level insights
- Amount threshold learning
- Time-of-day precision

#### 4.3 Cumulative Intelligence
- Track changes over time
- Show trend improvements
- "You've reduced late-night orders by 40% this month!"

---

## Critical Files

### Primary Files to Modify:

1. **`app/data/flows.ts`** (lines 254-387)
   - Update steadyStateChips: Remove "Find leaks" and "Power-ups", add "Understand my money"
   - Update Can I Afford chips: Add category input, full picture options
   - Replace Worth It chips with swipe interface chips
   - Remove leakSuspects (hardcoded), leakFixChips, powerup chips
   - Add Understand My Money chip sets

2. **`app/page.tsx`** (lines 66-961)
   - Redesign Can I Afford flow (lines 706-768): Full picture display, pattern detection, smart alternatives
   - Redesign Rate My Spends flow (lines 770-824): Swipe interface, batch ratings, pattern analysis
   - Remove Find Leaks flow (lines 826-869): Move to insights
   - Redesign Progress flow (lines 871-910): Three paths (ahead/behind/on-track), flexibility options
   - Remove Power-ups flow (lines 912-961): Integrate into other flows
   - Add Understand My Money flow: Four sub-flows (categories, patterns, benchmarks, personality)
   - Update HomeSubflow type (lines 66-83): Add new states, remove old

3. **`app/data/mockProfiles.ts`** (lines 1-495)
   - Update buffer structure: Single buffer with total and remaining
   - Remove buffer_bucket concept from tradeoff_rules
   - Add benchmark data for "How do I compare?" flow
   - Add persona strategy recommendations for "My money personality"
   - Keep pace_presets, receipts, goal data (unchanged)

### New Files to Create:

4. **`app/components/SwipeCard.tsx`** (new)
   - Tinder-style swipeable card component
   - Props: transaction data, onSwipeLeft, onSwipeRight, onSwipeUp
   - Animations: slide left/right/up based on swipe direction
   - Card design: merchant, amount, time, category

5. **`app/data/patternLearning.ts`** (new)
   - Pattern detection logic: analyzePatterns(receipts, ratings)
   - Pattern types: time_based, category_based, merchant, amount_threshold
   - Sentiment aggregation: calculateSentiment(pattern_id)
   - Pattern confirmation: isPatternConfirmed(pattern, threshold = 3)

6. **`app/utils/goalCalculator.ts`** (new)
   - calculateGoalImpact(amount, frequency, currentStatus, requiredCut)
   - Returns: days_impact, new_status, new_timeline, message
   - Used across all flows for consistent goal impact calculations

### Supporting Files:

7. **`app/components/Chat.tsx`** (lines 1-270)
   - May need minor updates for swipe card integration
   - Add support for pattern insight messages
   - Existing message/chip rendering should work for most new flows

---

## State Management Changes

**Add to page.tsx state:**
```typescript
// Pattern learning
const [spendRatings, setSpendRatings] = useState<SpendRating[]>([]);
const [detectedPatterns, setDetectedPatterns] = useState<Pattern[]>([]);

// Swipe interface
const [swipeIndex, setSwipeIndex] = useState(0);
const [swipeQueue, setSwipeQueue] = useState<Receipt[]>([]);

// Buffer tracking
const [bufferRemaining, setBufferRemaining] = useState(parseInt(profile.suggested_budgets.buffer_bucket.replace(/[₹,k]/g, '')) * 1000);
```

**Update HomeSubflow type:**
```typescript
type HomeSubflow =
  | "idle"
  | "afford-amount" | "afford-category" | "afford-fullpicture" | "afford-alternatives"
  | "swipe-rating" | "swipe-patterns" | "swipe-actions"
  | "progress-status" | "progress-ahead" | "progress-behind" | "progress-ontrack"
  | "understand-menu" | "understand-categories" | "understand-patterns" | "understand-benchmarks" | "understand-personality"
  | "leak-insight" | "leak-investigate" | "leak-solution";  // System-initiated, not chip
```

---

## Verification Plan

### Phase 1 Testing (Core Redesigns):

**1. Can I Afford Flow:**
- [ ] Enter ₹2k amount → Select "Food" category → See full picture (buffer remaining, goal impact, no bills, no pattern)
- [ ] System shows "Safe" status → [Go for it] → Returns to home
- [ ] Enter ₹3k amount (3rd Food expense) → See pattern flag: "This is your 3rd dinner out"
- [ ] System shows "Tight" status → Offers [Go anyway] [Reduce to ₹2k] [Set dining cap]
- [ ] Select [Set dining cap] → See tradeoff (extend timeline vs reduce elsewhere)
- [ ] Enter ₹5k amount → See "Risky" status + bill warning + goal impact (X days behind)
- [ ] Select [Show alternatives] → See pace levers (Skip deliveries, Reduce shopping, Extend timeline)
- [ ] Verify buffer decreases after expense approved

**2. Rate My Spends Flow:**
- [ ] Click "Rate my spends" → See first transaction card with swipe prompts
- [ ] Swipe right on 2 transactions → Mark as "worth it"
- [ ] Swipe left on 3 transactions → Mark as "regret"
- [ ] Swipe up on 1 transaction → Mark as "meh"
- [ ] After 5-10 swipes → See pattern analysis screen
- [ ] Verify patterns detected: "Late-night delivery = 80% regret"
- [ ] See action suggestions: [Nudge after 10pm] [Set time cap] [Reduce Food budget]
- [ ] Select [Reduce Food budget] → See budget update and goal impact
- [ ] Verify spendRatings state populated with all ratings

**3. Find Leaks (System Insight):**
- [ ] Trigger condition: Set user to 5 days behind on goal
- [ ] At home, system shows amber insight: "Leak detected: Food spiked to ₹X"
- [ ] Click [Investigate] → See pattern details (5 orders, ₹X total, usual ₹Y)
- [ ] Answer "Joy or Regret?" → [Regret]
- [ ] See solutions: [Nudge] [Reduce budget] [Not now]
- [ ] Select [Reduce budget] → Budget updates, goal recalculated
- [ ] Verify leak insight doesn't appear as chip option

**4. Progress Flow:**
- [ ] **AHEAD scenario** (days_ahead_behind = 3):
  - See "3 days ahead!" message with progress bar
  - Options shown: [Relax pace] [Finish faster] [Lock it in] [Keep as is]
  - Select [Relax pace] → Calculate max reduction (₹X/month)
  - See lever options: "Add back ₹1k to Food"
  - Select lever → Budget updates, status recalculates

- [ ] **BEHIND scenario** (days_ahead_behind = -5):
  - See "5 days behind" message with gap analysis
  - Options shown: [See what happened] [Adjust timeline] [Help me catch up]
  - Select [See what happened] → Category spending breakdown (over/under budget)
  - Select [Help me catch up] → See strategies (Trim Food ₹2k, Skip outings, Pause subs)
  - Select strategy → Budget updates, catch-up plan set

- [ ] **ON TRACK scenario** (days_ahead_behind = 0):
  - See "Exactly on track" message
  - Options: [Automate pace] [Push harder] [Keep manual]
  - Select [Automate pace] → Calculate autosave from current pace → Set up autosave

- [ ] Verify NO "Boost" option appears when ahead

**5. Power-ups Removal:**
- [ ] Verify "Power-ups" does NOT appear in steady state chips
- [ ] Verify autosave setup integrated in Progress → "Lock it in"
- [ ] Test FD suggestion appears as system insight when surplus detected

**6. Understand My Money Flow:**
- [ ] Click "Understand my money" → See menu: [Where money goes] [Patterns] [Benchmarks] [Personality]
- [ ] Select [Where money goes] → See income, fixed, variable, savings breakdown
- [ ] Select [My patterns] → See behavioral insights (late-night, weekend, card preference)
- [ ] Select [How do I compare] → See benchmarks (savings rate, category %s)
- [ ] Select [My personality] → See persona (Weekend Splurger) with traits, strengths, strategies
- [ ] At end, select [Apply strategies] → Routes to appropriate action flow
- [ ] Select [Done learning] → Returns to home with no pressure

### Phase 2 Testing (Infrastructure):

**7. Single Buffer System:**
- [ ] Verify only one buffer amount in profile (no category buffers)
- [ ] Can I Afford flow uses buffer.remaining
- [ ] Buffer decreases with expenses, resets monthly
- [ ] Progress flow shows buffer health

**8. Pattern Learning:**
- [ ] Rate 3+ late-night orders as "regret" → Pattern confirmed
- [ ] System insight suggests "Nudge after 10pm"
- [ ] Pattern data persists across sessions
- [ ] Pattern sentiment updates as more ratings added

**9. Goal Impact Calculator:**
- [ ] All flows use unified calculator
- [ ] Consistent messaging: "X days behind" format
- [ ] Timeline recalculation accurate
- [ ] Impact shows in Can I Afford, Rate My Spends, Progress, Leaks

### Phase 3 Testing (Smart Routing):

**10. Cross-Flow Navigation:**
- [ ] Can I Afford detects pattern → Suggests "Rate recent [category] spends"
- [ ] Rate My Spends with regret pattern → Triggers Find Leaks insight
- [ ] Progress "See what happened" → Shows breakdown → Links to Rate My Spends
- [ ] Understand My Money → "Apply strategies" → Routes to correct flow

---

## Success Criteria

- [ ] User can make spending decisions with full context (Can I Afford)
- [ ] User can quickly rate multiple spends and get actionable insights (Rate My Spends)
- [ ] System proactively surfaces optimization opportunities (Find Leaks insights)
- [ ] User has flexibility to relax or adjust when ahead/behind (Progress)
- [ ] User can learn about money without pressure to act (Understand My Money)
- [ ] Single buffer concept replaces buffer buckets throughout
- [ ] No power-ups chip; products integrated contextually
- [ ] Pattern learning improves recommendations over time
- [ ] All flows show consistent goal impact calculations
