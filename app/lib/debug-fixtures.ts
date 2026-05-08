/**
 * Debug panel fixture data — card previews, goal tracker scenarios,
 * and goal questionnaire questions. Extracted from page.tsx for clarity.
 */

import type { ChatCardData } from "../components/ChatCards";
import type { GoalIndicatorData } from "../components/GoalTracker";
import type { Question } from "../components/QuestionnaireOverlay";

// ─── Card fixtures ────────────────────────────────────────────

export const DBG_SPEND_OVERVIEW: ChatCardData = {
  type: "spend-overview",
  month: "Feb",
  amount: 78400,
  comparisonText: "12% higher than your average",
  chartData: [
    { label: "Sep", value: 58000 },
    { label: "Oct", value: 63200 },
    { label: "Nov", value: 71000 },
    { label: "Dec", value: 89500 },
    { label: "Jan", value: 66800 },
    { label: "Feb", value: 78400 },
  ],
  average: 67200,
  highlightIndex: 5,
};

export const DBG_CATEGORY_BAR: ChatCardData = {
  type: "category-breakdown",
  month: "Feb",
  amount: 78400,
  subtext: "across 12 categories",
  showAll: true,
  categories: [
    { name: "Food & Delivery", amount: 22400, pct: 29, color: "#ff9a17", icon: "\ud83c\udf54" },
    { name: "Shopping", amount: 18600, pct: 24, color: "#d30ad7", icon: "\ud83d\udecd\ufe0f" },
    { name: "Transport", amount: 11200, pct: 14, color: "#2b6acf", icon: "\ud83d\ude97" },
    { name: "Subscriptions", amount: 8400, pct: 11, color: "#00a63e", icon: "\ud83d\udcf1" },
    { name: "Utilities", amount: 7800, pct: 10, color: "#ce1d26", icon: "\ud83d\udca1" },
    { name: "Other", amount: 10000, pct: 13, color: "#8e949d", icon: "\ud83d\udce6" },
  ],
};

// ─── Goal Tracker demo scenarios ──────────────────────────────

export type GoalTrackerScenario = "none" | "single" | "single-icon" | "single-alert" | "single-icon-alert" | "two" | "three";

