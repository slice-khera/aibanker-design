"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  OUTLINE_SUBTLE,
  BG_PRIMARY,
  BG_SECONDARY,
  VALENTINO_50,
} from "../lib/colors";
import { SPACE_XS, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_CIRCLE } from "../lib/radii";
import { GestureNav, ChatAppBar } from "../components/AppChrome";
import type { Persona } from "../components/PersonaToggle";
import { highlightValues } from "../lib/chat-highlight";

import WrappedCard from "./WrappedCard";
import WrappedStory from "./WrappedStory";
import AASim from "./AASim";
import SharedPayScreen from "../components/PayScreen";
import FeaturePDP from "../components/FeaturePDP";
import JumpToRecentPill from "../components/JumpToRecentPill";
import { SnackbarSlotProvider, SnackbarSlotTarget } from "../components/SnackbarSlot";
import {
  WRAPPED_BEATS,
  PRE_WRAPPED_BUBBLES,
  POST_WRAPPED_PRE_AA_BUBBLES,
  AA_LINKED_BUBBLE,
  type Voice,
} from "./fixtures/wrappedFixture";

// Inline nudge copy — shown when the user opens the AA sheet and closes it
// without linking. Kept here (not in the fixture) because it's specific to
// the new optional-AA flow.
const AA_BAIL_NUDGE: { ryan: string; byron: string } = {
  ryan: "I can perform better with more data.",
  byron: "I can perform better with more data.",
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const OVERLAY_DURATION = 460;

// ══════════════════════════════════════════════════════════════════
//  Typewriter
// ══════════════════════════════════════════════════════════════════

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
//  Floating chat app bar
// ══════════════════════════════════════════════════════════════════

function FloatingAppBar({
  onClose,
  navKind = "close",
  activeVoice = "ryan",
  onVoiceToggle,
}: {
  onClose: () => void;
  navKind?: "close" | "back";
  activeVoice?: Voice;
  onVoiceToggle?: (v: Voice) => void;
}) {
  return (
    <ChatAppBar
      absolute
      variant="firstTime"
      navKind={navKind}
      onNav={onClose}
      voice={activeVoice as Persona}
      onVoiceChange={onVoiceToggle ? (p) => onVoiceToggle(p as Voice) : undefined}
    />
  );
}

// ══════════════════════════════════════════════════════════════════
//  Step sequence
// ══════════════════════════════════════════════════════════════════

type DualVoiceRef = { ryan: string; byron: string };

type Step =
  | { kind: "bot"; dv: DualVoiceRef }
  | { kind: "aa-chips" }
  | { kind: "wrapped" };

function bot(dv: DualVoiceRef): Step { return { kind: "bot", dv }; }

const STEPS: Step[] = [
  // Phase 1: Meet Ryan — Wrapped quiz
  ...PRE_WRAPPED_BUBBLES.map(bot),
  { kind: "wrapped" },
  ...POST_WRAPPED_PRE_AA_BUBBLES.map(bot),
  // Phase 2: Account aggregation (terminal — flow ends after this)
  { kind: "aa-chips" },
  bot(AA_LINKED_BUBBLE),
];

const LAST_STEP_INDEX = STEPS.length - 1;
const POST_WRAPPED_STEP_INDEX = STEPS.findIndex((s) => s.kind === "wrapped") + 1;

// Plain Ryan/Byron text line with typewriter on first reveal
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

const PDP_FEATURES = [
  { title: "Spending, decoded", subtitle: "See where your money actually goes" },
  { title: "Goals on autopilot", subtitle: "Set a target, get a plan, stay on track" },
];

export default function OnboardingSim({
  onComplete,
}: { onComplete?: (result: { aaLinked: boolean }) => void } = {}) {
  // Overlay
  const [overlayScreen, setOverlayScreen] = useState<"pdp" | "chat">("pdp");
  const [pdpSeen, setPdpSeen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);

  // Step machine
  const [stepIndex, setStepIndex] = useState(0);

  // AA
  // aaChipPicked: user tapped "Connect accounts" (initial or post-nudge)
  // aaSkipped: terminal — user explicitly declined to link (upfront or post-nudge)
  // aaDismissed: user opened AA sheet then closed it without completing → triggers nudge
  // aaNudgeStreamed: nudge typewriter finished → post-nudge chips can render
  // aaLinked: user successfully completed AA flow
  const [aaChipPicked, setAaChipPicked] = useState<string | null>(null);
  const [aaSkipped, setAaSkipped] = useState(false);
  const [aaDismissed, setAaDismissed] = useState(false);
  const [aaNudgeStreamed, setAaNudgeStreamed] = useState(false);
  const [aaLinked, setAaLinked] = useState(false);
  const [aaFlowOpen, setAaFlowOpen] = useState(false);

  // Wrapped
  const [revealedCount, setRevealedCount] = useState(0);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyPhase, setStoryPhase] = useState<"idle" | "expanding" | "open" | "collapsing">("idle");
  const [reviewBeatIndex, setReviewBeatIndex] = useState<number | undefined>(undefined);

  // Scroll
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasContentBelow, setHasContentBelow] = useState(false);

  // Voice / persona
  const [voice, setVoice] = useState<Voice>("ryan");
  const [contentVisible, setContentVisible] = useState(true);

  // Flow lifecycle
  const [flowComplete, setFlowComplete] = useState(false);
  const [ryanReady, setRyanReady] = useState(false);
  const [pillLabel, setPillLabel] = useState("Meet Ryan");

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrappedCardRef = useRef<HTMLDivElement>(null);
  const postWrappedRef = useRef<HTMLDivElement>(null);
  const userBubbleRef = useRef<HTMLDivElement>(null);
  const isSnappingRef = useRef(false);
  const snapTimeoutRef = useRef<number | null>(null);
  const overlayAnimatingRef = useRef(false);
  const [userActionCount, setUserActionCount] = useState(0);

  const snapScrollTo = useCallback((el: HTMLElement, delay = 300) => {
    if (snapTimeoutRef.current) window.clearTimeout(snapTimeoutRef.current);
    isSnappingRef.current = true;
    snapTimeoutRef.current = window.setTimeout(() => {
      const scroller = scrollRef.current;
      const content = contentRef.current;
      if (!scroller || !content) { isSnappingRef.current = false; return; }

      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const elTopInScroller = elRect.top - scrollerRect.top + scroller.scrollTop;
      const chromeHeight = 108;
      const target = Math.max(0, elTopInScroller - chromeHeight - 8);

      const minHeight = target + scroller.clientHeight;
      if (content.scrollHeight < minHeight) {
        content.style.minHeight = `${minHeight}px`;
      }

      const start = scroller.scrollTop;
      const distance = target - start;
      if (Math.abs(distance) < 1) { isSnappingRef.current = false; return; }
      const duration = 400;
      const startTime = performance.now();
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        scroller.scrollTop = start + distance * ease(progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          window.setTimeout(() => { isSnappingRef.current = false; }, 200);
        }
      };
      requestAnimationFrame(step);
    }, delay);
  }, []);

  const advanceStep = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, LAST_STEP_INDEX));
  }, []);

  const openOverlay = useCallback(() => {
    setOverlayScreen(pdpSeen ? "chat" : "pdp");
    setOverlayMounted(true);
    overlayAnimatingRef.current = true;
    window.setTimeout(() => { overlayAnimatingRef.current = false; }, OVERLAY_DURATION + 50);
    requestAnimationFrame(() => requestAnimationFrame(() => setOverlayOpen(true)));
  }, [pdpSeen]);

  const closeOverlay = useCallback(() => {
    // User-driven close (e.g. PDP close button before engaging the flow).
    // Flow-complete hands off through the effect below, not through here.
    setOverlayOpen(false);
    window.setTimeout(() => {
      setOverlayMounted(false);
      setOverlayScreen(pdpSeen ? "chat" : "pdp");
      // Full-reset only if the user bailed before engaging AA at all.
      if (!aaChipPicked && !aaSkipped) {
        setStepIndex(0);
        setAaChipPicked(null);
        setAaSkipped(false);
        setAaDismissed(false);
        setAaNudgeStreamed(false);
        setAaLinked(false);
        setRevealedCount(0);
        setStoryOpen(false);
        setAaFlowOpen(false);
        setUserActionCount(0);
        setRyanReady(false);
        setPillLabel("Meet Ryan");
      }
    }, OVERLAY_DURATION);
  }, [aaChipPicked, aaSkipped, pdpSeen]);

  const handlePdpAction = useCallback(() => {
    setPdpSeen(true);
    setOverlayScreen("chat");
  }, []);

  const handleChatBack = useCallback(() => {
    setOverlayScreen("pdp");
  }, []);

  // Top fade + jump-to-recent pill
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      setHasScrolled(el.scrollTop > 0);
      const content = contentRef.current;
      const lastChild = content?.lastElementChild as HTMLElement | null;
      const contentBottom = lastChild
        ? lastChild.offsetTop + lastChild.offsetHeight
        : el.scrollHeight;
      setHasContentBelow(el.scrollTop + el.clientHeight < contentBottom - 4);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [overlayOpen, stepIndex]);

  // Auto-scroll
  useEffect(() => {
    if (isSnappingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const delay = overlayAnimatingRef.current ? OVERLAY_DURATION + 100 : 50;
    const t = window.setTimeout(() => {
      if (isSnappingRef.current) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, delay);
    return () => window.clearTimeout(t);
  }, [stepIndex, revealedCount]);

  useEffect(() => {
    if (userActionCount === 0) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = userBubbleRef.current;
      if (el) snapScrollTo(el);
    }));
  }, [userActionCount, snapScrollTo]);

  // Pay-screen pill flips to "ready" once the user opens the chat for the
  // first time.
  useEffect(() => {
    if (overlayOpen && overlayScreen === "chat" && !ryanReady) {
      setRyanReady(true);
      setPillLabel(voice === "byron" ? "Byron is ready" : "Ryan is ready");
    }
  }, [overlayOpen, overlayScreen, ryanReady, voice]);

  // ── AA actions ────────────────────────────────────────

  const handleAAComplete = useCallback(() => {
    setAaFlowOpen(false);
    setAaLinked(true);
    // Advance past aa-chips to the AA_LINKED_BUBBLE.
    advanceStep();
  }, [advanceStep]);

  const handleAAClose = useCallback(() => {
    setAaFlowOpen(false);
    // If the user engaged AA at least once and didn't link, surface the nudge.
    if (aaChipPicked && !aaLinked) {
      setAaDismissed(true);
    }
  }, [aaChipPicked, aaLinked]);

  // ── AA chip handlers ──────────────────────────────────────────

  const handleAAConnect = useCallback(() => {
    setAaChipPicked("connect");
    setAaDismissed(false);
    setAaNudgeStreamed(false);
    setUserActionCount((c) => c + 1);
    setAaFlowOpen(true);
  }, []);

  const handleAASkip = useCallback(() => {
    setAaSkipped(true);
    setUserActionCount((c) => c + 1);
  }, []);

  // ── Wrapped actions ───────────────────────────────────

  const openStory = useCallback((beatIndex: number) => {
    setReviewBeatIndex(beatIndex < revealedCount ? beatIndex : undefined);
    setStoryOpen(true);
    setStoryPhase("expanding");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setStoryPhase("open");
    }));
  }, [revealedCount]);

  const closeStory = useCallback((newRevealedCount: number) => {
    setStoryPhase("collapsing");
    window.setTimeout(() => {
      setStoryOpen(false);
      setStoryPhase("idle");
      setReviewBeatIndex(undefined);
      const allRevealed = newRevealedCount >= WRAPPED_BEATS.length;
      setRevealedCount(newRevealedCount);
      if (allRevealed && revealedCount < WRAPPED_BEATS.length) {
        advanceStep();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const el = postWrappedRef.current;
          if (el) snapScrollTo(el);
        }));
      }
    }, 300);
  }, [advanceStep, revealedCount, snapScrollTo]);

  // ── Flow completion ──────────────────────────────────────────
  // Two terminal conditions:
  //   1. User linked AA and AA_LINKED_BUBBLE has rendered (reached LAST_STEP_INDEX).
  //   2. User declined to link — either upfront via "Do it later" or after
  //      opening AA, closing it, and tapping "Do it later" on the nudge.
  useEffect(() => {
    if (flowComplete) return;
    if (aaSkipped) {
      setFlowComplete(true);
      return;
    }
    if (stepIndex >= LAST_STEP_INDEX && aaLinked) {
      setFlowComplete(true);
    }
  }, [stepIndex, aaSkipped, aaLinked, flowComplete]);

  // Once flow is complete, hand off to the parent directly without sliding
  // the sim's overlay down — that slide would expose the sim's PayScreen
  // (purple) for ~460ms before the parent's chat mounts, creating a flash.
  // The parent unmounts this sim and renders the banker home over the same
  // pixels, so a clean cut is the smoothest transition.
  useEffect(() => {
    if (!flowComplete) return;
    if (!overlayOpen) return;
    const t = window.setTimeout(() => onComplete?.({ aaLinked }), 1200);
    return () => window.clearTimeout(t);
  }, [flowComplete, overlayOpen, onComplete, aaLinked]);

  // ── Render the chat content ───────────────────────────

  const visibleSteps = STEPS.slice(0, stepIndex + 1);

  const topClearance = 108;
  const prevTopClearanceRef = useRef(topClearance);
  useLayoutEffect(() => {
    const prev = prevTopClearanceRef.current;
    if (prev !== topClearance) {
      const scroller = scrollRef.current;
      if (scroller && scroller.scrollTop > 0) {
        scroller.scrollTop += topClearance - prev;
      }
      prevTopClearanceRef.current = topClearance;
    }
  }, [topClearance]);

  const chatContent = (
    <div ref={scrollRef} className="absolute inset-0 w-full overflow-y-auto overscroll-none scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-opacity duration-500 ease-out" style={{ opacity: contentVisible ? 1 : 0 }}>
      <div ref={contentRef} className="flex flex-col" style={{ paddingLeft: SPACE_L, paddingRight: SPACE_L, paddingBottom: SPACE_L }}>
        <div className="shrink-0" aria-hidden="true" style={{ height: topClearance }} />

        {visibleSteps.map((step, i) => {
          const isLast = i === stepIndex;

          if (step.kind === "bot") {
            const isPostWrapped = i === POST_WRAPPED_STEP_INDEX;
            const ref = isPostWrapped ? postWrappedRef : undefined;
            // Auto-advance every bot bubble except the terminal one — flow
            // completion handles the close after AA_LINKED_BUBBLE finishes.
            const isTerminalBubble = i === LAST_STEP_INDEX;
            return (
              <div key={`bot-${i}`} ref={ref}>
                <RyanLine
                  text={step.dv[voice]}
                  active={isLast}
                  onDone={isLast && !isTerminalBubble ? advanceStep : undefined}
                />
              </div>
            );
          }

          if (step.kind === "aa-chips") {
            // Terminal skip (upfront or post-nudge "Do it later"): show
            // the user-side bubble; flow-complete effect handles the close.
            if (aaSkipped) {
              return (
                <div key={`aa-chips-${i}`}>
                  <div ref={userBubbleRef} className="flex justify-end animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                    <div className="max-w-[75%] rounded-[16px] rounded-tr-lg" style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}>
                      <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>Do it later</p>
                    </div>
                  </div>
                </div>
              );
            }

            // User tapped "Connect accounts" at least once.
            if (aaChipPicked) {
              return (
                <div key={`aa-chips-${i}`}>
                  <div ref={userBubbleRef} className="flex justify-end animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                    <div className="max-w-[75%] rounded-[16px] rounded-tr-lg" style={{ backgroundColor: VALENTINO_50, padding: "12px 16px" }}>
                      <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY }}>Connect accounts</p>
                    </div>
                  </div>
                  {/* User opened AA then closed it without linking → soft nudge + two chips. */}
                  {aaDismissed && !aaFlowOpen && (
                    <div>
                      <RyanLine
                        text={AA_BAIL_NUDGE[voice]}
                        active={!aaNudgeStreamed}
                        onDone={() => setAaNudgeStreamed(true)}
                      />
                      {aaNudgeStreamed && (
                        <div className="flex flex-wrap gap-3 animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                          <button
                            type="button"
                            onClick={handleAAConnect}
                            className="transition-transform active:scale-[0.97]"
                            style={{
                              ...typography.buttonSmall,
                              color: TEXT_PRIMARY,
                              backgroundColor: BG_SECONDARY,
                              border: `1px solid ${OUTLINE_SUBTLE}`,
                              borderRadius: RADIUS_CIRCLE,
                              padding: `${SPACE_XS}px ${SPACE_M}px`,
                              cursor: "pointer",
                            }}
                          >
                            Connect now
                          </button>
                          <button
                            type="button"
                            onClick={handleAASkip}
                            className="transition-transform active:scale-[0.97]"
                            style={{
                              ...typography.buttonSmall,
                              color: TEXT_PRIMARY,
                              backgroundColor: BG_SECONDARY,
                              border: `1px solid ${OUTLINE_SUBTLE}`,
                              borderRadius: RADIUS_CIRCLE,
                              padding: `${SPACE_XS}px ${SPACE_M}px`,
                              cursor: "pointer",
                            }}
                          >
                            Do it later
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            // Initial state: two chips — Connect accounts / Do it later
            return (
              <div key={`aa-chips-${i}`} className="flex flex-wrap gap-3 animate-chat-message-in" style={{ marginTop: SPACE_L }}>
                <button
                  type="button"
                  onClick={handleAAConnect}
                  className="transition-transform active:scale-[0.97]"
                  style={{
                    ...typography.buttonSmall,
                    color: TEXT_PRIMARY,
                    backgroundColor: BG_SECONDARY,
                    border: `1px solid ${OUTLINE_SUBTLE}`,
                    borderRadius: RADIUS_CIRCLE,
                    padding: `${SPACE_XS}px ${SPACE_M}px`,
                    cursor: "pointer",
                  }}
                >
                  Connect accounts
                </button>
                <button
                  type="button"
                  onClick={handleAASkip}
                  className="transition-transform active:scale-[0.97]"
                  style={{
                    ...typography.buttonSmall,
                    color: TEXT_PRIMARY,
                    backgroundColor: BG_SECONDARY,
                    border: `1px solid ${OUTLINE_SUBTLE}`,
                    borderRadius: RADIUS_CIRCLE,
                    padding: `${SPACE_XS}px ${SPACE_M}px`,
                    cursor: "pointer",
                  }}
                >
                  Do it later
                </button>
              </div>
            );
          }

          if (step.kind === "wrapped") {
            return (
              <div key={`wrapped-${i}`} ref={wrappedCardRef} style={{ marginTop: SPACE_L }} className="animate-chat-message-in">
                <WrappedCard revealedCount={revealedCount} onOpen={openStory} />
              </div>
            );
          }

          return null;
        })}

        <div className="shrink-0" aria-hidden="true" style={{ height: 80 }} />
      </div>
    </div>
  );

  return (
    <div
      data-phone-frame
      className="relative h-full w-full overflow-hidden"
      style={{ fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif" }}
    >
      {/* Layer 0: Pay screen (acts as the home surface) */}
      <SharedPayScreen onPillTap={openOverlay} pillLabel={pillLabel} animate={ryanReady} />

      {/* Layer 1: Overlay — PDP and chat swap inside this single sheet */}
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundColor: BG_PRIMARY,
          transform: overlayOpen ? "translateY(0%)" : "translateY(100%)",
          transition: `transform ${OVERLAY_DURATION}ms ${EASE}`,
          willChange: "transform",
        }}
      >
        {overlayScreen === "pdp" && overlayMounted && (
          <FeaturePDP
            productName="Meet Ryan"
            subtitle={"Keeps track of your money,\nso you don't have to"}
            features={PDP_FEATURES}
            onClose={closeOverlay}
            onAction={handlePdpAction}
            footer="disclaimer-cta"
            disclaimerText="This beta may contain bugs or unfinished features."
            actionLabel="Join the beta"
          />
        )}

        {overlayScreen === "chat" && (
          <SnackbarSlotProvider>
            <FloatingAppBar
              onClose={ryanReady ? closeOverlay : handleChatBack}
              navKind={ryanReady ? "close" : "back"}
              activeVoice={voice}
              onVoiceToggle={(v) => {
                if (v === voice) return;
                setContentVisible(false);
                window.setTimeout(() => {
                  setVoice(v);
                  window.setTimeout(() => setContentVisible(true), 50);
                }, 200);
              }}
            />

            {overlayMounted && (
              <>
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

                <JumpToRecentPill
                  visible={hasContentBelow}
                  onClick={() => {
                    const scroller = scrollRef.current;
                    if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
                  }}
                  bottom={SPACE_L}
                />

                <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col">
                  <SnackbarSlotTarget />
                  <GestureNav backgroundColor="transparent" />
                </div>
              </>
            )}
          </SnackbarSlotProvider>
        )}
      </div>

      {/* Layer 2: Wrapped story */}
      {storyOpen && (
        <div
          className="absolute inset-0 z-30"
          style={{
            opacity: storyPhase === "expanding" ? 0 : storyPhase === "collapsing" ? 0 : 1,
            transform: storyPhase === "expanding" ? "scale(0.97)" : storyPhase === "collapsing" ? "scale(0.97)" : "scale(1)",
            transition: "opacity 250ms ease, transform 250ms ease",
          }}
        >
          <WrappedStory onClose={closeStory} startFromBeat={revealedCount} reviewBeatIndex={reviewBeatIndex} />
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
