"use client";

import { typography } from "../../lib/typography";
import * as colors from "../../lib/colors";
import { DlsTag } from "../../components/ChatCards";
import { StatusBar, NavButton, AppBar, FooterInset, GestureNav } from "../../components/AppChrome";
import type { ReactNode } from "react";
import { SLATE_50, SLATE_300, SLATE_800, OUTLINE_SUBTLE } from "../../lib/colors";

// ── Color swatch grid ─────────────────────────────────────────
type Swatch = { name: string; value: string };

const COLOR_GROUPS: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Valentino (Brand)",
    swatches: [
      { name: "VALENTINO_50", value: colors.VALENTINO_50 },
      { name: "VALENTINO_400", value: colors.VALENTINO_400 },
      { name: "VALENTINO_500", value: colors.VALENTINO_500 },
      { name: "VALENTINO_600", value: colors.VALENTINO_600 },
      { name: "VALENTINO_700", value: colors.VALENTINO_700 },
      { name: "VALENTINO_950", value: colors.VALENTINO_950 },
    ],
  },
  {
    title: "Slate (Neutral)",
    swatches: [
      { name: "SLATE_10", value: colors.SLATE_10 },
      { name: "SLATE_30", value: colors.SLATE_30 },
      { name: "SLATE_50", value: colors.SLATE_50 },
      { name: "SLATE_100", value: colors.SLATE_100 },
      { name: "SLATE_300", value: colors.SLATE_300 },
      { name: "SLATE_400", value: colors.SLATE_400 },
      { name: "SLATE_500", value: colors.SLATE_500 },
      { name: "SLATE_600", value: colors.SLATE_600 },
      { name: "SLATE_700", value: colors.SLATE_700 },
      { name: "SLATE_800", value: colors.SLATE_800 },
      { name: "SLATE_900", value: colors.SLATE_900 },
      { name: "SLATE_950", value: colors.SLATE_950 },
    ],
  },
  {
    title: "Blue",
    swatches: [
      { name: "BLUE_50", value: colors.BLUE_50 },
      { name: "BLUE_400", value: colors.BLUE_400 },
      { name: "BLUE_500", value: colors.BLUE_500 },
      { name: "BLUE_950", value: colors.BLUE_950 },
    ],
  },
  {
    title: "Green",
    swatches: [
      { name: "GREEN_50", value: colors.GREEN_50 },
      { name: "GREEN_400", value: colors.GREEN_400 },
      { name: "GREEN_500", value: colors.GREEN_500 },
      { name: "GREEN_950", value: colors.GREEN_950 },
    ],
  },
  {
    title: "Red",
    swatches: [
      { name: "RED_50", value: colors.RED_50 },
      { name: "RED_400", value: colors.RED_400 },
      { name: "RED_500", value: colors.RED_500 },
      { name: "RED_950", value: colors.RED_950 },
    ],
  },
  {
    title: "Orange",
    swatches: [
      { name: "ORANGE_50", value: colors.ORANGE_50 },
      { name: "ORANGE_400", value: colors.ORANGE_400 },
      { name: "ORANGE_500", value: colors.ORANGE_500 },
      { name: "ORANGE_600", value: colors.ORANGE_600 },
      { name: "ORANGE_950", value: colors.ORANGE_950 },
    ],
  },
  {
    title: "Alpha / Black",
    swatches: [
      { name: "ALPHA_BLACK_90", value: colors.ALPHA_BLACK_90 },
      { name: "ALPHA_BLACK_70", value: colors.ALPHA_BLACK_70 },
      { name: "ALPHA_BLACK_50", value: colors.ALPHA_BLACK_50 },
      { name: "ALPHA_BLACK_40", value: colors.ALPHA_BLACK_40 },
      { name: "ALPHA_BLACK_30", value: colors.ALPHA_BLACK_30 },
      { name: "ALPHA_BLACK_20", value: colors.ALPHA_BLACK_20 },
      { name: "ALPHA_BLACK_10", value: colors.ALPHA_BLACK_10 },
      { name: "ALPHA_BLACK_05", value: colors.ALPHA_BLACK_05 },
    ],
  },
  {
    title: "Semantic",
    swatches: [
      { name: "BG_PRIMARY", value: colors.BG_PRIMARY },
      { name: "BG_SECONDARY", value: colors.BG_SECONDARY },
      { name: "BG_CARD", value: colors.BG_CARD },
      { name: "BG_BRAND", value: colors.BG_BRAND },
      { name: "BG_OVERLAY", value: colors.BG_OVERLAY },
      { name: "TEXT_PRIMARY", value: colors.TEXT_PRIMARY },
      { name: "TEXT_SECONDARY", value: colors.TEXT_SECONDARY },
      { name: "TEXT_TERTIARY", value: colors.TEXT_TERTIARY },
      { name: "MAIN_PRIMARY", value: colors.MAIN_PRIMARY },
      { name: "UTILITY_INFO", value: colors.UTILITY_INFO },
      { name: "UTILITY_POSITIVE", value: colors.UTILITY_POSITIVE },
      { name: "UTILITY_NEGATIVE", value: colors.UTILITY_NEGATIVE },
      { name: "UTILITY_WARNING", value: colors.UTILITY_WARNING },
    ],
  },
];

// ── Typography spec ───────────────────────────────────────────
const TYPO_ENTRIES = Object.entries(typography) as [string, typeof typography.bodyNormal][];

// ── Spacing scale ─────────────────────────────────────────────
const SPACING_VALUES = [2, 4, 6, 8, 12, 16, 20, 24, 32, 64];

