"use client";

import { useRef, useState, type ReactNode } from "react";
import { typography } from "../lib/typography";

// ─── Shared types ──────────────────────────────────────────

export type CardVariant = "card" | "surface";

export type ChatCardData =
  | { type: "spend-overview"; variant?: CardVariant; month: string; amount: number; comparisonText: string; chartData: { label: string; value: number }[]; average: number; highlightIndex: number }
  | { type: "category-breakdown"; variant?: CardVariant; month: string; amount: number; subtext: string; showAll?: boolean; categories: { name: string; amount: number; pct: number; color: string; icon: ReactNode }[] }
  | { type: "investment-product"; variant?: CardVariant; productType: string; amount: number; rate: string; tenure: string; amountOptions: { label: string; value: number }[]; accountLabel: string; activated?: boolean; onContinue?: () => void; onInvest?: (amount: number) => void; onAmountSelect?: (amount: number) => void; onArrowTap?: () => void }
  | { type: "goal-progress"; variant?: CardVariant; name: string; pct: number; saved: number; target: number; daysLabel: string; status: "ahead" | "behind" | "on-track"; onArrowTap?: () => void }
  | { type: "savings-plan"; variant?: CardVariant; name: string; target: number; timeline: string; existingSavings: number; monthlyAmount: number; productType: string; productLabel: string; rate: string; pct: number; timelineLabel: string }
  | { type: "merchant-concentration"; variant?: CardVariant; month: string; totalSpend: number; totalMerchants?: number; merchants: { name: string; amount: number; pct: number; color: string }[] }
  | { type: "category-mom"; variant?: CardVariant; thisMonth: string; lastMonth: string; categories: { name: string; thisValue: number; lastValue: number; color: string }[] }
  | { type: "spending-heatmap"; variant?: CardVariant; month: string; year: number; startDay: number; dailySpend: (number | null)[]; maxSpend: number }
  | { type: "payment-mode-donut-v2"; variant?: CardVariant; month: string; totalSpend: number; modes: { name: string; amount: number; pct: number; color: string }[] }
  | { type: "transaction-table"; variant?: CardVariant; title: string; transactions: { date: string; merchant: string; amount: number; category: string }[] }
  | { type: "obligations-list-v2"; variant?: CardVariant; items: { id: string; payee: string; amount: number; type: string; seenMonths: string }[]; monthlyIncome: number; onSubmit?: (selected: { id: string; amount: number; type: string }[]) => void; submitted?: boolean; onArrowTap?: () => void }
  | { type: "big-expenses"; variant?: CardVariant; transactions: { id: string; payee: string; date: string; type: string; amount: number }[]; periodLabel: string; total: number; onRowTap?: (id: string) => void }
  | { type: "spend-trend"; variant?: CardVariant; month: string; chartData: { label: string; value: number }[]; average: number; highlightIndex: number };

// ─── Helpers ───────────────────────────────────────────────

