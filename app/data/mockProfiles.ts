export type InsightCard = {
  id: string;
  type: "goal" | "risk" | "behavior" | "opportunity" | "playful";
  message: string;
  chips: string[];
};

export type PacePreset = {
  id: "aggressive" | "balanced" | "relaxed";
  label: string;
  required_monthly_cut: string;
  pace_window: string;
  feasibility_note: string;
  lever_examples: string[];
  recommended_product: {
    type: "RD" | "Autosave";
    label: string;
    copy: string;
  };
};

export type TradeoffRule = {
  id: string;
  label: string;
  monthly_cost: string;
  extend_timeline: string;
  reduce_elsewhere: string;
  nudge_text?: string;
  cap_text?: string;
};

export type GoalCompletionAction = {
  paceId: PacePreset["id"];
  productType: "RD" | "Autosave";
  headline: string;
  copy: string;
  primary_cta: string;
  secondary_cta: string;
};

export type MockProfile = {
  id: string;
  label: string;
  wrapped: {
    top_category_label: string;
    top_category_share_pct: string;
    second_category_label: string;
    second_category_share_pct: string;
    late_night_spend_flag: "low" | "med" | "high";
    late_night_intensity: string;
    weekend_spike_flag: boolean;
    spike_days_per_week: string;
    money_personality_label: string;
    saving_vibe: string;
  };
  persona: {
    user_guess_savings_pct: string;
    actual_savings_pct: string;
    savings_gap: string;
    user_guess_category: string;
    user_guess_category_pct: string;
    actual_category_pct: string;
    category_gap: string;
    persona_guess: string;
    persona_actual: string;
  };
  goal: {
    goal_name: string;
    goal_type: string;
    goal_amount: string;
    horizon: string;
    required_savings_pct: string;
    current_savings_pct: string;
    savings_gap_pct: string;
    is_on_track: boolean;
    days_ahead_behind: string;
  };
  action: {
    suggested_cut_amount_month: string;
    suggested_cut_category: string;
    suggested_cut_description: string;
    suggested_autosave_day: string;
    suggested_rd_month: string;
    idle_cash_claim: string;
    bill_risk_event: string;
    surplus_amount: string;
  };
  suggested_budgets: {
    overall_budget: string;
    buffer_bucket: string; // Keep as string for compatibility, but represents single buffer
    buffer_remaining?: string; // Optional: current remaining buffer
    categories: Array<{
      name: string;
      budget: string;
    }>;
  };
  receipts: Array<{
    id: string;
    time: string;
    category: string;
    amount: string;
    merchant?: string;
  }>;
  pace_presets: PacePreset[];
  tradeoff_rules: {
    bucket_options: TradeoffRule[];
    tradeoff_choices: {
      reduce_elsewhere: string;
      extend_timeline: string;
    };
  };
  goal_completion_actions: GoalCompletionAction[];
  insights: InsightCard[];
};

