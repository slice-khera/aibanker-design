"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BG_PRIMARY, BG_SECONDARY,
  VALENTINO_50, VALENTINO_500,
  SLATE_300, SLATE_500, SLATE_800,
  OUTLINE_SUBTLE,
} from "../lib/colors";
import { typography } from "../lib/typography";

// ── Navigation items ──────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/preview/dls", label: "DLS" },
  { href: "/preview/visualizations", label: "Visualizations" },
  { href: "/preview/widgets", label: "Widgets" },
  { href: "/preview/screens", label: "Screens" },
  { href: "/preview/flows", label: "Flows" },
] as const;

// ── Breadcrumb from path ──────────────────────────────────────
const BREADCRUMB_LABELS: Record<string, string> = { dls: "DLS" };

function getBreadcrumb(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment || segment === "preview") return "Overview";
  return BREADCRUMB_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function PreviewLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG_PRIMARY, fontFamily: "var(--font-rubik), sans-serif" }}>
      {/* ── Sidebar ───────────────────────────── */}
      <nav
        style={{
          width: 240,
          flexShrink: 0,
          background: BG_SECONDARY,
          borderRight: `1px solid ${OUTLINE_SUBTLE}`,
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Logo / title */}
        <a
          href="/preview"
          style={{
            ...typography.headerH3,
            padding: "0 20px 20px",
            color: SLATE_800,
            textDecoration: "none",
          }}
        >
          Playground
        </a>

        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <a
              key={href}
              href={href}
              style={{
                ...typography.bodySmall,
                display: "block",
                padding: "10px 20px",
                margin: "0 12px",
                borderRadius: 8,
                textDecoration: "none",
                color: isActive ? VALENTINO_500 : SLATE_500,
                background: isActive ? VALENTINO_50 : "transparent",
                fontWeight: isActive ? 500 : 400,
                transition: "background 120ms, color 120ms",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {/* ── Main content ──────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            padding: "16px 32px",
            borderBottom: `1px solid ${OUTLINE_SUBTLE}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <a href="/preview" style={{ ...typography.bodySmall, color: SLATE_300, textDecoration: "none" }}>
            Playground
          </a>
          <span style={{ ...typography.bodySmall, color: SLATE_300 }}>/</span>
          <span style={{ ...typography.bodySmall, color: SLATE_800, fontWeight: 500 }}>
            {getBreadcrumb(pathname)}
          </span>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
