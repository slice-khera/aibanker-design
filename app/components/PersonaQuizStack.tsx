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
  showCover: boolean;
  showReveal: boolean;
  revealData?: RevealData;
  isTransitioning: boolean;
  onStart: () => void;
  onSelect: (questionIndex: number, chip: ChipOption) => void;
  onBack: () => void;
  onRevealDone: () => void;
};

const STACK_STYLES = [
  { rotate: "2deg",    translateY: "6px" },
  { rotate: "-1.5deg", translateY: "12px" },
];

const STORY_GRADIENTS = [
  "linear-gradient(135deg, #2b6acf 0%, #87068a 50%, #d30ad7 100%)",
  "linear-gradient(135deg, #171a1f 0%, #650567 50%, #252a31 100%)",
  "linear-gradient(135deg, #007e2f 0%, #006a28 50%, #00a63e 100%)",
  "linear-gradient(135deg, #ce1d26 0%, #da535a 50%, #d30ad7 100%)",
  "linear-gradient(135deg, #9d161d 0%, #ce1d26 50%, #a008a3 100%)",
  "linear-gradient(135deg, #87068a 0%, #a008a3 50%, #d30ad7 100%)",
];

function NavForward({ onClick, dark }: { onClick: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full focus-visible:outline-none active:scale-95"
      style={{ backgroundColor: "#D30AD7" }}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2">
        <path d="M4.5 10h9" strokeLinecap="round" />
        <path d="m10.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function NavBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white focus-visible:outline-none active:scale-95"
      style={{ border: "1.5px solid #D30AD7" }}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#D30AD7" strokeWidth="2">
        <path d="M15.5 10h-9" strokeLinecap="round" />
        <path d="m9.5 5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function PersonaQuizStack({
  slides,
  storyIndex,
  onStoryAdvance,
  onStoryBack,
  questions,
  activeIndex,
  showCover,
  showReveal,
  revealData,
  isTransitioning,
  onStart,
  onSelect,
  onBack,
  onRevealDone,
}: PersonaQuizStackProps) {
  const activeQuestion = questions[activeIndex];
  const isStoryCard = storyIndex >= 0;

  // Full deck: stories + cover + questions + reveal
  const totalCards = slides.length + questions.length + 2;
  const currentPosition = isStoryCard
    ? storyIndex
    : showCover
      ? slides.length
      : showReveal
        ? slides.length + questions.length + 1
        : slides.length + 1 + activeIndex;
  const stackCount = Math.min(2, totalCards - currentPosition - 1);

  // Active card background
  const activeCardBg = isStoryCard
    ? STORY_GRADIENTS[storyIndex % STORY_GRADIENTS.length]
    : showReveal
      ? "radial-gradient(circle at top, #c03de0 0%, #8b20b5 50%, #5c1278 100%)"
      : "white";

  return (
    <div
      className="relative flex h-full flex-col rounded-[16px] bg-[radial-gradient(circle_at_top,#fff_0%,#f7f8fb_45%,#edf0f5_100%)]"
      style={{
        fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif",
        paddingTop: Math.max(STATUS_BAR_HEIGHT, 24),
        color: "rgba(0,0,0,0.9)",
      }}
    >
      <div className="flex-1 p-6">
        <div className="relative mx-auto h-full max-w-[332px]">
          {/* Stack background cards */}
          {Array.from({ length: stackCount }, (_, i) => i).reverse().map((slot, stackOffset) => {
            const depth = stackCount - stackOffset;
            const style = STACK_STYLES[slot] ?? STACK_STYLES[0];
            return (
              <div
                key={slot}
                className="absolute inset-x-0 rounded-[24px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm"
                style={{
                  top: 12,
                  bottom: 80,
                  left: 16,
                  right: 16,
                  transform: `translateY(${style.translateY}) rotate(${style.rotate})`,
                  opacity: 0.85 - depth * 0.1,
                  transformOrigin: "center center",
                  zIndex: 10 - depth,
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

          {/* Active card */}
          <div
            className={`absolute inset-x-0 top-3 bottom-20 rounded-[24px] p-6 shadow-[0_32px_90px_rgba(15,23,42,0.14)] backdrop-blur transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            style={{ zIndex: 20, background: activeCardBg }}
          >
            {isStoryCard ? (
              // ── Story card ──────────────────────────────────────────
              <div className="flex h-full flex-col">
                {/* Content */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h2
                      className="text-white mb-3"
                      style={{ ...typography.headerH2, textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
                    >
                      {slides[storyIndex].headline}
                    </h2>
                    <p
                      className="text-white/80"
                      style={{ ...typography.bodySmall, maxWidth: "90%" }}
                    >
                      {slides[storyIndex].punchline}
                    </p>
                  </div>

                  {slides[storyIndex].stat && (
                    <div className="mt-auto pt-4">
                      <p
                        className="text-white"
                        style={{ ...typography.headerH1, textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                      >
                        {slides[storyIndex].stat!.value}
                      </p>
                      {slides[storyIndex].stat!.caption && (
                        <p className="text-white/70 mt-1" style={typography.caption}>
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
                    <div className="h-10 w-10" />
                  )}
                  <NavForward onClick={onStoryAdvance} />
                </div>
              </div>
            ) : showReveal && revealData ? (
              // ── Reveal card ─────────────────────────────────────────
              <div className="flex h-full flex-col">
                <div>
                  <p className="uppercase text-white/60" style={typography.caption}>Reality check</p>
                  <h2 className="mt-3 text-white" style={typography.headerH1}>
                    Here's what your money actually does.
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  <p className="text-white/70" style={typography.bodySmall}>
                    Here's how close you were 👀
                  </p>
                  <p className="text-white/70" style={typography.bodySmall}>
                    Savings: you guessed <span className="text-white" style={typography.buttonSmall}>{revealData.savingsGuess}</span> → actual <span className="text-white" style={typography.buttonSmall}>{revealData.savingsActual}</span>.
                  </p>
                  <p className="text-white/70" style={typography.bodySmall}>
                    Persona: you called yourself a <span className="text-white" style={typography.buttonSmall}>"{revealData.personaGuess}"</span> → reality is <span className="text-white" style={typography.buttonSmall}>"{revealData.personaActual}"</span> 😅
                  </p>
                  <p className="text-white/70" style={typography.bodySmall}>
                    Good news: you're not bad with money — your money just has habits.
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-end pt-6">
                  <NavForward onClick={onRevealDone} />
                </div>
              </div>
            ) : showCover ? (
              // ── Cover card ──────────────────────────────────────────
              <div className="flex h-full flex-col">
                <div className="space-y-4">
                  <h2 className="max-w-[270px] text-[rgba(0,0,0,0.9)]" style={typography.headerH1}>
                    Tell me how you think your money behaves.
                  </h2>
                </div>

                <div className="mt-auto flex items-center justify-end pt-6">
                  <NavForward onClick={onStart} />
                </div>
              </div>
            ) : activeQuestion ? (
              // ── Question card ────────────────────────────────────────
              <div className="flex h-full flex-col">
                <div className="space-y-4">
                  <h2 className="max-w-[260px] text-[rgba(0,0,0,0.9)]" style={typography.headerH1}>
                    {activeQuestion.text}
                  </h2>
                </div>

                <div className="mt-auto space-y-3 overflow-y-auto pr-1 pt-6">
                  {activeQuestion.chips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => onSelect(activeIndex, chip)}
                      disabled={isTransitioning}
                      className="flex w-full items-center justify-between border bg-white text-left disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ borderRadius: 100, borderColor: "rgba(0,0,0,0.2)", padding: "8px 16px" }}
                    >
                      <span className="text-[rgba(0,0,0,0.9)]" style={typography.buttonSmall}>{chip.label}</span>
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
