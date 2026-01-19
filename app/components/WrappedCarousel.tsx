"use client";

import { useRef, useState } from "react";
import type { WrappedSlide } from "../data/flows";

type WrappedCarouselProps = {
  slides: WrappedSlide[];
  onComplete: () => void;
};

export default function WrappedCarousel({
  slides,
  onComplete,
}: WrappedCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slide = slides[index];
  const isLastSlide = index === slides.length - 1;

  const goNext = () => {
    if (animating) return;

    if (isLastSlide) {
      onComplete();
      return;
    }

    setDirection("next");
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, slides.length - 1));
      setAnimating(false);
    }, 200);
  };

  const goPrev = () => {
    if (animating || index === 0) return;
    setDirection("prev");
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => Math.max(prev - 1, 0));
      setAnimating(false);
    }, 200);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goPrev();
    if (delta < -50) goNext();
    touchStartX.current = null;
  };

  const getAnimationClass = () => {
    if (!animating) return "opacity-100 translate-x-0";
    return direction === "next"
      ? "opacity-0 -translate-x-4"
      : "opacity-0 translate-x-4";
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-6 text-white shadow-2xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Progress indicator */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-xs font-bold">{index + 1}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium">
            Month Wrapped
          </p>
        </div>
        <span className="text-xs text-white/40 font-medium">
          {index + 1} of {slides.length}
        </span>
      </div>

      {/* Main content */}
      <div
        className={`relative flex-1 space-y-6 transition-all duration-200 ease-out ${getAnimationClass()}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="space-y-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            {slide.headline}
          </h1>
          <p className="text-base leading-relaxed text-white/70">
            {slide.punchline}
          </p>
        </div>

        {slide.stat && (
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 backdrop-blur-sm animate-scale-in">
            <p className="text-xs uppercase tracking-[0.15em] text-white/50 font-medium">
              {slide.stat.label}
            </p>
            <p className="mt-3 text-4xl font-bold text-gradient">
              {slide.stat.value}
            </p>
            {slide.stat.caption && (
              <p className="mt-2 text-sm text-white/60">{slide.stat.caption}</p>
            )}
          </div>
        )}

        {slide.receipts && (
          <button className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white/80 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View receipts
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="relative flex items-center justify-between pt-6">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 disabled:opacity-30 hover:border-white/30 hover:text-white/80 hover:bg-white/5 active:scale-95"
        >
          Back
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => {
                if (dotIndex !== index) {
                  setDirection(dotIndex > index ? "next" : "prev");
                  setAnimating(true);
                  setTimeout(() => {
                    setIndex(dotIndex);
                    setAnimating(false);
                  }, 200);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? "bg-white w-6"
                  : dotIndex < index
                  ? "bg-white/50 w-2 hover:bg-white/70"
                  : "bg-white/20 w-2 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-200 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 active:scale-95"
        >
          {isLastSlide ? "Start" : "Next"}
        </button>
      </div>
    </div>
  );
}
