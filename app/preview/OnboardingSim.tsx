"use client";

import { useState, useCallback, useEffect } from "react";
import { typography } from "../lib/typography";
import {
  VALENTINO_500, VALENTINO_700,
  TEXT_PRIMARY, TEXT_TERTIARY, TEXT_ON_COLOR_PRIMARY, TEXT_ON_COLOR_SECONDARY,
  GREEN_500, SLATE_30,
  BG_PRIMARY, BG_CARD, OUTLINE_SUBTLE,
  ALPHA_BLACK_05, ALPHA_WHITE_05, ALPHA_WHITE_FF,
} from "../lib/colors";
import { SPACE_2XS, SPACE_XS, SPACE_S, SPACE_M, SPACE_L, SPACE_XL, SPACE_2XL } from "../lib/spacing";
import { RADIUS_M, RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";

import InsightCarousel from "../components/InsightCarousel";
import QuizCardStack from "../components/QuizCardStack";
import { StatusBar, GestureNav } from "../components/AppChrome";
import Chat, { type ChatMessage } from "../components/Chat";
import GoalTracker from "../components/GoalTracker";

import {
  ONBOARDING_PILLS,
  INSIGHT_SLIDES,
  QUIZ_QUESTIONS,
  GAP_ANALYSIS,
  formatGuess,
  RYAN_FEATURES,
  AA_BENEFITS,
  BANKS,
  ONBOARDING_GOAL,
} from "./fixtures/onboardingFixture";

// ── Shared transition config ──────────────────────────────────────

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 460;

// Push-screen order inside the slide-up overlay
const PUSH_SCREENS = ["wrapped", "quiz", "ryan-intro", "aa-value-prop", "aa-bank-select", "aa-success"];

// ── Inline SVG icons ──────────────────────────────────────────────

function WrappedIcon({ size = 16, color = TEXT_ON_COLOR_PRIMARY }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.37348 17.51C10.063 17.51 10.6126 18.07 10.6126 18.75V18.76C10.6126 19.45 10.053 20 9.37348 20H5.57612C2.49826 20 0 17.47 0 14.34V7.58C0.00999304 4.53 2.38834 2.05 5.36627 1.93V1.24C5.36627 0.55 5.91588 0 6.58542 0C7.25495 0 7.80457 0.56 7.80457 1.24V1.92H12.2015V1.24C12.2015 0.55 12.7511 0 13.4207 0C14.0902 0 14.6398 0.56 14.6398 1.24V1.93C17.6177 2.06 19.9861 4.53 19.9861 7.58V9.39C19.9861 10.06 19.4365 10.61 18.7669 10.61C18.0974 10.61 17.5478 10.06 17.5478 9.39V7.58C17.5478 5.89 16.2687 4.53 14.6398 4.41V5.11C14.6398 5.8 14.0902 6.35 13.4207 6.35C12.7511 6.35 12.2015 5.79 12.2015 5.11V4.39H7.79457V5.11C7.79457 5.8 7.24496 6.35 6.57542 6.35C5.90589 6.35 5.35627 5.79 5.35627 5.11V4.41C3.72741 4.53 2.4383 5.9 2.4383 7.58V14.34C2.4383 16.1 3.83733 17.52 5.57612 17.52H9.37348V17.51Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1823 15.1301C10.9325 15.2201 10.9425 15.5501 11.1823 15.6401C13.8205 16.5901 14.8498 18.5401 15.2695 19.8001C15.3594 20.0701 15.7292 20.0701 15.8191 19.8001C16.6985 17.1601 18.7071 16.0101 19.8263 15.5501C20.0661 15.4501 20.0562 15.1101 19.8063 15.0201C17.1082 14.0201 16.1089 11.9401 15.7392 10.6801C15.6592 10.4401 15.3294 10.4501 15.2595 10.6801C14.3601 13.5601 12.3415 14.7001 11.1723 15.1201V15.1401L11.1823 15.1301Z"
        fill={color}
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={ALPHA_WHITE_FF} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ size = 48, color = ALPHA_WHITE_FF }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GraphIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 20h18M5 17V10M9 17V7M13 17V12M17 17V5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <img src="/icons/chevron-left.svg" alt="Back" width={24} height={24} />
  );
}

