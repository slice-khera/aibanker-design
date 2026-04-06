"use client";

import type { CSSProperties, ReactNode } from "react";
import { typography } from "../lib/typography";

export const STATUS_BAR_HEIGHT = 44; // DLS: 8px top padding + 36px bar
export const BOTTOM_INSET = 20; // gesture nav: 8px + 4px bar + 8px

// ── Status bar (decorative) ─────────────────────────────────────────────────

export function StatusBar({ backgroundColor = "#fff" }: { backgroundColor?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor,
        paddingTop: 8,
        height: STATUS_BAR_HEIGHT,
        position: "relative",
      }}
    >
      <div style={{ height: 36, position: "relative" }}>
        {/* Time — Figma: left 55px, translateX(-50%), top calc(50% - 8.33px) */}
        <p
          style={{
            position: "absolute",
            left: 55,
            top: "calc(50% - 8.33px)",
            transform: "translateX(-50%)",
            fontFamily: "'SF Pro', -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: -0.4,
            color: "rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          9:41
        </p>

        {/* Status icons — Figma: right 30px, vertically centered, gap 6.436px */}
        <div
          style={{
            position: "absolute",
            right: 30,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 6.436,
          }}
        >
          {/* Cellular — 16.976×10.829 */}
          <img
            alt=""
            src="/status-cellular.svg"
            style={{ width: 16.976, height: 10.829, display: "block" }}
          />
          {/* Wi-Fi — 14.927×10.829 */}
          <img
            alt=""
            src="/status-wifi.svg"
            style={{ width: 14.927, height: 10.829, display: "block" }}
          />
          {/* Battery — 27.333×13.667 with fill overlay */}
          <div style={{ width: 27.333, height: 13.667, position: "relative" }}>
            <img
              alt=""
              src="/status-battery.svg"
              style={{ position: "absolute", width: "100%", height: "100%", display: "block" }}
            />
            <div style={{ position: "absolute", inset: "0 44.91% 0 0" }}>
              <img
                alt=""
                src="/status-battery-fill.svg"
                style={{ position: "absolute", width: "100%", height: "100%", display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gesture nav indicator ───────────────────────────────────────────────────

export function GestureNav({ backgroundColor = "transparent" }: { backgroundColor?: string }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ backgroundColor, paddingTop: 8, paddingBottom: 8 }}
      aria-hidden="true"
    >
      <div
        style={{
          width: 128,
          height: 4,
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 40,
        }}
      />
    </div>
  );
}

// ── Nav button ──────────────────────────────────────────────────────────────

type NavButtonProps = {
  kind: "back" | "close";
  onClick?: () => void;
  ariaLabel?: string;
};

export function NavButton({ kind, onClick, ariaLabel }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? (kind === "back" ? "Back" : "Close")}
      style={{
        width: 48,
        height: 48,
        border: "none",
        background: "transparent",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 12,
      }}
    >
      {kind === "back" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 6L9 12L15 18" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

// ── App bar (Standard / L1+) ────────────────────────────────────────────────

type AppBarProps = {
  leading?: ReactNode;
  title?: ReactNode;
  trailing?: ReactNode;
  shadow?: boolean;
  backgroundColor?: string;
};

export function AppBar({
  leading,
  title,
  trailing,
  shadow = false,
  backgroundColor = "#fff",
}: AppBarProps) {
  return (
    <div
      className="shrink-0"
      style={{
        backgroundColor,
        boxShadow: shadow ? "0px 6px 8px rgba(0,0,0,0.05)" : "none",
      }}
    >
      {/* Status bar chrome */}
      <StatusBar backgroundColor={backgroundColor} />

      {/* App bar content — Figma: flex, pl-12 pr-8 py-8 */}
      <div
        className="flex items-center"
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 8,
        }}
      >
        {/* Nav icon — flex-1 capped at 48px */}
        <div style={{ flex: "1 0 0", maxWidth: 48, height: 48, display: "flex", alignItems: "center" }}>
          {leading}
        </div>
        {/* Title — flex-1, left-aligned, ellipsis */}
        <div
          style={{
            flex: "1 0 0",
            minWidth: 0,
            height: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "rgba(0,0,0,0.9)",
              ...typography.headerH4,
            }}
          >
            {title ?? null}
          </div>
        </div>
        {/* Trailing slot — spacer when empty so title stays centered */}
        {trailing ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {trailing}
          </div>
        ) : leading ? (
          <div style={{ flex: "1 0 0", maxWidth: 48, height: 48 }} />
        ) : null}
      </div>
    </div>
  );
}

// ── Footer inset ────────────────────────────────────────────────────────────

type FooterInsetProps = {
  children?: ReactNode;
  backgroundColor?: string;
  paddingX?: number;
  paddingTop?: number;
  minBottomPadding?: number;
  boxShadow?: string;
  style?: CSSProperties;
};

export function FooterInset({
  children,
  backgroundColor = "#fff",
  paddingX = 24,
  paddingTop = 8,
  minBottomPadding = 12,
  boxShadow,
  style,
}: FooterInsetProps) {
  return (
    <div
      className="shrink-0"
      style={{
        backgroundColor,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop,
        paddingBottom: Math.max(BOTTOM_INSET, minBottomPadding),
        boxShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
