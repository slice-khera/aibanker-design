"use client";

import type { ReactNode } from "react";
import { typography } from "../lib/typography";
import {
  SLATE_800,
  RED_400,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { ELEVATION_CARD } from "../lib/elevation";
import { SPACE_XS, SPACE_M } from "../lib/spacing";
import { RADIUS_SM } from "../lib/radii";

// DLS 2.0 Snackbar. Figma nodes 670:240, 1910:22720.
// 328w, radius 12, pr 8. Icon 20px (pl 16). Text 14/20 white. Action pill (8×16).

export type SnackbarVariant = "default" | "negative";

type SnackbarProps = {
  variant?: SnackbarVariant;
  icon?: ReactNode;
  text: string;
  action?: { label: string; onClick: () => void };
};

const NEGATIVE_SHADOW = "0px 2px 32px 0px rgba(0,0,0,0.3)";

export default function Snackbar({
  variant = "default",
  icon,
  text,
  action,
}: SnackbarProps) {
  const isNegative = variant === "negative";

  return (
    <div
      role="status"
      style={{
        width: 328,
        display: "flex",
        alignItems: "center",
        borderRadius: RADIUS_SM,
        paddingRight: SPACE_XS,
        backgroundColor: isNegative ? RED_400 : SLATE_800,
        boxShadow: isNegative ? NEGATIVE_SHADOW : ELEVATION_CARD,
      }}
    >
      {icon && (
        <div
          aria-hidden="true"
          style={{
            paddingLeft: SPACE_M,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            flexShrink: 0,
            boxSizing: "content-box",
          }}
        >
          <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: SPACE_M,
          color: ALPHA_WHITE_FF,
          ...typography.bodySmall,
        }}
      >
        {text}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: ALPHA_WHITE_FF,
            padding: `${SPACE_XS}px ${SPACE_M}px`,
            ...typography.buttonSmall,
            whiteSpace: "nowrap",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
