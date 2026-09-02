"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/supabase";

export default function ProjectClient({ project }: { project: Project }) {
  const router = useRouter();
  const gallery = project.gallery_urls || [];
  const duplicatedGallery = [...gallery, ...gallery, ...gallery, ...gallery];
  const reversedGallery = [...gallery].reverse();
  const duplicatedReversedGallery = [...reversedGallery, ...reversedGallery, ...reversedGallery, ...reversedGallery];
  
  return (
    <div className="relative w-full min-h-screen bg-[var(--ink)] font-montserrat text-white">
      {/* Background Media with Dark Overlay for Elegance */}
      <div className="absolute inset-0 z-0">
        {project.hero_image_url?.endsWith(".mp4") || project.hero_image_url?.endsWith(".webm") ? (
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
            src={project.hero_image_url || "/images/work/AC.webp"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Soft, deep overlay matching theme */}
        <div className="absolute inset-0 bg-[var(--ink)]/85 backdrop-blur-[2px] pointer-events-none" />
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

          {/* Year */}
          <p className="font-montserrat text-sm md:text-base tracking-[0.3em] text-white/60 mb-2 md:mb-4 uppercase">
            {project.role} &nbsp;•&nbsp; {project.year}
          </p>

          {/* Title */}
          <h1 className="font-bodoni font-bold text-white leading-[1.05] mb-6 md:mb-8 text-4xl md:text-5xl lg:text-[4vw] xl:text-[3.5vw] tracking-tight">
            {project.title}
          </h1>

          {/* Description */}
          <p className="font-inter text-base md:text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl font-light">
            {project.description || "No description available for this project."}
          </p>

          {/* Tech Stack (Glass Box - Option 2 - Enlarged) */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 md:gap-5 mt-6 md:mt-8">
              {project.tech_stack?.map((tech, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/5 backdrop-blur-md px-5 py-3 md:px-8 md:py-4 rounded-sm"
                >
                  <span className="font-montserrat text-xs md:text-base tracking-[0.2em] uppercase text-white/90 font-medium">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Visit Project Link (Elegant Text-Only - Enlarged) */}
          {project.live_url && (
            <div className="mt-10 md:mt-16">
              <a 
                href={project.live_url} 
                target="_blank" 
                rel="noreferrer"
                className="group inline-flex items-center gap-6 w-max"
              >
                <span className="font-montserrat text-base md:text-xl font-medium tracking-[0.3em] uppercase text-white border-b border-transparent group-hover:border-white/50 pb-2 transition-colors duration-300">
                  Visit Project
                </span>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:translate-x-2 transition-transform duration-300" strokeWidth={1.5} />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Marquee Gallery (50% width on desktop) */}
        {gallery.length > 0 && (
          <div className="w-full lg:w-[50%] h-[40vh] min-h-[300px] lg:h-screen lg:sticky lg:top-0 relative overflow-hidden flex flex-col justify-center gap-4 lg:gap-8 opacity-90 pb-12 lg:pb-0">
            
            {/* Fade Edges (Masking) to blend into background completely */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[var(--ink)] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[var(--ink)] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-12 md:h-24 bg-gradient-to-b from-[var(--ink)] to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-12 md:h-24 bg-gradient-to-t from-[var(--ink)] to-transparent z-10 pointer-events-none" />

            {/* Row 1 - Moves Left */}
            <div className="flex w-max animate-marquee">
              {[...duplicatedGallery.slice(0, 4), ...duplicatedGallery.slice(0, 4)].map((url, idx) => (
                <div key={`r1-${idx}`} className="pr-6 md:pr-12 lg:pr-16">
                  <GalleryItem url={url} />
                </div>
              ))}
            </div>

            {/* Row 2 - Moves Right */}
            <div className="flex w-max animate-marquee" style={{ animationDirection: 'reverse' }}>
              {[...duplicatedReversedGallery.slice(0, 4), ...duplicatedReversedGallery.slice(0, 4)].map((url, idx) => (
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
