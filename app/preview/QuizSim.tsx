"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { typography } from "../lib/typography";
import { TEXT_PRIMARY, TEXT_TERTIARY, OUTLINE_SUBTLE, BG_PRIMARY, VALENTINO_50 } from "../lib/colors";
import { RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import { StatusBar, GestureNav, FooterInset } from "../components/AppChrome";
import QuestionnaireOverlay, { type Question, type QuestionOption } from "../components/QuestionnaireOverlay";

// ── Hardcoded questions (same as DBG_GOAL_QUESTIONS) ───────────

const GOAL_QUESTIONS: Question[] = [
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
      { id: "50k", label: "₹50k" },
      { id: "1l", label: "₹1L" },
      { id: "5l", label: "₹5L" },
      { id: "10l", label: "₹10L" },
    ],
  },
];

// ── Chat messages ──────────────────────────────────────────────

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

const INITIAL_MESSAGES: ChatMsg[] = [
  { id: "gq-user", role: "user", text: "I want to start saving for a goal" },
  { id: "gq-agent", role: "assistant", text: "Let\u2019s set one up. I\u2019ll ask a few quick questions." },
];

// ── Floating AppBar ────────────────────────────────────────────

function FloatingAppBar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10" style={{ pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}>
        <StatusBar backgroundColor="transparent" />
        <div className="flex items-center" style={{ padding: "8px 12px 8px 8px" }}>
          <div style={{ width: 48, height: 48, display: "flex", alignItems: "center" }}>
            <div
              className="flex items-center justify-center rounded-full bg-white"
              style={{ width: 48, height: 48, border: `1px solid ${OUTLINE_SUBTLE}`, boxShadow: ELEVATION_CARD }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "center", ...typography.headerH4, color: TEXT_PRIMARY }}>
            Ryan
          </div>
          <div style={{ width: 48, height: 48 }} />
        </div>
      </div>
    </div>
  );
}

// ── Main sim ───────────────────────────────────────────────────

export default function QuizSim() {
  const [quizActive, setQuizActive] = useState(true);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track scroll for top fade gradient
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHasScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, answer: string) => {
      const wasAlreadyAnswered = !!answers[questionId];
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));

      if (wasAlreadyAnswered) return;

      const nextIdx = quizIndex + 1;
      if (nextIdx < GOAL_QUESTIONS.length) {
        setQuizIndex(nextIdx);
      } else {
        setQuizActive(false);
        setMessages((prev) => [
          ...prev,
          { id: `gq-shared-${Date.now()}`, role: "user", text: "Shared my preferences" },
          { id: `gq-done-${Date.now()}`, role: "assistant", text: "Got it — let me put together a plan for you." },
        ]);
      }
    },
    [quizIndex, answers],
  );

  const handleReset = useCallback(() => {
    setQuizActive(true);
    setQuizIndex(0);
    setAnswers({});
    setMessages(INITIAL_MESSAGES);
  }, []);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-white"
      style={{ fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif" }}
    >
      <FloatingAppBar />

      {/* Top fade gradient — visible on scroll */}
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

      {/* Chat messages */}
      <div ref={scrollRef} className="absolute inset-0 w-full overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col px-6">
          <div className="shrink-0" aria-hidden="true" style={{ height: 108 }} />

          {messages.map((msg) => (
            <div key={msg.id} className={`mb-3 ${msg.role === "user" ? "flex justify-end" : ""}`}>
              {msg.role === "user" ? (
                <div
                  className="max-w-[75%] rounded-[16px] rounded-tr-lg"
                  style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
                >
                  <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>{msg.text}</p>
                </div>
              ) : (
                <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>{msg.text}</p>
              )}
            </div>
          ))}

          {/* Spacer for quiz overlay */}
          <div className="shrink-0" aria-hidden="true" style={{ height: 280 }} />
        </div>
      </div>

      {/* Quiz overlay */}
      {quizActive && (
        <div className="absolute bottom-0 left-0 right-0 z-20" style={{ paddingBottom: 56 }}>
          <QuestionnaireOverlay
            questions={GOAL_QUESTIONS}
            currentIndex={quizIndex}
            answers={answers}
            onSelectOption={(qId, opt) => handleAnswer(qId, opt.id)}
            onSubmitFreeText={(qId, text) => handleAnswer(qId, text)}
            onNavigate={(dir) => {
              setQuizIndex((i) =>
                dir === "prev"
                  ? Math.max(0, i - 1)
                  : Math.min(GOAL_QUESTIONS.length - 1, i + 1),
              );
            }}
            onClose={() => setQuizActive(false)}
          />
        </div>
      )}

      {/* Completed state — replay button */}
      {!quizActive && (
        <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center">
          <button
            type="button"
            onClick={handleReset}
            style={{
              ...typography.buttonSmall,
              color: TEXT_TERTIARY,
              background: "transparent",
              border: "none",
              padding: "8px 16px",
            }}
          >
            Replay quiz
          </button>
        </div>
      )}

      {/* Input bar + gesture nav */}
      <div className="absolute bottom-0 left-0 right-0 z-[15]">
        <FooterInset backgroundColor="transparent" paddingX={16} paddingTop={8} minBottomPadding={0}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <div
              className="flex items-center overflow-hidden flex-1"
              style={{ height: 48, backgroundColor: BG_PRIMARY, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: RADIUS_CIRCLE, boxShadow: ELEVATION_CARD }}
            >
              <div className="flex items-center w-full h-full" style={{ backgroundColor: BG_PRIMARY, borderRadius: RADIUS_CIRCLE, paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}>
                <span className="flex-1" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.3)" }}>
                  Reply to Ryan...
                </span>
              </div>
            </div>
          </div>
        </FooterInset>
        <GestureNav />
      </div>
    </div>
  );
}
