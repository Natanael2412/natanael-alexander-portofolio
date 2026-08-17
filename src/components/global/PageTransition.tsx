"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Entrance animation only on initial mount for SPA
  useEffect(() => {
    if (!curtainRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        curtainRef.current,
        { scaleY: 1, transformOrigin: "top" },
        {
          scaleY: 0,
          duration: 0.9,
          ease: "expo.inOut",
          delay: 0.1,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={curtainRef} className="page-curtain" aria-hidden="true" />
      <main>{children}</main>
    </>
  );
}
