"use client";

import { typography } from "./typography";

// Auto-highlights:
//  - `**bold**` segments → rendered with `typography.buttonSmall` (semibold weight)
//  - ₹ amounts (e.g. ₹12k, ₹1,08,000, ₹2L) → semibold
//  - percentages (e.g. 8%, 72%) → semibold
//
// Keep in sync with all chat sims: this is the single source of truth
// for "what counts as a highlight" in Ryan/Byron-voice text.
const HIGHLIGHT_RE = /\*\*(.+?)\*\*|₹[\d,.]+\s*[Lk]?|[\d,.]+%/g;

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
