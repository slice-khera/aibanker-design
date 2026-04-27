"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { explorations } from "./registry";

function PreviewContent() {
  const searchParams = useSearchParams();
  const componentName = searchParams.get("component");

  // Landing page — list all active explorations
  if (!componentName) {
    if (explorations.length === 0) {
      return (
        <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
            Component Preview
          </h1>
          <p style={{ color: "#666", marginBottom: 24 }}>
            No active explorations. Add variants to{" "}
            <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>
              app/preview/registry.ts
            </code>{" "}
            to start exploring.
          </p>
          <p style={{ color: "#999", fontSize: 14 }}>
            Usage: <code>/preview?component=GoalTracker</code>
          </p>
        </div>
      );
    }

    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
          Active explorations
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {explorations.map((exp) =>
            exp.empty ? (
              <div
                key={exp.component}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "1px solid #eee",
                  color: "#bbb",
                  cursor: "default",
                }}
              >
                <span style={{ fontWeight: 500 }}>{exp.component}</span>
                <span style={{ fontSize: 14 }}>empty</span>
              </div>
            ) : (
              <a
                key={exp.component}
                href={`/preview?component=${encodeURIComponent(exp.component)}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "1px solid #e0e0e0",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f8f8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontWeight: 500 }}>{exp.component}</span>
                <span style={{ color: "#999", fontSize: 14 }}>
                  {exp.variants.length} variant{exp.variants.length !== 1 ? "s" : ""}
                </span>
              </a>
            )
          )}
        </div>
      </div>
    );
  }

  // Fullscreen mode — render a single variant with no gallery chrome
  const fullscreen = searchParams.get("fullscreen") === "1";
  const variantName = searchParams.get("variant");
  const autoplay = searchParams.get("autoplay") === "1";

  if (fullscreen && componentName) {
    const exp = explorations.find((e) => e.component === componentName);
    const variant = exp?.variants.find((v) => v.name === variantName) ?? exp?.variants[0];
    if (!variant) {
      return <div style={{ padding: 40, color: "#fff" }}>Variant not found</div>;
    }
    return (
      <>
        <style>{`* { cursor: none !important; }`}</style>
        <div style={{ width: 360, height: 780, overflow: "hidden", position: "relative", background: "#fff" }}>
          {variant.render(autoplay)}
        </div>
      </>
    );
  }

  // Component gallery — show all variants
  const exploration = explorations.find((e) => e.component === componentName);
  if (!exploration) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          Not found
        </h1>
        <p style={{ color: "#666" }}>
          No exploration registered for <strong>{componentName}</strong>.
        </p>
        <a href="/preview" style={{ color: "#d30ad7", marginTop: 16, display: "inline-block" }}>
          Back to all explorations
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <a href="/preview" style={{ color: "#666", textDecoration: "none", fontSize: 14 }}>
          All explorations
        </a>
        <span style={{ color: "#444" }}>/</span>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0, color: "#fff" }}>
          {exploration.component}
        </h1>
        <span style={{ color: "#666", fontSize: 14 }}>
          {exploration.variants.length} variant{exploration.variants.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Variant gallery — horizontal scroll */}
      <div
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          paddingBottom: 24,
          scrollSnapType: "x mandatory",
        }}
      >
        {exploration.variants.map((variant) => (
          <div
            key={variant.name}
            style={{
              flexShrink: 0,
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Label */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#fff" }}>
                {variant.name}
              </h2>
              <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>
                {variant.description}
              </p>
            </div>

            {/* Device frame — matches main app bezel */}
            <div
              style={{
                width: 372, /* 360 + 6px padding each side */
                borderRadius: 32,
                backgroundColor: "#1a1a1e",
                padding: 6,
                boxShadow: "0 28px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.05)",
                outline: "1px solid rgba(255,255,255,0.05)",
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
                {variant.render()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
