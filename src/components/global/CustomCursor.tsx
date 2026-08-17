"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xQuick = gsap.quickTo(dot, "x", { duration: 0.1, ease: "none" });
    const yQuick = gsap.quickTo(dot, "y", { duration: 0.1, ease: "none" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power2.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      xQuick(e.clientX);
      yQuick(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
