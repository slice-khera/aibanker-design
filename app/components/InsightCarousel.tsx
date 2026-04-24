"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { typography } from "../lib/typography";
import {
  VALENTINO_500, VALENTINO_700,
  ALPHA_WHITE_FF, ALPHA_WHITE_70, ALPHA_WHITE_50, ALPHA_WHITE_40, ALPHA_WHITE_20, ALPHA_WHITE_10,
  TEXT_ON_COLOR_PRIMARY, TEXT_ON_COLOR_SECONDARY, TEXT_ON_COLOR_TERTIARY,
  GREEN_400, GREEN_500, RED_500,
  ORANGE_400,
} from "../lib/colors";
import { SPACE_XS, SPACE_S, SPACE_M, SPACE_L } from "../lib/spacing";
import { RADIUS_L } from "../lib/radii";
import { StatusBar, GestureNav } from "./AppChrome";

// ── Types ─────────────────────────────────────────────────────────

export type HighlightSegment =
  | { type: "text"; value: string }
  | { type: "accent"; value: string };

export type MerchantItem = { name: string; amount: number; pct: number; color: string };

export type InsightViz =
  | { type: "bars"; data: { label: string; value: number; color?: string }[]; maxValue?: number }
  | { type: "balance"; earned: number; spent: number }
  | { type: "merchantList"; merchants: MerchantItem[]; totalSpend: number }
  | { type: "trendBars"; data: { label: string; value: number }[]; highlightIndex?: number; average?: number }
  | { type: "dots"; total: number; filled: number; missedIndices?: number[] }
  | { type: "celebrate"; emoji: string }
  | { type: "none" };

export type InsightSlide = {
  id: string;
  header: HighlightSegment[];
  viz: InsightViz;
  body: string;
  caption?: string;
};

type InsightCarouselProps = {
  slides: InsightSlide[];
  onComplete: () => void;
  onClose?: () => void;
  onSkip?: () => void;
};

// ── Constants ─────────────────────────────────────────────────────

const ACCENT = ORANGE_400;
const VIZ_PADDING_PX = 20;
const VIZ_PADDING = `${VIZ_PADDING_PX}px`;

// ── Top bar icons (inline SVGs, white for dark bg) ───────────────

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={ALPHA_WHITE_70} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
      <path d="M3.138 12C1.406 12 0 10.594 0 8.868V6.843C0 6.376 0.38 6.003 0.846 6.003C1.313 6.003 1.692 6.383 1.692 6.843V8.868C1.692 9.668 2.345 10.321 3.145 10.321H8.855C9.655 10.321 10.308 9.668 10.308 8.868V6.843C10.308 6.376 10.687 6.003 11.154 6.003C11.62 6.003 12 6.383 12 6.843V8.868C12 10.594 10.594 12 8.862 12H3.138ZM5.997 7.682C5.53 7.682 5.15 7.303 5.15 6.843V2.885L3.731 4.304C3.405 4.631 2.865 4.631 2.539 4.304C2.212 3.978 2.212 3.445 2.539 3.112L5.417 0.233C5.49 0.16 5.577 0.107 5.67 0.067C5.77 0.027 5.877 0 5.99 0H5.997C6.11 0 6.217 0.027 6.316 0.067C6.41 0.107 6.496 0.16 6.57 0.233L6.59 0.253L9.448 3.105C9.775 3.431 9.775 3.964 9.448 4.298C9.122 4.631 8.582 4.624 8.255 4.298L6.836 2.878V6.83C6.836 7.296 6.456 7.669 5.99 7.669L5.997 7.682Z" fill={ALPHA_WHITE_70} />
    </svg>
  );
}

// ── Visualization renderers ──────────────────────────────────────

function renderViz(viz: InsightViz) {
  switch (viz.type) {
    case "bars":
      return <BarViz data={viz.data} maxValue={viz.maxValue} />;
    case "balance":
      return <BalanceViz earned={viz.earned} spent={viz.spent} />;
    case "dots":
      return <DotsViz total={viz.total} filled={viz.filled} missedIndices={viz.missedIndices} />;
    case "merchantList":
      return <MerchantListViz merchants={viz.merchants} totalSpend={viz.totalSpend} />;
    case "trendBars":
      return <TrendBarsViz data={viz.data} highlightIndex={viz.highlightIndex} average={viz.average} />;
    case "celebrate":
      return <CelebrateViz emoji={viz.emoji} />;
    case "none":
      return null;
  }
}

