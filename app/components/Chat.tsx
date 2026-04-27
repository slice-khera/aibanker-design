"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InitialPromptContent, type InitialSuggestion, type AlertScenario } from "./ChatInitialScreen";
import ChatCard, { type ChatCardData } from "./ChatCards";
import { AppBar, FooterInset, GestureNav, NavButton } from "./AppChrome";
import { typography } from "../lib/typography";
import { ILLUST_AFFORD_IT, ILLUST_MY_SPENDS, ILLUST_FEEDBACK } from "../lib/illustrations";
import {
  VALENTINO_500, VALENTINO_50, GREEN_500, GREEN_50, ORANGE_500, ORANGE_50,
  BG_SURFACE, BG_SURFACE_2, BG_SECONDARY, BLUE_50, RED_50, OUTLINE_SUBTLE, TEXT_PRIMARY,
} from "../lib/colors";
import { RADIUS_PILL } from "../lib/radii";
import { SPACE_XS, SPACE_M } from "../lib/spacing";

// ── Feedback row (inline SVGs with proper color tokens) ─────────

const TEXT_TERTIARY_CHAT = "rgba(0,0,0,0.5)";

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
        <FeedbackIcon><path d="M12.3563 19.99H12.3363L5.0788 19.96C2.89954 19.96 1.04018 18.3706 0.760277 16.2813L0.0405238 11.103C-0.129418 9.91346 0.240455 8.70387 1.05018 7.78418L6.88818 1.3164C7.55795 0.426705 8.78753-0.103114 10.0171 0.0168451C11.0767 0.116811 12.0164 0.646629 12.6262 1.49634C13.236 2.34605 13.4059 3.39569 13.126 4.38535L12.5862 6.18473L14.7955 5.87484C16.4149 5.64492 17.9844 6.25471 19.004 7.48429C20.0237 8.72386 20.2836 10.3433 19.6938 11.8228L17.9144 16.3013C17.0347 18.5205 14.8055 20 12.3663 20L12.3563 19.99ZM9.68722 2.476C9.37733 2.476 9.06743 2.62595 8.8775 2.86587L2.98951 9.41363C2.66962 9.7835 2.51967 10.2833 2.57965 10.7732L3.29941 15.9514C3.41937 16.8211 4.1891 17.4709 5.08879 17.4809L12.3463 17.5109H12.3563C13.7458 17.5109 15.0154 16.6711 15.5152 15.4016L17.2946 10.9231C17.5545 10.2733 17.4346 9.57357 16.9947 9.03376C16.5549 8.49394 15.8651 8.23403 15.1553 8.324L10.9668 8.9138C10.5369 8.97378 10.0971 8.81383 9.81717 8.49394C9.52727 8.17405 9.43731 7.7342 9.55726 7.33434L10.6569 3.69558C10.7668 3.32571 10.6069 3.03581 10.5169 2.89586C10.427 2.75591 10.187 2.51599 9.78719 2.476C9.7572 2.476 9.72721 2.476 9.69722 2.476H9.68722Z" fill={TEXT_TERTIARY_CHAT} /></FeedbackIcon>
        <FeedbackIcon><path d="M7.6484 0.00999641H7.66839L14.9259 0.0399876C17.1052 0.0399876 18.9645 1.62944 19.2444 3.71873L19.9642 8.89695C20.1341 10.0865 19.7642 11.2961 18.9545 12.2158L13.1165 18.6836C12.4468 19.5733 11.2172 20.1031 9.9876 19.9832C8.92796 19.8832 7.98828 19.3534 7.37849 18.5037C6.7687 17.654 6.59876 16.6043 6.87866 15.6147L7.41848 13.8153L5.20923 14.1252C3.58979 14.3551 2.02033 13.7453 1.00067 12.5157C-0.0189768 11.2761-0.278887 9.65669 0.310911 8.1772L2.0903 3.69873C2.97 1.47949 5.19924 0 7.6384 0L7.6484 0.00999641ZM10.3175 17.524C10.6274 17.524 10.9373 17.374 11.1272 17.1341L17.0152 10.5864C17.3351 10.2165 17.485 9.71667 17.425 9.22684L16.7053 4.04861C16.5853 3.17891 15.8156 2.52913 14.9159 2.51914L7.65839 2.48915H7.6484C6.25887 2.48915 4.98931 3.32886 4.48948 4.59842L2.71009 9.07689C2.45018 9.72667 2.57014 10.4264 3.00999 10.9662C3.44984 11.5061 4.1396 11.766 4.84936 11.676L9.03792 11.0862C9.46777 11.0262 9.90762 11.1862 10.1875 11.5061C10.4774 11.8259 10.5674 12.2658 10.4474 12.6657L9.34782 16.3044C9.23785 16.6743 9.3978 16.9642 9.48777 17.1041C9.57774 17.2441 9.81765 17.484 10.2175 17.524C10.2475 17.524 10.2775 17.524 10.3075 17.524H10.3175Z" fill={TEXT_TERTIARY_CHAT} /></FeedbackIcon>
        <FeedbackIcon viewBox="0 0 18 18"><path fillRule="evenodd" clipRule="evenodd" d="M8.05664 3.88672C5.77725 3.88681 3.91992 5.74829 3.91992 8.0332V13.8535C3.91992 16.1384 5.77725 17.9999 8.05664 18H13.8633C16.1427 18 18 16.1385 18 13.8535V8.0332C18 5.74823 16.1427 3.88672 13.8633 3.88672H8.05664ZM13.8633 6.36816C14.777 6.36816 15.5244 7.11724 15.5244 8.0332V13.8535C15.5244 14.7695 14.777 15.5176 13.8633 15.5176H8.05664C7.14297 15.5175 6.39648 14.7694 6.39648 13.8535V8.0332C6.39648 7.1173 7.14296 6.36826 8.05664 6.36816H13.8633Z" fill={TEXT_TERTIARY_CHAT} /><path d="M7.33984 0C3.29182 0 0 3.29962 0 7.35742V11.0801C0 11.7597 0.55057 12.3115 1.22852 12.3115C1.9063 12.3113 2.45605 11.7595 2.45605 11.0801V7.35742C2.45605 4.65879 4.64771 2.46191 7.33984 2.46191H11.0537C11.7314 2.46178 12.2811 1.91081 12.2812 1.23145C12.2812 0.551948 11.7315 0.000138598 11.0537 0H7.33984Z" fill={TEXT_TERTIARY_CHAT} /></FeedbackIcon>
        <FeedbackIcon><path d="M15.8549 11.6642C14.5527 11.6642 13.3996 12.2839 12.6441 13.2334L8.21074 10.8046C8.26044 10.5447 8.29026 10.2749 8.29026 10.005C8.29026 9.73513 8.26044 9.46527 8.21074 9.2054L12.6441 6.77661C13.3996 7.72614 14.5527 8.34583 15.8549 8.34583C18.1412 8.34583 20 6.47676 20 4.17791C20 1.87906 18.1412 0 15.8549 0C13.5686 0 11.7097 1.86907 11.7097 4.16792C11.7097 4.25787 11.7296 4.34783 11.7396 4.43778C11.7097 4.44778 11.67 4.44778 11.6402 4.46777L7.01789 7.0065C6.27237 6.28686 5.26839 5.83708 4.15507 5.83708C1.85885 5.82709 0 7.69615 0 9.995C0 12.2939 1.85885 14.1629 4.14513 14.1629C5.25845 14.1629 6.26243 13.7131 7.00795 12.9935L11.6402 15.5322C11.6402 15.5322 11.7097 15.5622 11.7396 15.5722C11.7396 15.6622 11.7097 15.7421 11.7097 15.8321C11.7097 18.1309 13.5686 20 15.8549 20C18.1412 20 20 18.1309 20 15.8321C20 13.5332 18.1412 11.6642 15.8549 11.6642ZM15.8549 2.49875C16.7694 2.49875 17.5149 3.24838 17.5149 4.16792C17.5149 5.08746 16.7694 5.83708 15.8549 5.83708C14.9404 5.83708 14.1948 5.08746 14.1948 4.16792C14.1948 3.24838 14.9404 2.49875 15.8549 2.49875ZM4.14513 11.6642C3.23062 11.6642 2.48509 10.9145 2.48509 9.995C2.48509 9.07546 3.23062 8.32584 4.14513 8.32584C5.05964 8.32584 5.80517 9.07546 5.80517 9.995C5.80517 10.9145 5.05964 11.6642 4.14513 11.6642ZM15.8549 17.4913C14.9404 17.4913 14.1948 16.7416 14.1948 15.8221C14.1948 14.9025 14.9404 14.1529 15.8549 14.1529C16.7694 14.1529 17.5149 14.9025 17.5149 15.8221C17.5149 16.7416 16.7694 17.4913 15.8549 17.4913Z" fill={TEXT_TERTIARY_CHAT} /></FeedbackIcon>
        <FeedbackIcon><path d="M10.0043 0C7.53419 0 5.16449 0.902256 3.27677 2.59649L2.98558 2.88722L2.18229 2.08521C1.97143 1.87469 1.6702 1.81454 1.38905 1.91479C1.11794 2.01504 0.917117 2.26566 0.897034 2.55639L0.545597 6.45614C0.525514 6.67669 0.605843 6.89724 0.7665 7.05764C0.927158 7.21805 1.14806 7.29825 1.36897 7.2782L5.27494 6.92732C5.56614 6.89724 5.81716 6.70677 5.91757 6.43609C6.01798 6.16541 5.9477 5.85464 5.74687 5.64411L4.77289 4.67168L5.01388 4.43108C6.3895 3.19799 8.16677 2.52632 10.0143 2.52632C13.8701 2.52632 17.1636 5.52381 17.4949 9.36341C17.5552 10.015 18.0974 10.5063 18.74 10.5063C18.7802 10.5063 18.8103 10.5063 18.8505 10.5063C19.5433 10.4461 20.0554 9.83459 19.9952 9.15288C19.5433 4.0401 15.1554 0.0300752 10.0143 0.0300752L10.0043 0Z" fill={TEXT_TERTIARY_CHAT} /><path d="M18.7702 12.792L14.8642 13.1429C14.573 13.173 14.322 13.3634 14.2216 13.6341C14.1212 13.9048 14.1914 14.2156 14.3923 14.4261L15.2759 15.3083L15.0048 15.579C13.6291 16.812 11.8519 17.4837 10.0043 17.4938C6.11841 17.4938 2.82494 14.4662 2.51367 10.6065C2.45342 9.91481 1.87104 9.40353 1.15812 9.45365C0.465286 9.5138-0.0468087 10.1153 0.00339671 10.807C0.415081 15.9699 4.80303 20 9.99427 20C12.4644 20 14.8341 19.0877 16.7218 17.4035L17.0431 17.0827L17.9368 17.975C18.1476 18.1855 18.4489 18.2456 18.73 18.1454C19.0011 18.0451 19.2019 17.7945 19.222 17.5038L19.5735 13.604C19.5935 13.3835 19.5132 13.1629 19.3526 13.0025C19.1919 12.8421 18.971 12.7619 18.7501 12.782L18.7702 12.792Z" fill={TEXT_TERTIARY_CHAT} /></FeedbackIcon>
      </div>
      <p
        className="whitespace-pre-line transition-opacity duration-300 ease-out"
        style={{
          ...typography.caption,
          color: TEXT_TERTIARY_CHAT,
          marginTop: 20,
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

// ── Highlight currency, percentage, and **bold** markers in assistant text ──
const HIGHLIGHT_RE = /\*\*(.+?)\*\*|₹[\d,.]+\s*[Lk]?|[\d,.]+%/g;

function highlightValues(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = HIGHLIGHT_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const boldText = match[1] ?? match[0];
    parts.push(
      <span key={match.index} style={typography.buttonSmall}>{boldText}</span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

// ── Token-speed typewriter for scripted assistant messages ──
// Reveals text ~3-5 chars at a time at ~30ms, matching Claude's streaming cadence.
export function useTypewriter(fullText: string, active: boolean, onComplete?: () => void) {
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

    // Reset for new text
    posRef.current = 0;
    completeCalled.current = false;
    setDisplayed("");

    const tick = () => {
      const chunkSize = 3 + Math.floor(Math.random() * 3); // 3-5 chars
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
      const delay = 20 + Math.random() * 20; // 20-40ms
      timerRef.current = window.setTimeout(tick, delay);
    };

    // Small initial pause before typing starts
    timerRef.current = window.setTimeout(tick, 80);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fullText, active]);

  return displayed;
}

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  special?: "reality-check" | "goal-pinned" | "insight" | "success";
  card?: ChatCardData;
  streaming?: boolean;
};

export type ChatChip = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "destructive" | "success";
};

