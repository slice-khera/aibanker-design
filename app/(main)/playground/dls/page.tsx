"use client";

import { typography } from "@/app/lib/typography";
import * as colors from "@/app/lib/colors";
import { DlsTag } from "@/app/components/ChatCards";
import { StatusBar, NavButton, AppBar, FooterInset, GestureNav } from "@/app/components/AppChrome";
import { Separator } from "@/components/ui/separator";

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

// ── Swatch component ─────────────────────────────────────────
function SwatchBlock({ name, value }: Swatch) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-12 w-16 rounded-lg border"
        style={{ backgroundColor: value }}
      />
      <span className="text-xs font-medium text-foreground">{name.replace(/_/g, " ")}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

export default function DlsPage() {
  return (
    <div className="max-w-5xl px-8 py-8">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">DLS</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Design language system tokens and primitives
        </p>
      </div>

      {/* ── Colors ── */}
      <section id="colors" className="mb-10">
        <h2 className="text-lg font-semibold mb-6">Colors</h2>
        <div className="flex flex-col gap-8">
          {COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{group.title}</h3>
              <div className="flex flex-wrap gap-4">
                {group.swatches.map((s) => <SwatchBlock key={s.name} {...s} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ── Typography ── */}
      <section id="typography" className="mb-10">
        <h2 className="text-lg font-semibold mb-6">Typography</h2>
        <div className="flex flex-col gap-0">
          {TYPO_ENTRIES.map(([name, style]) => (
            <div key={name} className="flex items-baseline gap-6 border-b py-4">
              <span className="w-28 shrink-0 text-xs font-medium uppercase text-muted-foreground">{name}</span>
              <span style={{ ...style }} className="text-foreground">The quick brown fox</span>
              <span className="ml-auto whitespace-nowrap text-xs text-muted-foreground">
                {style.fontSize}px / {style.lineHeight} / w{style.fontWeight}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ── Spacing ── */}
      <section id="spacing" className="mb-10">
        <h2 className="text-lg font-semibold mb-6">Spacing</h2>
        <div className="flex flex-col gap-3">
          {SPACING_VALUES.map((px) => (
            <div key={px} className="flex items-center gap-4">
              <span className="w-10 text-right text-xs text-muted-foreground">{px}px</span>
              <div
                className="h-6 rounded"
                style={{
                  width: px,
                  backgroundColor: colors.VALENTINO_400,
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ── Corner Radius ── */}
      <section id="radii" className="mb-10">
        <h2 className="text-lg font-semibold mb-6">Corner radius</h2>
        <div className="flex flex-wrap gap-6">
          {RADII.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="h-20 w-20"
                style={{
                  borderRadius: value,
                  border: `2px solid ${colors.VALENTINO_500}`,
                  backgroundColor: colors.VALENTINO_50,
                }}
              />
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{value}px</span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ── Elevation ── */}
      <section id="elevation" className="mb-10">
        <h2 className="text-lg font-semibold mb-6">Elevation</h2>
        <div className="flex flex-wrap gap-6">
          {ELEVATIONS.map(({ label, shadow }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="flex h-24 w-40 items-center justify-center rounded-2xl bg-background"
                style={{ boxShadow: shadow }}
              >
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ── Primitives ── */}
      <section id="primitives">
        <h2 className="text-lg font-semibold mb-6">Primitives</h2>

        {/* StatusBar */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">StatusBar</h3>
        <div className="mb-6 w-[360px] overflow-hidden rounded-lg border border-dashed border-muted-foreground/25">
          <StatusBar />
        </div>

        {/* AppBar */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">AppBar</h3>
        <div className="mb-6 w-[360px] overflow-hidden rounded-lg border border-dashed border-muted-foreground/25">
          <AppBar title="Page Title" leading={<NavButton kind="back" />} trailing={<NavButton kind="close" />} />
        </div>

        {/* Footer & GestureNav */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">FooterInset + GestureNav</h3>
        <div className="mb-6 w-[360px] overflow-hidden rounded-lg border border-dashed border-muted-foreground/25">
          <FooterInset />
          <GestureNav />
        </div>

        {/* Tags */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Tag (6 intents × 2 emphasis)</h3>
        <div className="flex flex-col gap-3 mb-6">
          {TAG_EMPHASES.map((emp) => (
            <div key={emp} className="flex flex-wrap items-center gap-2">
              <span className="w-12 text-xs font-medium uppercase text-muted-foreground">{emp}</span>
              {TAG_INTENTS.map((intent) => (
                <DlsTag key={`${emp}-${intent}`} intent={intent} emphasis={emp}>
                  {intent}
                </DlsTag>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
