"use client";

import { useCallback, useState } from "react";
import Chat, { type ChatChip, type ChatMessage } from "./components/Chat";
import WrappedCarousel from "./components/WrappedCarousel";
import {
  affordAmountChips,
  affordOutcomeChips,
  affordPlanChips,
  affordTreatChips,
  affordTimingChips,
  amountChips,
  autosaveAmountChips,
  budgetAgreementChips,
  budgetDigestChips,
  budgetLevers,
  budgetReviewChips,
  budgetStyleChips,
  confirmChips,
  fdAmountChips,
  goalChips,
  leakFixChips,
  leakJoyRegretChips,
  leakSuspects,
  onTrackChips,
  personaQuestions,
  paceChoiceChips,
  paceContinueChips,
  pinnedGoalChips,
  powerUpTypeChips,
  progressAdjustChips,
  progressBoostChips,
  rdAmountChips,
  realityChips,
  regretActionChips,
  regretReasonChips,
  steadyStateChips,
  tradeoffChoiceChips,
  timelineChips,
  worthItChips,
  wrappedSlides,
  type ChipOption,
} from "./data/flows";
import {
  getAffordOutcome,
  getAutosaveSuggestion,
  getBudgetDigestText,
  getFDSuggestion,
  getOffTrackText,
  getOnTrackText,
  getGoalCompletionAction,
  getPacePreset,
  getProgressSummary,
  getRDSuggestion,
  getRealityCheckText,
} from "./data/mockProfiles";
import { defaultProfileId, getProfileById } from "./data/profiles";

// Flow steps
type FlowStep = "wrapped" | "persona" | "reality" | "goal" | "budget" | "home";

// Sub-states for each step
type PersonaStage = "q1" | "q2" | "q2-follow" | "q3" | "q4";
type GoalStage = "choice" | "timeline" | "amount" | "pace" | "budget-review" | "product" | "pinned";
type BudgetStage = "digest" | "onTrack" | "lever" | "budgetChoice" | "budgetStyle" | "action" | "actionConfirm";
type HomeSubflow =
  | "idle"
  | "afford-amount"
  | "afford-timing"
  | "afford-result"
  | "worth-pick"
  | "worth-rate"
  | "worth-reason"
  | "worth-action"
  | "leaks-pick"
  | "leaks-rate"
  | "leaks-fix"
  | "progress-view"
  | "progress-boost"
  | "powerup-pick"
  | "powerup-amount"
  | "powerup-confirm"
  | "tradeoff";
type PaceStage = "summary" | "select";

const profile = getProfileById(defaultProfileId);