export const weekendBallerProfile: MockProfile = {
  id: "weekend-baller",
  label: "Weekend baller + food delivery",
  wrapped: {
    top_category_label: "Food & Delivery",
    top_category_share_pct: "28%",
    second_category_label: "Shopping",
    second_category_share_pct: "18%",
    late_night_spend_flag: "high",
    late_night_intensity: "Most delivery happens after 10pm",
    weekend_spike_flag: true,
    spike_days_per_week: "2–3",
    money_personality_label: "Weekend splurger",
    saving_vibe: "save later",
  },
  persona: {
    user_guess_savings_pct: "20%",
    actual_savings_pct: "~8%",
    savings_gap: "-12 pts",
    user_guess_category: "Food",
    user_guess_category_pct: "15%",
    actual_category_pct: "~32%",
    category_gap: "+17 pts",
    persona_guess: "Disciplined",
    persona_actual: "Weekend splurger",
  },
  goal: {
    goal_name: "Quit-job fund",
    goal_type: "Quit-job fund",
    goal_amount: "₹10L",
    horizon: "12 months",
    required_savings_pct: "18%",
    current_savings_pct: "8%",
    savings_gap_pct: "+10%",
    is_on_track: false,
    days_ahead_behind: "~3 days ahead",
  },
  action: {
    suggested_cut_amount_month: "~₹2,000",
    suggested_cut_category: "Shopping",
    suggested_cut_description: "₹2k/month equivalent",
    suggested_autosave_day: "₹70",
    suggested_rd_month: "₹10k",
    idle_cash_claim: "~₹10k",
    bill_risk_event: "Rent due in 5 days",
    surplus_amount: "₹15k",
  },
  receipts: [
    { id: "r1", time: "Fri 11:21pm", category: "Food & Delivery", amount: "₹380", merchant: "Swiggy" },
    { id: "r2", time: "Sat 10:05pm", category: "Food & Delivery", amount: "₹520", merchant: "Zomato" },
    { id: "r3", time: "Sun 09:10pm", category: "Food & Delivery", amount: "₹290", merchant: "Swiggy" },
    { id: "r4", time: "Sat 03:45pm", category: "Shopping", amount: "₹1,200", merchant: "Amazon" },
    { id: "r5", time: "Sun 11:30am", category: "Shopping", amount: "₹850", merchant: "Myntra" },
  ],
  suggested_budgets: {
    overall_budget: "₹45k",
    buffer_bucket: "₹3k", // Total buffer amount (single buffer concept)
    buffer_remaining: "₹2k", // Current remaining buffer
    categories: [
      { name: "Food & Delivery", budget: "₹8k" },
      { name: "Shopping", budget: "₹5k" },
      { name: "Entertainment", budget: "₹2k" },
      { name: "Transport", budget: "₹3k" },
      { name: "Subscriptions", budget: "₹1.5k" },
    ],
  },
  pace_presets: [
    {
      id: "aggressive",
      label: "Aggressive",
      required_monthly_cut: "₹10k",
      pace_window: "3–6 months",
      feasibility_note:
        "This is a fast track. You’d need to cut hard each month to make it realistic.",
      lever_examples: [
        "Trim Food & Delivery by ₹4k",
        "Trim Shopping by ₹3k",
        "Reduce weekend spikes by ₹3k",
      ],
      recommended_product: {
        type: "RD",
        label: "RD at month start",
        copy:
          "Start an RD at the beginning of the month so the money disappears before you spend it.",
      },
    },
    {
      id: "balanced",
      label: "Balanced",
      required_monthly_cut: "₹5k",
      pace_window: "9–12 months",
      feasibility_note:
        "This is doable with a few tweaks and a small system to stay consistent.",
      lever_examples: [
        "Trim Food & Delivery by ₹2k",
        "Trim Shopping by ₹2k",
        "Pause 1–2 subscriptions (₹1k)",
      ],
      recommended_product: {
        type: "RD",
        label: "Smaller RD + light cuts",
        copy:
          "Pair a smaller RD with lightweight cuts so it doesn’t feel painful.",
      },
    },
    {
      id: "relaxed",
      label: "Relaxed",
      required_monthly_cut: "₹2k",
      pace_window: "12–18 months",
      feasibility_note:
        "You’re already close to this pace. The key is not overspending.",
      lever_examples: [
        "Auto‑save daily to protect the goal",
        "Keep weekends steady with a buffer bucket",
      ],
      recommended_product: {
        type: "Autosave",
        label: "Daily autosave",
        copy:
          "Automate a small daily save so it builds up without effort.",
      },
    },
  ],
  tradeoff_rules: {
    bucket_options: [
      {
        id: "bucket-1k",
        label: "₹1k/month bucket",
        monthly_cost: "₹1k",
        extend_timeline: "Adds ~2 weeks to your goal timeline.",
        reduce_elsewhere: "Trim 1 delivery/week to keep the same timeline.",
        nudge_text: "I’ll nudge you before late-night delivery to keep this on track.",
        cap_text: "Soft cap set at ₹1k/month for this category.",
      },
      {
        id: "bucket-2k",
        label: "₹2k/month bucket",
        monthly_cost: "₹2k",
        extend_timeline: "Adds ~1 month to your goal timeline.",
        reduce_elsewhere: "Trim Food by ₹2k or Shopping by ₹2k to keep pace.",
        nudge_text: "I’ll nudge you before weekend spikes to stay on pace.",
        cap_text: "Soft cap set at ₹2k/month for this category.",
      },
      {
        id: "bucket-3k",
        label: "₹3k/month bucket",
        monthly_cost: "₹3k",
        extend_timeline: "Adds ~6 weeks to your goal timeline.",
        reduce_elsewhere: "Reduce weekend spikes by ₹3k to stay on pace.",
        nudge_text: "I’ll flag bigger spends before they hit this bucket.",
        cap_text: "Soft cap set at ₹3k/month for this category.",
      },
    ],
    tradeoff_choices: {
      reduce_elsewhere: "Reduce elsewhere",
      extend_timeline: "Extend goal timeline",
    },
  },
  goal_completion_actions: [
    {
      paceId: "aggressive",
      productType: "RD",
      headline: "Start an RD at month start",
      copy:
        "If this goal is urgent, an RD at the start of the month keeps you from spending the money first.",
      primary_cta: "Start RD ₹10k",
      secondary_cta: "Make it smaller",
    },
    {
      paceId: "balanced",
      productType: "RD",
      headline: "Pair a smaller RD with light cuts",
      copy:
        "A smaller RD plus a couple of trims makes this pace realistic without feeling harsh.",
      primary_cta: "Start RD ₹5k",
      secondary_cta: "Show other amounts",
    },
    {
      paceId: "relaxed",
      productType: "Autosave",
      headline: "Set a daily autosave",
      copy:
        "You’re already close to this pace. A small daily autosave will protect your progress.",
      primary_cta: "Turn on ₹70/day",
      secondary_cta: "Make it smaller",
    },
  ],
  insights: [
    // Goal progress (3)
    {
      id: "goal-1",
      type: "goal",
      message: "You're ahead of goal pace this week. Don't fumble 😌\nWant to lock it in with autosave?",
      chips: ["Auto-save", "Show progress", "Worth it?"],
    },
    {
      id: "goal-2",
      type: "goal",
      message: "You're on pace for the quit-job fund. Keep the weekends chill and you'll stay there.",
      chips: ["Boost goal", "Progress", "Rate my spends"],
    },
    {
      id: "goal-3",
      type: "goal",
      message: "If you keep this pace, you'll hit your goal ~3 weeks early.",
      chips: ["Lock it in", "Progress", "Understand my money"],
    },
    // Risk (3)
    {
      id: "risk-1",
      type: "risk",
      message: "Uh oh — you might run short for a bill due soon.\nWant a mini survival plan?",
      chips: ["Make a plan", "Show bills", "Can I afford…"],
    },
    {
      id: "risk-2",
      type: "risk",
      message: "Weekend spike incoming. Keep a buffer so Monday doesn't sting.",
      chips: ["Set buffer", "Can I afford…", "Rate my spends"],
    },
    {
      id: "risk-3",
      type: "risk",
      message: "Bill risk spotted: Rent due in 5 days. Want me to set a temp cap?",
      chips: ["Set cap", "Show bills", "Mute this"],
    },
    // Behavior (3)
    {
      id: "behavior-1",
      type: "behavior",
      message: "Late-night munchies are back 👀\nIs this joy or regret?",
      chips: ["Joy", "Regret", "Mute this"],
    },
    {
      id: "behavior-2",
      type: "behavior",
      message: "You've ordered after 10pm three times this week. Worth it?",
      chips: ["Rate my spends", "Can I afford…", "Mute"],
    },
    {
      id: "behavior-3",
      type: "behavior",
      message: "Weekend spending jumped again. Want to set a buffer bucket?",
      chips: ["Set bucket", "Not now", "Explain"],
    },
    // Opportunity (3)
    {
      id: "opportunity-1",
      type: "opportunity",
      message: "You could safely save a bit today without affecting your buffer.",
      chips: ["Auto-save ₹70", "Not now", "Explain"],
    },
    {
      id: "opportunity-2",
      type: "opportunity",
      message: "You tend to have ~₹10k idle each month.\nStart an RD and you'll hit your goal ~1 month faster.",
      chips: ["Start RD ₹10k", "Other amounts", "Not now"],
    },
    {
      id: "opportunity-3",
      type: "opportunity",
      message: "You've had surplus sitting untouched for weeks.\nWant to park it in an FD (still goal-aligned)?",
      chips: ["Create FD", "Keep liquid", "Explain FD vs RD"],
    },
    // Playful tea (2)
    {
      id: "play-1",
      type: "playful",
      message: "Tea ☕ Your food spends are in a committed relationship with Friday night.",
      chips: ["Rate my spends", "Can I afford…", "Mute this"],
    },
    {
      id: "play-2",
      type: "playful",
      message: "Your wallet says: \"I can quit the job\" — your UPI says: \"order dessert.\"",
      chips: ["Rate my spends", "Progress", "Understand my money"],
    },
  ],
};

