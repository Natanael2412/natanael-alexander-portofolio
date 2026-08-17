"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    id: "education",
    index: "01",
    image: "/images/formal.png",
    imageAlt: "Natanael in university formal attire",
    imagePosition: "left",
    title: "Academic\nFoundation",
    body: "Pursuing excellence at Unika Soegijapranata, where rigorous academic discipline meets creative ambition. Every challenge sharpened into a tool for innovation.",
    stats: [
      { value: "3.8", label: "GPA" },
      { value: "4+", label: "Years" },
    ],
  },
  {
    id: "casual",
    index: "02",
    image: "/images/casual.jpg",
    imageAlt: "Natanael casual portrait",
    imagePosition: "right",
    title: "Beyond\nthe Screen",
    body: "Curiosity doesn't clock out. Off the screen, exploring cities, absorbing culture, and finding design inspiration in the most unexpected moments.",
    stats: [
      { value: "∞", label: "Ideas" },
      { value: "24/7", label: "Creative" },
    ],
  },
  {
    id: "team",
    index: "03",
    image: "/images/team.jpg",
    imageAlt: "Natanael and team at elegant venue",
    imagePosition: "left",
    title: "Built on\nCollaboration",
    body: "Great work is never solo. Embedded in teams that challenge each other to think bigger — and deliver together under stunning pressure and beautiful constraints.",
    stats: [
      { value: "10+", label: "Projects" },
      { value: "4", label: "Teammates" },
    ],
  },
];

export default function NarrativeShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current || !stickyRef.current || !sectionRef.current) return;
      if (typeof window !== "undefined" && !window.matchMedia("(min-aspect-ratio: 1/1)").matches) return;

      const ctx = gsap.context(() => {
        const panels = trackRef.current!.querySelectorAll(".narrative__panel");
        const totalWidth = (panels.length - 1) * window.innerWidth;

        // Pin section and scroll horizontally
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1.2,
            pin: stickyRef.current,
            anticipatePin: 1,
          },
        });

        tl.to(trackRef.current, {
          x: -totalWidth,
          ease: "none",
        });

        // Animate content in each panel as it enters view
        panels.forEach((panel, i) => {
          const title = panel.querySelector(".narrative__panel-title");
          const body = panel.querySelector(".narrative__panel-body");
          const stats = panel.querySelectorAll(".narrative__stat");
          const image = panel.querySelector(".narrative__image-side img");

          if (i === 0) return; // first panel already visible

          gsap.set([title, body, stats], { y: 50, opacity: 0 });
          gsap.set(image, { scale: 1.1, filter: "grayscale(60%)" });

          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: tl.scrollTrigger?.animation,
            start: "left center",
            end: "right center",
            onEnter: () => {
              gsap.to([title, body, stats], {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.1,
                ease: "expo.out",
              });
              gsap.to(image, {
                scale: 1,
                filter: "grayscale(0%)",
                duration: 1.2,
                ease: "expo.out",
              });
            },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="narrative"
      id="about"
      aria-label="Personal narrative"
    >
      <div ref={stickyRef} className="narrative__sticky">
        <div ref={trackRef} className="narrative__track">
          {PANELS.map((panel) => (
            <article
              key={panel.id}
              id={`panel-${panel.id}`}
              className="narrative__panel"
              aria-label={`Panel ${panel.index}: ${panel.title.replace("\n", " ")}`}
            >
              {/* IMAGE — free, fills exactly 50% of screen, no card wrapper */}
              {panel.imagePosition === "left" ? (
                <>
                  <div className="narrative__image-side">
                    <Image
                      src={panel.image}
                      alt={panel.imageAlt}
                      fill
                      sizes="50vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                      priority={panel.index === "01"}
                    />
                  </div>
                  <div className="narrative__content-side">
                    <PanelContent panel={panel} />
                  </div>
                </>
              ) : (
                <>
                  <div className="narrative__content-side">
                    <PanelContent panel={panel} />
                  </div>
                  <div className="narrative__image-side">
                    <Image
                      src={panel.image}
                      alt={panel.imageAlt}
                      fill
                      sizes="50vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PanelContent({ panel }: { panel: (typeof PANELS)[0] }) {
  return (
    <>
      <p className="narrative__panel-index">{panel.index} — Story</p>
      <h2
        className="narrative__panel-title"
        style={{ whiteSpace: "pre-line" }}
      >
        {panel.title}
      </h2>
      <p className="narrative__panel-body">{panel.body}</p>
      <div className="narrative__panel-stats">
        {panel.stats.map((stat) => (
          <div key={stat.label} className="narrative__stat">
            <span className="narrative__stat-value">{stat.value}</span>
            <span className="narrative__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
