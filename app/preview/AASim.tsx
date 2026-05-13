"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { typography } from "../lib/typography";
import {
  VALENTINO_500,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, TEXT_DISABLED,
  GREEN_500, SLATE_30,
  BG_PRIMARY, BG_CARD, BG_DISABLED, OUTLINE_SUBTLE,
  ALPHA_BLACK_05, ALPHA_WHITE_FF,
} from "../lib/colors";
import { SPACE_2XS, SPACE_XS, SPACE_S, SPACE_M, SPACE_L, SPACE_XL, SPACE_2XL } from "../lib/spacing";
import { RADIUS_L, RADIUS_M, RADIUS_CIRCLE } from "../lib/radii";
import { ELEVATION_CARD, ELEVATION_ABOVE, ELEVATION_BELOW } from "../lib/elevation";
import { StatusBar, GestureNav } from "../components/AppChrome";
import { AA_BENEFITS, AA_LEARN_MORE, AA_CONSENT_CARDS, AA_CONSENT_DETAILS, BANKS } from "./fixtures/onboardingFixture";

// ── Transition config ────────────────────────────────────────────

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 460;

// ── Inline SVG icons ─────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={ALPHA_WHITE_FF} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ size = 48, color = ALPHA_WHITE_FF }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GraphIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 20h18M5 17V10M9 17V7M13 17V12M17 17V5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <img src="/icons/chevron-left.svg" alt="Back" width={24} height={24} />
  );
}

// ── AA benefit icons ─────────────────────────────────────────────

