"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Dummy data built from existing 3 projects duplicated
const BASE_PROJECTS = [
  {
    slug: "ac",
    title: "AC Production",
    tags: "Production · Visual",
    image: "/images/work/AC.png",
    year: "2026",
  },
  {
    slug: "evory",
    title: "Evory",
    tags: "Branding · Design",
    image: "/images/work/evory.png",
    year: "2026",
  },
  {
    slug: "tangwin",
    title: "Tangwin Cut Studio",
    tags: "Identity · Digital",
    image: "/images/work/tangwincutstudio.png",
    year: "2025",
  },
];

// Generate more projects for volume
const ALL_PROJECTS = Array.from({ length: 12 }).map((_, i) => {
  const base = BASE_PROJECTS[i % BASE_PROJECTS.length];
  return {
    ...base,
    slug: `${base.slug}-${i}`,
    // Randomize some years for filter testing if needed, but let's stick to base years
  };
});

const YEARS = ["ALL", ...Array.from(new Set(ALL_PROJECTS.map(p => p.year)))].sort((a, b) => b.localeCompare(a));

export default function InfiniteArchiveGrid() {
  const [activeYear, setActiveYear] = useState("ALL");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeYear === "ALL" 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.year === activeYear);

  // Provide a massive number of clones for a practically infinite scroll experience
  const minItemsRequired = 40; 
  let displayProjects = [...filteredProjects];
  while (displayProjects.length < minItemsRequired) {
    displayProjects = [...displayProjects, ...filteredProjects];
  }

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    const cards = gsap.utils.toArray('.archive-card') as HTMLElement[];
    
    // We will animate the track's X position.
    // Staircase Dimensions
    const ctx = gsap.context(() => {
      const minWidth = 12; // vw (Left side)
      const maxWidth = 45; // vw (Right side)
      const minHeight = 35; // vh
      const maxHeight = 85; // vh
      
      const trackWidth = cards.length * 30 * (window.innerWidth / 100); // Approximate average width
      const scrollDistance = trackWidth; // We scroll a long distance
      
      gsap.to(trackRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${scrollDistance * 1.5}`, // Slower scroll speed
          pin: true,
          scrub: 1, // Smooth scrub
          onUpdate: () => {
            const screenWidth = window.innerWidth;
            let activeIndex = -1;
            let minDistance = Infinity;
            
            // We only need to animate height. Width will be calculated to maintain 4:3 landscape ratio.
            const minHeight = 35; // vh (Left side)
            const maxHeight = 95; // vh (Right side)
            
            // First pass: Calculate sizes and determine which single card is closest to the focal point
            cards.forEach((card, index) => {
              const rect = card.getBoundingClientRect();
              
              let progress = rect.left / screenWidth;
              if (progress < 0) progress = 0;
              if (progress > 1) progress = 1;
              const easeProgress = gsap.parseEase("expo.in")(progress);
              
              const currentHeight = minHeight + (maxHeight - minHeight) * easeProgress;
              
              // The focal point for the "active" card is around 60% of the screen width from the left
              const focalPoint = screenWidth * 0.6;
              const dist = Math.abs(rect.left - focalPoint);
              
              if (dist < minDistance) {
                minDistance = dist;
                activeIndex = index;
              }
              
              // Store dimensions temporarily on the element
              (card as any)._targetHeight = currentHeight;
            });
            
            // Second pass: Apply styles with explicit highlight for only ONE card
            cards.forEach((card, index) => {
              const isActive = index === activeIndex;
              const height = (card as any)._targetHeight;
              
              gsap.set(card, {
                height: `${height}vh`,
                width: `${height * 1.777}vh`, // 16:9 Ultra-Wide Landscape Ratio
                // Explicitly highlight only the active card, others are slightly dimmed but still visible
                filter: `brightness(${isActive ? 1 : 0.6})`
              });
              
              if (isActive) {
                card.classList.add('is-active');
              } else {
                card.classList.remove('is-active');
              }
            });
          }
        }
      });
      
      // Force initial update so they render correctly before scroll
      ScrollTrigger.refresh();
      
    }, containerRef);

    return () => ctx.revert();
  }, [activeYear]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#f5f5f5] overflow-hidden">
      
      {/* Navbar & Filter */}
      <div className="absolute top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-difference text-white">
        <Link href="/" className="font-montserrat text-sm tracking-widest uppercase hover:opacity-50 transition-opacity pointer-events-auto">
          ← Back
        </Link>

        {/* Year Filter */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <span className="opacity-50 font-montserrat text-xs tracking-[0.2em] uppercase mb-2">Filter by Year</span>
          <div className="flex gap-4">
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`font-montserrat text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group ${activeYear === year ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
              >
                {year}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 ${activeYear === year ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Huge Left Typography (Crafting Culture Style) */}
      <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-40 pointer-events-none mix-blend-difference text-white">
        <h1 className="font-playfair text-[12vw] md:text-[8vw] font-black leading-[0.8] uppercase tracking-tighter">
          PROJECT<br />ARCHIVE
        </h1>
        <p className="mt-8 max-w-sm font-montserrat text-xs md:text-sm font-bold tracking-[0.2em] uppercase leading-relaxed opacity-80">
          A collection of digital experiences, branding, and visual productions.
        </p>
      </div>

      {/* Scroll-Driven Dynamic Track */}
      {/* We align items to the bottom, gap-0 for no spacing */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center md:items-end md:pb-[10vh] pointer-events-none">
        <div ref={trackRef} className="flex items-end gap-0 w-max h-full pointer-events-auto border-b border-black">
          {displayProjects.map((project, idx) => {
            return (
              <div 
                key={`track-${project.slug}-${idx}`} 
                className={`archive-card shrink-0 group relative overflow-hidden bg-black cursor-pointer will-change-[width,height]`}
                style={{ width: "25vw", height: "40vh" }} // Initial small state
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 [.is-active_&]:opacity-100" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 translate-y-4 transition-all duration-500 [.is-active_&]:opacity-100 [.is-active_&]:translate-y-0">
                  <h3 className="font-playfair text-3xl md:text-5xl text-white font-black uppercase tracking-tighter">{project.title}</h3>
                  <p className="font-montserrat text-xs md:text-sm font-bold text-white/80 tracking-[0.2em] uppercase mt-2">{project.tags}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