// ── Thinking indicator (Claude-style pulsing label) ──
function ThinkingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center" style={{ gap: 8, paddingTop: 4, paddingBottom: 4 }}>
      <p
        className="animate-thinking-pulse text-[var(--chat-text-tertiary)]"
        style={typography.bodySmall}
      >
        {label}
      </p>
    </div>
  );
}

// Assistant reply choreography (single source of truth)
// Total = pre-glow pause + glow animation + post-glow settle.
const ASSISTANT_REPLY_TOTAL_MS = 600;
const ASSISTANT_REPLY_PRE_GLOW_MS = 300;
const ASSISTANT_REPLY_POST_GLOW_MS = 300;
const ASSISTANT_REPLY_GLOW_MS = Math.max(
  0,
  ASSISTANT_REPLY_TOTAL_MS - ASSISTANT_REPLY_PRE_GLOW_MS - ASSISTANT_REPLY_POST_GLOW_MS
);

type HeaderAction = {
  id: string;
  label: string;
  onClick: () => void;
  active?: boolean;
};

type ChatProps = {
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  chips: ChatChip[];
  onChipSelect: (chip: ChatChip) => void;
  showInput?: boolean;
  inputPlaceholder?: string;
  onSubmit?: (value: string) => void;
  headerActions?: HeaderAction[];
  drawerContent?: React.ReactNode;
  pinnedContent?: React.ReactNode;
  showTyping?: boolean;
  onProcessingStateChange?: (isProcessing: boolean) => void;
  appBarDragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onSheetClose?: () => void;
  onSheetExpand?: () => void;
  isSheetMinimized?: boolean;
  sheetTransitionProgress?: number;
  showInitialPrompt?: boolean;
  initialSuggestions?: InitialSuggestion[];
  onInitialSuggestionClick?: (id: string, title: string) => void;
  initialScreenVariant?: "new5" | "review-ontrack" | "review-rent";
  thinkingLabel?: string | null;
  goalTrailingSlot?: React.ReactNode;
  goalPlanBuilder?: React.ReactNode;
  questionnaireOverlay?: React.ReactNode;
  hideStatusBar?: boolean;
  showFeedbackRow?: boolean;
};

function VoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.2">
      <path d="M12 3.75a3 3 0 0 1 3 3v4.5a3 3 0 1 1-6 0v-4.5a3 3 0 0 1 3-3Z" />
      <path d="M6.75 10.5v.75a5.25 5.25 0 0 0 10.5 0v-.75" strokeLinecap="round" />
      <path d="M12 16.5v2.75" strokeLinecap="round" />
      <path d="M9 20.25h6" strokeLinecap="round" />
    </svg>
  );
}

function ChatAppBar({
  dragHandleProps,
  onClose,
  onExpand,
  isSheetMinimized = false,
  hasScrolledContent = false,
  dragHandleOpacity = 1,
  hasUserMessages = false,
  floating = false,
  goalTrailingSlot,
  hideStatusBar = false,
}: {
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onClose?: () => void;
  onExpand?: () => void;
  isSheetMinimized?: boolean;
  hasScrolledContent?: boolean;
  dragHandleOpacity?: number;
  hasUserMessages?: boolean;
  floating?: boolean;
  goalTrailingSlot?: React.ReactNode;
  hideStatusBar?: boolean;
}) {
  if (isSheetMinimized) {
    return (
      <div
        className="w-full bg-white shrink-0 cursor-pointer relative flex items-center"
        style={{ height: 72, paddingLeft: 24, paddingRight: 16 }}
        onClick={onExpand}
        {...dragHandleProps}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-center" style={{ paddingTop: 12 }}>
          <div style={{ width: 36, height: 4, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 100 }} />
        </div>
        <div className="flex items-center w-full">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0 }}>
              {hasUserMessages ? "Continue chat" : "Start chat"}
            </p>
          </div>
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: "rgba(0,0,0,0.05)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 10l5-6 5 6" stroke="rgba(0,0,0,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const closeIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="w-full shrink-0">
      <AppBar
        backgroundColor={floating ? "transparent" : "#fff"}
        title={floating ? "Ryan" : undefined}
        leading={(
          <div onPointerDown={(e) => e.stopPropagation()}>
            {floating ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="flex items-center justify-center rounded-full bg-white"
                style={{ width: 48, height: 48, border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0px 2px 32px 0px rgba(0,0,0,0.05)" }}
              >
                {closeIcon}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, background: "transparent", border: "none", cursor: "pointer", padding: 12 }}
              >
                {closeIcon}
              </button>
            )}
          </div>
        )}
        trailing={goalTrailingSlot}
        hideStatusBar={hideStatusBar}
      />
    </div>
  );
}

