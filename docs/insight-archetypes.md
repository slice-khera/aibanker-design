# Insight Archetypes
## AI Banker — Product Documentation

---

## Overview

Insights are contextual observations shown to users when they open the chat. They should feel like they're coming from a sharp friend who's been paying attention to their money — someone who notices things, says them out loud, and usually has a suggestion.

Intially we will show them goal based insights (7-15) to have them trust us with their financial planning and we will eventually start throwing in things to fetch information

### The Voice

The insight-giver is **observant, a little nosy, occasionally funny, but genuinely on your side.**

They are:
- The friend who notices you ordered Swiggy at 11pm again and just... looks at you
- Supportive but not sycophantic
- Will celebrate wins like they matter
- Will call you out, gently, when you're lying to yourself
- Talks like a person, not a dashboard

They are not:
- A financial advisor
- A bank notification
- Trying to make you feel bad

### Tone Examples

| ❌ Don't | ✅ Do |
|----------|-------|
| "Your spending increased 23% this week" | "Something happened this week. ₹8k in 3 days?" |
| "You have exceeded your Food budget" | "Food budget's gone. And it's only the 19th." |
| "Consider reducing discretionary spending" | "Maybe... skip the next one?" |
| "Transaction alert: ₹520 at Zomato" | "₹520 at Zomato at 11:47pm. Classic." |
| "Great job! You're 3 days ahead of your goal!" | "3 days ahead. Look at you." |

---

## Data Sources

