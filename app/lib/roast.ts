// Single source of truth for Roast me copy.
// Production mosaic and any sim that shows a "Roast me" card route through buildRoast.
// Inputs come from the user's derived profile; output picks a branch based on the data
// and returns the roast text plus an optional viz to render alongside it.

import type { CategoryBudget, CategorySummary, DerivedProfile } from "./types";

export type RoastVoice = "ryan" | "byron";
export type RoastViz = "summary" | "categories" | null;

export type RoastInput = {
  lifestyleCategories: CategorySummary[];
  foodBreakdown: Pick<DerivedProfile["foodBreakdown"], "totalOrders" | "totalSpend">;
  categoryBudgets?: CategoryBudget[];
};

export type RoastResult = {
  text: string;
  viz: RoastViz;
  branch: "over-cap" | "food-heavy" | "top-category";
};

function formatINR(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

// ── Copy templates ────────────────────────────────────────────
// Each branch has Ryan (warm, observational) and Byron (snarky) variants.
// Multiple phrasings per branch so a seed can cycle through them.

const OVER_CAP_COPY: Record<RoastVoice, ((c: string, over: string) => string)[]> = {
  byron: [
    (c, over) => `${c}. ${over} over your own cap. You set it. You broke it. Bold.`,
    (c, over) => `Your ${c} cap was decorative apparently. ${over} past it.`,
    (c, over) => `${c} is ${over} over. You're not budgeting, you're negotiating with yourself and losing.`,
  ],
  ryan: [
    (c, over) => `${c} is ${over} over what you set. The cap was your idea, by the way.`,
    (c, over) => `You're ${over} past your ${c} cap. Worth a look before next month.`,
    (c, over) => `${c} ran ${over} over. Want to revisit the cap or tighten the next week?`,
  ],
};

const FOOD_HEAVY_COPY: Record<RoastVoice, ((orders: number, total: string) => string)[]> = {
  byron: [
    (n, t) => `${n} food orders. ${t}. Your fridge is a museum, the exhibits are ageing.`,
    (n, t) => `${n} delivery orders worth ${t}. The kitchen called. It misses you.`,
    (n, t) => `${n} orders, ${t} spent. At this point Swiggy should send you a Christmas card.`,
  ],
  ryan: [
    (n, t) => `${n} food orders this stretch — ${t} total. Your kitchen barely sees you.`,
    (n, t) => `${n} orders, ${t} on delivery. Worth knowing where this lands by month-end.`,
    (n, t) => `${n} food orders adding up to ${t}. The pattern is real.`,
  ],
};

const TOP_CATEGORY_COPY: Record<RoastVoice, ((name: string, share: string) => string)[]> = {
  byron: [
    (n, s) => `${s} of your lifestyle spend on ${n}. At this point it's a personality trait.`,
    (n, s) => `${n} takes ${s} of your lifestyle money. Not a category. A lifestyle.`,
    (n, s) => `${s} on ${n}. You don't have a budget, you have a favourite.`,
  ],
  ryan: [
    (n, s) => `${s} of your lifestyle money goes to ${n}. Worth knowing.`,
    (n, s) => `${n} is ${s} of your lifestyle spend — the biggest single bucket.`,
    (n, s) => `Most of your lifestyle spend (${s}) sits in ${n}.`,
  ],
};

function pick<T>(list: T[], seed: number): T {
  return list[((seed % list.length) + list.length) % list.length];
}

// ── Branch selection ──────────────────────────────────────────

export function buildRoast(input: RoastInput, voice: RoastVoice, seed = 0): RoastResult {
  // 1. Any category meaningfully over cap? (>20% overage)
  const overCap = (input.categoryBudgets ?? [])
    .map((b) => ({ b, overPct: b.cap > 0 ? (b.currentSpend - b.cap) / b.cap : 0 }))
    .filter((x) => x.overPct > 0.2)
    .sort((a, b) => b.overPct - a.overPct)[0];

  if (overCap) {
    const overBy = overCap.b.currentSpend - overCap.b.cap;
    return {
      text: pick(OVER_CAP_COPY[voice], seed)(overCap.b.name, formatINR(overBy)),
      viz: "categories",
      branch: "over-cap",
    };
  }

  // 2. Food order frequency punchline
  if (input.foodBreakdown.totalOrders >= 100) {
    return {
      text: pick(FOOD_HEAVY_COPY[voice], seed)(input.foodBreakdown.totalOrders, formatINR(input.foodBreakdown.totalSpend)),
      viz: null,
      branch: "food-heavy",
    };
  }

  // 3. Default: top lifestyle category
  const top = input.lifestyleCategories[0];
  if (top) {
    return {
      text: pick(TOP_CATEGORY_COPY[voice], seed)(top.name, top.shareOfLifestyle),
      viz: "summary",
      branch: "top-category",
    };
  }

  // Fallback if profile has no data at all
  return {
    text: voice === "byron"
      ? "Nothing to roast. Spend something first."
      : "Not enough data to roast yet. Give it a month.",
    viz: null,
    branch: "top-category",
  };
}
