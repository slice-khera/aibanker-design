"use client";

import type { ChipOption, PersonaQuestion, WrappedSlide } from "../data/flows";
import { STATUS_BAR_HEIGHT } from "./AppChrome";
import { typography } from "../lib/typography";

export type RevealData = {
  savingsGuess: string;
  savingsActual: string;
  personaGuess: string;
  personaActual: string;
};

type PersonaQuizStackProps = {
  slides: WrappedSlide[];
  storyIndex: number; // -1 = not in story phase; 0..N = current story card
  onStoryAdvance: () => void;
  onStoryBack: () => void;
  questions: PersonaQuestion[];
  activeIndex: number;
  showReveal: boolean;
  revealData?: RevealData;
  isTransitioning: boolean;
  onSelect: (questionIndex: number, chip: ChipOption) => void;
  onRevealDone: () => void;
};

// ── Per-slide accent colors (tag bg/text and stat number) ───────
const SLIDE_ACCENTS: { tag: string; color: string; tagBg: string }[] = [
  { tag: "YOUR MONEY",       color: "#d30ad7", tagBg: "#fae2fa" }, // Valentino
  { tag: "TOP CATEGORY",    color: "#ff9a17", tagBg: "#fff3e3" }, // Orange
  { tag: "SMALL SPENDS",    color: "#ce1d26", tagBg: "#f9e4e5" }, // Red
  { tag: "WEEKENDS",        color: "#2b6acf", tagBg: "#e6edf9" }, // Blue
  { tag: "FOOD & DELIVERY", color: "#ff9a17", tagBg: "#fff3e3" }, // Orange
  { tag: "READY?",          color: "#d30ad7", tagBg: "#fae2fa" }, // Valentino
];

// ── Diminishing stack: up to 5 visible layers ───────────────────
const STACK_STYLES = [
  { rotate: "2deg",    translateY: "6px",  opacity: 0.80, scale: 0.98 },
  { rotate: "-1.5deg", translateY: "12px", opacity: 0.65, scale: 0.96 },
  { rotate: "2.5deg",  translateY: "18px", opacity: 0.50, scale: 0.94 },
  { rotate: "-2deg",   translateY: "24px", opacity: 0.35, scale: 0.92 },
  { rotate: "3deg",    translateY: "30px", opacity: 0.20, scale: 0.90 },
];

