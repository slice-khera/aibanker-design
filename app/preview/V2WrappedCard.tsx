"use client";

import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  ALPHA_BLACK_10,
  ALPHA_BLACK_20,
  VALENTINO_500,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { SPACE_2XS, SPACE_XS, SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_M, RADIUS_S, RADIUS_PILL, RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import { V2_WRAPPED_CARD, WRAPPED_BEATS, type WrappedBeat } from "./fixtures/onboardingV2Fixture";

// ── Card dimensions ─────────────────────────────────────────────
// 3:2 portrait aspect ratio, ~40% of phone screen height
const CARD_H = 312;
const CARD_W = 208;

// ── Shared icons ────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

// ── Mini fanned preview cards ───────────────────────────────────

const MINI_W = 48;
const MINI_H = Math.round(MINI_W * (CARD_H / CARD_W));

function MiniCard({
  rotation,
  xOffset,
  zIndex,
}: {
  rotation: number;
  xOffset: number;
  zIndex: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: MINI_W,
        height: MINI_H,
        top: "50%",
        left: "50%",
        marginTop: -MINI_H / 2,
        marginLeft: -MINI_W / 2,
        transform: `translateX(${xOffset}px) rotate(${rotation}deg)`,
        backgroundColor: ALPHA_WHITE_FF,
        borderRadius: RADIUS_S,
        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        zIndex,
        padding: SPACE_XS,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <div style={{ height: 2, width: "55%", borderRadius: 1, backgroundColor: ALPHA_BLACK_10 }} />
      <div style={{ flex: 1 }} />
      <div style={{ height: 10, width: "75%", borderRadius: 2, backgroundColor: ALPHA_BLACK_20 }} />
      <div style={{ height: 2, width: "65%", borderRadius: 1, backgroundColor: ALPHA_BLACK_10 }} />
    </div>
  );
}

function MiniCardStack() {
  const positions = [
    { rot: -16, x: -28, z: 1 },
    { rot: -8, x: -14, z: 2 },
    { rot: 0, x: 0, z: 3 },
    { rot: 8, x: 14, z: 2 },
    { rot: 16, x: 28, z: 1 },
  ];
  return (
    <div style={{ position: "relative", width: "100%", height: MINI_H + 20, flexShrink: 0 }}>
      {positions.map((p, i) => (
        <MiniCard key={i} rotation={p.rot} xOffset={p.x} zIndex={p.z} />
      ))}
    </div>
  );
}

// ── Pending: single tappable card, left-aligned ─────────────────

function PendingCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left transition-transform active:scale-[0.97]"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: `linear-gradient(160deg, #2A0A2D 0%, ${VALENTINO_500} 100%)`,
        borderRadius: RADIUS_M,
        padding: SPACE_M,
        cursor: "pointer",
        boxShadow: ELEVATION_CARD,
        border: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Fanned mini cards */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MiniCardStack />
      </div>
    </button>
  );
}

// ── Beat result card (single carousel item) ─────────────────────

// Category labels for each beat
const BEAT_CATEGORIES: Record<string, string> = {
  "swiggy-volume": "Food delivery",
  "top-recipient": "Top recipient",
  "tuesday-spending": "Spending pattern",
  "subs-counterfactual": "Subscriptions",
  "extrapolation-closer": "Annual pace",
};

const BEAT_GRADIENTS = [
  "linear-gradient(160deg, #2A0A2D 0%, #9D4EDD 100%)",
  "linear-gradient(160deg, #1A0A2E 0%, #7B2FBE 100%)",
  "linear-gradient(160deg, #0A1A2D 0%, #4E7ADD 100%)",
  "linear-gradient(160deg, #2D0A1A 0%, #DD4E7A 100%)",
  "linear-gradient(160deg, #0A2D1A 0%, #4EDD7A 100%)",
];

function getHero(beat: WrappedBeat): string {
  return beat.kind === "guess" ? beat.reveal.hero : beat.hero;
}
function getSubline(beat: WrappedBeat): string {
  return beat.kind === "guess" ? beat.reveal.subline : beat.subline;
}

function BeatResultCard({ beat, index }: { beat: WrappedBeat; index: number }) {
  const hero = getHero(beat);
  const subline = getSubline(beat);
  const category = BEAT_CATEGORIES[beat.id] ?? "";
  const heroSize = hero.length > 20 ? 20 : hero.length > 12 ? 24 : 28;

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: RADIUS_M,
        background: BEAT_GRADIENTS[index % BEAT_GRADIENTS.length],
        padding: SPACE_M,
        boxShadow: ELEVATION_CARD,
        overflow: "hidden",
      }}
    >
      {/* Category label */}
      <span
        style={{
          ...typography.caption,
          color: ALPHA_WHITE_FF,
          opacity: 0.55,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {category}
      </span>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-bricolage), var(--font-rubik), system-ui, sans-serif",
            fontSize: heroSize,
            fontWeight: 700,
            lineHeight: 1.15,
            color: ALPHA_WHITE_FF,
            margin: 0,
          }}
        >
          {hero}
        </p>
      </div>

      {/* Subline */}
      <p
        style={{
          ...typography.caption,
          color: ALPHA_WHITE_FF,
          opacity: 0.7,
          margin: 0,
          lineHeight: 1.35,
          fontSize: 10,
        }}
      >
        {subline}
      </p>
    </div>
  );
}

// ── Viewed: horizontal carousel of result cards ─────────────────

function ViewedCarousel() {
  return (
    <div>
      {/* Scrollable carousel */}
      <div
        className="flex overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          gap: SPACE_S,
          marginLeft: -SPACE_L,
          marginRight: -SPACE_L,
          paddingLeft: SPACE_L,
          paddingRight: SPACE_L,
        }}
      >
        {/* TODO: restore full carousel — showing first card only for design review */}
        <BeatResultCard beat={WRAPPED_BEATS[0]} index={0} />
      </div>
    </div>
  );
}

// ── Public component ────────────────────────────────────────────

export type V2WrappedCardState = "pending" | "viewed";

export default function V2WrappedCard({
  state,
  onOpen,
}: {
  state: V2WrappedCardState;
  onOpen: () => void;
}) {
  if (state === "viewed") return <ViewedCarousel />;
  return <PendingCard onOpen={onOpen} />;
}
