"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_TERTIARY,
  TEXT_SECONDARY,
  BG_PRIMARY,
  ALPHA_BLACK_05,
  ALPHA_BLACK_10,
  OUTLINE_SUBTLE,
  VALENTINO_500,
  ALPHA_WHITE_FF,
  SLATE_10,
  SLATE_50,
} from "../lib/colors";
import { ELEVATION_CARD } from "../lib/elevation";
import {
  SPACE_XS,
  SPACE_S,
  SPACE_M,
  SPACE_L,
  SPACE_XL,
  SPACE_2XL,
} from "../lib/spacing";
import { RADIUS_PILL, RADIUS_CIRCLE } from "../lib/radii";
import { StatusBar, GestureNav } from "../components/AppChrome";
import { WRAPPED_BEATS, type WrappedBeat, type GuessChip } from "./fixtures/onboardingV2Fixture";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 420;

const HERO_FONT = "var(--font-bricolage), var(--font-rubik), system-ui, sans-serif";

// ── Build the flat list of screens from beats ───────────────────

type Screen =
  | { kind: "guess-q"; beatIndex: number; beat: Extract<WrappedBeat, { kind: "guess" }> }
  | { kind: "guess-r"; beatIndex: number; beat: Extract<WrappedBeat, { kind: "guess" }> }
  | { kind: "observation"; beatIndex: number; beat: Extract<WrappedBeat, { kind: "observation" }> }
  | { kind: "reveal"; beatIndex: number; beat: Extract<WrappedBeat, { kind: "reveal" }>; isClose: true };

function buildScreens(beats: WrappedBeat[]): Screen[] {
  const screens: Screen[] = [];
  beats.forEach((beat, beatIndex) => {
    if (beat.kind === "guess") {
      screens.push({ kind: "guess-q", beatIndex, beat });
      screens.push({ kind: "guess-r", beatIndex, beat });
    } else if (beat.kind === "observation") {
      screens.push({ kind: "observation", beatIndex, beat });
    } else if (beat.kind === "reveal") {
      screens.push({ kind: "reveal", beatIndex, beat, isClose: true });
    }
  });
  return screens;
}

// ── Icons ──────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V4M12 4L7 9M12 4l5 5M5 16v3a2 2 0 002 2h10a2 2 0 002-2v-3"
        stroke={TEXT_PRIMARY}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={ALPHA_WHITE_FF}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Round buttons ──────────────────────────────────────────────