| Source | What We Have |
|--------|--------------|
| Transactions | merchant, amount, category, timestamp |
| Goals | goal_name, amount, timeline, pace, progress |
| Preferences | sacred/cuttable categories, pace choice, tradeoff preference (stated via conversation) |
| Ratings | worth_it / meh / regret (if they've rated transactions) |
| Account | balance, income/salary |
| Budgets | category budgets, overall budget |
| Savings | savings rate, savings amount |
| Memory | things they've explicitly told us |

**Important:** We do not have app usage, location, mood, social context, or browsing behavior. If we need information we don't have, we ask and remember.

---

## Design Rules

1. **If we don't have the data, we ask.** Then we remember.
2. **No obvious observations.** "You spend more on weekends" is useless — they know that.
3. **Every insight either has an action OR is genuinely surprising.**
4. **Personality always.** This isn't a bank statement.

---


## Archetypes

### 1. Hidden Totals

People see each transaction. They never see the pile.

| ID | Insight | Action |
|----|---------|--------|
| `hidden-merchant-annual` | "Swiggy has collected ₹62k from you in the last 12 months. They should send you a thank you card." | Is this fine, or more than you'd like? → Remember |
| `hidden-late-night-total` | "Everything after 10pm this year: ₹1.1L. Your night self has expensive taste." | Problem or just your rhythm? → Remember |
| `hidden-small-txn` | "412 transactions under ₹300 this year. Total: ₹78k. The small stuff is the big stuff." | — |
| `hidden-food-delivery` | "Food delivery this year: ₹94k. That's ₹7.8k/month to not cook." | Worth it to you? → Remember |
| `hidden-goal-cost` | "₹62k to Swiggy this year. That's pushed your goal from August to January." | Lock ₹5k/month in RD? |

---

### 2. Creep Detection

Things that grew slowly enough that they didn't notice.

| ID | Insight | Action |
|----|---------|--------|
| `creep-order-size` | "Your average Swiggy order in January: ₹290. Now: ₹420. Same orders. 45% more money. Did you notice?" | What changed? |
| `creep-category` | "Food delivery spend has quietly grown ₹2k/month since March. That's ₹8k more than you used to spend, and it snuck up." | Set a cap? |
| `creep-subscriptions` | "You've added 4 subscriptions this year. That's ₹1,800/month more on autopilot, without any single moment feeling like a decision." | See the list? |
| `creep-baseline` | "January you spent ₹42k/month. Now you spend ₹58k. Same salary. Different lifestyle." | — |

---

### 3. Frequency Blindness

People underestimate how often they do things. Surface it, learn if it's intentional.

| ID | Insight | Ask/Action |
|----|---------|------------|
| `freq-merchant` | "Swiggy: 18 orders in 30 days. That's almost every other day." | Is this intentional, or more than you thought? → Remember |
| `freq-streak` | "7 days of delivery in a row." | Lifestyle choice or slipped into it? → Remember |
| `freq-amazon` | "Amazon: 14 orders this month. One every 2.1 days." | Planned purchases or impulse? → Remember |
| `freq-late-night` | "16 late-night orders this month. You're a regular at the 11pm slot." | Is this a problem for you or just your rhythm? → Remember |

---

### 4. Time Signatures

When the timestamps reveal something specific.

| ID | Insight | Action |
|----|---------|--------|
| `time-peak-window` | "10pm–midnight: 28% of your monthly spend happens in this 2-hour window. Not the most transactions — the most money." | Nudge before this window? |
| `time-salary-surge` | "First 5 days after salary: 45% of monthly spend. The rest of the month divides the remaining 55%." | Spread it out? |
| `time-specific-day` | "Sunday evenings, specifically. That's when 20% of your weekly spend happens. Do you regret these spends?" | → Ask and remember |


---

### 5. Merchant Concentration

Where the money actually flows.

| ID | Insight | Action |
|----|---------|--------|
| `merchant-top3` | "3 merchants — Swiggy, Amazon, Zomato — account for 52% of your spending. Everyone else is fighting for scraps." | — |
| `merchant-loyalty` | "Swiggy: ₹8.2k this month. Zomato: ₹1.1k. You've clearly made a choice." | — |
| `merchant-new` | "New merchant alert: Zepto. Didn't exist in your life 6 weeks ago. Now: 12 orders, ₹3.4k." | Is this replacing something or adding to the pile? → Remember | (assuming spends from other equivalent merchants did not reduced)
| `merchant-concentration` | "You've shopped at 41 different merchants this month. But 6 of them got 75% of the money." | — |

---

### 6. Spending Shape

The distribution across the month tells a story.

| ID | Insight | Action |
|----|---------|--------|
| `shape-two-lives` | "Week 1: ₹28k. Week 4: ₹7k. You live two different financial lives in the same month." | Try weekly budgets? |
| `shape-end-pattern` | "You've ended 4 of the last 6 months with less than ₹5k in the account. That's not unlucky — that's a shape." | Fix the shape? |
| `shape-front-loaded` | "Day 1-10 gets 60% of your salary. Days 20-30 get 15%. The end of the month isn't hard because you're unlucky." | — |
| `shape-forced-discipline` | "Every month, your spending drops 65% in the last week. Not discipline. Just nothing left." | — |

---

### 7. Recurring Charges (With Questions)

We can see charges. We can't see usage. So we ask.

| ID | Insight | Ask |
|----|---------|-----|
| `recurring-gym` | "₹1,499/month to [gym]. Quick question — how many times did you actually go last month?" | 0-2 / 3-5 / 6+ → remember, calculate ₹ per visit |
| `recurring-streaming` | "₹899/month to [app]. Honest answer: when did you last open it?" | This week / This month / Can't remember |
| `recurring-streaming-hours` | "You're paying ₹649/month for [streaming]. How many hours do you actually watch?" | → Ask, calculate cost per hour |
| `recurring-unknown` | "₹299/month to [service] for 8 months. Do you still use this?" | Yes / No / What even is this |
| `recurring-overlap` | "You're paying for both Spotify (₹119) and YouTube Music (₹139). Same thing twice?" | Pick one? |
| `recurring-total` | "9 recurring charges hitting your account. Total: ₹4.8k/month. That's ₹58k/year on autopilot." | See the list? |
| `recurring-new` | "New recurring charge: ₹599 started hitting last month. What's this for?" | → Ask and remember |

---

### 8. Goal Impact (Time-Based)

Show them how spending decisions move the finish line.

| ID | Insight | Action |
|----|---------|--------|
| `goal-timeline-shift` | "At current pace, quit-job fund lands in March instead of December. That's 3 extra months at the job." | Get back on track? |
| `goal-merchant-delay` | "Swiggy this year: ₹62k. That's pushed your goal from August to November." | Lock ₹5k/month in RD? |
| `goal-late-night-cost` | "After-10pm spending this month: ₹12k. That's 5 weeks added to your timeline." | Auto-save ₹400/day? |
| `goal-weekly-math` | "This week's spending added 8 days to your goal. Last week added 3. Something changed." | — |
| `goal-vs-merchant` | "Quit-job fund needs ₹10k/month. Swiggy got ₹8.2k this month. They're almost the same number." | Redirect to goal? |
| `goal-on-track` | "You're on pace to hit quit-job fund by October — 2 months early. Lock it in with an RD?" | Start RD? |
| `goal-recovery` | "You slipped last month. But ₹8k extra this month gets you back to the December finish line." | Auto-save ₹270/day? |
| `goal-close` | "₹42k left. At current pace, that's 11 weeks. Push ₹2k more/month and it's 9 weeks." | Boost by ₹2k? |

---

### 9. Regret Patterns → Actions

They told us what they regret. Every insight has a way to prevent the next one.

| ID | Insight | Action |
|----|---------|--------|
| `regret-time-pn` | "Your regrets cluster after 9pm. Want a PN at 9pm to remind you to check in before ordering?" | Send 9pm PN? |
| `regret-day-pn` | "Saturdays have 2x the regret rate. Want a Saturday morning heads-up?" | Send Saturday PN? |
| `regret-lock-money` | "Regret spending this month: ₹6.2k. That money existed — it just went to the wrong place. Lock ₹6k in an RD next month?" | Start ₹6k RD? |
| `regret-autosave` | "Your average regret is ₹450. Auto-save ₹450/day and the money won't be there to regret." | Auto-save ₹450/day? |
| `regret-goal-delay` | "This year's regret spending pushed your quit-job fund from August to November. 3 months for stuff you didn't even want." | Lock it in an RD? |
| `regret-redirect` | "If last month's regrets had gone to your goal, you'd be done 6 weeks earlier." | Set up auto-save? |

---

### 10. Preference Contradictions

When behavior contradicts what they told us.

| ID | Insight | Action |
|----|---------|--------|
| `pref-cut-not-cutting` | "You said Shopping was the category to cut. It's up 35% since you said that." | Still the plan? |
| `pref-sacred-regret` | "You said Food is untouchable. But you've rated 8 of 12 Food purchases as 'regret' this month. It's mainly post 10pm" | Maybe we can reduce the budget? |
| `pref-pace-miss` | "You picked 'balanced' pace. You've hit it exactly once in 4 months." | Adjust the pace or the behavior? |

---

### 11. Actionable Math

One specific change, one specific outcome.

| ID | Insight | Action |
|----|---------|--------|
| `action-skip-one` | "If you skipped one Swiggy order a week, that's ₹1.6k/month. ₹19k/year. Enough for a short trip." | Try it for a month? |
| `action-10pm-rule` | "If nothing happened after 10pm, you'd have ₹14k more this year. One rule." | Try a 10pm cutoff? |
| `action-reduce-frequency` | "You order delivery 18 times a month. Cut it to 14 and that's ₹1.6k saved." | Try it? |
| `action-flatten` | "If your first-week spending matched your last-week spending, you'd save ₹8k/month. Same month, different shape." | Try weekly auto-save? |
| `action-autosave` | "Turn ₹70/day into auto-save. That's less than half your average Swiggy order. The ₹70 exists." | Set up ₹70/day? |

---

### 12. Trends

How things are moving — up, down, accelerating.

| ID | Insight | Action |
|----|---------|--------|
| `trend-improving` | "Food delivery down 18% from last month. Something's working." | Lock the difference in an RD? |
| `trend-worsening` | "Shopping up 40% from last month." | One-time thing or new normal? → Remember | (assuming seasonal calendar is not good)
| `trend-reversal` | "You were improving for 3 months. This month went the other way." | What happened? → Remember |
| `trend-seasonal` | "This happened last December too. You always spend more in Dec-Jan." | Prep for it this year? |
| `trend-savings-climbing` | "Savings rate: 8% → 14% in 3 months. You're building something." | Push to 18%, this will move your goal forward by 4 months? |
| `trend-savings-slipping` | "Savings rate: 15% → 9% in 2 months." | Lock ₹5k in RD before it slips more? |

---

### 13. Monthly Pulse

How the month is going. One number, one feeling.

| ID | Insight | Action |
|----|---------|--------|
| `pulse-comfortable` | "You're halfway through the month with more than half your money. Comfortable." | — |
| `pulse-tight` | "8 days left, ₹6k to stretch. Tight but doable." | — |
| `pulse-room` | "You've got ₹8k more than you usually have at this point. Room to breathe — or save." | Move ₹5k to goal? |
| `pulse-ahead` | "Spending's lighter than usual. You could end this month ₹4k ahead." | Lock it in an RD? |
| `pulse-hot` | "You're running hot — 70% spent with 40% of the month left." | Slow down or ride it out? |
| `pulse-payday` | "4 days to salary, ₹3k in the bank. You'll make it." | — |
| `pulse-surplus` | "Month ended with ₹5k unspent. That could've been 3 weeks of goal progress." | Auto-save more next month? |

---

### 14. Genuinely Surprising

Things that make them go "wait, what?"

| ID | Insight | Action |
|----|---------|--------|
| `surprise-price-point` | "Your most common transaction amount is ₹499. Exactly ₹499. 23 times this year. Something about that price gets you." | — |
| `surprise-category-vs-goal` | "Food delivery this year: ₹94k. Goal contributions: ₹58k. Dinner is beating your dream." | — |
| `surprise-no-spend-streak` | "Your longest streak without spending anything: 41 hours. In 18 months of data." | — |
| `surprise-back-to-back` | "When you order from Swiggy, there's a 35% chance you order again within 2 hours. Double-dipping." | — |
| `surprise-specific-moment` | "Friday at 10pm. That specific moment accounts for 8% of your monthly spend. One hour, one day." | — |

---

### 15. Celebrations

When they're winning. No qualifications, no "but."

| ID | Insight | Action |
|----|---------|--------|
| `win-streak` | "8 days under budget in a row. Longest streak in 3 months. Whatever you're doing, keep doing it." | — |
| `win-pace-hit` | "You hit your goal pace this month. Not close to it — actually hit it. Rare." | Lock in more with auto-save? |
| `win-no-regret` | "Zero 'regret' ratings in 6 days. You're buying things you actually want." | — |
| `win-followed-through` | "You said you'd cut Shopping. It's down 40%. You actually did the thing you said." | — |
| `win-milestone` | "₹1L saved toward quit-job fund. Six figures. That's real." | — |

---

### 16. Playful

Personality, not a lecture. Use sparingly.

| ID | Insight | Action |
|----|---------|--------|
| `play-dependent` | "Swiggy: 18 orders. Zomato: 2. At this point Swiggy should be listed as a dependent on your taxes." | — |
| `play-night-self` | "Your 10pm self has spent ₹16k this month. Morning you wakes up confused every time." | — |
| `play-race` | "Quit-job fund: ₹58k. Swiggy lifetime: ₹62k. Swiggy is winning, and it doesn't even know your name." | — |
| `play-two-people` | "Week 1 you spends like there's more coming. Week 4 you knows the truth." | — |
| `play-second-dinner` | "You ordered twice in one night 6 times this month. The 'second dinner' category is thriving." | — |

---

## Selection Logic

### Priority Order

1. **Risk insights** — if bills due soon, low balance projected, budget exceeded
2. **Goal insights** — if significantly ahead/behind pace, or milestone approaching
3. **Rating pattern insights** — if recent regret-marked transactions show a pattern
4. **Behavioral insights** — rotate through detectable patterns
5. **Celebrations** — when they're winning
6. **Playful** — max 1 per session, only when things are stable

### Rules

- Never show the same archetype twice in a row
- If celebrating, don't immediately follow with a roast
- Personalize with actual merchant names, amounts, timestamps from their data
- If an insight requires data we don't have, convert it to an `ask` type

