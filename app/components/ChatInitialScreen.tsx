"use client";

import { useState, useRef, useEffect } from "react";
import { AppBar, GestureNav, NavButton } from "./AppChrome";
import { typography } from "../lib/typography";
import {
  BG_SURFACE, BG_SURFACE_2,
  VALENTINO_500, VALENTINO_50,
  GREEN_500, GREEN_50,
  RED_500, RED_50,
  BLUE_500, BLUE_50,
  ORANGE_500, ORANGE_50,
} from "../lib/colors";

export type InitialSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  avatarBg: string;
  icon: React.ReactNode;
};

type Props = {
  suggestions: InitialSuggestion[];
  onSuggestionClick: (id: string, title: string) => void;
  onSubmit: (text: string) => void;
  variant?: "old" | "new" | "new2" | "new3" | "new4" | "new5" | "review-ontrack" | "review-rent" | "review-refresh";
};

// ── Icons ──────────────────────────────────────────────────────────────────

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Green – bar chart for "Analyse my spends"
function AnalyseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="11" width="3" height="6" rx="0.75" fill="#00a63e" />
      <rect x="8.5" y="7" width="3" height="10" rx="0.75" fill="#00a63e" />
      <rect x="14" y="4" width="3" height="13" rx="0.75" fill="#00a63e" />
    </svg>
  );
}

// Blue – target/bullseye for "Set a savings goal"
function GoalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#2b6acf" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="4" stroke="#2b6acf" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="1.5" fill="#2b6acf" />
    </svg>
  );
}

// Purple – water drop for "Find spending leaks"
function LeakIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3C10 3 4.5 9.5 4.5 13a5.5 5.5 0 0 0 11 0C15.5 9.5 10 3 10 3z" stroke="#d30ad7" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

// ── Card icons (monochrome, 16px) ─────────────────────────────────────────

const CARD_ICONS: Record<string, React.ReactNode> = {
  understand: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="9" width="2.5" height="5" rx="0.5" fill="rgba(0,0,0,0.9)" />
      <rect x="6.75" y="6" width="2.5" height="8" rx="0.5" fill="rgba(0,0,0,0.9)" />
      <rect x="11.5" y="3" width="2.5" height="11" rx="0.5" fill="rgba(0,0,0,0.9)" />
    </svg>
  ),
  "goal-new": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1" fill="rgba(0,0,0,0.9)" />
    </svg>
  ),
  "review-goal": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1" fill="rgba(0,0,0,0.9)" />
    </svg>
  ),
  leaks: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2C8 2 3.5 7.5 3.5 10.5a4.5 4.5 0 0 0 9 0C12.5 7.5 8 2 8 2z" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  budget: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" />
      <path d="M8 2v6h6" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  txns: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="10" height="12" rx="1.2" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" />
      <line x1="5.5" y1="5.5" x2="10.5" y2="5.5" stroke="rgba(0,0,0,0.9)" strokeWidth="1" strokeLinecap="round" />
      <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="rgba(0,0,0,0.9)" strokeWidth="1" strokeLinecap="round" />
      <line x1="5.5" y1="10.5" x2="8.5" y2="10.5" stroke="rgba(0,0,0,0.9)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  networth: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline points="2,12 5.5,7 8.5,9 14,4" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="11,4 14,4 14,7" stroke="rgba(0,0,0,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── New design variant ────────────────────────────────────────────────────

export type AlertScenario = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
};

// Rent — house icon, red tint
function RentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10l7-7 7 7" stroke="#ce1d26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9v6a1 1 0 001 1h8a1 1 0 001-1V9" stroke="#ce1d26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Salary — clock icon, orange tint
function SalaryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#ff9a17" strokeWidth="1.5" />
      <path d="M10 6v4l3 2" stroke="#ff9a17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Access — lock icon, blue tint
function AccessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="9" width="10" height="7" rx="1.5" stroke="#2b6acf" strokeWidth="1.5" />
      <path d="M7 9V7a3 3 0 016 0v2" stroke="#2b6acf" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Spending — flame icon, orange tint
function SpendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2c0 0-5 5-5 9a5 5 0 0010 0c0-4-5-9-5-9z" stroke="#ff9a17" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 12c0 0-2 1.5-2 3a2 2 0 004 0c0-1.5-2-3-2-3z" stroke="#ff9a17" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// Savings goal — target icon, blue tint
function GoalAlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#2b6acf" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" stroke="#2b6acf" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.5" fill="#2b6acf" />
    </svg>
  );
}

const ALERT_SCENARIOS: AlertScenario[] = [
  {
    title: "Your rent is at risk, Rajan.",
    subtitle: "Insufficient funds for your usual payment in six days",
    icon: <RentIcon />,
    iconBg: RED_50,
  },
  {
    title: "Rajan, your salary was expected yesterday.",
    subtitle: "Goals and budgets have been put on hold until it credits",
    icon: <SalaryIcon />,
    iconBg: ORANGE_50,
  },
  {
    title: "Unable to access your accounts, Rajan.",
    subtitle: "Renew account aggregator permission to keep your finances up to date",
    icon: <AccessIcon />,
    iconBg: BLUE_50,
  },
  {
    title: "Rajan, you're spending faster than usual.",
    subtitle: "3 days in and already at 60% of this month's budget",
    icon: <SpendingIcon />,
    iconBg: ORANGE_50,
  },
  {
    title: "Rajan, your savings goal is falling behind.",
    subtitle: "At this rate, you'll take 3 months longer to achieve it",
    icon: <GoalAlertIcon />,
    iconBg: BLUE_50,
  },
];

export function pickAlert(): AlertScenario {
  return ALERT_SCENARIOS[Math.floor(Math.random() * ALERT_SCENARIOS.length)];
}

