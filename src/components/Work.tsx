import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, ExternalLink, Clock, X, Film } from "lucide-react";
import { SELECTED_WORK, type VideoWorkItem } from "../data";
import {
  extractYouTubeVideoId,
  getExternalPlatformLabel,
  getYouTubeEmbedUrl,
} from "../utils/video";

gsap.registerPlugin(ScrollTrigger);

const PALETTE_GRADIENTS: Record<NonNullable<VideoWorkItem["palette"]>, string> = {
  amber:
    "radial-gradient(circle at 28% 28%, rgba(255, 110, 31, 0.34), rgba(24, 17, 13, 0.94) 58%, #0d0c0b 100%)",
  ember:
    "radial-gradient(circle at 72% 24%, rgba(255, 78, 31, 0.32), rgba(26, 15, 13, 0.94) 56%, #0c0b0b 100%)",
  copper:
    "radial-gradient(circle at 35% 70%, rgba(235, 128, 42, 0.3), rgba(20, 18, 15, 0.95) 60%, #0d0d0c 100%)",
  gold:
    "radial-gradient(circle at 65% 32%, rgba(255, 176, 32, 0.3), rgba(24, 20, 14, 0.94) 56%, #0c0c0b 100%)",
  crimson:
    "radial-gradient(circle at 30% 35%, rgba(214, 72, 42, 0.28), rgba(22, 14, 14, 0.95) 58%, #0c0b0b 100%)",
  ochre:
    "radial-gradient(circle at 62% 68%, rgba(255, 142, 36, 0.28), rgba(22, 18, 13, 0.95) 58%, #0c0c0b 100%)",
};

