// Onboarding v2 fixture — chat-led flow with Pool-style Wrapped story.
// All copy + numbers hard-coded for design review.

// ── Pay screen pills (entry) ──────────────────────────────────

export const V2_PILLS: { id: string; icon: string; label: string; tappable: boolean }[] = [
  { id: "meet-ryan", icon: "/icons/placeholder.svg", label: "Meet Ryan", tappable: true },
  { id: "sparks", icon: "/icons/spark.svg", label: "5 new sparks", tappable: false },
  { id: "fires", icon: "/icons/fire.svg", label: "3 fires left", tappable: false },
];

// ── Chat sequence — Ryan's bubbles before Wrapped opens ────────

export const PRE_WRAPPED_BUBBLES = [
  "Went through three months of your money.\nA few things stood out.",
  "A habit.\nA name.\nA number that should bother you.",
];

export const POST_WRAPPED_PRE_AA_BUBBLES = [
  "Anyway — hi, I’m Ryan.",
  "That was just one account. Your money lives in a lot more places — connect them and I'll put it all together.",
];

export const V2_AA_CHIPS = [
  { id: "connect", label: "Connect now" },
  { id: "later", label: "Maybe later" },
];

export const V2_AA_LINKED_BUBBLE = "HDFC Bank ••4829 is linked. I'm pulling in your transactions now — once that's done I'll have a much clearer picture of where your money actually goes. Want to add another account?";

export const V2_AA_POST_LINKED_CHIPS = [
  { id: "add-another", label: "Add another" },
  { id: "thats-all", label: "Remind me later" },
];

// ── Post-AA: preference collection ───────────────────────────────

export const V2_POST_AA_PREF_BUBBLES = [
  "Saving without a reason never sticks. Give me something concrete to aim at and I’ll actually make it work. While I crunch your numbers — let’s find your reason.",
];

export type V2QuestionOption = { id: string; label: string };
export type V2Question = { id: string; text: string; options: V2QuestionOption[] };

export const V2_GOAL_PREFERENCE_QUESTIONS: V2Question[] = [
  {
    id: "goal-type",
    text: "What are you working toward?",
    options: [
      { id: "trip", label: "A trip" },
      { id: "emergency", label: "Emergency fund" },
      { id: "purchase", label: "Big purchase" },
      { id: "save-more", label: "Just save more" },
    ],
  },
  {
    id: "destination",
    text: "Where are you headed?",
    options: [],
  },
  {
    id: "timeline",
    text: "By when?",
    options: [
      { id: "3m", label: "3 months" },
      { id: "6m", label: "6 months" },
      { id: "1y", label: "12 months" },
      { id: "flexible", label: "Flexible" },
    ],
  },
  {
    id: "amount",
    text: "Roughly how much?",
    options: [
      { id: "50k", label: "₹50k" },
      { id: "1L", label: "₹1L" },
      { id: "2L", label: "₹2L" },
      { id: "5L+", label: "₹5L+" },
    ],
  },
];

// ── Post-preference bubbles + cruncher + filler ──────────────────

export const V2_POST_PREF_BUBBLES = [
  "Got it — let me check your finances and put together a plan. I’ll ping you when I’m ready.",
];

// ── V2 filler (used by OnboardingSimV2 only) ────────────────────

export const V2_FILLER_BUBBLE = "While I work, a few things you can poke around with.";

export const V2_FILLER_CARDS = [
  { category: "Learn", title: "How Ryan works", bg: "linear-gradient(160deg, #ffffff 40%, #fae2fa 100%)" },
  { category: "Try", title: "Ask me anything", bg: "linear-gradient(160deg, #ffffff 40%, #e6edf9 100%)" },
  { category: "Share", title: "Invite a friend", bg: "linear-gradient(160deg, #ffffff 40%, #e0f4e8 100%)" },
];

export const V2_CRUNCHER_STATUS_TEXTS = [
  "Pulling transactions…",
  "Scanning 13 months of history…",
  "Mapping spending patterns…",
  "Identifying savings potential…",
  "Almost there…",
];

export const V2_READY_BUBBLES = [
  "I’ve gone through everything.",
  "Based on your spending and what you told me, here’s what I’d suggest.",
];

