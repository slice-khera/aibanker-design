import type { Question } from "@/app/components/QuestionnaireOverlay";
import type { LadderTier } from "@/app/lib/types";
import { LADDER_OPTIONS } from "./gbpFlowFixture";

const TIER_INTENT: Record<LadderTier, "positive" | "warning" | "negative"> = {
  comfortable: "positive",
  realistic: "warning",
  stretch: "negative",
};

function formatINRShort(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const SAVINGS_TIER_QUESTION: Question = {
  id: "savings-tier",
  text: "Which tier feels right?",
  options: LADDER_OPTIONS.map((opt) => ({
    id: opt.tier,
    label: opt.tier,
    title: `${formatINRShort(opt.monthlyAmount)}/mo`,
    subtext: opt.description,
    tag: { label: opt.tier.toUpperCase(), intent: TIER_INTENT[opt.tier] },
  })),
};
