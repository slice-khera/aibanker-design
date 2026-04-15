"use client";

import { useState, useRef, useCallback } from "react";
import { StatusBar } from "./AppChrome";
import Chat from "./Chat";
import GoalTracker from "./GoalTracker";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  BG_PRIMARY,
  BG_SECONDARY,
  SLATE_30,
  SLATE_50,
  ALPHA_BLACK_05,
  ALPHA_BLACK_10,
  ALPHA_BLACK_30,
  GREEN_500,
  RED_500,
  BLUE_500,
  ORANGE_500,
  VALENTINO_500,
  GREEN_50,
  BLUE_50,
  ORANGE_50,
  VALENTINO_50,
  RED_50,
} from "../lib/colors";

/* ─── Constants ─────────────────────────────────────────────────── */

const SHEET_EXPANDED_TOP = 100; // px from top when expanded
const SHEET_COLLAPSED_HEIGHT = 72; // pill height at bottom
const PHONE_H = 780;
const NOOP = () => {};

/* ─── Back Layer: My Money ──────────────────────────────────────── */

function MyMoneyScreen() {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div style={{ background: BG_PRIMARY, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Fixed L0 App bar — stays in place, shadow on scroll */}
      <div
        className="shrink-0"
        style={{
          background: BG_PRIMARY,
          boxShadow: scrolled ? "0px 6px 8px 0px rgba(0,0,0,0.05)" : "none",
          transition: "box-shadow 200ms ease",
          zIndex: 1,
        }}
      >
        <StatusBar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 64,
            gap: 8,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 24,
            paddingRight: 20,
          }}
        >
          <span style={{ ...typography.headerH2, color: TEXT_PRIMARY, flex: "1 0 0", minWidth: 1 }}>My money</span>
          <GoalTracker
            goals={[{
              id: "japan",
              name: "Japan trip",
              pct: 72,
              status: "on-track",
              daysLabel: "45 days left",
              saved: 108000,
              target: 150000,
              icon: "plane",
              ringColor: GREEN_500,
            }]}
            onGoalTap={NOOP}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}
        onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 0)}
      >
      {/* Hero wealth */}
      <div style={{ textAlign: "center", padding: "24px 24px" }}>
        <p style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", margin: 0 }}>
          Total wealth
        </p>
        <p style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: "8px 0 0" }}>
          &#x20B9;3,90,434
        </p>
        <p style={{ ...typography.caption, color: RED_500, margin: "4px 0 0" }}>
          &#x2193; &#x20B9;11 (0.0%) 1 day
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 8, background: BG_SECONDARY }} />

      {/* View your wealth — Section Header/List */}
      <div style={{ background: BG_SECONDARY, padding: "8px 24px" }}>
        <p style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", margin: 0 }}>
          View your wealth
        </p>
      </div>
      <div style={{ padding: "0 24px" }}>
        <WealthRow icon="bank" label="Bank accounts" sub="1.29% allocation" value="&#x20B9;5,049" />
        <WealthRow icon="stocks" label="Stocks" sub="0.2% allocation" value="&#x20B9;775" change={{ text: "1.51% (1 day)", negative: true }} />
        <WealthRow icon="mf" label="Mutual funds" sub="98.51% allocation" value="&#x20B9;3,84,610" />
        <WealthRow icon="gold" label="Gold" sub="" value="" actionLabel="Connect" />
        <WealthRow icon="fd" label="Fixed deposits" sub="" value="" actionLabel="Book now" last />
      </div>

      {/* Divider */}
      <div style={{ height: 8, background: BG_SECONDARY }} />

      {/* Quick actions — Section Header/List */}
      <div style={{ background: BG_SECONDARY, padding: "8px 24px" }}>
        <p style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", margin: 0 }}>
          Quick actions
        </p>
      </div>
      <div style={{ padding: "0 24px" }}>
        <ActionRow icon="budget" label="Can I afford it?" sub="Check before you spend" color={BLUE_500} bg={BLUE_50} />
        <ActionRow icon="spends" label="Analyse my spends" sub="Last month breakdown" color={ORANGE_500} bg={ORANGE_50} />
        <ActionRow icon="goal" label="View my goals" sub="Track your savings targets" color={GREEN_500} bg={GREEN_50} />
        <ActionRow icon="tax" label="Save taxes" sub="Optimise your 80C" color={VALENTINO_500} bg={VALENTINO_50} />
        <ActionRow icon="surprise" label="Surprise me" sub="A random insight" color={TEXT_SECONDARY} bg={SLATE_50} />
        <ActionRow icon="feedback" label="Make Ryan smarter" sub="Rate and improve" color={RED_500} bg={RED_50} last />
      </div>

      {/* Divider */}
      <div style={{ height: 8, background: BG_SECONDARY }} />

      {/* Banner */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            background: `linear-gradient(160deg, #ffffff 40%, ${VALENTINO_50} 100%)`,
            borderRadius: 16,
            padding: "24px 24px",
            border: `1px solid ${ALPHA_BLACK_05}`,
            boxShadow: `0px 2px 32px ${ALPHA_BLACK_05}`,
          }}
        >
          <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>Share the privilege.</p>
          <p style={{ ...typography.bodySmall, color: TEXT_SECONDARY, margin: "4px 0 16px" }}>
            Invite your friends to AI Banker.
          </p>
          <span style={{ ...typography.buttonSmall, color: TEXT_PRIMARY }}>Invite friends &rarr;</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 8, background: BG_SECONDARY }} />

      {/* More actions — Section Header/List */}
      <div style={{ background: BG_SECONDARY, padding: "8px 24px" }}>
        <p style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", margin: 0 }}>
          More actions
        </p>
      </div>
      <div style={{ padding: "0 24px" }}>
        <MoreRow label="Share your feedback" sub="Help us improve your experience" />
        <MoreRow label="Privacy, security & FAQs" sub="Your data is for your eyes only" />
        <MoreRow label="Contact support" sub="Reach out for any help" />
        <MoreRow label="Manage accounts" sub="Manage accounts on money" last />
      </div>

      {/* Bottom spacing so content isn't hidden behind collapsed pill */}
      <div style={{ height: 120 }} />
      </div>{/* end scrollable content */}
    </div>
  );
}

