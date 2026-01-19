"use client";

import { useEffect, useRef, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  special?: "reality-check" | "goal-pinned" | "insight" | "success";
};

export type ChatChip = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "destructive" | "success";
};

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
};

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mb-3 animate-success-pop">
      <svg
        className="w-6 h-6 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 0,
            animation: "checkmark 0.4s ease-out 0.2s forwards",
          }}
        />
      </svg>
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
}: ChatProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length, showTyping]);

  // Animate messages appearing
  useEffect(() => {
    const newMessageIds = messages.map((m) => m.id).filter((id) => !visibleMessages.includes(id));
    if (newMessageIds.length > 0) {
      newMessageIds.forEach((id, idx) => {
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, id]);
        }, idx * 100);
      });
    }
  }, [messages, visibleMessages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !onSubmit) return;
    onSubmit(trimmed);
    setDraft("");
  };

  const getMessageStyle = (message: ChatMessage) => {
    if (message.role === "user") {
      return "bg-white text-zinc-900 shadow-lg";
    }
    switch (message.special) {
      case "reality-check":
        return "bg-gradient-to-br from-violet-900/50 to-violet-950/30 border border-violet-500/20 text-white shadow-lg shadow-violet-500/5";
      case "goal-pinned":
        return "bg-gradient-to-br from-emerald-900/50 to-emerald-950/30 border border-emerald-500/20 text-white shadow-lg shadow-emerald-500/5";
      case "insight":
        return "bg-gradient-to-br from-amber-900/40 to-amber-950/20 border border-amber-500/20 text-white shadow-lg shadow-amber-500/5";
      case "success":
        return "bg-gradient-to-br from-emerald-900/60 to-emerald-950/40 border border-emerald-500/30 text-white shadow-lg shadow-emerald-500/10";
      default:
        return "bg-white/[0.08] text-white backdrop-blur-sm";
    }
  };

  const getChipStyle = (chip: ChatChip, index: number) => {
    const baseStyle = "rounded-full border px-4 py-2.5 text-xs font-medium transition-all duration-200 active:scale-95 opacity-0 animate-fade-in-up";
    const delayClass = `animate-delay-${Math.min(index + 1, 5)}`;
    
    switch (chip.variant) {
      case "primary":
        return `${baseStyle} ${delayClass} border-white bg-white text-zinc-900 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10`;
      case "success":
        return `${baseStyle} ${delayClass} border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-500/60`;
      case "destructive":
        return `${baseStyle} ${delayClass} border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10`;
      default:
        return `${baseStyle} ${delayClass} border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5 hover:text-white`;
    }
  };

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 text-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-white/10 px-5 py-4 bg-zinc-900/50 backdrop-blur-sm">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
        </div>
        {headerActions.length > 0 && (
          <div className="flex items-center gap-2">
            {headerActions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  action.active
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/15 text-white/60 hover:border-white/30 hover:text-white hover:bg-white/5"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawer content */}
      {drawerContent && (
        <div className="flex-shrink-0 border-b border-white/10 bg-zinc-950/80 px-5 py-3 text-xs text-white/70 max-h-32 overflow-y-auto animate-fade-in">
          {drawerContent}
        </div>
      )}

      {/* Pinned content (e.g., goal) */}
      {pinnedContent && (
        <div className="flex-shrink-0 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 to-zinc-950 px-5 py-3 animate-fade-in">
          {pinnedContent}
        </div>
      )}

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
      >
        {messages.map((message, idx) => {
          const isVisible = visibleMessages.includes(message.id);
          const animationClass = message.role === "user" ? "animate-slide-in-right" : "animate-slide-in-left";
          
          return (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${
                isVisible ? animationClass : "opacity-0"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${getMessageStyle(message)}`}
              >
                {message.special === "success" && <SuccessIcon />}
                <span className="whitespace-pre-line">{message.text}</span>
              </div>
            </div>
          );
        })}
        
        {showTyping && <TypingIndicator />}
        
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input */}
      {showInput && onSubmit && (
        <form onSubmit={handleSubmit} className="flex-shrink-0 border-t border-white/10 px-4 py-3 bg-zinc-950/50">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2.5 transition-all duration-200 focus-within:border-white/30 focus-within:bg-zinc-900/80">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={inputPlaceholder ?? "Type here..."}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-900 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 active:scale-95"
            >
              Send
            </button>
          </div>
        </form>
      )}

      {/* Chips */}
      {chips.length > 0 && (
        <div className="flex-shrink-0 border-t border-white/10 px-4 py-4 bg-zinc-950/70">
          <div className="flex flex-wrap gap-2">
            {chips.slice(0, 5).map((chip, index) => (
              <button
                key={chip.id}
                onClick={() => onChipSelect(chip)}
                className={getChipStyle(chip, index)}
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
