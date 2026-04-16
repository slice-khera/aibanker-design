"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { typography } from "../lib/typography";
import { VALENTINO_50, OUTLINE_SUBTLE, TEXT_PRIMARY, TEXT_SECONDARY, ALPHA_BLACK_30, BG_PRIMARY, BG_SECONDARY } from "../lib/colors";
import { SPACE_XS, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_M, RADIUS_PILL, RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD } from "../lib/elevation";
import { StatusBar, GestureNav, FooterInset } from "../components/AppChrome";
import GoalTracker from "../components/GoalTracker";
import type { GoalIndicatorData } from "../components/GoalTracker";

// ── Hardcoded content ───────────────────────────────────────────

const ASSISTANT_TEXT =
  "Rajan, your Japan trip is veering off course \u2014 you\u2019ve overspent by \u20B915,000 against what we budgeted. Let\u2019s do some damage control while we still can.";

const CHIP_OPTIONS = [
  "Add \u20B95,000 to pot",
  "I\u2019ll handle it myself",
  "Show me where I overspent",
];

const MOCK_RESPONSES: Record<string, string> = {
  "Add \u20B95,000 to pot":
    "Done \u2014 \u20B95,000 moved to your Japan trip pot. You\u2019re now \u20B910,000 behind instead of \u20B915,000. I\u2019ve also tightened your dining budget by \u20B92,000 this month to help close the gap faster.",
  "I\u2019ll handle it myself":
    "Got it, I\u2019ll leave it with you. Just a heads up \u2014 if the gap grows past \u20B920,000, your December target starts looking tight. I\u2019ll check in again next week.",
  "Show me where I overspent":
    "Here\u2019s the breakdown \u2014 dining out was \u20B98,200 (double your usual), shopping hit \u20B94,300, and subscriptions crept up by \u20B92,500. Dining is the big one to rein in.",
};

const FOLLOWUP_TEXT = "What else would you like to explore?";

// ── Mosaic card data (from on-track variant) ────────────────────

const ILLUST_FIRE = "https://www.figma.com/api/mcp/asset/15e3a409-245e-463e-8a32-ebeb66bc7203";
const ILLUST_SPENDS = "https://www.figma.com/api/mcp/asset/bdb9ebfa-d4f4-4ffe-94e9-06639689fb06";
const ILLUST_INVITE = "https://www.figma.com/api/mcp/asset/3608b12c-fa3c-450c-8823-64c0412f5e54";

type QuickAction = { category: string; title: string; illustration?: string; bg: string };

const MOSAIC_ROW1: QuickAction[] = [
  { category: "Budget", title: "Can I afford it?", illustration: ILLUST_FIRE, bg: "linear-gradient(160deg, #ffffff 40%, #e6edf9 100%)" },
  { category: "Last month", title: "Analyse my spends", illustration: ILLUST_SPENDS, bg: "linear-gradient(160deg, #ffffff 40%, #fff3e3 100%)" },
];
const MOSAIC_TALL: QuickAction = { category: "Feedback", title: "Make Ryan smarter", illustration: ILLUST_INVITE, bg: "linear-gradient(160deg, #ffffff 40%, #fae2fa 100%)" };
const MOSAIC_HALF: QuickAction[] = [
  { category: "For you", title: "Save taxes", bg: "linear-gradient(160deg, #ffffff 40%, #e0f4e8 100%)" },
  { category: "Explore", title: "Surprise me", bg: "linear-gradient(160deg, #ffffff 40%, #e0e3e6 100%)" },
];

// ── Feedback row icons ──────────────────────────────────────────

const ICON_THUMBS_UP = "/icons/thumbs-up.svg";
const ICON_THUMBS_DOWN = "/icons/thumbs-down.svg";
const ICON_COPY = "/icons/copy.svg";
const ICON_SHARE = "/icons/share.svg";
const ICON_RETRY = "/icons/retry.svg";