/* ─── Sub-components (all static, no state) ─────────────────────── */


function WealthRow({
  icon,
  label,
  sub,
  value,
  change,
  actionLabel,
  last,
}: {
  icon: string;
  label: string;
  sub: string;
  value?: string;
  change?: { text: string; negative: boolean };
  actionLabel?: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: last ? "none" : `1px solid ${ALPHA_BLACK_05}`,
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: BG_SECONDARY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <WealthIcon kind={icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...typography.bodySmall, fontWeight: 500, color: TEXT_PRIMARY, margin: 0 }}>{label}</p>
        {sub && <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0 }}>{sub}</p>}
      </div>
      {value ? (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ ...typography.bodySmall, fontWeight: 500, color: TEXT_PRIMARY, margin: 0 }}>{value}</p>
          {change && (
            <p style={{ ...typography.caption, color: change.negative ? RED_500 : GREEN_500, margin: 0 }}>
              {change.negative ? "\u2193" : "\u2191"} {change.text}
            </p>
          )}
        </div>
      ) : actionLabel ? (
        <div
          style={{
            ...typography.buttonSmall,
            color: TEXT_PRIMARY,
            background: SLATE_30,
            borderRadius: 100,
            padding: "8px 16px",
            flexShrink: 0,
          }}
        >
          {actionLabel}
        </div>
      ) : null}
      {value && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M9 6l6 6-6 6" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function WealthIcon({ kind }: { kind: string }) {
  const s = { width: 18, height: 18 };
  const c = TEXT_SECONDARY;
  switch (kind) {
    case "bank":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v8M20 10v8M8 10v8M12 10v8M16 10v8" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "stocks":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M3 17l6-6 4 4 8-8" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 7h4v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mf":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="18" rx="1" stroke={c} strokeWidth="1.5" />
          <rect x="14" y="8" width="7" height="13" rx="1" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case "gold":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "fd":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="12" rx="2" stroke={c} strokeWidth="1.5" />
          <path d="M3 10h18" stroke={c} strokeWidth="1.5" />
          <path d="M7 15h4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function ActionRow({
  icon,
  label,
  sub,
  color,
  bg,
  last,
}: {
  icon: string;
  label: string;
  sub: string;
  color: string;
  bg: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: last ? "none" : `1px solid ${ALPHA_BLACK_05}`,
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ActionIcon kind={icon} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...typography.bodySmall, fontWeight: 500, color: TEXT_PRIMARY, margin: 0 }}>{label}</p>
        <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0 }}>{sub}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M9 6l6 6-6 6" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ActionIcon({ kind, color }: { kind: string; color: string }) {
  const s = { width: 18, height: 18 };
  switch (kind) {
    case "budget":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "spends":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="12" width="4" height="8" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="10" y="8" width="4" height="12" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="17" y="4" width="4" height="16" rx="1" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "goal":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
        </svg>
      );
    case "tax":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "surprise":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l1.09 6.26L20 9.27l-5 4.87L16.18 22 12 18.27 7.82 22 9 14.14l-5-4.87 6.91-1.01L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "feedback":
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function MoreRow({ label, sub, last }: { label: string; sub: string; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: last ? "none" : `1px solid ${ALPHA_BLACK_05}`,
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...typography.bodySmall, fontWeight: 500, color: TEXT_PRIMARY, margin: 0 }}>{label}</p>
        <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0 }}>{sub}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M9 6l6 6-6 6" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Hardcoded Chat props ──────────────────────────────────────── */