function TypeBox({
  value,
  onChange,
  onSubmit,
  placeholder,
  showElevation = false,
  leftAction,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  showElevation?: boolean;
  leftAction?: React.ReactNode;
}) {
  return (
    <>
      <FooterInset
        backgroundColor="transparent"
        paddingX={16}
        paddingTop={8}
        minBottomPadding={0}
      >
        <div className="flex items-center" style={{ gap: 12 }}>
          {leftAction}
          <div
            className="flex items-center overflow-hidden flex-1"
            style={{ height: 48, backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 100, boxShadow: "0px 2px 32px 0px rgba(0,0,0,0.05)" }}
          >
            <div
              className="flex items-center w-full h-full"
              style={{ backgroundColor: "#fff", borderRadius: 100, paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}
            >
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder={placeholder}
                className="flex-1 min-w-0 bg-transparent outline-none"
                style={{
                  ...typography.bodySmall,
                  color: "rgba(0,0,0,0.9)",
                }}
              />
              {value.trim() && (
                <button
                  onClick={onSubmit}
                  className="shrink-0 flex items-center justify-center rounded-full ml-1"
                  style={{ width: 36, height: 36, backgroundColor: "#fff", border: `1px solid ${OUTLINE_SUBTLE}` }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 11V3M3 7l4-4 4 4" stroke={VALENTINO_500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </FooterInset>
      <GestureNav />
    </>
  );
}

function Bubble({ message, typewrite = false }: { message: ChatMessage; typewrite?: boolean }) {
  const isUser = message.role === "user";
  // For streaming messages, text updates come from state — no typewriter needed.
  // For scripted assistant messages that are the latest reveal, typewrite them.
  const shouldTypewrite = typewrite && !isUser && !message.streaming;
  const displayedText = useTypewriter(message.text, shouldTypewrite);

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`} style={{ gap: message.card ? 8 : 0 }}>
      {message.text && (
        isUser ? (
          <div
            className="max-w-[75%] rounded-[16px] rounded-tr-lg"
            style={{
              backgroundColor: VALENTINO_50,
              padding: "12px 16px",
            }}
          >
            <p className="whitespace-pre-line text-[var(--chat-text-primary)]" style={typography.bodySmall}>
              {message.text}
            </p>
          </div>
        ) : (
          <p className="whitespace-pre-line text-[var(--chat-text-primary)] w-full" style={typography.bodySmall}>
            {highlightValues(displayedText)}
          </p>
        )
      )}
      {message.card && (
        <div className="w-full">
          <ChatCard card={message.card} />
        </div>
      )}
    </div>
  );
}

function AssistantOptionsCard({
  message,
  chips,
  onChipSelect,
  showOptions,
  typewrite = false,
}: {
  message: ChatMessage;
  chips: ChatChip[];
  onChipSelect: (chip: ChatChip) => void;
  showOptions: boolean;
  typewrite?: boolean;
}) {
  const surfaceText = message.text;

  // Surface text typeswrites; options card appears once typing is done
  const [surfaceDone, setSurfaceDone] = useState(!typewrite || !surfaceText);

  const onSurfaceComplete = useCallback(() => setSurfaceDone(true), []);

  const displayedSurface = useTypewriter(surfaceText, typewrite && !!surfaceText, onSurfaceComplete);

  // Card with prompt and options appears instantly once surface text finishes
  const resolvedShowOptions = showOptions && surfaceDone;

  return (
    <div className="flex flex-col items-start w-full" style={{ gap: 16 }}>
      {surfaceText && (
        <p className="whitespace-pre-line text-[var(--chat-text-primary)] w-full" style={typography.bodySmall}>
          {highlightValues(displayedSurface)}
        </p>
      )}
      {(surfaceDone || !surfaceText) && (
        <div
          className={`w-full overflow-hidden transition-[max-height,opacity] duration-250 ease-out ${
            resolvedShowOptions ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-3">
            {chips.slice(0, 6).map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onChipSelect(chip)}
                disabled={!resolvedShowOptions}
                className="transition-transform active:scale-[0.97]"
                style={{
                  ...typography.buttonSmall,
                  color: TEXT_PRIMARY,
                  backgroundColor: BG_SECONDARY,
                  border: `1px solid ${OUTLINE_SUBTLE}`,
                  borderRadius: RADIUS_PILL,
                  padding: `${SPACE_XS}px ${SPACE_M}px`,
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionList({
  chips,
  onChipSelect,
  compactTop,
}: {
  chips: ChatChip[];
  onChipSelect: (chip: ChatChip) => void;
  compactTop?: boolean;
}) {
  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${compactTop ? "mt-1" : ""}`}>
      {chips.slice(0, 6).map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onChipSelect(chip)}
          className="transition-transform active:scale-[0.97]"
          style={{
            ...typography.buttonSmall,
            color: TEXT_PRIMARY,
            backgroundColor: BG_SECONDARY,
            border: `1px solid ${OUTLINE_SUBTLE}`,
            borderRadius: RADIUS_PILL,
            padding: `${SPACE_XS}px ${SPACE_M}px`,
          }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

// ── New3 Alert Header — typed title + option list ──────────────
// ── New5 — Text-only with affirmative/negative/neutral options ──
const NEW5_TEXT = "Rajan, your Japan trip is veering off course \u2014 you\u2019ve overspent by \u20B915,000 against what we budgeted. Let\u2019s do some damage control while we still can.";

const NEW5_OPTIONS = [
  "Add ₹5,000 to pot",
  "I'll handle it myself",
  "Show me where I overspent",
];

const MOCK_RESPONSES: Record<string, string> = {
  "Add ₹5,000 to pot": "Done \u2014 \u20B95,000 moved to your Japan trip pot. You\u2019re now \u20B910,000 behind instead of \u20B915,000. I\u2019ve also tightened your dining budget by \u20B92,000 this month to help close the gap faster.",
  "I'll handle it myself": "Got it, I\u2019ll leave it with you. Just a heads up \u2014 if the gap grows past \u20B920,000, your December target starts looking tight. I\u2019ll check in again next week.",
  "Show me where I overspent": "Here\u2019s the breakdown \u2014 dining out was \u20B98,200 (double your usual), shopping hit \u20B94,300, and subscriptions crept up by \u20B92,500. Dining is the big one to rein in.",
};

// ── Review Rent — rent-specific text-only variant ──
const RENT_TEXT = "Rajan, your rent of ₹25,000 is due in 5 days but your balance is only ₹11,200.\n\nYour salary of ₹62,000 hits 2 days later — if you can defer rent briefly, you're covered.";

const REVIEW_ONTRACK_TEXT = "Great going, Rajan \u2014 all your goals are **on track**. What do you want to explore today?";

// ── Quick action cards for On Track variant ──
type QuickAction = { category: string; title: string; illustration?: string; bg: string };

// Row 1: two square cards
const MOSAIC_ROW1: QuickAction[] = [
  { category: "Budget", title: "Can I afford it?", illustration: ILLUST_AFFORD_IT, bg: "linear-gradient(160deg, #ffffff 40%, #e6edf9 100%)" },
  { category: "Last month", title: "Analyse my spends", illustration: ILLUST_MY_SPENDS, bg: "linear-gradient(160deg, #ffffff 40%, #fff3e3 100%)" },
];
// Row 2 left: tall card
const MOSAIC_TALL: QuickAction = { category: "Feedback", title: "Make Ryan smarter", illustration: ILLUST_FEEDBACK, bg: "linear-gradient(160deg, #ffffff 40%, #fae2fa 100%)" };
// Row 2 right: two half-height cards stacked
const MOSAIC_HALF: QuickAction[] = [
  { category: "For you", title: "Save taxes", bg: "linear-gradient(160deg, #ffffff 40%, #e0f4e8 100%)" },
  { category: "Explore", title: "Surprise me", bg: "linear-gradient(160deg, #ffffff 40%, #e0e3e6 100%)" },
];

const ONTRACK_MOCK_RESPONSES: Record<string, string> = {
  "Can I afford it?": "Balance is \u20B919,883 but whether you can afford something depends on what it is, when you need to pay, and what bills are coming up. What are you thinking of buying?",
  "Analyse my spends": "Last month you spent \u20B947,200 total. Dining was the biggest at \u20B912,400, then groceries at \u20B98,900 and transport at \u20B96,100. Overall **8% less** than the month before. Whatever you did, it\u2019s working.",
  "Make Ryan smarter": "You can rate my responses with the thumbs up or down after each reply. The more you interact, the sharper I get. Let\u2019s keep going.",
  "Save taxes": "You could save up to \u20B945,000 this year. You\u2019re not fully using your **80C limit** \u2014 an ELSS fund or extra PPF contribution before March would help. Want to look at the options?",
  "Surprise me": "\u20B9799 a month on subscriptions you did not use last month. That\u2019s \u20B99,588 a year on autopilot. Want to see the full list and kill the ones you do not actually use?",
};

function MosaicCard({
  action,
  onSelect,
  style: extraStyle,
  className: extraClass = "",
}: {
  action: QuickAction;
  onSelect: () => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative text-left overflow-hidden transition-transform active:scale-[0.97] ${extraClass}`}
      style={{
        background: action.bg,
        border: "none",
        borderRadius: 16,
        boxShadow: "0px 2px 32px 0px rgba(0,0,0,0.05)",
        ...extraStyle,
      }}
    >
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
          {action.category}
        </span>
        <span style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)" }}>
          {action.title}
        </span>
      </div>
      {action.illustration && (
        <img
          src={action.illustration}
          alt=""
          style={{ position: "absolute", bottom: 16, right: 16, width: 44, height: 44, objectFit: "contain" }}
        />
      )}
    </button>
  );
}

function ReviewOnTrackScreen({
  onOptionSelect,
}: {
  onOptionSelect: (label: string) => void;
}) {
  const [typingDone, setTypingDone] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [replyDone, setReplyDone] = useState(false);
  const onComplete = useCallback(() => setTypingDone(true), []);
  const onReplyComplete = useCallback(() => setReplyDone(true), []);
  const displayedText = useTypewriter(REVIEW_ONTRACK_TEXT, true, onComplete);
  const mockReply = selectedLabel ? ONTRACK_MOCK_RESPONSES[selectedLabel] ?? "" : "";
  const displayedReply = useTypewriter(mockReply, !!selectedLabel, onReplyComplete);

  const handleSelect = (title: string) => {
    setSelectedLabel(title);
    onOptionSelect(title);
  };

  return (
    <div className="shrink-0 mb-6">
      <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}>
        {highlightValues(displayedText)}
      </p>

      {!selectedLabel && (
        <div
          className={`transition-opacity duration-300 ease-out ${
            typingDone ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ marginTop: typingDone ? 16 : 0, display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Row 1: two square cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {MOSAIC_ROW1.map((a) => (
              <MosaicCard key={a.title} action={a} onSelect={() => handleSelect(a.title)} style={{ aspectRatio: "1 / 1" }} />
            ))}
          </div>
          {/* Row 2: tall card (1:1 square) + two half-height cards stacked */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            <MosaicCard
              action={MOSAIC_TALL}
              onSelect={() => handleSelect(MOSAIC_TALL.title)}
              style={{ gridRow: "1 / 3", aspectRatio: "1 / 1" }}
            />
            {MOSAIC_HALF.map((a) => (
              <MosaicCard key={a.title} action={a} onSelect={() => handleSelect(a.title)} />
            ))}
          </div>
        </div>
      )}

      {/* Mock conversation after selection */}
      {selectedLabel && (
        <div className="mt-6 space-y-4 animate-chat-message-in">
          {/* User bubble */}
          <div className="flex justify-end">
            <div
              className="max-w-[75%] rounded-[16px] rounded-tr-lg"
              style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
            >
              <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}>{selectedLabel}</p>
            </div>
          </div>
          {/* Assistant reply */}
          <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}>
            {highlightValues(displayedReply)}
          </p>
          {replyDone && <FeedbackRow />}
        </div>
      )}
    </div>
  );
}

function New5TextOnly({
  text = NEW5_TEXT,
  options = NEW5_OPTIONS,
  mockResponses = MOCK_RESPONSES,
  onOptionSelect,
}: {
  text?: string;
  options?: string[];
  mockResponses?: Record<string, string>;
  onOptionSelect: (label: string) => void;
}) {
  const [typingDone, setTypingDone] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [replyDone, setReplyDone] = useState(false);
  const onComplete = useCallback(() => setTypingDone(true), []);
  const onReplyComplete = useCallback(() => setReplyDone(true), []);
  const displayedText = useTypewriter(text, true, onComplete);
  const mockReply = selectedLabel ? mockResponses[selectedLabel] ?? "" : "";
  const displayedReply = useTypewriter(mockReply, showReply, onReplyComplete);

  // Stagger: user bubble appears → 500ms → reply starts typewriting
  useEffect(() => {
    if (!selectedLabel) return;
    const timer = window.setTimeout(() => setShowReply(true), 500);
    return () => window.clearTimeout(timer);
  }, [selectedLabel]);

  return (
    <div className="shrink-0 mb-6">
      <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}>
        {highlightValues(displayedText)}
      </p>

      {options.length > 0 && !selectedLabel && (
        <div
          className={`transition-opacity duration-300 ease-out ${
            typingDone ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ marginTop: typingDone ? 28 : 0 }}
        >
          <div className="flex flex-wrap gap-3">
            {options.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => { setSelectedLabel(label); onOptionSelect(label); }}
                className="transition-transform active:scale-[0.97]"
                style={{
                  ...typography.caption,
                  color: "rgba(0,0,0,0.6)",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 100,
                  padding: "6px 12px",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mock conversation after selection */}
      {selectedLabel && (
        <div className="mt-6 space-y-4">
          {/* User bubble — slides in immediately */}
          <div className="flex justify-end animate-chat-message-in">
            <div
              className="max-w-[75%] rounded-[16px] rounded-tr-lg"
              style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
            >
              <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}>{selectedLabel}</p>
            </div>
          </div>
          {/* Assistant reply — starts after delay */}
          {showReply && (
            <div className="animate-chat-message-in">
              <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}>
                {highlightValues(displayedReply)}
              </p>
              {replyDone && <FeedbackRow />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Chat({
  title,
  subtitle,
  messages,
  chips,
  onChipSelect,
  showInput,
  inputPlaceholder,
  onSubmit,
  headerActions = [],
  drawerContent,
  pinnedContent,
  showTyping,
  onProcessingStateChange,
  appBarDragHandleProps,
  onSheetClose,
  onSheetExpand,
  isSheetMinimized = false,
  sheetTransitionProgress = 0,
  showInitialPrompt = false,
  initialSuggestions = [],
  onInitialSuggestionClick,
  initialScreenVariant,
  thinkingLabel,
  goalTrailingSlot,
  goalPlanBuilder,
  questionnaireOverlay,
  hideStatusBar = false,
  showFeedbackRow: showFeedbackRowProp = false,
}: ChatProps) {
  const isNewVariant = true; // All remaining variants use the new layout
  const [draft, setDraft] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(() => (showInitialPrompt && !isNewVariant ? 0 : messages.length));
  const [showProcessingGlow, setShowProcessingGlow] = useState(false);
  const [hasScrolledContent, setHasScrolledContent] = useState(false);
  const [hasContentBelow, setHasContentBelow] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const revealTimerRef = useRef<number | null>(null);

  // Track which messages have already been typewritten so we never re-typewrite
  const typewrittenIdsRef = useRef<Set<string>>(new Set());

  // Alert state — persists as conversation header
  const [alert] = useState<AlertScenario | null>(() => {
    if (initialScreenVariant === "review-ontrack") {
      return {
        title: "All 3 goals are on track.",
        subtitle: "Nothing to worry about — I'll nudge you if anything shifts.",
        icon: null,
        iconBg: BLUE_50,
      };
    }
    if (initialScreenVariant === "review-rent") {
      return {
        title: "Rajan, your rent is at risk.",
        subtitle: "You're ₹13,800 short with only 5 days to go.",
        icon: null,
        iconBg: RED_50,
      };
    }
    if (initialScreenVariant === "new5") {
      return {
        title: "Rajan, your trip to Japan is veering dangerously off course.",
        subtitle: "Want to course correct while you still can?",
        icon: null,
        iconBg: BLUE_50,
      };
    }
    return null;
  });

  // Initial prompt overlay is not used in the new layout — always false
  const initialPromptVisible = false;
  const glowStartTimerRef = useRef<number | null>(null);
  const glowStopTimerRef = useRef<number | null>(null);

  // Auto-scroll to bottom (old variant only)
  useEffect(() => {
    if (isNewVariant) return;
    const timer = setTimeout(() => {
      const scroller = scrollContainerRef.current;
      if (!scroller) return;
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [isNewVariant, messages.length, revealedCount, chips.length, showTyping]);

  // Auto-scroll as content grows — streaming / typewriter (old variant only)
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isNewVariant) return;
    const content = contentRef.current;
    const scroller = scrollContainerRef.current;
    if (!content || !scroller) return;

    let prevHeight = content.scrollHeight;
    const observer = new ResizeObserver(() => {
      const newHeight = content.scrollHeight;
      if (newHeight > prevHeight) {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      }
      prevHeight = newHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [isNewVariant, initialPromptVisible]);

  // New variant: snap-scroll when a user bubble mounts.
  // Uses a callback ref on each user message div — fires the instant React inserts it.
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const snappedIdsRef = useRef<Set<string>>(new Set());
  const userBubbleRef = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const id = el.getAttribute("data-msg-id");
    if (!id || snappedIdsRef.current.has(id)) return;
    snappedIdsRef.current.add(id);

    const scroller = scrollContainerRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    setTimeout(() => {
      const scrollerRect = scroller.getBoundingClientRect();
      const bubbleRect = el.getBoundingClientRect();
      const bubbleTopInScroller = bubbleRect.top - scrollerRect.top + scroller.scrollTop;
      const target = Math.max(0, bubbleTopInScroller - (scroller.clientHeight * 0.12));

      // Ensure content is tall enough to scroll to target position
      const minHeight = target + scroller.clientHeight;
      if (content.scrollHeight < minHeight) {
        content.style.minHeight = `${minHeight}px`;
      }

      // Smooth scroll animation
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
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, 300);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setRevealedCount((prev) => (prev === 0 ? prev : 0));
      setShowProcessingGlow(false);
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (glowStartTimerRef.current !== null) {
        window.clearTimeout(glowStartTimerRef.current);
        glowStartTimerRef.current = null;
      }
      if (glowStopTimerRef.current !== null) {
        window.clearTimeout(glowStopTimerRef.current);
        glowStopTimerRef.current = null;
      }
      return;
    }

    if (revealedCount > messages.length) {
      setRevealedCount(messages.length);
      return;
    }

    if (revealedCount >= messages.length) {
      return;
    }

    const nextIndex = revealedCount;
    const nextMessage = messages[nextIndex];
    const previousMessage = messages[nextIndex - 1];

    // Streaming messages should appear immediately — no choreography delay
    if (nextMessage?.streaming) {
      setRevealedCount((prev) => prev + 1);
      return;
    }

    const getDelayForMessage = (index: number) => {
      const current = messages[index];
      const previous = messages[index - 1];
      if (!current) return 0;
      if (!previous) return 180;
      if (current.role === "assistant" && previous.role === "user") return ASSISTANT_REPLY_TOTAL_MS;
      // If the previous assistant message has selectable options, let the options
      // collapse animate first before showing the user's selected reply bubble.
      if (current.role === "user" && previous.role === "assistant") return chips.length > 0 ? 300 : 260;
      return 180;
    };
    const timeoutMs = getDelayForMessage(nextIndex);
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
    }
    revealTimerRef.current = window.setTimeout(() => {
      setRevealedCount((prev) => Math.min(prev + 1, messages.length));
      revealTimerRef.current = null;
    }, timeoutMs);

    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [messages, revealedCount, chips.length]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (glowStartTimerRef.current !== null) {
        window.clearTimeout(glowStartTimerRef.current);
        glowStartTimerRef.current = null;
      }
      if (glowStopTimerRef.current !== null) {
        window.clearTimeout(glowStopTimerRef.current);
        glowStopTimerRef.current = null;
      }
    };
  }, []);

  const renderedMessages = messages.slice(0, revealedCount);
  const nextPendingMessage = messages[revealedCount];
  const secondPendingMessage = messages[revealedCount + 1];
  const lastRevealedMessage = revealedCount > 0 ? messages[revealedCount - 1] : undefined;
  const latestRenderedIndex = renderedMessages.length - 1;
  const latestRenderedMessage = latestRenderedIndex >= 0 ? renderedMessages[latestRenderedIndex] : undefined;
  const previousRenderedIndex = latestRenderedIndex - 1;
  const previousRenderedMessage = previousRenderedIndex >= 0 ? renderedMessages[previousRenderedIndex] : undefined;
  const shouldQueueAssistantProcessingAfterVisibleUser =
    Boolean(nextPendingMessage && nextPendingMessage.role === "assistant" && lastRevealedMessage?.role === "user");
  const shouldCollapseOptionsBeforeUserReply =
    chips.length > 0 &&
    nextPendingMessage?.role === "user" &&
    latestRenderedMessage?.role === "assistant";
  const optionsCardIndex =
    chips.length > 0
      ? latestRenderedMessage?.role === "assistant"
        ? latestRenderedIndex
        : latestRenderedMessage?.role === "user" && previousRenderedMessage?.role === "assistant"
          ? previousRenderedIndex
          : -1
      : -1;
  const shouldShowOptionsExpanded =
    chips.length > 0 &&
    optionsCardIndex >= 0 &&
    latestRenderedMessage?.role === "assistant" &&
    !shouldCollapseOptionsBeforeUserReply;

  useEffect(() => {
    const clearGlowTimers = () => {
      if (glowStartTimerRef.current !== null) {
        window.clearTimeout(glowStartTimerRef.current);
        glowStartTimerRef.current = null;
      }
      if (glowStopTimerRef.current !== null) {
        window.clearTimeout(glowStopTimerRef.current);
        glowStopTimerRef.current = null;
      }
    };

    clearGlowTimers();
    setShowProcessingGlow(false);

    if (!shouldQueueAssistantProcessingAfterVisibleUser) {
      return;
    }

    // Choreography: glow starts immediately with thinking indicator, no pre-delay.
    const glowStartDelayMs = 0;
    const glowDurationMs = ASSISTANT_REPLY_GLOW_MS + ASSISTANT_REPLY_PRE_GLOW_MS;

    glowStartTimerRef.current = window.setTimeout(() => {
      setShowProcessingGlow(true);
      glowStartTimerRef.current = null;
    }, glowStartDelayMs);

    glowStopTimerRef.current = window.setTimeout(() => {
      setShowProcessingGlow(false);
      glowStopTimerRef.current = null;
    }, glowStartDelayMs + glowDurationMs);

    return clearGlowTimers;
  }, [shouldQueueAssistantProcessingAfterVisibleUser, revealedCount, messages]);

  const shouldRenderProcessingGlow = showTyping || showProcessingGlow;

  // Thinking indicator appears 300ms after user bubble is revealed
  const [showThinking, setShowThinking] = useState(false);
  const thinkingTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (thinkingTimerRef.current !== null) {
      window.clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    if (shouldQueueAssistantProcessingAfterVisibleUser) {
      thinkingTimerRef.current = window.setTimeout(() => {
        setShowThinking(true);
        thinkingTimerRef.current = null;
      }, 300);
    } else {
      setShowThinking(false);
    }
    return () => {
      if (thinkingTimerRef.current !== null) {
        window.clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
    };
  }, [shouldQueueAssistantProcessingAfterVisibleUser]);

  useEffect(() => {
    onProcessingStateChange?.(shouldRenderProcessingGlow);
  }, [onProcessingStateChange, shouldRenderProcessingGlow]);

  useEffect(() => {
    if ((showInitialPrompt && !isNewVariant) || isSheetMinimized) {
      setHasScrolledContent(false);
      setHasContentBelow(false);
      return;
    }

    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const updateScrolledState = () => {
      setHasScrolledContent(scroller.scrollTop > 0);
      if (isNewVariant && messagesContainerRef.current) {
        // For new variant, check if the messages container's bottom is below the viewport
        // (ignores artificial minHeight spacer)
        const containerBottom = messagesContainerRef.current.getBoundingClientRect().bottom;
        const scrollerBottom = scroller.getBoundingClientRect().bottom;
        setHasContentBelow(containerBottom > scrollerBottom + 1);
      } else {
        setHasContentBelow(scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1);
      }
    };

    updateScrolledState();
    scroller.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => scroller.removeEventListener("scroll", updateScrolledState);
  }, [showInitialPrompt, isNewVariant, isSheetMinimized, messages.length, chips.length, revealedCount]);

  const clampedTransitionProgress = Math.max(0, Math.min(1, sheetTransitionProgress));
  const bodyOpacity = Math.max(0, 1 - clampedTransitionProgress * 1.35);
  const bodyTranslateY = Math.round(clampedTransitionProgress * 10);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-white"

      style={{ fontFamily: 'var(--font-rubik), var(--font-sans), system-ui, sans-serif', pointerEvents: 'none' }}
    >
      {/* AppBar in normal flow — for minimized mode and initial prompt screen */}
      {(isSheetMinimized || initialPromptVisible) && (
        <div style={{ pointerEvents: 'auto' }}>
          <ChatAppBar
            dragHandleProps={appBarDragHandleProps}
            onClose={onSheetClose}
            onExpand={onSheetExpand}
            isSheetMinimized={isSheetMinimized}
            hasScrolledContent={hasScrolledContent}
            dragHandleOpacity={1}
            hasUserMessages={messages.some((m) => m.role === "user")}
            goalTrailingSlot={goalTrailingSlot}
            hideStatusBar={hideStatusBar}
          />
        </div>
      )}

      {/* Body — disabled when sheet is minimized so My Money behind receives all events */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          pointerEvents: isSheetMinimized ? 'none' : 'auto',
          opacity: bodyOpacity,
          transform: `translateY(${bodyTranslateY}px)`,
          transition: 'opacity 160ms linear, transform 220ms ease-out',
        }}
      >
        {(
          <div className="relative flex-1 overflow-hidden">
            {/* Floating app bar — overlays scroll content */}
            <div className="absolute top-0 left-0 right-0 z-10" style={{ pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'auto' }}>
                <ChatAppBar
                  onClose={onSheetClose}
                  isSheetMinimized={false}
                  hasScrolledContent={hasScrolledContent}
                  hasUserMessages={messages.some((m) => m.role === "user")}
                  floating={true}
                  goalTrailingSlot={goalTrailingSlot}
                  hideStatusBar={hideStatusBar}
                />
              </div>
              {goalPlanBuilder && (
                <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
                  {goalPlanBuilder}
                </div>
              )}
            </div>

            {/* Top fade gradient — visible on scroll */}
            <div
              className="absolute left-0 right-0 z-[9]"
              style={{
                top: 0,
                height: 120,
                pointerEvents: "none",
                background: "linear-gradient(to bottom, white 60%, transparent 100%)",
                opacity: hasScrolledContent ? 1 : 0,
                transition: "opacity 200ms ease",
              }}
            />

            <div
              ref={scrollContainerRef}
              className="absolute inset-0 w-full overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ paddingTop: 8, overflowAnchor: "none" }}
            >
              <div ref={contentRef} className="flex flex-col px-6">
                {/* Top spacer so content clears the floating close button + plan builder */}
                <div className="shrink-0" aria-hidden="true" style={{ height: goalPlanBuilder ? 160 : hideStatusBar ? 64 : 108 }} />

                {/* New5 / Review Behind — typewriter text + plain options */}
                {alert && initialScreenVariant === "new5" && (
                  <New5TextOnly
                    onOptionSelect={() => { setHasInteracted(true); }}
                  />
                )}

                {/* Review on-track — reassuring text + quick action cards */}
                {alert && initialScreenVariant === "review-ontrack" && (
                  <ReviewOnTrackScreen
                    onOptionSelect={() => { setHasInteracted(true); }}
                  />
                )}

                {/* Review Rent — typewriter text only, no options */}
                {alert && initialScreenVariant === "review-rent" && (
                  <New5TextOnly
                    text={RENT_TEXT}
                    options={[]}
                    onOptionSelect={() => {}}
                  />
                )}

                {(drawerContent || pinnedContent) && (
                  <div className="mb-4 space-y-2">
                    {drawerContent ? (
                      <div className="rounded-2xl border p-3" style={{ ...typography.caption, borderColor: BG_SURFACE_2, backgroundColor: BG_SURFACE, color: "rgba(0,0,0,0.5)" }}>{drawerContent}</div>
                    ) : null}
                    {pinnedContent ? (
                      <div className="rounded-2xl border p-3" style={{ ...typography.caption, borderColor: GREEN_50, backgroundColor: GREEN_50, color: "rgba(0,0,0,0.9)" }}>{pinnedContent}</div>
                    ) : null}
                  </div>
                )}

                <div ref={messagesContainerRef} className="w-full space-y-4">
                  {renderedMessages.map((message, index) => {
                    const animationClass = "animate-chat-message-in";
                    const renderOptionsCardHere = optionsCardIndex === index && message.role === "assistant";
                    // Only the most recently revealed assistant message gets typewriter,
                    // and only if it hasn't been typewritten before.
                    const isLatestAssistant = index === latestRenderedIndex && message.role === "assistant";
                    const shouldTypewrite = isLatestAssistant && !typewrittenIdsRef.current.has(message.id);
                    if (shouldTypewrite) {
                      typewrittenIdsRef.current.add(message.id);
                    }
                    // Show feedback row after the last assistant message
                    const isLastAssistant = message.role === "assistant" && !renderedMessages.slice(index + 1).some((m) => m.role === "assistant");
                    return (
                      <div
                        key={message.id}
                        className={animationClass}
                        data-role={message.role}
                        data-msg-id={message.id}
                        ref={(el) => {
                          if (el && message.role === "user" && isNewVariant) userBubbleRef(el);
                        }}
                      >
                        {renderOptionsCardHere && shouldShowOptionsExpanded ? (
                          <AssistantOptionsCard
                            message={message}
                            chips={chips}
                            onChipSelect={onChipSelect}
                            showOptions={true}
                            typewrite={shouldTypewrite}
                          />
                        ) : (
                          <Bubble message={message} typewrite={shouldTypewrite} />
                        )}
                        {isLastAssistant && !message.streaming && !thinkingLabel && (!hideStatusBar || showFeedbackRowProp) && <FeedbackRow />}
                      </div>
                    );
                  })}


                  {thinkingLabel && (showThinking || shouldRenderProcessingGlow) && (
                    <div className="animate-chat-message-in">
                      <ThinkingIndicator label={thinkingLabel} />
                    </div>
                  )}

                  {chips.length > 0 && renderedMessages.length === 0 ? <OptionList chips={chips} onChipSelect={onChipSelect} /> : null}

                </div>
                {/* Spacer so last content clears the floating input bar */}
                <div className="shrink-0" aria-hidden="true" style={{ height: 120 }} />
              </div>
            </div>

            {/* Scroll-to-bottom pill (new variant only) */}
            <button
              onClick={() => {
                const scroller = scrollContainerRef.current;
                if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
              }}
              className="absolute z-20 flex items-center justify-center rounded-full bg-white shadow-md active:scale-95 transition-all duration-200 ease-out"
              style={{
                bottom: 110,
                right: 24,
                width: 36,
                height: 36,
                border: "1px solid rgba(0,0,0,0.08)",
                opacity: isNewVariant && hasContentBelow && renderedMessages.length > 0 && !hideStatusBar ? 1 : 0,
                pointerEvents: isNewVariant && hasContentBelow && renderedMessages.length > 0 && !hideStatusBar ? "auto" : "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute bottom-0 left-0 right-0" style={{ pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'auto' }}>
                {questionnaireOverlay ?? (
                  <TypeBox
                    value={draft}
                    onChange={setDraft}
                    onSubmit={() => {
                      const text = draft.trim();
                      if (!text) return;
                      setDraft("");
                      onSubmit?.(text);
                    }}
                    placeholder={inputPlaceholder ?? (renderedMessages.length > 0 || hasInteracted ? "Reply to Ryan..." : "Ask Ryan...")}
                    showElevation={hasContentBelow}
                    leftAction={undefined}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>{/* end body */}
    </div>
  );
}