// ── DLS Tag component ───────────────────────────────────────────
function Tag({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        ...typography.metadata,
        textTransform: "uppercase",
        color,
        backgroundColor: bg,
        borderRadius: 100,
        padding: "4px 8px",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

// ── Nav buttons — DLS icon-only, default context only ───────────
function NavForward({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full focus-visible:outline-none active:scale-95 transition-colors"
      style={{ backgroundColor: "#d30ad7", padding: 12 }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#ffffff" strokeWidth="2">
        <path d="M5 12h12" strokeLinecap="round" />
        <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function NavBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full focus-visible:outline-none active:scale-95 transition-colors"
      style={{ backgroundColor: "transparent", border: "1px solid rgba(0,0,0,0.2)", padding: 12 }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#d30ad7" strokeWidth="2">
        <path d="M19 12H7" strokeLinecap="round" />
        <path d="m11 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ── Main component ──────────────────────────────────────────────
export default function PersonaQuizStack({
  slides,
  storyIndex,
  onStoryAdvance,
  onStoryBack,
  questions,
  activeIndex,
  showReveal,
  revealData,
  isTransitioning,
  onSelect,
  onRevealDone,
}: PersonaQuizStackProps) {
  const activeQuestion = questions[activeIndex];
  const isStoryCard = storyIndex >= 0;

  // Full deck: stories + questions + reveal (no cover card)
  const totalCards = slides.length + questions.length + 1;
  const currentPosition = isStoryCard
    ? storyIndex
    : showReveal
      ? slides.length + questions.length
      : slides.length + activeIndex;

  // Diminishing stack
  const remaining = totalCards - currentPosition - 1;
  const stackCount = Math.min(STACK_STYLES.length, remaining);

  // Active card background — white for everything except reveal
  const activeCardBg = showReveal ? "#fae2fa" : "#ffffff";

  // Accent for current story slide
  const accent = isStoryCard ? SLIDE_ACCENTS[storyIndex % SLIDE_ACCENTS.length] : null;

  return (
    <div
      className="relative flex h-full flex-col rounded-[16px]"
      style={{
        fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif",
        paddingTop: Math.max(STATUS_BAR_HEIGHT, 24),
        color: "rgba(0,0,0,0.9)",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="flex-1 p-6">
        <div className="relative mx-auto h-full max-w-[332px]">
          {/* ── Diminishing stack background cards ── */}
          {Array.from({ length: stackCount }, (_, i) => i).reverse().map((slot) => {
            const depth = stackCount - slot;
            const layer = STACK_STYLES[slot] ?? STACK_STYLES[0];
            return (
              <div
                key={`stack-${slot}`}
                className="absolute inset-x-0 rounded-[24px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm"
                style={{
                  top: 12,
                  bottom: 80,
                  left: 16,
                  right: 16,
                  transform: `translateY(${layer.translateY}) rotate(${layer.rotate}) scale(${layer.scale})`,
                  opacity: layer.opacity,
                  transformOrigin: "center center",
                  zIndex: 10 - depth,
                  transition: "opacity 300ms ease, transform 300ms ease",
                }}
                aria-hidden="true"
              >
                <div className="flex h-full flex-col justify-between p-6">
                  <div className="space-y-3">
                    <div className="h-2 w-16 rounded-full bg-[#f0f4f7]" />
                    <div className="space-y-2">
                      <div className="h-4 w-4/5 rounded-full bg-[#f0f4f7]" />
                      <div className="h-4 w-3/5 rounded-full bg-[#f6f9fc]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 rounded-2xl bg-[#f6f9fc]" />
                    <div className="h-10 rounded-2xl bg-[#f6f9fc]" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Active card ── */}
          <div
            className={`absolute inset-x-0 top-3 bottom-20 rounded-[24px] p-6 shadow-[0_32px_90px_rgba(15,23,42,0.14)] transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            style={{ zIndex: 20, backgroundColor: activeCardBg }}
          >
            {isStoryCard && accent ? (
              // ── Story card ──────────────────────────────────────────
              <div className="flex h-full flex-col">
                <div className="flex flex-1 flex-col">
                  {/* Tag */}
                  <div className="mb-4">
                    <Tag label={accent.tag} color={accent.color} bg={accent.tagBg} />
                  </div>

                  {/* Headline */}
                  <h2 style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)" }}>
                    {slides[storyIndex].headline}
                  </h2>

                  {/* Body */}
                  <p className="mt-3" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.7)", maxWidth: "90%", whiteSpace: "pre-line" }}>
                    {slides[storyIndex].punchline}
                  </p>

                  {/* Stat */}
                  {slides[storyIndex].stat && (
                    <div className="mt-auto pt-4">
                      <p
                        className="animate-[fadeInUp_0.4s_ease-out]"
                        style={{ ...typography.displaySmall, color: accent.color }}
                      >
                        {slides[storyIndex].stat!.value}
                      </p>
                      {slides[storyIndex].stat!.caption && (
                        <p className="mt-1" style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>
                          {slides[storyIndex].stat!.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between pt-4">
                  {storyIndex > 0 ? (
                    <NavBack onClick={onStoryBack} />
                  ) : (
                    <div className="h-12 w-12" />
                  )}
                  <NavForward onClick={onStoryAdvance} />
                </div>
              </div>

            ) : showReveal && revealData ? (
              // ── Reveal card ─────────────────────────────────────────
              <div className="flex h-full flex-col">
                {/* Tag */}
                <div className="mb-4">
                  <Tag label="REALITY CHECK" color="#ffffff" bg="#d30ad7" />
                </div>

                {/* Headline */}
                <h2 style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)" }}>
                  Here&apos;s what your money actually does.
                </h2>

                {/* Comparison blocks */}
                <div className="mt-6 space-y-4">
                  {/* Savings comparison */}
                  <div className="rounded-2xl bg-white/60 p-4">
                    <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>Savings</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)" }}>{revealData.savingsGuess}</span>
                      <span style={{ ...typography.caption, color: "rgba(0,0,0,0.3)" }}>&rarr;</span>
                      <span style={{ ...typography.headerH3, color: "#d30ad7" }}>{revealData.savingsActual}</span>
                    </div>
                  </div>

                  {/* Persona comparison */}
                  <div className="rounded-2xl bg-white/60 p-4">
                    <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>Persona</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)" }}>&ldquo;{revealData.personaGuess}&rdquo;</span>
                      <span style={{ ...typography.caption, color: "rgba(0,0,0,0.3)" }}>&rarr;</span>
                      <span style={{ ...typography.headerH3, color: "#d30ad7" }}>&ldquo;{revealData.personaActual}&rdquo;</span>
                    </div>
                  </div>
                </div>

                {/* Bottom copy */}
                <p className="mt-4" style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.7)" }}>
                  Your money just has habits. Let&apos;s work with them.
                </p>

                <div className="mt-auto flex items-center justify-end pt-4">
                  <NavForward onClick={onRevealDone} />
                </div>
              </div>

            ) : activeQuestion ? (
              // ── Question card ────────────────────────────────────────
              <div className="flex h-full flex-col">
                {/* Question counter tag */}
                <div className="mb-4">
                  <Tag
                    label={`QUESTION ${activeIndex + 1} OF ${questions.length}`}
                    color="rgba(0,0,0,0.5)"
                    bg="#eaebed"
                  />
                </div>

                {/* Question text */}
                <h2 style={{ ...typography.headerH2, color: "rgba(0,0,0,0.9)", maxWidth: "90%" }}>
                  {activeQuestion.text}
                </h2>

                {/* Chips */}
                <div className="mt-auto space-y-3 overflow-y-auto pr-1 pt-6">
                  {activeQuestion.chips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => onSelect(activeIndex, chip)}
                      disabled={isTransitioning}
                      className="flex w-full items-center justify-between border bg-white text-left disabled:cursor-not-allowed disabled:opacity-60 active:bg-[#fae2fa] active:border-[#d30ad7] transition-colors duration-150"
                      style={{ borderRadius: 100, borderColor: "#eaebed", padding: "8px 16px" }}
                    >
                      <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
