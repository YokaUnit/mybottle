"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  value: number;
  className?: string;
};

export function AnimatedLinearGauge({ value, className }: Props) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <motion.div
      className={className}
      initial={{ width: "0%" }}
      animate={{ width: `${clamped}%` }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.85, ease: [0.2, 0.9, 0.2, 1] }
      }
    />
  );
}
