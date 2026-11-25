import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Play, Volume2 } from "lucide-react";
import { HERO_SHOWREEL, SITE_INFO } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { buildWhatsAppUrl, extractYouTubeVideoId } from "../utils/video";
import {
  AfterEffectsIcon,
  CapCutIcon,
  PremiereProIcon,
  WhatsAppIcon,
} from "./BrandIcons";
import { MagneticButton } from "./MagneticButton";
import { CinemaModal, type CinemaModalVideo } from "./CinemaModal";

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
  const [reelOpen, setReelOpen] = useState(false);

  const { reducedMotion, lowPowerDevice, saveData } = useDeviceCapabilities();
  const showreelYoutubeId = extractYouTubeVideoId(HERO_SHOWREEL.url);
  const hasShowreelMedia = Boolean(HERO_SHOWREEL.localVideoUrl || showreelYoutubeId);

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 12 * 24 + 8;
    const interval = window.setInterval(() => {
      frame += 1;
      setTimecode(formatTimecode(frame));
    }, 1000 / 24);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    if (!ready || !sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal-line",
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.82,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform",
        }
      );

      gsap.fromTo(
        ".hero-fade-up",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.09,
          delay: 0.22,
          ease: "power3.out",
          clearProps: "transform",
        }
      );

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop && !lowPowerDevice && viewfinderRef.current) {
        gsap.to(viewfinderRef.current, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (isDesktop && !lowPowerDevice && glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: 18,
          scale: 1.06,
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
  }, [ready, reducedMotion, lowPowerDevice]);

  const whatsappHref = buildWhatsAppUrl({
    customText:
      "Hi Pankaj, I visited your portfolio and would like to discuss a video editing project.",
  });

  const showreelModalList: CinemaModalVideo[] = hasShowreelMedia
    ? [
        {
          id: "hero-showreel",
          localVideoUrl: HERO_SHOWREEL.localVideoUrl || undefined,
          posterUrl: HERO_SHOWREEL.posterUrl || undefined,
          youtubeId: showreelYoutubeId || undefined,
          title: HERO_SHOWREEL.title,
          subtitle: HERO_SHOWREEL.specs,
          aspect: HERO_SHOWREEL.aspect,
        },
      ]
    : [];

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden px-3.5 pt-20 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-24 sm:pb-8"
    >
      {/* Ambient cinematic aperture light behind viewfinder */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, var(--accent-glow) 0%, transparent 72%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 h-px bg-[var(--border-subtle)] sm:top-[72px]"
      />

      {/* Main Viewfinder Frame Container */}
      <div
        ref={viewfinderRef}
        className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/45 p-4 backdrop-blur-[2px] sm:p-8 lg:p-11"
      >
        {/* Camera Viewfinder Corner Brackets */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -left-px h-5 w-5 rounded-tl-xl border-t-2 border-l-2 border-[var(--accent-solid)] sm:h-6 sm:w-6"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -right-px h-5 w-5 rounded-tr-xl border-t-2 border-r-2 border-[var(--accent-solid)] sm:h-6 sm:w-6"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px -left-px h-5 w-5 rounded-bl-xl border-b-2 border-l-2 border-[var(--accent-solid)] sm:h-6 sm:w-6"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 rounded-br-xl border-b-2 border-r-2 border-[var(--accent-solid)] sm:h-6 sm:w-6"
        />

        {/* Top Viewfinder HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] text-[var(--text-muted)] uppercase sm:text-xs">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-2 text-[var(--text-primary)]">
              <span
                aria-hidden="true"
                className="animate-rec-blink inline-block h-2.5 w-2.5 rounded-full bg-[#ff3b1f] shadow-[0_0_10px_rgba(255,59,31,0.9)]"
              />
              REC
            </span>
            <span aria-hidden="true" className="opacity-30">
              ·
            </span>
            <span className="tabular-nums text-[var(--text-primary)]">{timecode}</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              aria-label="Premiere Pro, After Effects, CapCut"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-primary)]/80 px-2.5 py-1"
            >
              <PremiereProIcon className="h-4 w-4 rounded-[4px]" />
              <AfterEffectsIcon className="h-4 w-4 rounded-[4px]" />
              <CapCutIcon className="h-4 w-4 rounded-[4px]" />
            </div>
            <span className="hidden sm:inline">24 FPS · 4K MASTER</span>
          </div>
        </div>

        {/* Center Hero Headline & Prominent Broadcast Video Monitor */}
        <div className="my-auto grid grid-cols-1 items-center gap-8 py-6 sm:py-10 lg:grid-cols-12 lg:gap-10 lg:py-8">
          <div className="lg:col-span-6">
            <p className="hero-fade-up mb-3 font-mono text-[11px] tracking-[0.22em] text-[var(--accent-solid)] uppercase sm:mb-4 sm:text-[13px]">
              {SITE_INFO.name} · {SITE_INFO.role}
            </p>

            <h1 className="font-display text-[clamp(2.75rem,8.5vw,5.4rem)] leading-[0.9] tracking-[0.02em] text-[var(--text-primary)] uppercase [text-wrap:balance] lg:text-[clamp(3.3rem,5.2vw,5.6rem)]">
              <span className="block overflow-hidden pb-1">
                <span className="hero-reveal-line block">I make videos</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-reveal-line block">
                  people <span className="text-amber-gradient">finish.</span>
                </span>
              </span>
            </h1>

            <p className="hero-fade-up mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-6 sm:text-base lg:text-[17px]">
              {SITE_INFO.heroSubtitle}
            </p>

            <div className="hero-fade-up mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <MagneticButton
                href="#work"
                variant="primary"
                className="w-full px-7 py-3.5 text-sm uppercase tracking-[0.12em] sm:w-auto"
                cursorLabel="WATCH"
              >
                <Play className="h-4 w-4 fill-current" />
                Explore cuts
              </MagneticButton>

              <MagneticButton
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full px-7 py-3.5 text-sm uppercase tracking-[0.12em] sm:w-auto"
                cursorLabel="CHAT"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                WhatsApp me
              </MagneticButton>
            </div>
          </div>

          {/* Large Cinema Showreel Monitor Card */}
          <div className="hero-fade-up lg:col-span-6">
            <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[#0b0b0b] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.85)] transition-all duration-300 hover:border-[var(--accent-solid)]/80 hover:shadow-[0_24px_70px_-15px_var(--accent-glow)]">
              {/* Pro NLE Monitor Top Chrome Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] bg-[#121212] px-3.5 py-2.5 font-mono text-[10px] tracking-[0.16em] text-[#b4afa6] uppercase sm:px-4">
                <span className="inline-flex items-center gap-2 text-[#f5f2eb]">
                  <span className="h-2 w-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
                  PROGRAM MONITOR · SHOWREEL
                </span>
                <span className="hidden text-[#9e998e] sm:inline">16:9 · 4K MASTER</span>
              </div>

              <button
                type="button"
                onClick={() => setReelOpen(true)}
                data-cursor="PLAY"
                aria-label={`Play ${HERO_SHOWREEL.title}`}
                className="group relative block w-full bg-black text-left cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {HERO_SHOWREEL.localVideoUrl && !reducedMotion && !saveData ? (
                    <video
                      src={HERO_SHOWREEL.localVideoUrl}
                      poster={HERO_SHOWREEL.posterUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <img
                      src={
                        HERO_SHOWREEL.posterUrl ||
                        (showreelYoutubeId
                          ? `https://i.ytimg.com/vi/${showreelYoutubeId}/hqdefault.jpg`
                          : "/og-image.jpg")
                      }
                      alt={HERO_SHOWREEL.title}
                      width={1280}
                      height={720}
                      loading="eager"
                      className="h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />

                  {/* Safe-margin viewfinder corner ticks inside monitor */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 left-3 h-3.5 w-3.5 border-t border-l border-white/35"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 right-3 h-3.5 w-3.5 border-t border-r border-white/35"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-gradient text-[var(--accent-contrast)] shadow-2xl transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16">
                      <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                    </span>
                  </div>

                  <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.14em] text-white/95 uppercase sm:inset-x-4 sm:bottom-3.5 sm:text-[11px]">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                      <Volume2 className="h-3.5 w-3.5 text-[#ff8a1f]" />
                      Watch with sound
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/60 px-2.5 py-1 tabular-nums backdrop-blur-md">
                      {HERO_SHOWREEL.duration}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Viewfinder HUD Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3.5 font-mono text-[10px] tracking-[0.16em] text-[var(--text-muted)] uppercase sm:pt-4 sm:text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span>{SITE_INFO.shortLocation}</span>
            <span aria-hidden="true" className="opacity-30">
              ·
            </span>
            <span className="text-[var(--text-primary)]">Remote Worldwide</span>
          </div>

          <a
            href="#work"
            className="group inline-flex min-h-[44px] items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-solid)]"
          >
            <span>Scroll to cuts</span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Showreel Cinema Modal */}
      {hasShowreelMedia && (
        <CinemaModal
          videos={showreelModalList}
          activeIndex={reelOpen ? 0 : null}
          onClose={() => setReelOpen(false)}
        />
      )}
    </section>
  );
}
