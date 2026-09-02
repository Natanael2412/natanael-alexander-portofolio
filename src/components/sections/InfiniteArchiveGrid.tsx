"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { Project } from "@/lib/supabase";

export default function InfiniteArchiveGrid({ projects = [] }: { projects: Project[] }) {
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

  // Provide a massive number of clones for a practically infinite scroll experience
  const minItemsRequired = 40; 
  let displayProjects = [...filteredProjects];
  if (displayProjects.length > 0) {
    while (displayProjects.length < minItemsRequired) {
      displayProjects = [...displayProjects, ...filteredProjects];
    }
  }

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;
    if (isMobile) return; // Skip on mobile

    // Force scroll to top before ScrollTrigger calculates positions
    window.scrollTo(0, 0);

    const cards = gsap.utils.toArray('.archive-card') as HTMLElement[];
    if (cards.length === 0) return;

    const trackWidth = cards.length * 30 * (window.innerWidth / 100);
    const scrollDistance = trackWidth;
    
    gsap.to(trackRef.current, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${scrollDistance * 1.5}`,
        pin: true,
        scrub: 1,
        onUpdate: () => {
          const screenWidth = window.innerWidth;
          let activeIndex = -1;
          let minDistance = Infinity;
          
          const minHeight = 35;
          const maxHeight = 95;
          
          cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            
            let progress = rect.left / screenWidth;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            const easeProgress = gsap.parseEase("expo.in")(progress);
            
            const currentHeight = minHeight + (maxHeight - minHeight) * easeProgress;
            
            const focalPoint = screenWidth * 0.6;
            const dist = Math.abs(rect.left - focalPoint);
            
            if (dist < minDistance) {
              minDistance = dist;
              activeIndex = index;
            }
            
            (card as any)._targetHeight = currentHeight;
          });
          
          cards.forEach((card, index) => {
            const isActive = index === activeIndex;
            const height = (card as any)._targetHeight;
            
            gsap.set(card, {
              height: `${height}vh`,
              width: `${height * 1.777}vh`,
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
    
    // Refresh ScrollTrigger to ensure pin spacer is calculated correctly after DOM update
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

  }, { dependencies: [activeYear, isMobile], scope: containerRef });

  // Mobile: 2-column grid layout
  if (isMobile) {
    return (
      <section className="relative w-full min-h-screen bg-[#f5f5f5]">
        {/* Header */}
        <div className="w-full p-6 pt-16 flex justify-between items-start">
          <Link href="/" className="font-montserrat text-xs tracking-widest uppercase text-black hover:opacity-50 transition-opacity">
            ← Back
          </Link>
          <div className="flex flex-col items-end gap-2">
            <span className="font-montserrat text-xs tracking-[0.2em] uppercase text-black/50 mb-1">Filter</span>
            <div className="flex gap-3 flex-wrap justify-end">
              {YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setActiveYear(year);
                  }}
                  className={`font-montserrat text-xs font-bold tracking-widest uppercase transition-all duration-300 ${activeYear === year ? 'opacity-100 underline underline-offset-4' : 'opacity-30'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="px-6 pb-8">
          <h1 className="font-playfair text-[18vw] font-black leading-[0.85] uppercase tracking-tighter text-black">
            PROJECT<br />ARCHIVE
          </h1>
          <p className="mt-4 font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-black/60">
            A collection of digital experiences, branding, and visual productions.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="px-4 pb-16 grid grid-cols-2 gap-3">
          {filteredProjects.map((project, idx) => (
            <div
              key={`mobile-${project.slug}-${idx}`}
              className="relative overflow-hidden bg-black aspect-[4/5]"
            >
              {project.hero_image_url?.endsWith(".mp4") || project.hero_image_url?.endsWith(".webm") ? (
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
                  src={project.hero_image_url || "/images/work/AC.webp"}
                  alt={project.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="font-playfair text-base text-white font-black uppercase tracking-tighter leading-tight">{project.title}</h3>
                <p className="font-montserrat text-[10px] font-bold text-white/70 tracking-[0.15em] uppercase mt-1">{project.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <div key={activeYear}>
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

        {/* Huge Left Typography (Crafting Culture Style) */}
        <div className="absolute left-8 md:left-12 top-24 md:top-32 z-40 pointer-events-none mix-blend-difference text-white">
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
                  {project.hero_image_url?.endsWith(".mp4") || project.hero_image_url?.endsWith(".webm") ? (
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
                      src={project.hero_image_url || "/images/work/AC.webp"}
                      alt={project.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 30vw"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 [.is-active_&]:opacity-100" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 translate-y-4 transition-all duration-500 [.is-active_&]:opacity-100 [.is-active_&]:translate-y-0">
                    <h3 className="font-playfair text-3xl md:text-5xl text-white font-black uppercase tracking-tighter">{project.title}</h3>
                    <p className="font-montserrat text-xs md:text-sm font-bold text-white/80 tracking-[0.2em] uppercase mt-2">{project.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
