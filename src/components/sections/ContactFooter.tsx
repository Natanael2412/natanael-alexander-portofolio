"use client";

import { useEffect, useState, useRef } from "react";
import FooterShader from "@/components/global/FooterShader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ContactFooter() {
  const [timeStr, setTimeStr] = useState("");
  const footerRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const updateTime = () => {
      const semarangTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta", // Semarang is WIB
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTimeStr(`SEMARANG, ID — ${semarangTime} WIB`);
    };
    
    updateTime(); // Initial run
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#0a0a0a] overflow-hidden flex flex-col justify-between min-h-[55vh]"
      id="contact"
      aria-label="Contact section"
    >
      {/* Background Shader */}
      <FooterShader className="absolute inset-0 z-0" />

      {/* TOP CONTENT: CTA & Nav */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8 sm:gap-4
        px-6 sm:px-10 md:px-16
        pt-16 sm:pt-20 md:pt-28
        text-white w-full"
      >
        {/* CTA Typography */}
        <h2 className="font-playfair text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[90px] xl:text-[120px] leading-[0.88] tracking-tighter select-none shrink-0 max-w-full">
          <div className="text-white">Let&apos;s make it</div>
          <div
            className="text-transparent italic"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)" }}
          >
            happen.
          </div>
        </h2>

        {/* Nav Links */}
        <nav className="flex flex-col items-start sm:items-end gap-4 sm:gap-5 font-montserrat text-base sm:text-lg md:text-xl lg:text-2xl tracking-widest uppercase font-medium sm:mt-1">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=natanaelalexandergani@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors relative group">
            Email<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="https://wa.me/6288996555999" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors relative group">
            WhatsApp<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="https://instagram.com/natanaelalexander_" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors relative group">
            Instagram<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="https://anugerahventures.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors relative group">
            Anugerahventures.com<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>
      </div>

      {/* BOTTOM CONTENT: Meta Info (In document flow, will never overlap) */}
      <div className="relative z-20 px-6 sm:px-10 md:px-16 pb-24 sm:pb-28 md:pb-32 mt-32 md:mt-64 flex flex-col gap-1 pointer-events-none w-full">
        <p className="font-montserrat text-xs sm:text-sm md:text-base tracking-wider text-white/40">
          {timeStr || "SEMARANG, ID — --:--:-- WIB"}
        </p>
        <p className="font-montserrat text-xs sm:text-sm md:text-base tracking-wider text-white/30">
          © {new Date().getFullYear()} NATANAEL ALEXANDER. ALL RIGHTS RESERVED.
        </p>
      </div>

    </footer>
  );
}

