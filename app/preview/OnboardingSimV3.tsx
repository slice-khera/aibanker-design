"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  OUTLINE_SUBTLE,
  ALPHA_WHITE_05,
  ALPHA_WHITE_FF,
  ALPHA_BLACK_05,
  BG_PRIMARY,
  BG_CARD,
  BG_SECONDARY,
  SLATE_10,
} from "../lib/colors";
import { SPACE_XS, SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_M } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import { StatusBar, GestureNav } from "../components/AppChrome";
import QuestionnaireOverlay from "../components/QuestionnaireOverlay";
import type { Question, QuestionOption } from "../components/QuestionnaireOverlay";
import PlanCruncherV2 from "../components/PlanCruncherV2";

import V2WrappedCard, { type V2WrappedCardState } from "./V3WrappedCard";
import V2WrappedStory from "./V3WrappedStory";
import AASim from "./AASim";
import {
  V2_PILLS,
  PRE_WRAPPED_BUBBLES,
  POST_WRAPPED_PRE_AA_BUBBLES,
  V2_AA_LINKED_BUBBLE,
  V2_AA_POST_LINKED_CHIPS,
  V2_POST_AA_PREF_BUBBLES,
  V2_GOAL_PREFERENCE_QUESTIONS,
  V2_POST_PREF_BUBBLES,
  V2_CLARIFYING_QUESTIONS,
  V2_CLARIFY_CRUNCHER_STATUSES,
  V2_IDLE_CRUNCHER_TEXTS,
  V2_VERBOSE_PLAN_TEXT,
} from "./fixtures/onboardingV2Fixture";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const OVERLAY_DURATION = 460;

// ══════════════════════════════════════════════════════════════════
//  Helpers — copied from the locked RefreshSession pattern
// ══════════════════════════════════════════════════════════════════

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

function useTypewriter(fullText: string, active: boolean, onComplete?: () => void) {
  const [displayed, setDisplayed] = useState(active ? "" : fullText);
  const posRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const completeCalled = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setDisplayed(fullText);
      posRef.current = fullText.length;
      return;
    }
    posRef.current = 0;
    completeCalled.current = false;
    setDisplayed("");

    const tick = () => {
      const chunkSize = 3 + Math.floor(Math.random() * 3);
      const nextPos = Math.min(posRef.current + chunkSize, fullText.length);
      posRef.current = nextPos;
      setDisplayed(fullText.slice(0, nextPos));
      if (nextPos >= fullText.length) {
        if (!completeCalled.current) {
          completeCalled.current = true;
          onCompleteRef.current?.();
        }
        return;
      }
      timerRef.current = window.setTimeout(tick, 20 + Math.random() * 20);
    };
    timerRef.current = window.setTimeout(tick, 80);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [fullText, active]);

  return displayed;
}

// ══════════════════════════════════════════════════════════════════
//  Feedback row — matches RefreshSession 1:1
// ══════════════════════════════════════════════════════════════════

function FeedbackIcon({ children, viewBox = "0 0 20 20" }: { children: React.ReactNode; viewBox?: string }) {
  return <svg width="16" height="16" viewBox={viewBox} fill="none">{children}</svg>;
}