// Helper to get reality check text
export function getRealityCheckText(profile: MockProfile, userResponses: {
  savingsGuess?: string;
  categoryGuess?: string;
  categoryShare?: string;
  personaGuess?: string;
}): string {
  const savingsGuess = userResponses.savingsGuess || profile.persona.user_guess_savings_pct;
  const personaGuess = userResponses.personaGuess || profile.persona.persona_guess;
  
  return `Alright. Reality check time 👀\nHere's how close you were:

• You guessed savings: ${savingsGuess} → actual is ${profile.persona.actual_savings_pct} (gap: ${profile.persona.savings_gap})
• You guessed ${profile.wrapped.top_category_label}: ${profile.persona.user_guess_category_pct} → actual is ${profile.persona.actual_category_pct} (gap: ${profile.persona.category_gap})
• You guessed persona: ${personaGuess} → reality: ${profile.persona.persona_actual} 😅

Good news: you're not 'bad with money' — your money just has habits.`;
}

export function getPacePreset(
  profile: MockProfile,
  paceId: PacePreset["id"],
): PacePreset {
  return (
    profile.pace_presets.find((preset) => preset.id === paceId) ??
    profile.pace_presets[0]
  );
}

export function getGoalCompletionAction(
  profile: MockProfile,
  paceId: PacePreset["id"],
): GoalCompletionAction {
  return (
    profile.goal_completion_actions.find((action) => action.paceId === paceId) ??
    profile.goal_completion_actions[0]
  );
}

