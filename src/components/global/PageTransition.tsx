"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!curtainRef.current) return;
    
    // Animasi curtain hanya berjalan di Desktop
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        curtainRef.current,
        { scaleY: 1, transformOrigin: "top" },
        { scaleY: 0, duration: 0.9, ease: "expo.inOut", delay: 0.1 }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* KUNCI: Class 'hidden lg:block' memastikan curtain tidak pernah ada di Mobile */}
      <div ref={curtainRef} className="page-curtain hidden lg:block" aria-hidden="true" />
      <main>{children}</main>
    </>
  );
}