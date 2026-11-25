import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Play, MessageCircle } from "lucide-react";
import { SITE_INFO } from "../data";
import { buildWhatsAppUrl } from "../utils/video";
import { MagneticButton } from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  ready: boolean;
}

function formatTimecode(totalFrames: number): string {
  const fps = 24;
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewfinderRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [timecode, setTimecode] = useState("00:00:12:08");

  // Live 24fps viewfinder timecode
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let frame = 12 * 24 + 8;
    const interval = window.setInterval(() => {
      frame += 1;
      setTimecode(formatTimecode(frame));
    }, 1000 / 24);

    return () => window.clearInterval(interval);
  }, []);

  // Line-by-line entrance + subtle scroll parallax
  useEffect(() => {
    if (!ready || !sectionRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal-line",
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.11,
          ease: "power3.out",
          clearProps: "transform",
        }
      );

      gsap.fromTo(
        ".hero-fade-up",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          delay: 0.28,
          ease: "power3.out",
          clearProps: "transform",
        }
      );

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop && viewfinderRef.current) {
        gsap.to(viewfinderRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (isDesktop && glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: 22,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  const whatsappHref = buildWhatsAppUrl({
    customText: "Hi Pankaj, I visited your portfolio and would like to discuss a video editing project.",
  });

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-4 pt-20 pb-6 sm:px-8 sm:pt-24 sm:pb-10"
    >
      {/* Ambient cinematic warm aperture light behind viewfinder */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255, 90, 31, 0.42) 0%, rgba(255, 176, 32, 0.16) 45%, rgba(10, 10, 10, 0) 75%)",
        }}
      />

      {/* Subtle cinema letterbox horizontal framing hairlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 h-px bg-white/[0.04] sm:top-[72px]"
      />

      {/* Main Viewfinder Frame Container */}
      <div
        ref={viewfinderRef}
        className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-between rounded-sm border border-white/[0.07] bg-white/[0.012] p-5 sm:p-10 lg:p-14"
      >
        {/* Camera Viewfinder Corner Brackets */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -left-px h-6 w-6 border-t-2 border-l-2 border-[#ff7a1f]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -right-px h-6 w-6 border-t-2 border-r-2 border-[#ff7a1f]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-[#ff7a1f]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-[#ff7a1f]"
        />

        {/* Subtle Center Crosshair Registration Mark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-[0.07] lg:block"
        >
          <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
            <line x1="42" y1="0" x2="42" y2="30" stroke="#f5f2eb" strokeWidth="1" />
            <line x1="42" y1="54" x2="42" y2="84" stroke="#f5f2eb" strokeWidth="1" />
            <line x1="0" y1="42" x2="30" y2="42" stroke="#f5f2eb" strokeWidth="1" />
            <line x1="54" y1="42" x2="84" y2="42" stroke="#f5f2eb" strokeWidth="1" />
            <circle cx="42" cy="42" r="10" stroke="#ff7a1f" strokeWidth="1" />
          </svg>
        </div>

        {/* Top Viewfinder HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.2em] text-[#9e998e] uppercase sm:text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[#f5f2eb]">
              <span
                aria-hidden="true"
                className="animate-rec-blink inline-block h-2.5 w-2.5 rounded-full bg-[#ff3b1f] shadow-[0_0_10px_rgba(255,59,31,0.9)]"
              />
              REC
            </span>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <span className="tabular-nums text-[#f5f2eb]/90">{timecode}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>24 FPS</span>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <span className="hidden sm:inline">4K MASTER</span>
            <span aria-hidden="true" className="hidden text-white/25 sm:inline">
              ·
            </span>
            <span>16:9 / 9:16</span>
          </div>
        </div>

        {/* Center Hero Headline & CTAs */}
        <div className="my-auto py-10 sm:py-14 lg:py-16">
          <p className="hero-fade-up mb-4 font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase sm:mb-5 sm:text-[13px]">
            {SITE_INFO.name} · {SITE_INFO.role}
          </p>

          <h1 className="max-w-5xl font-display text-[clamp(3.35rem,11vw,9.2rem)] leading-[0.88] tracking-[0.02em] text-[#f5f2eb] uppercase [text-wrap:balance]">
            <span className="block overflow-hidden pb-1">
              <span className="hero-reveal-line block">I make videos</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="hero-reveal-line block">
                people{" "}
                <span className="text-amber-gradient">finish.</span>
              </span>
            </span>
          </h1>

          <p className="hero-fade-up mt-6 max-w-xl text-base leading-relaxed text-[#f5f2eb]/75 sm:mt-8 sm:text-lg">
            {SITE_INFO.heroSubtitle}
          </p>

          <div className="hero-fade-up mt-8 flex flex-wrap items-center gap-3.5 sm:mt-10 sm:gap-4">
            <MagneticButton
              href="#work"
              variant="primary"
              className="px-7 py-3.5 text-sm uppercase tracking-[0.12em]"
              cursorLabel="WATCH"
            >
              <Play className="h-4 w-4 fill-current" />
              See my work
            </MagneticButton>

            <MagneticButton
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="px-7 py-3.5 text-sm uppercase tracking-[0.12em]"
              cursorLabel="CHAT"
            >
              <MessageCircle className="h-4 w-4 text-[#ff8a1f]" />
              WhatsApp me
            </MagneticButton>
          </div>
        </div>

        {/* Bottom Viewfinder HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-4 font-mono text-[11px] tracking-[0.18em] text-[#9e998e] uppercase sm:text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span>{SITE_INFO.shortLocation}</span>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <span className="text-[#f5f2eb]/80">Remote Worldwide</span>
          </div>

          <a
            href="#stats"
            className="group inline-flex items-center gap-2 text-[#f5f2eb]/75 transition-colors hover:text-[#ff8a1f]"
          >
            <span>Scroll to reel</span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
