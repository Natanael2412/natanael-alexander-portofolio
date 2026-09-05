"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

import { useRouter } from "next/navigation";
import { Project } from "@/lib/supabase";

export default function InfiniteArchiveGrid({ projects = [] }: { projects: Project[] }) {
  const router = useRouter();
  const YEARS = ["ALL", ...Array.from(new Set(projects.map(p => String(p.year))))].sort((a, b) => b.localeCompare(a));
  
  const [activeYear, setActiveYear] = useState("ALL");
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const filteredProjects = activeYear === "ALL" 
    ? projects 
    : projects.filter(p => String(p.year) === activeYear);

  // Render exactly 2 identical sets to allow seamless GSAP virtual scroll wrapping
  const minItemsRequired = 8; 
  let BaseSet = [...filteredProjects];
  if (BaseSet.length > 0) {
    while (BaseSet.length < minItemsRequired) {
      BaseSet = [...BaseSet, ...filteredProjects];
    }
  }
  const displayProjects = [...BaseSet, ...BaseSet];

  // --- TRUE INFINITE VIRTUAL SCROLL (LENIS + ABSOLUTE POSITIONING) ---
  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;
    if (isMobile) return; // Skip on mobile

    const cards = gsap.utils.toArray('.archive-card') as HTMLElement[];
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
      const trackWidth = screenWidth * 0.55;
      
      const minHeight = 45;
      const maxHeight = 95;
      const textRightEdge = 0; // Relative to the 55% container
      const focalPoint = trackWidth * 0.5; // Center of the right container
      
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
        
        let progress = (x - textRightEdge) / (trackWidth - textRightEdge);
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

  }, { dependencies: [activeYear, isMobile], scope: containerRef });

  // --- MOBILE VIRTUAL SCROLL (DIAGONAL STACKING) ---
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!isMobile || !mobileContainerRef.current) return;

    const cards = gsap.utils.toArray('.mobile-archive-card') as HTMLElement[];
    if (cards.length === 0) return;

    cards.forEach((card, i) => {
      // Stacking effect
      ScrollTrigger.create({
        trigger: card,
        start: "top 25%", // Pin when it reaches 25% from top
        endTrigger: ".mobile-end-trigger", // Unpin when the whole section ends
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });

      // Diagonal Entrance
      gsap.from(card, {
        x: window.innerWidth * 0.5, // Slide from right
        y: window.innerHeight * 0.2, // and bottom
        opacity: 0,
        rotation: 5,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "top 25%", // Finishes animation right when it pins
          scrub: 1,
        }
      });
      
      // When NEXT card comes in, scale this one down slightly
      if (i < cards.length - 1) {
        gsap.to(card, {
          scale: 0.9,
          filter: 'brightness(0.5)',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top 80%",
            end: "top 25%",
            scrub: true,
          }
        });
      }
    });
  }, { dependencies: [activeYear, isMobile], scope: mobileContainerRef });

  // Render both Mobile and Desktop and use CSS to toggle visibility to prevent hydration mismatch!
  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE LAYOUT */}
      {/* ============================================================== */}
      <section ref={mobileContainerRef} className="relative w-full min-h-screen bg-[#f5f5f5] pb-32 overflow-hidden lg:hidden flex flex-col">
        {/* Header - Now Top Left */}
        <div className="w-full p-6 pt-16 flex flex-col items-start sticky top-0 z-50 bg-[#f5f5f5]/90 backdrop-blur-md">
          <button onClick={() => router.push('/')} className="font-montserrat text-xs tracking-widest uppercase text-black hover:opacity-50 transition-opacity mb-6">
            ← Back
          </button>
          
          <h1 className="font-playfair text-[12vw] font-black leading-[0.85] uppercase tracking-tighter text-black">
            PROJECT<br />ARCHIVE
          </h1>
          <p className="mt-4 font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-black/60 max-w-[80%]">
            A collection of digital experiences, branding, and visual productions.
          </p>

          <div className="mt-8 flex gap-3 flex-wrap">
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => {
                  window.scrollTo(0, 0);
                  setActiveYear(year);
                }}
                className={`font-montserrat text-[10px] font-bold tracking-widest uppercase transition-all duration-300 px-3 py-1 border border-black/20 rounded-full ${activeYear === year ? 'bg-black text-white' : 'text-black opacity-60'}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Diagonal Stack Grid */}
        <div className="px-6 pt-12 pb-[50vh] flex flex-col gap-[30vh]">
          {filteredProjects.map((project, idx) => (
            <Link
              href={`/portfolio/${project.slug}`}
              key={`mobile-${project.slug}-${idx}`}
              className="mobile-archive-card relative w-full overflow-hidden bg-black aspect-[3/4] shadow-2xl rounded-sm will-change-transform"
              style={{ transformOrigin: "bottom left" }}
            >
              {project.hero_image_url ? (
                project.hero_image_url.endsWith(".mp4") || project.hero_image_url.endsWith(".webm") ? (
                  <video
                    src={project.hero_image_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover object-center w-full h-full absolute inset-0"
                  />
                ) : (
                  <Image
                    src={project.hero_image_url}
                    alt={project.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw"
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                  <span className="text-white/10 font-playfair font-black text-6xl uppercase tracking-tighter">
                    {project.title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="font-playfair text-3xl text-white font-black uppercase tracking-tighter">{project.title}</h3>
                <p className="font-montserrat text-[10px] font-bold text-white/80 tracking-[0.2em] uppercase mt-1">{project.role}</p>
                <div className="text-white/60 font-playfair text-lg font-bold mt-2">{project.year}</div>
              </div>
            </Link>
          ))}
          <div className="mobile-end-trigger w-full h-10" />
        </div>
      </section>

      {/* ============================================================== */}
      {/* DESKTOP LAYOUT */}
      {/* ============================================================== */}
      <div key={activeYear} className="hidden lg:block">
        {/* Huge invisible scroll area to power native Lenis scroll */}
        <div style={{ height: "50000px" }} />
        
        <section ref={containerRef} className="fixed top-0 left-0 w-full h-screen bg-[#f5f5f5] overflow-hidden">
        
        {/* Navbar & Filter */}
        <div className="absolute top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-difference text-white">
          <button onClick={() => router.push('/')} className="font-montserrat text-sm tracking-widest uppercase hover:opacity-50 transition-opacity pointer-events-auto">
            ← Back
          </button>

          {/* Year Filter */}
          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            <span className="opacity-50 font-montserrat text-xs tracking-[0.2em] uppercase mb-2">Filter by Year</span>
            <div className="flex gap-4">
              {YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setActiveYear(year);
                  }}
                  className={`font-montserrat text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group ${activeYear === year ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                >
                  {year}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 ${activeYear === year ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Huge Left Typography (Fixed on Left) */}
        <div className="absolute left-8 md:left-12 top-24 md:top-32 w-[40%] z-40 text-black">
          <h1 className="font-playfair text-[12vw] md:text-[7vw] font-black leading-[0.8] uppercase tracking-tighter">
            PROJECT<br />ARCHIVE
          </h1>
          <p className="mt-8 max-w-sm font-montserrat text-xs md:text-sm font-bold tracking-[0.2em] uppercase leading-relaxed opacity-80">
            A collection of digital experiences, branding, and visual productions.
          </p>
        </div>

        {/* Scroll-Driven Dynamic Track (Right 55% of Screen) */}
        <div className="absolute top-0 right-0 w-[55%] h-full flex items-center md:items-end md:pb-[10vh] pointer-events-none overflow-hidden">
          <div ref={trackRef} className="relative w-full h-full pointer-events-auto border-b border-black">
            {displayProjects.map((project, idx) => {
              return (
                <Link 
                  href={`/portfolio/${project.slug}`}
                  key={`track-${project.slug}-${idx}`} 
                  className={`archive-card block group absolute bottom-0 left-0 overflow-hidden bg-black cursor-pointer will-change-[width,height,transform]`}
                  style={{ width: "25vw", height: "40vh" }} // Initial small state
                >
                  {project.hero_image_url ? (
                    project.hero_image_url.endsWith(".mp4") || project.hero_image_url.endsWith(".webm") ? (
                      <video
                        src={project.hero_image_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-cover object-center w-full h-full absolute inset-0"
                      />
                    ) : (
                      <Image
                        src={project.hero_image_url}
                        alt={project.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 50vw, 30vw"
                      />
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
              );
            })}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
