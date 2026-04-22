"use client";

import type { CSSProperties } from "react";

type Props = {
  value: number;
  className?: string;
};

export function AnimatedLinearGauge({ value, className }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const style = { "--mb-gauge-target": `${clamped}%` } as CSSProperties;

  return <div className={`mb-gauge-fill ${className ?? ""}`} style={style} />;
}
