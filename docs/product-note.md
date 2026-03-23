# AI Banker — Product Note

## The premise

A banker who's good at their job does three things: they understand your financial life from the numbers, they understand your intentions from conversation, and they act on your behalf. Today, no digital banking product does all three. Most don't do any of them well.

AI Banker is built around three capabilities:

1. **Conscience** — understanding the user from their data
2. **Companionship** — understanding the user from conversation
3. **Commerce** — executing financial actions on their behalf

---

## Conscience

Conscience is everything the banker knows about you before you say a word. It's derived from transaction data — what you spend, where, when, how often, how it's changing. Not the raw feed. The interpreted picture.

A good banker doesn't tell you "you spent ₹8,432 on food last month." A good banker tells you that food delivery grew 45% since March without you noticing, that it's pushing your quit-job fund out by three months, and that your average Swiggy order used to be ₹290 and is now ₹420. Same orders. Different price. The creep happened so slowly you never felt it.

Conscience operates on patterns that people can't see about themselves:

- **Hidden totals** — each transaction feels small. The pile never does. "412 transactions under ₹300 this year. Total: ₹78k."
- **Creep detection** — things that grew slowly enough to avoid notice. Baseline spending that shifted from ₹42k/month to ₹58k. Same salary. Different lifestyle.
- **Frequency blindness** — people underestimate how often they do things. 18 Swiggy orders in 30 days is almost every other day.
- **Time signatures** — when the timestamps reveal something specific. 10pm–midnight: 28% of monthly spend in a 2-hour window. Not the most transactions — the most money.
- **Spending shape** — the distribution across the month tells a story. Week 1 gets 60% of the salary. Week 4 gets 15%. The end of the month isn't hard because you're unlucky.

Conscience also knows where behavior contradicts stated intention. "You said Shopping was the category to cut. It's up 35% since you said that." This is where Conscience and Companionship overlap — the banker remembers what you said and compares it against what you did.

The goal of Conscience is to make the invisible visible. Every user has financial patterns they've never seen. Conscience surfaces them in a way that feels like discovery, not surveillance.

---

## Companionship

Companionship is everything the banker learns from talking to you. It's the layer that turns a data engine into a relationship.

Conscience can tell you that you spend ₹94k/year on food delivery. Only Companionship knows that you love eating out and will resent any plan that tries to cut it. Conscience sees ₹1,499/month going to a gym. Only Companionship knows you haven't gone in three months and feel guilty about it. Conscience detects late-night spending spikes. Only Companionship knows whether those are regret or ritual.

Companionship accumulates in two ways:

**Structured decisions** — choices the user makes during guided flows. Goal selection, pace preference, budget style, which categories are sacred vs. cuttable, how they rate individual transactions (joy, regret, meh). These are explicit signals.

**Extracted preferences** — things the user says in free-form conversation that reveal intent. "Don't touch my SIPs." "I'm planning a Japan trip in March." "I prefer eating out — don't cut my food budget." These are captured, stored, and retrieved before every AI interaction. The banker always respects what you've told it.

The combination matters. Conscience without Companionship is a surveillance dashboard. Companionship without Conscience is a chatbot with no substance. Together, they produce observations like: "You said Food is untouchable. But you've rated 8 of 12 food purchases as 'regret' this month. It's mainly after 10pm. Maybe we can reduce the budget?"

That's a sentence only a banker with both data understanding and relationship context can produce.

**The voice:** The companion is observant, a little nosy, occasionally funny, genuinely on your side. The friend who notices you ordered Swiggy at 11pm again and just... looks at you. Supportive but not sycophantic. Will celebrate wins like they matter. Will call you out, gently, when you're lying to yourself. Talks like a person, not a dashboard.

---

## Commerce

Commerce is the banker's ability to do things — not just observe and advise, but execute. Set up a recurring deposit. Start a daily autosave. Adjust a budget. Lock surplus in an FD. Set a spending cap.

**The initial approach to Commerce is deliberately conservative.** The near-term goal is to maximize the depth of Conscience and Companionship — to build the richest possible understanding of the user's financial life and preferences — while keeping Commerce actions firmly in the user's hands.

In practice, this means: the AI does all the analysis, builds the recommendation, and prepares the action. But the final step is always the user's. When someone confirms a savings product, we drop them on the summary screen of the existing banking flow. They tap confirm. The button press is theirs.

