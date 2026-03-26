"use client";

import { typography } from "../lib/typography";

// ── My Money background layer ─────────────────────────────────────────────
// Shown behind the Chat sheet when the user drags it down.

export default function MyMoney({ onOpenQuiz }: { onOpenQuiz?: () => void }) {
  return (
    <div
      className="flex h-full flex-col bg-[#f6f9fc] overflow-hidden"
      style={{ fontFamily: "var(--font-rubik), sans-serif" }}
    >
      {/* Safe area */}
      <div style={{ height: 24 }} />

      {/* Header */}
      <div className="shrink-0 px-6 pb-4 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>
              MY MONEY
            </p>
            <h1 style={{ ...typography.headerH1, color: "rgba(0,0,0,0.9)", marginTop: 4 }}>
              ₹2,40,000
            </h1>
            <p style={{ ...typography.caption, color: "rgba(0,0,0,0.5)", marginTop: 2 }}>Total balance · Mar 2026</p>
          </div>

          <button
            type="button"
            onClick={onOpenQuiz}
            className="shrink-0 flex items-center justify-center rounded-full border border-black/5 bg-white/80 active:scale-95"
            style={{ width: 48, height: 48, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
            aria-label="Open money quiz"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 2.25l1.39 4.22h4.44l-3.59 2.61 1.37 4.22L9 10.69 5.39 13.3l1.37-4.22-3.59-2.61h4.44L9 2.25Z" fill="#171a1f" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary cards row */}
      <div className="shrink-0 flex gap-3 px-6 pb-4">
        <SummaryCard label="Spent" value="₹38,400" sub="this month" color="#fae2fa" />
        <SummaryCard label="Saved" value="₹12,000" sub="this month" color="#e0f4e8" />
        <SummaryCard label="Goal" value="68%" sub="on track" color="#e6edf9" />
      </div>

      {/* Recent transactions */}
      <div className="flex-1 overflow-y-auto px-6">
        <p style={{ ...typography.metadata, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginBottom: 12 }}>
          RECENT
        </p>
        <div className="flex flex-col gap-2">
          {TRANSACTIONS.map((t) => (
            <TransactionRow key={t.id} {...t} />
          ))}
        </div>
      </div>

      {/* Pull-up hint */}
      <div className="shrink-0 flex flex-col items-center" style={{ paddingBottom: 16, paddingTop: 8 }}>
        <p style={{ ...typography.metadata, color: "rgba(0,0,0,0.3)" }}>Pull up to chat</p>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ marginTop: 4 }}>
          <path d="M2 8l6-6 6 6" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div
      className="flex-1 rounded-2xl flex flex-col"
      style={{ backgroundColor: color, padding: "12px 16px" }}
    >
      <p style={{ ...typography.metadata, color: "rgba(0,0,0,0.5)" }}>{label}</p>
      <p style={{ ...typography.headerH4, color: "rgba(0,0,0,0.9)", marginTop: 4 }}>{value}</p>
      <p style={{ ...typography.metadata, color: "rgba(0,0,0,0.3)", marginTop: 2 }}>{sub}</p>
    </div>
  );
}

function TransactionRow({ merchant, category, amount, date }: { id: string; merchant: string; category: string; amount: string; date: string }) {
  return (
    <div className="flex items-center bg-white rounded-2xl" style={{ padding: "12px 16px", gap: 12 }}>
      <div
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, backgroundColor: "#f6f9fc" }}
      >
        <span style={{ ...typography.bodySmall }}>{categoryEmoji(category)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.9)" }}>{merchant}</p>
        <p style={{ ...typography.caption, color: "rgba(0,0,0,0.3)" }}>{category} · {date}</p>
      </div>
      <p style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.7)", flexShrink: 0 }}>{amount}</p>
    </div>
  );
}

function categoryEmoji(category: string) {
  const map: Record<string, string> = {
    Food: "🍜", Transport: "🚗", Shopping: "🛍️", Utilities: "💡", Health: "💊", Entertainment: "🎬",
  };
  return map[category] ?? "💳";
}

const TRANSACTIONS = [
  { id: "1", merchant: "Swiggy", category: "Food", amount: "−₹480", date: "Today" },
  { id: "2", merchant: "Ola", category: "Transport", amount: "−₹220", date: "Today" },
  { id: "3", merchant: "Amazon", category: "Shopping", amount: "−₹1,999", date: "Yesterday" },
  { id: "4", merchant: "BESCOM", category: "Utilities", amount: "−₹820", date: "12 Mar" },
  { id: "5", merchant: "PharmEasy", category: "Health", amount: "−₹345", date: "11 Mar" },
  { id: "6", merchant: "BookMyShow", category: "Entertainment", amount: "−₹600", date: "10 Mar" },
];
