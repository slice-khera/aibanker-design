"use client";

import { typography } from "../lib/typography";
import { ALPHA_WHITE_05, ALPHA_WHITE_90, VALENTINO_500 } from "../lib/colors";
import { RADIUS_XL } from "../lib/radii";

export type AIBankerChipState = "firstTime" | "alert" | "default";

const DEFAULT_LABEL: Record<AIBankerChipState, string> = {
  firstTime: "Meet Ryan",
  alert: "Ryan is ready",
  default: "Chat with Ryan",
};

const CHIP_BG = VALENTINO_500;
const CHIP_RADIUS = RADIUS_XL;
const ICON = "/icons/placeholder.svg";

export default function AIBankerChip({
  state = "firstTime",
  label,
  onTap,
}: {
  state?: AIBankerChipState;
  label?: string;
  onTap?: () => void;
}) {
  const shownLabel = label ?? DEFAULT_LABEL[state];
  const pulsing = state === "alert";

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      {pulsing && (
        <>
          <span aria-hidden className="ai-banker-chip-halo" />
          <span aria-hidden className="ai-banker-chip-halo ai-banker-chip-halo--delayed" />
        </>
      )}
      <button
        type="button"
        onClick={onTap}
        className="flex items-center shrink-0 transition-transform active:scale-[0.97]"
        style={{
          position: "relative",
          gap: 4,
          backgroundColor: CHIP_BG,
          border: `1.5px solid ${ALPHA_WHITE_05}`,
          borderRadius: CHIP_RADIUS,
          padding: "10px 16px",
          cursor: onTap ? "pointer" : "default",
        }}
      >
        <img src={ICON} alt="" style={{ width: 16, height: 16 }} />
        <span
          style={{
            ...typography.caption,
            color: ALPHA_WHITE_90,
            whiteSpace: "nowrap",
          }}
        >
          {shownLabel}
        </span>
      </button>
      <style jsx>{`
        .ai-banker-chip-halo {
          position: absolute;
          inset: 0;
          border-radius: ${CHIP_RADIUS}px;
          pointer-events: none;
          animation: ai-banker-chip-pulse 2.2s ease-out infinite;
        }
        .ai-banker-chip-halo--delayed {
          animation-delay: 1.1s;
        }
        @keyframes ai-banker-chip-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.15);
          }
          100% {
            box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </span>
  );
}
