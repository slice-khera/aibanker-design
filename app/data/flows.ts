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

// ============ GOAL SETTING ============
export const goalChips: ChipOption[] = [
  { id: "trip", label: "Trip", value: "Trip" },
  { id: "big-purchase", label: "Big purchase", value: "Big purchase" },
  { id: "emergency", label: "Emergency fund", value: "Emergency fund" },
  { id: "increase-savings", label: "Increase monthly savings", value: "Increase monthly savings" },
];

export const timelineChips: ChipOption[] = [
  { id: "3m", label: "3 months", value: "3 months" },
  { id: "6m", label: "6 months", value: "6 months" },
  { id: "1y", label: "1 year", value: "12 months" },
];

export const amountChips: ChipOption[] = [
  { id: "50k", label: "₹50k", value: "₹50k" },
  { id: "1l", label: "₹1L", value: "₹1L" },
  { id: "5l", label: "₹5L", value: "₹5L" },
  { id: "10l", label: "₹10L", value: "₹10L" },
];

export const planConfirmChips: ChipOption[] = [
  { id: "start-plan", label: "Start this plan" },
  { id: "adjust-plan", label: "Adjust" },
];

export const planAdjustChips: ChipOption[] = [
  { id: "change-pace", label: "Change pace" },
  { id: "less-savings", label: "Use less savings" },
  { id: "skip-auto", label: "Skip automation" },
];

export const paceChoiceChips: ChipOption[] = [
  { id: "aggressive", label: "Aggressive" },
  { id: "balanced", label: "Balanced" },
  { id: "relaxed", label: "Relaxed" },
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

// ============ STEADY STATE ============
export const steadyStateChips: ChipOption[] = [
  { id: "afford", label: "Can I afford…" },
  { id: "worth", label: "Rate my spends" },
  { id: "progress", label: "Progress" },
  { id: "understand", label: "Understand my money" },
];

// ============ SUBFLOW: CAN I AFFORD ============
export const affordAmountChips: ChipOption[] = [
  { id: "amt-500", label: "₹500" },
  { id: "amt-1500", label: "₹1,500" },
  { id: "amt-3000", label: "₹3,000" },
  { id: "amt-5000", label: "₹5,000" },
  { id: "amt-custom", label: "Other amount" },
];

// ============ SUBFLOW: LEAKS ============
export const leakFixChips: ChipOption[] = [
  { id: "cap", label: "Set a cap" },
  { id: "bucket", label: "Update buffer" },
  { id: "nudge", label: "Nudge before" },
  { id: "mute", label: "Mute this" },
];

// ============ SUBFLOW: TRADEOFF ============
export const tradeoffChoiceChips: ChipOption[] = [
  { id: "reduce-elsewhere", label: "Reduce elsewhere" },
  { id: "extend-timeline", label: "Extend goal timeline" },
];

// ============ NEW: UNDERSTAND MY MONEY ============
export const understandMenuChips: ChipOption[] = [
  { id: "where-money-goes", label: "Where does my money go?" },
  { id: "my-patterns", label: "My spending patterns" },
  { id: "compare", label: "How do I compare?" },
  { id: "personality", label: "My money personality" },
];

export const understandActionChips: ChipOption[] = [
  { id: "apply-strategies", label: "Apply these strategies" },
  { id: "done-learning", label: "Done learning" },
  { id: "explore-more", label: "Explore more" },
];

export const understandDrilldownChips: ChipOption[] = [
  { id: "why-matters", label: "Why does this matter?" },
  { id: "explore-category", label: "Explore this category" },
  { id: "see-patterns", label: "See my patterns" },
  { id: "back", label: "Back" },
];

// ============ DYNAMIC BUILDERS ============

export function buildDynamicAffordCategoryChips(categories: string[]): ChipOption[] {
  const chips: ChipOption[] = categories.slice(0, 4).map((cat, i) => ({
    id: `cat-${i}`,
    label: cat,
    value: cat,
  }));
  chips.push({ id: "other", label: "Other", value: "Other" });
  return chips;
}
