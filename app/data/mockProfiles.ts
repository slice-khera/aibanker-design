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
    accumulated_savings: string;
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
    buffer_bucket: string;
    buffer_remaining?: string;
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

export function getFDSuggestion(profile: MockProfile): string {
  return `You've had surplus (${profile.action.surplus_amount}) sitting untouched for weeks.\nWant to park it in an FD (still goal-aligned)?`;
}
