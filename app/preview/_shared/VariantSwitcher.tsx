"use client";

import { typography } from "../../lib/typography";
import { SLATE_300, SLATE_800, OUTLINE_SUBTLE } from "../../lib/colors";

type Props = {
  variants: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function VariantSwitcher({ variants, activeIndex, onChange }: Props) {
  if (variants.length < 2) return null;

  return (
    <div
      style={{
        display: "inline-flex",
        border: `1px solid ${OUTLINE_SUBTLE}`,
        borderRadius: 100,
        overflow: "hidden",
      }}
    >
      {variants.map((name, i) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(i)}
          style={{
            ...typography.metadata,
            padding: "5px 12px",
            background: i === activeIndex ? SLATE_800 : "transparent",
            color: i === activeIndex ? "#fff" : SLATE_300,
            border: "none",
            borderRight: i < variants.length - 1 ? `1px solid ${OUTLINE_SUBTLE}` : "none",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: "1.2",
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