function RoundButton({
  onClick,
  filled = false,
  children,
  ariaLabel,
}: {
  onClick?: () => void;
  filled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center transition-transform active:scale-[0.95]${filled ? "" : " bg-white"}`}
      style={{
        width: 48,
        height: 48,
        borderRadius: RADIUS_CIRCLE,
        backgroundColor: filled ? VALENTINO_500 : undefined,
        border: filled ? "none" : `1px solid ${OUTLINE_SUBTLE}`,
        boxShadow: ELEVATION_CARD,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

// ── Countdown timer (question screens) ─────────────────────────

const COUNTDOWN_DURATION = 8; // seconds

function CountdownTimer({ duration, onExpire, resetKey }: { duration: number; onExpire: () => void; resetKey: number }) {
  const [remaining, setRemaining] = useState(duration);
  const onExpireRef = useRef(onExpire);
  const firedRef = useRef(false);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(duration);
    firedRef.current = false;
    // Delay start so timer doesn't tick during the screen transition
    const startDelay = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (!firedRef.current) {
              firedRef.current = true;
              window.setTimeout(() => onExpireRef.current(), 150);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      // Store interval id for cleanup
      cleanupRef.current = () => clearInterval(interval);
    }, 600);
    const cleanupRef = { current: () => {} };
    return () => {
      clearTimeout(startDelay);
      cleanupRef.current();
    };
  }, [duration, resetKey]);

  // Ring dimensions — matches GoalTracker ProgressRing pattern
  const ringSize = 32;
  const sw = 3.5;
  const center = ringSize / 2;
  const radius = (ringSize - sw) / 2 - 1;
  const circumference = 2 * Math.PI * radius;
  const pct = (remaining / duration) * 100;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: 48,
        height: 48,
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0px 2px 32px 0px rgba(0,0,0,0.05)",
      }}
    >
      <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={VALENTINO_500}
          strokeWidth={sw}
          opacity={0.15}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={VALENTINO_500}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
        {/* Seconds label */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "var(--font-rubik), sans-serif",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: `${12 * 0.02}px`,
            fill: TEXT_PRIMARY,
          }}
        >
          {remaining}
        </text>
      </svg>
    </div>
  );
}

// ── Progress dots (top, beat-level) ────────────────────────────

function ProgressDots({ total, currentBeat }: { total: number; currentBeat: number }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === currentBeat;
        const past = i < currentBeat;
        return (
          <div
            key={i}
            style={{
              width: active ? 24 : 8,
              height: 4,
              borderRadius: 2,
              backgroundColor: active || past ? TEXT_PRIMARY : ALPHA_BLACK_10,
              transition: `all ${DURATION}ms ${EASE}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Hero typography helper ─────────────────────────────────────

function HeroText({
  children,
  size = 56,
  weight = 500,
}: {
  children: React.ReactNode;
  size?: number;
  weight?: 400 | 500 | 600 | 700;
}) {
  return (
    <p
      style={{
        fontFamily: HERO_FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        color: TEXT_PRIMARY,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

// ── Chip (for guesses) ─────────────────────────────────────────

function GuessChipButton({
  chip,
  selected,
  onSelect,
}: {
  chip: GuessChip;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full transition-transform active:scale-[0.99]"
      style={{
        ...typography.bodyNormal,
        color: selected ? ALPHA_WHITE_FF : TEXT_PRIMARY,
        backgroundColor: selected ? VALENTINO_500 : SLATE_10,
        border: `1px solid ${selected ? VALENTINO_500 : ALPHA_BLACK_05}`,
        borderRadius: RADIUS_PILL,
        padding: `14px ${SPACE_L}px`,
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>{chip.label}</span>
      {selected && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke={ALPHA_WHITE_FF} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ── Screen renderers ───────────────────────────────────────────

function GuessQuestionScreen({
  beat,
  onAnswer,
}: {
  beat: Extract<WrappedBeat, { kind: "guess" }>;
  onAnswer: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    // brief delay so selection state is visible before advancing
    window.setTimeout(onAnswer, 320);
  };

  // size hero based on length
  const size = beat.question.length > 70 ? 36 : beat.question.length > 50 ? 40 : 44;

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ backgroundColor: BG_PRIMARY, padding: `${SPACE_L}px ${SPACE_L}px ${SPACE_M}px` }}
    >
      <div className="flex-1 flex flex-col justify-center" style={{ marginTop: SPACE_2XL }}>
        <HeroText size={size} weight={500}>
          {beat.question}
        </HeroText>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE_S, paddingBottom: SPACE_L }}>
        {beat.chips.map((chip) => (
          <GuessChipButton
            key={chip.id}
            chip={chip}
            selected={selected === chip.id}
            onSelect={() => handleSelect(chip.id)}
          />
        ))}
      </div>
    </div>
  );
}

function HeroBeatScreen({
  hero,
  subline,
  ryan,
  heroSize = 64,
  cta,
}: {
  hero: string;
  subline: string;
  ryan: string;
  heroSize?: number;
  cta?: { label: string; onClick: () => void };
}) {
  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ backgroundColor: BG_PRIMARY, padding: `${SPACE_L}px ${SPACE_L}px ${SPACE_M}px` }}
    >
      <div className="flex-1 flex flex-col justify-center" style={{ gap: SPACE_M, marginTop: SPACE_XL }}>
        <HeroText size={heroSize} weight={500}>
          {hero}
        </HeroText>
        <p style={{ ...typography.bodyLarge, color: TEXT_SECONDARY, margin: 0 }}>{subline}</p>
        <p
          style={{
            ...typography.bodyNormal,
            color: TEXT_TERTIARY,
            margin: 0,
            marginTop: SPACE_XS,
            fontStyle: "italic",
          }}
        >
          “{ryan}”
        </p>
      </div>
      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="w-full transition-transform active:scale-[0.98]"
          style={{
            ...typography.buttonNormal,
            color: ALPHA_WHITE_FF,
            backgroundColor: VALENTINO_500,
            border: "none",
            borderRadius: RADIUS_PILL,
            padding: `${SPACE_M}px ${SPACE_L}px`,
            cursor: "pointer",
            marginBottom: SPACE_S,
          }}
        >
          {cta.label} →
        </button>
      )}
    </div>
  );
}

// ── Main story component ───────────────────────────────────────

export default function V2WrappedStory({ onClose }: { onClose: () => void }) {
  const screens = useMemo(() => buildScreens(WRAPPED_BEATS), []);
  const totalBeats = WRAPPED_BEATS.length;

  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((i) => Math.min(i + 1, screens.length - 1));
  }, [screens.length]);

  const currentScreen = screens[index];
  const isClose = currentScreen?.kind === "reveal";
  const isQuestion = currentScreen?.kind === "guess-q";

  return (
    <div className="relative h-full w-full" style={{ backgroundColor: BG_PRIMARY, overflow: "hidden" }}>
      {/* Top chrome — status bar + progress + close */}
      <div className="absolute top-0 left-0 w-full" style={{ zIndex: 2 }}>
        <StatusBar backgroundColor="transparent" />
        <div
          className="relative flex items-center"
          style={{ padding: "8px 12px 8px 8px", height: 64 }}
        >
          {/* Close button — left-aligned */}
          <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", zIndex: 1 }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex items-center justify-center rounded-full bg-white"
              style={{
                width: 48,
                height: 48,
                borderRadius: RADIUS_CIRCLE,
                border: `1px solid ${OUTLINE_SUBTLE}`,
                boxShadow: ELEVATION_CARD,
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </button>
          </div>
          {/* Progress dots — absolutely centered */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: "none" }}>
            <ProgressDots total={totalBeats} currentBeat={currentScreen?.beatIndex ?? 0} />
          </div>
          {/* Countdown timer — top right on question screens */}
          {isQuestion && (
            <div style={{ marginLeft: "auto", zIndex: 1 }}>
              <CountdownTimer duration={COUNTDOWN_DURATION} onExpire={advance} resetKey={index} />
            </div>
          )}
        </div>
      </div>

      {/* Pushable screen stack */}
      <div
        className="absolute"
        style={{
          top: 108, // status bar (44) + chrome row (64)
          left: 0,
          right: 0,
          bottom: 76, // bottom chrome reserved + safe area
          overflow: "hidden",
        }}
      >
        {screens.map((screen, i) => (
          <div
            key={`${screen.kind}-${screen.beatIndex}-${i}`}
            className="absolute inset-0"
            style={{
              transform: `translateX(${(i - index) * 100}%)`,
              transition: `transform ${DURATION}ms ${EASE}`,
            }}
          >
            {Math.abs(i - index) <= 1 && renderScreen(screen, advance, onClose, heroForIndex(screens, i))}
          </div>
        ))}
      </div>

      {/* Bottom chrome — share + forward (hidden on question screens) */}
      <div
        className="absolute left-0 w-full flex items-center justify-between"
        style={{
          bottom: 20, // above gesture nav
          zIndex: 2,
          padding: "8px 12px 8px 8px",
          display: isQuestion ? "none" : "flex",
        }}
      >
        <RoundButton ariaLabel="Share" onClick={() => {}}>
          <ShareIcon />
        </RoundButton>
        {!isClose && (
          <RoundButton ariaLabel="Next" onClick={advance} filled>
            <ForwardIcon />
          </RoundButton>
        )}
      </div>

      {/* Gesture nav */}
      <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 1 }}>
        <GestureNav />
      </div>
    </div>
  );
}