function formatINR(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Smooth bezier path through points using cardinal spline control points
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;

  const tension = 0.4;
  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// ─── DLS Tag ──────────────────────────────────────────────
// DLS 2.0 Tag: 6 intents × 2 emphasis. Pill, Metadata font, uppercase.
// Ref: reference_tags.md

const TAG_STYLES: Record<string, Record<string, { bg: string; text: string }>> = {
  subtle: {
    positive: { bg: "#E0F4E8", text: "#00A63E" },
    warning:  { bg: "#FFF3E3", text: "#C27511" },
    negative: { bg: "#F9E4E5", text: "#CE1D26" },
    brand:    { bg: "#FAE2FA", text: "#D30AD7" },
    info:     { bg: "#E6EDF9", text: "#2B6ACF" },
    neutral:  { bg: "#F6F9FC", text: "#252A31" },
  },
  bold: {
    positive: { bg: "#00A63E", text: "#fff" },
    warning:  { bg: "#FF9A17", text: "#fff" },
    negative: { bg: "#DA535A", text: "#fff" },
    brand:    { bg: "#D30AD7", text: "#fff" },
    info:     { bg: "#2B6ACF", text: "#fff" },
    neutral:  { bg: "#252A31", text: "#fff" },
  },
};

function DlsTag({
  intent = "neutral",
  emphasis = "subtle",
  children,
}: {
  intent?: "positive" | "warning" | "negative" | "brand" | "info" | "neutral";
  emphasis?: "subtle" | "bold";
  children: ReactNode;
}) {
  const colors = TAG_STYLES[emphasis][intent];
  return (
    <span
      style={{
        ...typography.metadata,
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: 100,
        backgroundColor: colors.bg,
        color: colors.text,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// ─── Shared card shell ─────────────────────────────────────

const CARD_BG = "#f6f9fc";
const CARD_RADIUS = 16;
const CARD_PAD = "16px";

// ─── Card header (shared) ──────────────────────────────────

function CardHeader({ label, onArrowTap, arrowInvisible }: { label: string; onArrowTap?: () => void; arrowInvisible?: boolean }) {
  const arrowIcon = (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: arrowInvisible ? 0 : 1,
        transition: "opacity 300ms ease",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M3 10L10 3M10 3H4.5M10 3V8.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span
        style={{
          ...typography.metadata,
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.5)",
        }}
      >
        {label}
      </span>
      {onArrowTap && (
        <button
          type="button"
          onClick={onArrowTap}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: arrowInvisible ? "default" : "pointer",
            pointerEvents: arrowInvisible ? "none" : "auto",
          }}
          aria-label={`Open ${label} details`}
        >
          {arrowIcon}
        </button>
      )}
    </div>
  );
}

// ─── Confirmed row (shared) ────────────────────────────────
// Shown at the bottom of an actionable card once the action is done.

function ConfirmedRow({ label, onArrowTap }: { label: string; onArrowTap?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* Green check circle */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#00a63e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)", flex: 1 }}>{label}</span>
      {onArrowTap && (
        <button
          type="button"
          onClick={onArrowTap}
          style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", display: "flex" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M3 10L10 3M10 3H4.5M10 3V8.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── 1. Spend Overview Card ────────────────────────────────

function SpendOverviewCard({ data }: { data: Extract<ChatCardData, { type: "spend-overview" }> }) {
  const { month, chartData, average, highlightIndex, variant = "card" } = data;
  const [activeIndex, setActiveIndex] = useState(highlightIndex);
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const W = 280;
  const H = 110;
  const padX = 18;
  const padTop = 16;
  const padBottom = 26;
  const chartW = W - padX * 2;
  const chartH = H - padTop - padBottom;

  const maxVal = Math.max(
    ...chartData.map((d) => d.value),
    average
  ) * 1.2;

  const xPositions = chartData.map((_, i) =>
    padX + (chartW / Math.max(chartData.length - 1, 1)) * i
  );

  const points = chartData.map((d, i) => ({
    x: xPositions[i],
    y: padTop + chartH - (d.value / maxVal) * chartH,
  }));

  const avgY = padTop + chartH - (average / maxVal) * chartH;
  const linePath = smoothPath(points);

  // Snap to nearest month index from pointer x in SVG coordinates
  const snapToMonth = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < xPositions.length; i++) {
      const dist = Math.abs(svgX - xPositions[i]);
      if (dist < minDist) { minDist = dist; closest = i; }
    }
    setActiveIndex(closest);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    snapToMonth(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    snapToMonth(e.clientX);
  };
  const handlePointerUp = () => { isDragging.current = false; };

  const activePoint = points[activeIndex];
  const activeMonthLabel = chartData[activeIndex].label;
  const activeMonthValue = chartData[activeIndex].value;

  // Compute comparison text dynamically for any selected month
  const pctDiff = average > 0 ? Math.round(((activeMonthValue - average) / average) * 100) : 0;
  const comparisonLabel = pctDiff > 0
    ? `${pctDiff}% higher than your average`
    : pctDiff < 0
    ? `${Math.abs(pctDiff)}% lower than your average`
    : "On par with your average";

  // Color-code: green = under average, orange = slightly over (≤15%), red = significantly over
  const comparisonColor = pctDiff <= 0 ? "#00a63e" : pctDiff <= 15 ? "#ff9a17" : "#ce1d26";

  // SVG chart height excludes month labels (those are HTML now)
  const svgH = 80;

  const chart = (
    <div>
      <svg
        ref={svgRef}
        width={W}
        height={svgH}
        viewBox={`0 0 ${W} ${svgH}`}
        style={{ width: "100%", height: "auto", overflow: "visible", display: "block", touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <path d={linePath} fill="none" stroke="#d30ad7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Average dashed line */}
        <line x1={padX} y1={avgY} x2={W - padX} y2={avgY} stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeDasharray="5 4" />

        {/* Handle dot with glow */}
        {activePoint && (
          <>
            <circle cx={activePoint.x} cy={activePoint.y} r={12} fill="#d30ad7" opacity="0.12" />
            <circle cx={activePoint.x} cy={activePoint.y} r={5} fill="#fff" stroke="#d30ad7" strokeWidth="2.5" />
          </>
        )}
      </svg>

      {/* Month labels — HTML row with DLS Tag for active month */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        {chartData.map((d, i) => (
          i === activeIndex ? (
            <DlsTag key={i} intent="brand" emphasis="bold">{d.label}</DlsTag>
          ) : (
            <span
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.3)", textAlign: "center", flex: 1, cursor: "pointer" }}
            >
              {d.label}
            </span>
          )
        ))}
      </div>
    </div>
  );

  // Derive display values from active selection
  const displayMonth = activeIndex === highlightIndex ? month : activeMonthLabel;
  const displayAmount = activeMonthValue;

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {displayMonth} spends
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(displayAmount)}
        </p>
        <p style={{ ...typography.caption, color: comparisonColor, marginBottom: 12 }}>
          {comparisonLabel}
        </p>
        {chart}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label={`${displayMonth} spends`} />
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(displayAmount)}
      </p>
      <p style={{ ...typography.caption, color: "#ff9a17", marginBottom: 12 }}>
        {comparisonLabel}
      </p>
      {chart}
    </div>
  );
}

// ─── 2. Category Breakdown Card ────────────────────────────

// Category icon SVGs — 20×20, 1.4 stroke, rounded caps
function CatIcon({ children, color }: { children: ReactNode; color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export const CATEGORY_ICONS: Record<string, ReactNode> = {
  // Food Delivery — burger/takeout bag
  "Food Delivery (Swiggy)": (
    <CatIcon color="#ff9a17">
      <rect x="4" y="8" width="12" height="8" rx="1.5" />
      <path d="M4 11h12" />
      <path d="M7 8V6a3 3 0 0 1 6 0v2" />
    </CatIcon>
  ),
  // Groceries — shopping cart
  "Groceries (Swiggy Instamart)": (
    <CatIcon color="#00a63e">
      <path d="M3 3h1.5l1.2 7.2a1.5 1.5 0 0 0 1.5 1.3h6.1a1.5 1.5 0 0 0 1.5-1.2L16 6H6" />
      <circle cx="8" cy="15" r="1" fill="#00a63e" stroke="none" />
      <circle cx="14" cy="15" r="1" fill="#00a63e" stroke="none" />
    </CatIcon>
  ),
  // Dining Out — wine glass
  "Dining Out (Swiggy Dineout)": (
    <CatIcon color="#ce1d26">
      <path d="M7 3h6l-1 6H8L7 3z" />
      <path d="M10 9v5" />
      <path d="M7 17h6" />
    </CatIcon>
  ),
  // Shopping (Amazon) — shopping bag
  "Shopping (Amazon)": (
    <CatIcon color="#d30ad7">
      <rect x="4" y="6" width="12" height="11" rx="1.5" />
      <path d="M7 6V5a3 3 0 0 1 6 0v1" />
    </CatIcon>
  ),
  // Cash Withdrawals — banknote
  "Cash Withdrawals (ATM)": (
    <CatIcon color="#4e5866">
      <rect x="2" y="5" width="16" height="10" rx="1.5" />
      <circle cx="10" cy="10" r="2.5" />
      <path d="M5 5v10M15 5v10" />
    </CatIcon>
  ),
  // Other / Uncategorized — box
  "Other / Uncategorized": (
    <CatIcon color="#8e949d">
      <rect x="3" y="7" width="14" height="10" rx="1.5" />
      <path d="M3 7l2-4h10l2 4" />
      <path d="M10 7v10" />
    </CatIcon>
  ),
  // Shopping — shopping bag (same as Shopping (Amazon))
  "Shopping": (
    <CatIcon color="#d30ad7">
      <rect x="4" y="6" width="12" height="11" rx="1.5" />
      <path d="M7 6V5a3 3 0 0 1 6 0v1" />
    </CatIcon>
  ),
  // Food & Dining — fork and knife
  "Food & Dining": (
    <CatIcon color="#ff9a17">
      <path d="M7 3v5a2 2 0 0 0 2 2v7" />
      <path d="M5 3v3a2 2 0 0 0 2 2" />
      <path d="M13 3l1 7h-2l1-7zM13 10v7" />
    </CatIcon>
  ),
  // Travel — plane
  "Travel": (
    <CatIcon color="#2b6acf">
      <path d="M17 3L9 11M17 3l-2 14-4-5M17 3L3 7l5 4" />
    </CatIcon>
  ),
  // Entertainment — clapperboard / play
  "Entertainment": (
    <CatIcon color="#87068a">
      <rect x="3" y="6" width="14" height="11" rx="1.5" />
      <path d="M3 6l3-3 3 3 3-3 2 3" />
      <path d="M9 10v4l3.5-2L9 10z" fill="#87068a" stroke="none" />
    </CatIcon>
  ),
  // Health — heart + pulse
  "Health": (
    <CatIcon color="#3dbb6c">
      <path d="M3 11l3-3 2 2 4-4 2 2 3-3" />
      <path d="M15 5h3v3" />
    </CatIcon>
  ),
  // Utilities — lightning bolt
  "Utilities": (
    <CatIcon color="#ffb24f">
      <path d="M11 2L5 11h4l-1 7 7-9h-4l1-7z" fill="#ffb24f" stroke="none" />
    </CatIcon>
  ),
};

export const CATEGORY_COLORS: Record<string, string> = {
  "Food Delivery (Swiggy)": "#ff9a17",       // Orange/500
  "Groceries (Swiggy Instamart)": "#00a63e", // Green/500
  "Dining Out (Swiggy Dineout)": "#ce1d26",  // Red/500
  "Shopping (Amazon)": "#d30ad7",            // Valentino/500
  "Cash Withdrawals (ATM)": "#4e5866",       // Slate/500
  "Other / Uncategorized": "#8e949d",        // Slate/300
  "Shopping": "#d30ad7",                     // Valentino/500
  "Food & Dining": "#ff9a17",                // Orange/500
  "Travel": "#2b6acf",                       // Blue/500
  "Entertainment": "#87068a",                // Valentino/700
  "Health": "#3dbb6c",                       // Green/400
  "Utilities": "#ffb24f",                    // Orange/400
};

// Map fill color → /50 track shade from the same DLS palette
const COLOR_TRACK: Record<string, string> = {
  "#ff9a17": "#fff3e3", // Orange/500 → Orange/50
  "#ffb24f": "#fff3e3", // Orange/400 → Orange/50
  "#00a63e": "#e0f4e8", // Green/500 → Green/50
  "#3dbb6c": "#e0f4e8", // Green/400 → Green/50
  "#ce1d26": "#f9e4e5", // Red/500 → Red/50
  "#d30ad7": "#fae2fa", // Valentino/500 → Valentino/50
  "#87068a": "#fae2fa", // Valentino/700 → Valentino/50
  "#2b6acf": "#e6edf9", // Blue/500 → Blue/50
  "#4e5866": "#eaebed", // Slate/500 → Slate/50
  "#8e949d": "#eaebed", // Slate/300 → Slate/50
};

function trackColor(fill: string): string {
  return COLOR_TRACK[fill] ?? "#eaebed";
}

function CategoryBreakdownCard({ data }: { data: Extract<ChatCardData, { type: "category-breakdown" }> }) {
  const { variant, month, amount, subtext, showAll, categories } = data;

  // Enforce max 5 items: if >5, show top 4 + "Other" rollup
  const capped = (() => {
    if (categories.length <= 5) return categories;
    const top4 = categories.slice(0, 4);
    const rest = categories.slice(4);
    const otherAmount = rest.reduce((s, c) => s + c.amount, 0);
    const otherPct = rest.reduce((s, c) => s + c.pct, 0);
    return [...top4, { name: "Other", amount: otherAmount, pct: otherPct, color: "#8e949d", icon: "📦" as ReactNode }];
  })();

  const displayCats = showAll ? capped : capped.slice(0, 3);

  const categoryRows = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {displayCats.map((cat) => (
        <div
          key={cat.name}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: "#fff",
              border: "1px solid #f0f4f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {cat.icon}
          </div>

          {/* Name + progress bar */}
          <div style={{ flex: "1 0 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", margin: 0 }}>
              {cat.name}
            </p>
            <div style={{ paddingTop: 4, paddingBottom: 4 }}>
              <div style={{ height: 8, backgroundColor: trackColor(cat.color), borderRadius: 100, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(cat.pct, 100)}%`,
                    height: "100%",
                    backgroundColor: cat.color,
                    borderRadius: 100,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Amount + percentage */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", textAlign: "right", whiteSpace: "nowrap", margin: 0 }}>
              {formatINRFull(cat.amount)}
            </p>
            <p style={{ ...typography.caption, color: "rgba(0,0,0,0.7)", textAlign: "right", whiteSpace: "nowrap", margin: 0 }}>
              {cat.pct}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {month} spends
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(amount)}
        </p>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
          {subtext}
        </p>
        {categoryRows}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label={`${month} spends`} />

      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(amount)}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
        {subtext}
      </p>

      {/* Hairline divider */}
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />

      {categoryRows}
    </div>
  );
}

// ─── 3. Investment Product Card ────────────────────────────
// Matches Figma: Chatbot / node 16703:18825

function InvestmentProductCard({ data }: { data: Extract<ChatCardData, { type: "investment-product" }> }) {
  const { variant = "card", productType, amount, rate, tenure, accountLabel, activated, onContinue, onArrowTap } = data;

  const content = (
    <>
      {/* Amount */}
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(amount)}
      </p>

      {/* Rate + tenure */}
      <p style={{ ...typography.caption, color: "#00a63e", marginBottom: 16 }}>
        {rate} · {tenure}
      </p>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />

      {activated ? (
        <ConfirmedRow label={`${productType} set up`} onArrowTap={onArrowTap} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 4 }}>
              PAYING FROM
            </p>
            <p style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.7)" }}>
              {accountLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            style={{
              ...typography.buttonSmall,
              border: "none",
              background: "transparent",
              color: "#D30AD7",
              cursor: "pointer",
              padding: "4px 0",
              flexShrink: 0,
            }}
          >
            Set up
          </button>
        </div>
      )}
    </>
  );

  const shell = variant === "surface"
    ? { backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: CARD_RADIUS, padding: CARD_PAD }
    : { backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD };

  return (
    <div style={shell}>
      <CardHeader label={productType} onArrowTap={onArrowTap} arrowInvisible={!activated} />
      {content}
    </div>
  );
}

// ─── 4. Goal Progress Card ─────────────────────────────────

function GoalProgressCard({ data }: { data: Extract<ChatCardData, { type: "goal-progress" }> }) {
  const { variant = "card", name, pct, saved, target, daysLabel, status, onArrowTap } = data;
  const statusColor = status === "ahead" ? "#00a63e" : status === "behind" ? "#ce1d26" : "#ff9a17";
  const statusBg = status === "ahead" ? "#e0f4e8" : status === "behind" ? "#f9e4e5" : "#fff3e3";
  const clampedPct = Math.min(pct, 100);

  const content = (
    <>
      <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", marginBottom: 16 }}>
        {name}
      </p>

      {/* Progress bar */}
      <div style={{ height: 8, backgroundColor: "#fae2fa", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
        <div
          style={{
            width: `${clampedPct}%`,
            height: "100%",
            backgroundColor: "#d30ad7",
            borderRadius: 100,
          }}
        />
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>
          {formatINRFull(saved)} / {formatINRFull(target)}
        </span>
        <span style={{ ...typography.headerH2, color: "rgba(0,0,0,0.9)" }}>
          {pct}%
        </span>
      </div>

      {/* Status pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 8px",
          borderRadius: 100,
          backgroundColor: statusBg,
        }}
      >
        <span style={{ ...typography.metadata, textTransform: "uppercase", color: statusColor }}>
          {daysLabel}
        </span>
      </div>
    </>
  );

  const shell = variant === "surface"
    ? { backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: CARD_RADIUS, padding: CARD_PAD }
    : { backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD };

  return (
    <div style={shell}>
      <CardHeader label="Goal progress" onArrowTap={onArrowTap} />
      {content}
    </div>
  );
}

// ─── 5. Savings Plan Card ─────────────────────────────────

function SavingsPlanCard({ data }: { data: Extract<ChatCardData, { type: "savings-plan" }> }) {
  const { variant = "card", name, target, timeline, existingSavings, monthlyAmount, productType, rate, pct, timelineLabel } = data;
  const clampedPct = Math.min(pct, 100);

  if (variant === "surface") {
    return (
      <div style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
        <CardHeader label="Savings plan" />

        <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {name}
        </p>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
          {formatINRFull(target)} by {timeline}
        </p>

        {/* Progress bar */}
        <div style={{ height: 8, backgroundColor: "#fae2fa", borderRadius: 100, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ width: `${clampedPct}%`, height: "100%", backgroundColor: "#d30ad7", borderRadius: 100 }} />
        </div>

        {/* Detail rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {existingSavings > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>Existing savings applied</span>
              <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}>{formatINRFull(existingSavings)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>Monthly via {productType}</span>
            <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}>{formatINRFull(monthlyAmount)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>Rate</span>
            <span style={{ ...typography.buttonSmall, color: "#00a63e" }}>{rate}</span>
          </div>
        </div>

        {/* Hairline */}
        <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 12 }} />

        {/* Timeline label */}
        <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: 100, backgroundColor: "#e6edf9" }}>
          <span style={{ ...typography.metadata, textTransform: "uppercase", color: "#2b6acf" }}>
            {timelineLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label="Savings plan" />

      <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {name}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
        {formatINRFull(target)} by {timeline}
      </p>

      {/* Progress bar */}
      <div style={{ height: 8, backgroundColor: "#fae2fa", borderRadius: 100, overflow: "hidden", marginBottom: 16 }}>
        <div
          style={{
            width: `${clampedPct}%`,
            height: "100%",
            backgroundColor: "#d30ad7",
            borderRadius: 100,
          }}
        />
      </div>

      {/* Detail rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {existingSavings > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>Existing savings applied</span>
            <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}>{formatINRFull(existingSavings)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>Monthly via {productType}</span>
          <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}>{formatINRFull(monthlyAmount)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>Rate</span>
          <span style={{ ...typography.buttonSmall, color: "#00a63e" }}>{rate}</span>
        </div>
      </div>

      {/* Hairline */}
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 12 }} />

      {/* Timeline label */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 8px",
          borderRadius: 100,
          backgroundColor: "#e6edf9",
        }}
      >
        <span style={{ ...typography.metadata, textTransform: "uppercase", color: "#2b6acf" }}>
          {timelineLabel}
        </span>
      </div>
    </div>
  );
}

// ─── 6. Merchant Concentration Bar ────────────────────────

const PALETTE = ["#d30ad7", "#2b6acf", "#ff9a17", "#00a63e", "#ce1d26", "#87068a", "#5e8edb", "#ffb24f", "#3dbb6c", "#4e5866"];

function MerchantConcentrationCard({ data }: { data: Extract<ChatCardData, { type: "merchant-concentration" }> }) {
  const { variant = "card", month, totalSpend, totalMerchants, merchants } = data;
  const merchantCount = totalMerchants ?? merchants.length;

  // Enforce max 5 items: if >5, show top 4 + "Other" rollup
  const displayMerchants = (() => {
    if (merchants.length <= 5) return merchants;
    const top4 = merchants.slice(0, 4);
    const rest = merchants.slice(4);
    const otherAmount = rest.reduce((s, m) => s + m.amount, 0);
    const otherPct = rest.reduce((s, m) => s + m.pct, 0);
    return [...top4, { name: "Other", amount: otherAmount, pct: otherPct, color: "#8e949d" }];
  })();

  const rows = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {displayMerchants.map((m, i) => (
        <div key={m.name} style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 16, paddingBottom: 16 }}>
          {/* Initial avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: 100,
            backgroundColor: m.color || PALETTE[i % PALETTE.length],
            border: "1px solid #f0f4f7",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ ...typography.buttonSmall, color: "#fff" }}>
              {m.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Name + bar */}
          <div style={{ flex: "1 0 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {m.name}
            </p>
            <div style={{ paddingTop: 4, paddingBottom: 4 }}>
              <div style={{ height: 8, backgroundColor: trackColor(m.color || PALETTE[i % PALETTE.length]), borderRadius: 100, overflow: "hidden" }}>
                <div style={{
                  width: `${(m.amount / totalSpend) * 100}%`,
                  height: "100%",
                  backgroundColor: m.color || PALETTE[i % PALETTE.length],
                  borderRadius: 100,
                }} />
              </div>
            </div>
          </div>
          {/* Amount + percentage */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", textAlign: "right", whiteSpace: "nowrap", margin: 0 }}>
              {formatINRFull(m.amount)}
            </p>
            <p style={{ ...typography.caption, color: "rgba(0,0,0,0.7)", textAlign: "right", whiteSpace: "nowrap", margin: 0 }}>{m.pct}%</p>
          </div>
        </div>
      ))}
    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {month} spends
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(totalSpend)}
        </p>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
          across {merchantCount} merchants
        </p>
        {rows}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label={`${month} spends`} />
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(totalSpend)}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
        across {merchantCount} merchants
      </p>
      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />
      {rows}
    </div>
  );
}

// ─── 7. Category Month-over-Month Comparison ──────────────

function CategoryMomCard({ data }: { data: Extract<ChatCardData, { type: "category-mom" }> }) {
  const { variant = "card", thisMonth, lastMonth, categories: rawCategories } = data;

  // Enforce max 5 items: if >5, show top 4 + "Other" rollup
  const categories = (() => {
    if (rawCategories.length <= 5) return rawCategories;
    const top4 = rawCategories.slice(0, 4);
    const rest = rawCategories.slice(4);
    const otherThis = rest.reduce((s, c) => s + c.thisValue, 0);
    const otherLast = rest.reduce((s, c) => s + c.lastValue, 0);
    return [...top4, { name: "Other", thisValue: otherThis, lastValue: otherLast, color: "#8e949d" }];
  })();

  const [selectedCat, setSelectedCat] = useState<number | null>(null);

  const thisTotal = categories.reduce((s, c) => s + c.thisValue, 0);
  const lastTotal = categories.reduce((s, c) => s + c.lastValue, 0);

  // Derive display values based on selection
  const displayThisValue = selectedCat !== null ? categories[selectedCat].thisValue : thisTotal;
  const displayLastValue = selectedCat !== null ? categories[selectedCat].lastValue : lastTotal;
  const displayPctDiff = displayLastValue > 0 ? Math.round(((displayThisValue - displayLastValue) / displayLastValue) * 100) : 0;
  const displayDiffColor = displayPctDiff <= 0 ? "#00a63e" : displayPctDiff <= 15 ? "#ff9a17" : "#ce1d26";
  const displayDiffLabel = displayPctDiff > 0
    ? `${displayPctDiff}% more than ${lastMonth}`
    : displayPctDiff < 0
    ? `${Math.abs(displayPctDiff)}% less than ${lastMonth}`
    : `Same as ${lastMonth}`;
  const displayTitle = selectedCat !== null
    ? `${thisMonth} ${categories[selectedCat].name.toLowerCase()} spends`
    : `${thisMonth} spends`;

  // SVG grouped vertical bar chart
  const W = 320;
  const chartH = 170;
  const padL = 32;
  const padR = 0;
  const padTop = 12;
  const padBottom = 8;
  const drawH = chartH - padTop - padBottom;
  const drawW = W - padL - padR;

  const maxVal = Math.max(...categories.flatMap((c) => [c.thisValue, c.lastValue])) * 1.15;
  const n = categories.length;
  const groupW = drawW / n;
  const barW = Math.min(groupW * 0.28, 16);
  const gap = 3;

  const mfs = typography.metadata.fontSize;
  const mfw = typography.metadata.fontWeight;
  const mff = typography.metadata.fontFamily;
  const mls = typography.metadata.letterSpacing;

  // Round axis labels to nearest clean number
  const roundAxis = (val: number): string => {
    if (val === 0) return "₹0";
    if (val >= 10000) return `₹${Math.round(val / 1000)}k`;
    if (val >= 1000) return `₹${Math.round(val / 1000)}k`;
    return `₹${Math.round(val)}`;
  };

  const chart = (
    <div onClick={() => setSelectedCat(null)}>
      <svg width={W} height={chartH} viewBox={`0 0 ${W} ${chartH}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Y-axis labels only — no grid lines */}
        {[0, 0.5, 1].map((frac) => {
          const y = padTop + drawH - frac * drawH;
          return (
            <text key={frac} x={0} y={y + 4} textAnchor="start" fill="rgba(0,0,0,0.3)" fontSize={mfs} fontWeight={mfw} fontFamily={mff} letterSpacing={mls}>
              {roundAxis(maxVal * frac)}
            </text>
          );
        })}
        {/* Grouped bars */}
        {categories.map((cat, i) => {
          const cx = padL + groupW * i + groupW / 2;
          const lastH = Math.max((cat.lastValue / maxVal) * drawH, 2);
          const thisH = Math.max((cat.thisValue / maxVal) * drawH, 2);
          return (
            <g key={cat.name} style={{ cursor: "pointer", opacity: selectedCat === null || selectedCat === i ? 1 : 0.3, transition: "opacity 0.15s" }} onClick={(e) => { e.stopPropagation(); setSelectedCat(selectedCat === i ? null : i); }}>
              <rect
                x={cx - barW - gap / 2} y={padTop + drawH - lastH}
                width={barW} height={lastH}
                rx={4} fill="#fae2fa"
              />
              <rect
                x={cx + gap / 2} y={padTop + drawH - thisH}
                width={barW} height={thisH}
                rx={4} fill="#d30ad7"
              />
            </g>
          );
        })}
      </svg>
      {/* Category labels — HTML row below SVG, aligned to bar groups */}
      <div style={{ display: "flex", gap: 4, marginLeft: `${(padL / W) * 100}%`, marginRight: `${(padR / W) * 100}%`, marginTop: 8 }}>
        {categories.map((cat, i) => (
          <span
            key={cat.name}
            onClick={(e) => { e.stopPropagation(); setSelectedCat(selectedCat === i ? null : i); }}
            style={{
              ...typography.caption,
              color: selectedCat === i ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.4)",
              fontWeight: selectedCat === i ? 500 : undefined,
              flex: 1,
              textAlign: "center",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            {cat.name}
          </span>
        ))}
      </div>
      {/* Legend — below graph, caption/sentence case, mini bar swatches */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "#fae2fa" }} />
          <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>{lastMonth}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "#d30ad7" }} />
          <span style={{ ...typography.caption, color: "rgba(0,0,0,0.5)" }}>{thisMonth}</span>
        </div>
      </div>
    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }} onClick={() => setSelectedCat(null)}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {displayTitle}
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(displayThisValue)}
        </p>
        <p style={{ ...typography.caption, color: displayDiffColor, marginBottom: 16 }}>
          {displayDiffLabel}
        </p>
        {chart}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }} onClick={() => setSelectedCat(null)}>
      <CardHeader label={displayTitle} />
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(displayThisValue)}
      </p>
      <p style={{ ...typography.caption, color: displayDiffColor, marginBottom: 16 }}>
        {displayDiffLabel}
      </p>
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />
      {chart}
    </div>
  );
}

