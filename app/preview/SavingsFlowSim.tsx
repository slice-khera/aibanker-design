"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { typography } from "../lib/typography";
import {
  VALENTINO_50,
  OUTLINE_SUBTLE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  ALPHA_BLACK_30,
  BG_PRIMARY,
  BG_SECONDARY,
} from "../lib/colors";
import { RADIUS_CIRCLE, RADIUS_PILL } from "../lib/radii";
import { SPACE_XS, SPACE_M } from "../lib/spacing";
import { ELEVATION_CARD } from "../lib/elevation";
import { StatusBar, GestureNav, FooterInset } from "../components/AppChrome";
import PlanCruncherV2 from "../components/PlanCruncherV2";
import QuestionnaireOverlay from "../components/QuestionnaireOverlay";
import type { QuestionOption } from "../components/QuestionnaireOverlay";
import MockKeyboard from "../components/MockKeyboard";
import { useTypewriter } from "../components/Chat";
import {
  INITIAL_MESSAGES,
  GOAL_QUESTIONS,
  CLARIFYING_QUESTIONS,
  VERBOSE_PLAN_TEXT,
  type SimMessage,
} from "./fixtures/savingsFlowFixture";

// ── Flow phases ─────────────────────────────────────────────────

type Phase =
  | "questionnaire"
  | "working"
  | "result";

// ── Cruncher status texts ─────────────────────────────────────

const IDLE_CRUNCHER_TEXTS = [
  "Comparing savings instruments",
  "Optimising monthly allocation",
  "Projecting returns",
  "Running scenarios",
  "Crunching the numbers",
  "Building your savings plan",
];

// ── Bubble ──────────────────────────────────────────────────────

