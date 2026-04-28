import type { Question } from "../../components/QuizCardStack";
import type { InsightSlide } from "../../components/InsightCarousel";
import type { GoalIndicatorData } from "../../components/GoalTracker";
import {
  VALENTINO_50, VALENTINO_500,
  BLUE_500,
  ORANGE_500,
  GREEN_500,
  RED_500,
} from "../../lib/colors";

// ── Pill data (Stage 1) ─────────────────────────────────────────

export const ONBOARDING_PILLS = [
  { id: "wrapped", icon: "/icons/spark.svg", label: "slice wrapped" },
  { id: "sparks", icon: "/icons/spark.svg", label: "5 new sparks" },
  { id: "fires", icon: "/icons/fire.svg", label: "3 fires left" },
];

// ── Insight slides (Stage 2 — Oura-style) ──────────────────────

export const INSIGHT_SLIDES: InsightSlide[] = [
  {
    id: "insight-1",
    header: [
      { type: "accent", value: "5 transactions" },
      { type: "text", value: " across " },
      { type: "accent", value: "5 merchants" },
      { type: "text", value: " this month" },
    ],
    viz: {
      type: "merchantList",
      totalSpend: 470,
      merchants: [
        { name: "Dilkush", amount: 160, pct: 34, color: VALENTINO_500 },
        { name: "Metro", amount: 120, pct: 26, color: BLUE_500 },
        { name: "Online", amount: 85, pct: 18, color: ORANGE_500 },
        { name: "Uber", amount: 60, pct: 13, color: GREEN_500 },
        { name: "Swiggy", amount: 45, pct: 10, color: RED_500 },
      ],
    },
    body: "Biggest spend was ₹160 at Dilkush, the rest stayed under ₹120 each",
  },
  {
    id: "insight-2",
    header: [
      { type: "text", value: "You spent " },
      { type: "accent", value: "₹493 more" },
      { type: "text", value: " than you earned this month" },
    ],
    viz: {
      type: "balance",
      earned: 4200,
      spent: 4693,
    },
    body: "0% needs, 100% wants — that gap has been shrinking since last month",
  },
  {
    id: "insight-3",
    header: [
      { type: "text", value: "S S B Enterprises is " },
      { type: "accent", value: "92 days" },
      { type: "text", value: " overdue" },
    ],
    viz: {
      type: "dots",
      total: 6,
      filled: 3,
      missedIndices: [3, 4, 5],
    },
    body: "3 consecutive missed payments, this has been a pattern — worth checking",
  },
  {
    id: "insight-4",
    header: [
      { type: "accent", value: "₹97,500" },
      { type: "text", value: " sent to Deepak N over " },
      { type: "accent", value: "3 months" },
    ],
    viz: {
      type: "trendBars",
      data: [
        { label: "Nov", value: 32500 },
        { label: "Dec", value: 32500 },
        { label: "Jan", value: 32500 },
      ],
      highlightIndex: 2,
      average: 32500,
    },
    body: "₹32,500 every month like clockwork — a regular transfer worth tracking",
  },
  {
    id: "insight-5",
    header: [
      { type: "text", value: "You dropped " },
      { type: "accent", value: "17 subscriptions" },
      { type: "text", value: " this month" },
    ],
    viz: {
      type: "celebrate",
      emoji: "🎉",
    },
    body: "That's ₹28,376/mo back in your pocket — one of your best moves this quarter",
  },
];

// ── Quiz questions (Stage 3) ────────────────────────────────────

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: "savings-pct",
    text: "How much of your income actually gets saved each month?",
    options: [
      { id: "0-5", label: "Less than 5%" },
      { id: "5-10", label: "5 - 10%" },
      { id: "10-20", label: "10 - 20%" },
      { id: "20+", label: "More than 20%" },
    ],
    correctId: "10-20",
    remarkCorrect: "Nailed it — you know your numbers.",
    remarkWrong: "It's actually 10–20%. Better than you thought.",
  },
  {
    id: "top-category",
    text: "I can see where your money goes — can you guess the biggest one?",
    options: [
      { id: "food", label: "Food & delivery" },
      { id: "shopping", label: "Shopping" },
      { id: "travel", label: "Travel" },
      { id: "subscriptions", label: "Subscriptions" },
      { id: "nights-out", label: "Nights out" },
    ],
    correctId: "food",
    remarkCorrect: "You know yourself — food & delivery at 28%.",
    remarkWrong: "Food & delivery, actually — 28% of your spend.",
  },
  {
    id: "category-share",
    text: "And how much of your total spend do you think that is?",
    options: [
      { id: "10", label: "10%" },
      { id: "20", label: "20%" },
      { id: "30", label: "30%" },
      { id: "40+", label: "40%+" },
    ],
    correctId: "30",
    remarkCorrect: "Spot on — 28% to be exact.",
    remarkWrong: "It's 28% — almost a third. Adds up fast.",
  },
  {
    id: "persona",
    text: "Last one — if I had to label your spending style, what would you pick?",
    options: [
      { id: "disciplined", label: "Disciplined" },
      { id: "weekend-splurger", label: "Weekend splurger" },
      { id: "impulse-buyer", label: "Impulse buyer" },
      { id: "convenience-spender", label: "Convenience spender" },
      { id: "subscription-collector", label: "Subscription collector" },
    ],
    correctId: "convenience-spender",
    remarkCorrect: "Self-aware — convenience spending is your pattern.",
    remarkWrong: "I'd say convenience spender — small quick wins add up.",
  },
];

// ── Gap analysis "actual" data (Stage 4) ────────────────────────

export const GAP_ANALYSIS = {
  actualSavingsPct: 18,
  actualTopCategory: "Food & Delivery",
  actualCategoryShare: 28,
  actualPersona: "Convenience spender",
};

