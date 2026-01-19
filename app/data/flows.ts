export type ChipOption = {
  id: string;
  label: string;
  value?: string;
};

export type WrappedSlide = {
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

export type PersonaQuestion = {
  id: string;
  text: string;
  chips: ChipOption[];
  multiSelect?: boolean;
  followUp?: PersonaQuestion;
};

// ============ WRAPPED SLIDES ============
export const wrappedSlides: WrappedSlide[] = [
  {
    id: "wrapped-1",
    headline: "Your Month Wrapped 🎬",
    punchline: "Your spending had a personality this month. Let's diagnose it in 60 seconds.",
  },
  {
    id: "wrapped-2",
    headline: "Top category",
    punchline: "Your #1 category was Food & Delivery. It dominated ~28% of your variable spend.",
    stat: {
      label: "Top category share",
      value: "28%",
      caption: "Food & Delivery",
    },
    receipts: true,
  },
  {
    id: "wrapped-3",
    headline: "Your pattern",
    punchline: "You tend to crave late-night munchies. Most delivery happens after 10pm.",
    stat: {
      label: "Peak time",
      value: "After 10pm",
      caption: "Late-night orders",
    },
  },
  {
    id: "wrapped-4",
    headline: "A leak (no judgment)",
    punchline: "You had 2–3 spike days/week where spending jumps. Usually weekends.",
    stat: {
      label: "Spike days",
      value: "2–3 / week",
      caption: "Mostly weekends",
    },
  },
  {
    id: "wrapped-5",
    headline: "Your saving vibe",
    punchline: "You seem like a \"save later\" person. You prefer flexibility over strict budgets.",
    stat: {
      label: "Saving vibe",
      value: "Save later",
      caption: "Flexible over strict",
    },
  },
  {
    id: "wrapped-6",
    headline: "Ready for the fun part?",
    punchline: "Tell me what you think you do… then I'll show you reality.",
  },
];

// ============ PERSONA QUESTIONS ============
export const personaQuestions: PersonaQuestion[] = [
  {
    id: "q1-savings",
    text: "Be honest — roughly what % of your income do you save each month?",
    chips: [
      { id: "0-5", label: "0–5%", value: "0-5%" },
      { id: "5-10", label: "5–10%", value: "5-10%" },
      { id: "10-20", label: "10–20%", value: "10-20%" },
      { id: "20-plus", label: "20%+", value: "20%+" },
      { id: "no-idea", label: "No idea", value: "unknown" },
    ],
  },
  {
    id: "q2-disposable",
    text: "Of your disposable money (after bills), where does most go?",
    chips: [
      { id: "food", label: "Food", value: "Food" },
      { id: "shopping", label: "Shopping", value: "Shopping" },
      { id: "travel", label: "Travel", value: "Travel" },
      { id: "subs", label: "Subscriptions", value: "Subscriptions" },
      { id: "nights-out", label: "Nights out", value: "Nights out" },
      { id: "other", label: "Other", value: "Other" },
    ],
    multiSelect: false,
  },
  {
    id: "q2-followup",
    text: "Pick the biggest one's share:",
    chips: [
      { id: "10", label: "10%", value: "10%" },
      { id: "20", label: "20%", value: "20%" },
      { id: "30", label: "30%", value: "30%" },
      { id: "40", label: "40%+", value: "40%+" },
      { id: "no-idea", label: "No idea", value: "unknown" },
    ],
  },
  {
    id: "q3-persona",
    text: "What's your spending persona according to you?",
    chips: [
      { id: "disciplined", label: "Disciplined", value: "Disciplined" },
      { id: "weekend", label: "Weekend splurger", value: "Weekend splurger" },
      { id: "impulse", label: "Impulse buyer", value: "Impulse buyer" },
      { id: "convenience", label: "Convenience spender", value: "Convenience spender" },
      { id: "subs", label: "Subscription collector", value: "Subscription collector" },
      { id: "complicated", label: "I'm complicated", value: "Complicated" },
    ],
  },
  {
    id: "q4-confidence",
    text: "How confident are you in those answers?",
    chips: [
      { id: "very", label: "Very", value: "very" },
      { id: "somewhat", label: "Somewhat", value: "somewhat" },
      { id: "guessing", label: "Guessing", value: "guessing" },
    ],
  },
];

// ============ REALITY CHECK ============
export const realityChips: ChipOption[] = [
  { id: "save-more", label: "Help me save more" },
  { id: "control-food", label: "Help me control Food" },
  { id: "control-shopping", label: "Help me control Shopping" },
];

// ============ GOAL SETTING ============
export const goalChips: ChipOption[] = [
  { id: "trip", label: "Trip", value: "Trip" },
  { id: "big-purchase", label: "Big purchase", value: "Big purchase" },
  { id: "emergency", label: "Emergency fund", value: "Emergency fund" },
  { id: "increase-savings", label: "Increase monthly savings", value: "Increase monthly savings" },
  { id: "quit-job", label: "Quit-job fund", value: "Quit-job fund" },
];

export const timelineChips: ChipOption[] = [
  { id: "3m", label: "3 months", value: "3 months" },
  { id: "6m", label: "6 months", value: "6 months" },
  { id: "1y", label: "1 year", value: "12 months" },
  { id: "someday", label: "Just someday", value: "Someday" },
];

export const amountChips: ChipOption[] = [
  { id: "50k", label: "₹50k", value: "₹50k" },
  { id: "1l", label: "₹1L", value: "₹1L" },
  { id: "5l", label: "₹5L", value: "₹5L" },
  { id: "10l", label: "₹10L", value: "₹10L" },
  { id: "skip", label: "Skip", value: "Not set" },
];

export const paceChoiceChips: ChipOption[] = [
  { id: "aggressive", label: "Aggressive" },
  { id: "balanced", label: "Balanced" },
  { id: "relaxed", label: "Relaxed" },
];

export const paceAdjustChips: ChipOption[] = [
  { id: "try-aggressive", label: "Try aggressive" },
  { id: "show-balanced", label: "Show balanced" },
  { id: "keep-relaxed", label: "Keep relaxed" },
];

export const paceContinueChips: ChipOption[] = [
  { id: "continue", label: "Continue to plan" },
  { id: "tweak-pace", label: "Change pace" },
];

export const budgetReviewChips: ChipOption[] = [
  { id: "approve-budget", label: "Looks good" },
  { id: "edit-budget", label: "Edit budgets" },
];

export const pinnedGoalChips: ChipOption[] = [
  { id: "show-plan", label: "Show plan" },
  { id: "adjust-goal", label: "Adjust goal" },
  { id: "add-goal", label: "Add a second goal" },
];

// ============ BUDGET / PLAN HANDSHAKE ============
export const budgetDigestChips: ChipOption[] = [
  { id: "ok-pace", label: "I'm okay with this pace" },
  { id: "cut", label: "Show me what to cut" },
  { id: "soft-plan", label: "Show me a softer plan" },
];

export const onTrackChips: ChipOption[] = [
  { id: "auto", label: "Make it automatic" },
  { id: "keep-posted", label: "Just keep me posted" },
  { id: "backup", label: "Set a backup buffer" },
];

export const budgetLevers: ChipOption[] = [
  { id: "trim-shopping", label: "Trim Shopping (₹2k/month)" },
  { id: "trim-food", label: "Trim Food (2 orders less)" },
  { id: "kill-subs", label: "Kill subscriptions" },
  { id: "increase-income", label: "Increase income" },
  { id: "no-change", label: "Don't change anything" },
];

export const budgetAgreementChips: ChipOption[] = [
  { id: "yes-set", label: "Yes, set it" },
  { id: "track", label: "No, just track" },
  { id: "choose", label: "Let me choose" },
];

export const budgetStyleChips: ChipOption[] = [
  { id: "strict", label: "Strict" },
  { id: "chill", label: "Chill" },
  { id: "bucket", label: "Buffer bucket" },
];

// ============ ACTION SUGGESTIONS ============
export const autosaveChips: ChipOption[] = [
  { id: "auto-on", label: "Turn on ₹70/day" },
  { id: "auto-small", label: "Make it smaller" },
  { id: "auto-no", label: "No thanks" },
];

export const rdChips: ChipOption[] = [
  { id: "rd-start", label: "Start RD ₹10k" },
  { id: "rd-other", label: "Show other amounts" },
  { id: "rd-not", label: "Not now" },
];

export const fdChips: ChipOption[] = [
  { id: "fd-create", label: "Create FD" },
  { id: "fd-liquid", label: "Keep liquid" },
  { id: "fd-explain", label: "Explain FD vs RD" },
];

// ============ STEADY STATE ============
export const steadyStateChips: ChipOption[] = [
  { id: "afford", label: "Can I afford…" },
  { id: "worth", label: "Worth it?" },
  { id: "progress", label: "Progress" },
  { id: "leaks", label: "Find leaks" },
  { id: "powerups", label: "Power-ups" },
];

// ============ SUBFLOW: CAN I AFFORD ============
export const affordAmountChips: ChipOption[] = [
  { id: "amt-500", label: "₹500" },
  { id: "amt-1500", label: "₹1,500" },
  { id: "amt-3000", label: "₹3,000" },
  { id: "amt-5000", label: "₹5,000" },
  { id: "amt-custom", label: "Other amount" },
];

export const affordTimingChips: ChipOption[] = [
  { id: "today", label: "Today" },
  { id: "this-week", label: "This week" },
  { id: "this-month", label: "Before month end" },
];

export const affordOutcomeChips: ChipOption[] = [
  { id: "treat", label: "Treat" },
  { id: "plan", label: "Plan" },
];

export const affordTreatChips: ChipOption[] = [
  { id: "bucket", label: "Update buffer" },
  { id: "cap", label: "Set a soft cap" },
  { id: "nudge", label: "Nudge me before" },
];

export const affordPlanChips: ChipOption[] = [
  { id: "add-goal", label: "Add to goal" },
  { id: "reduce", label: "Reduce elsewhere" },
  { id: "extend", label: "Extend timeline" },
];

// ============ SUBFLOW: WORTH IT ============
export const recentTransactions = [
  { id: "txn-1", label: "11:21pm Food ₹380", time: "11:21pm", category: "Food", amount: "₹380" },
  { id: "txn-2", label: "10:05pm Food ₹520", time: "10:05pm", category: "Food", amount: "₹520" },
  { id: "txn-3", label: "09:10pm Food ₹290", time: "09:10pm", category: "Food", amount: "₹290" },
];

export const worthItChips: ChipOption[] = [
  { id: "worth", label: "Worth it" },
  { id: "meh", label: "Meh" },
  { id: "regret", label: "Regret" },
];

export const regretReasonChips: ChipOption[] = [
  { id: "impulse", label: "Impulse" },
  { id: "peer-pressure", label: "Peer pressure" },
  { id: "convenience", label: "Convenience" },
  { id: "bored", label: "Bored" },
  { id: "other", label: "Other" },
];

export const regretActionChips: ChipOption[] = [
  { id: "set-cap", label: "Set a cap" },
  { id: "nudge-me", label: "Nudge me next time" },
  { id: "mute", label: "Mute this category" },
];

// ============ SUBFLOW: FIND LEAKS ============
export const leakSuspects = [
  { id: "leak-latenight", label: "Late-night delivery", pattern: "After 10pm orders" },
  { id: "leak-weekend", label: "Weekend spikes", pattern: "Fri–Sun splurges" },
  { id: "leak-subs", label: "Subscriptions", pattern: "Monthly auto-debits" },
];

export const leakJoyRegretChips: ChipOption[] = [
  { id: "joy", label: "Joy" },
  { id: "regret", label: "Regret" },
  { id: "mixed", label: "Mixed" },
];

export const leakFixChips: ChipOption[] = [
  { id: "cap", label: "Set a cap" },
  { id: "bucket", label: "Update buffer" },
  { id: "nudge", label: "Nudge before" },
  { id: "mute", label: "Mute this" },
];

// ============ SUBFLOW: PROGRESS ============
export const progressAdjustChips: ChipOption[] = [
  { id: "boost", label: "Boost goal" },
  { id: "keep", label: "Keep as is" },
  { id: "pause", label: "Pause tweaks" },
];

export const progressBoostChips: ChipOption[] = [
  { id: "autosave", label: "Autosave more" },
  { id: "rd", label: "Start RD" },
  { id: "cut-more", label: "Cut more" },
];

// ============ SUBFLOW: POWER-UPS ============
export const powerUpTypeChips: ChipOption[] = [
  { id: "pu-autosave", label: "Autosave" },
  { id: "pu-rd", label: "RD" },
  { id: "pu-fd", label: "FD" },
];

export const autosaveAmountChips: ChipOption[] = [
  { id: "as-50", label: "₹50/day" },
  { id: "as-70", label: "₹70/day (recommended)" },
  { id: "as-100", label: "₹100/day" },
];

export const rdAmountChips: ChipOption[] = [
  { id: "rd-5k", label: "₹5k/month" },
  { id: "rd-10k", label: "₹10k/month (recommended)" },
  { id: "rd-15k", label: "₹15k/month" },
];

export const fdAmountChips: ChipOption[] = [
  { id: "fd-25k", label: "₹25k" },
  { id: "fd-50k", label: "₹50k" },
  { id: "fd-1l", label: "₹1L" },
];

export const confirmChips: ChipOption[] = [
  { id: "confirm", label: "Confirm" },
  { id: "cancel", label: "Cancel" },
];

export const tradeoffChoiceChips: ChipOption[] = [
  { id: "reduce-elsewhere", label: "Reduce elsewhere" },
  { id: "extend-timeline", label: "Extend goal timeline" },
];