function Bubble({ msg, typewrite = false }: { msg: SimMessage; typewrite?: boolean }) {
  const streamed = useTypewriter(msg.text, typewrite && msg.role === "assistant");
  const text = typewrite && msg.role === "assistant" ? streamed : msg.text;

  if (msg.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div
          className="max-w-[75%] rounded-[16px] rounded-tr-lg"
          style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
        >
          <p className="whitespace-pre-line text-[var(--chat-text-primary)]" style={typography.bodySmall}>
            {msg.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <p className="whitespace-pre-line text-[var(--chat-text-primary)] w-full" style={typography.bodySmall}>
        {text}
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
    <div className="flex flex-wrap gap-3">
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
      <p className="animate-thinking-pulse text-[var(--chat-text-tertiary)]" style={typography.bodySmall}>
        Thinking…
      </p>
    </div>
  );
}

// ── Floating AppBar ─────────────────────────────────────────────

function FloatingAppBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10" style={{ pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}>
        <div className="shrink-0" style={{ backgroundColor: "transparent" }}>
          <StatusBar backgroundColor="transparent" />
          <div className="flex items-center" style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 8 }}>
            <div style={{ flex: "1 0 0", maxWidth: 48, height: 48, display: "flex", alignItems: "center" }}>
              <div
                className="flex items-center justify-center rounded-full bg-white"
                style={{ width: 48, height: 48, border: `1px solid ${OUTLINE_SUBTLE}`, boxShadow: ELEVATION_CARD }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div style={{ flex: "1 0 0", minWidth: 0, height: 24, position: "relative" }}>
              <div
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  color: TEXT_PRIMARY, ...typography.headerH4,
                }}
              >
                Ryan
              </div>
            </div>
            <div style={{ flex: "1 0 0", maxWidth: 48, height: 48 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main simulation ─────────────────────────────────────────────

export default function SavingsFlowSim() {
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("working");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [cruncherVisible, setCruncherVisible] = useState(false);
  const [cruncherStatus, setCruncherStatus] = useState("Gathering your preferences");
  const [goalName, setGoalName] = useState("Savings goal");
  const [showThinking, setShowThinking] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputBarVisible, setInputBarVisible] = useState(true);

  const [clarifyIndex, setClarifyIndex] = useState(0);
  const [showClarifyChips, setShowClarifyChips] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const didBootRef = useRef(false);
  const snappedIdsRef = useRef<Set<string>>(new Set());
  const cruncherVisibleRef = useRef(false);

  const userBubbleRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const id = el.getAttribute("data-msg-id");
    if (!id || snappedIdsRef.current.has(id)) return;
    snappedIdsRef.current.add(id);

    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    setTimeout(() => {
      const headerHeight = cruncherVisibleRef.current ? 200 : 108;
      const scrollerRect = scroller.getBoundingClientRect();
      const bubbleRect = el.getBoundingClientRect();
      const bubbleTopInScroller = bubbleRect.top - scrollerRect.top + scroller.scrollTop;
      const target = Math.max(0, bubbleTopInScroller - headerHeight - 16);

      const minHeight = target + scroller.clientHeight;
      if (content.scrollHeight < minHeight) {
        content.style.minHeight = `${minHeight}px`;
      }

      const start = scroller.scrollTop;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;
      const duration = 400;
      const startTime = performance.now();
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        scroller.scrollTop = start + distance * ease(progress);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      });
    });
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  }, []);

  // ── Boot sequence ─────────────────────────────────────────────
  useEffect(() => {
    if (didBootRef.current) return;
    didBootRef.current = true;

    schedule(() => {
      setMessages([INITIAL_MESSAGES[0]]);
      scrollToBottom();
    }, 600);

    schedule(() => {
      setShowThinking(true);
      scrollToBottom();
    }, 1000);

    schedule(() => {
      setShowThinking(false);
      setMessages(INITIAL_MESSAGES);
      scrollToBottom();
    }, 1800);

    schedule(() => {
      setPhase("questionnaire");
    }, 2400);
  }, [scrollToBottom, schedule]);

  // ── Questionnaire handlers ────────────────────────────────────

  const handleSelectOption = useCallback((questionId: string, option: QuestionOption) => {
    const next = { ...quizAnswers, [questionId]: option.id };
    setQuizAnswers(next);

    schedule(() => {
      if (quizIndex < GOAL_QUESTIONS.length - 1) {
        if (questionId === "goal-type" && option.id !== "trip") {
          setQuizIndex(2);
        } else {
          setQuizIndex((i) => i + 1);
        }
      } else {
        handleQuizComplete(next);
      }
    }, 350);
  }, [quizAnswers, quizIndex, schedule]);

  const handleFreeText = useCallback((questionId: string, text: string) => {
    const next = { ...quizAnswers, [questionId]: text };
    setQuizAnswers(next);

    schedule(() => {
      if (quizIndex < GOAL_QUESTIONS.length - 1) {
        setQuizIndex((i) => i + 1);
      } else {
        handleQuizComplete(next);
      }
    }, 350);
  }, [quizAnswers, quizIndex, schedule]);

  const handleNavigate = useCallback((dir: "prev" | "next") => {
    setQuizIndex((i) => {
      if (dir === "prev") return Math.max(0, i - 1);
      return Math.min(GOAL_QUESTIONS.length - 1, i + 1);
    });
  }, []);

  const handleQuizClose = useCallback(() => {
    setPhase("working");
    setMessages((prev) => [
      ...prev,
      { id: "nudge", role: "assistant", text: "No worries \u2014 whenever you're ready, just say \"savings goal\" and we'll pick up where we left off." },
    ]);
    scrollToBottom();
  }, [scrollToBottom]);

  const CRUNCHER_STATUS_BY_QUESTION = [
    "Checking monthly obligations",
    "Reviewing your finances",
    "Analysing risk profile",
  ];

  // ── Post-questionnaire ────────────────────────────────────────

  const handleQuizComplete = useCallback((answers: Record<string, string>) => {
    setPhase("working");

    const goalType = GOAL_QUESTIONS[0].options.find((o) => o.id === answers["goal-type"])?.label || answers["goal-type"];
    const dest = answers["destination"] || "";
    const name = dest ? `Trip to ${dest}` : goalType;
    setGoalName(name);

    setMessages((prev) => [
      ...prev,
      { id: "u-shared", role: "user", text: "Shared preferences" },
    ]);

    schedule(() => {
      setCruncherVisible(true);
      cruncherVisibleRef.current = true;
      setCruncherStatus("Gathering your preferences");
      setShowThinking(true);
      scrollToBottom();
    }, 600);

    schedule(() => {
      setShowThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: "pq-summary", role: "assistant", text: "Got it \u2014 let me check your finances and put together a plan." },
      ]);
      scrollToBottom();
    }, 1400);

    schedule(() => {
      setShowThinking(true);
      scrollToBottom();
    }, 2000);

    schedule(() => {
      setShowThinking(false);
      setCruncherStatus(CRUNCHER_STATUS_BY_QUESTION[0]);
      const cq = CLARIFYING_QUESTIONS[0];
      setMessages((prev) => [
        ...prev,
        { id: cq.id, role: "assistant", text: cq.botText },
      ]);
      setShowClarifyChips(true);
      scrollToBottom();
    }, 3000);
  }, [scrollToBottom, schedule]);

  // ── Handle clarifying question chip selection ─────────────────

  const handleClarifyChip = useCallback((chip: { id: string; label: string }) => {
    setShowClarifyChips(false);
    const currentCQ = CLARIFYING_QUESTIONS[clarifyIndex];

    setMessages((prev) => [
      ...prev,
      { id: `u-${currentCQ.id}`, role: "user", text: chip.label },
    ]);

    setShowThinking(true);

    const nextIndex = clarifyIndex + 1;

    if (nextIndex < CLARIFYING_QUESTIONS.length) {
      schedule(() => {
        setShowThinking(false);
        setCruncherStatus(CRUNCHER_STATUS_BY_QUESTION[nextIndex]);
        const nextCQ = CLARIFYING_QUESTIONS[nextIndex];
        setMessages((prev) => [
          ...prev,
          { id: nextCQ.id, role: "assistant", text: nextCQ.botText },
        ]);
        setClarifyIndex(nextIndex);
        setShowClarifyChips(true);
        scrollToBottom();
      }, 1200);
    } else {
      schedule(() => {
        setShowThinking(false);
        setInputBarVisible(false);
        setMessages((prev) => [
          ...prev,
          { id: "pq-final", role: "assistant", text: "Thanks \u2014 this might take a moment while I crunch the numbers. I\u2019ll notify you when your plan is ready, so no need to wait here." },
        ]);
        scrollToBottom();
      }, 1000);

      let delay = 1500;
      IDLE_CRUNCHER_TEXTS.forEach((text) => {
        schedule(() => {
          setCruncherStatus(text);
        }, delay);
        delay += 1400;
      });

      schedule(() => {
        setCruncherVisible(false);
        cruncherVisibleRef.current = false;
        setShowThinking(true);
        scrollToBottom();
      }, 10000);

      schedule(() => {
        setShowThinking(false);
        setPhase("result");
        setMessages((prev) => [
          ...prev,
          { id: "r1", role: "assistant", text: VERBOSE_PLAN_TEXT },
        ]);
        setInputBarVisible(true);
        scrollToBottom();
      }, 10800);
    }
  }, [clarifyIndex, scrollToBottom, schedule]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHasScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Keep scroll pinned to bottom while the verbose plan streams in.
  useEffect(() => {
    if (phase !== "result") return;
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;
    const ro = new ResizeObserver(() => {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    });
    ro.observe(content);
    return () => ro.disconnect();
  }, [phase]);

  const handleFocusCapture = useCallback((e: React.FocusEvent) => {
    if (e.target instanceof HTMLInputElement) setKeyboardVisible(true);
  }, []);
  const handleBlurCapture = useCallback((e: React.FocusEvent) => {
    if (e.target instanceof HTMLInputElement) {
      setTimeout(() => setKeyboardVisible(false), 100);
    }
  }, []);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-white"
      style={{ fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif" }}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      <FloatingAppBar />

      <div
        className="absolute left-0 right-0 z-[9]"
        style={{
          top: 0,
          height: 120,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, white 60%, transparent 100%)",
          opacity: hasScrolled ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      />

      {/* PlanCruncherV2 — pinned below app bar */}
      {cruncherVisible && (
        <div className="absolute top-0 left-0 right-0 z-10" style={{ pointerEvents: "none", paddingTop: 116 }}>
          <div style={{ pointerEvents: "auto", position: "relative", zIndex: 1, padding: "0 16px" }}>
            <PlanCruncherV2
              goalName={goalName}
              visible
              statusText={cruncherStatus}
            />
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="absolute inset-0 w-full overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ overflowAnchor: "none" }}
      >
        <div ref={contentRef} className="flex flex-col px-6">
          <div className="shrink-0" aria-hidden="true" style={{ height: cruncherVisible ? 200 : 108 }} />

          <div className="w-full space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                data-msg-id={msg.id}
                ref={msg.role === "user" ? userBubbleRef : undefined}
                className="animate-chat-message-in"
              >
                <Bubble msg={msg} typewrite={msg.id === "r1"} />
              </div>
            ))}

            {showThinking && (
              <div className="animate-chat-message-in">
                <ThinkingIndicator />
              </div>
            )}

            {showClarifyChips && clarifyIndex < CLARIFYING_QUESTIONS.length && (
              <div className="animate-chat-message-in">
                <ChipList
                  chips={CLARIFYING_QUESTIONS[clarifyIndex].chips}
                  onSelect={handleClarifyChip}
                />
              </div>
            )}
          </div>

          <div className="shrink-0" aria-hidden="true" style={{ height: 120 }} />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-[15]"
        style={{
          pointerEvents: inputBarVisible ? "auto" : "none",
          transform: inputBarVisible ? "translateY(0)" : "translateY(100%)",
          opacity: inputBarVisible ? 1 : 0,
          transition: "transform 300ms ease, opacity 200ms ease",
        }}
      >
        <FooterInset backgroundColor="transparent" paddingX={16} paddingTop={8} minBottomPadding={0}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <div
              className="flex items-center overflow-hidden flex-1"
              style={{ height: 48, backgroundColor: BG_PRIMARY, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: RADIUS_CIRCLE, boxShadow: ELEVATION_CARD }}
            >
              <div
                className="flex items-center w-full h-full"
                style={{ backgroundColor: BG_PRIMARY, borderRadius: RADIUS_CIRCLE, paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}
              >
                <span className="flex-1" style={{ ...typography.bodySmall, color: ALPHA_BLACK_30 }}>
                  Reply to Ryan...
                </span>
              </div>
            </div>
          </div>
        </FooterInset>
        <GestureNav />
      </div>

      {phase === "questionnaire" && (
        <div className="absolute bottom-0 left-0 right-0 z-20" style={{ pointerEvents: "auto", transition: "transform 250ms ease", transform: keyboardVisible ? "translateY(-260px)" : "translateY(0)" }}>
          <QuestionnaireOverlay
            questions={GOAL_QUESTIONS}
            currentIndex={quizIndex}
            answers={quizAnswers}
            onSelectOption={handleSelectOption}
            onSubmitFreeText={handleFreeText}
            onNavigate={handleNavigate}
            onClose={handleQuizClose}
          />
        </div>
      )}

      <MockKeyboard visible={keyboardVisible} />
    </div>
  );
}
