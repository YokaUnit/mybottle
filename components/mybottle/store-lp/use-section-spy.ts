import { useCallback, useEffect, useState } from "react";

const HEADER_OFFSET_PX = 56;
const SCROLL_ACTIVATION_OFFSET_PX = 72;

export const STORE_LP_SPY_SECTIONS = ["top", "dashboard", "value", "faq"] as const;
export type StoreLpSpySectionId = (typeof STORE_LP_SPY_SECTIONS)[number];

export function useSectionSpy() {
  const [activeId, setActiveId] = useState<StoreLpSpySectionId>(STORE_LP_SPY_SECTIONS[0]);

  const resolveActive = useCallback(() => {
    const scrollY = window.scrollY + HEADER_OFFSET_PX + SCROLL_ACTIVATION_OFFSET_PX;
    let current: StoreLpSpySectionId = STORE_LP_SPY_SECTIONS[0];

    for (const id of STORE_LP_SPY_SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= scrollY) current = id;
    }

    setActiveId(current);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });

    if ((STORE_LP_SPY_SECTIONS as readonly string[]).includes(id)) {
      setActiveId(id as StoreLpSpySectionId);
    }
  }, []);

  useEffect(() => {
    resolveActive();
    window.addEventListener("scroll", resolveActive, { passive: true });
    window.addEventListener("resize", resolveActive);
    return () => {
      window.removeEventListener("scroll", resolveActive);
      window.removeEventListener("resize", resolveActive);
    };
  }, [resolveActive]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });

      if ((STORE_LP_SPY_SECTIONS as readonly string[]).includes(hash)) {
        setActiveId(hash as StoreLpSpySectionId);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return { activeId, scrollToSection };
}
