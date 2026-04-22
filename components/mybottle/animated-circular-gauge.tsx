"use client";

import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  value: number;
};

export function AnimatedCircularGauge({ value }: Props) {
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const clamped = Math.max(0, Math.min(100, value));
  const degree = useTransform(progress, (v) => v * 3.6);
  const background = useMotionTemplate`conic-gradient(var(--mb-forest) ${degree}deg, var(--mb-muted-strong) 0)`;
  const [shownPct, setShownPct] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      progress.set(clamped);
      setShownPct(clamped);
      return;
    }
    progress.set(0);
    setShownPct(0);
    const controls = animate(progress, clamped, {
      duration: 0.95,
      ease: [0.2, 0.9, 0.2, 1],
      onUpdate: (latest) => setShownPct(Math.round(latest)),
    });
    return () => controls.stop();
  }, [clamped, progress, reducedMotion]);

  return (
    <motion.div
      className="relative grid h-36 w-36 place-items-center rounded-full border-4 border-[var(--mb-forest)]"
      style={{ background }}
    >
      <div className="grid h-28 w-28 place-items-center rounded-full bg-[var(--mb-card)] text-center">
        <div>
          <motion.p className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--mb-forest)]">
            {shownPct}
            %
          </motion.p>
          <p className="text-[10px] text-[var(--mb-forest-light)]">残量</p>
        </div>
      </div>
    </motion.div>
  );
}