// ── Radii ─────────────────────────────────────────────────────
const RADII = [
  { label: "S", value: 8 },
  { label: "M", value: 16 },
  { label: "L", value: 24 },
  { label: "XL", value: 32 },
  { label: "Circle", value: 100 },
];

// ── Elevation ─────────────────────────────────────────────────
const ELEVATIONS = [
  { label: "Card", shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" },
  { label: "Above", shadow: "0 4px 12px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)" },
  { label: "Below", shadow: "0 -4px 12px rgba(0,0,0,0.06)" },
];

// ── Tag variants ──────────────────────────────────────────────
const TAG_INTENTS = ["positive", "warning", "negative", "brand", "info", "neutral"] as const;
const TAG_EMPHASES = ["subtle", "bold"] as const;

// ── Section wrapper ───────────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ paddingBottom: 40, marginBottom: 40, borderBottom: `1px solid ${OUTLINE_SUBTLE}` }}>
      <h2 style={{ ...typography.headerH3, color: SLATE_800, marginBottom: 16 }}>{title}</h2>
      {children}
    </section>
  );
}


function SwatchBlock({ name, value }: Swatch) {
  const isDark = value.startsWith("rgba(0") || value.startsWith("#0") || value.startsWith("#1") || value.startsWith("#2") || value.startsWith("#3");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{
        width: 64,
        height: 48,
        borderRadius: 8,
        backgroundColor: value,
        border: `1px solid ${OUTLINE_SUBTLE}`,
      }} />
      <span style={{ ...typography.metadata, color: SLATE_800 }}>{name.replace(/_/g, " ")}</span>
      <span style={{ ...typography.metadata, color: SLATE_300 }}>{value}</span>
    </div>
  );
}

export default function DlsPage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
      <h1 style={{ ...typography.headerH1, color: SLATE_800, marginBottom: 32 }}>DLS</h1>

      {/* 1. Colors */}
      <Section id="colors" title="Colors">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 24 }}>
            <h3 style={{ ...typography.headerH4, color: SLATE_300, marginBottom: 12 }}>{group.title}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {group.swatches.map((s) => <SwatchBlock key={s.name} {...s} />)}
            </div>
          </div>
        ))}
      </Section>

      {/* 2. Typography */}
      <Section id="typography" title="Typography">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TYPO_ENTRIES.map(([name, style]) => (
            <div key={name} style={{ display: "flex", alignItems: "baseline", gap: 24, borderBottom: `1px solid ${OUTLINE_SUBTLE}`, paddingBottom: 16 }}>
              <span style={{ ...typography.metadata, color: SLATE_300, width: 120, flexShrink: 0, textTransform: "uppercase" }}>{name}</span>
              <span style={{ ...style, color: SLATE_800 }}>The quick brown fox</span>
              <span style={{ ...typography.caption, color: SLATE_300, marginLeft: "auto", whiteSpace: "nowrap" }}>
                {style.fontSize}px / {style.lineHeight} / w{style.fontWeight}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Spacing */}
      <Section id="spacing" title="Spacing">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SPACING_VALUES.map((px) => (
            <div key={px} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ ...typography.metadata, color: SLATE_300, width: 40, textAlign: "right" }}>{px}px</span>
              <div style={{
                width: px,
                height: 24,
                borderRadius: 4,
                background: colors.VALENTINO_400,
                opacity: 0.7,
              }} />
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Radii */}
      <Section id="radii" title="Corner Radius">
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {RADII.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: value,
                border: `2px solid ${colors.VALENTINO_500}`,
                background: colors.VALENTINO_50,
              }} />
              <span style={{ ...typography.caption, color: SLATE_800 }}>{label}</span>
              <span style={{ ...typography.metadata, color: SLATE_300 }}>{value}px</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Elevation */}
      <Section id="elevation" title="Elevation">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {ELEVATIONS.map(({ label, shadow }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 160,
                height: 100,
                borderRadius: 16,
                background: "#fff",
                boxShadow: shadow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ ...typography.bodySmall, color: SLATE_300 }}>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Primitives */}
      <Section id="primitives" title="Primitives">
        {/* Status Bar */}
        <h3 style={{ ...typography.headerH4, color: SLATE_300, marginBottom: 12 }}>StatusBar</h3>
        <div style={{ width: 360, marginBottom: 24, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: 8, overflow: "hidden" }}>
          <StatusBar />
        </div>

        {/* App Bar */}
        <h3 style={{ ...typography.headerH4, color: SLATE_300, marginBottom: 12 }}>AppBar</h3>
        <div style={{ width: 360, marginBottom: 24, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: 8, overflow: "hidden" }}>
          <AppBar title="Page Title" leading={<NavButton kind="back" />} trailing={<NavButton kind="close" />} />
        </div>

        {/* Footer & GestureNav */}
        <h3 style={{ ...typography.headerH4, color: SLATE_300, marginBottom: 12 }}>FooterInset + GestureNav</h3>
        <div style={{ width: 360, marginBottom: 24, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: 8, overflow: "hidden" }}>
          <FooterInset />
          <GestureNav />
        </div>

        {/* Tags — 12 variants */}
        <h3 style={{ ...typography.headerH4, color: SLATE_300, marginBottom: 12 }}>Tag (6 intents × 2 emphasis)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {TAG_EMPHASES.map((emp) => (
            <div key={emp} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <span style={{ ...typography.metadata, color: SLATE_300, width: 48, textTransform: "uppercase" }}>{emp}</span>
              {TAG_INTENTS.map((intent) => (
                <DlsTag key={`${emp}-${intent}`} intent={intent} emphasis={emp}>
                  {intent}
                </DlsTag>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
