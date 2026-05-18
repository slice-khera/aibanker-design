"use client";

import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  BG_PRIMARY,
  GREEN_50, BLUE_50, ORANGE_50, RED_50,
  VALENTINO_500,
} from "../lib/colors";
import { RADIUS_CIRCLE } from "../lib/radii";
import { CARD_RADIUS, CARD_BORDER } from "./ChatCards";
import { DlsTag } from "./ChatCards";
import type { Verdict, VerdictResult } from "../lib/types";

// Verdict → DlsTag intent + tinted background
const VERDICT_MAP: Record<Verdict, {
  intent: "positive" | "info" | "warning" | "negative";
  emphasis: "subtle" | "bold";
  bg: string;
}> = {
  comfortable: { intent: "positive", emphasis: "subtle", bg: GREEN_50 },
  feasible:    { intent: "info",     emphasis: "subtle", bg: BLUE_50 },
  tight:       { intent: "warning",  emphasis: "subtle", bg: ORANGE_50 },
  infeasible:  { intent: "negative", emphasis: "subtle", bg: RED_50 },
  impossible:  { intent: "negative", emphasis: "bold",   bg: RED_50 },
};

export default function VerdictBanner({
  result,
  actions,
}: {
  result: VerdictResult;
  actions?: { label: string; id: string; onTap: () => void }[];
}) {
  const map = VERDICT_MAP[result.verdict];

  return (
    <div
      style={{
        backgroundColor: map.bg,
        border: CARD_BORDER,
        borderRadius: CARD_RADIUS,
        padding: "16px",
      }}
    >
      {/* DlsTag verdict label */}
      <div style={{ marginBottom: 8 }}>
        <DlsTag intent={map.intent} emphasis={map.emphasis}>
          {result.verdict}
        </DlsTag>
      </div>

      {/* Fixed closing line */}
      <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY, margin: 0 }}>
        {result.closingLine}
      </p>

      {/* DLS buttons — Primary (36px, VALENTINO_500) + Secondary (36px, border) */}
      {actions && actions.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {actions.map((action, i) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onTap}
              style={{
                ...typography.buttonSmall,
                height: 36,
                padding: "0 16px",
                borderRadius: RADIUS_CIRCLE,
                border: i === 0 ? "none" : `1px solid ${VALENTINO_500}`,
                backgroundColor: i === 0 ? VALENTINO_500 : "transparent",
                color: i === 0 ? BG_PRIMARY : VALENTINO_500,
                cursor: "pointer",
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
