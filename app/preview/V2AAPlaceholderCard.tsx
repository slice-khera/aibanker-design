"use client";

import { useEffect } from "react";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_TERTIARY,
  ALPHA_BLACK_05,
  ALPHA_BLACK_10,
  VALENTINO_500,
  ALPHA_WHITE_FF,
  GREEN_500,
  GREEN_50,
  BG_CARD,
  SLATE_10,
} from "../lib/colors";
import { SPACE_2XS, SPACE_XS, SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_M, RADIUS_PILL, RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import { V2_AA_CARD } from "./fixtures/onboardingV2Fixture";

function BankIcon({ color = VALENTINO_500 }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10l9-6 9 6M5 10v9h14v-9M9 19v-5M15 19v-5M3 21h18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: RADIUS_CIRCLE,
        border: `2.5px solid ${ALPHA_BLACK_10}`,
        borderTopColor: VALENTINO_500,
        animation: "v2-spin 0.8s linear infinite",
      }}
    />
  );
}

function CheckCircle({ color = GREEN_500 }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={color} />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke={ALPHA_WHITE_FF}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ color = ALPHA_WHITE_FF }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Pending state ─────────────────────────────────────────────

function PendingCard({ onConnect }: { onConnect: () => void }) {
  return (
    <button
      type="button"
      onClick={onConnect}
      className="w-full text-left transition-transform active:scale-[0.99]"
      style={{
        backgroundColor: BG_CARD,
        border: `1px solid ${ALPHA_BLACK_05}`,
        borderRadius: RADIUS_M,
        padding: SPACE_M,
        cursor: "pointer",
        boxShadow: ELEVATION_CARD,
        display: "flex",
        alignItems: "center",
        gap: SPACE_M,
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 44,
          height: 44,
          borderRadius: RADIUS_CIRCLE,
          backgroundColor: SLATE_10,
        }}
      >
        <BankIcon />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>
          {V2_AA_CARD.pending.title}
        </p>
        <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0, marginTop: 2 }}>
          {V2_AA_CARD.pending.subtitle}
        </p>
      </div>

      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: RADIUS_CIRCLE,
          backgroundColor: VALENTINO_500,
        }}
      >
        <ArrowIcon />
      </div>
    </button>
  );
}

// ── Loading state ─────────────────────────────────────────────

function LoadingCard() {
  return (
    <div
      style={{
        backgroundColor: BG_CARD,
        border: `1px solid ${ALPHA_BLACK_05}`,
        borderRadius: RADIUS_M,
        padding: SPACE_M,
        boxShadow: ELEVATION_CARD,
        display: "flex",
        alignItems: "center",
        gap: SPACE_M,
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 44,
          height: 44,
          borderRadius: RADIUS_CIRCLE,
          backgroundColor: SLATE_10,
        }}
      >
        <BankIcon />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>
          {V2_AA_CARD.loading.title}
        </p>
        <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0, marginTop: 2 }}>
          {V2_AA_CARD.loading.subtitle}
        </p>
      </div>

      <div className="shrink-0">
        <Spinner />
      </div>
    </div>
  );
}

// ── Linked (collapsed) state ──────────────────────────────────

function LinkedCard() {
  return (
    <div
      style={{
        backgroundColor: BG_CARD,
        border: `1px solid ${ALPHA_BLACK_05}`,
        borderRadius: RADIUS_M,
        padding: SPACE_M,
        boxShadow: ELEVATION_CARD,
        display: "flex",
        alignItems: "center",
        gap: SPACE_M,
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 44,
          height: 44,
          borderRadius: RADIUS_CIRCLE,
          backgroundColor: GREEN_50,
        }}
      >
        <BankIcon color={GREEN_500} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>
          {V2_AA_CARD.linked.bankName}
        </p>
        <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0, marginTop: 2 }}>
          {V2_AA_CARD.linked.accountDetail}
        </p>
      </div>

      <div className="shrink-0">
        <CheckCircle color={GREEN_500} />
      </div>
    </div>
  );
}

// ── Public component ─────────────────────────────────────────

export type V2AACardState = "pending" | "loading" | "linked";

export default function V2AAPlaceholderCard({
  state,
  onConnect,
}: {
  state: V2AACardState;
  onConnect: () => void;
}) {
  // Scope keyframe to the document once
  useEffect(() => {
    const id = "v2-aa-spin-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = "@keyframes v2-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
  }, []);

  if (state === "linked") return <LinkedCard />;
  if (state === "loading") return <LoadingCard />;
  return <PendingCard onConnect={onConnect} />;
}
