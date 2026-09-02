"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

// Dummy data built from existing 3 projects duplicated to create a long list
const BASE_PROJECTS = [
  {
    slug: "ac",
    title: "AC Production",
    tags: "Production · Visual",
    image: "/images/work/AC.webp",
    year: "2026",
  },
  {
    slug: "evory",
    title: "Evory",
    tags: "Branding · Design",
    image: "/images/work/evory.webp",
    year: "2026",
  },
  {
    slug: "tangwin",
    title: "Tangwin Cut Studio",
    tags: "Identity · Digital",
    image: "/images/work/tangwincutstudio.webp",
    year: "2025",
  },
];

// Generate 15 projects by duplicating the base projects
const PROJECTS = Array.from({ length: 15 }).map((_, i) => {
  const base = BASE_PROJECTS[i % BASE_PROJECTS.length];
  return {
    ...base,
    slug: `${base.slug}-${i}`,
  };
});

export default function GameSelectionCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use IntersectionObserver to determine which card is closest to the center
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.5,
      }
    );

    const cards = container.querySelectorAll(".game-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-[100vw] h-[100vh] bg-black overflow-hidden flex flex-col justify-center">
      {/* Top Navigation / Back Button */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50">
        <Link href="/" className="text-white opacity-50 hover:opacity-100 transition-opacity font-montserrat text-sm tracking-widest uppercase">
          ← Back to Main
        </Link>
      </div>

      {/* Header Info */}
      <div className="absolute top-12 right-12 z-50 text-right">
        <h1 className="text-white font-playfair text-3xl md:text-5xl font-bold italic mb-2">Selected Work</h1>
        <p className="text-white opacity-50 font-montserrat text-xs tracking-[0.3em] uppercase">Archive Collection</p>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto w-full px-[50vw] gap-4 md:gap-8 pb-12 snap-x snap-mandatory hide-scrollbar items-center"
        style={{ scrollBehavior: "smooth" }}
      >
        {PROJECTS.map((project, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={project.slug}
              data-index={index}
              className={`game-card group relative shrink-0 snap-center transition-all duration-700 ease-out cursor-pointer ${
                isActive 
                  ? "w-[75vw] md:w-[40vw] aspect-[3/4] md:aspect-[4/5] scale-100 hover:scale-[1.03] opacity-100 z-20 shadow-2xl ring-1 ring-white/20" 
                  : "w-[60vw] md:w-[30vw] aspect-[3/4] md:aspect-[4/5] scale-90 hover:scale-95 opacity-40 z-10 hover:opacity-70"
              }`}
              onClick={() => {
                // If clicked and not active, scroll it to center
                const card = document.querySelector(`[data-index="${index}"]`);
                if (card && containerRef.current) {
                  card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }
              }}
            >
              {/* Card Image */}
              <div className="w-full h-full relative overflow-hidden bg-neutral-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Gradient Overlay for Text - Hides on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent transition-opacity duration-500 group-hover:opacity-0 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent transition-opacity duration-500 group-hover:opacity-0 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* Text Content (Inside Image, bottom left) - Hides on Hover, explicit inset positioning for guaranteed spacing */}
                <div className={`absolute inset-x-6 bottom-6 md:inset-x-12 md:bottom-12 flex justify-between items-end transition-opacity duration-500 pointer-events-none group-hover:opacity-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  <div>
                    <h3 className="font-playfair text-3xl md:text-5xl font-black text-black leading-none mb-1 md:mb-2 tracking-tighter uppercase">{project.title}</h3>
                    <p className="font-montserrat text-xs md:text-sm font-bold text-black/60 tracking-[0.2em] uppercase">{project.tags}</p>
                  </div>
                  <div className="text-black font-playfair font-black text-xl md:text-2xl opacity-50">
                    {project.year}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
