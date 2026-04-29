"use client";

import * as blobs2 from "blobs/v2";
import { typography } from "../lib/typography";
import { SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_L } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import { WRAPPED_BEATS, V3_CARD_PALETTES, V3_BEAT_DATA, type WrappedBeat } from "./fixtures/onboardingV2Fixture";

const CARD_H = 312;
const CARD_W = 208;
const BRICOLAGE = "var(--font-bricolage), var(--font-rubik), system-ui, sans-serif";

const HERO_SIZE_SMALL = 64;

// ── Blob — unique per card via seed ─────────────────────────────

const SMALL_BLOB_POSITIONS = [
  { bottom: SPACE_M, right: -16 },
  { bottom: SPACE_M + 20, right: -10 },
  { bottom: SPACE_M - 4, right: 4 },
  { bottom: SPACE_M + 12, right: -20 },
  { bottom: SPACE_M + 30, right: -6 },
];

function CardBlob({ seed, color, size }: { seed: number; color: string; size: number }) {
  const path = blobs2.svgPath({ seed, extraPoints: 6, randomness: 8, size });
  const pos = SMALL_BLOB_POSITIONS[seed % SMALL_BLOB_POSITIONS.length];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute", bottom: pos.bottom, right: pos.right }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}

// ── Shared card template ────────────────────────────────────────
// Used by both the cover card and beat result cards.
// The expanded story version uses the same structure with larger type.

function SmallCardShell({
  bg,
  accent,
  text,
  blobSeed,
  labelAbove,
  hero,
  labelBelow,
  onClick,
  blurred = false,
}: {
  bg: string;
  accent: string;
  text: string;
  blobSeed: number;
  labelAbove?: string;
  hero: string;
  labelBelow: string;
  onClick?: () => void;
  blurred?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 flex flex-col text-left transition-transform active:scale-[0.97]"
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: RADIUS_L,
        background: bg,
        padding: SPACE_M,
        boxShadow: ELEVATION_CARD,
        border: "none",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        justifyContent: "flex-end",
        ...(blurred ? { filter: "blur(8px)", WebkitFilter: "blur(8px)" } : {}),
      }}
    >
      <CardBlob seed={blobSeed} color={accent} size={120} />

      {labelAbove && (
        <span style={{ ...typography.bodySmall, color: text, opacity: 0.6, position: "relative", zIndex: 1 }}>
          {labelAbove}
        </span>
      )}
      <span style={{ fontFamily: BRICOLAGE, fontSize: HERO_SIZE_SMALL, fontWeight: 700, lineHeight: 1, color: text, position: "relative", zIndex: 1, marginTop: labelAbove ? SPACE_S : 0 }}>
        {hero}
      </span>
      <span style={{ ...typography.buttonSmall, color: text, opacity: 0.7, position: "relative", zIndex: 1, marginTop: SPACE_S }}>
        {labelBelow}
      </span>
    </button>
  );
}

// ── Cover card — same SmallCardShell template, V2 gradient ──────

const COVER_PALETTE = {
  bg: "linear-gradient(160deg, #2A0A2D 0%, #D30AD7 100%)",
  accent: "rgba(255, 255, 255, 0.1)",
  text: "#FFFFFF",
};

function CoverCard({ onOpen }: { onOpen: () => void }) {
  return (
    <SmallCardShell
      bg={COVER_PALETTE.bg}
      accent={COVER_PALETTE.accent}
      text={COVER_PALETTE.text}
      blobSeed={999}
      labelAbove="I found"
      hero="5"
      labelBelow="worth talking about"
      onClick={onOpen}
    />
  );
}

// ── Beat result card ────────────────────────────────────────────

function BeatResultCard({ beat, index, onTap }: { beat: WrappedBeat; index: number; onTap?: () => void }) {
  const data = V3_BEAT_DATA[beat.id];
  if (!data) return null;
  const p = V3_CARD_PALETTES[index % V3_CARD_PALETTES.length];

  return (
    <SmallCardShell
      bg={p.bg}
      accent={p.accent}
      text={p.text}
      blobSeed={index * 1000 + 42}
      labelAbove={data.labelAbove}
      hero={data.number}
      labelBelow={data.labelBelow}
      onClick={onTap}
    />
  );
}

// ── Viewed: horizontal carousel ─────────────────────────────────

function ViewedCarousel({ onTapBeat }: { onTapBeat?: (beatIndex: number) => void }) {
  return (
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
      {WRAPPED_BEATS.map((beat, i) => (
        <BeatResultCard key={beat.id} beat={beat} index={i} onTap={onTapBeat ? () => onTapBeat(i) : undefined} />
      ))}
    </div>
  );
}

// ── Pending: cover card + blurred beat cards ────────────────────

function PendingCarousel({ onOpen }: { onOpen: () => void }) {
  return (
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
      {/* Cover card — first in carousel */}
      <CoverCard onOpen={onOpen} />

      {/* Beat cards — blurred, tapping any opens the story */}
      {WRAPPED_BEATS.map((beat, i) => {
        const data = V3_BEAT_DATA[beat.id];
        if (!data) return null;
        const p = V3_CARD_PALETTES[i % V3_CARD_PALETTES.length];
        return (
          <div key={beat.id} className="shrink-0" style={{ borderRadius: RADIUS_L, overflow: "hidden" }}>
            <SmallCardShell
              bg={p.bg}
              accent={p.accent}
              text={p.text}
              blobSeed={i * 1000 + 42}
              labelAbove={data.labelAbove}
              hero={data.number}
              labelBelow={data.labelBelow}
              onClick={onOpen}
              blurred
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Public component ────────────────────────────────────────────

export type V2WrappedCardState = "pending" | "viewed";

export default function V2WrappedCard({
  state,
  onOpen,
  onTapBeat,
}: {
  state: V2WrappedCardState;
  onOpen: () => void;
  onTapBeat?: (beatIndex: number) => void;
}) {
  if (state === "viewed") return <ViewedCarousel onTapBeat={onTapBeat} />;
  return <PendingCarousel onOpen={onOpen} />;
}
