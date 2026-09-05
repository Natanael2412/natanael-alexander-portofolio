"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/supabase";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ─── Layout constants ────────────────────────────────────────────────────────
// Everything lines up to this one value. Change here, changes everywhere.
const PAD_LEFT = "clamp(1.5rem, 5vw, 6rem)";

export default function ProjectClient({ project }: { project: Project }) {
  const router = useRouter();
  const gallery = project.gallery_urls || [];

  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Duplicate until we have enough images to fill the marquee
  let baseGallery = [...gallery];
  while (baseGallery.length > 0 && baseGallery.length < 8) {
    baseGallery = [...baseGallery, ...gallery];
  }
  const reversedGallery = [...baseGallery].reverse();

  // ── GSAP Marquee ──────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!row1Ref.current || !row2Ref.current) return;

    const setupMarquee = (rowRef: React.RefObject<HTMLDivElement | null>, speed: number) => {
      const row = rowRef.current;
      if (!row) return () => {};

      const cards = gsap.utils.toArray(row.children) as HTMLElement[];
      if (cards.length === 0) return () => {};

      let currentX = 0;
      const logicalCards = cards.map(card => {
        const width = card.getBoundingClientRect().width;
        const obj = { el: card, x: currentX, width };
        currentX += width;
        return obj;
      });

      const totalWidth = currentX;

      // Pre-wrap for right-moving row so the left isn't empty on load
      if (speed > 0) {
        logicalCards.forEach(card => {
          if (card.x > row.offsetWidth) card.x -= totalWidth;
        });
      }

      // Set initial absolute positions
      logicalCards.forEach(card => {
        gsap.set(card.el, { position: "absolute", top: 0, left: 0, x: card.x });
      });

      const ticker = () => {
        for (const card of logicalCards) {
          card.x += speed;
          if (speed < 0 && card.x <= -card.width) card.x += totalWidth;
          else if (speed > 0 && card.x >= totalWidth - card.width) card.x -= totalWidth;
          gsap.set(card.el, { x: card.x });
        }
      };

      gsap.ticker.add(ticker);
      return () => gsap.ticker.remove(ticker);
    };

    const cleanup1 = setupMarquee(row1Ref, -1.0);
    const cleanup2 = setupMarquee(row2Ref, 1.0);
    return () => { cleanup1(); cleanup2(); };
  }, { dependencies: [gallery], scope: containerRef });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--ink)",
        color: "white",
        fontFamily: "var(--font-montserrat, sans-serif)",
        overflow: "hidden",
      }}
    >
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {project.hero_image_url ? (
          project.hero_image_url.endsWith(".mp4") || project.hero_image_url.endsWith(".webm") ? (
            <video
              src={project.hero_image_url}
              autoPlay loop muted playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.05)", fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "30vw", textTransform: "uppercase", letterSpacing: "-0.05em" }}>
              {project.title.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
            </span>
          </div>
        )}
        {/* Dark gradient: solid on left, transparent on right */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, var(--ink) 0%, rgba(7,7,10,0.85) 45%, rgba(7,7,10,0.15) 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── PAGE LAYOUT ───────────────────────────────────────────────────── */}
      {/*
          CSS Grid: 2 columns on desktop (lg+), 1 column on mobile.
          Col 1 (42%): Back button row + content row
          Col 2 (58%): Marquee (spans both rows)
      */}
      <div
        ref={containerRef}
        className="project-layout"
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "42% 1fr",
          gridTemplateRows: "auto 1fr",
          minHeight: "100vh",
        }}
      >
        {/* ── [1,1] BACK button ─────────────────────────────────────────── */}
        <div style={{
          gridColumn: "1",
          gridRow: "1",
          paddingLeft: PAD_LEFT,
          paddingTop: "clamp(1.25rem, 3vh, 2.5rem)",
          paddingBottom: "1.5rem",
        }}>
          <button
            onClick={() => router.push("/portfolio")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.625rem",
              background: "none", border: "none",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "inherit", fontSize: "0.7rem",
              letterSpacing: "0.3em", fontWeight: 600,
              textTransform: "uppercase", cursor: "pointer",
              transition: "color 0.2s", padding: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>←</span>BACK
          </button>
        </div>

        {/* ── [1,2] LEFT CONTENT ────────────────────────────────────────── */}
        <div style={{
          gridColumn: "1",
          gridRow: "2",
          paddingLeft: PAD_LEFT,
          paddingRight: "clamp(1rem, 3vw, 4rem)",
          paddingBottom: "clamp(2rem, 5vh, 4rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          {/* Year Badge */}
          <div style={{
            display: "inline-block", padding: "0.375rem 1rem",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "9999px",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.75)", marginBottom: "1.5rem",
            background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)",
            width: "fit-content",
          }}>
            {project.year || "2024"}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontWeight: 900,
            fontSize: "clamp(2.25rem, 3.5vw, 5rem)",
            lineHeight: 0.92, letterSpacing: "-0.03em",
            textTransform: "uppercase", marginBottom: "1.5rem",
            wordBreak: "break-word", overflowWrap: "break-word",
          }}>
            {project.title}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "clamp(0.8rem, 1vw, 0.95rem)", lineHeight: 1.7,
            color: "rgba(255,255,255,0.75)", marginBottom: "2rem",
            fontWeight: 400, maxWidth: "42ch",
          }}>
            {project.description}
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem", marginBottom: "2rem" }}>
            <div>
              <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem", fontWeight: 700 }}>Client</p>
              <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{project.client || "Confidential"}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem", fontWeight: 700 }}>Role</p>
              <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{project.role}</p>
            </div>
          </div>

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2.5rem" }}>
              {project.tech_stack.map((tech: string) => (
                <span key={tech} style={{
                  padding: "0.25rem 0.625rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px", fontSize: "0.65rem",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.65)",
                }}>
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Live Link */}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.75rem",
                background: "white", color: "black",
                padding: "0.875rem 1.75rem",
                fontSize: "0.7rem", letterSpacing: "0.2em",
                fontWeight: 700, textTransform: "uppercase",
                textDecoration: "none", width: "fit-content",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              View Live Project <ArrowRight size={14} />
            </a>
          )}
        </div>

        {/* ── [2, span 2 rows] RIGHT: Marquee Gallery ──────────────────── */}
        {gallery.length > 0 && (
          <div style={{
            gridColumn: "2",
            gridRow: "1 / 3",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(0.75rem, 2vh, 1.5rem)",
            overflow: "hidden",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}>
            {/* Row 1 – moves left */}
            <div ref={row1Ref} style={{ position: "relative", width: "100%", height: "clamp(160px, 18vw, 280px)" }}>
              {[...baseGallery, ...baseGallery].map((url: string, idx: number) => (
                <div key={`r1-${idx}`} style={{ paddingRight: "clamp(0.75rem, 1.5vw, 1.5rem)", display: "inline-block" }}>
                  <GalleryItem url={url} />
                </div>
              ))}
            </div>

            {/* Row 2 – moves right */}
            <div ref={row2Ref} style={{ position: "relative", width: "100%", height: "clamp(160px, 18vw, 280px)" }}>
              {[...reversedGallery, ...reversedGallery].map((url: string, idx: number) => (
                <div key={`r2-${idx}`} style={{ paddingRight: "clamp(0.75rem, 1.5vw, 1.5rem)", display: "inline-block" }}>
                  <GalleryItem url={url} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile override ───────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 1023px) {
          .project-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto auto auto !important;
          }
          .project-layout > *:nth-child(1) { grid-column: 1 !important; grid-row: 1 !important; }
          .project-layout > *:nth-child(2) { grid-column: 1 !important; grid-row: 2 !important; }
          .project-layout > *:nth-child(3) { grid-column: 1 !important; grid-row: 3 !important; height: 55vw !important; min-height: 280px; }
        }
      `}</style>
    </div>
  );
}

function GalleryItem({ url }: { url: string }) {
  return (
    <div style={{
      position: "relative",
      width: "clamp(220px, 26vw, 400px)",
      aspectRatio: "16/10",
      flexShrink: 0,
      borderRadius: "4px",
      overflow: "hidden",
      background: "var(--ink)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <Image
        src={url}
        alt="Gallery background"
        fill
        style={{ objectFit: "cover", opacity: 0.25 }}
        className="blur-2xl scale-110"
      />
      <Image
        src={url}
        alt="Gallery item"
        fill
        style={{ objectFit: "contain", padding: "0.5rem" }}
        sizes="(max-width: 1024px) 50vw, 26vw"
      />
    </div>
  );
}

