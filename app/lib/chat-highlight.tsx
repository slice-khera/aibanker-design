"use client";

import { typography } from "./typography";

// Auto-highlights:
//  - `**bold**` segments → rendered with `typography.buttonSmall` (semibold weight)
//  - ₹ amounts (e.g. ₹12k, ₹1,08,000, ₹2L) → semibold
//  - percentages (e.g. 8%, 72%) → semibold
//  - time references → semibold:
//      · durations (e.g. 6 months, 3 weeks, 2 years, 8 mo)
//      · month + year (e.g. Dec '26, October 2026) — the trailing year is
//        required so a bare "May"/"you may" in prose is NOT highlighted.
//
// Matching is case-insensitive, so ₹2l, ₹12K and "6 Months" still highlight.
// Bare numbers without ₹/%/a time unit (e.g. "1 of 4", "3 more checks") stay
// regular weight.
//
// Keep in sync with all chat sims: this is the single source of truth
// for "what counts as a highlight" in Ryan/Byron-voice text.
const HIGHLIGHT_RE = /\*\*(.+?)\*\*|₹[\d,.]+\s*[Lk]?|[\d,.]+%|\d+\s*(?:months|month|weeks|week|days|day|years|year|yrs|yr|mo)\b|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*'?\d{2,4}\b/gi;

export function highlightValues(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = HIGHLIGHT_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const boldText = match[1] ?? match[0];
    parts.push(
      <span key={match.index} style={typography.buttonSmall}>{boldText}</span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}
