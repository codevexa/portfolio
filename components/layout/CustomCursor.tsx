"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor personalizado — apenas em dispositivos com mouse de precisão.
 * Em toque, tela pequena ou movimento reduzido, nada é renderizado e o
 * cursor nativo permanece intacto.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    setEnabled(true);
    document.body.classList.add("vx-cursor-host");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    const interactive = "a, button, [role='button'], input, textarea, select, label";
    const onOver = (e: Event) => {
      const el = e.target as HTMLElement | null;
      const hot = Boolean(el?.closest?.(interactive));
      ring.current?.setAttribute("data-hot", hot ? "true" : "false");
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.body.classList.remove("vx-cursor-host");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={ring}
        data-hot="false"
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-bone/35 transition-[width,height,background-color,border-color] duration-300 ease-out data-[hot=true]:h-14 data-[hot=true]:w-14 data-[hot=true]:border-lime data-[hot=true]:bg-lime/10"
      />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-lime" />
    </div>
  );
}