// ─── 7b. Spend Trend (bar chart version of spend overview) ─

function SpendTrendCard({ data }: { data: Extract<ChatCardData, { type: "spend-trend" }> }) {
  const { month, chartData, average, highlightIndex, variant = "card" } = data;
  const [activeIndex, setActiveIndex] = useState(highlightIndex);

  const maxVal = Math.max(...chartData.map((d) => d.value), average) * 1.15;
  const activeMonthLabel = chartData[activeIndex].label;
  const activeMonthValue = chartData[activeIndex].value;

  const pctDiff = average > 0 ? Math.round(((activeMonthValue - average) / average) * 100) : 0;
  const comparisonLabel = pctDiff > 0
    ? `${pctDiff}% higher than average`
    : pctDiff < 0
    ? `${Math.abs(pctDiff)}% lower than average`
    : "On par with average";
  const comparisonColor = pctDiff <= 0 ? "#00a63e" : pctDiff <= 15 ? "#ff9a17" : "#ce1d26";

  const displayMonth = activeIndex === highlightIndex ? month : activeMonthLabel;

  // Bar chart — matching MoM layout
  const W = 320;
  const svgH = 150;
  const padL = 32;
  const padR = 0;
  const padTop = 12;
  const padBottom = 8;
  const drawH = svgH - padTop - padBottom;
  const drawW = W - padL - padR;
  const n = chartData.length;
  const groupW = drawW / n;
  const barW = Math.min(groupW * 0.5, 28);
  const avgY = padTop + drawH - (average / maxVal) * drawH;

  const mfs = typography.metadata.fontSize;
  const mfw = typography.metadata.fontWeight;
  const mff = typography.metadata.fontFamily;
  const mls = typography.metadata.letterSpacing;

  const roundAxis = (val: number): string => {
    if (val === 0) return "₹0";
    if (val >= 10000) return `₹${Math.round(val / 1000)}k`;
    if (val >= 1000) return `₹${Math.round(val / 1000)}k`;
    return `₹${Math.round(val)}`;
  };

  const chart = (
    <div onClick={() => setActiveIndex(highlightIndex)}>
      <svg width={W} height={svgH} viewBox={`0 0 ${W} ${svgH}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
        {/* Y-axis labels */}
        {[0, 0.5, 1].map((frac) => {
          const y = padTop + drawH - frac * drawH;
          return (
            <text key={frac} x={0} y={y + 4} textAnchor="start" fill="rgba(0,0,0,0.3)" fontSize={mfs} fontWeight={mfw} fontFamily={mff} letterSpacing={mls}>
              {roundAxis(maxVal * frac)}
            </text>
          );
        })}

        {/* Average dashed line */}
        <line x1={padL} y1={avgY} x2={W - padR} y2={avgY} stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeDasharray="5 4" />

        {/* Bars */}
        {chartData.map((d, i) => {
          const cx = padL + groupW * i + groupW / 2;
          const barH = Math.max((d.value / maxVal) * drawH, 2);
          const isActive = i === activeIndex;
          return (
            <rect
              key={i}
              x={cx - barW / 2}
              y={padTop + drawH - barH}
              width={barW}
              height={barH}
              rx={4}
              fill={isActive ? "#d30ad7" : "#fae2fa"}
              style={{ cursor: "pointer", opacity: isActive ? 1 : 0.7, transition: "fill 0.15s, opacity 0.15s" }}
              onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
            />
          );
        })}
      </svg>

      {/* Month labels — HTML, flex:1, caption style */}
      <div style={{ display: "flex", gap: 4, marginLeft: `${(padL / W) * 100}%`, marginTop: 8 }}>
        {chartData.map((d, i) => (
          <span
            key={i}
            onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
            style={{
              ...typography.caption,
              color: i === activeIndex ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.4)",
              fontWeight: i === activeIndex ? 500 : undefined,
              flex: 1,
              textAlign: "center",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            {d.label}
          </span>
        ))}
      </div>

    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }} onClick={() => setActiveIndex(highlightIndex)}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {displayMonth} spends
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(activeMonthValue)}
        </p>
        <p style={{ ...typography.caption, color: comparisonColor, marginBottom: 16 }}>
          {comparisonLabel}
        </p>
        {chart}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }} onClick={() => setActiveIndex(highlightIndex)}>
      <CardHeader label={`${displayMonth} spends`} />
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(activeMonthValue)}
      </p>
      <p style={{ ...typography.caption, color: comparisonColor, marginBottom: 16 }}>
        {comparisonLabel}
      </p>
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />
      {chart}
    </div>
  );
}

// ─── 8. Spending Heatmap ──────────────────────────────────

function SpendingHeatmapCard({ data }: { data: Extract<ChatCardData, { type: "spending-heatmap" }> }) {
  const { variant = "card", month, startDay, dailySpend, maxSpend } = data;
  const totalSpend = dailySpend.reduce<number>((s, v) => s + (v ?? 0), 0);

  // Find day-of-week with highest total spend
  const dayNames = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  dailySpend.forEach((v, i) => { if (v != null) dayTotals[(startDay + i) % 7] += v; });
  const peakDay = dayNames[dayTotals.indexOf(Math.max(...dayTotals))];

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const cols = 7;

  const intensityColor = (val: number | null): string => {
    if (val === null) return "transparent";
    if (val === 0) return "#eaebed";
    const t = Math.min(val / maxSpend, 1);
    if (t < 0.25) return "#fae2fa";
    if (t < 0.5) return "#ea89ec";
    if (t < 0.75) return "#d30ad7";
    return "#87068a";
  };

  const intensityLevels = ["#eaebed", "#fae2fa", "#ea89ec", "#d30ad7", "#87068a"];

  // Build grid cells: leading empties for startDay offset, then day cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 0; i < dailySpend.length; i++) cells.push(i);

  const tertiary = "rgba(0,0,0,0.3)";

  const chart = (
    <div>
      {/* Day-of-week labels */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4, marginBottom: 16 }}>
        {dayLabels.map((label, i) => (
          <span key={i} style={{ ...typography.caption, color: tertiary, textAlign: "center" }}>{label}</span>
        ))}
      </div>
      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
        {cells.map((cellIdx, i) => {
          if (cellIdx === null) return <div key={i} />;
          const val = dailySpend[cellIdx];
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                backgroundColor: intensityColor(val),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {val !== null && (
                <span style={{
                  ...typography.bodySmall,
                  color: val / maxSpend > 0.5 ? "#fff" : "rgba(0,0,0,0.5)",
                }}>
                  {cellIdx + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 24 }}>
        <span style={{ ...typography.caption, color: tertiary, marginRight: 4 }}>{"\u20B9"}</span>
        {intensityLevels.map((color) => (
          <div key={color} style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: color }} />
        ))}
        <span style={{ ...typography.caption, color: tertiary, marginLeft: 4 }}>{"\u20B9\u20B9\u20B9\u20B9"}</span>
      </div>
    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {month} spending pattern
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(totalSpend)}
        </p>
        <p style={{ ...typography.caption, color: "#d30ad7", marginBottom: 16 }}>
          highest spends on {peakDay}
        </p>
        {chart}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
        {month} spending pattern
      </p>
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(totalSpend)}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
        highest spends on {peakDay}
      </p>
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />
      {chart}
    </div>
  );
}

// ─── 9. Payment Mode Donut ────────────────────────────────

function PaymentModeDonutCardV2({ data }: { data: Extract<ChatCardData, { type: "payment-mode-donut-v2" }> }) {
  const { variant = "card", month, totalSpend, modes: rawModes } = data;

  // Enforce max 5 items: if >5, show top 4 + "Other" rollup
  const modes = (() => {
    if (rawModes.length <= 5) return rawModes;
    const top4 = rawModes.slice(0, 4);
    const rest = rawModes.slice(4);
    const otherAmount = rest.reduce((s, m) => s + m.amount, 0);
    const otherPct = rest.reduce((s, m) => s + m.pct, 0);
    return [...top4, { name: "Other", amount: otherAmount, pct: otherPct, color: "#8e949d" }];
  })();

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 96;
  const strokeW = 10;
  const gapPx = 14; // breathing room between rounded ends
  const circumference = 2 * Math.PI * r;

  // Bundle modes < 10% into "Others"
  const bigModes = modes.filter((m) => m.pct >= 10);
  const smallModes = modes.filter((m) => m.pct < 10);
  const othersColor = "#8e949d"; // Slate/300
  const arcModes = smallModes.length > 0
    ? [...bigModes, { name: "Others", amount: smallModes.reduce((s, m) => s + m.amount, 0), pct: smallModes.reduce((s, m) => s + m.pct, 0), color: othersColor }]
    : bigModes;

  // Build arcs with centered gaps
  let accumulated = 0;
  const arcs = arcModes.map((m) => {
    const dashLen = (m.pct / 100) * circumference - gapPx;
    const dashGap = circumference - dashLen;
    const offset = -((accumulated / 100) * circumference) + circumference * 0.25 + gapPx / 2;
    accumulated += m.pct;
    return { ...m, dashLen, dashGap, offset };
  });

  const [selected, setSelected] = useState(0);

  const donutAndLegend = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Donut */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Arcs — selected: /500 color, deselected: /50 subtle shade */}
        {arcs.map((arc, i) => (
          <circle
            key={arc.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={selected === i ? arc.color : trackColor(arc.color)}
            strokeWidth={strokeW}
            strokeDasharray={`${arc.dashLen} ${arc.dashGap}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="round"
            style={{ cursor: "pointer", transition: "stroke 0.2s" }}
            onClick={() => setSelected(i)}
          />
        ))}
        {/* Center amount — H1, vertically centered to ring */}
        <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central" fill="rgba(0,0,0,0.9)" fontSize={typography.headerH1.fontSize} fontWeight={typography.headerH1.fontWeight} letterSpacing={typography.headerH1.letterSpacing} fontFamily={typography.headerH1.fontFamily} style={{ transition: "opacity 0.2s" }}>
          {formatINR(arcModes[selected].amount)}
        </text>
        {/* Center name — Caption, below the amount */}
        <text x={cx} y={cy + 24} textAnchor="middle" fill="rgba(0,0,0,0.5)" fontSize={typography.caption.fontSize} fontWeight={typography.caption.fontWeight} letterSpacing={typography.caption.letterSpacing} fontFamily={typography.caption.fontFamily} style={{ transition: "opacity 0.2s" }}>
          {arcModes[selected].name}
        </text>
      </svg>
      {/* Legend rows */}
      <div style={{ width: "100%" }}>
        {arcModes.map((m, i) => (
          <div
            key={m.name}
            onClick={() => setSelected(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 100, backgroundColor: selected === i ? m.color : trackColor(m.color), flexShrink: 0, transition: "background-color 0.2s" }} />
            <span style={{ ...(selected === i ? typography.buttonNormal : typography.bodyNormal), color: selected === i ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)", flex: 1, transition: "color 0.2s" }}>{m.name}</span>
            <span style={{ ...(selected === i ? typography.buttonSmall : typography.bodySmall), color: selected === i ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)", transition: "color 0.2s" }}>{m.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {month} spends
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(totalSpend)}
        </p>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          across {modes.length} payment modes
        </p>
        {donutAndLegend}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
        {month} spends
      </p>
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(totalSpend)}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
        across {modes.length} payment modes
      </p>
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 8 }} />
      {donutAndLegend}
    </div>
  );
}

