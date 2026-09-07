import type { CSSProperties } from "react";

type EnterKind = "dense" | "cards" | "rows";

const STEPS: Record<EnterKind, readonly [number, number]> = {
  dense: [35, 160],
  cards: [45, 180],
  rows: [40, 160],
};

export function enterDelay(index: number, kind: EnterKind = "cards"): CSSProperties {
  const [step, cap] = STEPS[kind];
  return { "--enter-delay": `${Math.min(index * step, cap)}ms` } as CSSProperties;
}
