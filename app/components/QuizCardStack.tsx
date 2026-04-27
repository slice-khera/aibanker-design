"use client";

import { useState, useCallback, useRef } from "react";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_DISABLED,
  OUTLINE_BOLD,
  VALENTINO_500,
  GREEN_400,
  RED_500,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
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
const CARD_HEIGHT = 560;
const CARD_RADIUS = 24;
const CARD_PADDING = "32px 24px";
const PULSE_DURATION = 600;
const REVEAL_PAUSE = 1600;

// Swipe physics
const SWIPE_THRESHOLD = 80;           // px drag to commit
const FLING_VELOCITY_THRESHOLD = 0.4; // px/ms to auto-commit
const FLING_DISTANCE = 500;           // px off-screen
const ROTATION_FACTOR = 0.12;         // deg per px of drag
const SPRING_DURATION = 350;          // ms for fling-out
const SNAP_DURATION = 250;            // ms for snap-back

// Deck depth offsets (negative Y = peek above)
const DECK_SCALE_STEP = 0.04;
const DECK_Y_STEP = -8;
const VISIBLE_BEHIND = 2;

// Fixed color per card index (-1 = intro, 0–3 = questions)
const CARD_COLORS = [
  "#FFFFFF",  // intro
  "#E6EDF9",  // Q1 — Blue/50
  "#FAE2FA",  // Q2 — Valentino/50
  "#FFF3E3",  // Q3 — Orange/50
  "#E0F4E8",  // Q4 — Green/50
];

// ── Phases: idle → picked → revealed → swiping ─────────────────
type Phase = "idle" | "picked" | "revealed" | "swiping";

// ── Component ────────────────────────────────────────────────────

