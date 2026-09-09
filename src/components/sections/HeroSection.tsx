"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });

export default function HeroSection() {
  const sectionRef       = useRef<HTMLDivElement>(null);
  const overlayRef       = useRef<HTMLDivElement>(null);
  const nameLeftRef      = useRef<HTMLSpanElement>(null);
  const nameRightRef     = useRef<HTMLSpanElement>(null);
  const taglineRef       = useRef<HTMLParagraphElement>(null);
  const scrollHintRef    = useRef<HTMLDivElement>(null);
  const indexRef         = useRef<HTMLSpanElement>(null);
  const mobileNoticeRef  = useRef<HTMLParagraphElement>(null);
  
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const imgRef           = useRef<HTMLImageElement>(null);
  
  const aboutWrapperRef  = useRef<HTMLDivElement>(null);
  const panelsRef        = useRef<(HTMLDivElement | null)[]>([]);

  // 1. ZOOM/RESIZE DEBOUNCE
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current || !overlayRef.current || !aboutWrapperRef.current) return;

      const mm = gsap.matchMedia();

      // =========================================================
      // DESKTOP LOGIC (100% KODE ANDA YANG SUDAH FIX)
      // =========================================================
      mm.add("(min-width: 1024px)", () => {
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({ delay: 1.5 });

          tl.fromTo(
              indexRef.current,
              { opacity: 0, y: -10 },
              { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }
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

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              const bgAlpha = 1 - p;
              if (overlayRef.current) overlayRef.current.style.backgroundColor = `rgba(255, 255, 255, ${bgAlpha})`;
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

          gsap.to(imgRef.current, {
            y: () => {
              if (!imgRef.current) return 0;
              const overflow = imgRef.current.offsetHeight - window.innerHeight;
              return overflow > 0 ? -(overflow * 0.8) : 0;
            },
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom bottom", scrub: true }
          });

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

          gsap.set(photoContainerRef.current, { clipPath: "inset(0% 0%)" });
          scrollTl.fromTo(photoContainerRef.current, { clipPath: "inset(0% 0%)" }, { clipPath: "inset(4vh 4vw)", ease: "power2.inOut", duration: window.innerWidth * 0.5 }, 0);
          scrollTl.to(overlayRef.current, { opacity: 0, duration: window.innerWidth * 0.25, ease: "power2.in" }, window.innerWidth * 0.25);
          scrollTl.to(aboutWrapperRef.current, { xPercent: -100, ease: "none", duration: window.innerWidth * panels.length }, window.innerWidth * 0.5);

        }, sectionRef);

        return () => ctx.revert();
      });

      // =========================================================
      // MOBILE LOGIC: MORPH PRELOADER + VERTICAL TO HORIZONTAL SCROLL
      // =========================================================
      mm.add("(max-width: 1023px)", () => {
        // 1. SETUP LAYOUT
        gsap.set(sectionRef.current, { height: "auto", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" });
        gsap.set(photoContainerRef.current, { position: "relative", top: "auto", left: "auto", width: "100%", height: "100svh", zIndex: 1 });
        
        // Memaksa About Wrapper membentang 2x layar ke samping (Horizontal Ready)
        gsap.set(aboutWrapperRef.current, {
          position: "relative", top: "auto", left: "auto", width: "200vw", height: "100svh",
          display: "flex", flexDirection: "row", zIndex: 10
        });

        // Panel 01 dan 02 diset sebelahan di dalam wrapper 200vw
        gsap.set(panelsRef.current, { width: "100vw", height: "100svh", display: "flex", flexDirection: "column", flexShrink: 0 });
        if (panelsRef.current[0] && panelsRef.current[1]) {
          const children = [...panelsRef.current[0].children, ...panelsRef.current[1].children];
          gsap.set(children, { height: "50svh", width: "100%", flex: "none" });
        }

        // 2. ANIMASI MORPH PRELOADER (1.5 DETIK)
        const initTl = gsap.timeline({ delay: 1.5 });
        
        // Background Putih -> Hitam Transparan (50%)
        initTl.to(overlayRef.current, { backgroundColor: "rgba(0, 0, 0, 0.5)", duration: 1.2, ease: "power2.inOut" }, 0);
        
        // Teks Hitam -> Teks Putih
        initTl.to([nameLeftRef.current, nameRightRef.current], { color: "rgb(255, 255, 255)", duration: 1.2, ease: "power2.inOut" }, 0);
        initTl.to([indexRef.current, taglineRef.current, scrollHintRef.current], { color: "rgba(255, 255, 255, 0.8)", duration: 1.2, ease: "power2.inOut" }, 0);
        if (mobileNoticeRef.current) {
          initTl.to(mobileNoticeRef.current, { color: "rgba(255, 255, 255, 0.6)", duration: 1.2, ease: "power2.inOut" }, 0);
        }

        // Cinematic reveal foto
        if (imgRef.current) {
          initTl.fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, duration: 2, ease: "power2.out" }, 0);
        }

        // 3. PARALLAX NATIVE SCROLL PADA HERO (LCP)
        gsap.to(imgRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: photoContainerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        // 4. EFEK "AKSEN KHUSUS": PANEL 02 MELUNCUR DARI KANAN
        // Scroll vertical akan normal sampai Panel 01 mentok di atas layar.
        // Saat mentok, layar ditahan, dan user scroll untuk menarik Panel 02 masuk.
        gsap.to(aboutWrapperRef.current, {
          x: () => -window.innerWidth, // Menggeser kontainer ke kiri sejauh 1 layar
          ease: "none",
          scrollTrigger: {
            id: "mobile-horizontal",
            trigger: aboutWrapperRef.current, // Trigger-nya adalah kontainer Panel, bukan Hero
            start: "top top",                 // Mulai saat Panel 01 mencapai pucuk layar
            end: () => `+=${window.innerWidth}`, // Mengunci selama 1x tinggi scroll layar
            pin: true,                        // Mengunci layar
            scrub: true,                      // Terikat pada scroll pengguna
            invalidateOnRefresh: true,
          }
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hero" id="home" aria-label="Hero section">
      
      {/* Layer 1: Overlay (Morph Target) */}
      <div 
        className="hero__overlay-wrapper max-lg:absolute max-lg:inset-0 max-lg:z-50 max-lg:flex max-lg:flex-col max-lg:justify-center" 
        ref={overlayRef} 
        style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
      >
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

        <p
          ref={mobileNoticeRef}
          className="lg:hidden absolute bottom-6 left-0 right-0 text-center font-montserrat tracking-widest uppercase text-[0.6rem] sm:text-[0.65rem] px-4"
          style={{ color: "rgba(60,60,60,0.7)" }}
        >
          ✦ Open on Laptop / Desktop for best experience
        </p>

        <div ref={scrollHintRef} className="hero__scroll-hint hidden lg:flex" style={{ color: "rgb(60, 60, 60)" }}>
          <span className="hero__scroll-line" aria-hidden="true" style={{ backgroundColor: "rgb(60, 60, 60)" }} />
          Scroll to reveal
        </div>
      </div>

      {/* Layer 2: The photo itself */}
      <div className="hero__bg-photo" ref={photoContainerRef}>
        <Image
          ref={imgRef}
          src="/images/Hero.webp"
          alt="Natanael Alexander Hero"
          width={1920}
          height={2560}
          className="hero__img object-cover object-center w-full h-full"
          fetchPriority="high"
          priority
          quality={80}
          sizes="(max-width: 1023px) 100vw, 100vw"
        />
        <div className="hero__photo-vignette" aria-hidden="true" />
      </div>

      {/* Layer 3: About Section Panels */}
      <div
        className="about-wrapper z-30"
        ref={aboutWrapperRef}
        id="about"
      >
        {/* Panel 1: THE MINDSET */}
        <div
          className="w-[100vw] h-[100svh] lg:min-h-screen lg:h-[100vh] flex flex-col lg:flex-row max-lg:flex-shrink-0 bg-[#0a0a0a]"
          ref={(el) => { panelsRef.current[0] = el; }}
        >
          <div
            className="w-full h-[50svh] lg:h-full lg:w-1/2 flex-1 flex flex-col justify-center bg-[var(--chalk)] relative z-10 px-6 py-6 lg:p-24"
            style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(3rem, 8vh, 6rem)", paddingBottom: "clamp(3rem, 8vh, 6rem)" }}
          >
            <div className="w-full">
              <span className="about__label">01 / THE MINDSET</span>
              <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>THE CATALYST.</h2>
              <p className="about__text">
                &quot;Saya Natanael Alexander. Rutinitas yang monoton tidak pernah menjadi tempat saya. Sebagai seorang <i>problem solver</i>, kompleksitas adalah hal yang menghidupkan <i>passion</i> saya. Kebuntuan teknis maupun bisnis bukanlah batas akhir. Prinsip eksekusi saya sederhana:&quot;
                <br /><br />
                <span className="font-playfair italic text-[1.1em] font-medium tracking-wide">
                  &quot;Tidak ada hal yang tidak mungkin, hanya ada tidak mau.&quot;
                </span>
              </p>
            </div>
          </div>
          <div className="w-full h-[50svh] lg:h-full lg:w-1/2 relative bg-[var(--chalk)]">
            <Image
              alt="Natanael Alexander Casual"
              className="object-cover object-center"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              src="/images/casual.webp"
            />
          </div>
        </div>

        {/* Panel 2: THE FOUNDATION */}
        <div
          className="w-[100vw] h-[100svh] lg:min-h-screen lg:h-[100vh] flex flex-col-reverse lg:flex-row-reverse max-lg:flex-shrink-0 bg-[#0a0a0a]"
          ref={(el) => { panelsRef.current[1] = el; }}
        >
          <div className="w-full h-[50svh] lg:h-full lg:w-1/2 relative bg-[var(--chalk)]">
            <Image
              alt="Natanael Alexander Formal"
              className="object-cover object-center"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              src="/images/formal.webp"
            />
          </div>
          <div
            className="w-full h-[50svh] lg:h-full lg:w-1/2 lg:flex-1 flex flex-col justify-center bg-[var(--chalk)] relative z-10 px-6 py-6 lg:p-24"
            style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(2rem, 10vh, 8rem)", paddingBottom: "clamp(2rem, 10vh, 8rem)" }}
          >
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