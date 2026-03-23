"use client";

import type { ReactNode } from "react";
import { typography } from "../lib/typography";

// ─── Shared types ──────────────────────────────────────────

export type CardVariant = "card" | "surface";

export type ChatCardData =
  | { type: "spend-overview"; variant?: CardVariant; month: string; amount: number; comparisonText: string; chartData: { label: string; value: number }[]; average: number; highlightIndex: number }
  | { type: "category-breakdown"; variant?: CardVariant; month: string; amount: number; subtext: string; categories: { name: string; amount: number; pct: number; color: string; icon: ReactNode }[] }
  | { type: "investment-product"; variant?: CardVariant; productType: string; amount: number; rate: string; tenure: string; amountOptions: { label: string; value: number }[]; accountLabel: string; activated?: boolean; onContinue?: () => void; onInvest?: (amount: number) => void; onAmountSelect?: (amount: number) => void; onArrowTap?: () => void }
  | { type: "goal-progress"; variant?: CardVariant; name: string; pct: number; saved: number; target: number; daysLabel: string; status: "ahead" | "behind" | "on-track"; onArrowTap?: () => void }
  | { type: "savings-plan"; variant?: CardVariant; name: string; target: number; timeline: string; existingSavings: number; monthlyAmount: number; productType: string; productLabel: string; rate: string; pct: number; timelineLabel: string };

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

// ─── Shared card shell ─────────────────────────────────────

const CARD_BG = "#f6f9fc";
const CARD_RADIUS = 16;
const CARD_PAD = "16px";

// Actionable cards (Investment Product, Goal Progress) use white + border
const ACTIONABLE_CARD_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: CARD_RADIUS,
  padding: CARD_PAD,
} as const;

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
      {onArrowTap ? (
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
      ) : arrowIcon}
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
  const { month, amount, comparisonText, chartData, average, highlightIndex, variant = "card" } = data;

  const W = 280;
  const H = 110;
  const padX = 18;
  const padTop = 16;
  const padBottom = 26;
  const chartW = W - padX * 2;
  const chartH = H - padTop - padBottom;

  const maxVal = Math.max(...chartData.map((d) => d.value), average) * 1.2;
  const points = chartData.map((d, i) => ({
    x: padX + (chartW / Math.max(chartData.length - 1, 1)) * i,
    y: padTop + chartH - (d.value / maxVal) * chartH,
  }));

  const avgY = padTop + chartH - (average / maxVal) * chartH;
  const linePath = smoothPath(points);

  // Area path: line path + close down to bottom
  const areaPath = linePath
    + ` L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`;

  const gradId = "spend-grad";

  const chart = (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b6acf" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2b6acf" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Average dashed line */}
        <line x1={padX} y1={avgY} x2={W - padX} y2={avgY} stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeDasharray="5 4" />

        {/* AVG tag — DLS Neutral/Bold: bg #252A31, white text, Metadata font, pill */}
        <rect x={padX} y={avgY - 10} width={58} height={20} rx={100} fill="#252A31" />
        <text x={padX + 29} y={avgY + 3} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="400" letterSpacing="0.4" fontFamily="var(--font-rubik), sans-serif">
          AVG. {formatINR(average)}
        </text>

        {/* Smooth line */}
        <path d={linePath} fill="none" stroke="#2b6acf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Highlight dot with glow */}
        {points[highlightIndex] && (
          <>
            <circle cx={points[highlightIndex].x} cy={points[highlightIndex].y} r={9} fill="#2b6acf" opacity="0.15" />
            <circle cx={points[highlightIndex].x} cy={points[highlightIndex].y} r={5} fill="#fff" stroke="#2b6acf" strokeWidth="2.5" />
          </>
        )}

        {/* Month labels */}
        {chartData.map((d, i) => (
          <text
            key={i}
            x={points[i].x}
            y={H - 5}
            textAnchor="middle"
            fill={i === highlightIndex ? "#2b6acf" : "rgba(0,0,0,0.3)"}
            fontSize="12"
            fontWeight={i === highlightIndex ? 500 : 400}
            letterSpacing="2%"
            fontFamily="var(--font-rubik), sans-serif"
          >
            {d.label}
          </text>
        ))}
      </svg>
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
        <p style={{ ...typography.caption, color: "#ff9a17", marginBottom: 12 }}>
          {comparisonText}
        </p>
        {chart}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: CARD_BG, borderRadius: CARD_RADIUS, padding: CARD_PAD }}>
      <CardHeader label={`${month} spends`} />
      <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
        {formatINRFull(amount)}
      </p>
      <p style={{ ...typography.caption, color: "#ff9a17", marginBottom: 12 }}>
        {comparisonText}
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
  const { variant, month, amount, subtext, categories } = data;

  const categoryRows = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {categories.slice(0, 3).map((cat) => (
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

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          {productType}
        </p>
        <p style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginBottom: 4 }}>
          {formatINRFull(amount)}
        </p>
        <p style={{ ...typography.caption, color: "#00a63e", marginBottom: 16 }}>
          {rate} · {tenure}
        </p>
        {activated ? (
          <ConfirmedRow label={`${productType} set up`} />
        ) : (
          <div>
            <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 4 }}>
              PAYING FROM
            </p>
            <p style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.7)" }}>
              {accountLabel}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ ...ACTIONABLE_CARD_STYLE }}>
      <CardHeader label={productType} onArrowTap={onArrowTap} arrowInvisible={!activated} />

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
            Continue ›
          </button>
        </div>
      )}
    </div>
  );
}

// ─── 4. Goal Progress Card ─────────────────────────────────

function GoalProgressCard({ data }: { data: Extract<ChatCardData, { type: "goal-progress" }> }) {
  const { variant = "card", name, pct, saved, target, daysLabel, status, onArrowTap } = data;
  const statusColor = status === "ahead" ? "#00a63e" : status === "behind" ? "#ce1d26" : "#ff9a17";
  const statusBg = status === "ahead" ? "#e0f4e8" : status === "behind" ? "#f9e4e5" : "#fff3e3";
  const clampedPct = Math.min(pct, 100);

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          Goal progress
        </p>
        <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", marginBottom: 16 }}>
          {name}
        </p>
        {/* Progress bar */}
        <div style={{ height: 8, backgroundColor: "#fae2fa", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: `${clampedPct}%`, height: "100%", backgroundColor: "#d30ad7", borderRadius: 100 }} />
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
        <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: 100, backgroundColor: statusBg }}>
          <span style={{ ...typography.metadata, textTransform: "uppercase", color: statusColor }}>
            {daysLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...ACTIONABLE_CARD_STYLE }}>
      <CardHeader label="Goal progress" onArrowTap={onArrowTap} />

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
    </div>
  );
}

// ─── 5. Savings Plan Card ─────────────────────────────────

function SavingsPlanCard({ data }: { data: Extract<ChatCardData, { type: "savings-plan" }> }) {
  const { variant = "card", name, target, timeline, existingSavings, monthlyAmount, productType, rate, pct, timelineLabel } = data;
  const clampedPct = Math.min(pct, 100);

  if (variant === "surface") {
    return (
      <div style={{ padding: "4px 0 8px" }}>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>
          Savings plan
        </p>
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
    default:
      return null;
  }
}
