"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { Project } from "@/lib/supabase";

export default function SelectedWork({ projects = [] }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Cinematic exit transition
    gsap.to(".work-section", {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        router.push("/work");
      }
    });
  };

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray(".work-card") as HTMLElement[];
        const wrapper = document.querySelector(".cards-wrapper");
        
        if (!wrapper || cards.length === 0) return;

        const ctx = gsap.context(() => {
          const updateCards = () => {
            const viewportCenter = window.innerHeight / 2;
            
            cards.forEach(card => {
              const rect = (card as HTMLElement).getBoundingClientRect();
              const cardCenter = rect.top + rect.height / 2;
              const distFromCenter = Math.abs(viewportCenter - cardCenter);
              
              const maxDist = window.innerHeight * 0.5;
              let progress = 1 - (distFromCenter / maxDist);
              if (progress < 0) progress = 0;
              
              const minScale = 0.75;
              const currentScale = minScale + (1 - minScale) * progress;
              
              gsap.set(card, {
                scale: currentScale,
                filter: `brightness(${0.3 + progress * 0.7})`,
                opacity: 0.5 + progress * 0.5
              });
              
              if (progress > 0.8) {
                card.classList.add('is-active');
              } else {
                card.classList.remove('is-active');
              }
            });
          };

          gsap.set(cards[0], { scale: 1, filter: 'brightness(1)', opacity: 1 });
          cards[0].classList.add('is-active');
          
          for (let i = 1; i < cards.length; i++) {
            gsap.set(cards[i], { scale: 0.75, filter: 'brightness(0.3)', opacity: 0.5 });
            cards[i].classList.remove('is-active');
          }

          gsap.to(".cards-wrapper", {
            y: () => {
              const cardHeight = (cards[0] as HTMLElement).offsetHeight;
              const gap = window.innerHeight * 0.02;
              const step = cardHeight + gap;
              return -(step * (cards.length - 1));
            },
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.5}`,
              pin: true,
              scrub: 1,
              onUpdate: updateCards
            },
          });
          
          ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="work-section w-full h-screen bg-[var(--paper)] flex relative overflow-hidden"
      id="work"
      aria-label="Selected work"
    >
      {/* LEFT: Static Title Area — hidden on mobile, shown inline above carousel */}
      <div className="hidden lg:flex w-full lg:w-[45%] h-full flex-col justify-center px-8 lg:px-20 relative z-20 pointer-events-none" ref={titleLeftRef}>
        <h2 className="work-section__title pointer-events-auto">
          SELECTED
          <br />
          <em style={{ fontStyle: "italic" }}>WORK</em>
        </h2>
        
        <Link 
          href="/portofolio"
          className="mt-8 lg:mt-12 group flex flex-col w-max pointer-events-auto"
        >
          <div className="flex items-center gap-2 font-montserrat text-sm lg:text-base tracking-[0.2em] uppercase font-bold text-black pointer-events-auto">
            VIEW FULL ARCHIVE 
            <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
          </div>
          <span className="mt-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full self-start"></span>
        </Link>
      </div>

      {/* MOBILE: Title block stacked above the carousel */}
      <div className="lg:hidden absolute top-0 left-0 w-full z-20 pointer-events-none pt-10 px-6">
        <h2 className="work-section__title pointer-events-auto">
          SELECTED <em style={{ fontStyle: "italic" }}>WORK</em>
        </h2>
        <Link 
          href="/portofolio"
          className="mt-4 group inline-flex flex-col w-max pointer-events-auto"
        >
          <div className="flex items-center gap-2 font-montserrat text-xs tracking-[0.2em] uppercase font-bold text-black">
            VIEW FULL ARCHIVE 
            <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
          </div>
          <span className="mt-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full self-start"></span>
        </Link>
      </div>

      {/* RIGHT: Vertical Snapping Carousel (desktop) / Peek Carousel (mobile) */}
      <div className="w-full lg:w-[55%] h-full absolute right-0 top-0 pointer-events-none lg:pr-[4vw]">
        {/* Desktop: vertical carousel */}
        <div className="cards-wrapper hidden lg:flex w-full absolute top-[20vh] flex-col gap-[2vh] items-center pointer-events-auto">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="work-card group relative w-[80%] lg:w-[80%] h-[60vh] shrink-0 z-10 shadow-2xl will-change-transform"
              role="listitem"
              id={`work-card-desktop-${project.slug}`}
              tabIndex={0}
              aria-label={`Project: ${project.title}`}
            >
              <div className="w-full h-full relative overflow-hidden bg-black">
                {project.hero_image_url?.endsWith(".mp4") || project.hero_image_url?.endsWith(".webm") ? (
                  <video
                    src={project.hero_image_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="work-card__image object-cover w-full h-full absolute inset-0"
                  />
                ) : (
                  <Image
                    src={project.hero_image_url || "/images/work/AC.webp"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="work-card__image object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 [.is-active_&]:opacity-100" />
                <div className="absolute inset-x-6 bottom-6 lg:inset-x-12 lg:bottom-12 flex justify-between items-end opacity-0 translate-y-4 transition-all duration-500 [.is-active_&]:opacity-100 [.is-active_&]:translate-y-0 pointer-events-none">
                  <div>
                    <h3 className="font-playfair text-2xl lg:text-5xl font-black text-white leading-none mb-1 lg:mb-2 tracking-tighter uppercase">{project.title}</h3>
                    <p className="font-montserrat text-xs lg:text-sm font-bold text-white/80 tracking-[0.2em] uppercase">{project.role}</p>
                  </div>
                  <div className="text-white font-playfair font-black text-lg lg:text-2xl opacity-60">
                    {project.year}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile: 3-card peek carousel — center card prominent, sides clipped */}
        <div
          className="lg:hidden absolute inset-0 flex items-center overflow-hidden pointer-events-auto"
          style={{ paddingTop: '140px' }}
        >
          <div
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory w-full h-full items-center"
            style={{
              scrollbarWidth: 'none',
              paddingLeft: 'calc(50% - 42vw)', // center first card
              paddingRight: 'calc(50% - 42vw)',
            }}
          >
            {projects.map((project) => (
              <article
                key={`mobile-${project.slug}`}
                className="snap-center shrink-0 relative rounded-sm overflow-hidden shadow-xl"
                style={{ width: '84vw', height: '56vw' }}
                role="listitem"
                id={`work-card-mobile-${project.slug}`}
                aria-label={`Project: ${project.title}`}
              >
                {project.hero_image_url?.endsWith(".mp4") || project.hero_image_url?.endsWith(".webm") ? (
                  <video
                    src={project.hero_image_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <Image
                    src={project.hero_image_url || "/images/work/AC.webp"}
                    alt={project.title}
                    fill
                    sizes="90vw"
                    className="object-cover"
                  />
                )}
                {/* Always-visible overlay on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex justify-between items-end">
                  <div>
                    <h3 className="font-playfair text-xl font-black text-white leading-none mb-1 tracking-tighter uppercase">{project.title}</h3>
                    <p className="font-montserrat text-[0.6rem] font-bold text-white/70 tracking-[0.2em] uppercase">{project.role}</p>
                  </div>
                  <div className="text-white font-playfair font-black text-base opacity-60">
                    {project.year}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