This is intentional. Trust in financial products is earned slowly. A banker who understands you deeply (Conscience + Companionship) but waits for your explicit approval to act (Commerce) feels trustworthy. A banker who auto-executes based on its own analysis — even if the analysis is correct — feels dangerous.

Over time, as trust builds and the user's comfort with the system grows, Commerce can become more autonomous. "You told me to auto-save ₹70/day. I did. Here's your receipt." But that's earned, not assumed. The progression is:

1. **Present** — user confirms every action via existing banking UI
2. **Near-term** — user pre-authorizes specific action types ("auto-save ₹70/day, don't ask me each time")
3. **Long-term** — banker acts within pre-authorized boundaries, user reviews after the fact

The product is designed so that Conscience and Companionship are valuable on their own, even before Commerce fully matures. Understanding your money better and having a financial companion that remembers your preferences — that's useful even without one-tap execution.

---

## The user journey

### First open: Wrapped

Spotify Wrapped, but for your bank account. Six slides that reveal patterns the user has never seen — their top spending category, how much "small" purchases actually total, what weekends really cost. Percentages and patterns, not raw rupee amounts. "28% of your variable spend" is curiosity. "₹8,432 on food" is anxiety.

Wrapped is pure Conscience. The system shows the user something about themselves they didn't know. No asks, no actions, no goals. Just: here's what your money looks like from the outside. The user goes from "another banking feature" to "wait, tell me more."

### Second: Reality Check

A quick persona quiz — five questions about how you *think* you spend. Then the system shows how you *actually* spend. Side by side. The gap is almost always surprising. People think they save 20% when it's 8%. They think food is 10% of spending when it's 32%.

Reality Check is where Conscience meets the first moment of Companionship. The user tells us their perception (Companionship input). We compare it to reality (Conscience). The gap between the two is where all the motivation lives. By the time we ask "want to set a goal?", the user has seen proof that they don't fully understand their own money. The answer is yes.

**Tone:** "Your money has habits" not "you're bad with money." The persona labels are observational (Weekend Splurger, Convenience Spender), not prescriptive.

### Third: Onboarding

A guided conversation that builds a financial plan:

- **Goal choice** — trip, emergency fund, big purchase, quit-job fund, or type your own.
- **Pace calibration** — three presets (aggressive, balanced, relaxed) computed from real spending data. Each tells you exactly what it costs: "To make this real, you'd need to cut about ₹5k/month. Top ways: trim food delivery, reduce weekend shopping." Calculated from actual monthly averages by category.
- **Budget review** — category-by-category budgets derived from real spending. Not arbitrary round numbers. Editable via free text.
- **Product recommendation** — based on the chosen pace, the right savings instrument (RD for aggressive, daily autosave for relaxed). The user confirms via the existing banking UI — they're dropped on the summary screen, they tap confirm.

