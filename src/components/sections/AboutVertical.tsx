"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import LogoShader from "@/components/global/LogoShader";

export default function AboutVertical() {
  return (
    <div className="bg-white text-black relative z-20 w-full overflow-hidden">
      
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
            <h2 className="about__title">CREATIVE DIGITAL ARCHITECT.</h2>
            <p className="about__text">
              &quot;Dalam membangun ekosistem digital, kode yang bersih dengan technical debt minim adalah bare minimum. Nilai sesungguhnya dari sebuah arsitektur IT terletak pada kemampuannya menghadirkan Business Intelligence, mempercepat efisiensi operasional, dan membungkus solusi kompleks tersebut dalam estetika visual yang memukau.&quot;
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
            <h2 className="about__title">WEATSO | Bespoke IT Consultancy &amp; Digital Presence.</h2>
            <p className="about__text font-bold mb-2">Production Lead &amp; Technical Engineer</p>
            <p className="about__text">
              &quot;Memimpin tim lintas fungsi dari tahap negosiasi klien hingga deployment. Saya merancang arsitektur solusi yang paling optimal secara bisnis dan teknis, mengorkestrasi alur kerja tim, memantau progres pengembangan, dan turun langsung menulis kode saat eksekusi menuntut presisi absolut.&quot;
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

      {/* Panel 5: THE NEXT */}
      <div className="w-full min-h-screen lg:h-[100vh] flex flex-row border-b border-gray-100">
        <div className="w-full flex flex-col justify-center items-center bg-[var(--chalk)] relative z-10 text-center" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)", paddingTop: "clamp(4rem, 10vh, 8rem)", paddingBottom: "clamp(4rem, 10vh, 8rem)" }}>
          <div className="w-full max-w-2xl mx-auto">
            <span className="about__label mx-auto">05 / THE NEXT</span>
            <h2 className="about__title">WHAT NEXT?</h2>
            <p className="about__text italic font-playfair font-medium">
              &quot;Semua ini baru fondasi awal. Ke depannya, masih banyak hal menarik, eksperimen teknis, dan ide bisnis yang akan saya bangun.&quot;
            </p>
            <div 
              className="mt-20 md:mt-32 inline-flex flex-col items-center w-max mx-auto group cursor-default"
            >
              <a href="https://anugerahventures.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-montserrat text-sm md:text-base tracking-[0.2em] font-bold uppercase pointer-events-auto hover:text-gray-600 transition-colors">
                NEXT JOURNEY: ANUGERAHVENTURES.COM 
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
              </a>
              <span className="mt-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full self-start"></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