// ── Clarifying questions (V3 — mirrors PlanMode) ─────────────────

export type V2ClarifyingQuestion = {
  id: string;
  botText: string;
  chips: { id: string; label: string }[];
};

export const V2_CLARIFYING_QUESTIONS: V2ClarifyingQuestion[] = [
  {
    id: "cq-obligations",
    botText: "I can see a few recurring obligations — rent, car EMI, subscriptions. Should I account for all of them or just the essentials?",
    chips: [
      { id: "all", label: "All of them" },
      { id: "essentials", label: "Just essentials" },
    ],
  },
  {
    id: "cq-existing",
    botText: "You have about ₹50k in existing investments. Want to count that toward this goal?",
    chips: [
      { id: "yes", label: "Yes, include that" },
      { id: "no", label: "No, start fresh" },
    ],
  },
  {
    id: "cq-risk",
    botText: "One more — how do you feel about risk? This helps me pick the right instrument.",
    chips: [
      { id: "safe", label: "Keep it safe" },
      { id: "balanced", label: "Balanced" },
      { id: "aggressive", label: "I can take some risk" },
    ],
  },
];

export const V2_CLARIFY_CRUNCHER_STATUSES = [
  "Checking monthly obligations",
  "Reviewing your finances",
  "Analysing risk profile",
];

export const V2_IDLE_CRUNCHER_TEXTS = [
  "Comparing savings instruments",
  "Optimising monthly allocation",
  "Projecting returns",
  "Running scenarios",
  "Crunching the numbers",
  "Building your savings plan",
];

export const V2_VERBOSE_PLAN_TEXT = `Alright — here’s what I’d put together based on what you shared.

You’re aiming for ₹2L by October, which gives us about six months. With ₹50,000 already saved and some room to redirect spending, this is very doable without anything drastic.

Here’s how I’d split it. First, open a Recurring Deposit at 7.25% p.a. for six months with ₹20,000 going in every month. I’m picking an RD over a regular savings account because the rate is nearly double and the auto-debit makes it easier to stay consistent. Over six months that alone compounds to about ₹1,23,000.

Next, move your existing ₹50,000 into the same RD upfront so it starts earning the same rate immediately — by October that parks at roughly ₹51,875.

Finally, trim around ₹5,000/month from discretionary spending. Looking at the last three months, you’re averaging about ₹8,000/month on eating out and subscriptions, so there’s comfortable room here without cutting anything essential. That adds another ₹30,000 over the six months.

Stacked together, you land at roughly ₹2,04,875 by October — a small buffer over your goal.

A few things worth knowing: the RD locks in your 7.25% rate, so even if rates drop later you’re protected. If something unexpected comes up and you need to pull money out early, you can break it — though you’d lose a bit of accrued interest. I’ll also set up a heads-up two weeks before each auto-debit in case you want to pause a month.

Want me to go ahead and set this up, or would you like to tweak any piece of it first?`;

// ── AA card states (placeholder) ───────────────────────────────

export const V2_AA_CARD = {
  pending: {
    title: "Connect your account",
    subtitle: "30 seconds. Bank-grade, RBI-licensed.",
    cta: "Connect",
  },
  loading: {
    title: "Connecting…",
    subtitle: "Verifying with HDFC.",
  },
  linked: {
    bankName: "HDFC Bank",
    accountDetail: "Savings xx6543",
  },
};

// ── Wrapped trigger card ───────────────────────────────────────

export const V2_WRAPPED_CARD = {
  eyebrow: "A READ FROM RYAN",
  cta: "Take a look",
};

// ── Wrapped story beats ────────────────────────────────────────

export type GuessChip = { id: string; label: string };

export type WrappedBeat =
  | {
      kind: "guess";
      id: string;
      question: string;
      chips: GuessChip[];
      reveal: {
        hero: string;
        subline: string;
        ryan: string;
      };
    }
  | {
      kind: "observation";
      id: string;
      hero: string;
      subline: string;
      ryan: string;
    }
  | {
      kind: "reveal";
      id: string;
      hero: string;
      subline: string;
      ryan: string;
      ctaLabel: string;
    };

