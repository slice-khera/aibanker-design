"use client";

import { useState, useRef } from "react";
import { AppBar, GestureNav, NavButton } from "./AppChrome";
import { typography } from "../lib/typography";

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

export function InitialPromptContent({ suggestions, onSuggestionClick, onSubmit }: Props) {
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
                border: "1px solid #f0f4f7",
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
            backgroundColor: "#f6f9fc",
            border: "1px solid #f0f4f7",
            borderRadius: 100,
          }}
        >
          <div
            className="flex items-center w-full h-full"
            style={{
              backgroundColor: "#f6f9fc",
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

export const defaultSuggestions: InitialSuggestion[] = [
  {
    id: "understand",
    title: "Analyse my spends",
    subtitle: "See where your money is going",
    avatarBg: "#e0f4e8",
    icon: <AnalyseIcon />,
  },
  {
    id: "goal-new",
    title: "Set a savings goal",
    subtitle: "Plan toward something you want",
    avatarBg: "#e6edf9",
    icon: <GoalIcon />,
  },
  {
    id: "leaks",
    title: "Find spending leaks",
    subtitle: "Catch categories creeping up",
    avatarBg: "#fae2fa",
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
