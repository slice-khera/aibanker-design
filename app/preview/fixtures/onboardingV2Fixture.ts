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
  "Went through three months of your money. Five things stood out.",
  "A habit. A name. A number that should bother you.",
  "Take a look?",
];

export const POST_WRAPPED_PRE_AA_BUBBLES = [
  "Anyway — hi, I’m Ryan.",
  "That was just one account. Your money lives in a lot more places — connect them and I'll put it all together.",
];

export const V2_AA_CHIPS = [
  { id: "connect", label: "Connect now" },
  { id: "later", label: "Maybe later" },
];

export const V2_AA_LINKED_BUBBLE = "HDFC Bank linked. Add another?";

export const V2_AA_POST_LINKED_CHIPS = [
  { id: "add-another", label: "Add another" },
  { id: "thats-all", label: "That's all" },
];

// ── Post-AA: preference collection ───────────────────────────────

export const V2_POST_AA_PREF_BUBBLES = [
  "I need a few minutes to crunch your transactions. While I get to work — tell me what you’re saving toward so I have a head start.",
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
  "Got it. I’m pulling your transactions now — this usually takes about 15 minutes.",
  "I’ll ping you when I’m ready. No need to wait here.",
];

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

// ── Ready state (after cruncher finishes) ────────────────────────

export const V2_READY_BUBBLES = [
  "I’ve gone through everything.",
  "Based on your spending and what you told me, here’s what I’d suggest.",
];

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
    question: "How many times did you order Swiggy in the last 3 months?",
    chips: [
      { id: "30-50", label: "30 – 50" },
      { id: "50-100", label: "50 – 100" },
      { id: "100-150", label: "100 – 150" },
      { id: "150+", label: "150+" },
    ],
    reveal: {
      hero: "143 times.",
      subline: "₹1.04 lakh. About every other day.",
      ryan: "The fridge isn’t doing much, is it.",
    },
  },
  {
    kind: "guess",
    id: "top-recipient",
    question: "Who got the most money from you this year — outside of rent?",
    chips: [
      { id: "friend", label: "A friend" },
      { id: "parents", label: "Your parents" },
      { id: "merchant", label: "A merchant" },
      { id: "yourself", label: "Yourself (savings)" },
    ],
    reveal: {
      hero: "Aditya.",
      subline:
        "₹38,400 across shared bills and IOUs. Your roommate is also your biggest creditor.",
      ryan: "Settle up — or stop counting. Your call.",
    },
  },
  {
    kind: "observation",
    id: "tuesday-spending",
    hero: "Tuesdays are your most expensive day.",
    subline: "₹2,140 average. Almost double what you spend on Mondays.",
    ryan: "Something about the middle of the week loosens your wallet.",
  },
  {
    kind: "guess",
    id: "subs-counterfactual",
    question:
      "You’re paying for 6 subscriptions you haven’t opened in 60 days. How much a month?",
    chips: [
      { id: "u500", label: "Under ₹500" },
      { id: "500-1500", label: "₹500 – ₹1,500" },
      { id: "1500-3500", label: "₹1,500 – ₹3,500" },
      { id: "3500+", label: "₹3,500+" },
    ],
    reveal: {
      hero: "₹3,240 a month.",
      subline: "₹38,880 a year. A round-trip to Bangkok.",
      ryan: "I’ll help you find them later. Worth a Sunday.",
    },
  },
  {
    kind: "reveal",
    id: "extrapolation-closer",
    hero: "At this pace, ₹4.2 lakh on food delivery this year.",
    subline: "About a flight to Tokyo and a week’s stay.",
    ryan: "I can help with this. Want to point at something to save toward?",
    ctaLabel: "Let’s go",
  },
];