export const GOAL_TRACKER_SCENARIOS: Record<GoalTrackerScenario, GoalIndicatorData[]> = {
  none: [],
  single: [
    { id: "1", name: "Trip to Japan", pct: 42, status: "on-track", icon: "\u2708\ufe0f", daysLabel: "4 months left", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
  ],
  "single-icon": [
    { id: "1", name: "Trip to Japan", pct: 42, status: "on-track", icon: "\u2708\ufe0f", daysLabel: "4 months left", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
  ],
  "single-alert": [
    { id: "1", name: "Trip to Japan", pct: 42, status: "behind", icon: "\u2708\ufe0f", daysLabel: "15 days behind", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
  ],
  "single-icon-alert": [
    { id: "1", name: "Trip to Japan", pct: 42, status: "behind", icon: "\u2708\ufe0f", daysLabel: "15 days behind", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
  ],
  two: [
    { id: "1", name: "Trip to Japan", pct: 62, status: "ahead", icon: "\u2708\ufe0f", daysLabel: "11 days ahead", saved: 124000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
    { id: "2", name: "Emergency Fund", pct: 35, status: "on-track", icon: "\ud83d\udee1\ufe0f", daysLabel: "On track", saved: 175000, target: 500000, ringColor: "#ff9a17", endDate: "Mar 2027", monthlyAmount: 15000, gradient: "linear-gradient(135deg, #fff3e3 0%, #ff9a17 100%)", heroEmoji: "\ud83d\udee1\ufe0f" },
  ],
  three: [
    { id: "1", name: "Trip to Japan", pct: 42, status: "on-track", icon: "\u2708\ufe0f", daysLabel: "4 months left", saved: 84000, target: 200000, ringColor: "#d30ad7", endDate: "Dec 2026", monthlyAmount: 10000, gradient: "linear-gradient(135deg, #fae2fa 0%, #d30ad7 100%)", heroEmoji: "\u2708\ufe0f", heroScene: "japan" },
    { id: "2", name: "Emergency Fund", pct: 78, status: "ahead", icon: "\ud83d\udee1\ufe0f", daysLabel: "12 days ahead", saved: 390000, target: 500000, ringColor: "#ff9a17", endDate: "Mar 2027", monthlyAmount: 15000, gradient: "linear-gradient(135deg, #fff3e3 0%, #ff9a17 100%)", heroEmoji: "\ud83d\udee1\ufe0f" },
    { id: "3", name: "New Laptop", pct: 65, status: "on-track", icon: "\ud83d\udcbb", daysLabel: "On track", saved: 48750, target: 75000, ringColor: "#00a63e", endDate: "Sep 2026", monthlyAmount: 5000, gradient: "linear-gradient(135deg, #e0f4e8 0%, #00a63e 100%)", heroEmoji: "\ud83d\udcbb" },
  ],
};

// ─── Goal card fixtures ───────────────────────────────────────

export const DBG_GOAL_AHEAD: ChatCardData = {
  type: "goal-progress",
  name: "Trip to Japan",
  pct: 62,
  saved: 93000,
  target: 150000,
  daysLabel: "11 days ahead",
  status: "ahead",
};

export const DBG_GOAL_BEHIND: ChatCardData = {
  type: "goal-progress",
  name: "Trip to Japan",
  pct: 38,
  saved: 57000,
  target: 150000,
  daysLabel: "14 days behind",
  status: "behind",
};

export const DBG_GOAL_ONTRACK: ChatCardData = {
  type: "goal-progress",
  name: "Trip to Japan",
  pct: 50,
  saved: 75000,
  target: 150000,
  daysLabel: "On track",
  status: "on-track",
};

// ─── Investment fixtures ──────────────────────────────────────

export const DBG_FD_SETUP: ChatCardData = {
  type: "investment-product",
  productType: "Fixed Deposit",
  amount: 15000,
  rate: "7.25% p.a.",
  tenure: "1 year",
  amountOptions: [
    { label: "\u20b910k", value: 10000 },
    { label: "\u20b915k", value: 15000 },
    { label: "\u20b918k", value: 18000 },
  ],
  accountLabel: "Savings xx1234",
  activated: false,
};

export const DBG_FD_ACTIVATED: ChatCardData = {
  type: "investment-product",
  productType: "Fixed Deposit",
  amount: 15000,
  rate: "7.25% p.a.",
  tenure: "1 year",
  amountOptions: [
    { label: "\u20b910k", value: 10000 },
    { label: "\u20b915k", value: 15000 },
    { label: "\u20b918k", value: 18000 },
  ],
  accountLabel: "Savings xx1234",
  activated: true,
};

export const DBG_SAVINGS_PLAN: ChatCardData = {
  type: "savings-plan",
  name: "Trip to Japan",
  target: 150000,
  timeline: "Dec 2025",
  existingSavings: 30000,
  monthlyAmount: 8500,
  productType: "RD",
  productLabel: "Recurring Deposit",
  rate: "6.5% p.a.",
  pct: 20,
  timelineLabel: "11 months \u00b7 Dec 2025",
};

// ─── Visualization fixtures ───────────────────────────────────

export const DBG_MERCHANT_BAR: ChatCardData = {
  type: "merchant-concentration",
  month: "Feb",
  totalSpend: 78400,
  totalMerchants: 23,
  merchants: [
    { name: "Swiggy", amount: 14200, pct: 18, color: "#ff9a17" },
    { name: "Amazon", amount: 12800, pct: 16, color: "#d30ad7" },
    { name: "Uber", amount: 8400, pct: 11, color: "#2b6acf" },
    { name: "BigBasket", amount: 6200, pct: 8, color: "#00a63e" },
    { name: "Zomato", amount: 5800, pct: 7, color: "#ce1d26" },
  ],
};

export const DBG_CATEGORY_MOM: ChatCardData = {
  type: "category-mom",
  thisMonth: "Feb",
  lastMonth: "Jan",
  categories: [
    { name: "Food", thisValue: 22400, lastValue: 18000, color: "#ff9a17" },
    { name: "Shopping", thisValue: 18600, lastValue: 21000, color: "#d30ad7" },
    { name: "Transport", thisValue: 11200, lastValue: 9800, color: "#2b6acf" },
    { name: "Utilities", thisValue: 7800, lastValue: 7200, color: "#00a63e" },
    { name: "Fun", thisValue: 6000, lastValue: 8400, color: "#ce1d26" },
  ],
};

export const DBG_SPEND_TREND: ChatCardData = {
  type: "spend-trend",
  month: "Feb",
  chartData: [
    { label: "Sep", value: 58000 },
    { label: "Oct", value: 63200 },
    { label: "Nov", value: 71000 },
    { label: "Dec", value: 89500 },
    { label: "Jan", value: 66800 },
    { label: "Feb", value: 78400 },
  ],
  average: 67200,
  highlightIndex: 5,
};

export const DBG_HEATMAP: ChatCardData = {
  type: "spending-heatmap",
  month: "Feb",
  year: 2025,
  startDay: 5,
  dailySpend: [
    3200, 0, 1800, 4500, 2200, 6800, 1200,
    900, 3400, 5100, 2800, 0, 7200, 1500,
    2100, 4200, 3800, 1100, 8500, 2400, 600,
    3900, 5600, 2000, 1400, 4800, 3100, 7800,
  ],
  maxSpend: 8500,
};

export const DBG_DONUT_V2: ChatCardData = {
  type: "payment-mode-donut-v2",
  month: "Feb",
  totalSpend: 78400,
  modes: [
    { name: "UPI", amount: 41200, pct: 53, color: "#d30ad7" },
    { name: "Credit Card", amount: 22100, pct: 28, color: "#2b6acf" },
    { name: "Debit Card", amount: 9400, pct: 12, color: "#ff9a17" },
    { name: "NEFT/IMPS", amount: 3800, pct: 5, color: "#00a63e" },
    { name: "Cash", amount: 1900, pct: 2, color: "#8e949d" },
  ],
};

export const DBG_TXN_TABLE: ChatCardData = {
  type: "transaction-table",
  title: "Recent transactions",
  transactions: [
    { date: "28 Feb", merchant: "Swiggy", amount: 486, category: "Food" },
    { date: "27 Feb", merchant: "Amazon", amount: 2499, category: "Shopping" },
    { date: "27 Feb", merchant: "Uber", amount: 342, category: "Transport" },
    { date: "26 Feb", merchant: "BigBasket", amount: 1850, category: "Groceries" },
    { date: "25 Feb", merchant: "Zomato", amount: 720, category: "Food" },
  ],
};

export const DBG_OBLIGATIONS_V2: ChatCardData = {
  type: "obligations-list-v2",
  items: [
    { id: "v2-1", payee: "Satya Prak", amount: 21700, type: "Rent/EMI", seenMonths: "3/4 months" },
    { id: "v2-2", payee: "Satishk019", amount: 4000, type: "P2P", seenMonths: "3/4 months" },
    { id: "v2-3", payee: "Vinod Kumar", amount: 3000, type: "P2P", seenMonths: "3/4 months" },
    { id: "v2-4", payee: "Mukesh Kumar", amount: 2500, type: "P2P", seenMonths: "4/4 months" },
    { id: "v2-5", payee: "Delhi Metro", amount: 1500, type: "Utility", seenMonths: "3/4 months" },
  ],
  monthlyIncome: 27000,
};

export const DBG_BIG_EXPENSES: ChatCardData = {
  type: "big-expenses",
  transactions: [
    { id: "big-1", payee: "Jasvinder", date: "26 Feb 2026", type: "P2P", amount: 99000 },
    { id: "big-2", payee: "Avigayen55", date: "25 Dec 2025", type: "P2P", amount: 35000 },
    { id: "big-3", payee: "Transfer", date: "06 Nov 2025", type: "P2P", amount: 30000 },
    { id: "big-4", payee: "Jayram Pra", date: "12 Nov 2025", type: "P2P", amount: 30000 },
  ],
  periodLabel: "in last 5 months",
  total: 194000,
};

// ─── Goal questionnaire fixture ───────────────────────────────

export const DBG_GOAL_QUESTIONS: Question[] = [
  {
    id: "choice",
    text: "What are you saving toward?",
    options: [
      { id: "trip", label: "Trip" },
      { id: "big-purchase", label: "Big purchase" },
      { id: "emergency", label: "Emergency fund" },
      { id: "increase-savings", label: "Increase monthly savings" },
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
      { id: "1y", label: "1 year" },
    ],
  },
  {
    id: "amount",
    text: "How much do you need?",
    options: [
      { id: "50k", label: "\u20b950k" },
      { id: "1l", label: "\u20b91L" },
      { id: "5l", label: "\u20b95L" },
      { id: "10l", label: "\u20b910L" },
    ],
  },
];