function FeedbackRow() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowDisclaimer(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 animate-chat-message-in">
        <FeedbackIcon>
          <path d="M12.3563 19.99H12.3363L5.0788 19.96C2.89954 19.96 1.04018 18.3706 0.760277 16.2813L0.0405238 11.103C-0.129418 9.91346 0.240455 8.70387 1.05018 7.78418L6.88818 1.3164C7.55795 0.426705 8.78753-0.103114 10.0171 0.0168451C11.0767 0.116811 12.0164 0.646629 12.6262 1.49634C13.236 2.34605 13.4059 3.39569 13.126 4.38535L12.5862 6.18473L14.7955 5.87484C16.4149 5.64492 17.9844 6.25471 19.004 7.48429C20.0237 8.72386 20.2836 10.3433 19.6938 11.8228L17.9144 16.3013C17.0347 18.5205 14.8055 20 12.3663 20L12.3563 19.99ZM9.68722 2.476C9.37733 2.476 9.06743 2.62595 8.8775 2.86587L2.98951 9.41363C2.66962 9.7835 2.51967 10.2833 2.57965 10.7732L3.29941 15.9514C3.41937 16.8211 4.1891 17.4709 5.08879 17.4809L12.3463 17.5109H12.3563C13.7458 17.5109 15.0154 16.6711 15.5152 15.4016L17.2946 10.9231C17.5545 10.2733 17.4346 9.57357 16.9947 9.03376C16.5549 8.49394 15.8651 8.23403 15.1553 8.324L10.9668 8.9138C10.5369 8.97378 10.0971 8.81383 9.81717 8.49394C9.52727 8.17405 9.43731 7.7342 9.55726 7.33434L10.6569 3.69558C10.7668 3.32571 10.6069 3.03581 10.5169 2.89586C10.427 2.75591 10.187 2.51599 9.78719 2.476C9.7572 2.476 9.72721 2.476 9.69722 2.476H9.68722Z" fill={TEXT_TERTIARY} />
        </FeedbackIcon>
        <FeedbackIcon>
          <path d="M7.6484 0.00999641H7.66839L14.9259 0.0399876C17.1052 0.0399876 18.9645 1.62944 19.2444 3.71873L19.9642 8.89695C20.1341 10.0865 19.7642 11.2961 18.9545 12.2158L13.1165 18.6836C12.4468 19.5733 11.2172 20.1031 9.9876 19.9832C8.92796 19.8832 7.98828 19.3534 7.37849 18.5037C6.7687 17.654 6.59876 16.6043 6.87866 15.6147L7.41848 13.8153L5.20923 14.1252C3.58979 14.3551 2.02033 13.7453 1.00067 12.5157C-0.0189768 11.2761-0.278887 9.65669 0.310911 8.1772L2.0903 3.69873C2.97 1.47949 5.19924 0 7.6384 0L7.6484 0.00999641ZM10.3175 17.524C10.6274 17.524 10.9373 17.374 11.1272 17.1341L17.0152 10.5864C17.3351 10.2165 17.485 9.71667 17.425 9.22684L16.7053 4.04861C16.5853 3.17891 15.8156 2.52913 14.9159 2.51914L7.65839 2.48915H7.6484C6.25887 2.48915 4.98931 3.32886 4.48948 4.59842L2.71009 9.07689C2.45018 9.72667 2.57014 10.4264 3.00999 10.9662C3.44984 11.5061 4.1396 11.766 4.84936 11.676L9.03792 11.0862C9.46777 11.0262 9.90762 11.1862 10.1875 11.5061C10.4774 11.8259 10.5674 12.2658 10.4474 12.6657L9.34782 16.3044C9.23785 16.6743 9.3978 16.9642 9.48777 17.1041C9.57774 17.2441 9.81765 17.484 10.2175 17.524C10.2475 17.524 10.2775 17.524 10.3075 17.524H10.3175Z" fill={TEXT_TERTIARY} />
        </FeedbackIcon>
        <FeedbackIcon viewBox="0 0 18 18">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.05664 3.88672C5.77725 3.88681 3.91992 5.74829 3.91992 8.0332V13.8535C3.91992 16.1384 5.77725 17.9999 8.05664 18H13.8633C16.1427 18 18 16.1385 18 13.8535V8.0332C18 5.74823 16.1427 3.88672 13.8633 3.88672H8.05664ZM13.8633 6.36816C14.777 6.36816 15.5244 7.11724 15.5244 8.0332V13.8535C15.5244 14.7695 14.777 15.5176 13.8633 15.5176H8.05664C7.14297 15.5175 6.39648 14.7694 6.39648 13.8535V8.0332C6.39648 7.1173 7.14296 6.36826 8.05664 6.36816H13.8633Z" fill={TEXT_TERTIARY} />
          <path d="M7.33984 0C3.29182 0 0 3.29962 0 7.35742V11.0801C0 11.7597 0.55057 12.3115 1.22852 12.3115C1.9063 12.3113 2.45605 11.7595 2.45605 11.0801V7.35742C2.45605 4.65879 4.64771 2.46191 7.33984 2.46191H11.0537C11.7314 2.46178 12.2811 1.91081 12.2812 1.23145C12.2812 0.551948 11.7315 0.000138598 11.0537 0H7.33984Z" fill={TEXT_TERTIARY} />
        </FeedbackIcon>
        <FeedbackIcon>
          <path d="M15.8549 11.6642C14.5527 11.6642 13.3996 12.2839 12.6441 13.2334L8.21074 10.8046C8.26044 10.5447 8.29026 10.2749 8.29026 10.005C8.29026 9.73513 8.26044 9.46527 8.21074 9.2054L12.6441 6.77661C13.3996 7.72614 14.5527 8.34583 15.8549 8.34583C18.1412 8.34583 20 6.47676 20 4.17791C20 1.87906 18.1412 0 15.8549 0C13.5686 0 11.7097 1.86907 11.7097 4.16792C11.7097 4.25787 11.7296 4.34783 11.7396 4.43778C11.7097 4.44778 11.67 4.44778 11.6402 4.46777L7.01789 7.0065C6.27237 6.28686 5.26839 5.83708 4.15507 5.83708C1.85885 5.82709 0 7.69615 0 9.995C0 12.2939 1.85885 14.1629 4.14513 14.1629C5.25845 14.1629 6.26243 13.7131 7.00795 12.9935L11.6402 15.5322C11.6402 15.5322 11.7097 15.5622 11.7396 15.5722C11.7396 15.6622 11.7097 15.7421 11.7097 15.8321C11.7097 18.1309 13.5686 20 15.8549 20C18.1412 20 20 18.1309 20 15.8321C20 13.5332 18.1412 11.6642 15.8549 11.6642ZM15.8549 2.49875C16.7694 2.49875 17.5149 3.24838 17.5149 4.16792C17.5149 5.08746 16.7694 5.83708 15.8549 5.83708C14.9404 5.83708 14.1948 5.08746 14.1948 4.16792C14.1948 3.24838 14.9404 2.49875 15.8549 2.49875ZM4.14513 11.6642C3.23062 11.6642 2.48509 10.9145 2.48509 9.995C2.48509 9.07546 3.23062 8.32584 4.14513 8.32584C5.05964 8.32584 5.80517 9.07546 5.80517 9.995C5.80517 10.9145 5.05964 11.6642 4.14513 11.6642ZM15.8549 17.4913C14.9404 17.4913 14.1948 16.7416 14.1948 15.8221C14.1948 14.9025 14.9404 14.1529 15.8549 14.1529C16.7694 14.1529 17.5149 14.9025 17.5149 15.8221C17.5149 16.7416 16.7694 17.4913 15.8549 17.4913Z" fill={TEXT_TERTIARY} />
        </FeedbackIcon>
        <FeedbackIcon>
          <path d="M10.0043 0C7.53419 0 5.16449 0.902256 3.27677 2.59649L2.98558 2.88722L2.18229 2.08521C1.97143 1.87469 1.6702 1.81454 1.38905 1.91479C1.11794 2.01504 0.917117 2.26566 0.897034 2.55639L0.545597 6.45614C0.525514 6.67669 0.605843 6.89724 0.7665 7.05764C0.927158 7.21805 1.14806 7.29825 1.36897 7.2782L5.27494 6.92732C5.56614 6.89724 5.81716 6.70677 5.91757 6.43609C6.01798 6.16541 5.9477 5.85464 5.74687 5.64411L4.77289 4.67168L5.01388 4.43108C6.3895 3.19799 8.16677 2.52632 10.0143 2.52632C13.8701 2.52632 17.1636 5.52381 17.4949 9.36341C17.5552 10.015 18.0974 10.5063 18.74 10.5063C18.7802 10.5063 18.8103 10.5063 18.8505 10.5063C19.5433 10.4461 20.0554 9.83459 19.9952 9.15288C19.5433 4.0401 15.1554 0.0300752 10.0143 0.0300752L10.0043 0Z" fill={TEXT_TERTIARY} />
          <path d="M18.7702 12.792L14.8642 13.1429C14.573 13.173 14.322 13.3634 14.2216 13.6341C14.1212 13.9048 14.1914 14.2156 14.3923 14.4261L15.2759 15.3083L15.0048 15.579C13.6291 16.812 11.8519 17.4837 10.0043 17.4938C6.11841 17.4938 2.82494 14.4662 2.51367 10.6065C2.45342 9.91481 1.87104 9.40353 1.15812 9.45365C0.465286 9.5138-0.0468087 10.1153 0.00339671 10.807C0.415081 15.9699 4.80303 20 9.99427 20C12.4644 20 14.8341 19.0877 16.7218 17.4035L17.0431 17.0827L17.9368 17.975C18.1476 18.1855 18.4489 18.2456 18.73 18.1454C19.0011 18.0451 19.2019 17.7945 19.222 17.5038L19.5735 13.604C19.5935 13.3835 19.5132 13.1629 19.3526 13.0025C19.1919 12.8421 18.971 12.7619 18.7501 12.782L18.7702 12.792Z" fill={TEXT_TERTIARY} />
        </FeedbackIcon>
      </div>
      <p
        className="whitespace-pre-line transition-opacity duration-300 ease-out"
        style={{
          ...typography.caption,
          color: TEXT_TERTIARY,
          marginTop: SPACE_M,
          textAlign: "right",
          marginLeft: "25%",
          opacity: showDisclaimer ? 1 : 0,
        }}
      >
        {"Ryan is AI and can make mistakes.\nAlways double-check responses."}
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Floating app bar — matches RefreshSession FloatingAppBar 1:1
// ══════════════════════════════════════════════════════════════════

function FloatingAppBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10" style={{ pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}>
        <StatusBar backgroundColor="transparent" />
        <div className="flex items-center" style={{ padding: "8px 12px 8px 8px" }}>
          <div style={{ width: 48, height: 48, display: "flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex items-center justify-center rounded-full bg-white"
              style={{
                width: 48,
                height: 48,
                border: `1px solid ${OUTLINE_SUBTLE}`,
                boxShadow: ELEVATION_CARD,
                cursor: "pointer",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_PRIMARY} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div style={{ flex: 1, textAlign: "center", ...typography.headerH4, color: TEXT_PRIMARY }}>
            Ryan
          </div>
          <div style={{ width: 48, height: 48 }} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Pay screen + pill
// ══════════════════════════════════════════════════════════════════

function PillSparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.37348 17.51C10.063 17.51 10.6126 18.07 10.6126 18.75V18.76C10.6126 19.45 10.053 20 9.37348 20H5.57612C2.49826 20 0 17.47 0 14.34V7.58C0.00999304 4.53 2.38834 2.05 5.36627 1.93V1.24C5.36627 0.55 5.91588 0 6.58542 0C7.25495 0 7.80457 0.56 7.80457 1.24V1.92H12.2015V1.24C12.2015 0.55 12.7511 0 13.4207 0C14.0902 0 14.6398 0.56 14.6398 1.24V1.93C17.6177 2.06 19.9861 4.53 19.9861 7.58V9.39C19.9861 10.06 19.4365 10.61 18.7669 10.61C18.0974 10.61 17.5478 10.06 17.5478 9.39V7.58C17.5478 5.89 16.2687 4.53 14.6398 4.41V5.11C14.6398 5.8 14.0902 6.35 13.4207 6.35C12.7511 6.35 12.2015 5.79 12.2015 5.11V4.39H7.79457V5.11C7.79457 5.8 7.24496 6.35 6.57542 6.35C5.90589 6.35 5.35627 5.79 5.35627 5.11V4.41C3.72741 4.53 2.4383 5.9 2.4383 7.58V14.34C2.4383 16.1 3.83733 17.52 5.57612 17.52H9.37348V17.51Z"
        fill={ALPHA_WHITE_FF}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1823 15.1301C10.9325 15.2201 10.9425 15.5501 11.1823 15.6401C13.8205 16.5901 14.8498 18.5401 15.2695 19.8001C15.3594 20.0701 15.7292 20.0701 15.8191 19.8001C16.6985 17.1601 18.7071 16.0101 19.8263 15.5501C20.0661 15.4501 20.0562 15.1101 19.8063 15.0201C17.1082 14.0201 16.1089 11.9401 15.7392 10.6801C15.6592 10.4401 15.3294 10.4501 15.2595 10.6801C14.3601 13.5601 12.3415 14.7001 11.1723 15.1201V15.1401L11.1823 15.1301Z"
        fill={ALPHA_WHITE_FF}
      />
    </svg>
  );
}

function PayScreen({
  onPillTap,
  pillLabel,
  ryanReady,
}: {
  onPillTap: () => void;
  pillLabel: string;
  ryanReady: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src="/pay-screen.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div style={{ position: "absolute", top: "17%", left: 0, right: 0 }}>
        <div
          className="flex items-center overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ gap: SPACE_S, paddingLeft: SPACE_M, paddingRight: SPACE_M }}
        >
          {V2_PILLS.map((pill, idx) => (
            <button
              key={pill.id}
              type="button"
              onClick={pill.tappable ? onPillTap : undefined}
              className={`flex items-center shrink-0 transition-transform active:scale-[0.97]${idx === 0 && ryanReady ? " animate-bounce" : ""}`}
              style={{
                gap: 4,
                backgroundColor: "#d827dc",
                border: `1.5px solid ${ALPHA_WHITE_05}`,
                borderRadius: 32,
                padding: "10px 16px",
                cursor: pill.tappable ? "pointer" : "default",
              }}
            >
              {pill.icon === "sparkle" || (idx === 0 && ryanReady) ? (
                <PillSparkleIcon />
              ) : (
                <img src={pill.icon} alt="" style={{ width: 16, height: 16 }} />
              )}
              <span
                style={{
                  ...typography.caption,
                  color: "rgba(255,255,255,0.9)",
                  whiteSpace: "nowrap",
                }}
              >
                {idx === 0 ? pillLabel : pill.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Step sequence
// ══════════════════════════════════════════════════════════════════

type Step =
  | { kind: "ryan"; text: string }
  | { kind: "aa-chips" }
  | { kind: "aa-linked-chips" }
  | { kind: "wrapped" }
  | { kind: "preferences" }
  | { kind: "clarify-chips"; questionIndex: number }
  | { kind: "plan-crunching" }
  | { kind: "ready" };

const STEPS: Step[] = [
  ...PRE_WRAPPED_BUBBLES.map((text) => ({ kind: "ryan" as const, text })),
  { kind: "wrapped" },
  ...POST_WRAPPED_PRE_AA_BUBBLES.map((text) => ({ kind: "ryan" as const, text })),
  { kind: "aa-chips" },
  { kind: "ryan" as const, text: V2_AA_LINKED_BUBBLE },
  { kind: "aa-linked-chips" },
  ...V2_POST_AA_PREF_BUBBLES.map((text) => ({ kind: "ryan" as const, text })),
  { kind: "preferences" },
  ...V2_POST_PREF_BUBBLES.map((text) => ({ kind: "ryan" as const, text })),
  // ── PAUSE — user exits, 5s on purple, pill updates, user re-enters ──
  // ── Clarifying questions (after re-entry) ──
  { kind: "ryan" as const, text: V2_CLARIFYING_QUESTIONS[0].botText },
  { kind: "clarify-chips", questionIndex: 0 },
  { kind: "ryan" as const, text: V2_CLARIFYING_QUESTIONS[1].botText },
  { kind: "clarify-chips", questionIndex: 1 },
  { kind: "ryan" as const, text: V2_CLARIFYING_QUESTIONS[2].botText },
  { kind: "clarify-chips", questionIndex: 2 },
  { kind: "ryan" as const, text: "Thanks — give me a moment while I crunch the numbers." },
  { kind: "plan-crunching" },
  { kind: "ryan" as const, text: V2_VERBOSE_PLAN_TEXT },
  { kind: "ready" },
];

const LAST_STEP_INDEX = STEPS.length - 1;

// Pause point — last post-pref bubble; user must exit + re-enter
const PAUSE_STEP_INDEX = STEPS.findIndex((s) => s.kind === "ryan" && (s as { text: string }).text === V2_POST_PREF_BUBBLES[V2_POST_PREF_BUBBLES.length - 1]);

// Plan-crunching step — idle text cycle controls advancement
const CRUNCH_STEP_INDEX = STEPS.findIndex((s) => s.kind === "plan-crunching");

// First step after wrapped — this is where we scroll to after story closes
const POST_WRAPPED_STEP_INDEX = STEPS.findIndex((s) => s.kind === "wrapped") + 1;

// Ryan's text line — plain text, typewriter on first reveal, full text afterwards
function RyanLine({
  text,
  active,
  onDone,
}: {
  text: string;
  active: boolean;
  onDone?: () => void;
}) {
  const displayed = useTypewriter(text, active, onDone);
  return (
    <p
      className="whitespace-pre-line animate-chat-message-in"
      style={{ ...typography.bodySmall, color: TEXT_PRIMARY, marginTop: SPACE_M }}
    >
      {highlightValues(displayed)}
    </p>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Main sim
// ══════════════════════════════════════════════════════════════════

export default function OnboardingSimV3() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [aaChipPicked, setAaChipPicked] = useState<string | null>(null);
  const [aaLinkedChipPicked, setAaLinkedChipPicked] = useState<string | null>(null);
  const [wrappedState, setWrappedState] = useState<V2WrappedCardState>("pending");
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyPhase, setStoryPhase] = useState<"idle" | "expanding" | "open" | "collapsing">("idle");
  const [storyRect, setStoryRect] = useState<DOMRect | null>(null);
  const [storyStartBeat, setStoryStartBeat] = useState<number | undefined>(undefined);
  const [aaFlowOpen, setAaFlowOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Preference questionnaire
  const [prefQuizOpen, setPrefQuizOpen] = useState(false);
  const [prefQuizIndex, setPrefQuizIndex] = useState(0);
  const [prefAnswers, setPrefAnswers] = useState<Record<string, string>>({});

  // Cruncher
  const [cruncherVisible, setCruncherVisible] = useState(false);
  const [cruncherStatus, setCruncherStatus] = useState("Gathering your preferences");
  const [cruncherDone, setCruncherDone] = useState(false);
  const [goalLabel, setGoalLabel] = useState("Your goal");

  // Clarifying questions
  const [clarifyPicked, setClarifyPicked] = useState<Record<number, string>>({});

  // Ready signal
  const [ryanReady, setRyanReady] = useState(false);
  const [pillLabel, setPillLabel] = useState("Meet Ryan");

  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrappedCardRef = useRef<HTMLDivElement>(null);
  const postWrappedRef = useRef<HTMLDivElement>(null);
  const userBubbleRef = useRef<HTMLDivElement>(null);

  // Snap-scroll a target element to just below the fixed chrome (app bar + cruncher), eased 400ms
  const snapScrollTo = useCallback((el: HTMLElement, delay = 300) => {
    window.setTimeout(() => {
      const scroller = scrollRef.current;
      const content = contentRef.current;
      if (!scroller || !content) return;

      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elTopInScroller = elRect.top - scrollerRect.top + scroller.scrollTop;
      // Position element just below the fixed chrome zone (app bar + cruncher if visible)
      const chromeHeight = cruncherVisible ? 180 : 108;
      const target = Math.max(0, elTopInScroller - chromeHeight - 8);

      const minHeight = target + scroller.clientHeight;
      if (content.scrollHeight < minHeight) {
        content.style.minHeight = `${minHeight}px`;
      }

      const start = scroller.scrollTop;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;
      const duration = 400;
      const startTime = performance.now();
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        scroller.scrollTop = start + distance * ease(progress);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
  }, [cruncherVisible]);

  // Map Question type for overlay
  const prefQuestions: Question[] = V2_GOAL_PREFERENCE_QUESTIONS.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options,
  }));

  const advanceStep = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, LAST_STEP_INDEX));
  }, []);

  const openOverlay = useCallback(() => {
    setOverlayMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOverlayOpen(true)));
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    window.setTimeout(() => {
      setOverlayMounted(false);
      // Only full-reset if AA hasn't completed yet
      if (!aaChipPicked) {
        setStepIndex(0);
        setAaChipPicked(null);
        setAaLinkedChipPicked(null);
        setWrappedState("pending");
        setStoryOpen(false);
        setAaFlowOpen(false);
        setPrefQuizOpen(false);
        setPrefQuizIndex(0);
        setPrefAnswers({});
        setCruncherVisible(false);
        setCruncherStatus("Gathering your preferences");
        setCruncherDone(false);
        setClarifyPicked({});
        setGoalLabel("Your goal");
        setRyanReady(false);
        setPillLabel("Meet Ryan");
      }
    }, OVERLAY_DURATION);
  }, [aaChipPicked]);

  // Track scroll for top fade gradient
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHasScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [overlayOpen]);

  // Auto-scroll as content grows (Ryan lines, cruncher, etc.)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [stepIndex, wrappedState, cruncherVisible, cruncherDone]);

  // Snap-scroll user bubbles to top when a chip is picked or prefs complete
  const hasUserBubble = aaChipPicked || aaLinkedChipPicked || cruncherVisible || Object.keys(clarifyPicked).length > 0;
  useEffect(() => {
    if (!hasUserBubble) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = userBubbleRef.current;
      if (el) snapScrollTo(el);
    }));
  }, [hasUserBubble, snapScrollTo]);

  // ── After user exits chat with cruncher running — 5s pill update ──

  useEffect(() => {
    if (overlayOpen || !cruncherVisible || ryanReady) return;
    const t = window.setTimeout(() => {
      setRyanReady(true);
      setPillLabel("Ryan is ready");
    }, 5000);
    return () => window.clearTimeout(t);
  }, [overlayOpen, cruncherVisible, ryanReady]);

  // When user re-opens overlay after pill updated, start clarifying flow
  useEffect(() => {
    if (overlayOpen && ryanReady && stepIndex === PAUSE_STEP_INDEX) {
      setCruncherStatus(V2_CLARIFY_CRUNCHER_STATUSES[0]);
      advanceStep();
    }
  }, [overlayOpen, ryanReady, stepIndex, advanceStep]);

  // Plan-crunching step — cycle idle texts then advance
  useEffect(() => {
    if (STEPS[stepIndex]?.kind !== "plan-crunching") return;
    let idx = 0;
    setCruncherStatus(V2_IDLE_CRUNCHER_TEXTS[0]);
    const timer = window.setInterval(() => {
      idx += 1;
      if (idx >= V2_IDLE_CRUNCHER_TEXTS.length) {
        clearInterval(timer);
        window.setTimeout(() => {
          setCruncherVisible(false);
          setCruncherDone(true);
          advanceStep();
        }, 1500);
        return;
      }
      setCruncherStatus(V2_IDLE_CRUNCHER_TEXTS[idx]);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [stepIndex, advanceStep]);

  // ── AA actions ────────────────────────────────────────

  const handleAAConnect = useCallback(() => {
    setAaFlowOpen(true);
  }, []);

  const handleAAComplete = useCallback(() => {
    setAaFlowOpen(false);
    // Advance past aa-chips to the linked bubble + linked chips
    advanceStep();
  }, [advanceStep]);

  const handleAAClose = useCallback(() => {
    setAaFlowOpen(false);
  }, []);

  // ── Wrapped actions ───────────────────────────────────

  const openStory = useCallback((beatIndex?: number) => {
    setStoryStartBeat(beatIndex);
    setStoryOpen(true);
    setStoryPhase("expanding");
    // Let the fade-in start on next frame
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setStoryPhase("open");
    }));
  }, []);

  const closeStory = useCallback(() => {
    setStoryPhase("collapsing");
    window.setTimeout(() => {
      setStoryOpen(false);
      setStoryPhase("idle");
      setStoryStartBeat(undefined);
      if (wrappedState === "pending") {
        setWrappedState("viewed");
        // Mount Ryan's post-wrapped line first, then snap-scroll it into focus
        advanceStep();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const el = postWrappedRef.current;
          if (el) snapScrollTo(el);
        }));
      }
    }, 300);
  }, [advanceStep, wrappedState]);

  // ── Preference quiz actions ───────────────────────────

  const finishQuiz = useCallback((answers: Record<string, string>) => {
    const goalType = V2_GOAL_PREFERENCE_QUESTIONS[0].options.find((o) => o.id === answers["goal-type"])?.label || "Your goal";
    const dest = answers["destination"] || "";
    setGoalLabel(dest ? `Trip to ${dest}` : goalType);
    setPrefQuizOpen(false);
    setCruncherVisible(true);
    advanceStep();
  }, [advanceStep]);

  const handlePrefSelect = useCallback((questionId: string, option: QuestionOption) => {
    const next = { ...prefAnswers, [questionId]: option.id };
    setPrefAnswers(next);
    // Skip destination for non-trip goals
    let nextIdx = prefQuizIndex + 1;
    if (questionId === "goal-type" && option.id !== "trip") {
      // destination is index 1 — skip it
      const destIdx = prefQuestions.findIndex((q) => q.id === "destination");
      if (destIdx === nextIdx) nextIdx += 1;
    }
    if (nextIdx < prefQuestions.length) {
      setPrefQuizIndex(nextIdx);
    } else {
      finishQuiz(next);
    }
  }, [prefQuizIndex, prefQuestions, prefAnswers, finishQuiz]);

  const handlePrefFreeText = useCallback((questionId: string, text: string) => {
    const next = { ...prefAnswers, [questionId]: text };
    setPrefAnswers(next);
    const nextIdx = prefQuizIndex + 1;
    if (nextIdx < prefQuestions.length) {
      setPrefQuizIndex(nextIdx);
    } else {
      finishQuiz(next);
    }
  }, [prefQuizIndex, prefQuestions, prefAnswers, finishQuiz]);

  const handlePrefNavigate = useCallback((direction: "prev" | "next") => {
    setPrefQuizIndex((prev) => {
      if (direction === "prev") return Math.max(0, prev - 1);
      return Math.min(prefQuestions.length - 1, prev + 1);
    });
  }, [prefQuestions.length]);

  const handlePrefClose = useCallback(() => {
    setPrefQuizOpen(false);
  }, []);

  // When the preferences step becomes active, open the quiz
  useEffect(() => {
    if (STEPS[stepIndex]?.kind === "preferences" && !prefQuizOpen && Object.keys(prefAnswers).length === 0) {
      const t = window.setTimeout(() => setPrefQuizOpen(true), 400);
      return () => window.clearTimeout(t);
    }
  }, [stepIndex, prefQuizOpen, prefAnswers]);

  // ── Render the chat content ───────────────────────────

  const visibleSteps = STEPS.slice(0, stepIndex + 1);
  const isOnReady = STEPS[stepIndex]?.kind === "ready";

  // Top clearance increases when cruncher is visible
  const topClearance = cruncherVisible ? 180 : 108;

  const chatContent = (
    <div ref={scrollRef} className="absolute inset-0 w-full overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div ref={contentRef} className="flex flex-col" style={{ paddingLeft: SPACE_L, paddingRight: SPACE_L }}>
        {/* Clearance for floating app bar + cruncher */}
        <div className="shrink-0" aria-hidden="true" style={{ height: topClearance, transition: "height 300ms ease" }} />

        {visibleSteps.map((step, i) => {
          const isLast = i === stepIndex;

          if (step.kind === "ryan") {
            // Don't auto-advance past filler — the cruncher controls that
            const shouldAutoAdvance = isLast && (i + 1 !== PAUSE_STEP_INDEX + 1);
            const isPostWrapped = i === POST_WRAPPED_STEP_INDEX;
            return (
              <div key={`ryan-${i}`} ref={isPostWrapped ? postWrappedRef : undefined}>
                <RyanLine
                  text={step.text}
                  active={isLast}
                  onDone={shouldAutoAdvance ? advanceStep : undefined}
                />
              </div>
            );
          }

          if (step.kind === "aa-chips") {
            if (aaChipPicked) {
              return (
                <div ref={userBubbleRef} key={`aa-chips-${i}`} className="flex justify-end animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                  <div className="max-w-[75%] rounded-[16px] rounded-tr-lg" style={{ backgroundColor: "#FAE2FA", padding: "12px 16px" }}>
                    <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>Connect now</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={`aa-chips-${i}`} className="flex flex-wrap gap-3 animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                <button
                  type="button"
                  onClick={() => {
                    setAaChipPicked("connect");
                    setAaFlowOpen(true);
                  }}
                  className="transition-transform active:scale-[0.97]"
                  style={{
                    ...typography.buttonSmall,
                    color: TEXT_PRIMARY,
                    backgroundColor: BG_SECONDARY,
                    border: `1px solid ${OUTLINE_SUBTLE}`,
                    borderRadius: 100,
                    padding: `${SPACE_XS}px ${SPACE_M}px`,
                    cursor: "pointer",
                  }}
                >
                  Connect now
                </button>
              </div>
            );
          }

          if (step.kind === "aa-linked-chips") {
            if (aaLinkedChipPicked) {
              const chip = V2_AA_POST_LINKED_CHIPS.find((c) => c.id === aaLinkedChipPicked);
              return (
                <div ref={userBubbleRef} key={`aa-linked-${i}`} className="flex justify-end animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                  <div className="max-w-[75%] rounded-[16px] rounded-tr-lg" style={{ backgroundColor: "#FAE2FA", padding: "12px 16px" }}>
                    <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>{chip?.label}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={`aa-linked-${i}`} className="flex flex-wrap gap-3 animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                {V2_AA_POST_LINKED_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      setAaLinkedChipPicked(chip.id);
                      if (chip.id === "add-another") {
                        setAaFlowOpen(true);
                      } else {
                        advanceStep();
                      }
                    }}
                    className="transition-transform active:scale-[0.97]"
                    style={{
                      ...typography.buttonSmall,
                      color: TEXT_PRIMARY,
                      backgroundColor: BG_SECONDARY,
                      border: `1px solid ${OUTLINE_SUBTLE}`,
                      borderRadius: 100,
                      padding: `${SPACE_XS}px ${SPACE_M}px`,
                      cursor: "pointer",
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            );
          }

          if (step.kind === "wrapped") {
            return (
              <div key={`wrapped-${i}`} ref={wrappedCardRef} style={{ marginTop: SPACE_L }} className="animate-chat-message-in">
                <V2WrappedCard state={wrappedState} onOpen={() => openStory()} onTapBeat={(beatIdx) => openStory(beatIdx)} />
              </div>
            );
          }

          if (step.kind === "preferences") {
            if (cruncherVisible) {
              return (
                <div
                  ref={userBubbleRef}
                  key={`pref-${i}`}
                  className="flex justify-end animate-chat-message-in"
                  style={{ marginTop: SPACE_L }}
                >
                  <div
                    className="max-w-[75%] rounded-[16px] rounded-tr-lg"
                    style={{ backgroundColor: "#FAE2FA", padding: "12px 16px" }}
                  >
                    <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>Shared preferences</p>
                  </div>
                </div>
              );
            }
            return null;
          }

          if (step.kind === "clarify-chips") {
            const qIdx = step.questionIndex;
            const cq = V2_CLARIFYING_QUESTIONS[qIdx];
            if (clarifyPicked[qIdx] != null) {
              const chip = cq.chips.find((c) => c.id === clarifyPicked[qIdx]);
              return (
                <div ref={userBubbleRef} key={`clarify-${qIdx}-${i}`} className="flex justify-end animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                  <div className="max-w-[75%] rounded-[16px] rounded-tr-lg" style={{ backgroundColor: "#FAE2FA", padding: "12px 16px" }}>
                    <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>{chip?.label}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={`clarify-${qIdx}-${i}`} className="flex flex-wrap gap-3 animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                {cq.chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      setClarifyPicked((prev) => ({ ...prev, [qIdx]: chip.id }));
                      // Update cruncher status for the next question
                      const nextQIdx = qIdx + 1;
                      if (nextQIdx < V2_CLARIFY_CRUNCHER_STATUSES.length) {
                        setCruncherStatus(V2_CLARIFY_CRUNCHER_STATUSES[nextQIdx]);
                      }
                      advanceStep();
                    }}
                    className="transition-transform active:scale-[0.97]"
                    style={{
                      ...typography.buttonSmall,
                      color: TEXT_PRIMARY,
                      backgroundColor: BG_SECONDARY,
                      border: `1px solid ${OUTLINE_SUBTLE}`,
                      borderRadius: 100,
                      padding: `${SPACE_XS}px ${SPACE_M}px`,
                      cursor: "pointer",
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            );
          }

          if (step.kind === "plan-crunching") {
            return null;
          }

          if (step.kind === "ready") {
            return (
              <div key={`ready-${i}`} className="animate-chat-message-in" style={{ marginTop: SPACE_M }}>
                <FeedbackRow />
              </div>
            );
          }

          return null;
        })}

        {/* Bottom spacer for breathing room */}
        <div className="shrink-0" aria-hidden="true" style={{ height: prefQuizOpen ? 260 : 80 }} />
      </div>
    </div>
  );

  return (
    <div
      data-phone-frame
      className="relative h-full w-full overflow-hidden"
      style={{ fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif" }}
    >
      {/* Layer 0: Pay screen */}
      <PayScreen onPillTap={openOverlay} pillLabel={pillLabel} ryanReady={ryanReady} />

      {/* Layer 1: Chat overlay */}
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundColor: BG_PRIMARY,
          transform: overlayOpen ? "translateY(0%)" : "translateY(100%)",
          transition: `transform ${OVERLAY_DURATION}ms ${EASE}`,
          willChange: "transform",
        }}
      >
        <FloatingAppBar onClose={closeOverlay} />

        {/* PlanCruncherV2 — below app bar */}
        {overlayMounted && cruncherVisible && (
          <div className="absolute left-4 right-4 z-10" style={{ top: 108 }}>
            <PlanCruncherV2
              goalName={goalLabel}
              visible={cruncherVisible}
              statusText={cruncherStatus}
              completed={cruncherDone}
              completedSubtitle="Your spending snapshot is ready"
            />
          </div>
        )}

        {overlayMounted && (
          <>
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

            {chatContent}

            {/* QuestionnaireOverlay */}
            {prefQuizOpen && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <QuestionnaireOverlay
                  questions={prefQuestions}
                  currentIndex={prefQuizIndex}
                  answers={prefAnswers}
                  onSelectOption={handlePrefSelect}
                  onSubmitFreeText={handlePrefFreeText}
                  onNavigate={handlePrefNavigate}
                  onClose={handlePrefClose}
                />
              </div>
            )}
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0">
          <GestureNav backgroundColor="transparent" />
        </div>
      </div>

      {/* Layer 2: Wrapped story — fade crossfade */}
      {storyOpen && (
        <div
          className="absolute inset-0 z-30"
          style={{
            opacity: storyPhase === "expanding" ? 0 : storyPhase === "collapsing" ? 0 : 1,
            transform: storyPhase === "expanding" ? "scale(0.97)" : storyPhase === "collapsing" ? "scale(0.97)" : "scale(1)",
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
        >
          <V2WrappedStory onClose={closeStory} startAtBeat={storyStartBeat} />
        </div>
      )}

      {/* Layer 3: AA flow */}
      <div
        className="absolute inset-0 z-30"
        style={{
          transform: aaFlowOpen ? "translateY(0%)" : "translateY(100%)",
          transition: `transform ${OVERLAY_DURATION}ms ${EASE}`,
          willChange: "transform",
          pointerEvents: aaFlowOpen ? "auto" : "none",
        }}
      >
        {aaFlowOpen && <AASim onComplete={handleAAComplete} onClose={handleAAClose} />}
      </div>
    </div>
  );
}
