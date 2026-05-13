"use client";

import { useState, useEffect, useRef } from "react";
import { typography } from "../lib/typography";
import {
  VALENTINO_50,
  TEXT_PRIMARY, OUTLINE_SUBTLE, ALPHA_BLACK_30, BG_PRIMARY,
} from "../lib/colors";
import { ELEVATION_CARD } from "../lib/elevation";
import { RADIUS_CIRCLE } from "../lib/radii";
import { StatusBar, FooterInset, GestureNav } from "../components/AppChrome";
import ChatCard, { type ChatCardData } from "../components/ChatCards";
import GoalTracker from "../components/GoalTracker";
import type { GoalIndicatorData } from "../components/GoalTracker";

// ── Hardcoded staged messages ──────────────────────────────────

type SimMessage =
  | { role: "assistant"; text: string; card?: ChatCardData }
  | { role: "user"; text: string };

// ── Goal data for trailing ring ─────────────────────────────────

const JAPAN_GOAL: GoalIndicatorData = {
  id: "1", name: "Trip to Japan", pct: 42, status: "on-track",
  icon: "plane", ringColor: "#d30ad7", daysLabel: "4 months left",
  saved: 84000, target: 200000,
};

const MESSAGES: SimMessage[] = [
  // ─ Goal progress
  { role: "user", text: "How\u2019s my Japan trip savings looking?" },
  {
    role: "assistant",
    text: "You\u2019re slightly behind on your Japan trip goal. Here\u2019s where you stand.",
    card: {
      type: "goal-progress",
      name: "Trip to Japan",
      pct: 42,
      saved: 84000,
      target: 200000,
      daysLabel: "On track",
      status: "on-track",
    },
  },

  // ─ FD / Investment product
  { role: "user", text: "Any suggestions to grow my money faster?" },
  {
    role: "assistant",
    text: "A short-term FD could help. Here\u2019s a good option at 7.1% for 6 months.",
    card: {
      type: "investment-product",
      productType: "Fixed Deposit",
      amount: 25000,
      rate: "7.1%",
      tenure: "6 months",
      amountOptions: [
        { label: "\u20B910k", value: 10000 },
        { label: "\u20B925k", value: 25000 },
        { label: "\u20B950k", value: 50000 },
        { label: "\u20B91L", value: 100000 },
      ],
      accountLabel: "Savings Account \u2022 HDFC",
    },
  },

  // ─ Savings plan
  {
    role: "assistant",
    text: "Or we could set up a structured savings plan for the Japan trip.",
    card: {
      type: "savings-plan",
      name: "Trip to Japan",
      target: 200000,
      timeline: "4 months",
      existingSavings: 84000,
      monthlyAmount: 29000,
      productType: "RD",
      productLabel: "Recurring Deposit",
      rate: "6.5%",
      pct: 42,
      timelineLabel: "Dec 2026",
    },
  },

  // ─ Obligations
  { role: "user", text: "What about my fixed monthly bills?" },
  {
    role: "assistant",
    text: "Here are the obligations I\u2019ve tracked. Review and confirm what\u2019s still active.",
    card: {
      type: "obligations-list-v2",
      monthlyIncome: 120000,
      items: [
        { id: "1", payee: "House Rent", amount: 25000, type: "Rent", seenMonths: "Every month" },
        { id: "2", payee: "Car EMI", amount: 12500, type: "EMI", seenMonths: "Every month" },
        { id: "3", payee: "Netflix", amount: 649, type: "Subscription", seenMonths: "Monthly" },
        { id: "4", payee: "Gym Membership", amount: 2000, type: "Subscription", seenMonths: "Monthly" },
        { id: "5", payee: "Electricity Bill", amount: 3200, type: "Utility", seenMonths: "Monthly" },
      ],
    },
  },

  // ─ Wrap up
  { role: "user", text: "This is super helpful, thanks Ryan!" },
  { role: "assistant", text: "Anytime, Rajan! I\u2019ll keep an eye on your spending and goals. Just ping me whenever." },
];

// ── Highlight ₹ values and **bold** ─────────────────────────────

const HIGHLIGHT_RE = /\*\*(.+?)\*\*|₹[\d,.]+\s*[Lk]?|[\d,.]+%/g;

function highlightValues(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = HIGHLIGHT_RE.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const boldText = match[1] ?? match[0];
    parts.push(<span key={match.index} style={typography.buttonSmall}>{boldText}</span>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}

// ── Floating AppBar ─────────────────────────────────────────────

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
          <GoalTracker goals={[JAPAN_GOAL]} onGoalTap={() => {}} />
        </div>
      </div>
    </div>
  );
}

// ── Main simulation ─────────────────────────────────────────────

export default function VisualizationsChatSimV1() {
  const [revealed, setRevealed] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reveal messages one-by-one with stagger
  useEffect(() => {
    if (revealed >= MESSAGES.length) return;
    const delay = revealed === 0 ? 400 : MESSAGES[revealed].role === "user" ? 800 : 600;
    const timer = window.setTimeout(() => setRevealed((r) => r + 1), delay);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  // Auto-scroll to bottom as messages appear
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [revealed]);

  // Track scroll for top fade gradient
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHasScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
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

      <div
        ref={scrollRef}
        className="absolute inset-0 w-full overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex flex-col px-6">
          {/* Clearance for app bar */}
          <div className="shrink-0" aria-hidden="true" style={{ height: 108 }} />

          {/* Messages — space-y-4 (16px) matches Chat.tsx */}
          <div className="w-full space-y-4">
            {MESSAGES.slice(0, revealed).map((msg, i) => (
              <div key={i} className="animate-chat-message-in">
                {msg.role === "user" ? (
                  <div className="flex flex-col items-end">
                    <div
                      className="max-w-[75%] rounded-[16px] rounded-tr-lg"
                      style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
                    >
                      <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start" style={{ gap: msg.card ? 16 : 0 }}>
                    <p className="whitespace-pre-line w-full" style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>
                      {highlightValues(msg.text)}
                    </p>
                    {msg.card && (
                      <div className="w-full">
                        <ChatCard card={msg.card} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="shrink-0" aria-hidden="true" style={{ height: 120 }} />
        </div>
      </div>

      {/* Input bar + gesture nav */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <FooterInset backgroundColor="transparent" paddingX={16} paddingTop={8} minBottomPadding={0}>
          <div className="flex items-center" style={{ gap: 12 }}>
            {/* Refresh button */}
            <div
              className="flex items-center justify-center rounded-full bg-white shrink-0 transition-transform active:scale-[0.97]"
              style={{
                width: 48,
                height: 48,
                border: `1px solid ${OUTLINE_SUBTLE}`,
                boxShadow: ELEVATION_CARD,
                cursor: "pointer",
              }}
            >
              <img src="/icons/reload.svg" alt="Refresh" width={20} height={20} style={{ display: "block" }} />
            </div>
            {/* Input pill */}
            <div
              className="flex items-center overflow-hidden flex-1"
              style={{ height: 48, backgroundColor: BG_PRIMARY, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: RADIUS_CIRCLE, boxShadow: ELEVATION_CARD }}
            >
              <div className="flex items-center w-full h-full" style={{ backgroundColor: BG_PRIMARY, borderRadius: RADIUS_CIRCLE, paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}>
                <span className="flex-1" style={{ ...typography.bodySmall, color: ALPHA_BLACK_30 }}>
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
