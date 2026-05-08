"use client";

import type { ReactNode } from "react";
import { typography } from "../../lib/typography";
import { SLATE_300, SLATE_800, OUTLINE_SUBTLE } from "../../lib/colors";
import { DlsTag } from "../../components/ChatCards";
import { STATUS_TAG_PROPS } from "./status-registry";
import type { ItemStatus } from "./status-registry";
import VariantSwitcher from "./VariantSwitcher";
import DeviceFrame from "./DeviceFrame";

type Props = {
  name: string;
  description?: string;
  status: ItemStatus;
  onCycleStatus: () => void;
  variants?: string[];
  activeVariantIndex?: number;
  onVariantChange?: (index: number) => void;
  deviceFrame?: boolean;
  /** Autoplay toggle (flows only) */
  autoplay?: boolean;
  onToggleAutoplay?: () => void;
  children: ReactNode;
};

export default function PlaygroundCard({
  name,
  description,
  status,
  onCycleStatus,
  variants,
  activeVariantIndex = 0,
  onVariantChange,
  deviceFrame = false,
  autoplay,
  onToggleAutoplay,
  children,
}: Props) {
  const tagProps = STATUS_TAG_PROPS[status];
  const hasVariants = variants && variants.length > 1;

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${OUTLINE_SUBTLE}`,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* ── Header area ── */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Name + status row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ ...typography.headerH4, color: SLATE_800, margin: 0 }}>{name}</h3>
            {description && (
              <p style={{ ...typography.caption, color: SLATE_300, margin: 0, marginTop: 2 }}>{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onCycleStatus}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", lineHeight: 0, flexShrink: 0 }}
          >
            <DlsTag intent={tagProps.intent} emphasis={tagProps.emphasis}>{status}</DlsTag>
          </button>
        </div>

        {/* Variant switcher + autoplay row */}
        {(hasVariants || autoplay !== undefined) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasVariants && onVariantChange && (
              <VariantSwitcher
                variants={variants}
                activeIndex={activeVariantIndex}
                onChange={onVariantChange}
              />
            )}
            {onToggleAutoplay && (
              <button
                type="button"
                onClick={onToggleAutoplay}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 100,
                  border: `1px solid ${autoplay ? SLATE_800 : OUTLINE_SUBTLE}`,
                  background: autoplay ? SLATE_800 : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                title={autoplay ? "Pause autoplay" : "Start autoplay"}
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  {autoplay ? (
                    <>
                      <rect x="1" y="1" width="2.5" height="10" rx="0.5" fill="#fff" />
                      <rect x="6.5" y="1" width="2.5" height="10" rx="0.5" fill="#fff" />
                    </>
                  ) : (
                    <path d="M1 1.5v9l8-4.5-8-4.5z" fill={SLATE_300} />
                  )}
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: OUTLINE_SUBTLE }} />

      {/* ── Preview area ── */}
      {deviceFrame ? (
        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          <DeviceFrame>{children}</DeviceFrame>
        </div>
      ) : (
        <div style={{ padding: 24, background: "#f8f9fa" }}>
          <div
            style={{
              width: 360,
              background: "#fff",
              border: `1px solid ${OUTLINE_SUBTLE}`,
              borderRadius: 2,
              padding: 24,
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
