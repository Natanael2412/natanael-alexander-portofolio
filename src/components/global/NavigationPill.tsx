"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export default function NavigationPill() {
  const pathname = usePathname();
  const pillRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<HTMLAnchorElement[]>([]);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useGSAP(() => {
    // If we're on a portfolio page, do not mount the GSAP logic
    if (pathname.startsWith("/portfolio")) return;
    
    if (!pillRef.current) return;

    let lastScrollY = window.scrollY;

    const showPill = () => {
      gsap.to(pillRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "expo.out",
      });
    };

    const hidePill = () => {
      gsap.to(pillRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.5,
        ease: "expo.in",
      });
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY;
        lastScrollY = currentY;

        // Clear existing idle timer
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        if (diff > 2 && currentY > 100) {
          // Scrolling down — hide
          hidePill();
        } else if (diff < -2) {
          // Scrolling up — show
          showPill();
        }

        // Set idle timer to show pill after 1.5s of no scrolling
        idleTimerRef.current = setTimeout(() => {
          showPill();
        }, 1500);

        // ScrollSpy logic to automatically update URL hash using accurate visual position
        let currentSection = "/";
        const aboutSection = document.getElementById("about");
        const workSection = document.getElementById("work");
        const contactSection = document.getElementById("contact");
        
        // GUARD: Only run ScrollSpy if we are actually on a page that has these sections (like the homepage)
        // This prevents the URL from being forcefully reset to '/' when on the /portfolio page.
        if (!aboutSection && !workSection && !contactSection) return;
        
        const halfScreen = window.innerHeight / 2;

        if (contactSection && contactSection.getBoundingClientRect().top <= halfScreen) {
          currentSection = "/contact";
        } else if (workSection && workSection.getBoundingClientRect().top <= halfScreen) {
          currentSection = "/work";
        } else if (aboutSection && aboutSection.getBoundingClientRect().top <= halfScreen) {
          currentSection = "/about";
        }
        
        if (window.location.pathname !== currentSection) {
          window.history.replaceState(null, '', currentSection);
          
          // Dynamically update the browser tab title based on the active section for better UX
          const titleMap: Record<string, string> = {
            "/": "Natanael Alexander — Creative Digital Architect",
            "/about": "About | Natanael Alexander",
            "/work": "Selected Work | Natanael Alexander",
            "/contact": "Contact | Natanael Alexander"
          };
          document.title = titleMap[currentSection] || "Natanael Alexander";
        }
      },
    });

    return () => {
      trigger.kill();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [pathname]);

  // Magnetic effect on each nav item
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    itemRefs.current.forEach((item) => {
      if (!item) return;

      const strength = 0.4;

      const onMouseMove = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        gsap.to(item, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
      };

      const onMouseLeave = () => {
        gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
      };

      item.addEventListener("mousemove", onMouseMove);
      item.addEventListener("mouseleave", onMouseLeave);
      cleanups.push(() => {
        item.removeEventListener("mousemove", onMouseMove);
        item.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return pathname.startsWith("/portfolio") ? null : (
    <nav
      ref={pillRef}
      className="nav-pill"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item, i) => (
        <a
          key={item.href}
          href={item.href}
          ref={(el) => {
            if (el) itemRefs.current[i] = el;
          }}
          className="nav-pill__item"
          id={`nav-${item.label.toLowerCase()}`}
          onClick={(e) => {
            e.preventDefault();
            
            // @ts-ignore
            const lenis = (window as any).lenis;
            
            // Update URL hash without jumping
            if (window.history.pushState) {
              window.history.pushState(null, '', item.href);
            }

            // Cinematic ease in-out cubic
            const cinematicEase = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const scrollConfig = { duration: 2.5, easing: cinematicEase };

            if (item.href === "/") {
              if (lenis) lenis.scrollTo(0, scrollConfig);
              else window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }

            if (item.href === "/about") {
              const aboutTrigger = ScrollTrigger.getById("about-scroll");
              if (aboutTrigger) {
                // Target Y = Start of pin + window.innerHeight (shrinking distance) + window.innerWidth (slide panel 1 in)
                const targetY = aboutTrigger.start + window.innerHeight + window.innerWidth;
                if (lenis) lenis.scrollTo(targetY, scrollConfig);
                else window.scrollTo({ top: targetY, behavior: 'smooth' });
                return;
              }
            }

            const targetId = item.href.replace('/', '');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              if (lenis) {
                lenis.scrollTo(targetEl, scrollConfig);
              } else {
                targetEl.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        >
          <span className="nav-pill__item-bg" aria-hidden="true" />
          {item.label}
        </a>
      ))}
    </nav>
  );
}