export default function Home() {
  // Core state
  const [step, setStep] = useState<FlowStep>("wrapped");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChips, setActiveChips] = useState<ChatChip[]>([]);

  // Sub-step states
  const [personaStage, setPersonaStage] = useState<PersonaStage>("q1");
  const [goalStage, setGoalStage] = useState<GoalStage>("choice");
  const [budgetStage, setBudgetStage] = useState<BudgetStage>("digest");
  const [homeSubflow, setHomeSubflow] = useState<HomeSubflow>("idle");
  const [paceStage, setPaceStage] = useState<PaceStage>("summary");

  // User responses
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [goalDraft, setGoalDraft] = useState<{ name?: string; timeline?: string; amount?: string }>({});
  const [subflowData, setSubflowData] = useState<Record<string, string>>({});
  const [selectedPaceId, setSelectedPaceId] = useState<"aggressive" | "balanced" | "relaxed">("balanced");

  // UI state
  const [receiptsOpen, setReceiptsOpen] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  // Message management - use a ref counter to guarantee unique IDs
  const msgIdRef = { current: 0 };

  const addMessage = useCallback(
    (role: "assistant" | "user", text: string, special?: ChatMessage["special"]) => {
      const id = `msg-${Date.now()}-${++msgIdRef.current}`;
      setMessages((prev) => [...prev, { id, role, text, special }]);
    },
    [],
  );

  const toChips = (options: ChipOption[]): ChatChip[] =>
    options.map((o) => ({ id: o.id, label: o.label }));

  const getDefaultPaceId = (timeline?: string) => {
    if (!timeline) return "balanced";
    if (timeline === "3 months" || timeline === "6 months") return "aggressive";
    if (timeline === "12 months") return "balanced";
    return "relaxed";
  };

  const getPaceSummary = (paceId: "aggressive" | "balanced" | "relaxed") => {
    const preset = getPacePreset(profile, paceId);
    return (
      `Pace: ${preset.label} (${preset.pace_window})\n` +
      `To make this real, you'd need to cut about ${preset.required_monthly_cut}/month.\n\n` +
      `${preset.feasibility_note}\n\n` +
      `Top ways to pull it off:\n` +
      preset.lever_examples.map((item) => `• ${item}`).join("\n") +
      `\n\nSuggested action: ${preset.recommended_product.label}\n` +
      preset.recommended_product.copy
    );
  };


  const getLeverReviewText = (paceId: "aggressive" | "balanced" | "relaxed") => {
    const preset = getPacePreset(profile, paceId);
    const goalName = goalDraft.name || profile.goal.goal_name;
    return (
      `If you want the ${preset.label.toLowerCase()} pace for ${goalName}, here are the most realistic levers:\n` +
      preset.lever_examples.map((item) => `• ${item}`).join("\n")
    );
  };

  const getGoalProductText = (paceId: "aggressive" | "balanced" | "relaxed") => {
    const action = getGoalCompletionAction(profile, paceId);
    return `${action.headline}\n${action.copy}`;
  };


  const getGoalProductChips = (paceId: "aggressive" | "balanced" | "relaxed"): ChatChip[] => {
    const action = getGoalCompletionAction(profile, paceId);
    return [
      { id: "product-primary", label: action.primary_cta, variant: "success" },
      { id: "product-secondary", label: action.secondary_cta },
      { id: "product-change-pace", label: "Change pace" },
      { id: "product-skip", label: "Skip for now" },
    ];
  };

  const getBucketOptionChips = (): ChatChip[] => {
    return profile.tradeoff_rules.bucket_options.map((option) => ({
      id: option.id,
      label: option.label,
    }));
  };

  const getTradeoffPrompt = (optionId: string): string => {
    const option =
      profile.tradeoff_rules.bucket_options.find((item) => item.id === optionId) ??
      profile.tradeoff_rules.bucket_options[0];
    const goalName = goalDraft.name || profile.goal.goal_name;
    return (
      `A ${option.monthly_cost} bucket means:\n` +
      `• ${option.extend_timeline} for ${goalName}\n\n` +
      `If you don't want to extend the timeline, we can:\n` +
      `• ${option.reduce_elsewhere}\n\n` +
      `Which should we do?`
    );
  };

  const getGoalPaceImpactText = (amount: string, timing: string) => {
    const paceId = selectedPaceId;
    const paceDays = paceId === "aggressive" ? 5 : paceId === "balanced" ? 3 : 2;
    return `${amount} ${timing.toLowerCase()}? Risky.\nThis would put you behind on your ${goalDraft.name || profile.goal.goal_name} by ~${paceDays} days.`;
  };


  const startBucketTradeoff = (ruleId?: string) => {
    if (ruleId) {
      setSubflowData((prev) => ({ ...prev, tradeoffRule: ruleId, tradeoffStep: "decision" }));
      setHomeSubflow("tradeoff");
      addMessage("assistant", getTradeoffPrompt(ruleId));
      setActiveChips(toChips(tradeoffChoiceChips));
      return;
    }
    setSubflowData((prev) => ({ ...prev, tradeoffStep: "bucket-select" }));
    setHomeSubflow("tradeoff");
    addMessage("assistant", "Pick a buffer bucket size:");
    setActiveChips(getBucketOptionChips());
  };

  // ============ WRAPPED COMPLETE ============
  const handleWrappedComplete = () => {
    setStep("persona");
    setPersonaStage("q1");
    setMessages([
      { id: "persona-intro", role: "assistant", text: "Alright, let's see how well you know yourself." },
      { id: "persona-q1", role: "assistant", text: personaQuestions[0].text },
    ]);
    setActiveChips(toChips(personaQuestions[0].chips));
  };

  // ============ PERSONA FLOW ============
  const handlePersonaChip = (chip: ChatChip) => {
    addMessage("user", chip.label);

    // Store response
    setUserResponses((prev) => ({ ...prev, [personaStage]: chip.id }));

    // Determine next stage
    const stages: PersonaStage[] = ["q1", "q2", "q2-follow", "q3", "q4"];
    const currentIdx = stages.indexOf(personaStage);

    if (currentIdx >= stages.length - 1) {
      // Done with persona - go to reality check
      startReality();
      return;
    }

    const nextStage = stages[currentIdx + 1];
    setPersonaStage(nextStage);

    // Find the question for the next stage
    const questionMap: Record<PersonaStage, number> = {
      "q1": 0,
      "q2": 1,
      "q2-follow": 2,
      "q3": 3,
      "q4": 4,
    };

    const question = personaQuestions[questionMap[nextStage]];
    addMessage("assistant", question.text);
    setActiveChips(toChips(question.chips));
  };

  const startReality = () => {
    setStep("reality");
    
    const realityText = getRealityCheckText(profile, {
      savingsGuess: userResponses["q1"] || undefined,
      personaGuess: userResponses["q3"] || undefined,
    });

    addMessage("assistant", realityText, "reality-check");
    setActiveChips(toChips(realityChips));
  };

  // ============ REALITY FLOW ============
  const handleRealityChip = (chip: ChatChip) => {
    addMessage("user", chip.label);
    setUserResponses((prev) => ({ ...prev, realityChoice: chip.id }));
    startGoal();
  };

  // ============ GOAL FLOW ============
  const startGoal = () => {
    setStep("goal");
    setGoalStage("choice");
    addMessage("assistant", "Now tell me what we're building toward. Pick one or type your own.");
    setActiveChips(toChips(goalChips));
  };

  const handleGoalChip = (chip: ChatChip) => {
    if (goalStage === "choice") {
      handleGoalChoice(chip.label);
      return;
    }
    if (goalStage === "timeline") {
      handleGoalTimeline(chip);
      return;
    }
    if (goalStage === "amount") {
      handleGoalAmount(chip);
      return;
    }
    if (goalStage === "pace") {
      handlePaceChip(chip);
      return;
    }
    if (goalStage === "budget-review") {
      handleBudgetReviewChip(chip);
      return;
    }
    if (goalStage === "product") {
      handleGoalProductChip(chip);
      return;
    }
    if (goalStage === "pinned") {
      handlePinnedGoal(chip);
      return;
    }
  };

  const handleGoalChoice = (value: string) => {
    setGoalDraft((prev) => ({ ...prev, name: value }));
    addMessage("user", value);
    addMessage("assistant", "When do you want this by?");
    setGoalStage("timeline");
    setActiveChips(toChips(timelineChips));
  };

  const handleGoalTimeline = (chip: ChatChip) => {
    const timeline = chip.label;
    setGoalDraft((prev) => ({ ...prev, timeline }));
    addMessage("user", timeline);
    addMessage("assistant", "If you know the amount, drop it. Or skip.");
    setGoalStage("amount");
    setActiveChips(toChips(amountChips));
  };

  const handleGoalAmount = (chip: ChatChip) => {
    const amount = chip.id === "skip" ? "Not set" : chip.label;
    setGoalDraft((prev) => ({ ...prev, amount }));
    addMessage("user", chip.label);

    const paceId = getDefaultPaceId(goalDraft.timeline);
    setSelectedPaceId(paceId);
    setGoalStage("pace");
    setPaceStage("summary");
    addMessage("assistant", getPaceSummary(paceId));
    setActiveChips(toChips(paceContinueChips));
  };

  const showBudgetReview = () => {
    setGoalStage("budget-review");
    const budgets = profile.suggested_budgets;
    const budgetText = 
      `Based on your last few months, I've set up these budgets:\n\n` +
      `Overall monthly budget: ${budgets.overall_budget}\n` +
      `Buffer bucket (miscellaneous): ${budgets.buffer_bucket}\n\n` +
      `Category budgets:\n` +
      budgets.categories.map((cat) => `• ${cat.name}: ${cat.budget}`).join("\n") +
      `\n\nThis keeps you on track for your goal. Any edits?`;
    addMessage("assistant", budgetText);
    setActiveChips(toChips(budgetReviewChips));
  };

  const handleBudgetReviewChip = (chip: ChatChip) => {
    if (chip.id === "approve-budget") {
      addMessage("user", chip.label);
      addMessage("assistant", getGoalProductText(selectedPaceId));
      setGoalStage("product");
      setActiveChips(getGoalProductChips(selectedPaceId));
      return;
    }

    if (chip.id === "edit-budget") {
      addMessage("user", chip.label);
      addMessage(
        "assistant",
        "Type your edit (e.g., 'update Food to ₹10k' or 'update buffer to ₹5k'):"
      );
      setGoalStage("budget-review");
      // In a real implementation, we'd handle free text input here
      // For now, we'll just go back to review
      setTimeout(() => {
        addMessage("assistant", "Got it. Budgets updated.");
        addMessage("assistant", getGoalProductText(selectedPaceId));
        setGoalStage("product");
        setActiveChips(getGoalProductChips(selectedPaceId));
      }, 100);
    }
  };

  const handlePaceChip = (chip: ChatChip) => {
    if (paceStage === "summary") {
      if (chip.id === "continue") {
        addMessage("assistant", getLeverReviewText(selectedPaceId));
        showBudgetReview();
        return;
      }

      if (chip.id === "tweak-pace") {
        setPaceStage("select");
        addMessage("assistant", "Pick a pace that feels realistic:");
        setActiveChips(toChips(paceChoiceChips));
      }
      return;
    }

    if (paceStage === "select") {
      if (chip.id === "aggressive" || chip.id === "balanced" || chip.id === "relaxed") {
        setSelectedPaceId(chip.id);
        setPaceStage("summary");
        addMessage("assistant", getPaceSummary(chip.id));
        setActiveChips(toChips(paceContinueChips));
      }
    }
  };

  const handleGoalProductChip = (chip: ChatChip) => {
    if (chip.id === "product-change-pace") {
      setGoalStage("pace");
      setPaceStage("select");
      addMessage("assistant", "Pick a pace that feels realistic:");
      setActiveChips(toChips(paceChoiceChips));
      return;
    }

    if (chip.id === "product-secondary") {
      addMessage(
        "assistant",
        "Got it. I can show smaller options if you want, but this still works as a starter.",
      );
      setActiveChips(getGoalProductChips(selectedPaceId));
      return;
    }

    if (chip.id === "product-primary") {
      const action = getGoalCompletionAction(profile, selectedPaceId);
      const eta = goalDraft.timeline || profile.goal.horizon;
      const goalName = goalDraft.name || profile.goal.goal_name;
      addMessage(
        "assistant",
        `${action.headline} is now active.\n\nYou'll hit ${goalName} in ${eta}.`,
        "success",
      );
    } else if (chip.id === "product-skip") {
      const eta = goalDraft.timeline || profile.goal.horizon;
      const goalName = goalDraft.name || profile.goal.goal_name;
      addMessage(
        "assistant",
        `No worries. At your current pace, you'll hit ${goalName} in ${eta}. You can set up automation anytime.`,
      );
    }

    finishBudget({ skipInsight: true });
  };

  const handlePinnedGoal = (chip: ChatChip) => {
    addMessage("user", chip.label);

    if (chip.id === "show-plan") {
      startBudget();
      return;
    }
    if (chip.id === "adjust-goal") {
      addMessage("assistant", "What would you like to change?");
      setGoalStage("choice");
      setActiveChips(toChips(goalChips));
      return;
    }
    if (chip.id === "add-goal") {
      addMessage("assistant", "You can add more goals later. For now, let's nail this one first.");
      setActiveChips(toChips(pinnedGoalChips));
    }
  };

  const handleGoalInput = (value: string) => {
    if (step !== "goal" || goalStage !== "choice") return;
    handleGoalChoice(value);
  };

  // ============ BUDGET FLOW ============
  const startBudget = () => {
    setStep("budget");
    setBudgetStage("digest");
    const preset = getPacePreset(profile, selectedPaceId);
    addMessage(
      "assistant",
      `Based on your current habits:\n\n• You're saving ~${profile.goal.current_savings_pct} right now.\n• To hit the ${preset.label.toLowerCase()} pace, you'd need to cut about ${preset.required_monthly_cut}/month.\n\nYou can either keep going (if you're already on track) or change one thing.`,
    );
    setActiveChips(toChips(budgetDigestChips));
  };

  const handleBudgetChip = (chip: ChatChip) => {
    addMessage("user", chip.label);

    switch (budgetStage) {
      case "digest":
        {
          const preset = getPacePreset(profile, selectedPaceId);
        if (chip.id === "ok-pace") {
          addMessage(
            "assistant",
            `You're on track for the ${preset.label.toLowerCase()} pace. Want to keep it steady with a small system?`,
          );
          setBudgetStage("onTrack");
          setActiveChips(toChips(onTrackChips));
        } else {
          addMessage(
            "assistant",
            `To hit the ${preset.label.toLowerCase()} pace, we need to free up about ${preset.required_monthly_cut}/month. Pick one lever that feels realistic:`,
          );
          setBudgetStage("lever");
          setActiveChips(toChips(budgetLevers));
        }
        break;
        }

      case "onTrack":
        if (chip.id === "auto" || chip.id === "backup") {
          addMessage(
            "assistant",
            "Want me to set a soft budget so weekends don't derail the goal?",
          );
          setBudgetStage("budgetChoice");
          setActiveChips(toChips(budgetAgreementChips));
        } else {
          addMessage("assistant", "Got it. I'll keep you posted on progress.");
          finishBudget();
        }
        break;

      case "lever":
        if (chip.id === "no-change") {
          addMessage("assistant", "Totally fair. Let's just track for now and revisit later.");
          finishBudget();
        } else {
          setUserResponses((prev) => ({ ...prev, selectedLever: chip.id }));
          addMessage("assistant", "Do you want me to set a budget for this category?");
          setBudgetStage("budgetChoice");
          setActiveChips(toChips(budgetAgreementChips));
        }
        break;

      case "budgetChoice":
        if (chip.id === "choose") {
          addMessage("assistant", "Pick a vibe — strict, chill, or buffer bucket?");
          setBudgetStage("budgetStyle");
          setActiveChips(toChips(budgetStyleChips));
        } else {
          addMessage(
            "assistant",
            chip.id === "track"
              ? "Cool — I'll just track and surface insights."
              : "Done. I've set a soft budget for this category.",
          );
          setBudgetStage("actionConfirm");
          setActiveChips([{ id: "continue", label: "Continue" }]);
        }
        break;

      case "budgetStyle":
        setUserResponses((prev) => ({ ...prev, budgetStyle: chip.id }));
        addMessage(
          "assistant",
          `Locked in. I'll use the ${chip.label.toLowerCase()} budget style for this category.`,
        );
        setBudgetStage("actionConfirm");
        setActiveChips([{ id: "continue", label: "Continue" }]);
        break;

      case "action":
        addMessage("assistant", "Budget updated. I'll keep it friendly.");
        setBudgetStage("actionConfirm");
        setActiveChips([{ id: "continue", label: "Continue" }]);
        break;

      case "actionConfirm":
        finishBudget();
        break;
    }
  };

  const finishBudget = (options?: { skipInsight?: boolean }) => {
    setStep("home");
    setHomeSubflow("idle");
    if (options?.skipInsight) {
      addMessage("assistant", "All set. Want to check anything else?");
      setActiveChips(toChips(steadyStateChips));
      return;
    }
    const nextInsight = profile.insights[insightIndex % profile.insights.length];
    addMessage("assistant", nextInsight.message, "insight");
    setActiveChips(
      nextInsight.chips.length > 0
        ? nextInsight.chips.map((c, i) => ({ id: `insight-${i}`, label: c }))
        : toChips(steadyStateChips)
    );
  };

  // ============ HOME / STEADY STATE ============
  const handleHomeChip = (chip: ChatChip) => {
    addMessage("user", chip.label);

    // Check if this is a steady state chip action
    const steadyStateActions: Record<string, () => void> = {
      "afford": () => startAffordFlow(),
      "worth": () => startWorthFlow(),
      "leaks": () => startLeaksFlow(),
      "progress": () => startProgressFlow(),
      "powerups": () => startPowerupsFlow(),
    };

    if (steadyStateActions[chip.id]) {
      steadyStateActions[chip.id]();
      return;
    }

    // Handle subflow-specific chips
    switch (homeSubflow) {
      case "afford-amount":
        handleAffordAmount(chip);
        break;
      case "afford-timing":
        handleAffordTiming(chip);
        break;
      case "afford-result":
        handleAffordResult(chip);
        break;
      case "worth-pick":
        handleWorthPick(chip);
        break;
      case "worth-rate":
        handleWorthRate(chip);
        break;
      case "worth-reason":
        handleWorthReason(chip);
        break;
      case "worth-action":
        handleWorthAction(chip);
        break;
      case "leaks-pick":
        handleLeaksPick(chip);
        break;
      case "leaks-rate":
        handleLeaksRate(chip);
        break;
      case "leaks-fix":
        handleLeaksFix(chip);
        break;
      case "progress-view":
        handleProgressView(chip);
        break;
      case "progress-boost":
        handleProgressBoost(chip);
        break;
      case "powerup-pick":
        handlePowerupPick(chip);
        break;
      case "powerup-amount":
        handlePowerupAmount(chip);
        break;
      case "powerup-confirm":
        handlePowerupConfirm(chip);
        break;
      case "tradeoff":
        handleTradeoffChip(chip);
        break;
      default:
        // Handle insight chip clicks or return to steady state
        handleInsightChip(chip);
    }
  };

  const handleInsightChip = (chip: ChatChip) => {
    // Map insight chip labels to actions
    if (chip.label === "Can I afford…") {
      startAffordFlow();
    } else if (chip.label === "Worth it?" || chip.label === "Worth it") {
      startWorthFlow();
    } else if (chip.label === "Find leaks") {
      startLeaksFlow();
    } else if (chip.label === "Progress" || chip.label === "Show progress") {
      startProgressFlow();
    } else if (chip.label === "Power-ups") {
      startPowerupsFlow();
    } else if (chip.label.includes("Auto-save") || chip.label.includes("auto")) {
      startPowerupsFlow();
    } else if (chip.label.includes("RD")) {
      setHomeSubflow("powerup-amount");
      setSubflowData((prev) => ({ ...prev, powerupType: "rd" }));
      addMessage("assistant", "Here are RD options for you:");
      setActiveChips(toChips(rdAmountChips));
    } else if (chip.label.includes("FD")) {
      setHomeSubflow("powerup-amount");
      setSubflowData((prev) => ({ ...prev, powerupType: "fd" }));
      addMessage("assistant", "Here are FD options:");
      setActiveChips(toChips(fdAmountChips));
    } else {
      // Generic response and return to steady state
      addMessage("assistant", "Got it. What else can I help with?");
      returnToSteadyState();
    }
  };

  const returnToSteadyState = () => {
    setHomeSubflow("idle");
    setActiveChips(toChips(steadyStateChips));
  };

  // ============ SUBFLOW: CAN I AFFORD ============
  const startAffordFlow = () => {
    setHomeSubflow("afford-amount");
    addMessage("assistant", "How much are we talking? Pick an amount to check the buffer.");
    setActiveChips(toChips(affordAmountChips));
  };

  const handleAffordAmount = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, affordAmount: chip.label }));
    setHomeSubflow("afford-timing");
    addMessage("assistant", "And when would this be?");
    setActiveChips(toChips(affordTimingChips));
  };

  const handleAffordTiming = (chip: ChatChip) => {
    const amount = subflowData.affordAmount || "₹1,500";
    const timing = chip.label;
    const outcome = getAffordOutcome(amount, timing);

    setSubflowData((prev) => ({ ...prev, affordTiming: timing, affordStatus: outcome.status }));
    setHomeSubflow("afford-result");
    
    if (outcome.status === "safe") {
      // Easy path - can easily incorporate this expense
      addMessage(
        "assistant",
        `${amount} ${timing.toLowerCase()}? Easy.\n\nBased on your current spends and projected spends this month, you can more than easily incorporate this expense without affecting your goal.`
      );
      addMessage("assistant", "Go for it!");
      returnToSteadyState();
      return;
    }
    
    // Tradeoff path - requires adjustments
    if (outcome.status === "risky") {
      addMessage("assistant", getGoalPaceImpactText(amount, timing));
    } else {
      addMessage("assistant", outcome.message);
    }
    addMessage("assistant", "Is this a treat or something you're planning?");
    setActiveChips(toChips(affordOutcomeChips));
  };

  const handleAffordResult = (chip: ChatChip) => {
    if (chip.id === "treat") {
      const goalName = goalDraft.name || profile.goal.goal_name;
      addMessage(
        "assistant",
        `Nice. How should I protect ${goalName} while you still enjoy this?`,
      );
      setHomeSubflow("tradeoff");
      setSubflowData((prev) => ({ ...prev, tradeoffStep: "treat-choice" }));
      setActiveChips(toChips(affordTreatChips));
    } else {
      const goalName = goalDraft.name || profile.goal.goal_name;
      addMessage(
        "assistant",
        `If we plan for this, it changes the ${goalName} pace. Pick a strategy:`,
      );
      setHomeSubflow("tradeoff");
      setSubflowData((prev) => ({ ...prev, tradeoffStep: "plan-choice" }));
      setActiveChips(toChips(affordPlanChips));
    }
  };

  // ============ SUBFLOW: WORTH IT ============
  const startWorthFlow = () => {
    setHomeSubflow("worth-pick");
    addMessage("assistant", "Pick a recent spend to rate:");
    setActiveChips(
      profile.receipts.slice(0, 3).map((r) => ({
        id: r.id,
        label: `${r.time} ${r.category} ${r.amount}`,
      }))
    );
  };

  const handleWorthPick = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, selectedTxn: chip.id }));
    setHomeSubflow("worth-rate");
    addMessage("assistant", "Was it worth it?");
    setActiveChips(toChips(worthItChips));
  };

  const handleWorthRate = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, worthRating: chip.id }));

    if (chip.id === "regret") {
      setHomeSubflow("worth-reason");
      addMessage("assistant", "Why the regret?");
      setActiveChips(toChips(regretReasonChips));
    } else {
      addMessage("assistant", chip.id === "worth" ? "Nice! Joy is valid. 🙌" : "Noted. We all have those.");
      returnToSteadyState();
    }
  };

  const handleWorthReason = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, regretReason: chip.id }));
    setHomeSubflow("worth-action");
    addMessage("assistant", "Want me to help prevent this next time?");
    setActiveChips(toChips(regretActionChips));
  };

  const handleWorthAction = (chip: ChatChip) => {
    if (chip.id === "mute") {
      addMessage("assistant", "Muted. I won't bug you about this category.");
    } else if (chip.id === "set-cap") {
      const goalName = goalDraft.name || profile.goal.goal_name;
      addMessage(
        "assistant",
        `I can set a soft cap, but it affects your ${goalName} pace. Choose how you want to handle it:`,
      );
      startBucketTradeoff("bucket-2k");
      return;
    } else {
      addMessage("assistant", "Got it. I'll give you a heads up before similar spends.");
    }
    returnToSteadyState();
  };

  // ============ SUBFLOW: FIND LEAKS ============
  const startLeaksFlow = () => {
    setHomeSubflow("leaks-pick");
    addMessage("assistant", "Top suspects based on your patterns:");
    setActiveChips(leakSuspects.map((s) => ({ id: s.id, label: s.label })));
  };

  const handleLeaksPick = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, selectedLeak: chip.id }));
    const suspect = leakSuspects.find((s) => s.id === chip.id);
    setHomeSubflow("leaks-rate");
    addMessage("assistant", `${suspect?.pattern || "This pattern"} — is it joy or regret?`);
    setActiveChips(toChips(leakJoyRegretChips));
  };

  const handleLeaksRate = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, leakRating: chip.id }));

    if (chip.id === "joy") {
      addMessage("assistant", "Fair enough! Joy is allowed. Want a buffer bucket for it?");
    } else {
      addMessage("assistant", "Let's fix it. Pick a solution:");
    }
    setHomeSubflow("leaks-fix");
    setActiveChips(toChips(leakFixChips));
  };

  const handleLeaksFix = (chip: ChatChip) => {
    if (chip.id === "bucket" || chip.id === "cap") {
      const goalName = goalDraft.name || profile.goal.goal_name;
      addMessage(
        "assistant",
        `This changes your ${goalName} pace slightly. Choose how you want to handle the tradeoff:`,
      );
      startBucketTradeoff("bucket-2k");
      return;
    }
    const responses: Record<string, string> = {
      nudge: "I'll nudge you before you make similar spends.",
      mute: "Muted. This won't bother you anymore.",
    };
    addMessage("assistant", responses[chip.id] || "Done!");
    returnToSteadyState();
  };

  // ============ SUBFLOW: PROGRESS ============
  const startProgressFlow = () => {
    setHomeSubflow("progress-view");
    addMessage("assistant", getProgressSummary(profile));
    setActiveChips(toChips(progressAdjustChips));
  };

  const handleProgressView = (chip: ChatChip) => {
    if (chip.id === "boost") {
      setHomeSubflow("progress-boost");
      addMessage("assistant", "How would you like to boost?");
      setActiveChips(toChips(progressBoostChips));
    } else if (chip.id === "pause") {
      addMessage("assistant", "Paused. I'll check in again next week.");
      returnToSteadyState();
    } else {
      addMessage("assistant", "Keeping the current plan. You're doing great!");
      returnToSteadyState();
    }
  };

  const handleProgressBoost = (chip: ChatChip) => {
    if (chip.id === "autosave") {
      addMessage("assistant", getAutosaveSuggestion(profile));
      setActiveChips([
        { id: "confirm-auto", label: `Turn on ${profile.action.suggested_autosave_day}/day` },
        { id: "cancel", label: "Cancel" },
      ]);
    } else if (chip.id === "rd") {
      addMessage("assistant", getRDSuggestion(profile));
      setActiveChips([
        { id: "confirm-rd", label: `Start RD ${profile.action.suggested_rd_month}` },
        { id: "cancel", label: "Cancel" },
      ]);
    } else {
      addMessage("assistant", "Let me show you what to cut:");
      setActiveChips(toChips(budgetLevers.slice(0, 3)));
    }
    setHomeSubflow("idle");
  };

  // ============ SUBFLOW: POWER-UPS ============
  const startPowerupsFlow = () => {
    setHomeSubflow("powerup-pick");
    addMessage("assistant", "Pick a power-up:");
    setActiveChips(toChips(powerUpTypeChips));
  };

  const handlePowerupPick = (chip: ChatChip) => {
    const typeMap: Record<string, { type: string; chips: ChipOption[]; message: string }> = {
      "pu-autosave": {
        type: "autosave",
        chips: autosaveAmountChips,
        message: "How much per day?",
      },
      "pu-rd": {
        type: "rd",
        chips: rdAmountChips,
        message: "How much per month for your RD?",
      },
      "pu-fd": {
        type: "fd",
        chips: fdAmountChips,
        message: "How much to park in an FD?",
      },
    };

    const config = typeMap[chip.id];
    if (config) {
      setSubflowData((prev) => ({ ...prev, powerupType: config.type }));
      setHomeSubflow("powerup-amount");
      addMessage("assistant", config.message);
      setActiveChips(toChips(config.chips));
    }
  };

  const handlePowerupAmount = (chip: ChatChip) => {
    setSubflowData((prev) => ({ ...prev, powerupAmount: chip.label }));
    setHomeSubflow("powerup-confirm");
    addMessage("assistant", `Set up ${subflowData.powerupType?.toUpperCase()} at ${chip.label}?`);
    setActiveChips(toChips(confirmChips));
  };

  const handlePowerupConfirm = (chip: ChatChip) => {
    if (chip.id === "confirm") {
      addMessage("assistant", "Done! Your power-up is now active.", "success");
    } else {
      addMessage("assistant", "Cancelled. Let me know when you're ready.");
    }
    returnToSteadyState();
  };

  const handleTradeoffChip = (chip: ChatChip) => {
    const tradeoffStep = subflowData.tradeoffStep;
    if (tradeoffStep === "treat-choice") {
      if (chip.id === "bucket") {
        startBucketTradeoff();
        return;
      }
      if (chip.id === "cap") {
        addMessage(
          "assistant",
          `I can set a soft cap, but it affects your ${goalDraft.name || profile.goal.goal_name} pace. Choose the tradeoff:`,
        );
        startBucketTradeoff("bucket-2k");
        return;
      }
      if (chip.id === "nudge") {
        addMessage("assistant", "Done. I'll nudge you before similar spends.");
        returnToSteadyState();
      }
    }

    if (tradeoffStep === "plan-choice") {
      if (chip.id === "add-goal") {
        addMessage(
          "assistant",
          "Got it. I'll fold this into your goal plan and keep you posted.",
        );
        returnToSteadyState();
        return;
      }
      if (chip.id === "reduce") {
        addMessage(
          "assistant",
          "We can reduce elsewhere. Pick one lever to keep the pace.",
        );
        setHomeSubflow("leaks-fix");
        setActiveChips(toChips(leakFixChips));
        return;
      }
      if (chip.id === "extend") {
        addMessage(
          "assistant",
          `Okay. Extending the ${goalDraft.name || profile.goal.goal_name} timeline keeps things realistic.`,
        );
        returnToSteadyState();
        return;
      }
    }

    if (tradeoffStep === "bucket-select") {
      setSubflowData((prev) => ({
        ...prev,
        tradeoffRule: chip.id,
        tradeoffStep: "decision",
      }));
      addMessage("assistant", getTradeoffPrompt(chip.id));
      setActiveChips(toChips(tradeoffChoiceChips));
      return;
    }

    if (tradeoffStep === "decision") {
      const rule =
        profile.tradeoff_rules.bucket_options.find(
          (option) => option.id === subflowData.tradeoffRule,
        ) ?? profile.tradeoff_rules.bucket_options[0];
      if (chip.id === "reduce-elsewhere") {
        addMessage("assistant", rule.reduce_elsewhere);
      } else {
        addMessage("assistant", rule.extend_timeline);
      }
      returnToSteadyState();
    }
  };

  // ============ MAIN CHIP HANDLER ============
  const handleChipSelect = (chip: ChatChip) => {
    switch (step) {
      case "persona":
        handlePersonaChip(chip);
        break;
      case "reality":
        handleRealityChip(chip);
        break;
      case "goal":
        handleGoalChip(chip);
        break;
      case "budget":
        handleBudgetChip(chip);
        break;
      case "home":
        handleHomeChip(chip);
        break;
    }
  };

  // ============ RESET ============
  const resetFlow = () => {
    setStep("wrapped");
    setMessages([]);
    setActiveChips([]);
    setPersonaStage("q1");
    setGoalStage("choice");
    setBudgetStage("digest");
    setHomeSubflow("idle");
    setPaceStage("summary");
    setUserResponses({});
    setGoalDraft({});
    setSubflowData({});
    setReceiptsOpen(false);
    setInsightIndex(0);
    setSelectedPaceId("balanced");
  };

  // ============ DRAWER CONTENT ============
  const receiptsDrawer = receiptsOpen ? (
    <div className="space-y-2">
      <p className="text-white/90 font-medium">Recent transactions</p>
      {profile.receipts.map((r) => (
        <p key={r.id} className="text-white/60">
          {r.time} · {r.category} · {r.amount} {r.merchant && `· ${r.merchant}`}
        </p>
      ))}
    </div>
  ) : null;

  // ============ PINNED GOAL ============
  const pinnedGoal =
    step === "home" || (step === "budget" && budgetStage !== "digest") ? (
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {goalDraft.name || profile.goal.goal_name}
          </p>
          <p className="text-xs text-white/50">
            {goalDraft.amount || profile.goal.goal_amount} · {goalDraft.timeline || profile.goal.horizon} · {getPacePreset(profile, selectedPaceId).label}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs font-medium text-emerald-400">{profile.goal.days_ahead_behind}</p>
          <p className="text-[10px] text-white/40">on track</p>
        </div>
      </div>
    ) : null;

  // ============ RENDER ============
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-6 text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px] rounded-[36px] border border-white/10 bg-zinc-950/80 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Device frame header */}
        <div className="mb-3 flex items-center justify-between px-2 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
            <span className="font-medium">Slice Banker</span>
          </div>
          <button
            onClick={resetFlow}
            className="rounded-full border border-white/10 px-3 py-1.5 text-white/60 hover:border-white/30 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
          >
            Restart
          </button>
        </div>

        {/* Main content */}
        <div className="h-[700px]">
          {step === "wrapped" ? (
            <WrappedCarousel slides={wrappedSlides} onComplete={handleWrappedComplete} />
          ) : (
            <Chat
              title="Slice"
              subtitle={`${profile.label}`}
              messages={messages}
              chips={activeChips}
              onChipSelect={handleChipSelect}
              showInput={step === "goal" && goalStage === "choice"}
              inputPlaceholder="Type your goal..."
              onSubmit={handleGoalInput}
              drawerContent={receiptsDrawer}
              pinnedContent={pinnedGoal}
              headerActions={[
                {
                  id: "receipts",
                  label: "Receipts",
                  onClick: () => setReceiptsOpen((prev) => !prev),
                  active: receiptsOpen,
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