// ─── 10. Transaction Table ────────────────────────────────

function TransactionTableCard({ data }: { data: Extract<ChatCardData, { type: "transaction-table" }> }) {
  const { variant = "card", title, transactions } = data;
  const MAX_ROWS = 5;
  const displayTx = transactions.slice(0, MAX_ROWS);
  const overflow = transactions.length - MAX_ROWS;

  // Compute total and date range
  const totalAmount = transactions.reduce((s, tx) => s + tx.amount, 0);
  const dates = transactions.map((tx) => tx.date);
  const dateRange = dates.length > 1 ? `${dates[dates.length - 1]} – ${dates[0]}` : dates[0] ?? "";

  // Assign consistent color per unique merchant
  const merchantColorMap = new Map<string, string>();
  let colorIdx = 0;
  for (const tx of transactions) {
    if (!merchantColorMap.has(tx.merchant)) {
      merchantColorMap.set(tx.merchant, PALETTE[colorIdx % PALETTE.length]);
      colorIdx++;
    }
  }

  // DLS Transaction list item rows
  const txList = (
    <div>
      {displayTx.map((tx, i) => {
        const avatarColor = merchantColorMap.get(tx.merchant) || PALETTE[0];
        return (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
            borderBottom: "none",
          }}
        >
          {/* Avatar — colored initial (matches merchant concentration) */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: avatarColor,
              border: "1px solid #f0f4f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ ...typography.buttonSmall, color: "#fff" }}>
              {tx.merchant.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                ...typography.bodyNormal,
                color: "rgba(0,0,0,0.9)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tx.merchant}
            </p>
            <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", margin: 0, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              {tx.date}
              <span style={{ width: 2, height: 2, borderRadius: 100, backgroundColor: "rgba(0,0,0,0.3)", flexShrink: 0 }} />
              {tx.category}
            </p>
          </div>
          {/* Amount */}
          <span style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", flexShrink: 0, whiteSpace: "nowrap" }}>
            {formatINRFull(tx.amount)}
          </span>
        </div>
        );
      })}
      {overflow > 0 && (
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", textAlign: "center", padding: "12px 0", margin: 0 }}>
          +{overflow} more transaction{overflow > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {title}
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(totalAmount)}
        </p>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
          {dateRange}
        </p>
        {txList}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label={title} />
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(totalAmount)}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>
        {dateRange}
      </p>
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16 }} />
      {txList}
    </div>
  );
}

