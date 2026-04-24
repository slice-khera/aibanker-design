"use client";

import { useState, useCallback, useRef } from "react";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BG_PRIMARY,
  OUTLINE_SUBTLE,
  VALENTINO_50,
  VALENTINO_500,
  GREEN_400,
  RED_500,
} from "../lib/colors";
import { SPACE_S, SPACE_M } from "../lib/spacing";
import { RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";

// ── Types ────────────────────────────────────────────────────────

export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
  correctId: string;
  remarkCorrect: string;
  remarkWrong: string;
};

type QuizCardStackProps = {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
};

// ── Constants ────────────────────────────────────────────────────

const CARD_WIDTH = 312;
const CARD_HEIGHT = 468;
const CARD_RADIUS = 24;
const CARD_PADDING = 24;
const PULSE_DURATION = 600;
const REVEAL_PAUSE = 1600;
const SWIPE_DURATION = 300;

// ── Phases: idle → picked → revealed → swiping ─────────────────
type Phase = "idle" | "picked" | "revealed" | "swiping";

// ── Component ────────────────────────────────────────────────────

export default function QuizCardStack({ questions, onComplete }: QuizCardStackProps) {
  const [index, setIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [remark, setRemark] = useState<string | null>(null);
  const nextIndexRef = useRef(0);
  const isAnimating = useRef(false);

  const swipeToNext = useCallback((nextIdx: number, nextAnswers: Record<string, string>) => {
    nextIndexRef.current = nextIdx;
    setPhase("swiping");


    setTimeout(() => {
      setIndex(nextIdx);
      setPickedId(null);
      setPhase("idle");
      setRemark(null);

      isAnimating.current = false;

      if (nextIdx >= questions.length) {
        onComplete(nextAnswers);
      }
    }, SWIPE_DURATION);
  }, [questions.length, onComplete]);

  const advance = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    swipeToNext(index + 1, answers);
  }, [index, answers, swipeToNext]);

  const handleOptionTap = useCallback((question: Question, option: QuestionOption) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const nextAnswers = { ...answers, [question.id]: option.id };
    setAnswers(nextAnswers);
    setPickedId(option.id);

    // Phase 1: Valentino pulse
    setPhase("picked");

    setTimeout(() => {
      // Phase 2: Reveal correct/wrong
      setPhase("revealed");
      const isCorrect = option.id === question.correctId;
      setRemark(isCorrect ? question.remarkCorrect : question.remarkWrong);

      // Phase 3: Swipe to next
      setTimeout(() => {
        swipeToNext(index + 1, nextAnswers);
      }, REVEAL_PAUSE);
    }, PULSE_DURATION);
  }, [index, answers, swipeToNext]);

  // ── Render helpers ──────────────────────────────────────────────

  function renderIntroContent() {
    return (
      <div className="flex flex-col h-full" style={{ padding: CARD_PADDING }}>
        <div style={{ display: "flex", flexDirection: "column", gap: SPACE_S, flex: 1 }}>
          <h3 style={{ ...typography.headerH2, color: TEXT_PRIMARY, margin: 0 }}>
            Think you know your spending?
          </h3>
          <p style={{ ...typography.bodySmall, color: TEXT_SECONDARY, margin: 0 }}>
            {questions.length} quick guesses — we already know the answers.
          </p>
        </div>
        <button
          type="button"
          onClick={advance}
          style={{
            ...typography.buttonNormal,
            height: 48,
            width: "100%",
            borderRadius: RADIUS_CIRCLE,
            backgroundColor: VALENTINO_500,
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Start
        </button>
      </div>
    );
  }

  function renderQuestionContent(question: Question) {
    return (
      <div className="flex flex-col h-full" style={{ padding: CARD_PADDING }}>
        <h3 style={{ ...typography.headerH3, color: TEXT_PRIMARY, margin: 0 }}>
          {question.text}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "flex-end", paddingTop: SPACE_M }}>
          {question.options.map((option) => {
            const isCorrect = option.id === question.correctId;
            const isPicked = option.id === pickedId;

            let bg = BG_PRIMARY;
            let border = `1px solid ${OUTLINE_SUBTLE}`;
            let color: string = TEXT_PRIMARY;

            if (phase === "picked" && isPicked) {
              bg = VALENTINO_50;
              border = `1px solid ${VALENTINO_500}`;
              color = VALENTINO_500;
            } else if (phase === "revealed") {
              if (isCorrect) {
                bg = `${GREEN_400}20`;
                border = `1px solid ${GREEN_400}`;
                color = GREEN_400;
              } else if (isPicked) {
                bg = `${RED_500}15`;
                border = `1px solid ${RED_500}40`;
                color = RED_500;
              } else {
                bg = "rgba(0,0,0,0.02)";
                border = "1px solid transparent";
                color = "rgba(0,0,0,0.25)";
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionTap(question, option)}
                disabled={phase !== "idle"}
                style={{
                  ...typography.buttonSmall,
                  height: 44,
                  width: "100%",
                  borderRadius: RADIUS_CIRCLE,
                  backgroundColor: bg,
                  color,
                  border,
                  textAlign: "left",
                  paddingLeft: 20,
                  paddingRight: 20,
                  cursor: phase === "idle" ? "pointer" : "default",
                  transition: "all 200ms ease",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderCard(cardIndex: number) {
    if (cardIndex === -1) return renderIntroContent();
    if (cardIndex >= 0 && cardIndex < questions.length) return renderQuestionContent(questions[cardIndex]);
    return null;
  }

  // ── Layout ──────────────────────────────────────────────────────

  const isSwiping = phase === "swiping";

  const cardStyle = {
    position: "absolute" as const,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: BG_PRIMARY,
    borderRadius: CARD_RADIUS,
    border: `1px solid ${OUTLINE_SUBTLE}`,
    boxShadow: ELEVATION_CARD,
    overflow: "hidden" as const,
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full"
      style={{ padding: `0 ${SPACE_M}px`, gap: SPACE_M, overflow: "hidden" }}
    >
      {/* Card container */}
      <div style={{ position: "relative", width: CARD_WIDTH, height: CARD_HEIGHT }}>
        {/* Current card — swipes out left */}
        <div
          style={{
            ...cardStyle,
            transform: isSwiping ? `translateX(-${CARD_WIDTH + 40}px) rotate(-8deg)` : "translateX(0) rotate(0deg)",
            opacity: isSwiping ? 0 : 1,
            transition: isSwiping
              ? `transform ${SWIPE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${SWIPE_DURATION}ms ease`
              : "none",
          }}
        >
          {renderCard(index)}
        </div>

        {/* Next card — enters from right */}
        {isSwiping && (
          <div
            style={{
              ...cardStyle,
              animation: `quizSwipeIn ${SWIPE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            }}
          >
            {renderCard(nextIndexRef.current)}
          </div>
        )}
      </div>

      {/* Remark below card */}
      <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {remark && phase === "revealed" && (
          <p
            style={{
              ...typography.bodySmall,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              textAlign: "center",
              maxWidth: CARD_WIDTH,
            }}
          >
            {remark}
          </p>
        )}
      </div>

      <style>{`
        @keyframes quizSwipeIn {
          from { transform: translateX(${CARD_WIDTH + 40}px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
