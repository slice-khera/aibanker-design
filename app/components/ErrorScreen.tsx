"use client";

import { typography } from "../lib/typography";
import {
  BG_PRIMARY,
  TEXT_PRIMARY,
  TEXT_TERTIARY,
  VALENTINO_500,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { SPACE_XS, SPACE_S, SPACE_L, SPACE_XL } from "../lib/spacing";
import { RADIUS_CIRCLE } from "../lib/radii";
import { AppBar, GestureNav, NavButton } from "./AppChrome";

// DLS Full-page error. Figma node 861:14635.
// Variants: appBar (true/false), reloadButton (true/false).

const ERROR_BLOB = "/illustrations/error-blob.svg";
const RELOAD_ICON = "/icons/reload.svg";

type ErrorScreenProps = {
  appBar?: boolean;
  reloadButton?: boolean;
  onReload?: () => void;
  onBack?: () => void;
};

export default function ErrorScreen({
  appBar = true,
  reloadButton = true,
  onReload,
  onBack,
}: ErrorScreenProps) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: BG_PRIMARY,
        overflow: "hidden",
      }}
    >
      {/* App bar (with status bar), toggled via prop */}
      {appBar && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}>
          <AppBar leading={<NavButton kind="back" onClick={onBack} />} />
        </div>
      )}

      {/* Centered message. Figma: top/left 50%, translate -50%, gap 32. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: SPACE_XL,
          paddingLeft: SPACE_XL,
          paddingRight: SPACE_XL,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE_XS, width: "100%" }}>
          {/* Illustration: 216×216, exact Figma export */}
          <div style={{ width: 216, height: 216, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              alt=""
              src={ERROR_BLOB}
              style={{ width: 123, height: 135, display: "block" }}
            />
          </div>

          {/* Title + body, center-aligned */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE_XS, textAlign: "center" }}>
            <p
              style={{
                ...typography.headerH3,
                color: TEXT_PRIMARY,
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              Something weird happened
            </p>
            <div style={{ width: 296, color: TEXT_TERTIARY, ...typography.bodySmall, margin: 0 }}>
              <p style={{ margin: 0 }}>Looks like it needs a little push.</p>
              <p style={{ margin: 0 }}>Reload to try again</p>
            </div>
          </div>
        </div>

        {/* Reload button: DLS Primary, Regular size */}
        {reloadButton && (
          <button
            type="button"
            onClick={onReload}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: SPACE_XS,
              paddingLeft: SPACE_L,
              paddingRight: SPACE_L,
              paddingTop: SPACE_S,
              paddingBottom: SPACE_S,
              borderRadius: RADIUS_CIRCLE,
              backgroundColor: VALENTINO_500,
              border: "none",
              cursor: "pointer",
              color: ALPHA_WHITE_FF,
              ...typography.buttonNormal,
            }}
          >
            <img
              alt=""
              src={RELOAD_ICON}
              style={{ width: 24, height: 24, filter: "brightness(0) invert(1)", display: "block" }}
            />
            <span>Reload</span>
          </button>
        )}
      </div>

      {/* Gesture nav at bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <GestureNav />
      </div>
    </div>
  );
}
