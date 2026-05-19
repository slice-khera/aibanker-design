"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { typography } from "../lib/typography";
import {
  VALENTINO_50,
  OUTLINE_SUBTLE,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  BG_PRIMARY, BG_SECONDARY,
} from "../lib/colors";
import { RADIUS_PILL } from "../lib/radii";
import { SPACE_XS, SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
import { StatusBar, ChatAppBar } from "../components/AppChrome";
import { useTypewriter } from "../components/Chat";
import QuestionnaireOverlay from "../components/QuestionnaireOverlay";
import ChatCard from "../components/ChatCards";
import BudgetSummaryViz from "../components/BudgetSummaryViz";
import CategoryBudgetsViz from "../components/CategoryBudgetsViz";
import { highlightValues } from "../lib/chat-highlight";
import { SAVINGS_TIER_QUESTION } from "./fixtures/savingsTierQuestion";
import type { SimMessage } from "./fixtures/savingsFlowFixture";
import type { LadderTier } from "../lib/types";
import {
  BUCKET_CONFIRM_LIST,
  LADDER_OPTIONS,
  SPENDING_PLAN_FIXTURE,
  STORY1_GOAL_SETUP,
  STORY1_LADDER_INTRO,
  STORY1_LADDER_PICKED,
  STORY1_BUCKET_INCOME,
  STORY1_BUCKET_INCOME_CONFIRMED,
  STORY1_BUCKET_OBLIGATIONS,
  STORY1_BUCKET_OBLIGATIONS_CONFIRMED,
  STORY1_BUCKET_P2P,
  STORY1_BUCKET_P2P_CONFIRMED,
  STORY1_BUCKET_SPORADIC,
  STORY1_BUCKET_SPORADIC_CONFIRMED,
  STORY1_SPENDING_PLAN,
  STORY1_VERDICT_FEASIBLE,
  STORY1_LOCK_IN,
  STORY2_ENTRY,
  STORY3_ENTRY,
  STORY3_MERGE_OFFER,
  STORY4_ENTRY,
  STORY5_ENTRY,
  STORY6_ENTRY,
  DESTINATION_CHIPS,
  LOCK_IN_CHIPS,
  INFEASIBLE_CHIPS,
  MERGE_CHIPS,
  type GBPStory,
  STORY_LABELS,
} from "./fixtures/gbpFlowFixture";

// ── Flow phases ─────────────────────────────────────────────────

type Phase =
  | "entry"              // Initial user message + system response
  | "destination-pick"   // Goal vs Pool (vague intent)
  | "ladder"             // Savings ladder (vague intent)
  | "footprint-walk"     // 5 buckets, one at a time
  | "spending-plan"      // Summary + category budgets
  | "verdict"            // Verdict banner
  | "lock-in"            // Confirmation
  | "done"               // Locked in
  | "blocked";           // Impossible / cap reached

// ── Bubble ──────────────────────────────────────────────────────

function Bubble({
  msg,
  typewrite = false,
  onStreamComplete,
}: {
  msg: SimMessage;
  typewrite?: boolean;
  onStreamComplete?: () => void;
}) {
  const active = typewrite && msg.role === "assistant";
  const streamed = useTypewriter(msg.text, active, active ? onStreamComplete : undefined);
  const text = active ? streamed : msg.text;

  if (msg.role === "user") {
    return (
      <div className="flex flex-col items-end animate-chat-message-in">
        <div
          className="max-w-[75%] rounded-[16px] rounded-tr-lg"
          style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
        >
          <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: TEXT_PRIMARY, margin: 0 }}>
            {msg.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start animate-chat-message-in">
      <p className="whitespace-pre-line w-full" style={{ ...typography.bodySmall, color: TEXT_PRIMARY, margin: 0 }}>
        {highlightValues(text)}
      </p>
    </div>
  );
}

// ── Chip list ───────────────────────────────────────────────────

function ChipList({
  chips,
  onSelect,
}: {
  chips: { id: string; label: string }[];
  onSelect: (chip: { id: string; label: string }) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" style={{ paddingTop: SPACE_XS }}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onSelect(chip)}
          className="transition-transform active:scale-[0.97]"
          style={{
            ...typography.buttonSmall,
            color: TEXT_PRIMARY,
            backgroundColor: BG_SECONDARY,
            border: `1px solid ${OUTLINE_SUBTLE}`,
            borderRadius: RADIUS_PILL,
            padding: `${SPACE_XS}px ${SPACE_M}px`,
            cursor: "pointer",
          }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

// ── Thinking indicator ──────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-center" style={{ gap: 8, paddingTop: 4, paddingBottom: 4 }}>
      <p className="animate-thinking-pulse" style={{ ...typography.bodySmall, color: TEXT_TERTIARY, margin: 0 }}>
        Thinking…
      </p>
    </div>
  );
}

// ── Floating AppBar — delegates to DLS ChatAppBar ────────────────

function FloatingAppBar() {
  return <ChatAppBar absolute variant="firstTime" voice="ryan" />;
}

// ── Main simulation ─────────────────────────────────────────────

export default function GBPFlowSim({ story = "clean-start" }: { story?: GBPStory }) {
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("entry");
  const [showThinking, setShowThinking] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const [activeChips, setActiveChips] = useState<{ id: string; label: string }[]>([]);
  const [ladderSelected, setLadderSelected] = useState<LadderTier | null>(null);
  const [showLadder, setShowLadder] = useState(false);
  const [activeBucketIndex, setActiveBucketIndex] = useState(0);
  const [showBucket, setShowBucket] = useState(false);
  const [showBudgetSummary, setShowBudgetSummary] = useState(false);
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(false);
  const [streamedIds, setStreamedIds] = useState<Set<string>>(new Set());

  // Anchor ids for streaming-gated UI: each element is tied to the assistant
  // message that must finish streaming before it appears. Once streamed, the
  // gate latches open and the element stays mounted even if a new Ryan message
  // starts streaming below.
  const [chipsAnchorId, setChipsAnchorId] = useState<string | null>(null);
  const [bucketAnchorId, setBucketAnchorId] = useState<string | null>(null);
  const [budgetSummaryAnchorId, setBudgetSummaryAnchorId] = useState<string | null>(null);
  const [categoryBudgetsAnchorId, setCategoryBudgetsAnchorId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const didBootRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    });
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  }, []);

  const addMessages = useCallback((msgs: SimMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
    scrollToBottom();
  }, [scrollToBottom]);

  // When a new message arrives, any previously-streaming assistant message
  // snaps to its full text (Bubble's typewrite=true only applies to the last
  // message). Mark all non-last assistant messages as streamed so anchored
  // UI tied to them isn't left waiting on an onComplete that will never fire.
  useEffect(() => {
    if (messages.length <= 1) return;
    setStreamedIds((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (let i = 0; i < messages.length - 1; i++) {
        const m = messages[i];
        if (m.role === "assistant" && !next.has(m.id)) {
          next.add(m.id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [messages]);

  // ── Reset on story change ────────────────────────────────────
  useEffect(() => {
    // Clean up timers
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];

    setMessages([]);
    setPhase("entry");
    setShowThinking(false);
    setShowChips(false);
    setActiveChips([]);
    setLadderSelected(null);
    setShowLadder(false);
    setActiveBucketIndex(0);
    setShowBucket(false);
    setShowBudgetSummary(false);
    setShowCategoryBudgets(false);
    setStreamedIds(new Set());
    setChipsAnchorId(null);
    setBucketAnchorId(null);
    setBudgetSummaryAnchorId(null);
    setCategoryBudgetsAnchorId(null);
    didBootRef.current = false;
  }, [story]);

  // ── Boot sequence ────────────────────────────────────────────
  useEffect(() => {
    if (didBootRef.current) return;
    didBootRef.current = true;

    if (story === "clean-start") {
      bootStory1();
    } else if (story === "goal-exists") {
      bootStory2();
    } else if (story === "pool-exists") {
      bootStory3();
    } else if (story === "both-exist") {
      bootStory4();
    } else if (story === "impossible-amount") {
      bootStory5();
    } else if (story === "cashflow-blocked") {
      bootStory6();
    }
  }, [story]);

  // ── Story boot functions ─────────────────────────────────────

  function bootStory1() {
    // Story 1: Clean start - vague intent → ladder → footprint → plan
    schedule(() => {
      addMessages([STORY1_GOAL_SETUP[0]]);
    }, 400);

    schedule(() => {
      setShowThinking(true);
      scrollToBottom();
    }, 800);

    schedule(() => {
      setShowThinking(false);
      addMessages([STORY1_GOAL_SETUP[1]]);
      setPhase("destination-pick");
      setActiveChips(DESTINATION_CHIPS);
      setShowChips(true);
      setChipsAnchorId(STORY1_GOAL_SETUP[1].id);
    }, 1600);
  }

  function bootStory2() {
    schedule(() => addMessages([STORY2_ENTRY[0]]), 400);
    schedule(() => { setShowThinking(true); scrollToBottom(); }, 800);
    schedule(() => {
      setShowThinking(false);
      addMessages([STORY2_ENTRY[1]]);
      setPhase("blocked");
      setActiveChips([
        { id: "accelerate", label: "Hit trip sooner" },
        { id: "stack", label: "Save for something else" },
      ]);
      setShowChips(true);
      setChipsAnchorId(STORY2_ENTRY[1].id);
    }, 1600);
  }

  function bootStory3() {
    schedule(() => addMessages([STORY3_ENTRY[0]]), 400);
    schedule(() => { setShowThinking(true); scrollToBottom(); }, 800);
    schedule(() => {
      setShowThinking(false);
      addMessages([STORY3_ENTRY[1]]);
      setPhase("blocked");
      setActiveChips(MERGE_CHIPS);
      setShowChips(true);
      setChipsAnchorId(STORY3_ENTRY[1].id);
    }, 1600);
  }

  function bootStory4() {
    schedule(() => addMessages([STORY4_ENTRY[0]]), 400);
    schedule(() => { setShowThinking(true); scrollToBottom(); }, 800);
    schedule(() => {
      setShowThinking(false);
      addMessages([STORY4_ENTRY[1]]);
      setPhase("blocked");
      setActiveChips([
        { id: "bump-goal", label: "Bump trip" },
        { id: "bump-pool", label: "Bump emergency fund" },
        { id: "wait", label: "Wait until trip's done" },
      ]);
      setShowChips(true);
      setChipsAnchorId(STORY4_ENTRY[1].id);
    }, 1600);
  }

  function bootStory5() {
    schedule(() => addMessages([STORY5_ENTRY[0]]), 400);
    schedule(() => { setShowThinking(true); scrollToBottom(); }, 800);
    schedule(() => {
      setShowThinking(false);
      addMessages([STORY5_ENTRY[1]]);
      setPhase("blocked");
      setActiveChips(INFEASIBLE_CHIPS);
      setShowChips(true);
      setChipsAnchorId(STORY5_ENTRY[1].id);
    }, 1600);
  }

  function bootStory6() {
    schedule(() => addMessages([STORY6_ENTRY[0]]), 400);
    schedule(() => { setShowThinking(true); scrollToBottom(); }, 800);
    schedule(() => {
      setShowThinking(false);
      addMessages([STORY6_ENTRY[1]]);
      setPhase("blocked");
      setActiveChips([{ id: "review", label: "Walk me through it" }]);
      setShowChips(true);
      setChipsAnchorId(STORY6_ENTRY[1].id);
    }, 1600);
  }

  // ── Chip handler (routes by phase) ───────────────────────────

  const handleChip = useCallback((chip: { id: string; label: string }) => {
    setShowChips(false);
    setChipsAnchorId(null);

    if (phase === "destination-pick") {
      // User picked "just save more" → show ladder
      addMessages([{ id: "u-dest", role: "user", text: chip.label }]);
      schedule(() => { setShowThinking(true); scrollToBottom(); }, 300);
      schedule(() => {
        setShowThinking(false);
        // Drop leading user echo - the handler already added it above.
        addMessages(STORY1_LADDER_INTRO.filter((m) => m.role !== "user"));
        setPhase("ladder");
        setShowLadder(true);
        scrollToBottom();
      }, 1200);
    } else if (phase === "verdict") {
      handleVerdictAction(chip);
    } else if (phase === "blocked") {
      // Terminal stories - just echo the choice
      addMessages([{ id: `u-blocked-${chip.id}`, role: "user", text: chip.label }]);
      setChipsAnchorId(null);
      schedule(() => { setShowThinking(true); scrollToBottom(); }, 300);
      schedule(() => {
        setShowThinking(false);
        addMessages([{
          id: "a-blocked-ack",
          role: "assistant",
          text: chip.id === "review" || chip.id === "stack"
            ? "Let's take a closer look at your finances to figure out what's possible."
            : "Got it. I'll factor that in. Let me walk through your finances first.",
        }]);
        // For stories 2-6, once user makes a choice, start the footprint walk
        startFootprintWalk();
      }, 1200);
    }
  }, [phase, scrollToBottom, schedule]);

  // ── Ladder selection handler ──────────────────────────────────

  const handleLadderSelect = useCallback((tier: LadderTier) => {
    setLadderSelected(tier);
    setShowLadder(false);

    const picked = LADDER_OPTIONS.find((o) => o.tier === tier)!;
    addMessages([
      { id: "u-ladder", role: "user", text: tier.charAt(0).toUpperCase() + tier.slice(1) },
    ]);

    schedule(() => { setShowThinking(true); scrollToBottom(); }, 300);
    schedule(() => {
      setShowThinking(false);
      // Drop the leading user echo - the handler already added it above.
      addMessages(STORY1_LADDER_PICKED.filter((m) => m.role !== "user"));
      scrollToBottom();
    }, 1200);

    // Start footprint walk after the ladder ack has time to stream out.
    // The ack runs ~200 chars; at ~10ms/char that's ~2s of streaming.
    schedule(() => {
      startFootprintWalk();
    }, 3600);
  }, [scrollToBottom, schedule]);

  // ── Footprint walk ───────────────────────────────────────────

  const startFootprintWalk = useCallback(() => {
    setPhase("footprint-walk");
    setActiveBucketIndex(0);
    setShowBucket(true);
    addMessages(STORY1_BUCKET_INCOME);
    setBucketAnchorId(STORY1_BUCKET_INCOME[0].id);
    // No separate chip set: the confirm-list card's own "Looks right"
    // CTA is the action. Chips below would be a redundant duplicate.
    scrollToBottom();
  }, [scrollToBottom]);

  const handleBucketConfirm = useCallback(() => {
    setShowBucket(false);
    setBucketAnchorId(null);

    // Progression messages by bucket index
    const confirmMessages = [
      STORY1_BUCKET_INCOME_CONFIRMED,
      STORY1_BUCKET_OBLIGATIONS_CONFIRMED,
      STORY1_BUCKET_P2P_CONFIRMED,
      STORY1_BUCKET_SPORADIC_CONFIRMED,
    ];
    const nextBucketMessages = [
      STORY1_BUCKET_OBLIGATIONS,
      STORY1_BUCKET_P2P,
      STORY1_BUCKET_SPORADIC,
    ];

    // The user's "Looks right" intent is conveyed by tapping the card's
    // CTA. Echo it as a user bubble for chat continuity.
    addMessages([{ id: `u-bucket-${activeBucketIndex}`, role: "user", text: "Looks right" }]);

    schedule(() => { setShowThinking(true); scrollToBottom(); }, 300);

    schedule(() => {
      setShowThinking(false);
      if (confirmMessages[activeBucketIndex]) {
        addMessages(confirmMessages[activeBucketIndex]);
      }
      scrollToBottom();
    }, 1000);

    // Show next bucket or move to spending plan
    const nextIdx = activeBucketIndex + 1;
    if (nextIdx < BUCKET_CONFIRM_LIST.length) {
      schedule(() => {
        setActiveBucketIndex(nextIdx);
        const nextMsg = nextBucketMessages[activeBucketIndex];
        if (nextMsg) {
          addMessages(nextMsg);
        }
        setShowBucket(true);
        if (nextMsg) setBucketAnchorId(nextMsg[0].id);
        scrollToBottom();
      }, 2000);
    } else {
      // All buckets done → spending plan (summary first, categories second)
      schedule(() => {
        addMessages(STORY1_SPENDING_PLAN);
        setPhase("spending-plan");
        setShowBudgetSummary(true);
        setBudgetSummaryAnchorId(STORY1_SPENDING_PLAN[0].id);
        scrollToBottom();
      }, 2000);

      schedule(() => {
        setShowCategoryBudgets(true);
        setCategoryBudgetsAnchorId(STORY1_SPENDING_PLAN[0].id);
        scrollToBottom();
      }, 2800);

      // Verdict lands as Ryan's next chat bubble, not a separate banner
      schedule(() => {
        addMessages(STORY1_VERDICT_FEASIBLE);
        setPhase("verdict");
        setActiveChips(LOCK_IN_CHIPS);
        setShowChips(true);
        setChipsAnchorId(STORY1_VERDICT_FEASIBLE[0].id);
        scrollToBottom();
      }, 4000);
    }
  }, [activeBucketIndex, scrollToBottom, schedule]);

  // ── Verdict action handler ───────────────────────────────────

  const handleVerdictAction = useCallback((chip: { id: string; label: string }) => {
    addMessages([{ id: "u-verdict", role: "user", text: chip.label }]);
    setShowChips(false);
    setChipsAnchorId(null);

    schedule(() => { setShowThinking(true); scrollToBottom(); }, 300);
    schedule(() => {
      setShowThinking(false);
      addMessages(STORY1_LOCK_IN);
      setPhase("done");
      scrollToBottom();
    }, 1200);
  }, [scrollToBottom, schedule]);

  // ── Render ───────────────────────────────────────────────────

  // Streaming gates: each piece of actionable UI is anchored to the specific
  // assistant message it follows. The gate latches open once that message is
  // fully streamed and stays open, even when a new Ryan message starts
  // streaming below. Matches the universal rule in
  // feedback_chat_streaming_scroll.md.
  const chipsReady = chipsAnchorId !== null && streamedIds.has(chipsAnchorId);
  const bucketReady = bucketAnchorId !== null && streamedIds.has(bucketAnchorId);
  const budgetSummaryReady =
    budgetSummaryAnchorId !== null && streamedIds.has(budgetSummaryAnchorId);
  const categoryBudgetsReady =
    categoryBudgetsAnchorId !== null && streamedIds.has(categoryBudgetsAnchorId);

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BG_PRIMARY,
        overflow: "hidden",
      }}
    >
      <FloatingAppBar />

      {/* Scrollable content area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: 108, // below app bar
          paddingBottom: SPACE_L,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: SPACE_M,
            padding: `0 ${SPACE_M}px`,
            paddingBottom: SPACE_L,
          }}
        >
          {/* Messages */}
          {messages.map((msg, i) => (
            <Bubble
              key={msg.id}
              msg={msg}
              typewrite={i === messages.length - 1}
              onStreamComplete={() => {
                setStreamedIds((prev) => {
                  if (prev.has(msg.id)) return prev;
                  const next = new Set(prev);
                  next.add(msg.id);
                  return next;
                });
                scrollToBottom();
              }}
            />
          ))}

          {/* Thinking indicator */}
          {showThinking && <ThinkingIndicator />}

          {/* Confirm list (footprint walk) - waits for Ryan's text to finish
              streaming. The card's own "Looks right" CTA advances the bucket;
              there's no redundant chip set below it. */}
          {showBucket && bucketReady && BUCKET_CONFIRM_LIST[activeBucketIndex] && (
            <div key={`bucket-${activeBucketIndex}`} className="animate-chat-message-in">
              <ChatCard
                card={{
                  ...BUCKET_CONFIRM_LIST[activeBucketIndex],
                  defaultAllSelected: true,
                  onSubmit: () => handleBucketConfirm(),
                }}
              />
            </div>
          )}

          {/* Spending plan — math first, then categories. Each gated on its anchor message. */}
          {showBudgetSummary && budgetSummaryReady && (
            <div className="animate-chat-message-in">
              <BudgetSummaryViz plan={SPENDING_PLAN_FIXTURE} />
            </div>
          )}
          {showCategoryBudgets && categoryBudgetsReady && (
            <div className="animate-chat-message-in">
              <CategoryBudgetsViz plan={SPENDING_PLAN_FIXTURE} />
            </div>
          )}

          {/* Chips - never appear before their anchor Ryan message finishes streaming */}
          {showChips && chipsReady && activeChips.length > 0 && (
            <div className="animate-chat-message-in">
              <ChipList chips={activeChips} onSelect={handleChip} />
            </div>
          )}
        </div>
      </div>

      {/* Savings tier overlay */}
      {showLadder && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <QuestionnaireOverlay
            questions={[SAVINGS_TIER_QUESTION]}
            currentIndex={0}
            answers={ladderSelected ? { [SAVINGS_TIER_QUESTION.id]: ladderSelected } : {}}
            onSelectOption={(_qId, opt) => handleLadderSelect(opt.id as LadderTier)}
            onSubmitFreeText={() => {}}
            onNavigate={() => {}}
            onClose={() => setShowLadder(false)}
          />
        </div>
      )}
    </div>
  );
}
