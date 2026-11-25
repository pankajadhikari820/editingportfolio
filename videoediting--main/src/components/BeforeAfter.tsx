import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MoveHorizontal, Sliders, Play, Sparkles } from "lucide-react";
import { BEFORE_AFTER_VIDEOS, COMPARE_ITEMS, type BeforeAfterVideoItem } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { SpotlightCard } from "./SpotlightCard";
import { CinemaModal, type CinemaModalVideo } from "./CinemaModal";

type LabMode = "videos" | "slider";

function BreakdownVideoCard({
  item,
  index,
  onPlay,
}: {
  item: BeforeAfterVideoItem;
  index: number;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const { reducedMotion, saveData, canHoverFine } = useDeviceCapabilities();

  const canPreview = !reducedMotion && !saveData;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: reducedMotion ? 0 : index * 0.1 }}
    >
      <SpotlightCard
        onMouseEnter={() => {
          setHovering(true);
          if (canPreview && canHoverFine && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onMouseLeave={() => {
          setHovering(false);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }}
        className="group hover:-translate-y-1 hover:border-[var(--accent-solid)]/70"
      >
        <button
          type="button"
          onClick={onPlay}
          data-cursor="PLAY"
          className="flex w-full flex-col text-left cursor-pointer sm:flex-row"
        >
          {/* 9:16 Vertical Video Breakdown Preview */}
          <div className="relative aspect-[9/13] max-h-[380px] w-full shrink-0 overflow-hidden bg-black sm:aspect-[9/14] sm:max-h-none sm:w-[220px]">
            <img
              src={item.posterUrl}
              alt={item.title}
              width={720}
              height={1280}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {canPreview && (
              <video
                ref={videoRef}
                src={item.videoUrl}
                poster={item.posterUrl}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  hovering ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-gradient text-[var(--accent-contrast)] shadow-xl transition-transform duration-200 group-hover:scale-110">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </div>
            <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 font-mono text-[10px] text-white tabular-nums backdrop-blur-md">
              {item.duration}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-solid)]/40 bg-[var(--accent-start)]/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-[var(--accent-solid)] uppercase">
                <Sparkles className="h-3 w-3" />
                Real Edit Breakdown
              </span>
              <h3 className="mt-3 font-display text-2xl leading-[1.04] tracking-[0.03em] text-[var(--text-primary)] uppercase sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.subtitle}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3.5 font-mono text-[11px] uppercase">
              <span className="truncate text-[var(--text-muted)]">{item.specs}</span>
              <span className="shrink-0 text-[var(--accent-solid)]">Watch →</span>
            </div>
          </div>
        </button>
      </SpotlightCard>
    </motion.div>
  );
}

export function BeforeAfter() {
  const [mode, setMode] = useState<LabMode>("videos");
  const [activeTabId, setActiveTabId] = useState(COMPARE_ITEMS[0]?.id ?? "color-grade");
  const [position, setPosition] = useState(52);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const { reducedMotion } = useDeviceCapabilities();

  const activeItem =
    COMPARE_ITEMS.find((item) => item.id === activeTabId) ?? COMPARE_ITEMS[0];

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(4, Math.min(96, Math.round(pct))));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(4, p - 4));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(96, p + 4));
    }
  };

  const breakdownPlaylist: CinemaModalVideo[] = BEFORE_AFTER_VIDEOS.map((v) => ({
    id: v.id,
    localVideoUrl: v.videoUrl,
    posterUrl: v.posterUrl,
    title: v.title,
    subtitle: v.specs,
    aspect: "9:16",
  }));

  return (
    <section
      id="lab"
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
              Before / After Lab
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase">
              Raw Footage → Final Polish
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              Inspect real side-by-side edit breakdowns and test the interactive log-to-grade comparison slider.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Before and After Lab view"
            className="inline-flex self-start rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] p-1 lg:self-end"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "videos"}
              onClick={() => setMode("videos")}
              className={`min-h-[40px] rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer ${
                mode === "videos"
                  ? "bg-amber-gradient font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Video Breakdowns ({BEFORE_AFTER_VIDEOS.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "slider"}
              onClick={() => setMode("slider")}
              className={`min-h-[40px] rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer ${
                mode === "slider"
                  ? "bg-amber-gradient font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Color Grade Slider
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === "videos" ? (
            <motion.div
              key="lab-videos"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              {BEFORE_AFTER_VIDEOS.map((item, idx) => (
                <BreakdownVideoCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onPlay={() => setModalIndex(idx)}
                />
              ))}
            </motion.div>
          ) : (
            activeItem && (
              <motion.div
                key="lab-slider"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-10 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[var(--text-secondary)]">
                    {activeItem.description}
                  </p>
                  <div className="inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] p-1">
                    {COMPARE_ITEMS.map((item) => {
                      const selected = item.id === activeItem.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTabId(item.id);
                            setPosition(52);
                          }}
                          className={`min-h-[36px] rounded-full px-3.5 py-1 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors cursor-pointer ${
                            selected
                              ? "bg-amber-gradient font-semibold"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {item.tabLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] text-[var(--text-muted)] uppercase sm:px-5">
                    <span className="inline-flex items-center gap-2 text-[var(--accent-solid)]">
                      <Sliders className="h-3.5 w-3.5" />
                      {activeItem.specs}
                    </span>
                    <span className="tabular-nums">Split: {position}%</span>
                  </div>

                  <div
                    ref={containerRef}
                    role="slider"
                    tabIndex={0}
                    aria-label={`Before and after comparison for ${activeItem.title}`}
                    aria-valuemin={4}
                    aria-valuemax={96}
                    aria-valuenow={position}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onKeyDown={handleKeyDown}
                    data-cursor="DRAG"
                    className="relative aspect-video w-full touch-pan-y select-none overflow-hidden bg-[#0a0a0a] cursor-ew-resize"
                  >
                    <img
                      src={activeItem.afterImage}
                      alt={`${activeItem.title} — ${activeItem.afterLabel}`}
                      width={1280}
                      height={720}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="pointer-events-none h-full w-full object-cover"
                    />

                    <div
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                    >
                      <img
                        src={activeItem.beforeImage}
                        alt={`${activeItem.title} — ${activeItem.beforeLabel}`}
                        width={1280}
                        height={720}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <span className="pointer-events-none absolute top-3 left-3 rounded-md border border-white/20 bg-black/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-white uppercase backdrop-blur-sm sm:top-4 sm:left-4">
                      {activeItem.beforeLabel}
                    </span>
                    <span className="pointer-events-none absolute top-3 right-3 rounded-md border border-[var(--accent-solid)]/60 bg-black/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-[var(--accent-solid)] uppercase backdrop-blur-sm sm:top-4 sm:right-4">
                      {activeItem.afterLabel}
                    </span>

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--accent-solid)] shadow-[0_0_16px_var(--accent-glow)]"
                      style={{ left: `${position}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[var(--accent-start)] text-white shadow-xl">
                        <MoveHorizontal className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      <CinemaModal
        videos={breakdownPlaylist}
        activeIndex={modalIndex}
        onClose={() => setModalIndex(null)}
        onChangeIndex={setModalIndex}
      />
    </section>
  );
}