const DRAWER_CHAT_MESSAGES = [
  {
    id: "ontrack-1",
    role: "assistant" as const,
    text: "Great going, Rajan — all your goals are **on track**. What would you like to talk about today?",
  },
  {
    id: "user-1",
    role: "user" as const,
    text: "How's my Japan trip fund looking?",
  },
  {
    id: "ontrack-2",
    role: "assistant" as const,
    text: "You've saved **₹1,08,000** of your ₹1,50,000 target — that's 72%. At your current pace, you'll hit it **18 days early**.",
  },
  {
    id: "user-2",
    role: "user" as const,
    text: "Nice! Can I skip this month's contribution?",
  },
  {
    id: "ontrack-3",
    role: "assistant" as const,
    text: "You could, but you'd lose the buffer. If you skip, you'll still make it — just with only 3 days to spare instead of 18. Want me to adjust the plan?",
  },
];

/* ─── Main Sim ──────────────────────────────────────────────────── */

export default function DrawerExperienceSim() {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetTop, setSheetTop] = useState(SHEET_EXPANDED_TOP);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTop = useRef(SHEET_EXPANDED_TOP);

  const handleDragStart = useCallback(
    (clientY: number) => {
      dragging.current = true;
      dragStartY.current = clientY;
      dragStartTop.current = sheetTop;
    },
    [sheetTop],
  );

  const handleDragMove = useCallback((clientY: number) => {
    if (!dragging.current) return;
    const delta = clientY - dragStartY.current;
    const newTop = Math.max(60, Math.min(PHONE_H - SHEET_COLLAPSED_HEIGHT, dragStartTop.current + delta));
    setSheetTop(newTop);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragging.current = false;
    // If dragged past midpoint → collapse, else snap back
    if (sheetTop > PHONE_H * 0.55) {
      setCollapsed(true);
      setSheetTop(SHEET_EXPANDED_TOP);
    } else {
      setSheetTop(SHEET_EXPANDED_TOP);
    }
  }, [sheetTop]);

  const handleExpand = useCallback(() => {
    if (collapsed) {
      // Start sheet from bottom, then animate up (reverse of collapse)
      const bottomTop = PHONE_H - SHEET_COLLAPSED_HEIGHT;
      setSheetTop(bottomTop);
      setCollapsed(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSheetTop(SHEET_EXPANDED_TOP);
        });
      });
    } else {
      // Animate sheet down to bottom, then collapse to pill
      const bottomTop = PHONE_H - SHEET_COLLAPSED_HEIGHT;
      setSheetTop(bottomTop);
      setTimeout(() => {
        setCollapsed(true);
        setSheetTop(SHEET_EXPANDED_TOP);
      }, 300);
    }
  }, [collapsed]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: BG_PRIMARY,
      }}
    >
      {/* Back layer — always rendered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: collapsed ? "auto" : "none",
        }}
      >
        <MyMoneyScreen />
      </div>

      {/* Overlay dim when sheet is expanded */}
      {!collapsed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ALPHA_BLACK_30,
            opacity: Math.max(0, 1 - (sheetTop - SHEET_EXPANDED_TOP) / (PHONE_H * 0.5)),
            pointerEvents: "none",
            zIndex: 10,
            transition: dragging.current ? "none" : "opacity 0.3s ease",
          }}
        />
      )}

      {/* Collapsed pill */}
      {collapsed && (
        <button
          type="button"
          onClick={handleExpand}
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            height: SHEET_COLLAPSED_HEIGHT,
            background: BG_PRIMARY,
            borderRadius: 20,
            border: "none",
            boxShadow: `0 4px 24px ${ALPHA_BLACK_10}, 0 0 0 1px ${ALPHA_BLACK_05}`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            cursor: "pointer",
            zIndex: 20,
          }}
        >
          <div style={{ flex: 1, textAlign: "left", display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>Chat with Ryan</p>
            <p style={{ ...typography.caption, color: VALENTINO_500, margin: 0 }}>2 new messages</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 15l-6-6-6 6" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Expanded sheet — real Chat component inside a draggable wrapper */}
      {!collapsed && (() => {
        const maxDrag = PHONE_H - SHEET_COLLAPSED_HEIGHT - SHEET_EXPANDED_TOP;
        const progress = Math.min(1, Math.max(0, (sheetTop - SHEET_EXPANDED_TOP) / maxDrag));
        const horizontalInset = progress * 12;
        const radius = 16 + progress * 4; // 16 → 20
        return (
          <div
            style={{
              position: "absolute",
              top: sheetTop,
              left: horizontalInset,
              right: horizontalInset,
              bottom: 0,
              background: BG_PRIMARY,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              boxShadow: `0 -4px 24px ${ALPHA_BLACK_10}`,
              display: "flex",
              flexDirection: "column",
              zIndex: 20,
              overflow: "hidden",
              transition: dragging.current ? "none" : "all 0.3s ease",
            }}
          >
            {/* Drag handle area */}
            <div
              style={{ touchAction: "none", cursor: "grab", userSelect: "none" }}
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                handleDragStart(e.clientY);
              }}
              onPointerMove={(e) => handleDragMove(e.clientY)}
              onPointerUp={handleDragEnd}
            >
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: ALPHA_BLACK_10 }} />
              </div>
            </div>

            {/* Real Chat component */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Chat
                title="Ryan"
                messages={DRAWER_CHAT_MESSAGES}
                chips={[]}
                onChipSelect={NOOP}
                onSheetClose={() => {
                  // Animate sheet down, then collapse to pill
                  const bottomTop = PHONE_H - SHEET_COLLAPSED_HEIGHT;
                  setSheetTop(bottomTop);
                  setTimeout(() => {
                    setCollapsed(true);
                    setSheetTop(SHEET_EXPANDED_TOP);
                  }, 300);
                }}
                hideStatusBar
                sheetTransitionProgress={progress}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