// ─── DLS Tag Intent Map (used by V2 obligations chips) ────

const TAG_INTENT: Record<string, { bg: string; text: string }> = {
  "Rent/EMI": { bg: "#F6F9FC", text: "#252A31" },      // Neutral
  "Loan EMI": { bg: "#FFF3E3", text: "#C27511" },       // Warning
  "Subscription": { bg: "#E6EDF9", text: "#2B6ACF" },   // Info
  "Utility": { bg: "#E6EDF9", text: "#2B6ACF" },        // Info
  "Investment": { bg: "#E0F4E8", text: "#00A63E" },      // Positive
  "Credit Card": { bg: "#F9E4E5", text: "#CE1D26" },    // Negative
  "Food": { bg: "#FFF3E3", text: "#C27511" },            // Warning
  "Grocery": { bg: "#FFF3E3", text: "#C27511" },         // Warning
  "P2P": { bg: "#FAE2FA", text: "#D30AD7" },            // Brand
};

// ─── Big Expenses Card ────────────────────────────────────

function BigExpensesCard({ data }: { data: Extract<ChatCardData, { type: "big-expenses" }> }) {
  const { variant = "card", transactions, periodLabel, total, onRowTap } = data;
  const MAX_ROWS = 5;
  const displayTx = transactions.slice(0, MAX_ROWS);
  const overflow = transactions.length - MAX_ROWS;

  const txList = (
    <div>
      {displayTx.map((tx, i) => (
        <div
          key={tx.id}
          onClick={() => onRowTap?.(tx.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 0",
            borderBottom: "none",
            cursor: onRowTap ? "pointer" : "default",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: "#F0F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.5)" }}>
              {tx.payee.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tx.payee}
            </p>
            <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", margin: 0, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              {tx.date}
              <span style={{ width: 2, height: 2, borderRadius: 100, backgroundColor: "rgba(0,0,0,0.3)", flexShrink: 0 }} />
              {tx.type}
            </p>
          </div>
          {/* Amount */}
          <span style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", flexShrink: 0, whiteSpace: "nowrap" }}>
            {formatINRFull(tx.amount)}
          </span>
          {/* Chevron */}
          {onRowTap && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 4l4 4-4 4" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", textAlign: "center", padding: "12px 0", margin: 0 }}>
          +{overflow} more payment{overflow > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );

  const cardContent = (
    <>
      {/* Total amount header */}
      <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", margin: 0, marginBottom: 4 }}>
        {formatINRFull(total)}
      </p>
      <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", margin: 0, marginBottom: 16 }}>
        {periodLabel}
      </p>
      <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 0 }} />
      {txList}
    </>
  );

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          Recent big payments
        </p>
        {cardContent}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label="Recent big payments" />
      {cardContent}
    </div>
  );
}

