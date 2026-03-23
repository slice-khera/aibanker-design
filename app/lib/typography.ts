import type { CSSProperties } from "react";

type TypographyStyle = CSSProperties & {
  fontFamily: string;
  fontWeight: 400 | 500;
  fontSize: number;
  lineHeight: string;
  letterSpacing: string;
};

const rubik = "var(--font-rubik), sans-serif";

function createStyle(
  fontWeight: 400 | 500,
  fontSize: number,
  lineHeight: number,
  letterSpacingPct: number
): TypographyStyle {
  return {
    fontFamily: rubik,
    fontWeight,
    fontSize,
    lineHeight: `${lineHeight}px`,
    letterSpacing: `${fontSize * (letterSpacingPct / 100)}px`,
  };
}

export const typography = {
  displayLarge: createStyle(400, 80, 96, -1),
  displayMedium: createStyle(500, 64, 72, -1),
  displaySmall: createStyle(500, 48, 56, -1),
  headerH1: createStyle(500, 32, 40, 0),
  headerH2: createStyle(500, 24, 32, 2),
  headerH3: createStyle(500, 20, 24, 2),
  headerH4: createStyle(500, 16, 20, 2),
  buttonNormal: createStyle(500, 16, 24, 2),
  buttonSmall: createStyle(500, 14, 20, 2),
  bodyLarge: createStyle(400, 18, 28, 2),
  bodyNormal: createStyle(400, 16, 24, 2),
  bodySmall: createStyle(400, 14, 20, 2),
  caption: createStyle(400, 12, 16, 2),
  metadata: createStyle(400, 10, 12, 4),
} as const;