function FeedbackRow() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const icons = [ICON_THUMBS_UP, ICON_THUMBS_DOWN, ICON_COPY, ICON_SHARE, ICON_RETRY];

  useEffect(() => {
    const timer = window.setTimeout(() => setShowDisclaimer(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 animate-chat-message-in" style={{ opacity: 0.4 }}>
        {icons.map((src, i) => (
          <div key={i} className="relative shrink-0" style={{ width: 16, height: 16 }}>
            <img src={src} alt="" className="absolute inset-0 w-full h-full" />
          </div>
        ))}
      </div>
      <p
        className="transition-opacity duration-300 ease-out"
        style={{
          ...typography.caption,
          color: ALPHA_BLACK_30,
          marginTop: SPACE_M,
          textAlign: "right",
          marginLeft: "25%",
          opacity: showDisclaimer ? 1 : 0,
        }}
      >
        Ryan is AI and can make mistakes. Always double-check responses.
      </p>
    </div>
  );
}

// ── Mosaic card ─────────────────────────────────────────────────

function MosaicCard({
  action,
  style: extraStyle,
}: {
  action: QuickAction;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className="relative text-left overflow-hidden transition-transform active:scale-[0.97]"
      style={{
        background: action.bg,
        border: "none",
        borderRadius: RADIUS_M,
        boxShadow: ELEVATION_CARD,
        ...extraStyle,
      }}
    >
      <div style={{ position: "absolute", top: SPACE_M, left: SPACE_M, right: SPACE_M, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ ...typography.metadata, textTransform: "uppercase", color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>
          {action.category}
        </span>
        <span style={{ ...typography.headerH4, color: TEXT_PRIMARY }}>
          {action.title}
        </span>
      </div>
      {action.illustration && (
        <img
          src={action.illustration}
          alt=""
          style={{ position: "absolute", bottom: SPACE_M, right: SPACE_M, width: 44, height: 44, objectFit: "contain" }}
        />
      )}
    </button>
  );
}

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

// ── Typewriter hook ─────────────────────────────────────────────

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
    posRef.current = 0;
    completeCalled.current = false;
    setDisplayed("");

    const tick = () => {
      const chunkSize = 3 + Math.floor(Math.random() * 3);
      const nextPos = Math.min(posRef.current + chunkSize, fullText.length);
      posRef.current = nextPos;
      setDisplayed(fullText.slice(0, nextPos));
      if (nextPos >= fullText.length) {
        if (!completeCalled.current) { completeCalled.current = true; onComplete?.(); }
        return;
      }
      timerRef.current = window.setTimeout(tick, 20 + Math.random() * 20);
    };
    timerRef.current = window.setTimeout(tick, 80);
    return () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); };
  }, [fullText, active, onComplete]);

  return displayed;
}

// ── Goal data for trailing ring ─────────────────────────────────

const JAPAN_GOAL: GoalIndicatorData = {
  id: "1", name: "Trip to Japan", pct: 42, status: "on-track",
  icon: "plane", ringColor: "#d30ad7", daysLabel: "4 months left",
  saved: 84000, target: 200000,
};

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
                <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_SECONDARY} strokeWidth="2" strokeLinecap="round" />
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

