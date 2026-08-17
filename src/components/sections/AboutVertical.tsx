"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import LogoShader from "@/components/global/LogoShader";

export default function AboutVertical() {
  return (
    <div className="bg-white text-black relative z-20 w-full overflow-hidden">
      
      {/* Panel 3: THE PHILOSOPHY (Swapped Layout) */}
      <div className="w-[100vw] h-[100vh] flex flex-row border-b border-gray-100">
        
        {/* Left: 50% Visual */}
        <div className="w-1/2 h-full relative bg-white flex items-center justify-center overflow-hidden">
          
          {/* WebGL Image Distortion Shader */}
          <LogoShader 
            className="absolute inset-0 z-10" 
            imageUrl="/images/logo-weatso.png" 
          />
          
        </div>

        {/* Right: 50% Text */}
        <div className="w-1/2 h-full flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)" }}>
          <div className="w-full">
            <span className="about__label">03 / THE PHILOSOPHY</span>
            <h2 className="about__title">CREATIVE DIGITAL ARCHITECT.</h2>
            <p className="about__text">
              &quot;Dalam membangun ekosistem digital, kode yang bersih dengan technical debt minim adalah bare minimum. Nilai sesungguhnya dari sebuah arsitektur IT terletak pada kemampuannya menghadirkan Business Intelligence, mempercepat efisiensi operasional, dan membungkus solusi kompleks tersebut dalam estetika visual yang memukau.&quot;
            </p>
          </div>
        </div>

      </div>

      {/* Panel 4: THE EXECUTION + Team Photo */}
      <div className="w-[100vw] h-[100vh] flex flex-row border-b border-gray-100">
        
        {/* Left: 50% Text */}
        <div className="w-1/2 h-full flex flex-col justify-center bg-[var(--chalk)] relative z-10" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)" }}>
          <div className="w-full">
            <span className="about__label">04 / THE EXECUTION</span>
            <h2 className="about__title">COLLECTIVE IMPACT.</h2>
            <p className="about__text">
              &quot;Sebagai Founder dari WEATSO—sebuah Bespoke IT Consultancy &amp; Creative Studio—saya membuktikan filosofi tersebut secara nyata. Saya memimpin dan bekerja bersama tim yang solid untuk merancang infrastruktur digital, membantu berbagai bisnis skala enterprise bertumbuh. Kini, seiring kelulusan dan langkah karir baru setiap anggota tim, pengalaman kepemimpinan ini menjadi fondasi yang absolut untuk eksekusi industri yang lebih masif.&quot;
            </p>
          </div>
        </div>

        {/* Right: 50% Photo */}
        <div className="w-1/2 h-full relative bg-[var(--chalk)]">
          <Image 
            src="/images/team.jpg" 
            alt="WEATSO Team" 
            fill 
            className="object-cover object-center" 
          />
        </div>

      </div>

      {/* Panel 5: THE NEXT */}
      <div className="w-[100vw] h-[100vh] flex flex-row">
        
        {/* Center: Full width but keeping text proportions */}
        <div className="w-full h-full flex flex-col justify-center items-center bg-[var(--chalk)] relative z-10 text-center" style={{ paddingLeft: "clamp(2rem, 6vw, 8rem)", paddingRight: "clamp(2rem, 6vw, 8rem)" }}>
          <div className="w-full max-w-2xl mx-auto">
            <span className="about__label mx-auto">05 / THE NEXT</span>
            <h2 className="about__title">WHAT NEXT?</h2>
            <p className="about__text italic font-playfair font-medium">
              &quot;Semua ini baru fondasi awal. Ke depannya, masih banyak hal menarik, eksperimen teknis, dan ide bisnis yang akan saya bangun.&quot;
            </p>
            <div 
              className="mt-20 md:mt-32 inline-flex flex-col items-center w-max mx-auto group cursor-default"
            >
              <div className="flex items-center gap-2 font-montserrat text-sm md:text-base tracking-[0.2em] font-bold uppercase pointer-events-auto">
                NEXT JOURNEY: ANUGERAHVENTURES.COM 
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
              </div>
              <span className="mt-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full self-start"></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
