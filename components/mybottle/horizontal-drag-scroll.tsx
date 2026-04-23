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
    lastX: 0,
    lastTs: 0,
    velocity: 0,
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const drawRafRef = useRef<number | null>(null);
  const inertiaRafRef = useRef<number | null>(null);
  const targetScrollLeftRef = useRef(0);

  useEffect(() => {
    return () => {
      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current);
      }
      if (inertiaRafRef.current !== null) {
        window.cancelAnimationFrame(inertiaRafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`mb-horizontal-scroll -mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:cursor-grab md:active:cursor-grabbing [&::-webkit-scrollbar]:hidden ${
        isDraggingUi ? "[scroll-snap-type:none]" : "[scroll-snap-type:x_proximity]"
      }`}
      style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        const el = scrollRef.current;
        if (!el) return;
        if (inertiaRafRef.current !== null) {
          window.cancelAnimationFrame(inertiaRafRef.current);
          inertiaRafRef.current = null;
        }
        dragState.current.isMouseDown = true;
        dragState.current.isDragging = false;
        dragState.current.startX = event.clientX;
        dragState.current.startLeft = el.scrollLeft;
        dragState.current.lastX = event.clientX;
        dragState.current.lastTs = performance.now();
        dragState.current.velocity = 0;
      }}
      onMouseMove={(event) => {
        const el = scrollRef.current;
        if (!el || !dragState.current.isMouseDown) return;
        const diff = event.clientX - dragState.current.startX;
        if (!dragState.current.isDragging && Math.abs(diff) < 6) return;
        dragState.current.isDragging = true;
        setIsDraggingUi(true);
        targetScrollLeftRef.current = dragState.current.startLeft - diff;
        const now = performance.now();
        const dt = Math.max(now - dragState.current.lastTs, 1);
        const dx = event.clientX - dragState.current.lastX;
        const instantVelocity = -dx / dt;
        dragState.current.velocity = dragState.current.velocity * 0.75 + instantVelocity * 0.25;
        dragState.current.lastX = event.clientX;
        dragState.current.lastTs = now;
        if (drawRafRef.current !== null) return;
        drawRafRef.current = window.requestAnimationFrame(() => {
          const currentEl = scrollRef.current;
          if (currentEl) {
            currentEl.scrollLeft = targetScrollLeftRef.current;
          }
          drawRafRef.current = null;
        });
      }}
      onMouseUp={() => {
        const el = scrollRef.current;
        if (dragState.current.isDragging) {
          dragState.current.suppressClick = true;
          const startVelocity = dragState.current.velocity;
          if (el && Math.abs(startVelocity) > 0.03) {
            let velocity = startVelocity * 18;
            const step = () => {
              const currentEl = scrollRef.current;
              if (!currentEl) return;
              velocity *= 0.94;
              if (Math.abs(velocity) < 0.35) {
                inertiaRafRef.current = null;
                setIsDraggingUi(false);
                return;
              }
              const maxScroll = currentEl.scrollWidth - currentEl.clientWidth;
              const next = Math.min(Math.max(currentEl.scrollLeft + velocity, 0), maxScroll);
              currentEl.scrollLeft = next;
              inertiaRafRef.current = window.requestAnimationFrame(step);
            };
            inertiaRafRef.current = window.requestAnimationFrame(step);
          } else {
            setIsDraggingUi(false);
          }
        } else {
          setIsDraggingUi(false);
        }
        dragState.current.isMouseDown = false;
        dragState.current.isDragging = false;
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
      onDragStartCapture={(event) => {
        // PCでリンク/画像のネイティブドラッグを抑止して、横スクロール操作を優先する
        event.preventDefault();
      }}
    >
      {children}
    </div>
  );
}
