"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { explorations } from "./registry";
import { typography } from "../lib/typography";
import { VALENTINO_500, SLATE_300, SLATE_500, SLATE_800, OUTLINE_SUBTLE } from "../lib/colors";

// ── Section link card ─────────────────────────────────────────
const SECTIONS = [
  { href: "/preview/dls", label: "DLS", description: "Colors, typography, spacing, radii, elevation, primitives" },
  { href: "/preview/visualizations", label: "Visualizations", description: "10 data display components — flat on surface" },
  { href: "/preview/widgets", label: "Widgets", description: "4 actionable items — enclosed containers" },
  { href: "/preview/screens", label: "Screens", description: "Standalone screens in device frames" },
  { href: "/preview/flows", label: "Flows", description: "End-to-end journeys in device frames" },
] as const;

function OverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const componentName = searchParams.get("component");
  const fullscreen = searchParams.get("fullscreen") === "1";
  const variantName = searchParams.get("variant");
  const autoplay = searchParams.get("autoplay") === "1";

  // ── Legacy redirect: ?component=Name renders old gallery inline ──
  if (fullscreen && componentName) {
    const exp = explorations.find((e) => e.component === componentName);
    const variant = exp?.variants.find((v) => v.name === variantName) ?? exp?.variants[0];
    if (!variant) return <div style={{ padding: 40 }}>Variant not found</div>;
    return (
      <>
        <style>{`* { cursor: none !important; }`}</style>
        <div style={{ width: 360, height: 780, overflow: "hidden", position: "relative", background: "#fff" }}>
          {variant.render(autoplay)}
        </div>
      </>
    );
  }

  if (componentName) {
    const exploration = explorations.find((e) => e.component === componentName);
    if (!exploration) {
      return (
        <div style={{ padding: 40 }}>
          <p style={{ ...typography.bodyNormal, color: SLATE_500 }}>
            No entry for <strong>{componentName}</strong>.
          </p>
          <a href="/preview" style={{ ...typography.bodySmall, color: VALENTINO_500, marginTop: 12, display: "inline-block" }}>
            Back to overview
          </a>
        </div>
      );
    }

    return (
      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <h1 style={{ ...typography.headerH2, margin: 0, color: SLATE_800 }}>
            {exploration.component}
          </h1>
          <span style={{
            ...typography.metadata,
            textTransform: "uppercase",
            color: SLATE_300,
            background: "rgba(0,0,0,0.04)",
            padding: "3px 8px",
            borderRadius: 6,
          }}>
            {exploration.category}
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 24 }}>
          {exploration.variants.map((variant) => (
            <div key={variant.name} style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <h2 style={{ ...typography.headerH4, margin: 0, color: SLATE_800 }}>{variant.name}</h2>
                <p style={{ ...typography.caption, color: SLATE_300, margin: "4px 0 0" }}>{variant.description}</p>
              </div>
              <div style={{
                width: 372,
                borderRadius: 32,
                backgroundColor: "#1a1a1e",
                padding: 6,
                boxShadow: "0 28px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.05)",
                outline: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width: 360,
                  aspectRatio: "360/780",
                  borderRadius: 26,
                  overflow: "hidden",
                  background: "#fff",
                  position: "relative",
                }}>
                  {variant.render()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Overview landing ──────────────────────────────────────────
  return (
    <div style={{ padding: "40px 40px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ ...typography.headerH1, margin: 0, color: SLATE_800 }}>
          Playground
        </h1>
        <p style={{ ...typography.bodySmall, color: SLATE_300, margin: "4px 0 0" }}>
          Browse the design system, visualizations, widgets, screens, and flows.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {SECTIONS.map(({ href, label, description }) => (
          <a
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "20px 24px",
              borderRadius: 12,
              border: `1px solid ${OUTLINE_SUBTLE}`,
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 150ms, box-shadow 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = VALENTINO_500;
              e.currentTarget.style.boxShadow = `0 0 0 1px ${VALENTINO_500}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = OUTLINE_SUBTLE;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ ...typography.headerH4, color: SLATE_800 }}>{label}</span>
            <span style={{ ...typography.caption, color: SLATE_300 }}>{description}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <OverviewContent />
    </Suspense>
  );
}