export default function RefreshSessionSimV1() {
  const [typingDone, setTypingDone] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [replyDone, setReplyDone] = useState(false);
  const [refreshTapped, setRefreshTapped] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [followupDone, setFollowupDone] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const followupRef = useRef<HTMLDivElement>(null);

  const onComplete = useCallback(() => setTypingDone(true), []);
  const onReplyComplete = useCallback(() => setReplyDone(true), []);
  const onFollowupComplete = useCallback(() => setFollowupDone(true), []);

  const displayedText = useTypewriter(ASSISTANT_TEXT, true, onComplete);
  const mockReply = selectedLabel ? MOCK_RESPONSES[selectedLabel] ?? "" : "";
  const displayedReply = useTypewriter(mockReply, showReply, onReplyComplete);
  const displayedFollowup = useTypewriter(FOLLOWUP_TEXT, showFollowup, onFollowupComplete);

  // Stagger: user bubble → 500ms → reply starts
  useEffect(() => {
    if (!selectedLabel) return;
    const timer = window.setTimeout(() => setShowReply(true), 500);
    return () => window.clearTimeout(timer);
  }, [selectedLabel]);

  // After refresh tapped → short pause → show followup prompt
  useEffect(() => {
    if (!refreshTapped) return;
    const timer = window.setTimeout(() => setShowFollowup(true), 300);
    return () => window.clearTimeout(timer);
  }, [refreshTapped]);

  // Auto-scroll to bottom during reply typing
  useEffect(() => {
    if (showFollowup) return; // once followup is showing, snap-scroll takes over
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [showReply, displayedReply, showFollowup]);

  // Snap-scroll followup to top — same pattern as Chat.tsx user bubble snap
  useEffect(() => {
    if (!showFollowup) return;
    const scroller = scrollRef.current;
    const content = contentRef.current;
    const el = followupRef.current;
    if (!scroller || !content || !el) return;

    setTimeout(() => {
      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elTopInScroller = elRect.top - scrollerRect.top + scroller.scrollTop;
      const target = Math.max(0, elTopInScroller - (scroller.clientHeight * 0.12));

      // Ensure content is tall enough to scroll to target position
      const minHeight = target + scroller.clientHeight;
      if (content.scrollHeight < minHeight) {
        content.style.minHeight = `${minHeight}px`;
      }

      // Smooth eased scroll — 400ms, same as Chat.tsx
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
    }, 300);
  }, [showFollowup]);

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

      <div ref={scrollRef} className="absolute inset-0 w-full overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div ref={contentRef} className="flex flex-col px-6">
          {/* Clearance for app bar */}
          <div className="shrink-0" aria-hidden="true" style={{ height: 108 }} />

          {/* Assistant text — typewriter */}
          <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>
            {highlightValues(displayedText)}
          </p>

          {/* Chip selections — fade in after typing completes */}
          {!selectedLabel && (
            <div
              className={`transition-opacity duration-300 ease-out ${typingDone ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              style={{ marginTop: typingDone ? SPACE_L : 0 }}
            >
              <div className="flex flex-wrap gap-3">
                {CHIP_OPTIONS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedLabel(label)}
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
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mock conversation after chip selection */}
          {selectedLabel && (
            <div className="mt-6 space-y-4">
              {/* User bubble */}
              <div className="flex justify-end animate-chat-message-in">
                <div
                  className="max-w-[75%] rounded-[16px] rounded-tr-lg"
                  style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}
                >
                  <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>{selectedLabel}</p>
                </div>
              </div>
              {/* Assistant reply */}
              {showReply && (
                <div className="animate-chat-message-in">
                  <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>
                    {highlightValues(displayedReply)}
                  </p>
                  {replyDone && !refreshTapped && <FeedbackRow />}
                </div>
              )}

              {/* Follow-up prompt + mosaic cards */}
              {showFollowup && (
                <div ref={followupRef} className="animate-chat-message-in" style={{ paddingTop: SPACE_L }}>
                  <p className="whitespace-pre-line" style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>
                    {displayedFollowup}
                  </p>

                  {/* Mosaic grid — fade in after followup typewriter finishes */}
                  <div
                    className="transition-opacity duration-300 ease-out"
                    style={{
                      marginTop: SPACE_L,
                      display: "flex",
                      flexDirection: "column",
                      gap: SPACE_M,
                      opacity: followupDone ? 1 : 0,
                      pointerEvents: followupDone ? "auto" : "none",
                    }}
                  >
                    {/* Row 1: two square cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE_M }}>
                      {MOSAIC_ROW1.map((a) => (
                        <MosaicCard key={a.title} action={a} style={{ aspectRatio: "1 / 1" }} />
                      ))}
                    </div>
                    {/* Row 2: tall card + two half-height stacked */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: SPACE_M }}>
                      <MosaicCard
                        action={MOSAIC_TALL}
                        style={{ gridRow: "1 / 3", aspectRatio: "1 / 1" }}
                      />
                      {MOSAIC_HALF.map((a) => (
                        <MosaicCard key={a.title} action={a} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="shrink-0" aria-hidden="true" style={{ height: 120 }} />
        </div>
      </div>

      {/* Input bar + gesture nav */}
      <div className="absolute bottom-0 left-0 right-0 z-15">
        <FooterInset backgroundColor="transparent" paddingX={16} paddingTop={8} minBottomPadding={0}>
          <div className="flex items-center" style={{ gap: 12 }}>
            {/* Refresh button — identical container to close button & goal ring */}
            <div
              onClick={() => { if (replyDone && !refreshTapped) setRefreshTapped(true); }}
              className="flex items-center justify-center rounded-full bg-white shrink-0 transition-transform active:scale-[0.97]"
              style={{
                width: 48,
                height: 48,
                border: `1px solid ${OUTLINE_SUBTLE}`,
                boxShadow: ELEVATION_CARD,
                cursor: replyDone && !refreshTapped ? "pointer" : "default",
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
