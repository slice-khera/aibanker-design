"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InitialPromptContent, type InitialSuggestion } from "./ChatInitialScreen";
import ChatCard, { type ChatCardData } from "./ChatCards";
import { AppBar, FooterInset, GestureNav, NavButton } from "./AppChrome";
import { typography } from "../lib/typography";

// ── Token-speed typewriter for scripted assistant messages ──
// Reveals text ~3-5 chars at a time at ~30ms, matching Claude's streaming cadence.
function useTypewriter(fullText: string, active: boolean, onComplete?: () => void) {
  const [displayed, setDisplayed] = useState(active ? "" : fullText);
  const posRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const completeCalled = useRef(false);

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
          onComplete?.();
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
  }, [fullText, active, onComplete]);

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
  thinkingLabel?: string | null;
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
}: {
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onClose?: () => void;
  onExpand?: () => void;
  isSheetMinimized?: boolean;
  hasScrolledContent?: boolean;
  dragHandleOpacity?: number;
  hasUserMessages?: boolean;
}) {
  if (isSheetMinimized) {
    return (
      <div
        className="w-full bg-white shrink-0 cursor-pointer relative flex items-center"
        style={{ height: 72, paddingLeft: 24, paddingRight: 16 }}
        onClick={onExpand}
        {...dragHandleProps}
      >
        {/* Drag handle nub — absolute so it doesn't shift vertical centering */}
        <div className="absolute top-0 left-0 right-0 flex justify-center" style={{ paddingTop: 12 }}>
          <div style={{ width: 36, height: 4, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 100 }} />
        </div>
        {/* Label + chevron — truly centered in full 72px */}
        <div className="flex items-center w-full">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0 }}>AI Banker</p>
            <p style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)", margin: 0 }}>
              {hasUserMessages ? "Continue chat" : "Start chat"}
            </p>
          </div>
          {/* Chevron up */}
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

  return (
    <div className="w-full bg-white shrink-0">
      <AppBar
        title="AI Banker"
        shadow={hasScrolledContent}
        leading={(
          <div onPointerDown={(e) => e.stopPropagation()}>
            <NavButton kind="close" onClick={onClose} ariaLabel="Close chat" />
          </div>
        )}
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
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  showElevation?: boolean;
}) {
  return (
    <>
      <FooterInset
        backgroundColor="#fff"
        paddingX={16}
        paddingTop={8}
        minBottomPadding={0}
        boxShadow={showElevation ? "0 -12px 28px rgba(0,0,0,0.05)" : "none"}
      >
        {/* Type box — mirrors ChatInitialScreen exactly */}
        <div>
          <div
            className="flex items-center overflow-hidden w-full"
            style={{ height: 48, backgroundColor: "#f6f9fc", border: "1px solid #f0f4f7", borderRadius: 100 }}
          >
            <div
              className="flex items-center w-full h-full"
              style={{ backgroundColor: "#f6f9fc", borderRadius: 100, paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}
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
              backgroundColor: "#fae2fa",
              padding: "12px 16px",
            }}
          >
            <p className="whitespace-pre-line text-[var(--chat-text-primary)]" style={typography.bodySmall}>
              {message.text}
            </p>
          </div>
        ) : (
          <p className="whitespace-pre-line text-[var(--chat-text-primary)] w-full" style={typography.bodySmall}>
            {displayedText}
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
          {displayedSurface}
        </p>
      )}
      {(surfaceDone || !surfaceText) && (
        <div className="w-full rounded-2xl bg-[var(--chat-surface-soft-2)] p-2">
          <div
            className={`overflow-hidden rounded-2xl bg-white transition-[max-height,opacity,margin] duration-250 ease-out ${
              resolvedShowOptions ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {chips.slice(0, 6).map((chip, index) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => onChipSelect(chip)}
                disabled={!resolvedShowOptions}
                className={`flex w-full items-center px-4 py-3 text-left transition hover:bg-[#f6f9fc] active:bg-[#f0f4f7] ${
                  index > 0 ? "border-t border-[#f0f4f7]" : ""
                }`}
                style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}
              >
                <span>{chip.label}</span>
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
    <div className={`mr-auto w-full rounded-2xl bg-[var(--chat-surface-soft-2)] p-1 ${compactTop ? "mt-1" : ""}`}>
      {!compactTop ? (
        <div className="rounded-2xl bg-[var(--chat-surface-soft-2)] px-3 pt-3 pb-2">
          <div className="h-2" />
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl bg-white">
        {chips.slice(0, 6).map((chip, index) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChipSelect(chip)}
            className={`flex w-full items-center px-4 py-3 text-left transition hover:bg-[#f6f9fc] active:bg-[#f0f4f7] ${
              index > 0 ? "border-t border-[#f0f4f7]" : ""
            }`}
            style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}
          >
            <span className="truncate">{chip.label}</span>
          </button>
        ))}
      </div>
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
  thinkingLabel,
}: ChatProps) {
  const [draft, setDraft] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(() => (showInitialPrompt ? 0 : messages.length));
  const [showProcessingGlow, setShowProcessingGlow] = useState(false);
  const [hasScrolledContent, setHasScrolledContent] = useState(false);
  const [hasContentBelow, setHasContentBelow] = useState(false);
  const revealTimerRef = useRef<number | null>(null);

  // Track which messages have already been typewritten so we never re-typewrite
  const typewrittenIdsRef = useRef<Set<string>>(new Set());

  // Tracks whether the initial prompt is visually shown (with fade-out delay)
  const [initialPromptVisible, setInitialPromptVisible] = useState(showInitialPrompt);
  const [initialPromptFadingOut, setInitialPromptFadingOut] = useState(false);

  // Snapshot message count when initial screen is visible, so we can
  // resume existing history but still choreograph newly added messages.
  const messageCountAtLauncherRef = useRef(messages.length);
  useEffect(() => {
    if (showInitialPrompt) {
      messageCountAtLauncherRef.current = messages.length;
    }
  }, [showInitialPrompt, messages.length]);

  useEffect(() => {
    if (showInitialPrompt) {
      setInitialPromptVisible(true);
      setInitialPromptFadingOut(false);
    } else if (initialPromptVisible) {
      // Resume existing history instantly, but let new messages choreograph
      setRevealedCount(messageCountAtLauncherRef.current);
      // Start fade-out, then unmount after transition
      setInitialPromptFadingOut(true);
      const timer = setTimeout(() => {
        setInitialPromptVisible(false);
        setInitialPromptFadingOut(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showInitialPrompt, initialPromptVisible, messages.length]);
  const glowStartTimerRef = useRef<number | null>(null);
  const glowStopTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const scroller = scrollContainerRef.current;
      if (!scroller) return;
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length, revealedCount, chips.length, showTyping]);

  // Auto-scroll as content grows (streaming / typewriter)
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
  }, [initialPromptVisible]);

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
    if (showInitialPrompt || isSheetMinimized) {
      setHasScrolledContent(false);
      setHasContentBelow(false);
      return;
    }

    const scroller = scrollContainerRef.current;
    if (!scroller) return;

    const updateScrolledState = () => {
      setHasScrolledContent(scroller.scrollTop > 0);
      setHasContentBelow(scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1);
    };

    updateScrolledState();
    scroller.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => scroller.removeEventListener("scroll", updateScrolledState);
  }, [showInitialPrompt, isSheetMinimized, messages.length, chips.length, revealedCount]);

  const clampedTransitionProgress = Math.max(0, Math.min(1, sheetTransitionProgress));
  const bodyOpacity = Math.max(0, 1 - clampedTransitionProgress * 1.35);
  const bodyTranslateY = Math.round(clampedTransitionProgress * 10);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-white"

      style={{ fontFamily: 'var(--font-rubik), var(--font-sans), system-ui, sans-serif', pointerEvents: 'none' }}
    >
      {/* AppBar is always interactive — it holds the drag handle */}
      <div style={{ pointerEvents: 'auto' }}>
        <ChatAppBar
          dragHandleProps={appBarDragHandleProps}
          onClose={onSheetClose}
          onExpand={onSheetExpand}
          isSheetMinimized={isSheetMinimized}
          hasScrolledContent={hasScrolledContent}
          dragHandleOpacity={1}
          hasUserMessages={messages.some((m) => m.role === "user")}
        />
      </div>

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
        {initialPromptVisible ? (
          <>
            <div
              className="flex-1 flex flex-col overflow-hidden"
              style={{
                opacity: initialPromptFadingOut ? 0 : 1,
                transition: "opacity 200ms ease-out",
              }}
            >
              <InitialPromptContent
                suggestions={initialSuggestions}
                onSuggestionClick={(id, title) => onInitialSuggestionClick?.(id, title)}
                onSubmit={(text) => onSubmit?.(text)}
              />
            </div>
            <GestureNav />
          </>
        ) : (
          <>
            <div
              ref={scrollContainerRef}
              className="flex-1 w-full overflow-y-auto overscroll-contain pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ paddingTop: 8 }}
            >
              <div ref={contentRef} className="flex min-h-full flex-col justify-end px-6">
                {(drawerContent || pinnedContent) && (
                  <div className="mb-4 space-y-2">
                    {drawerContent ? (
                      <div className="rounded-2xl border p-3" style={{ ...typography.caption, borderColor: "#f0f4f7", backgroundColor: "#f6f9fc", color: "rgba(0,0,0,0.5)" }}>{drawerContent}</div>
                    ) : null}
                    {pinnedContent ? (
                      <div className="rounded-2xl border p-3" style={{ ...typography.caption, borderColor: "#e0f4e8", backgroundColor: "#e0f4e8", color: "rgba(0,0,0,0.9)" }}>{pinnedContent}</div>
                    ) : null}
                  </div>
                )}

                <div className="w-full space-y-4">
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
                    return (
                      <div key={message.id} className={animationClass}>
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
              </div>
            </div>

            <TypeBox
              value={draft}
              onChange={setDraft}
              onSubmit={() => {
                const text = draft.trim();
                if (!text) return;
                setDraft("");
                onSubmit?.(text);
              }}
              placeholder={inputPlaceholder ?? "Start typing..."}
              showElevation={hasContentBelow}
            />
          </>
        )}
      </div>{/* end body */}
    </div>
  );
}