function MerchantListViz({ merchants, totalSpend }: { merchants: MerchantItem[]; totalSpend: number }) {
  return (
    <div className="h-full flex flex-col justify-center" style={{ padding: VIZ_PADDING, gap: SPACE_M }}>
      {merchants.map((m, i) => (
        <div key={m.name} className="flex items-center" style={{ gap: 12 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36, height: 36, borderRadius: 100,
              backgroundColor: m.color,
            }}
          >
            <span style={{ ...typography.buttonSmall, color: ALPHA_WHITE_FF }}>{m.name.charAt(0)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_PRIMARY, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {m.name}
            </p>
            <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ width: `${(m.amount / totalSpend) * 100}%`, height: "100%", backgroundColor: m.color, borderRadius: 100 }} />
            </div>
          </div>
          <div className="shrink-0" style={{ textAlign: "right" }}>
            <p style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_PRIMARY, margin: 0, whiteSpace: "nowrap" }}>
              ₹{m.amount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatCompact(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
}

function TrendBarsViz({ data, highlightIndex = data.length - 1, average }: { data: { label: string; value: number }[]; highlightIndex?: number; average?: number }) {
  const max = Math.max(...data.map((d) => d.value), average ?? 0) * 1.25;
  return (
    <div className="h-full flex flex-col" style={{ padding: VIZ_PADDING }}>
      {/* Bar area */}
      <div className="flex items-end flex-1 relative" style={{ gap: SPACE_M }}>
        {/* Average dashed line */}
        {average != null && max > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: `${(average / max) * 100}%`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            <div style={{ flex: 1, borderTop: `1.5px dashed ${ALPHA_WHITE_20}` }} />
            <span style={{ ...typography.metadata, color: ALPHA_WHITE_40, whiteSpace: "nowrap" }}>
              avg {formatCompact(average)}
            </span>
          </div>
        )}
        {data.map((d, i) => {
          const pct = max > 0 ? (d.value / max) * 100 : 0;
          const isActive = i === highlightIndex;
          return (
            <div key={d.label} className="flex flex-col items-center flex-1" style={{ height: "100%" }}>
              {/* Value label above bar */}
              <div className="w-full flex justify-center" style={{ marginBottom: 6 }}>
                <span style={{ ...typography.caption, color: isActive ? TEXT_ON_COLOR_PRIMARY : ALPHA_WHITE_40, fontWeight: isActive ? 500 : 400 }}>
                  {formatCompact(d.value)}
                </span>
              </div>
              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ flex: 1 }}>
                <div
                  style={{
                    width: "55%",
                    height: `${Math.max(pct, 8)}%`,
                    backgroundColor: isActive ? VALENTINO_500 : "rgba(211,10,215,0.2)",
                    borderRadius: `4px 4px 0 0`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Month labels */}
      <div className="flex" style={{ marginTop: SPACE_XS }}>
        {data.map((d, i) => (
          <span
            key={d.label}
            className="flex-1 text-center"
            style={{ ...typography.caption, color: i === highlightIndex ? TEXT_ON_COLOR_PRIMARY : ALPHA_WHITE_50, fontWeight: i === highlightIndex ? 500 : 400 }}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BalanceViz({ earned, spent }: { earned: number; spent: number }) {
  const isDeficit = spent > earned;
  const max = Math.max(earned, spent);
  const earnedPct = (earned / max) * 100;
  const spentPct = (spent / max) * 100;
  const diff = Math.abs(spent - earned);

  // Format compact: ₹4.2K, ₹1.2L etc.
  const fmt = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

  return (
    <div className="flex flex-col justify-center h-full" style={{ padding: VIZ_PADDING, gap: SPACE_L }}>
      {/* Earned bar (baseline — always full width) */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE_XS }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_SECONDARY }}>Earned</span>
          <span style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_PRIMARY }}>{fmt(earned)}</span>
        </div>
        <div style={{ height: 8, backgroundColor: ALPHA_WHITE_10, borderRadius: 100, overflow: "hidden" }}>
          <div style={{ width: `${earnedPct}%`, height: "100%", backgroundColor: GREEN_400, borderRadius: 100 }} />
        </div>
      </div>

      {/* Spent bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE_XS }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_SECONDARY }}>Spent</span>
          <span style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_PRIMARY }}>{fmt(spent)}</span>
        </div>
        <div style={{ height: 8, backgroundColor: ALPHA_WHITE_10, borderRadius: 100, overflow: "hidden" }}>
          <div style={{ width: `${spentPct}%`, height: "100%", backgroundColor: RED_500, borderRadius: 100 }} />
        </div>
      </div>

      {/* Deficit / surplus callout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: SPACE_XS,
          paddingTop: SPACE_XS,
          borderTop: `1px solid ${ALPHA_WHITE_10}`,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 100, backgroundColor: isDeficit ? RED_500 : GREEN_400 }} />
        <span style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_TERTIARY }}>
          {isDeficit ? "Overspent" : "Saved"} {fmt(diff)}
        </span>
      </div>
    </div>
  );
}

function BarViz({ data, maxValue }: { data: { label: string; value: number; color?: string }[]; maxValue?: number }) {
  const max = maxValue ?? Math.max(...data.map((d) => Math.abs(d.value)));
  return (
    <div className="flex items-end justify-around h-full" style={{ padding: VIZ_PADDING, gap: SPACE_XS }}>
      {data.map((d) => {
        const pct = max > 0 ? (Math.abs(d.value) / max) * 100 : 0;
        const barColor = d.color ?? ACCENT;
        return (
          <div key={d.label} className="flex flex-col items-center flex-1" style={{ gap: 6 }}>
            <div className="w-full flex items-end justify-center" style={{ flex: 1 }}>
              <div
                style={{
                  width: "60%",
                  height: `${Math.max(pct, 10)}%`,
                  backgroundColor: barColor,
                  borderRadius: `4px 4px 0 0`,
                  boxShadow: `0 0 12px ${barColor}40`,
                }}
              />
            </div>
            <span style={{ ...typography.metadata, color: ALPHA_WHITE_50 }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DotsViz({ total, filled, missedIndices = [] }: { total: number; filled: number; missedIndices?: number[] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ padding: VIZ_PADDING, gap: SPACE_M }}>
      <div className="flex flex-wrap justify-center" style={{ gap: SPACE_XS, maxWidth: 200 }}>
        {Array.from({ length: total }).map((_, i) => {
          const isMissed = missedIndices.includes(i);
          const isFilled = i < filled;
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 100,
                backgroundColor: isMissed ? RED_500 : isFilled ? GREEN_500 : "rgba(255,255,255,0.15)",
              }}
            />
          );
        })}
      </div>
      {missedIndices.length > 0 && (
        <div className="flex items-center" style={{ gap: SPACE_XS }}>
          <div style={{ width: 8, height: 8, borderRadius: 100, backgroundColor: RED_500 }} />
          <span style={{ ...typography.metadata, color: TEXT_ON_COLOR_TERTIARY }}>missed</span>
          <div style={{ width: 8, height: 8, borderRadius: 100, backgroundColor: GREEN_500, marginLeft: SPACE_XS }} />
          <span style={{ ...typography.metadata, color: TEXT_ON_COLOR_TERTIARY }}>on time</span>
        </div>
      )}
    </div>
  );
}

function CelebrateViz({ emoji }: { emoji: string }) {
  return (
    <div className="flex items-center justify-center h-full" style={{ padding: VIZ_PADDING, fontSize: 64 }}>
      {emoji}
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────

const SLIDE_DURATION = 7000; // 7s per slide
const TICK_INTERVAL = 50;     // progress update every 50ms

// ── Main component ───────────────────────────────────────────────

export default function InsightCarousel({ slides, onComplete, onClose, onSkip }: InsightCarouselProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasAdvanced = useRef(false);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  }, [isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  }, [index]);

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0);
    hasAdvanced.current = false;
  }, [index]);

  // Auto-advance timer — fills on all slides, but only advances on non-last
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL / SLIDE_DURATION) * 100;
        if (next >= 100) {
          if (!isLast && !hasAdvanced.current) {
            hasAdvanced.current = true;
            setTimeout(goNext, 0);
          }
          return 100;
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, goNext, index, isLast]);

  // Tap handler — left third = back, right two-thirds = forward
  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) {
      goPrev();
    } else {
      goNext();
    }
  }, [goNext, goPrev]);

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        /* #1a0a2e is a custom dark purple not in DLS (closest: VALENTINO_950 #260227) */
        background: `linear-gradient(165deg, #1a0a2e 0%, ${VALENTINO_700} 50%, ${VALENTINO_500} 100%)`,
        fontFamily: "var(--font-rubik), var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* ── Status bar (inverted for dark bg) ─────────────────── */}
      <div style={{ filter: "invert(1) brightness(2)" }}>
        <StatusBar backgroundColor="transparent" />
      </div>

      {/* ── App bar: close / brand / share ─────────────────────── */}
      <div
        className="flex items-center shrink-0"
        style={{ paddingTop: SPACE_XS, paddingBottom: SPACE_XS, paddingLeft: SPACE_S, paddingRight: SPACE_XS }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose ?? onSkip}
          className="flex items-center justify-center shrink-0"
          style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Brand — center, uses DLS app bar title token (headerH4) */}
        <div className="flex-1 flex justify-center">
          <span
            style={{
              ...typography.headerH4,
              color: TEXT_ON_COLOR_PRIMARY,
            }}
          >
            slice
          </span>
        </div>

        {/* Share */}
        <button
          type="button"
          className="flex items-center justify-center shrink-0"
          style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          aria-label="Share"
        >
          <ShareIcon />
        </button>
      </div>

      {/* ── Content area (tap zones: left 1/3 = back, right 2/3 = forward) ── */}
      <div
        className="flex-1 flex flex-col overflow-y-auto cursor-pointer select-none"
        style={{ padding: `${SPACE_M}px ${SPACE_L}px 0` }}
        onClick={handleTap}
      >
        {/* Header — insight sentence */}
        <p style={{ ...typography.headerH2, color: TEXT_ON_COLOR_SECONDARY, fontWeight: 400 }}>
          {slide.header.map((seg, i) =>
            seg.type === "accent" ? (
              <span key={i} style={{ color: TEXT_ON_COLOR_PRIMARY, fontWeight: 500 }}>{seg.value}</span>
            ) : (
              <span key={i}>{seg.value}</span>
            ),
          )}
        </p>

        {/* Visualization card — empty placeholder */}
        {slide.viz.type !== "none" && (
          <div
            style={{
              marginTop: SPACE_L,
              width: "100%",
              aspectRatio: "360 / 780",
              borderRadius: 24,
              backgroundColor: ALPHA_WHITE_20,
              border: "1px solid rgba(255,255,255,0.25)",
              overflow: "hidden",
            }}
          />
        )}

        {/* Body text */}
        <div style={{ marginTop: SPACE_L }}>
          <p style={{ ...typography.bodySmall, color: TEXT_ON_COLOR_SECONDARY }}>
            {slide.body}
          </p>
          {slide.caption && (
            <p
              style={{
                ...typography.caption,
                color: TEXT_ON_COLOR_TERTIARY,
                fontStyle: "italic",
                marginTop: SPACE_XS,
              }}
            >
              {slide.caption}
            </p>
          )}
        </div>
      </div>

      {/* ── Bottom nav: dash indicators + Next ────────────────── */}
      <div
        className="flex items-center shrink-0"
        style={{ padding: `${SPACE_M}px ${SPACE_L}px ${SPACE_L}px` }}
      >
        {/* Dash indicators with progress fill */}
        <div className="flex flex-1" style={{ gap: 6 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                height: 3,
                flex: 1,
                maxWidth: 28,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.25)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  backgroundColor: ALPHA_WHITE_FF,
                  width: i < index ? "100%" : i === index ? `${progress}%` : "0%",
                  transition: i === index ? "none" : "width 200ms ease",
                }}
              />
            </div>
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={goNext}
          style={{
            ...typography.buttonSmall,
            color: ALPHA_WHITE_FF,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: `${SPACE_XS}px ${SPACE_M}px`,
          }}
        >
          {isLast ? "Done" : "Next"}
        </button>
      </div>

      {/* Gesture nav */}
      <GestureNav />
    </div>
  );
}
