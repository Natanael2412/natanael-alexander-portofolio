"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Mengunci GSAP agar tidak rusak saat address bar HP hilang
ScrollTrigger.config({ ignoreMobileResize: true });

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

      const mm = gsap.matchMedia();

      // =========================================================
      // DESKTOP LOGIC (100% KODE ASLI ANDA, TIDAK DISENTUH)
      // =========================================================
      mm.add("(min-width: 1024px)", () => {
        const ctx = gsap.context(() => {
          // Entrance animation
          const tl = gsap.timeline({ delay: 0.4 });
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
              start: "bottom bottom",
              pin: true,
              scrub: true,
              snap: {
                snapTo: [0, ...panels.map((_, i) => (0.5 + i + 1) / (0.5 + panels.length))],
                duration: { min: 1.0, max: 1.8 },
                delay: 0, 
                ease: "power3.inOut"
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
              clipPath: "inset(4vh 4vw)",
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
            xPercent: -100,
            ease: "none",
            duration: window.innerWidth * panels.length,
          }, window.innerWidth * 0.5);

        }, sectionRef);

        return () => ctx.revert();
      });

      // =========================================================
      // MOBILE LOGIC: MENGEMBALIKAN EFEK BOX PUTIH & ANIMASI TEKS
      // =========================================================
      mm.add("(max-width: 1023px)", () => {
        const vw = window.innerWidth;

        // 1. Kunci Layout Mobile
        gsap.set(sectionRef.current, { height: "100vh", position: "relative", overflow: "hidden" });
        gsap.set(photoContainerRef.current, { position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 1, backgroundColor: "#111" });
        
        // PERBAIKAN BOX PUTIH: Setup overlay menjadi putih solid seperti di Desktop
        gsap.set(overlayRef.current, { 
          position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 50,
          display: "flex", flexDirection: "column", justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 1)", // Kembali menjadi Box Putih Solid
          mixBlendMode: "normal" 
        });
        
        // PERBAIKAN TEKS: Set opacity awal ke 0 agar animasi masuk bisa memunculkannya
        gsap.set([nameLeftRef.current, nameRightRef.current], { color: "rgb(0, 0, 0)", opacity: 0 });
        gsap.set([indexRef.current, taglineRef.current], { color: "rgb(60, 60, 60)", opacity: 0 });

        // Sembunyikan Panel 01 & 02 di Sebelah Kanan Layar (Z-Index 100 agar meluncur di atas teks)
        gsap.set(aboutWrapperRef.current, {
          position: "absolute", top: 0, left: vw, width: vw * 2, height: "100vh",
          display: "flex", flexDirection: "row", zIndex: 100
        });
        gsap.set(panelsRef.current, { width: vw, height: "100vh", flexShrink: 0 });

        // 2. Entrance Animation (Teks dianimasikan masuk agar tidak hilang tertelan preloader)
        const tl = gsap.timeline({ delay: 0.2 });
        if (imgRef.current) tl.fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, duration: 2.5, ease: "power2.out" }, 0);
        tl.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "expo.out" }, 0)
          .fromTo([nameLeftRef.current, nameRightRef.current], { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "expo.out" }, 0.2)
          .fromTo(indexRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, 0.4)
          .fromTo(taglineRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, 0.4);

        // 3. Scroll Hijack Timeline (Mobile)
        const mobileScrollTl = gsap.timeline({
          scrollTrigger: {
            id: "mobile-scroll",
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${vw * 2.5}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: false, // Dimatikan agar layout tidak hancur saat address bar turun
          }
        });

        // FASE 1: Box putih memudar, teks memudar & naik, Hero LCP mengecil
        mobileScrollTl.to(overlayRef.current, { backgroundColor: "rgba(255, 255, 255, 0)", ease: "none", duration: 1 }, 0);
        mobileScrollTl.to([nameLeftRef.current, nameRightRef.current, indexRef.current, taglineRef.current], { opacity: 0, y: -30, ease: "power2.inOut", duration: 1 }, 0);
        mobileScrollTl.to(imgRef.current, { scale: 0.9, xPercent: -10, ease: "none", duration: 3 }, 0);

        // FASE 2: Geser Panel 01 & 02 masuk dari kanan ke kiri
        mobileScrollTl.to(aboutWrapperRef.current, {
          x: () => -(vw * 2), // Geser mutlak 2 layar (Panel 01 dan 02)
          ease: "none",
          duration: 2
        }, 1);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // KODE JSX BAWAH INI 100% ASLI MILIK ANDA TANPA ADA YANG DIHAPUS
  return (
    <section
      ref={sectionRef}
      className="hero"
      id="home"
      aria-label="Hero section"
    >
      {/* Layer 1: Overlay & Teks Hero (Z-Index tinggi agar tampil di atas LCP & di bawah panel saat panel masuk) */}
      <div className="hero__overlay-wrapper relative z-20" ref={overlayRef} style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
        {/* Index label */}
        <span ref={indexRef} className="hero__index relative z-50" style={{ color: "rgb(60, 60, 60)" }}>
          Portfolio &nbsp;&bull;&nbsp; {new Date().getFullYear()}
        </span>

        <h1 className="hero__name relative z-50" aria-label="NATANAEL ALEXANDER">
          <span ref={nameLeftRef} className="hero__name-left" style={{ color: "rgb(0, 0, 0)" }}>
            NATANAEL
          </span>
          <span ref={nameRightRef} className="hero__name-right" style={{ color: "rgb(0, 0, 0)" }}>
            ALEXANDER
          </span>
        </h1>

        {/* Desktop: tagline + scroll hint | Mobile: desktop-only notice */}
        <p ref={taglineRef} className="hero__tagline relative z-50" style={{ color: "rgb(60, 60, 60)" }}>
          Creative Digital Architect
        </p>

        {/* Mobile-only: "Best on Desktop" notice */}
        <p
          className="lg:hidden absolute bottom-6 left-0 right-0 text-center font-montserrat tracking-widest uppercase text-[0.6rem] sm:text-[0.65rem] px-4 relative z-50 text-white drop-shadow-md"
        >
          ✦ Open on Laptop / Desktop for best experience
        </p>

        <div ref={scrollHintRef} className="hero__scroll-hint relative z-50" style={{ color: "rgb(60, 60, 60)" }}>
          <span className="hero__scroll-line" aria-hidden="true" style={{ backgroundColor: "rgb(60, 60, 60)" }} />
          Scroll to reveal
        </div>
      </div>

      {/* Layer 2: The photo itself (LCP Background) */}
      <div className="hero__bg-photo absolute inset-0 z-0" ref={photoContainerRef}>
        <Image
          ref={imgRef}
          src="/images/Hero.webp"
          alt="Natanael Alexander Hero"
          width={1920}
          height={2560}
          priority
          quality={95}
          className="hero__img object-cover object-center w-full h-full"
        />
        <div className="hero__photo-vignette" aria-hidden="true" />
      </div>

      {/* Layer 3: About Section Panels (Checkerboard 50/50 Tanpa Whitespace) */}
      <div 
        className="about-wrapper max-lg:absolute max-lg:top-0 max-lg:left-[100vw] max-lg:flex max-lg:flex-row max-lg:w-[200vw] max-lg:h-[100vh] z-30" 
        ref={aboutWrapperRef} 
        id="about"
      >
        {/* PANEL 1: 01 / THE MINDSET (Teks Atas 50%, Gambar Bawah 50%) */}
        <div className="w-[100vw] h-[100vh] lg:min-h-screen lg:h-[100vh] flex flex-col lg:flex-row max-lg:flex-shrink-0 bg-[#0a0a0a]" ref={(el) => { panelsRef.current[0] = el; }}>
          
          <div className="w-full h-[50vh] lg:h-full lg:w-1/2 flex-1 flex flex-col justify-center bg-[var(--chalk)] relative z-10 px-6 py-6 lg:p-24" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(3rem, 8vh, 6rem)", paddingBottom: "clamp(3rem, 8vh, 6rem)" }}>
            <div className="w-full">
              <span className="about__label">01 / THE MINDSET</span>
              <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>THE CATALYST.</h2>
              <p className="about__text">
                &quot;Saya Natanael Alexander. Rutinitas yang monoton tidak pernah menjadi tempat saya. Sebagai seorang <i>problem solver</i>, kompleksitas adalah hal yang menghidupkan <i>passion</i> saya. Kebuntuan teknis maupun bisnis bukanlah batas akhir. Prinsip eksekusi saya sederhana:&quot;
                <br/><br/>
                <span className="font-playfair italic text-[1.1em] font-medium tracking-wide">
                  &quot;Tidak ada hal yang tidak mungkin, hanya ada tidak mau.&quot;
                </span>
              </p>
            </div>
          </div>

          <div className="w-full h-[50vh] lg:h-full lg:w-1/2 relative bg-[var(--chalk)]">
            <Image 
              src="/images/casual.webp" 
              alt="Natanael Alexander Casual" 
              fill 
              className="object-cover object-[50%_25%] lg:object-center" 
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>

        {/* PANEL 2: 02 / THE FOUNDATION (Gambar Atas 50%, Teks Bawah 50%) */}
        <div className="w-[100vw] h-[100vh] lg:min-h-screen lg:h-[100vh] flex flex-col-reverse lg:flex-row-reverse max-lg:flex-shrink-0 bg-[#0a0a0a]" ref={(el) => { panelsRef.current[1] = el; }}>
          
          <div className="w-full h-[50vh] lg:h-full lg:w-1/2 relative bg-[var(--chalk)]">
            <Image 
              src="/images/formal.webp" 
              alt="Natanael Alexander Formal" 
              fill 
              className="object-cover object-[50%_25%] lg:object-center" 
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="w-full h-[50vh] lg:h-full lg:w-1/2 lg:flex-1 flex flex-col justify-center bg-[var(--chalk)] relative z-10 px-6 py-6 lg:p-24" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(2rem, 10vh, 8rem)", paddingBottom: "clamp(2rem, 10vh, 8rem)" }}>
            <div className="w-full">
              <span className="about__label">02 / THE FOUNDATION</span>
              <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>DUAL PERSPECTIVE.</h2>
              <p className="about__text">
                &quot;Dorongan untuk memecahkan masalah secara komprehensif membawa saya meraih gelar ganda S.Kom (Sistem Informasi) dan S.Ak (Akuntansi). Latar belakang keilmuan ini mendikte cara berpikir saya: sebuah arsitektur teknologi tidak boleh hanya dinilai dari kecanggihan teknis, melainkan wajib divalidasi oleh logika finansial dan metrik bisnis yang terukur.&quot;
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}