Onboarding is deep Conscience (every number is real), active Companionship (every preference is recorded and remembered), and the first touch of Commerce (setting up a savings product, with the user in the driver's seat).

**Design principle:** levers, not rules. "Trim Food by ₹2k" is a lever. "Don't spend more than ₹6k on food" is a rule. Levers feel like options. Rules feel like constraints. People stick with options.

### Fourth: Steady State

This is where the three capabilities work together continuously.

**Recurring engagement surfaces:**

The steady state isn't locked into a single channel. The right surface depends on the moment:

- **Home screen widget** — the primary recurring surface. A daily insight card that rotates through Conscience-generated observations. Glanceable, low-friction, doesn't require opening the app. This is where the system-initiated voice lives — the friend who noticed something and wants to tell you. Widget beats daily WhatsApp messages: it's free, non-intrusive, always fresh when you glance at your phone, and doesn't create notification fatigue.

- **In-app chat** — the deep interaction surface. When a user taps the widget, opens the app, or wants to explore, they land in the full chat. This is where Companionship deepens — free-form conversation, guided chip flows, transaction rating, goal tracking. The chat carries the full context: Conscience data in the system prompt, Companionship memories from past conversations.

- **WhatsApp** — an optional outreach channel for high-signal, low-frequency moments. Not daily insights (that's annoying and expensive). More like: "Your salary just hit. Want to auto-save ₹5k before it disappears?" or "You're 2 days from hitting your goal milestone." Moments where the interruption is worth it.

**Chip flows (user-initiated):**

Four actions available from the home screen:

- **Can I Afford...** — full decision support for spending decisions. Buffer check, goal impact, upcoming bills, pattern detection ("this is your 3rd dinner out this month"), and smart alternatives. Not a yes/no — a picture that helps you decide. (Conscience + Companionship inform the analysis, Commerce executes if the user chooses to adjust budgets or set a cap.)

- **Rate My Spends** — swipe through recent transactions. Worth it / regret / meh. After a batch, the system finds patterns: "Late-night delivery = 80% regret." Then offers actions. This is the primary Companionship learning mechanism — the user is teaching the system what they value. (Conscience detects the pattern, Companionship learns the preference, Commerce offers the action.)

- **Progress** — goal tracking with three contextual paths:
  - *Ahead:* relax your pace, finish early, or lock it in
  - *Behind:* see what happened, adjust timeline, catch up, or change goal
  - *On track:* automate it
  
  No guilt. When ahead, you can breathe. When behind, you can adjust. The product flexes with life instead of shaming you for living it.

- **Understand My Money** — educational, no-pressure exploration. Where does my money go? What are my patterns? How do I compare? What's my money personality? Builds financial literacy without pushing action. If the user *wants* to act, there's a bridge to the other flows.

**System-initiated insights (Conscience speaking):**

The system proactively surfaces observations via the widget and in-app. These run on 16 archetypes:

| Archetype | Example |
|-----------|---------|
| Hidden Totals | "Swiggy has collected ₹62k from you in 12 months. They should send you a thank you card." |
| Creep Detection | "Your average Swiggy order in January: ₹290. Now: ₹420. Same orders. 45% more money." |
| Goal Impact | "After-10pm spending this month: ₹12k. That's 5 weeks added to your timeline." |
| Frequency Blindness | "7 days of delivery in a row." |
| Celebrations | "8 days under budget in a row. Whatever you're doing, keep doing it." |
| Preference Contradiction | "You said Shopping was the category to cut. It's up 35%." |
| Actionable Math | "Skip one Swiggy order a week → ₹19k/year. Enough for a short trip." |

Rules: no obvious observations ("you spend more on weekends" — they know that). Every insight has an action or is genuinely surprising. Personality always. If we don't have the data, we ask, then we remember.

---

## Why this architecture?

### Why not a dashboard?

Dashboards are mirrors. They show data and leave. A dashboard tells you that you spent ₹8k on food delivery. It can't tell you that it grew 45% since March, that it's pushing your goal out by 3 months, that skipping one order a week frees up ₹19k/year, and — by the way — you told us last month that food is sacred, so maybe we target late-night orders specifically since you rated those as regret.

That sentence requires Conscience (data), Companionship (memory of preferences), and contextual judgment. Dashboards can't do contextual judgment.

### Why Wrapped + Reality Check before goal-setting?

The alternative is: skip straight to "set a goal." Users set goals they can't keep because they have no idea where their money actually goes. The goal becomes aspirational fiction.

Wrapped and Reality Check solve this by building self-awareness before asking for commitment. By the time the product says "what are you building toward?", the user has seen their own data, discovered the gap between perception and reality, and is ready to make a plan grounded in actual behavior — not aspiration.

### Why maximize Conscience and Companionship before Commerce?

Commerce is the outcome, not the starting point. A banker who barely knows you but offers to manage your money is a stranger with a sales pitch. A banker who deeply understands your patterns (Conscience), remembers your preferences and constraints (Companionship), and then offers exactly the right action at exactly the right moment (Commerce) — that's trust.

The product is designed to be valuable even if Commerce never goes beyond "user taps confirm on the summary screen." The understanding itself is the product. The actions are the reward for building that understanding.

---

## What this is not

- Not a dashboard — dashboards show, they don't understand
- Not a budgeting tool — budgets are a means to a goal, not the product
- Not a transaction categorizer — categorization enables insight, it's infrastructure
- Not a robo-advisor — we never give investment advice, we help you understand your spending and act on your goals
- Not a notification engine — notifications are interruptions, insights are welcome

---

## What success looks like

1. The user feels understood within 2 minutes (Conscience, via Wrapped + Reality Check)
2. The user trusts the system enough to share preferences and constraints (Companionship deepening)
3. The user sees how daily behavior connects to long-term goals (Conscience + Companionship)
4. The user acts on recommendations with confidence, because the system earned it (Commerce)
5. The user returns not out of guilt, but because the banker noticed something interesting (widget insight)
