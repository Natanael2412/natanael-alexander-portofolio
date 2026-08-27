"use client";

import { useEffect, useState } from "react";
import FooterShader from "@/components/global/FooterShader";

export default function ContactFooter() {
  const [timeStr, setTimeStr] = useState("");

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
    <footer className="relative w-full min-h-[50vh] h-[60vh] bg-[#0a0a0a] overflow-hidden" id="contact" aria-label="Contact section">
      {/* Background Shader Component - Full width, gradient handled by shader */}
      <FooterShader className="absolute inset-0 z-0" />
      
      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col justify-between h-full px-8 md:px-16 pt-16 md:pt-24 pb-10 md:pb-16 text-white pointer-events-none min-h-[60vh] md:min-h-[500px]">
        
        {/* 2. The Hook (Giant Typography) */}
        <div className="mt-0">
          <h2 className="font-playfair text-6xl md:text-8xl leading-[0.9] tracking-tighter select-none">
            <div className="text-white">Let&apos;s</div>
            {/* Outline text effect, italic */}
            <div 
              className="text-transparent italic" 
              style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.9)" }}
            >
              create
            </div>
            <div className="text-white">together.</div>
          </h2>
        </div>

        {/* Bottom Wrapper */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mt-auto gap-8">
          
          {/* 3. Tautan Konversi (Bottom Left) */}
          <nav className="flex flex-col md:flex-row gap-6 md:gap-10 font-montserrat text-base md:text-lg tracking-widest uppercase font-medium pointer-events-auto">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=natanaelalexandergani@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-300 transition-colors duration-300 relative group"
            >
              Email
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="https://wa.me/6288996555999" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-300 transition-colors duration-300 relative group"
            >
              WhatsApp
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="https://instagram.com/natanaelalexander_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-300 transition-colors duration-300 relative group"
            >
              Instagram
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* 4. Micro-Aesthetics (Bottom Right) */}
          <div className="flex flex-col w-full md:w-auto text-left md:text-right text-sm text-white/80 font-sans tracking-wider space-y-1 drop-shadow-md">
            <p>{timeStr || "SEMARANG, ID — --:--:-- WIB"}</p>
            <p>© {new Date().getFullYear()} NATANAEL ALEXANDER. ALL RIGHTS RESERVED.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
