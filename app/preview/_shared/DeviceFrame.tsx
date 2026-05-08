"use client";

import type { ReactNode } from "react";

/**
 * Device frame — matches main app bezel (360×780, rounded corners, dark housing).
 * Used by Screens and Flows sections.
 */
export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 372, /* 360 + 6px padding each side */
        borderRadius: 32,
        backgroundColor: "#1a1a1e",
        padding: 6,
        boxShadow: "none",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 360,
          aspectRatio: "360/780",
          borderRadius: 26,
          overflow: "hidden",
          background: "#fff",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