export default function QuizCardStack({ questions, onComplete }: QuizCardStackProps) {
  // index = -1 is the intro card, 0..N-1 are questions
  const [index, setIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [remark, setRemark] = useState<string | null>(null);
  const isAnimating = useRef(false);

  // ── Drag state (refs to avoid re-renders during drag) ──────────
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startTime: 0 });
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Fling animation state
  const [fling, setFling] = useState<{ x: number; rotate: number } | null>(null);
  // Brief settling period after state update so promoted card transitions smoothly
  const [settling, setSettling] = useState(false);

  // Total card count including intro
  const totalCards = questions.length + 1; // intro + questions

  // ── Advance to next card via fling ─────────────────────────────

  const flingOut = useCallback((direction: 1 | -1, nextIdx: number, nextAnswers: Record<string, string>) => {
    const targetX = direction * FLING_DISTANCE;
    const targetRotate = direction * FLING_DISTANCE * ROTATION_FACTOR;
    setFling({ x: targetX, rotate: targetRotate });
    setPhase("swiping");

    setTimeout(() => {
      setSettling(true);
      setFling(null);
      setDragX(0);
      setIndex(nextIdx);
      setPickedId(null);
      setPhase("idle");
      setRemark(null);

      if (nextIdx >= questions.length) {
        onComplete(nextAnswers);
      }

      // Let the settle transition play, then unlock
      setTimeout(() => {
        setSettling(false);
        isAnimating.current = false;
      }, SNAP_DURATION);
    }, SPRING_DURATION);
  }, [questions.length, onComplete]);

  // ── Advance (intro → first question) ──────────────────────────

  const advance = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    flingOut(1, index + 1, answers);
  }, [index, answers, flingOut]);

  // ── Option tap handler ─────────────────────────────────────────

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

      // Phase 3: Fling out after pause
      setTimeout(() => {
        flingOut(1, index + 1, nextAnswers);
      }, REVEAL_PAUSE);
    }, PULSE_DURATION);
  }, [index, answers, flingOut]);

  // ── Pointer handlers for drag ──────────────────────────────────

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== "idle" || isAnimating.current) return;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startTime: Date.now() };
    setIsDragging(true);
    setDragX(0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [phase]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    setDragX(dx);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dt = Date.now() - dragRef.current.startTime;
    const velocity = Math.abs(dx) / dt;
    dragRef.current.active = false;
    setIsDragging(false);

    const committed = Math.abs(dx) > SWIPE_THRESHOLD || velocity > FLING_VELOCITY_THRESHOLD;
    if (committed && index === -1) {
      // Intro card: swipe in drag direction
      isAnimating.current = true;
      flingOut(dx > 0 ? 1 : -1, index + 1, answers);
    } else {
      // Snap back
      setDragX(0);
    }
  }, [index, answers, flingOut]);

  // ── Render helpers ──────────────────────────────────────────────

  function renderIntroContent() {
    return (
      <div className="flex flex-col h-full" style={{ padding: CARD_PADDING, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: SPACE_S }}>
          <h3 style={{ ...typography.headerH2, color: TEXT_PRIMARY, margin: 0 }}>
            Think you know how your money moves? Time for a reality check!
          </h3>
          <p style={{ ...typography.bodySmall, color: TEXT_SECONDARY, margin: 0 }}>
            {questions.length} quick guesses — we already know the answers.
          </p>
        </div>
        <button
          type="button"
          onClick={advance}
          className="flex items-center justify-center"
          style={{
            position: "absolute",
            bottom: SPACE_L + 8,
            right: SPACE_L,
            width: 48,
            height: 48,
            borderRadius: RADIUS_CIRCLE,
            backgroundColor: VALENTINO_500,
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke={ALPHA_WHITE_FF} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  }

  function renderQuestionContent(question: Question) {
    return (
      <div className="flex flex-col h-full" style={{ padding: CARD_PADDING }}>
        <h3 style={{ ...typography.headerH2, color: TEXT_PRIMARY, margin: 0 }}>
          {question.text}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: SPACE_S, flex: 1, justifyContent: "flex-end", paddingTop: SPACE_M }}>
          {question.options.map((option) => {
            const isCorrect = option.id === question.correctId;
            const isPicked = option.id === pickedId;

            let bg = "#FFFFFF";
            let border = "1px solid transparent";
            let color: string = TEXT_PRIMARY;

            if (phase === "picked" && isPicked) {
              bg = "#FAE2FA";
              color = VALENTINO_500;
            } else if (phase === "revealed") {
              if (isCorrect) {
                bg = "#E0F4E8";
                color = GREEN_400;
              } else if (isPicked) {
                bg = "#F9E4E5";
                color = RED_500;
              } else {
                bg = "transparent";
                color = TEXT_DISABLED;
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionTap(question, option)}
                disabled={phase !== "idle"}
                style={{
                  ...typography.bodyNormal,
                  height: 48,
                  width: "100%",
                  borderRadius: RADIUS_CIRCLE,
                  backgroundColor: bg,
                  color,
                  border,
                  textAlign: "left",
                  paddingLeft: SPACE_L,
                  paddingRight: SPACE_L,
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

  function getCardContent(cardIndex: number) {
    if (cardIndex === -1) return renderIntroContent();
    if (cardIndex >= 0 && cardIndex < questions.length) return renderQuestionContent(questions[cardIndex]);
    return null;
  }

  // ── Build visible card stack ───────────────────────────────────

  // Cards to render: current + up to VISIBLE_BEHIND behind it
  const cards: number[] = [];
  for (let i = Math.min(index + VISIBLE_BEHIND, questions.length - 1); i >= index; i--) {
    if (i >= -1) cards.push(i);
  }

  // Current card transform
  const currentX = fling ? fling.x : dragX;
  const currentRotate = fling ? fling.rotate : dragX * ROTATION_FACTOR;
  const settleTransition = `transform ${SNAP_DURATION}ms cubic-bezier(0.2, 0, 0, 1), opacity ${SNAP_DURATION}ms ease, background-color ${SNAP_DURATION}ms ease`;
  const currentTransition = fling
    ? `transform ${SPRING_DURATION}ms cubic-bezier(0.2, 0, 0, 1), opacity ${SPRING_DURATION}ms ease`
    : settling
      ? settleTransition
      : isDragging
        ? "none"
        : `transform ${SNAP_DURATION}ms cubic-bezier(0.2, 0, 0, 1)`;

  // How far through the swipe (0→1) for deck animation
  const swipeProgress = Math.min(Math.abs(currentX) / SWIPE_THRESHOLD, 1);

  return (
    <div
      className="flex flex-col items-center h-full w-full"
      style={{ padding: `${SPACE_M}px ${SPACE_M}px 0`, overflow: "visible", justifyContent: "flex-start" }}
    >
      {/* Card stack */}
      <div style={{ position: "relative", width: CARD_WIDTH, height: CARD_HEIGHT, flexShrink: 0 }}>
        {cards.map((cardIdx) => {
          const depth = cardIdx - index; // 0 = top, 1 = behind, 2 = further back
          const isTop = depth === 0;

          // Deck cards scale up as top card is dragged away
          const baseScale = 1 - depth * DECK_SCALE_STEP;
          const targetScale = 1 - (depth - 1) * DECK_SCALE_STEP;
          const scale = isTop ? 1 : baseScale + (targetScale - baseScale) * swipeProgress;

          const baseY = depth * DECK_Y_STEP;
          const targetY = (depth - 1) * DECK_Y_STEP;
          const y = isTop ? 0 : baseY + (targetY - baseY) * swipeProgress;

          const opacity = isTop
            ? (fling ? 0 : 1)
            : depth <= VISIBLE_BEHIND ? 1 : 0;

          const zIndex = totalCards - depth;

          const transform = isTop
            ? `translateX(${currentX}px) rotate(${currentRotate}deg)`
            : `translateY(${y}px) scale(${scale})`;

          const transition = isTop
            ? currentTransition
            : settling
              ? settleTransition
              : isDragging ? "transform 50ms ease-out" : `transform ${SNAP_DURATION}ms cubic-bezier(0.2, 0, 0, 1)`;

          const cardBg = CARD_COLORS[cardIdx + 1] ?? CARD_COLORS[CARD_COLORS.length - 1];

          return (
            <div
              key={cardIdx}
              style={{
                position: "absolute",
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: cardBg,
                borderRadius: CARD_RADIUS,
                border: `1px solid ${OUTLINE_BOLD}`,
                boxShadow: ELEVATION_CARD,
                overflow: "hidden",
                transform,
                opacity,
                transition,
                zIndex,
                transformOrigin: "center top",
                touchAction: "none",
              }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
            >
              {getCardContent(cardIdx)}
            </div>
          );
        })}
      </div>

      {/* Remark below card */}
      <div style={{ flex: 1, marginTop: SPACE_L, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        {remark && phase === "revealed" && (
          <p
            style={{
              ...typography.buttonNormal,
              fontWeight: 400,
              color: TEXT_SECONDARY,
              margin: 0,
              textAlign: "center",
              maxWidth: CARD_WIDTH,
            }}
          >
            {remark}
          </p>
        )}
      </div>
    </div>
  );
}
