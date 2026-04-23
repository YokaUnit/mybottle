"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function HorizontalDragScroll({ children }: Props) {
  const [isDraggingUi, setIsDraggingUi] = useState(false);
  const dragState = useRef({
    isMouseDown: false,
    isDragging: false,
    startX: 0,
    startLeft: 0,
    suppressClick: false,
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetScrollLeftRef = useRef(0);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`mb-horizontal-scroll -mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:cursor-grab md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden ${
        isDraggingUi ? "[scroll-snap-type:none]" : "[scroll-snap-type:x_mandatory]"
      }`}
      style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        const el = scrollRef.current;
        if (!el) return;
        dragState.current.isMouseDown = true;
        dragState.current.isDragging = false;
        dragState.current.startX = event.clientX;
        dragState.current.startLeft = el.scrollLeft;
      }}
      onMouseMove={(event) => {
        const el = scrollRef.current;
        if (!el || !dragState.current.isMouseDown) return;
        const diff = event.clientX - dragState.current.startX;
        if (!dragState.current.isDragging && Math.abs(diff) < 6) return;
        dragState.current.isDragging = true;
        setIsDraggingUi(true);
        targetScrollLeftRef.current = dragState.current.startLeft - diff;
        if (rafRef.current !== null) return;
        rafRef.current = window.requestAnimationFrame(() => {
          const currentEl = scrollRef.current;
          if (currentEl) {
            currentEl.scrollLeft = targetScrollLeftRef.current;
          }
          rafRef.current = null;
        });
      }}
      onMouseUp={() => {
        if (dragState.current.isDragging) {
          dragState.current.suppressClick = true;
        }
        dragState.current.isMouseDown = false;
        dragState.current.isDragging = false;
        setIsDraggingUi(false);
      }}
      onMouseLeave={() => {
        if (dragState.current.isDragging) {
          dragState.current.suppressClick = true;
        }
        dragState.current.isMouseDown = false;
        dragState.current.isDragging = false;
        setIsDraggingUi(false);
      }}
      onClickCapture={(event) => {
        if (!dragState.current.suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        dragState.current.suppressClick = false;
        dragState.current.isDragging = false;
      }}
    >
      {children}
    </div>
  );
}
