"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/supabase";

export default function ProjectClient({ project }: { project: Project }) {
  const router = useRouter();
  const gallery = project.gallery_urls || [];
  
  // Ensure we have enough items to fill the screen width so the seamless loop works perfectly
  let baseGallery = [...gallery];
  while (baseGallery.length > 0 && baseGallery.length < 6) {
    baseGallery = [...baseGallery, ...gallery];
  }
  
  const reversedGallery = [...baseGallery].reverse();
  
  return (
    <div className="relative w-full min-h-screen bg-[var(--ink)] font-montserrat text-white">
      {/* Background Media with Dark Overlay for Elegance */}
      <div className="absolute inset-0 z-0">
        {project.hero_image_url ? (
          project.hero_image_url.endsWith(".mp4") || project.hero_image_url.endsWith(".webm") ? (
            <video
              src={project.hero_image_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={project.hero_image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          )
        ) : (
          <div className="w-full h-full bg-[#111] flex items-center justify-center">
             <span className="text-white/5 font-playfair font-black text-[30vw] uppercase tracking-tighter">
               {project.title.split(' ').map(n => n[0]).join('').substring(0, 2)}
             </span>
          </div>
        )}
        {/* Soft, deep overlay matching theme - gradient from right to left */}
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--ink)]/40 via-[var(--ink)]/90 to-[var(--ink)] backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* Main Split-Screen Container */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row lg:justify-between">
        
        {/* LEFT PANEL: Text Content (40% width on desktop) */}
        <div className="w-full lg:w-[45%] lg:min-h-screen relative flex flex-col justify-start lg:justify-center pt-8 pb-12 lg:py-24 pl-6 pr-6 md:pl-12 lg:pl-32 xl:pl-40 lg:pr-16 z-10">
          
          {/* Top: Back Navigation */}
          <div className="mb-10 md:mb-16 lg:mb-0 lg:absolute lg:top-12 lg:left-16 z-50">
            <button onClick={() => router.push('/portfolio')} className="font-montserrat text-xs md:text-sm tracking-[0.3em] font-medium uppercase text-white/60 hover:text-white transition-colors flex items-center gap-3 w-max">
              <span className="text-[16px] leading-none mb-[2px]">&larr;</span> BACK
            </button>
          </div>

          <div className="max-w-2xl">
            {/* Year Badge */}
            <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs font-bold tracking-widest text-white/80 mb-6 lg:mb-8 bg-black/20 backdrop-blur-md">
              {project.year || "2024"}
            </div>

            {/* Title */}
            <h1 className="font-playfair font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter uppercase mb-6 lg:mb-8">
              {project.title}
            </h1>

            {/* Description */}
            <p className="font-montserrat text-sm md:text-base leading-relaxed text-white/80 mb-8 lg:mb-12 max-w-xl font-medium">
              {project.description}
            </p>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10 lg:mb-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">Client</p>
                <p className="font-medium text-sm md:text-base">{project.client || "Confidential"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">Role</p>
                <p className="font-medium text-sm md:text-base">{project.role}</p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10 lg:mb-16">
                {project.tech_stack.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] tracking-widest uppercase text-white/70">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Live Link Button */}
            {project.live_url && (
              <a 
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-4 bg-white text-black px-8 py-4 overflow-hidden"
              >
                <span className="relative z-10 font-montserrat text-xs tracking-[0.2em] font-bold uppercase">View Live Project</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/80 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </a>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Marquee Gallery (50% width on desktop) */}
        {gallery.length > 0 && (
          <div 
            className="w-full lg:w-[50%] h-[40vh] min-h-[300px] lg:h-screen lg:sticky lg:top-0 relative overflow-hidden flex flex-col justify-center gap-4 lg:gap-8 opacity-90 pb-12 lg:pb-0"
            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
          >
            
            {/* Row 1 - Moves Left */}
            <div className="flex w-max animate-marquee">
              {[...baseGallery, ...baseGallery].map((url, idx) => (
                <div key={`r1-${idx}`} className="pr-6 md:pr-12 lg:pr-16">
                  <GalleryItem url={url} />
                </div>
              ))}
            </div>

            {/* Row 2 - Moves Right */}
            <div className="flex w-max animate-marquee" style={{ animationDirection: 'reverse' }}>
              {[...reversedGallery, ...reversedGallery].map((url, idx) => (
                <div key={`r2-${idx}`} className="pr-6 md:pr-12 lg:pr-16">
                  <GalleryItem url={url} />
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function GalleryItem({ url }: { url: string }) {
  return (
    <div className="relative w-[50vw] lg:w-[28vw] flex-shrink-0 aspect-[16/10] rounded-sm overflow-hidden bg-[var(--ink)] border border-white/5 shadow-2xl">
      <Image 
        src={url}
        alt="Gallery blurred background"
        fill
        className="object-cover opacity-30 blur-2xl scale-110"
      />
      <Image 
        src={url}
        alt="Gallery Item"
        fill
        className="object-contain p-2 md:p-4 drop-shadow-xl"
        sizes="(max-width: 1024px) 50vw, 28vw"
      />
    </div>
  );
}