// helper: per-screen hero size
function heroForIndex(screens: Screen[], i: number): number {
  const s = screens[i];
  if (!s) return 64;
  if (s.kind === "guess-r") return s.beat.reveal.hero.length > 18 ? 48 : 80;
  if (s.kind === "observation") return s.beat.hero.length > 30 ? 40 : 56;
  if (s.kind === "reveal") return s.beat.hero.length > 36 ? 32 : 44;
  return 64;
}

function renderScreen(
  screen: Screen,
  advance: () => void,
  close: () => void,
  heroSize: number,
) {
  if (screen.kind === "guess-q") {
    return <GuessQuestionScreen beat={screen.beat} onAnswer={advance} />;
  }
  if (screen.kind === "guess-r") {
    return (
      <HeroBeatScreen
        hero={screen.beat.reveal.hero}
        subline={screen.beat.reveal.subline}
        ryan={screen.beat.reveal.ryan}
        heroSize={heroSize}
      />
    );
  }
  if (screen.kind === "observation") {
    return (
      <HeroBeatScreen
        hero={screen.beat.hero}
        subline={screen.beat.subline}
        ryan={screen.beat.ryan}
        heroSize={heroSize}
      />
    );
  }
  // reveal (closer)
  return (
    <HeroBeatScreen
      hero={screen.beat.hero}
      subline={screen.beat.subline}
      ryan={screen.beat.ryan}
      heroSize={heroSize}
      cta={{ label: screen.beat.ctaLabel, onClick: close }}
    />
  );
}