export const WRAPPED_BEATS: WrappedBeat[] = [
  {
    kind: "guess",
    id: "swiggy-volume",
    question: "How many times did you order from Swiggy in the last 3 months?",
    chips: [
      { id: "30-50", label: "30 – 50" },
      { id: "50-100", label: "50 – 100" },
      { id: "100-150", label: "100 – 150" },
      { id: "150+", label: "150+" },
    ],
    reveal: {
      hero: "143 times.",
      subline: "₹1.04 lakh. About every other day.",
      ryan: "The fridge isn’t doing much, is it?",
    },
  },
  {
    kind: "guess",
    id: "top-recipient",
    question: "Who did you send the most money to?",
    chips: [
      { id: "friend", label: "A friend" },
      { id: "parents", label: "Your parents" },
      { id: "merchant", label: "A merchant" },
      { id: "yourself", label: "Yourself" },
    ],
    reveal: {
      hero: "Aditya.",
      subline:
        "₹38,400 across shared bills and IOUs. Your roommate is also your biggest creditor.",
      ryan: "You two should probably just open a joint account.",
    },
  },
  {
    kind: "guess",
    id: "tuesday-spending",
    question: "What's your most expensive day of the week?",
    chips: [
      { id: "monday", label: "Monday" },
      { id: "tuesday", label: "Tuesday" },
      { id: "friday", label: "Friday" },
      { id: "saturday", label: "Saturday" },
    ],
    reveal: {
      hero: "Tuesdays are your most expensive day.",
      subline: "₹2,140 average. Almost double what you spend on Mondays.",
      ryan: "It's the quiet ones you don't see coming.",
    },
  },
  {
    kind: "guess",
    id: "subs-counterfactual",
    question:
      "How much do you pay every month for things you don’t use?",
    chips: [
      { id: "u500", label: "Under ₹500" },
      { id: "500-1500", label: "₹500 – ₹1,500" },
      { id: "1500-3500", label: "₹1,500 – ₹3,500" },
      { id: "3500+", label: "₹3,500+" },
    ],
    reveal: {
      hero: "₹3,240 a month.",
      subline: "₹38,880 a year. A round-trip to Bangkok.",
      ryan: "Want me to cancel them? Just say the word.",
    },
  },
  {
    kind: "reveal",
    id: "extrapolation-closer",
    hero: "You were in the red 67% of the time.",
    subline: "2 out of the last 3 months, you spent more than you earned.",
    ryan: "That's why I'm here.",
    ctaLabel: "Let’s go",
  },
];

// ── V3 card system — shared palettes + beat data ─────────────────

// DLS Decorative tokens — subtle (bg), bold (text/number), accent (blob at 12%)
export const V3_CARD_PALETTES = [
  { bg: "#FAE2FA", accent: "rgba(211, 10, 215, 0.12)", text: "#D30AD7" },   // Valentino
  { bg: "#E6EDF9", accent: "rgba(43, 106, 207, 0.12)", text: "#2B6ACF" },   // Blue
  { bg: "#E0F4E8", accent: "rgba(61, 187, 108, 0.12)", text: "#00A63E" },   // Green
  { bg: "#FFF3E3", accent: "rgba(255, 178, 79, 0.12)", text: "#C27511" },   // Orange
  { bg: "#F9E4E5", accent: "rgba(218, 83, 90, 0.12)", text: "#CE1D26" },    // Red
];

export const V3_BEAT_DATA: Record<string, { number: string; labelAbove: string; labelBelow: string }> = {
  "swiggy-volume":        { number: "143x",  labelAbove: "You ordered from Swiggy", labelBelow: "in 3 months" },
  "top-recipient":        { number: "₹38K",  labelAbove: "You sent",       labelBelow: "to Aditya" },
  "tuesday-spending":     { number: "₹2.1K", labelAbove: "Tuesdays cost you", labelBelow: "more than any other day" },
  "subs-counterfactual":  { number: "₹3.2K", labelAbove: "You're paying",  labelBelow: "every month, for nothing" },
  "extrapolation-closer": { number: "67%",   labelAbove: "You were in the red", labelBelow: "of the time" },
};