// Helper to get budget digest text
export function getBudgetDigestText(profile: MockProfile): string {
  return `Based on your current habits:

• You're saving ~${profile.goal.current_savings_pct} right now.
• To hit your goal on time, you'd need ~${profile.goal.required_savings_pct}.

You can either keep going (if you're already on track) or change one thing.`;
}

// Helper for off-track message
export function getOffTrackText(profile: MockProfile): string {
  return `To get on track, we need ~${profile.goal.savings_gap_pct} more savings.\nPick one lever that feels realistic:`;
}

// Helper for on-track message
export function getOnTrackText(): string {
  return `Honestly? You're closer than you think.\nKeep your current habits and you'll still land it.`;
}

// Helper for autosave suggestion
export function getAutosaveSuggestion(profile: MockProfile): string {
  return `Option 1: Cut ${profile.action.suggested_cut_category} by ${profile.action.suggested_cut_amount_month}/month.\nI can set up a ${profile.action.suggested_autosave_day}/day autosave so it quietly disappears before you spend it.`;
}

// Helper for RD suggestion
export function getRDSuggestion(profile: MockProfile): string {
  return `Option 2: You tend to have ${profile.action.idle_cash_claim} idle each month.\nStart an RD of ${profile.action.suggested_rd_month} and you'll hit your goal ~1 month faster.`;
}

// Helper for FD suggestion
export function getFDSuggestion(profile: MockProfile): string {
  return `You've had surplus (${profile.action.surplus_amount}) sitting untouched for weeks.\nWant to park it in an FD (still goal-aligned)?`;
}

// Can I afford outcome generator
export function getAffordOutcome(amount: string, timing: string): { status: "safe" | "tight" | "risky"; message: string } {
  // Mock logic - in real app this would be calculated
  const amountNum = parseInt(amount.replace(/[₹,]/g, ''));
  if (amountNum <= 1500) {
    return {
      status: "safe",
      message: `${amount} ${timing.toLowerCase()}? Safe.\nYou'll still have buffer for bills and your goal stays on track.`,
    };
  } else if (amountNum <= 3000) {
    return {
      status: "tight",
      message: `${amount} ${timing.toLowerCase()}? Tight.\nDoable, but you'd eat into your buffer. Maybe skip one delivery this week?`,
    };
  } else {
    return {
      status: "risky",
      message: `${amount} ${timing.toLowerCase()}? Risky.\nThis would put you behind on your goal by ~2 days. Is it a treat or a plan?`,
    };
  }
}

// Progress summary generator
export function getProgressSummary(profile: MockProfile): string {
  return `You're ${profile.goal.days_ahead_behind} this month.\nWant to adjust the plan?`;
}