export function InlineChevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 3, flexShrink: 0 }}
    >
      <path d="M5 3l4 4-4 4" stroke="#d30ad7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewInitialLayout({ onSubmit }: Props) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [alert] = useState(pickAlert);

  const handleSubmit = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    onSubmit(text);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* ── Alert heading — tappable, IS the greeting ── */}
      <button
        className="shrink-0 w-full text-left active:opacity-70 transition-opacity px-6 pt-2"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <h1 style={{ ...typography.headerH2, color: "rgba(0,0,0,0.9)" }}>
          {alert.title}
        </h1>
        <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.5)" }}>
          {alert.subtitle}<InlineChevron />
        </p>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── Input bar ── */}
      <div className="shrink-0" style={{ paddingTop: 12, paddingBottom: 8, paddingLeft: 24, paddingRight: 24 }}>
        <div
          className="flex items-center overflow-hidden w-full"
          style={{
            height: 48,
            backgroundColor: BG_SURFACE,
            border: "none",
            borderRadius: 100,
          } as React.CSSProperties}
        >
          <div
            className="flex items-center w-full h-full"
            style={{ borderRadius: 100, paddingLeft: 16, paddingRight: 8 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Start typing..."
              className="flex-1 min-w-0 bg-transparent outline-none"
              style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.9)" }}
            />
            {inputValue.trim() && (
              <button
                onClick={handleSubmit}
                className="shrink-0 flex items-center justify-center rounded-full bg-[#d30ad7] ml-1"
                style={{ width: 36, height: 36 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 11V3M3 7l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

const GREETINGS = [
  "Ready when you are, Rajan.",
  "What's on your mind, Rajan?",
  "Rajan, let's talk numbers.",
  "Rajan, where should we start?",
  "What are we solving today, Rajan?",
  "Rajan, how can I help?",
  "Good to see you, Rajan.",
  "Rajan, what would you like to check?",
  "What's the plan today, Rajan?",
  "Rajan, I'm all ears.",
];

function pickGreeting(): string {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

export function InitialPromptContent({ suggestions, onSuggestionClick, onSubmit, variant = "old" }: Props) {
  if (variant === "new" || variant === "new2") {
    return <NewInitialLayout suggestions={suggestions} onSuggestionClick={onSuggestionClick} onSubmit={onSubmit} />;
  }
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [greeting] = useState(pickGreeting);

  const handleSubmit = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    onSubmit(text);
  };

  return (
    <>
      {/* ── Heading ── */}
      <div className="shrink-0 px-6">
        <h1
          style={{
            ...typography.headerH1,
            color: "rgba(0,0,0,0.9)",
          }}
        >
          {greeting}
        </h1>
      </div>

      {/* Spacer — pushes list to bottom half */}
      <div className="flex-1" />

      {/* ── Suggestion List ── */}
      {/* gap-8px between items, no outer padding */}
      <div className="shrink-0 flex flex-col gap-2">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSuggestionClick(s.id, s.title)}
            className="w-full flex items-center bg-white active:bg-[#f6f9fc] transition-colors text-left"
            style={{ gap: 12, paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}
          >
            {/* Avatar */}
            <div
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 40,
                height: 40,
                backgroundColor: s.avatarBg,
                border: `1px solid ${BG_SURFACE_2}`,
              }}
            >
              {s.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 4 }}>
              <p
                style={{
                  ...typography.bodyNormal,
                  color: "rgba(0,0,0,0.9)",
                }}
              >
                {s.title}
              </p>
              <p
                style={{
                  ...typography.caption,
                  color: "rgba(0,0,0,0.5)",
                }}
              >
                {s.subtitle}
              </p>
            </div>

            {/* Chevron */}
            <div className="shrink-0">
              <ChevronRightIcon />
            </div>
          </button>
        ))}
      </div>

      {/* ── Type Box ── */}
      <div className="shrink-0 bg-white" style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 24 }}>
        <div
          className="flex items-center overflow-hidden w-full"
          style={{
            height: 48,
            backgroundColor: BG_SURFACE,
            border: `1px solid ${BG_SURFACE_2}`,
            borderRadius: 100,
          }}
        >
          <div
            className="flex items-center w-full h-full"
            style={{
              backgroundColor: BG_SURFACE,
              borderRadius: 100,
              paddingLeft: 16,
              paddingRight: 8,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Start typing..."
              className="flex-1 min-w-0 bg-transparent outline-none"
              style={{
                ...typography.bodySmall,
                color: "rgba(0,0,0,0.9)",
              }}
            />
            {inputValue.trim() && (
              <button
                onClick={handleSubmit}
                className="shrink-0 flex items-center justify-center rounded-full bg-[#d30ad7] ml-1"
                style={{ width: 36, height: 36 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 11V3M3 7l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatInitialScreen({ suggestions, onSuggestionClick, onSubmit }: Props) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-white"
      style={{ fontFamily: "var(--font-rubik), sans-serif" }}
    >
      <AppBar
        leading={<NavButton kind="close" ariaLabel="Close" />}
      />

      <InitialPromptContent
        suggestions={suggestions}
        onSuggestionClick={onSuggestionClick}
        onSubmit={onSubmit}
      />

      <GestureNav />
    </div>
  );
}

// ── Default suggestions wired to real app flows ───────────────────────────

const defaultSuggestions: InitialSuggestion[] = [
  {
    id: "understand",
    title: "Analyse my spends",
    subtitle: "See where your money is going",
    avatarBg: GREEN_50,
    icon: <AnalyseIcon />,
  },
  {
    id: "goal-new",
    title: "Set a savings goal",
    subtitle: "Plan toward something you want",
    avatarBg: BLUE_50,
    icon: <GoalIcon />,
  },
  {
    id: "leaks",
    title: "Find spending leaks",
    subtitle: "Catch categories creeping up",
    avatarBg: VALENTINO_50,
    icon: <LeakIcon />,
  },
];

export function getSuggestions(hasGoal: boolean): InitialSuggestion[] {
  if (!hasGoal) {
    return defaultSuggestions;
  }

  const reviewGoalSuggestion = defaultSuggestions.find((s) => s.id === "goal-new");
  const otherSuggestions = defaultSuggestions.filter((s) => s.id !== "goal-new");

  if (!reviewGoalSuggestion) {
    return defaultSuggestions;
  }

  return [
    {
      ...reviewGoalSuggestion,
      id: "review-goal",
      title: "Review my savings goal",
      subtitle: "Check your progress",
    },
    ...otherSuggestions,
  ];
}