function VideoCardArtwork({ item, index }: { item: VideoWorkItem; index: number }) {
  const palette = item.palette ?? "amber";
  const isVertical = item.aspect === "9:16";

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: PALETTE_GRADIENTS[palette] }}
    >
      {/* Subtle cinema frame grid & aperture SVG */}
      <svg
        viewBox={isVertical ? "0 0 320 560" : "0 0 560 320"}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-30 transition-transform duration-700 ease-out group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`wave-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ffb020" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Rule of thirds hairlines */}
        <line
          x1={isVertical ? "106" : "186"}
          y1="0"
          x2={isVertical ? "106" : "186"}
          y2={isVertical ? "560" : "320"}
          stroke="#f5f2eb"
          strokeOpacity="0.08"
        />
        <line
          x1={isVertical ? "213" : "373"}
          y1="0"
          x2={isVertical ? "213" : "373"}
          y2={isVertical ? "560" : "320"}
          stroke="#f5f2eb"
          strokeOpacity="0.08"
        />
        <line
          x1="0"
          y1={isVertical ? "186" : "106"}
          x2={isVertical ? "320" : "560"}
          y2={isVertical ? "186" : "106"}
          stroke="#f5f2eb"
          strokeOpacity="0.08"
        />
        <line
          x1="0"
          y1={isVertical ? "373" : "213"}
          x2={isVertical ? "320" : "560"}
          y2={isVertical ? "373" : "213"}
          stroke="#f5f2eb"
          strokeOpacity="0.08"
        />

        {/* Optical lens ring */}
        <circle
          cx={isVertical ? "160" : "280"}
          cy={isVertical ? "250" : "150"}
          r={isVertical ? "94" : "96"}
          fill="none"
          stroke="#ff8a1f"
          strokeOpacity="0.32"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        {/* Subtle editing audio timeline bars along lower third */}
        {Array.from({ length: isVertical ? 18 : 30 }).map((_, i) => {
          const x = isVertical ? 26 + i * 15 : 32 + i * 17;
          const h = 10 + ((i * 19 + index * 13) % 34);
          const yBase = isVertical ? 458 : 254;
          return (
            <rect
              key={i}
              x={x}
              y={yBase - h / 2}
              width="3"
              height={h}
              rx="1.5"
              fill={`url(#wave-${index})`}
            />
          );
        })}
      </svg>

      {/* Bottom dark gradient scrim for crisp text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20"
      />
    </div>
  );
}

export function Work() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeVideo, setActiveVideo] = useState<{
    item: VideoWorkItem;
    youtubeId: string;
  } | null>(null);

  // Desktop pinned horizontal film strip via GSAP ScrollTrigger
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const pinEl = pinRef.current;
        const trackEl = trackRef.current;
        if (!pinEl || !trackEl) return;

        const getScrollDistance = () => {
          const viewportW = pinEl.clientWidth;
          const trackW = trackEl.scrollWidth;
          return Math.max(0, trackW - viewportW + 80);
        };

        const tween = gsap.to(trackEl, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${Math.max(900, getScrollDistance() * 1.05)}`,
            pin: true,
            scrub: 0.75,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              setProgress(self.progress);
            },
          },
        });

        return () => {
          tween.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  // Modal keyboard & body scroll lock
  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo]);

  const activeFrameNumber = Math.min(
    SELECTED_WORK.length,
    Math.max(1, Math.round(progress * (SELECTED_WORK.length - 1)) + 1)
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative border-y border-white/[0.08] bg-[#0c0c0c]"
    >
      <div
        ref={pinRef}
        className="flex flex-col justify-center overflow-hidden py-16 lg:min-h-[100svh] lg:py-10"
      >
        {/* Section Header */}
        <div className="mx-auto mb-8 flex w-full max-w-[1320px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 lg:mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase">
              Selected Work
            </p>
            <h2 className="mt-2 font-display text-5xl leading-[0.94] tracking-[0.02em] text-[#f5f2eb] uppercase sm:text-6xl lg:text-7xl">
              On the timeline
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="max-w-sm text-sm text-[#9e998e] sm:text-right">
              A mix of 16:9 YouTube stories, 9:16 vertical reels, and brand promos.
            </p>
            {/* Desktop horizontal film progress readout */}
            <div className="hidden items-center gap-3 font-mono text-xs tracking-[0.18em] text-[#9e998e] lg:flex">
              <span className="tabular-nums text-[#f5f2eb]">
                0{activeFrameNumber} / 0{SELECTED_WORK.length}
              </span>
              <span className="h-[2px] w-28 overflow-hidden bg-white/10">
                <span
                  className="block h-full origin-left bg-amber-gradient transition-transform duration-75"
                  style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Continuous 35mm Film Strip Container */}
        <div className="relative w-full border-y border-white/[0.09] bg-[#0a0a0a]">
          {/* Top 35mm Sprocket Holes Rail */}
          <div
            aria-hidden="true"
            className="sprocket-rail-horizontal w-full border-b border-white/[0.08]"
          />

          {/* Horizontal Film Track (GSAP-scrubbed on desktop, touch-scroll on mobile/tablet) */}
          <div className="film-scrollbar overflow-x-auto px-5 py-7 sm:px-8 lg:overflow-visible lg:px-14 lg:py-8">
            <div
              ref={trackRef}
              className="flex w-max items-center gap-6 sm:gap-8 lg:gap-10"
            >
              {SELECTED_WORK.map((item, idx) => {
                const isVertical = item.aspect === "9:16";
                const trimmedUrl = item.url.trim();
                const hasUrl = trimmedUrl.length > 0;
                const youtubeId = hasUrl ? extractYouTubeVideoId(trimmedUrl) : null;
                const isEmbeddableYouTube = Boolean(youtubeId);

                const frameCode = `0${idx + 1}A`;
                const cardDimensions = isVertical
                  ? "w-[252px] sm:w-[276px] lg:w-[290px]"
                  : "w-[310px] sm:w-[450px] lg:w-[520px]";
                const mediaHeight = "h-[360px] sm:h-[400px] lg:h-[430px]";

                const cardInner = (
                  <>
                    {/* Film Frame Top Strip */}
                    <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#111111] px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#9e998e] uppercase">
                      <span className="text-[#ff8a1f]">FRAME {frameCode}</span>
                      <span>
                        {item.category} · {item.aspect}
                      </span>
                    </div>

                    {/* Visual Frame Area */}
                    <div
                      className={`relative w-full overflow-hidden ${mediaHeight}`}
                    >
                      <VideoCardArtwork item={item} index={idx} />

                      {/* Viewfinder inner brackets */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-3.5 left-3.5 h-3.5 w-3.5 border-t border-l border-white/30 transition-colors duration-200 group-hover:border-[#ff8a1f]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-3.5 right-3.5 h-3.5 w-3.5 border-t border-r border-white/30 transition-colors duration-200 group-hover:border-[#ff8a1f]"
                      />

                      {/* Center Play / Coming Soon Control */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {hasUrl ? (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#ff8a1f]/70 bg-[#0a0a0a]/75 text-[#f5f2eb] shadow-[0_0_32px_rgba(255,90,31,0.3)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-amber-gradient group-hover:text-[#0a0a0a]">
                            {isEmbeddableYouTube ? (
                              <Play className="ml-0.5 h-6 w-6 fill-current" />
                            ) : (
                              <ExternalLink className="h-5 w-5" />
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 rounded-sm border border-white/15 bg-[#0a0a0a]/80 px-5 py-3.5 text-center backdrop-blur-md">
                            <Clock className="h-4 w-4 text-[#ff8a1f]" />
                            <span className="font-mono text-[11px] tracking-[0.2em] text-[#f5f2eb] uppercase">
                              Coming soon
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Metadata Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[#f5f2eb]/70 uppercase">
                          <span>{item.category}</span>
                          {item.duration && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{item.duration}</span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-1.5 font-display text-2xl leading-[1.04] tracking-[0.03em] text-[#f5f2eb] uppercase sm:text-[1.7rem]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-xs text-[#9e998e]">
                          {!hasUrl
                            ? "Reel edit in progress"
                            : isEmbeddableYouTube
                              ? "Play in theater modal"
                              : getExternalPlatformLabel(trimmedUrl)}
                        </p>
                      </div>
                    </div>
                  </>
                );

                // Case 1: Empty URL -> Coming soon static film card
                if (!hasUrl) {
                  return (
                    <article
                      key={`${item.title}-${idx}`}
                      className={`group relative flex shrink-0 flex-col overflow-hidden rounded-sm border border-white/[0.1] bg-[#111111] opacity-90 ${cardDimensions}`}
                    >
                      {cardInner}
                    </article>
                  );
                }

                // Case 2: Embeddable YouTube video -> opens cinema modal player
                if (isEmbeddableYouTube && youtubeId) {
                  return (
                    <button
                      key={`${item.title}-${idx}`}
                      type="button"
                      data-cursor="PLAY"
                      onClick={() => setActiveVideo({ item, youtubeId })}
                      className={`group relative flex shrink-0 flex-col overflow-hidden rounded-sm border border-white/[0.1] bg-[#111111] text-left transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#ff7a1f]/60 hover:shadow-[0_14px_40px_rgba(255,90,31,0.14)] cursor-pointer ${cardDimensions}`}
                    >
                      {cardInner}
                    </button>
                  );
                }

                // Case 3: External link (Instagram, Google Drive, YouTube channel) -> new tab
                return (
                  <a
                    key={`${item.title}-${idx}`}
                    href={trimmedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="OPEN"
                    className={`group relative flex shrink-0 flex-col overflow-hidden rounded-sm border border-white/[0.1] bg-[#111111] text-left transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#ff7a1f]/60 hover:shadow-[0_14px_40px_rgba(255,90,31,0.14)] ${cardDimensions}`}
                  >
                    {cardInner}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom 35mm Sprocket Holes Rail */}
          <div
            aria-hidden="true"
            className="sprocket-rail-horizontal w-full border-t border-white/[0.08]"
          />
        </div>

        {/* Mobile swipe hint */}
        <div className="mx-auto mt-4 flex w-full max-w-[1320px] items-center justify-between px-5 font-mono text-[11px] tracking-[0.18em] text-[#9e998e] uppercase sm:px-8 lg:hidden">
          <span className="inline-flex items-center gap-2">
            <Film className="h-3.5 w-3.5 text-[#ff8a1f]" />
            Swipe strip horizontally
          </span>
          <span>0{SELECTED_WORK.length} Reels</span>
        </div>
      </div>

      {/* Fullscreen YouTube Video Player Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.item.title}
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full overflow-hidden rounded-sm border border-white/15 bg-[#101010] shadow-2xl ${
              activeVideo.item.aspect === "9:16"
                ? "max-w-[400px]"
                : "max-w-4xl"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-3.5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#ff8a1f] uppercase">
                  {activeVideo.item.category} · {activeVideo.item.aspect}
                </p>
                <h3 className="truncate font-display text-2xl tracking-[0.04em] text-[#f5f2eb] uppercase">
                  {activeVideo.item.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#f5f2eb] transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Responsive Embedded YouTube Player */}
            <div
              className={`relative w-full bg-black ${
                activeVideo.item.aspect === "9:16"
                  ? "aspect-[9/16] max-h-[75svh]"
                  : "aspect-video"
              }`}
            >
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.youtubeId)}
                title={activeVideo.item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
