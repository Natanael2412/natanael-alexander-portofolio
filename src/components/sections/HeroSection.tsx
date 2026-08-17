"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef       = useRef<HTMLDivElement>(null);
  const overlayRef       = useRef<HTMLDivElement>(null);
  const nameLeftRef      = useRef<HTMLSpanElement>(null);
  const nameRightRef     = useRef<HTMLSpanElement>(null);
  const taglineRef       = useRef<HTMLParagraphElement>(null);
  const scrollHintRef    = useRef<HTMLDivElement>(null);
  const indexRef         = useRef<HTMLSpanElement>(null);
  
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const imgRef           = useRef<HTMLImageElement>(null);
  
  // About Section Refs
  const aboutWrapperRef  = useRef<HTMLDivElement>(null);
  const panelsRef        = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current || !overlayRef.current || !aboutWrapperRef.current) return;

      const ctx = gsap.context(() => {
        // Entrance animation
        const tl = gsap.timeline({ delay: 0.4 }); // Dipangkas dari 2.6 detik menjadi 0.4 detik
        tl.fromTo(
          sectionRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: "expo.out" }
        )
          .fromTo(
            indexRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
            "-=0.6"
          )
          .fromTo(
            taglineRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
            "-=0.6"
          )
          .fromTo(
            scrollHintRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            "-=0.4"
          );

        // Scroll animation 1: Hero transparency
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            const bgAlpha = 1 - p;
            if (overlayRef.current) {
               overlayRef.current.style.backgroundColor = `rgba(255, 255, 255, ${bgAlpha})`;
            }
            const textVal = Math.round(p * 255);
            const textColor = `rgb(${textVal}, ${textVal}, ${textVal})`;
            if (nameLeftRef.current) nameLeftRef.current.style.color = textColor;
            if (nameRightRef.current) nameRightRef.current.style.color = textColor;
            const labelVal = Math.round(60 + (p * 195)); 
            const labelColor = `rgb(${labelVal}, ${labelVal}, ${labelVal})`;
            if (indexRef.current) indexRef.current.style.color = labelColor;
            if (taglineRef.current) taglineRef.current.style.color = labelColor;
            if (scrollHintRef.current) {
              scrollHintRef.current.style.color = labelColor;
              const line = scrollHintRef.current.querySelector(".hero__scroll-line") as HTMLElement | null;
              if (line) line.style.backgroundColor = labelColor;
            }
          },
        });

        // Mimic native scroll for the image inside the sticky container
        gsap.to(imgRef.current, {
          y: () => {
            if (!imgRef.current) return 0;
            const overflow = imgRef.current.offsetHeight - window.innerHeight;
            // Scroll down to 80% of the image (leaves a bit more of the bottom hidden)
            return overflow > 0 ? -(overflow * 0.8) : 0;
          },
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          }
        });

        // Scroll animation 2: Shrink Photo to Frame & About Section Horizontal Scroll
        const panels = panelsRef.current.filter(Boolean);
        
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            id: "about-scroll",
            trigger: sectionRef.current,
            start: "bottom bottom", // Trigger exactly when the bottom of the photo hits the bottom of the viewport
            pin: true, // Pin the entire Hero section
            scrub: true,
            snap: {
              // Menghitung persis posisi snap setiap panel 
              // (0 = Start, lalu 1/3, 5/9, 7/9, 1 untuk 4 panel) -> karena skrg 2 panel, biarkan GSAP menghitung
              snapTo: [0, ...panels.map((_, i) => (0.5 + i + 1) / (0.5 + panels.length))],
              duration: { min: 1.0, max: 1.8 }, // Dibuat sangat lambat dan halus
              delay: 0, 
              ease: "power3.inOut" // Easing super smooth
            },
            end: () => `+=${window.innerWidth * panels.length}`,
          },
        });

        // Phase A: Shrink the photo into a frame
        gsap.set(photoContainerRef.current, { clipPath: "inset(0% 0%)" });
        scrollTl.fromTo(
          photoContainerRef.current,
          { clipPath: "inset(0% 0%)" },
          {
            clipPath: "inset(4vh 4vw)", // smaller frame without rounded edges
            ease: "power2.inOut",
            duration: window.innerWidth * 0.5,
          },
          0
        );

        // Fade out text overlay
        scrollTl.to(
          overlayRef.current,
          {
            opacity: 0,
            duration: window.innerWidth * 0.25,
            ease: "power2.in",
          },
          window.innerWidth * 0.25
        );

        // Phase B: Move about wrapper
        scrollTl.to(aboutWrapperRef.current, {
          xPercent: -100, // Move the entire wrapper left
          ease: "none",
          duration: window.innerWidth * panels.length,
        }, window.innerWidth * 0.5);

      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="hero"
      id="home"
      aria-label="Hero section"
    >
      {/* Layer 1: Overlay stuck to viewport via CSS position: sticky */}
      <div className="hero__overlay-wrapper" ref={overlayRef} style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
        <span ref={indexRef} className="hero__index" style={{ color: "rgb(60, 60, 60)" }}>
          Portfolio &nbsp;&bull;&nbsp; {new Date().getFullYear()}
        </span>

        <h1 className="hero__name" aria-label="NATANAEL ALEXANDER">
          <span ref={nameLeftRef} className="hero__name-left" style={{ color: "rgb(0, 0, 0)" }}>
            NATANAEL
          </span>
          <span ref={nameRightRef} className="hero__name-right" style={{ color: "rgb(0, 0, 0)" }}>
            ALEXANDER
          </span>
        </h1>

        <p ref={taglineRef} className="hero__tagline" style={{ color: "rgb(60, 60, 60)" }}>
          Creative Digital Architect
        </p>

        <div ref={scrollHintRef} className="hero__scroll-hint" style={{ color: "rgb(60, 60, 60)" }}>
          <span className="hero__scroll-line" aria-hidden="true" style={{ backgroundColor: "rgb(60, 60, 60)" }} />
          Scroll to reveal
        </div>
      </div>

        {/* Layer 1: The photo itself */}
        <div className="hero__bg-photo" ref={photoContainerRef}>
          <Image
            ref={imgRef}
            src="/images/team.jpg"
            alt="Natanael Alexander and team"
            width={1920}
            height={2560}
            priority
            quality={95}
            className="hero__img"
          />
          <div className="hero__photo-vignette" aria-hidden="true" />
        </div>

      {/* Layer 2: About Section Panels (Sliding in from the right over the photo) */}
      <div className="about-wrapper" ref={aboutWrapperRef} id="about">
        {/* Panel 1: THE MINDSET + Casual Photo */}
        <div className="w-[100vw] h-[100vh] flex flex-row" ref={(el) => { panelsRef.current[0] = el; }}>
          
          {/* Left: 50% Text */}
          <div className="w-1/2 h-full flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)" }}>
            <div className="w-full">
              <span className="about__label">01 / THE MINDSET</span>
              <h2 className="about__title">THE CATALYST.</h2>
              <p className="about__text">
                &quot;Saya Natanael Alexander. Rutinitas yang monoton tidak pernah menjadi tempat saya. Sebagai seorang problem solver, kompleksitas adalah hal yang menghidupkan passion saya. Kebuntuan teknis maupun bisnis bukanlah batas akhir. Prinsip eksekusi saya sederhana:&quot;
                <br/><br/>
                <span className="font-playfair italic text-[1.1em] font-medium tracking-wide">
                  &quot;Tidak ada hal yang tidak mungkin, hanya ada tidak mau.&quot;
                </span>
              </p>
            </div>
          </div>

          {/* Right: 50% Photo */}
          <div className="w-1/2 h-full relative bg-[var(--chalk)]">
            <Image 
              src="/images/casual.jpg" 
              alt="Natanael Alexander Casual" 
              fill 
              className="object-cover object-center" 
            />
          </div>

        </div>

        {/* Panel 2: THE FOUNDATION + Formal Photo */}
        <div className="w-[100vw] h-[100vh] flex flex-row" ref={(el) => { panelsRef.current[1] = el; }}>
          
          {/* Left: 50% Text */}
          <div className="w-1/2 h-full flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)" }}>
            <div className="w-full">
              <span className="about__label">02 / THE FOUNDATION</span>
              <h2 className="about__title">DUAL PERSPECTIVE.</h2>
              <p className="about__text">
                &quot;Dorongan untuk memecahkan masalah secara komprehensif membawa saya meraih gelar ganda S.Kom (Sistem Informasi) dan S.Ak (Akuntansi). Latar belakang keilmuan ini mendikte cara berpikir saya: sebuah arsitektur teknologi tidak boleh hanya dinilai dari kecanggihan teknis, melainkan wajib divalidasi oleh logika finansial dan metrik bisnis yang terukur.&quot;
              </p>
            </div>
          </div>

          {/* Right: 50% Photo */}
          <div className="w-1/2 h-full relative bg-[var(--chalk)]">
            <Image 
              src="/images/formal.png" 
              alt="Natanael Alexander Formal" 
              fill 
              className="object-cover object-center" 
            />
          </div>

        </div>
      </div>
    </section>
  );
}