const AA_ICONS = [
  <GraphIcon key="graph" color={TEXT_TERTIARY} />,
  <SparkIcon key="spark" color={TEXT_TERTIARY} />,
  <ShieldIcon key="shield" color={TEXT_TERTIARY} />,
];

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={TEXT_PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbsUpIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3m7-2V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0v7M10 10.5V6a2 2 0 00-4 0v9l-1.76-2.64a2 2 0 00-3.24 2.34l4.5 6.3A6 6 0 0010.5 24H14a8 8 0 008-8v-5a2 2 0 00-4 0" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ color = TEXT_TERTIARY }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={TEXT_TERTIARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Purple FAB ───────────────────────────────────────────────────

function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center transition-transform active:scale-[0.95]"
      style={{
        width: 56,
        height: 56,
        borderRadius: RADIUS_CIRCLE,
        backgroundColor: VALENTINO_500,
        border: "none",
        cursor: "pointer",
        boxShadow: "none",
      }}
    >
      <ArrowRightIcon />
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

const SCREENS = ["value-prop", "learn-more", "bank-select", "otp", "consent", "consent-detail", "success"] as const;
type Screen = (typeof SCREENS)[number];

export default function AASim({
  onComplete,
  onClose,
}: {
  onComplete?: () => void;
  onClose?: () => void;
} = {}) {
  const [screen, setScreen] = useState<Screen>("value-prop");
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | "up" | "down">("left");
  const [phase, setPhase] = useState<"idle" | "prep" | "go">("idle");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [consentDetailIdx, setConsentDetailIdx] = useState(0);

  // Auto-complete after success screen shows
  useEffect(() => {
    if (screen === "success" && onComplete) {
      const timer = window.setTimeout(onComplete, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [screen, onComplete]);

  // Screens that are "presented" (slide up/down) rather than "pushed" (left/right)
  const PRESENT_SCREENS: Screen[] = ["consent-detail", "learn-more"];

  const goTo = useCallback((next: Screen) => {
    const nextIdx = SCREENS.indexOf(next);
    const currIdx = SCREENS.indexOf(screen);
    const isPresent = PRESENT_SCREENS.includes(next);
    const isDismiss = PRESENT_SCREENS.includes(screen);

    if (isPresent) {
      setDirection("up");
    } else if (isDismiss) {
      setDirection("down");
    } else {
      setDirection(nextIdx > currIdx ? "left" : "right");
    }

    setPrevScreen(screen);
    setScreen(next);
    setPhase("prep");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setPhase("go");
      setTimeout(() => {
        setPrevScreen(null);
        setPhase("idle");
      }, DURATION);
    }));
  }, [screen]);

  const goBack = useCallback(() => {
    const idx = SCREENS.indexOf(screen);
    if (idx <= 0) { onClose?.(); return; }
    // Skip presented (modal) screens when going back
    let target = idx - 1;
    while (target > 0 && PRESENT_SCREENS.includes(SCREENS[target])) target--;
    goTo(SCREENS[target]);
  }, [screen, goTo, onClose]);

  // ── Value Prop ───────────────────────────────────────────────

  function renderValueProp() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        {/* App bar */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Header */}
        <div style={{ paddingLeft: SPACE_L, paddingRight: SPACE_L, marginTop: SPACE_XL }}>
          <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: 0 }}>
            Link your accounts
          </h1>
        </div>

        {/* Benefit rows */}
        <div className="flex-1" style={{ marginTop: SPACE_XL, display: "flex", flexDirection: "column" }}>
          {AA_BENEFITS.map((benefit, i) => (
            <div
              key={benefit.title}
              className="flex items-start"
              style={{ padding: `${SPACE_M}px ${SPACE_L}px`, gap: SPACE_S }}
            >
              <div className="shrink-0" style={{ width: 24, height: 24, marginTop: 2 }}>
                {AA_ICONS[i]}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE_2XS }}>
                <div style={{ display: "flex", flexDirection: "column", gap: SPACE_2XS }}>
                  <p style={{ ...typography.buttonSmall, color: TEXT_PRIMARY, margin: 0 }}>
                    {benefit.title}
                  </p>
                  <p style={{ ...typography.bodySmall, color: TEXT_TERTIARY, margin: 0 }}>
                    {benefit.subtitle}
                  </p>
                </div>
                {(benefit as { cta?: string }).cta && (
                  <button
                    type="button"
                    onClick={() => goTo("learn-more")}
                    style={{
                      ...typography.buttonSmall,
                      color: VALENTINO_500,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      marginTop: SPACE_S,
                      textAlign: "left",
                    }}
                  >
                    {(benefit as { cta?: string }).cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAB + Gesture nav */}
        <div className="shrink-0">
          <div className="flex justify-end" style={{ padding: `0 ${SPACE_XL}px ${SPACE_L}px` }}>
            <Fab onClick={() => goTo("bank-select")} />
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  // ── Learn More ──────────────────────────────────────────────

  const LEARN_MORE_ICONS = [
    <LockIcon key="lock" />,
    <ThumbsUpIcon key="thumbs" />,
    <ShieldIcon key="shield" />,
    <HandIcon key="hand" />,
  ];

  function renderLearnMore() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        {/* App bar with close (X) */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={() => goTo("value-prop")}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: `0 ${SPACE_L}px` }}>
          {/* Header */}
          <div style={{ marginTop: SPACE_XL, display: "flex", flexDirection: "column", gap: SPACE_2XS }}>
            <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: 0 }}>
              {AA_LEARN_MORE.title}
            </h1>
            <p style={{ ...typography.bodySmall, color: TEXT_TERTIARY, margin: 0 }}>
              {AA_LEARN_MORE.subtitle}
            </p>
          </div>

          {/* Major supported banks */}
          <div style={{ marginTop: SPACE_2XL, display: "flex", flexDirection: "column", gap: SPACE_S }}>
            <p style={{ ...typography.buttonSmall, color: TEXT_PRIMARY, margin: 0 }}>
              Major supported banks
            </p>
            <div className="flex items-center">
              {AA_LEARN_MORE.supportedBanks.map((bank, i) => (
                <div
                  key={bank}
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: RADIUS_CIRCLE,
                    backgroundColor: BG_CARD,
                    border: `1px solid ${OUTLINE_SUBTLE}`,
                    marginLeft: i > 0 ? -12 : 0,
                    zIndex: AA_LEARN_MORE.supportedBanks.length - i,
                  }}
                >
                  <span style={{ ...typography.caption, color: TEXT_SECONDARY, fontWeight: 500 }}>
                    {bank[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div style={{ marginTop: SPACE_2XL, display: "flex", flexDirection: "column", gap: SPACE_L }}>
            {AA_LEARN_MORE.benefits.map((benefit, i) => (
              <div key={benefit.title} className="flex items-start" style={{ gap: SPACE_S }}>
                <div className="shrink-0" style={{ width: 24, height: 24 }}>
                  {LEARN_MORE_ICONS[i]}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: SPACE_2XS }}>
                  <p style={{ ...typography.buttonSmall, color: TEXT_PRIMARY, margin: 0 }}>
                    {benefit.title}
                  </p>
                  <p style={{ ...typography.bodySmall, color: TEXT_TERTIARY, margin: 0 }}>
                    {benefit.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Account aggregators */}
          <div style={{ marginTop: SPACE_2XL, display: "flex", flexDirection: "column", gap: SPACE_S, paddingBottom: SPACE_2XL }}>
            <p style={{ ...typography.buttonSmall, color: TEXT_PRIMARY, margin: 0 }}>
              Account aggregators
            </p>
            <div className="flex flex-wrap" style={{ gap: SPACE_L }}>
              {AA_LEARN_MORE.aggregators.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-center"
                  style={{ width: 60, height: 36 }}
                >
                  <span style={{ ...typography.caption, color: TEXT_SECONDARY }}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GestureNav />
      </div>
    );
  }

  // ── Bank Select ──────────────────────────────────────────────

  const [bankScrolled, setBankScrolled] = useState(false);
  const [bankAtBottom, setBankAtBottom] = useState(true);
  const bankScrollRef = useCallback((el: HTMLDivElement | null) => {
    if (el) setBankAtBottom(el.scrollHeight <= el.clientHeight + 2);
  }, []);

  function renderBankSelect() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        {/* App bar — shows title + shadow on scroll */}
        <div
          className="flex items-center shrink-0"
          style={{
            height: 64,
            paddingLeft: SPACE_S,
            paddingRight: SPACE_XS,
            paddingTop: SPACE_XS,
            paddingBottom: SPACE_XS,
            backgroundColor: BG_PRIMARY,
            boxShadow: bankScrolled ? ELEVATION_BELOW : "none",
            transition: "box-shadow 200ms ease",
            zIndex: 1,
          }}
        >
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <BackIcon />
          </button>
        </div>

        {/* Scrollable content: header + grid */}
        <div
          ref={bankScrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={(e) => {
            const el = e.target as HTMLDivElement;
            setBankScrolled(el.scrollTop > 40);
            setBankAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
          }}
        >
          {/* Header */}
          <div style={{ paddingLeft: SPACE_L, paddingRight: SPACE_L, marginTop: SPACE_XL }}>
            <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: 0 }}>
              Select your primary account
            </h1>
          </div>

          {/* Bank grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: SPACE_L,
              padding: `${SPACE_2XL}px ${SPACE_L}px`,
              paddingBottom: SPACE_2XL,
            }}
          >
            {BANKS.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => {
                  setSelectedBank(bank.id);
                }}
                className="flex flex-col items-center justify-center transition-transform active:scale-[0.97]"
                style={{
                  height: 134,
                  borderRadius: RADIUS_L,
                  backgroundColor: BG_CARD,
                  border: `2px solid ${selectedBank === bank.id ? VALENTINO_500 : OUTLINE_SUBTLE}`,
                  cursor: "pointer",
                  gap: SPACE_M,
                  padding: SPACE_M,
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: RADIUS_CIRCLE,
                    backgroundColor: BG_CARD,
                    border: `1.2px solid ${OUTLINE_SUBTLE}`,
                  }}
                >
                  <span style={{ ...typography.buttonSmall, color: bank.color }}>
                    {bank.initial}
                  </span>
                </div>
                <span style={{ ...typography.buttonSmall, color: TEXT_SECONDARY, textAlign: "center" }}>
                  {bank.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="shrink-0"
          style={{ boxShadow: bankAtBottom ? "none" : ELEVATION_ABOVE, transition: "box-shadow 200ms ease" }}
        >
          <div style={{ padding: `${SPACE_M}px ${SPACE_L}px`, backgroundColor: BG_PRIMARY }}>
            <button
              type="button"
              onClick={selectedBank ? () => goTo("otp") : undefined}
              style={{
                width: "100%",
                height: 48,
                borderRadius: RADIUS_CIRCLE,
                backgroundColor: selectedBank ? VALENTINO_500 : BG_DISABLED,
                border: "none",
                cursor: selectedBank ? "pointer" : "default",
                ...typography.buttonNormal,
                color: selectedBank ? BG_PRIMARY : TEXT_DISABLED,
              }}
            >
              Continue
            </button>
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  // ── OTP ──────────────────────────────────────────────────────

  function renderOtp() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        {/* App bar */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <BackIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1" style={{ padding: `0 ${SPACE_L}px` }}>
          {/* Header */}
          <div style={{ marginTop: SPACE_XL, display: "flex", flexDirection: "column", gap: SPACE_S }}>
            <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: 0 }}>
              OTP
            </h1>
            <p style={{ ...typography.bodyNormal, color: TEXT_TERTIARY, margin: 0 }}>
              Sent to +91 8765667213
            </p>
          </div>

          {/* Input field — underlined */}
          <div style={{ marginTop: SPACE_2XL, paddingTop: SPACE_S }}>
            <input
              type="tel"
              maxLength={4}
              placeholder="Enter OTP received"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
              style={{
                ...typography.bodyNormal,
                color: TEXT_PRIMARY,
                width: "100%",
                border: "none",
                outline: "none",
                padding: 0,
                background: "transparent",
              }}
            />
            <div
              style={{
                height: otpValue.length > 0 ? 2 : 1,
                backgroundColor: otpValue.length > 0 ? VALENTINO_500 : OUTLINE_SUBTLE,
                marginTop: SPACE_S,
              }}
            />
          </div>

          {/* Resend */}
          <p style={{ ...typography.buttonNormal, color: TEXT_DISABLED, margin: 0, marginTop: SPACE_2XL, opacity: 0.6 }}>
            Resend in 00:15
          </p>
        </div>

        {/* Footer */}
        <div className="shrink-0">
          <div style={{ padding: `${SPACE_M}px ${SPACE_L}px`, paddingBottom: SPACE_L, backgroundColor: BG_PRIMARY }}>
            {/* T&C text */}
            <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0, textAlign: "center", marginBottom: SPACE_2XS }}>
              By continuing, you accept Onemoney{" "}
              <span style={{ color: VALENTINO_500 }}>T&C</span>
            </p>
            <button
              type="button"
              onClick={otpValue.length === 4 ? () => goTo("consent") : undefined}
              style={{
                width: "100%",
                height: 48,
                borderRadius: RADIUS_CIRCLE,
                backgroundColor: otpValue.length === 4 ? VALENTINO_500 : BG_DISABLED,
                border: "none",
                cursor: otpValue.length === 4 ? "pointer" : "default",
                ...typography.buttonNormal,
                color: otpValue.length === 4 ? BG_PRIMARY : TEXT_DISABLED,
              }}
            >
              Continue
            </button>
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  // ── Consent ─────────────────────────────────────────────────

  function renderConsent() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        {/* App bar — back */}
        <div
          className="flex items-center shrink-0"
          style={{
            height: 64,
            paddingLeft: SPACE_S,
            paddingRight: SPACE_XS,
            paddingTop: SPACE_XS,
            paddingBottom: SPACE_XS,
          }}
        >
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <BackIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: `0 ${SPACE_L}px` }}>
          {/* Header */}
          <h1 style={{ ...typography.headerH1, color: TEXT_PRIMARY, margin: 0, marginTop: SPACE_XL }}>
            Approve consent
          </h1>

          {/* Account row */}
          <div className="flex items-center" style={{ gap: SPACE_S, paddingTop: SPACE_M, paddingBottom: SPACE_M }}>
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: RADIUS_CIRCLE,
                backgroundColor: BG_CARD,
                border: `1px solid ${OUTLINE_SUBTLE}`,
              }}
            >
              <span style={{ ...typography.buttonSmall, color: "#004C8F" }}>H</span>
            </div>
            <div>
              <p style={{ ...typography.bodyNormal, color: TEXT_PRIMARY, margin: 0 }}>HDFC xx6543</p>
              <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0 }}>Savings</p>
            </div>
          </div>

          {/* Consent cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: SPACE_M, marginTop: SPACE_XS }}>
            {AA_CONSENT_CARDS.map((card, i) => (
              <div
                key={card.title}
                onClick={() => { setConsentDetailIdx(i); goTo("consent-detail"); }}
                style={{
                  cursor: "pointer",
                  backgroundColor: BG_CARD,
                  border: `1px solid ${OUTLINE_SUBTLE}`,
                  borderRadius: RADIUS_M,
                  boxShadow: ELEVATION_CARD,
                  padding: `${SPACE_L}px ${SPACE_L}px ${SPACE_M}px`,
                  position: "relative",
                }}
              >
                {/* Chevron */}
                <div style={{ position: "absolute", top: SPACE_L, right: SPACE_L }}>
                  <ChevronRightIcon />
                </div>

                {/* Title + subtitle */}
                <div style={{ display: "flex", flexDirection: "column", gap: SPACE_XS }}>
                  <p style={{ ...typography.headerH4, color: TEXT_PRIMARY, margin: 0 }}>{card.title}</p>
                  <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: 0 }}>{card.subtitle}</p>
                </div>

                {/* Key-value pairs */}
                <div className="flex" style={{ gap: SPACE_L, marginTop: SPACE_M }}>
                  {card.details.map((d) => (
                    <div key={d.label} style={{ display: "flex", flexDirection: "column", gap: SPACE_2XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}>
                      <p style={{ ...typography.caption, color: TEXT_SECONDARY, margin: 0 }}>{d.label}</p>
                      <p style={{ ...typography.bodySmall, color: TEXT_PRIMARY, margin: 0 }}>{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — Approve + Onemoney logo */}
        <div className="shrink-0">
          <div style={{ padding: `${SPACE_M}px ${SPACE_L}px`, backgroundColor: BG_PRIMARY }}>
            <button
              type="button"
              onClick={() => goTo("success")}
              style={{
                width: "100%",
                height: 48,
                borderRadius: RADIUS_CIRCLE,
                backgroundColor: VALENTINO_500,
                border: "none",
                cursor: "pointer",
                ...typography.buttonNormal,
                color: BG_PRIMARY,
              }}
            >
              Approve
            </button>
          </div>
          {/* Onemoney logo placeholder */}
          <div className="flex items-center justify-center" style={{ paddingTop: SPACE_XS, paddingBottom: SPACE_XS, backgroundColor: BG_PRIMARY }}>
            <span style={{ ...typography.caption, color: TEXT_TERTIARY }}>onemoney</span>
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  // ── Consent Detail ──────────────────────────────────────────

  function renderConsentDetail() {
    const detail = AA_CONSENT_DETAILS[consentDetailIdx];
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        {/* App bar — X close + title */}
        <div
          className="flex items-center shrink-0"
          style={{ height: 64, paddingLeft: SPACE_S, paddingRight: SPACE_XS, paddingTop: SPACE_XS, paddingBottom: SPACE_XS }}
        >
          <button
            type="button"
            onClick={() => goTo("consent")}
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "none", border: "none", cursor: "pointer", padding: 12 }}
          >
            <CloseIcon />
          </button>
          <span
            style={{
              ...typography.headerH3,
              color: TEXT_PRIMARY,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {detail.title}
          </span>
        </div>

        {/* List rows */}
        <div className="flex-1 overflow-y-auto">
          {detail.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center"
              style={{ padding: `${SPACE_M}px 14px`, gap: SPACE_S }}
            >
              {/* Icon avatar */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: RADIUS_CIRCLE,
                  backgroundColor: BG_CARD,
                  border: `1px solid ${BG_CARD}`,
                }}
              >
                <span style={{ ...typography.caption, color: TEXT_TERTIARY }}>
                  {row.label[0]}
                </span>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p style={{ ...typography.caption, color: TEXT_SECONDARY, margin: 0 }}>{row.label}</p>
                <p style={{ ...typography.bodyNormal, color: TEXT_PRIMARY, margin: 0 }}>{row.value}</p>
              </div>
              {/* Info icon */}
              {(row as { hasInfo?: boolean }).hasInfo && (
                <div className="shrink-0">
                  <InfoIcon color={TEXT_TERTIARY} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Onemoney logo + gesture nav */}
        <div className="shrink-0">
          <div className="flex items-center justify-center" style={{ paddingBottom: SPACE_M, backgroundColor: BG_PRIMARY }}>
            <span style={{ ...typography.caption, color: TEXT_TERTIARY }}>onemoney</span>
          </div>
          <GestureNav />
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────

  function renderSuccess() {
    return (
      <div
        className="h-full w-full flex flex-col"
        style={{ backgroundColor: BG_PRIMARY }}
      >
        <StatusBar backgroundColor="transparent" />

        <div className="flex-1 flex items-center justify-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: RADIUS_CIRCLE,
              backgroundColor: GREEN_500,
              animation: "successPop 400ms ease-out",
            }}
          >
            <CheckIcon size={40} color={ALPHA_WHITE_FF} />
          </div>
        </div>

        <GestureNav />
      </div>
    );
  }

  // ── Router ───────────────────────────────────────────────────

  function renderScreen(s: Screen) {
    switch (s) {
      case "value-prop": return renderValueProp();
      case "learn-more": return renderLearnMore();
      case "bank-select": return renderBankSelect();
      case "otp": return renderOtp();
      case "consent": return renderConsent();
      case "consent-detail": return renderConsentDetail();
      case "success": return renderSuccess();
    }
  }

  // Push: both screens slide left/right together.
  // Present (up): new screen slides up over old (old stays still).
  // Dismiss (down): old screen slides down revealing new (new stays still).
  const isPresent = direction === "up";
  const isDismiss = direction === "down";
  const isVertical = isPresent || isDismiss;

  const isMoving = phase !== "idle";

  function getOutgoingStyle(): React.CSSProperties {
    if (isPresent) {
      // Old screen stays still underneath
      return { position: "absolute", inset: 0, zIndex: 0 };
    }
    if (isDismiss) {
      // Old screen (the modal) slides down to dismiss
      return {
        position: "absolute", inset: 0, zIndex: 1,
        transform: phase === "go" ? "translateY(100%)" : "translateY(0)",
        transition: phase === "go" ? `transform ${DURATION}ms ${EASE}` : "none",
      };
    }
    // Push: old screen slides out horizontally
    const exitTo = direction === "left" ? "-100%" : "100%";
    return {
      position: "absolute", inset: 0,
      transform: phase === "go" ? `translateX(${exitTo})` : "translateX(0)",
      transition: phase === "go" ? `transform ${DURATION}ms ${EASE}` : "none",
    };
  }

  function getIncomingStyle(): React.CSSProperties {
    if (isPresent) {
      // New screen slides up from bottom
      return {
        position: "absolute", inset: 0, zIndex: 1,
        transform: phase === "prep" ? "translateY(100%)" : "translateY(0)",
        transition: phase === "go" ? `transform ${DURATION}ms ${EASE}` : "none",
      };
    }
    if (isDismiss) {
      // New screen just sits still underneath
      return { position: "absolute", inset: 0, zIndex: 0 };
    }
    // Push: new screen slides in horizontally
    const enterFrom = direction === "left" ? "100%" : "-100%";
    return {
      position: "absolute", inset: 0,
      transform: phase === "prep" ? `translateX(${enterFrom})` : "translateX(0)",
      transition: phase === "go" ? `transform ${DURATION}ms ${EASE}` : "none",
    };
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Outgoing screen */}
      {isMoving && prevScreen && (
        <div style={getOutgoingStyle()}>
          {renderScreen(prevScreen)}
        </div>
      )}
      {/* Current screen */}
      <div style={getIncomingStyle()}>
        {renderScreen(screen)}
      </div>
    </div>
  );
}
