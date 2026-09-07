"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PAD_LEFT = "clamp(1.5rem, 5vw, 6rem)";

export default function InfiniteArchiveGrid({ projects = [] }: { projects: Project[] }) {
  const router = useRouter();
  const YEARS = ["ALL", ...Array.from(new Set(projects.map(p => String(p.year))))].sort((a, b) => b.localeCompare(a));
  
  const [activeYear, setActiveYear] = useState("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeYear === "ALL" 
    ? projects 
    : projects.filter(p => String(p.year) === activeYear);

  // Render exactly 2 identical sets to allow seamless GSAP virtual scroll wrapping for desktop
  const minItemsRequired = 8; 
  let BaseSet = [...filteredProjects];
  if (BaseSet.length > 0) {
    while (BaseSet.length < minItemsRequired) {
      BaseSet = [...BaseSet, ...filteredProjects];
    }
  }
  const displayProjects = [...BaseSet, ...BaseSet];

  // GSAP Virtual Infinite Scroll ONLY on Desktop
  useGSAP(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop || !containerRef.current || !trackRef.current) return;

    const cards = gsap.utils.toArray('.desktop-card') as HTMLElement[];
    if (cards.length === 0) return;

    // Logical array to track order for infinite loop
    let logicalCards = [...cards];
    
    let currentScroll = 0;
    let autoScrollOffset = 0;
    let isIdle = true;
    let idleTimer: NodeJS.Timeout;

    const resetIdle = () => {
      isIdle = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { isIdle = true; }, 2000);
    };

    // Center the scrollbar initially to allow scrolling up and down
    window.scrollTo(0, 25000);

    const handleScroll = () => {
      resetIdle();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    resetIdle();

    const ticker = () => {
      const lenis = (window as any).lenis;
      
      if (isIdle) {
        // Auto-scroll (marquee) effect preserved
        autoScrollOffset -= 1.5;
      }

      const scrollY = lenis ? lenis.scroll : window.scrollY;

      // Infinite Scrollbar Trick
      // If user scrolls too close to the edges of our 50,000px dummy div, we instantly reset them to the center
      // and adjust the autoScrollOffset so there's no visual jump in the UI!
      if (scrollY < 5000) {
        const diff = 25000 - scrollY;
        if (lenis) lenis.scrollTo(25000, { immediate: true });
        else window.scrollTo(0, 25000);
        autoScrollOffset -= diff;
      } else if (scrollY > 45000) {
        const diff = scrollY - 25000;
        if (lenis) lenis.scrollTo(25000, { immediate: true });
        else window.scrollTo(0, 25000);
        autoScrollOffset += diff;
      }

      // Calculate total virtual position
      // Scrolling down (increasing scrollY) moves track left (negative currentScroll)
      currentScroll = -scrollY + autoScrollOffset;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const minHeight = 45;
      const maxHeight = 95;
      const textRightEdge = screenWidth * 0.45;
      const focalPoint = screenWidth * 0.6;
      
      const minWidthPx = (minHeight * 1.777) * (screenHeight / 100);

      // --- WRAP LEFT (scrolling forward) ---
      // If the first card is completely off-screen left (x < -minWidthPx)
      while (currentScroll <= -minWidthPx) {
        currentScroll += minWidthPx;
        autoScrollOffset += minWidthPx; // adjust offset to match
        logicalCards.push(logicalCards.shift()!); // Move first card to end
      }
      
      // --- WRAP RIGHT (scrolling backward) ---
      // If currentScroll > 0, we need to bring a card from the back to the front
      while (currentScroll > 0) {
        currentScroll -= minWidthPx;
        autoScrollOffset -= minWidthPx;
        logicalCards.unshift(logicalCards.pop()!); // Move last card to front
      }
      
      let x = currentScroll;
      let activeIndex = -1;
      let minDistance = Infinity;

      // First pass: Calculate positions and sizes
      for (let i = 0; i < logicalCards.length; i++) {
        const card = logicalCards[i];
        
        let progress = (x - textRightEdge) / (screenWidth - textRightEdge);
        progress = Math.max(0, Math.min(1, progress));
        
        const heightVh = minHeight + (maxHeight - minHeight) * progress;
        const widthPx = (heightVh * 1.777) * (screenHeight / 100);
        
        // Active index calculation based on center of card
        const cardCenter = x + (widthPx / 2);
        const dist = Math.abs(cardCenter - focalPoint);
        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = i;
        }
        
        (card as any)._x = x;
        (card as any)._widthPx = widthPx;
        (card as any)._heightVh = heightVh;
        
        x += widthPx;
      }

      // Second pass: Apply styles via GSAP
      for (let i = 0; i < logicalCards.length; i++) {
        const card = logicalCards[i];
        const isActive = i === activeIndex;
        
        const cardX = (card as any)._x;
        const cardWidth = (card as any)._widthPx;
        const cardHeight = (card as any)._heightVh;
        
        gsap.set(card, {
          x: cardX,
          width: `${cardWidth}px`,
          height: `${cardHeight}vh`,
          zIndex: isActive ? 10 : 1,
          filter: `brightness(${isActive ? 1 : 0.6})`
        });
        
        if (isActive) card.classList.add('is-active');
        else card.classList.remove('is-active');
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      gsap.ticker.remove(ticker);
      clearTimeout(idleTimer);
    };

  }, { dependencies: [activeYear], scope: containerRef });

  return (
    <div key={activeYear} className="bg-[#111] min-h-screen text-white font-montserrat">
      
      {/* ── Fixed Header ────────────────────────────────────────────── */}
      <div 
        style={{ 
          position: "fixed", top: 0, left: 0, right: 0, 
          paddingLeft: PAD_LEFT, paddingRight: PAD_LEFT, paddingTop: "clamp(1.25rem, 3vh, 2.5rem)", 
          zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          pointerEvents: "none"
        }}
      >
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem", pointerEvents: "auto" }}>
          <ArrowRight size={16} className="rotate-180" /> BACK
        </button>

        <div className="flex flex-col items-end gap-2 pointer-events-auto mix-blend-difference">
          <span className="opacity-50 text-[10px] tracking-[0.2em] uppercase mb-1">Filter</span>
          <div className="flex gap-3 flex-wrap justify-end max-w-[60vw] lg:max-w-none">
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => {
                  window.scrollTo(0, 0);
                  setActiveYear(year);
                }}
                className={`text-[10px] lg:text-xs font-bold tracking-widest uppercase transition-all duration-300 relative group ${activeYear === year ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                {year}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${activeYear === year ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fixed Left Typography (Sama seperti ProjectClient.tsx) ──── */}
      <div style={{ position: "fixed", left: PAD_LEFT, top: "50%", transform: "translateY(-50%)", width: "100%", maxWidth: "500px", zIndex: 40, pointerEvents: "none" }} className="mix-blend-difference">
        <h1 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 0.85, margin: "0 0 1rem 0" }}>
          PROJECT<br />ARCHIVE
        </h1>
        <p style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)", letterSpacing: "0.2em", opacity: 0.7, textTransform: "uppercase", marginBottom: "3rem", maxWidth: "300px", fontWeight: "bold" }}>
          A collection of digital experiences, branding, and visual productions.
        </p>
      </div>

      {/* ── DESKTOP LAYOUT (Infinite Virtual Scroll) ────────────────── */}
      <div className="hidden lg:block">
        {/* Huge invisible scroll area to power native Lenis scroll */}
        <div style={{ height: "50000px" }} />
        
        <section ref={containerRef} className="fixed top-0 left-0 w-full h-screen overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full flex items-end pb-[10vh] pointer-events-none">
            <div ref={trackRef} className="relative w-full h-full pointer-events-auto border-b border-black">
              {displayProjects.map((project, idx) => (
                <Link 
                  href={`/portfolio/${project.slug}`}
                  key={`desktop-${project.slug}-${idx}`} 
                  className="desktop-card block group absolute bottom-0 left-0 overflow-hidden bg-black cursor-pointer will-change-[width,height,transform]"
                  style={{ width: "25vw", height: "40vh" }} // Initial small state
                >
                  {project.hero_image_url ? (
                    project.hero_image_url.endsWith(".mp4") || project.hero_image_url.endsWith(".webm") ? (
                      <video src={project.hero_image_url} autoPlay loop muted playsInline className="object-cover object-center w-full h-full absolute inset-0" />
                    ) : (
                      <Image src={project.hero_image_url} alt={project.title} fill className="object-cover object-center" sizes="(max-width: 1024px) 50vw, 30vw" />
                    )
                  ) : (
                    <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                      <span className="text-white/10 font-playfair font-black text-6xl md:text-8xl uppercase tracking-tighter">
                        {project.title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                  )}
                  
                  {/* Base dark overlay */}
                  <div className="absolute inset-0 bg-black/65 transition-colors duration-300 [.is-active_&]:bg-black/40" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 [.is-active_&]:opacity-100" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 translate-y-4 transition-all duration-500 [.is-active_&]:opacity-100 [.is-active_&]:translate-y-0">
                    <h3 className="font-playfair text-3xl md:text-5xl text-white font-black uppercase tracking-tighter">{project.title}</h3>
                    <p className="font-montserrat text-xs md:text-sm font-bold text-white/80 tracking-[0.2em] uppercase mt-2">{project.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── MOBILE / TABLET LAYOUT (Vertical Scroll) ────────────────── */}
      <section className="block lg:hidden relative w-full pt-[80vh] pb-24 z-10 pointer-events-auto bg-[#111]">
        <div className="px-4 grid grid-cols-2 gap-3">
          {filteredProjects.map((project, idx) => (
            <Link
              href={`/portfolio/${project.slug}`}
              key={`mobile-${project.slug}-${idx}`}
              className="relative block overflow-hidden bg-[#222] aspect-[4/5] group"
            >
              {project.hero_image_url ? (
                project.hero_image_url.endsWith(".mp4") || project.hero_image_url.endsWith(".webm") ? (
                  <video src={project.hero_image_url} autoPlay loop muted playsInline className="object-cover object-center w-full h-full absolute inset-0" />
                ) : (
                  <Image src={project.hero_image_url} alt={project.title} fill className="object-cover object-center" sizes="50vw" />
                )
              ) : (
                <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                  <span className="text-white/10 font-playfair font-black text-6xl uppercase tracking-tighter">
                    {project.title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="font-playfair text-sm sm:text-base text-white font-black uppercase tracking-tighter leading-tight line-clamp-3">{project.title}</h3>
                <p className="font-montserrat text-[9px] sm:text-[10px] font-bold text-white/70 tracking-[0.1em] uppercase mt-1 line-clamp-1">{project.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
