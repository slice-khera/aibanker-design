"use client";

import { useEffect, useState } from "react";
import { typography } from "../lib/typography";
import { SLATE_800, ALPHA_WHITE_FF } from "../lib/colors";
import { ELEVATION_CARD } from "../lib/elevation";

type SnackbarProps = {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
  icon?: React.ReactNode;
};

const DEFAULT_DURATION_MS = 3000;

export default function Snackbar({
  message,
  visible,
  onDismiss,
  durationMs = DEFAULT_DURATION_MS,
  icon,
}: SnackbarProps) {
  const [rendered, setRendered] = useState(visible);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      const raf = requestAnimationFrame(() => setAnimateIn(true));
      const dismissTimer = window.setTimeout(onDismiss, durationMs);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(dismissTimer);
      };
    }
    setAnimateIn(false);
    const exitTimer = window.setTimeout(() => setRendered(false), 250);
    return () => window.clearTimeout(exitTimer);
  }, [visible, durationMs, onDismiss]);

  if (!rendered) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: `translate(-50%, ${animateIn ? "0" : "12px"})`,
        opacity: animateIn ? 1 : 0,
        transition: "opacity 250ms ease-out, transform 250ms ease-out",
        width: 328,
        maxWidth: "calc(100% - 32px)",
        borderRadius: 12,
        backgroundColor: SLATE_800,
        boxShadow: ELEVATION_CARD,
        padding: 16,
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
      <span style={{ ...typography.bodySmall, color: ALPHA_WHITE_FF }}>{message}</span>
    </div>
  );
}