// ─── Obligations List V2 (inline expand/edit) ────────────

const ALL_TAG_OPTIONS = Object.keys(TAG_INTENT);

function getSnapStep(amount: number): number {
  if (amount < 500) return 50;
  if (amount < 5000) return 100;
  if (amount < 20000) return 500;
  return 1000;
}

function ObligationsListCardV2({ data }: { data: Extract<ChatCardData, { type: "obligations-list-v2" }> }) {
  const { items, onSubmit, submitted, onArrowTap } = data;
  const display = items.slice(0, 5);

  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editedAmounts, setEditedAmounts] = useState<Record<string, number>>({});
  const [editedTypes, setEditedTypes] = useState<Record<string, string>>({});

  const getAmount = (item: typeof display[0]) => editedAmounts[item.id] ?? item.amount;
  const getType = (item: typeof display[0]) => editedTypes[item.id] ?? item.type;

  const confirmedTotal = display
    .filter((i) => selected.has(i.id))
    .reduce((s, i) => s + getAmount(i), 0);

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setExpandedId((cur) => (cur === id ? null : cur));
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubmit = () => {
    const result = display
      .filter((i) => selected.has(i.id))
      .map((i) => ({ id: i.id, amount: getAmount(i), type: getType(i) }));
    onSubmit?.(result);
  };

  // Confirmed state — show selected obligations without checkboxes
  if (submitted) {
    const confirmedItems = display.filter((i) => selected.has(i.id));
    return (
      <div style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
        <CardHeader label="Confirmed obligations" onArrowTap={onArrowTap} />
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", margin: 0 }}>
          {formatINRFull(confirmedTotal)}<span style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)" }}>/mo</span>
        </p>
        {confirmedItems.map((item, i) => (
          <div
            key={item.id}
            style={{
              padding: i === confirmedItems.length - 1 ? "16px 0 0 0" : "16px 0",
              borderBottom: i < confirmedItems.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                {item.payee}
              </p>
              <span style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", flexShrink: 0, whiteSpace: "nowrap", marginLeft: 8 }}>
                {formatINRFull(getAmount(item))}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <p style={{ ...typography.caption, color: "rgba(0,0,0,0.7)", margin: 0 }}>
                {getType(item)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: CARD_RADIUS,
        padding: CARD_PAD,
      }}
    >
      {/* Live confirmed total header */}
      <div style={{ marginBottom: 0 }}>
        <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", margin: 0, marginBottom: 4 }}>
          Confirmed obligations
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", margin: 0 }}>
          {formatINRFull(confirmedTotal)}<span style={{ ...typography.bodySmall, color: "rgba(0,0,0,0.5)" }}>/mo</span>
        </p>
      </div>

      {display.map((item, i) => {
        const isExpanded = expandedId === item.id;
        const isChecked = selected.has(item.id);
        const currentAmount = getAmount(item);
        const currentType = getType(item);

        return (
          <div key={item.id}>
            {/* Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: i === display.length - 1 ? "16px 0 0 0" : "16px 0",
                borderBottom: (!isExpanded && i < display.length - 1) ? "1px solid rgba(0,0,0,0.05)" : "none",
              }}
            >
              {/* Narrow checkbox: 32w × 48h — icon is 24px, 4px either side */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleToggle(item.id); }}
                style={{ width: 32, height: 48, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "transparent", padding: 0, cursor: "pointer", flexShrink: 0 }}
                aria-label={isChecked ? "Deselect" : "Select"}
              >
                {isChecked ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#D30AD7" />
                    <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                  </svg>
                )}
              </button>
              {/* Content block: 3 rows */}
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => handleExpand(item.id)}>
                {/* Row 1: Title + Amount */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                    {item.payee}
                  </p>
                  <span style={{ ...typography.bodyNormal, color: "rgba(0,0,0,0.9)", flexShrink: 0, whiteSpace: "nowrap", marginLeft: 8 }}>
                    {formatINRFull(currentAmount)}
                  </span>
                </div>
                {/* Row 2: Category + Edit */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <p style={{ ...typography.caption, color: "rgba(0,0,0,0.7)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                    {currentType}
                  </p>
                  {!isExpanded && (
                    <span
                      style={{ ...typography.caption, color: "#D30AD7", flexShrink: 0, whiteSpace: "nowrap", marginLeft: 8, cursor: "pointer" }}
                      onClick={(e) => { e.stopPropagation(); handleExpand(item.id); }}
                    >
                      Edit
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded inline edit — full width, slider + chips */}
            {isExpanded && (
              <div
                style={{
                  borderBottom: i < display.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  paddingBottom: 16,
                }}
              >
                {/* Amount slider */}
                <div style={{ marginBottom: 12 }}>
                  <input
                    type="range"
                    min={0}
                    max={Math.ceil((item.amount * 1.5) / getSnapStep(item.amount)) * getSnapStep(item.amount)}
                    step={getSnapStep(item.amount)}
                    value={currentAmount}
                    onChange={(e) => setEditedAmounts((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))}
                    style={{ width: "100%", accentColor: "#D30AD7", cursor: "pointer" }}
                  />
                </div>

                {/* Type chips — scroll to card edge, no right clip */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    marginRight: -12,
                    paddingRight: 12,
                  }}
                >
                  {ALL_TAG_OPTIONS.slice(0, 5).map((tag) => {
                    const isActive = currentType === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setEditedTypes((prev) => ({ ...prev, [item.id]: tag }))}
                        style={{
                          ...typography.bodySmall,
                          height: 32,
                          padding: "0 16px",
                          borderRadius: 64,
                          border: isActive ? "1px solid #D30AD7" : "1px solid rgba(0,0,0,0.2)",
                          backgroundColor: isActive ? "#FAE2FA" : "#fff",
                          color: "rgba(0,0,0,0.9)",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          transition: "all 150ms ease",
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Submit — appears once ≥1 item selected */}
      {!submitted && onSubmit && selected.size > 0 && (
        <div style={{ marginTop: 24 }}>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...typography.buttonSmall,
              height: 36,
              borderRadius: 100,
              backgroundColor: "#D30AD7",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              padding: "0 16px",
            }}
          >
            Looks right
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Public renderer ───────────────────────────────────────

export default function ChatCard({ card }: { card: ChatCardData }) {
  switch (card.type) {
    case "spend-overview":
      return <SpendOverviewCard data={card} />;
    case "category-breakdown":
      return <CategoryBreakdownCard data={card} />;
    case "investment-product":
      return <InvestmentProductCard data={card} />;
    case "goal-progress":
      return <GoalProgressCard data={card} />;
    case "savings-plan":
      return <SavingsPlanCard data={card} />;
    case "merchant-concentration":
      return <MerchantConcentrationCard data={card} />;
    case "category-mom":
      return <CategoryMomCard data={card} />;
    case "spend-trend":
      return <SpendTrendCard data={card} />;
    case "spending-heatmap":
      return <SpendingHeatmapCard data={card} />;
    case "payment-mode-donut-v2":
      return <PaymentModeDonutCardV2 data={card} />;
    case "transaction-table":
      return <TransactionTableCard data={card} />;
    case "obligations-list-v2":
      return <ObligationsListCardV2 data={card} />;
    case "big-expenses":
      return <BigExpensesCard data={card} />;
    default:
      return null;
  }
}