/** Map quiz answer IDs to human-readable guesses for the gap screen. */
export function formatGuess(questionId: string, answerId: string): string {
  const map: Record<string, Record<string, string>> = {
    "savings-pct": { "0-5": "0–5%", "5-10": "5–10%", "10-20": "10–20%", "20+": "20%+", "no-idea": "No idea" },
    "top-category": { food: "Food", shopping: "Shopping", travel: "Travel", subscriptions: "Subscriptions", "nights-out": "Nights out" },
    "category-share": { "10": "10%", "20": "20%", "30": "30%", "40+": "40%+", "no-idea": "No idea" },
    persona: { disciplined: "Disciplined", "weekend-splurger": "Weekend splurger", "impulse-buyer": "Impulse buyer", "convenience-spender": "Convenience spender", "subscription-collector": "Subscription collector", complicated: "I'm complicated" },
    confidence: { very: "Very", somewhat: "Somewhat", guessing: "Guessing" },
  };
  return map[questionId]?.[answerId] ?? answerId;
}

// ── Ryan intro features (Stage 5) ───────────────────────────────

export const RYAN_FEATURES = [
  {
    title: "Sees what you don\u2019t",
    subtitle: "Spending patterns hiding in plain sight",
  },
  {
    title: "Gets sharper with you",
    subtitle: "The more you interact, the better it gets",
  },
  {
    title: "Not perfect yet",
    subtitle: "Early days \u2014 always double-check the details",
  },
];

// ── AA consent benefits (Stage 6a) ──────────────────────────────

export const AA_BENEFITS = [
  {
    title: "Deeper spending insights",
    subtitle: "Let Ryan analyse your full transaction history across accounts",
  },
  {
    title: "All your accounts, one place",
    subtitle: "Track balances and patterns across every bank you use",
  },
  {
    title: "100% secure process",
    subtitle: "RBI-licensed system ensures safe and consent-based access",
    cta: "Learn more",
  },
];

// ── AA Consent cards ────────────────────────────────────────────

export const AA_CONSENT_CARDS = [
  {
    title: "Spending analysis",
    subtitle: "To analyse your spending patterns",
    details: [
      { label: "Frequency", value: "One time" },
      { label: "Time period", value: "13 months" },
    ],
  },
  {
    title: "Ongoing tracking",
    subtitle: "To keep your insights up to date",
    details: [
      { label: "Frequency", value: "Up to 5x per month" },
      { label: "Consent validity", value: "12 months" },
    ],
  },
];

// ── AA Consent detail rows ──────────────────────────────────────

export const AA_CONSENT_DETAILS = [
  {
    title: "Spending analysis",
    rows: [
      { label: "Purpose", value: "To analyse your spending patterns" },
      { label: "Consent type", value: "Profile, summary, transactions" },
      { label: "Statement period", value: "13 Jan '25 - 14 Mar '25", hasInfo: true },
      { label: "Frequency", value: "Once" },
      { label: "Consent validity", value: "1 month" },
      { label: "Data life", value: "1 month", hasInfo: true },
    ],
  },
  {
    title: "Ongoing tracking",
    rows: [
      { label: "Purpose", value: "To keep your financial insights current" },
      { label: "Consent type", value: "Profile, summary, transactions" },
      { label: "Statement period", value: "13 Jan '25 - 14 Mar '25", hasInfo: true },
      { label: "Frequency", value: "Periodic (max 5x per month)" },
      { label: "Consent validity", value: "12 months" },
      { label: "Data life", value: "1 month", hasInfo: true },
    ],
  },
];

// ── AA Learn More (detail screen) ───────────────────────────────

export const AA_LEARN_MORE = {
  title: "Understanding account aggregator",
  subtitle: "Account aggregator is a RBI regulated consent based financial data sharing system.",
  benefits: [
    { title: "Safe", subtitle: "Your information is encrypted end to end and only used for your financial insights" },
    { title: "Trust", subtitle: "The AA framework is jointly created by RBI, SEBI, IRDAI & PFRDA" },
    { title: "Privacy", subtitle: "You are in charge of your data and can choose to share it" },
    { title: "Ease of access", subtitle: "AA allows you to manage all banking data in one place" },
  ],
  supportedBanks: ["SBI", "Axis", "HDFC", "Kotak", "ICICI"],
  aggregators: ["Perfios", "FINVU", "saafe", "N@DL", "Onemoney"],
};

// ── Banks (Stage 6b) ────────────────────────────────────────────

export const BANKS = [
  { id: "hdfc", label: "HDFC Bank", initial: "H", color: "#004C8F" },
  { id: "axis", label: "Axis Bank", initial: "A", color: "#97144D" },
  { id: "ippb", label: "India Post Payments Ba...", initial: "I", color: "#E8350E" },
  { id: "kotak", label: "Kotak Mahindra Bank", initial: "K", color: "#ED1C24" },
  { id: "kvb", label: "Karur Vyasa Bank", initial: "K", color: "#6B2D8B" },
  { id: "other", label: "Other bank", initial: "🏦", color: "#78808B" },
];

// ── Initial goal for chat stage (Stage 7) ───────────────────────

export const ONBOARDING_GOAL: GoalIndicatorData = {
  id: "1",
  name: "Trip to Japan",
  pct: 0,
  status: "on-track",
  icon: "✈️",
  daysLabel: "Just started",
  saved: 0,
  target: 200000,
  ringColor: VALENTINO_500,
  endDate: "Dec 2026",
  monthlyAmount: 10000,
  gradient: `linear-gradient(135deg, ${VALENTINO_50} 0%, ${VALENTINO_500} 100%)`,
  heroEmoji: "✈️",
  heroScene: "japan",
};
