"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import LogoShader from "@/components/global/LogoShader";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutVertical({ 
  projectsCount = 0, 
  articlesCount = 0 
}: { 
  projectsCount?: number, 
  articlesCount?: number 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const yearsOfExperience = new Date().getFullYear() - 2024;
  
  useGSAP(() => {
    // Counter Animation
    const counters = gsap.utils.toArray('.stat-counter') as HTMLElement[];
    
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      
      ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(counter, 
            { innerText: 0 }, 
            { 
              innerText: target, 
              duration: 2.5, 
              ease: "power3.out", 
              snap: { innerText: 1 },
              onUpdate: function() {
                counter.innerHTML = Math.ceil(Number(this.targets()[0].innerText)).toString();
              }
            }
          );
        }
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white text-black relative z-20 w-full overflow-hidden">
      
      {/* Panel 3: THE PHILOSOPHY */}
      <div className="w-full min-h-screen lg:h-[100vh] flex flex-col-reverse lg:flex-row border-b border-gray-100">
        
        {/* Left: Visual */}
        <div className="w-full lg:w-1/2 h-[50svh] lg:h-full relative bg-white flex items-center justify-center overflow-hidden">
          <LogoShader 
            className="absolute inset-0 z-10" 
            imageUrl="/images/logo-weatso.webp" 
          />
        </div>

        {/* Right: Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(3rem, 8vh, 6rem)", paddingBottom: "clamp(3rem, 8vh, 6rem)" }}>
          <div className="w-full">
            <span className="about__label">03 / THE PHILOSOPHY</span>
            <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>CREATIVE DIGITAL ARCHITECT.</h2>
            <p className="about__text">
              &quot;Dalam membangun ekosistem digital, kode yang bersih dengan <i>technical debt</i> minim adalah <i>bare minimum</i>. Nilai sesungguhnya dari sebuah arsitektur IT terletak pada kemampuannya menghadirkan <i>Business Intelligence</i>, mempercepat efisiensi operasional, dan membungkus solusi kompleks tersebut dalam estetika visual yang memukau.&quot;
            </p>
          </div>
        </div>

      </div>

      {/* Panel 4: PRODUCTION LEADERSHIP + Team Photo */}
      <div className="w-full min-h-screen lg:h-[100vh] flex flex-col lg:flex-row border-b border-gray-100">
        
        {/* Left: Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(3rem, 8vh, 6rem)", paddingBottom: "clamp(3rem, 8vh, 6rem)" }}>
          <div className="w-full">
            <span className="about__label">04 / PRODUCTION LEADERSHIP</span>
            <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>WEATSO | Bespoke IT Consultancy &amp; Digital Presence.</h2>
            <p className="about__text font-bold mb-2">Production Lead &amp; Technical Engineer</p>
            <p className="about__text">
              &quot;Memimpin tim lintas fungsi dari tahap negosiasi klien hingga <i>deployment</i>. Saya merancang arsitektur solusi yang paling optimal secara bisnis dan teknis, mengorkestrasi alur kerja tim, memantau progres pengembangan, dan turun langsung menulis kode saat eksekusi menuntut presisi absolut.&quot;
            </p>
          </div>
        </div>

        {/* Right: Photo */}
        <div className="w-full lg:w-1/2 h-[50svh] lg:h-full relative bg-[var(--chalk)]">
          <Image 
            src="/images/team.webp" 
            alt="WEATSO Team" 
            fill 
            className="object-cover object-center" 
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

      </div>

      {/* Panel 5: THE EXPERIENCE */}
      <div className="w-full min-h-screen lg:h-[100vh] flex flex-col-reverse lg:flex-row border-b border-gray-100">
        
        {/* Left: Photo */}
        <div className="w-full lg:w-1/2 h-[50svh] lg:h-full relative bg-gray-100">
          <Image 
            src="/images/Experience.webp" 
            alt="Experience" 
            fill 
            className="object-cover object-center" 
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right: Text & Stats */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(3rem, 8vh, 6rem)", paddingBottom: "clamp(3rem, 8vh, 6rem)" }}>
          <div className="w-full">
            <span className="about__label">05 / THE EXPERIENCE</span>
            <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>EXPERIENCE IN NUMBERS.</h2>
            <p className="about__text mb-12">
              &quot;Fokus pada hasil akhir (delivery) sejak 2024. Metrik di bawah ini adalah representasi kuantitatif dari proyek yang telah dirilis, validasi profesional, dan jejak teknis yang saya bagikan ke ruang publik.&quot;
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              
              {/* Stat 1 */}
              <div>
                <div className="flex items-baseline gap-1 font-playfair font-black text-5xl md:text-7xl tracking-tighter">
                  <span className="stat-counter" data-target={yearsOfExperience}>0</span>
                  <span className="text-3xl md:text-5xl opacity-50">+</span>
                </div>
                <p className="font-montserrat text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-60">Years of Experience</p>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="flex items-baseline gap-1 font-playfair font-black text-5xl md:text-7xl tracking-tighter">
                  <span className="stat-counter" data-target={projectsCount}>0</span>
                  <span className="text-3xl md:text-5xl opacity-50">++</span>
                </div>
                <p className="font-montserrat text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-60">Digital Projects</p>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="flex items-baseline gap-1 font-playfair font-black text-5xl md:text-7xl tracking-tighter">
                  <span className="stat-counter" data-target="10">0</span>
                  <span className="text-3xl md:text-5xl opacity-50">++</span>
                </div>
                <p className="font-montserrat text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-60">Certifications</p>
              </div>

              {/* Stat 4 */}
              <div>
                <div className="flex items-baseline gap-1 font-playfair font-black text-5xl md:text-7xl tracking-tighter">
                  <span className="stat-counter" data-target={articlesCount}>0</span>
                </div>
                <p className="font-montserrat text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-60">Technical Insights</p>
              </div>
              
            </div>
          </div>
        </div>

      </div>

      {/* Panel 6: THE NEXT */}
      <div className="w-full min-h-screen lg:h-[100vh] flex flex-row border-b border-gray-100">
        <div className="w-full flex flex-col justify-center items-center bg-[var(--chalk)] relative z-10 text-center" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(4rem, 10vh, 8rem)", paddingBottom: "clamp(4rem, 10vh, 8rem)" }}>
          <div className="w-full max-w-2xl mx-auto">
            <span className="about__label mx-auto">06 / THE NEXT</span>
            <h2 className="about__title !text-[clamp(1.5rem,4vw,5rem)]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>WHAT NEXT?</h2>
            <p className="about__text italic font-playfair font-medium">
              &quot;Semua ini baru fondasi awal. Ke depannya, masih banyak hal menarik, eksperimen teknis, dan ide bisnis yang akan saya bangun.&quot;
            </p>
            <div 
              className="mt-20 md:mt-32 flex flex-col items-center max-w-full mx-auto group cursor-default"
            >
              <a href="https://anugerahventures.com" target="_blank" rel="noopener noreferrer" className="flex flex-wrap justify-center items-center gap-1 md:gap-2 font-montserrat text-[10px] min-[375px]:text-xs md:text-base tracking-[0.1em] md:tracking-[0.2em] font-bold uppercase pointer-events-auto hover:text-gray-600 transition-colors px-2 text-center">
                <span>NEXT JOURNEY: ANUGERAHVENTURES.COM</span>
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:rotate-45 flex-shrink-0" strokeWidth={2.5} />
              </a>
              <span className="mt-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-[80%] md:group-hover:w-full self-center"></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