function PrivacyIcon({ color = GREEN_500 }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Feature row icons for Ryan intro (Stage 5) ───────────────────

const RYAN_ICONS = [
  <ShieldIcon key="shield" color={GREEN_500} />,
  <MessageIcon key="message" color={GREEN_500} />,
  <SparkIcon key="spark" color={GREEN_500} />,
];

// ── AA benefit icons (Stage 6) ───────────────────────────────────

const AA_ICONS = [
  <GraphIcon key="graph" color={TEXT_TERTIARY} />,
  <SparkIcon key="spark" color={TEXT_TERTIARY} />,
  <ShieldIcon key="shield" color={TEXT_TERTIARY} />,
];

// ── Purple FAB ────────────────────────────────────────────────────

function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center transition-transform active:scale-[0.95]"
      style={{
        width: 56,
        height: 56,
        borderRadius: RADIUS_CIRCLE,
        backgroundColor: VALENTINO_500,
        border: "none",
        cursor: "pointer",
        boxShadow: "none",
      }}
    >
      <ArrowRightIcon />
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

export default function OnboardingSim() {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  // Slide-up overlay (contains all push screens)
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);

  // Which push screen is active inside the overlay (index into PUSH_SCREENS)
  const [pushIndex, setPushIndex] = useState(0);

  // Chat overlay
  const [chatPhase, setChatPhase] = useState<"closed" | "entering" | "open">("closed");

  // ── Navigation ───────────────────────────────────────────────

  const goToWrapped = useCallback(() => {
    setPushIndex(0);
    setOverlayMounted(true);
    setOverlayOpen(true);
  }, []);

  const goToQuiz = useCallback(() => setPushIndex(1), []);
  const goToRyanIntro = useCallback(() => setPushIndex(2), []);
  const goBack = useCallback(() => setPushIndex((i) => Math.max(0, i - 1)), []);

  const dismissOverlay = useCallback(() => {
    setOverlayOpen(false);
    setTimeout(() => {
      setOverlayMounted(false);
      setPushIndex(0);
    }, DURATION);
  }, []);

  const goToChat = useCallback(() => {
    setChatPhase("entering");
    requestAnimationFrame(() => requestAnimationFrame(() => setChatPhase("open")));
  }, []);

  // AA success auto-advance to chat
  useEffect(() => {
    if (PUSH_SCREENS[pushIndex] === "aa-success") {
      const timer = setTimeout(goToChat, 1500);
      return () => clearTimeout(timer);
    }
  }, [pushIndex, goToChat]);

  // ═════════════════════════════════════════════════════════════
  //  STAGE RENDERERS
  // ═════════════════════════════════════════════════════════════

  // ── Stage 1: App Entry ──────────────────────────────────────

  function renderAppEntry() {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="/pay-screen.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Pills row */}
        <div style={{ position: "absolute", top: "17%", left: 0, right: 0 }}>
          <div
            className="flex items-center gap-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ paddingLeft: SPACE_M, paddingRight: SPACE_M }}
          >
            {ONBOARDING_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={pill.id === "wrapped" ? goToWrapped : undefined}
                className="flex items-center shrink-0 transition-transform active:scale-[0.97]"
                style={{
                  gap: 4,
                  backgroundColor: VALENTINO_500,
                  border: `1.5px solid ${ALPHA_WHITE_05}`,
                  borderRadius: 32,
                  padding: "10px 16px",
                }}
              >
                {pill.id === "wrapped" ? (
                  <WrappedIcon size={16} />
                ) : (
                  <img src={pill.icon} alt="" style={{ width: 16, height: 16 }} />
                )}
                <span
                  style={{
                    ...typography.caption,
                    color: TEXT_ON_COLOR_PRIMARY,
                    whiteSpace: "nowrap",
                  }}
                >
                  {pill.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ── Stage 2: Insight Stories (Oura-style) ────────────────────

  function renderWrapped() {
    return (
      <div className="h-full w-full">
        <InsightCarousel slides={INSIGHT_SLIDES} onComplete={goToQuiz} onClose={dismissOverlay} onSkip={goToQuiz} />
      </div>
    );
  }

  // ── Stage 3: Reality Check Quiz ─────────────────────────────

  function renderQuiz() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        {/* Status bar */}
        <StatusBar backgroundColor="transparent" />

        {/* App bar — Standard L1+, 64px */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={dismissOverlay}
            className="flex items-center justify-center shrink-0"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="flex-1" />
          <button
            type="button"
            onClick={goToRyanIntro}
            style={{
              ...typography.buttonSmall,
              color: VALENTINO_500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: `${SPACE_XS}px ${SPACE_M}px`,
            }}
          >
            Skip
          </button>
        </div>

        {/* Quiz content */}
        <div className="flex-1">
          <QuizCardStack
            questions={QUIZ_QUESTIONS}
            onComplete={(answers) => {
              setQuizAnswers(answers);
              goToRyanIntro();
            }}
          />
        </div>

        {/* Gesture nav */}
        <GestureNav />
      </div>
    );
  }

  // ── Stage 4: Gap Analysis ───────────────────────────────────

  function renderGapAnalysis() {
    const savingsGuess = formatGuess("savings-pct", quizAnswers["savings-pct"] ?? "no-idea");
    const categoryGuess = formatGuess("top-category", quizAnswers["top-category"] ?? "food");
    const shareGuess = formatGuess("category-share", quizAnswers["category-share"] ?? "no-idea");
    const personaGuess = formatGuess("persona", quizAnswers["persona"] ?? "complicated");

    return (
      <div
        className="h-full w-full flex flex-col"
        style={{
          background: `linear-gradient(150deg, ${VALENTINO_700} 0%, ${VALENTINO_500} 100%)`,
          padding: `${SPACE_XL}px ${SPACE_L}px`,
        }}
      >
        {/* Header */}
        <div style={{ marginTop: 80 }}>
          <p style={{ ...typography.headerH2, color: ALPHA_WHITE_FF }}>
            Here's how you did
          </p>
        </div>

        {/* Comparison rows */}
        <div style={{ marginTop: SPACE_XL, display: "flex", flexDirection: "column", gap: SPACE_L }}>
          {/* Savings */}
          <div>
            <p style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_SECONDARY }}>
              Savings rate
            </p>
            <p style={{ ...typography.headerH3, color: ALPHA_WHITE_FF, marginTop: 4 }}>
              You guessed {savingsGuess} → actual ~{GAP_ANALYSIS.actualSavingsPct}%
            </p>
          </div>

          {/* Category */}
          <div>
            <p style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_SECONDARY }}>
              Top category
            </p>
            <p style={{ ...typography.headerH3, color: ALPHA_WHITE_FF, marginTop: 4 }}>
              You guessed {categoryGuess} at {shareGuess} → actual {GAP_ANALYSIS.actualTopCategory} at {GAP_ANALYSIS.actualCategoryShare}%
            </p>
          </div>

          {/* Persona */}
          <div>
            <p style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_SECONDARY }}>
              Persona
            </p>
            <p style={{ ...typography.headerH3, color: ALPHA_WHITE_FF, marginTop: 4 }}>
              You said "{personaGuess}" → reality: "{GAP_ANALYSIS.actualPersona}"
            </p>
          </div>
        </div>

        {/* Closing */}
        <div style={{ marginTop: SPACE_XL }}>
          <p style={{ ...typography.bodyNormal, color: TEXT_ON_COLOR_SECONDARY }}>
            Good news: you're not bad with money — your money just has habits.
          </p>
        </div>

        {/* Spacer + FAB */}
        <div className="flex-1" />
        <div className="flex justify-end" style={{ paddingBottom: SPACE_L }}>
          <Fab onClick={goToRyanIntro} />
        </div>
      </div>
    );
  }

  // ── Stage 5: Ryan Introduction ──────────────────────────────

  function renderRyanIntro() {
    return (
      <div
        className="h-full w-full relative"
        style={{ backgroundColor: BG_PRIMARY, overflow: "clip" }}
      >
        {/* App bar — absolute top, 108px */}
        <div className="absolute top-0 left-0 w-full" style={{ zIndex: 1 }}>
          <StatusBar backgroundColor="transparent" />
          <div
            className="flex items-center"
            style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
          >
            <button
              type="button"
              onClick={goBack}
              className="flex items-center justify-center"
              style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
            >
              <BackIcon />
            </button>
          </div>
        </div>

        {/* Content — starts at 108px, gap 24px, px 32px */}
        <div
          className="absolute flex flex-col"
          style={{ top: 108, left: 0, width: "100%", padding: `0 ${SPACE_XL}px`, gap: SPACE_L }}
        >
          {/* Illustration — right-aligned, 128px */}
          <div className="flex justify-end">
            <div style={{ width: 128, height: 128 }}>
              <img
                src="/characters/ryan.svg"
                alt="Ryan"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Feature highlight badge */}
          <div className="flex items-center" style={{ gap: SPACE_2XS }}>
            <PrivacyIcon />
            <span style={{ ...typography.buttonSmall, color: GREEN_500, letterSpacing: "0.28px" }}>
              Your money, understood
            </span>
          </div>

          {/* Product name + subtitle — gap 8px */}
          <div style={{ display: "flex", flexDirection: "column", gap: SPACE_XS }}>
            <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: 0 }}>
              Ryan
            </h1>
            <p style={{ ...typography.bodyNormal, color: TEXT_TERTIARY, margin: 0 }}>
              Rooting for you. Always honest. Never preachy.
            </p>
          </div>

          {/* Feature rows — gap 12px icon↔text, 0px title↔subtitle */}
          {RYAN_FEATURES.map((feature, i) => (
            <div key={feature.title} className="flex items-start" style={{ gap: SPACE_S }}>
              <div className="shrink-0" style={{ width: 24, height: 24 }}>
                {RYAN_ICONS[i]}
              </div>
              <div>
                <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>{feature.title}</p>
                <p style={{ ...typography.bodySmall, color: TEXT_TERTIARY, margin: 0 }}>{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAB + Gesture nav — absolute bottom */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-stretch">
          <div className="flex justify-end" style={{ padding: `0 ${SPACE_XL}px ${SPACE_L}px` }}>
            <Fab onClick={() => setPushIndex(3)} />
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  // ── Stage 6: AA Consent ─────────────────────────────────────

  function renderAAValueProp() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        {/* Status bar */}
        <StatusBar backgroundColor="transparent" />

        {/* App bar — 64px */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <BackIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1" style={{ padding: `0 ${SPACE_L}px` }}>
          <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, marginTop: SPACE_M }}>
            Connect your accounts
          </h1>

          <div style={{ marginTop: SPACE_2XL, display: "flex", flexDirection: "column", gap: SPACE_L }}>
            {AA_BENEFITS.map((benefit, i) => (
              <div key={benefit.title} className="flex items-start" style={{ gap: SPACE_S }}>
                <div className="shrink-0" style={{ width: 24, height: 24 }}>
                  {AA_ICONS[i]}
                </div>
                <div>
                  <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>{benefit.title}</p>
                  <p style={{ ...typography.bodySmall, color: TEXT_TERTIARY, margin: 0 }}>
                    {benefit.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            style={{
              ...typography.bodySmall,
              color: VALENTINO_500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginTop: SPACE_M,
              marginLeft: SPACE_XL + SPACE_S,
            }}
          >
            Learn more
          </button>
        </div>

        {/* FAB + Gesture nav */}
        <div className="shrink-0">
          <div className="flex justify-end" style={{ padding: `0 ${SPACE_XL}px ${SPACE_L}px` }}>
            <Fab onClick={() => setPushIndex(4)} />
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  function renderAABankSelect() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        {/* Status bar */}
        <StatusBar backgroundColor="transparent" />

        {/* App bar — 64px */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <BackIcon />
          </button>
        </div>

        {/* Header */}
        <div style={{ padding: `0 ${SPACE_L}px` }}>
          <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, marginTop: SPACE_M }}>
            Select your salary account
          </h1>
        </div>

        {/* Bank grid */}
        <div
          className="flex-1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: SPACE_L,
            padding: `${SPACE_XL}px ${SPACE_L}px`,
            alignContent: "start",
          }}
        >
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => setPushIndex(5)}
              className="flex flex-col items-center justify-center transition-transform active:scale-[0.97]"
              style={{
                height: 134,
                borderRadius: RADIUS_M,
                backgroundColor: BG_CARD,
                boxShadow: ELEVATION_CARD,
                border: `1px solid ${ALPHA_BLACK_05}`,
                cursor: "pointer",
                gap: SPACE_S,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: RADIUS_CIRCLE,
                  backgroundColor: bank.id === "other" ? SLATE_30 : `${bank.color}10`,
                  border: `1px solid ${OUTLINE_SUBTLE}`,
                }}
              >
                <span style={{ ...typography.headerH3, color: bank.color }}>
                  {bank.initial}
                </span>
              </div>
              <span style={{ ...typography.bodySmall, color: TEXT_PRIMARY, textAlign: "center" }}>
                {bank.label}
              </span>
            </button>
          ))}
        </div>

        {/* Gesture nav */}
        <GestureNav />
      </div>
    );
  }

  function renderAASuccess() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        {/* Status bar */}
        <StatusBar backgroundColor="transparent" />

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: RADIUS_CIRCLE,
              backgroundColor: GREEN_500,
              animation: "successPop 400ms ease-out",
            }}
          >
            <CheckIcon size={40} color={ALPHA_WHITE_FF} />
          </div>

          <p style={{ ...typography.headerH3, color: TEXT_PRIMARY, marginTop: SPACE_L }}>
            Account linked!
          </p>
          <p style={{ ...typography.bodySmall, color: TEXT_TERTIARY, marginTop: SPACE_XS }}>
            Setting things up for you...
          </p>
        </div>

        {/* Gesture nav */}
        <GestureNav />
      </div>
    );
  }

  // ── Stage 7: Chat ───────────────────────────────────────────

  const INITIAL_MESSAGES: ChatMessage[] = [
    {
      id: "ryan-1",
      role: "assistant",
      text: "Hey! I\u2019m Ryan \u2014 your AI banker. I\u2019ve been looking at your numbers and I think we can do something interesting together.\n\nLet\u2019s start with a goal. What are you building toward?",
    },
  ];

  function renderChat() {
    return (
      <Chat
        title="slice"
        isSheetMinimized={false}
        sheetTransitionProgress={0}
        subtitle=""
        messages={INITIAL_MESSAGES}
        chips={[
          { id: "trip", label: "Trip" },
          { id: "emergency", label: "Emergency fund" },
          { id: "big-purchase", label: "Big purchase" },
          { id: "increase-savings", label: "Increase savings" },
        ]}
        onChipSelect={() => {}}
        showInitialPrompt={false}
        initialSuggestions={[]}
        onInitialSuggestionClick={() => {}}
        showInput={true}
        inputPlaceholder="Ask Ryan..."
        onSubmit={() => {}}
        showTyping={false}
        thinkingLabel=""
        drawerContent={null}
        pinnedContent={null}
        headerActions={[]}
        onSheetClose={() => {}}
        onSheetExpand={() => {}}
        appBarDragHandleProps={{}}
        goalTrailingSlot={
          <GoalTracker
            goals={[ONBOARDING_GOAL]}
            onGoalTap={() => {}}
          />
        }
        showFeedbackRow={true}
      />
    );
  }

  // ═════════════════════════════════════════════════════════════
  //  PUSH SCREEN ROUTER
  // ═════════════════════════════════════════════════════════════

  function renderScreen(screen: string) {
    switch (screen) {
      case "wrapped": return renderWrapped();
      case "quiz": return renderQuiz();
      case "ryan-intro": return renderRyanIntro();
      case "aa-value-prop": return renderAAValueProp();
      case "aa-bank-select": return renderAABankSelect();
      case "aa-success": return renderAASuccess();
      default: return null;
    }
  }

  // ═════════════════════════════════════════════════════════════
  //  RENDER
  // ═════════════════════════════════════════════════════════════

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif" }}
    >
      {/* Layer 0: App entry (always rendered as base) */}
      {renderAppEntry()}

      {/* Layer 1: Push overlay — slides up, screens push left/right inside */}
      <div
        className="absolute inset-0 z-20"
        style={{
          transform: overlayOpen ? "translateY(0%)" : "translateY(100%)",
          transition: `transform ${DURATION}ms ${EASE}`,
          overflow: "hidden",
        }}
      >
        {PUSH_SCREENS.map((screen, i) => (
          <div
            key={screen}
            className="absolute inset-0"
            style={{
              transform: `translateX(${(i - pushIndex) * 100}%)`,
              transition: `transform ${DURATION}ms ${EASE}`,
            }}
          >
            {overlayMounted && Math.abs(i - pushIndex) <= 1 && renderScreen(screen)}
          </div>
        ))}
      </div>

      {/* Layer 2: Chat overlay — slides up */}
      {chatPhase !== "closed" && (
        <div
          className="absolute inset-0 z-40"
          style={{
            backgroundColor: BG_PRIMARY,
            transform: chatPhase === "open" ? "translateY(0%)" : "translateY(100%)",
            transition: `transform ${DURATION}ms ${EASE}`,
            willChange: "transform",
          }}
        >
          {renderChat()}
        </div>
      )}
    </div>
  );
}
