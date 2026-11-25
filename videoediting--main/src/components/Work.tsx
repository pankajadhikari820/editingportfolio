import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Play,
  ExternalLink,
  Volume2,
  Sparkles,
  Film,
} from "lucide-react";
import { YouTubeIcon } from "./BrandIcons";
import {
  ALL_CLIENTS,
  SELECTED_WORK,
  type ClientItem,
  type VideoCategory,
  type VideoWorkItem,
} from "../data";
import { useCreator } from "../hooks/useCreator";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { extractYouTubeVideoId } from "../utils/video";
import { CreatorAvatar } from "./CreatorAvatar";
import { SpotlightCard } from "./SpotlightCard";
import { CinemaModal, type CinemaModalVideo } from "./CinemaModal";

type FilterOption = "All" | VideoCategory;

const CATEGORIES: FilterOption[] = [
  "All",
  "YouTube & Long-form",
  "Reels & Shorts",
  "Brand & Ads",
  "Travel & Events",
  "Podcast & Talking",
];

function ShowcaseCard({
  item,
  index,
  wideSpanClass,
  onPlay,
}: {
  item: VideoWorkItem;
  index: number;
  wideSpanClass: string;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const [thumbFallback, setThumbFallback] = useState(false);
  const { reducedMotion, saveData, canHoverFine } = useDeviceCapabilities();

  const matchedClient: ClientItem | undefined = useMemo(() => {
    if (!item.client) return undefined;
    const normalized = item.client.trim().toLowerCase();
    return ALL_CLIENTS.find((c) => c.name.toLowerCase() === normalized);
  }, [item.client]);

  const { data: creatorData, loading: creatorLoading } = useCreator(
    matchedClient?.youtubeHandle,
    matchedClient?.youtubeChannelId
  );

  const ytId = item.url ? extractYouTubeVideoId(item.url) : null;
  const isWide = item.aspect === "16:9";
  const canPreviewVideo = Boolean(item.videoUrl && !reducedMotion && !saveData);

  const resolvedPoster = useMemo(() => {
    if (thumbFallback && ytId) {
      return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    }
    return item.posterUrl;
  }, [thumbFallback, ytId, item.posterUrl]);

  const handleEnter = () => {
    setHovering(true);
    if (canPreviewVideo && canHoverFine && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay promise rejections
      });
    }
  };

  const handleLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const avatarSrc = creatorData?.channel.avatarUrl || matchedClient?.logoUrl;
  const initials =
    matchedClient?.initials ||
    (item.client
      ? item.client
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() ?? "")
          .join("")
      : "PV");

  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.4,
        delay: reducedMotion ? 0 : Math.min((index % 3) * 0.06, 0.18),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={isWide ? wideSpanClass : "col-span-1 lg:col-span-4"}
    >
      <SpotlightCard
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="group h-full hover:-translate-y-1 hover:border-[var(--accent-solid)]/70 hover:shadow-[0_20px_50px_-15px_var(--accent-glow)]"
      >
        <div className="flex h-full flex-col">
          {/* Interactive Video Stage */}
          <button
            type="button"
            onClick={onPlay}
            data-cursor="WATCH"
            aria-label={`Play ${item.title}`}
            className={`relative block w-full overflow-hidden bg-[#080808] text-left cursor-pointer ${
              isWide
                ? "aspect-video"
                : "aspect-[4/5] sm:aspect-[9/14] lg:aspect-[9/15]"
            }`}
          >
            {resolvedPoster && (
              <img
                src={resolvedPoster}
                alt={item.title}
                width={isWide ? 1280 : 720}
                height={isWide ? 720 : 1280}
                loading="lazy"
                decoding="async"
                onError={() => {
                  if (!thumbFallback && ytId) setThumbFallback(true);
                }}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            )}

            {canPreviewVideo && item.videoUrl && (
              <video
                ref={videoRef}
                src={item.videoUrl}
                poster={resolvedPoster}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  hovering ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/22 to-black/45"
            />

            {/* Top Glass HUD Row */}
            <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white/95 uppercase backdrop-blur-md">
                {ytId ? (
                  <YouTubeIcon className="h-3.5 w-3.5 text-[#ff0033]" />
                ) : (
                  item.featured && <Sparkles className="h-2.5 w-2.5 text-[#ffb020]" />
                )}
                <span>{item.category}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white/90 tabular-nums backdrop-blur-md">
                <span>{item.aspect}</span>
                {item.duration && (
                  <>
                    <span className="opacity-40">·</span>
                    <span>{item.duration}</span>
                  </>
                )}
              </span>
            </div>

            {/* Center Play Pill */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`flex items-center gap-2 rounded-full border border-white/25 bg-black/65 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-amber-gradient group-hover:text-[var(--accent-contrast)] ${
                  hovering ? "opacity-95" : "opacity-90"
                }`}
              >
                <Play className="h-5 w-5 fill-current" />
                {isWide && (
                  <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase">
                    Watch Cut
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              {item.client && (
                <div className="mb-2 flex items-center gap-2">
                  <CreatorAvatar
                    src={avatarSrc}
                    initials={initials}
                    name={item.client}
                    loading={Boolean(matchedClient && creatorLoading)}
                    size="xs"
                  />
                  <span className="truncate font-mono text-[10px] tracking-[0.14em] text-white/85 uppercase">
                    {item.client}
                  </span>
                </div>
              )}

              <h3
                className={`line-clamp-2 font-display leading-[1.04] tracking-[0.03em] text-white uppercase ${
                  isWide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                }`}
              >
                {item.title}
              </h3>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/85 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </button>

          {/* Bottom Card Footer Bar */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-4 py-2.5 text-xs">
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex min-h-[40px] items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] text-[var(--accent-solid)] uppercase hover:underline cursor-pointer"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>{ytId ? "Play in theater" : "Play with sound"}</span>
            </button>

            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.client ?? item.title} page`}
                className="inline-flex min-h-[40px] items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase transition-colors hover:text-[var(--text-primary)]"
              >
                <span>{ytId ? "YouTube" : "Client Page"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase">
                Studio Cut
              </span>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export function Work() {
  const [activeCategory, setActiveCategory] = useState<FilterOption>("All");
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return SELECTED_WORK;
    return SELECTED_WORK.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const wideSpanById = useMemo(() => {
    const wideItems = filteredItems.filter((i) => i.aspect === "16:9");
    const map = new Map<string, string>();
    wideItems.forEach((item, wideIdx) => {
      const isLastOddWide =
        wideItems.length % 2 === 1 && wideIdx === wideItems.length - 1;
      map.set(
        item.id,
        isLastOddWide
          ? "col-span-1 sm:col-span-2 lg:col-span-12"
          : "col-span-1 sm:col-span-2 lg:col-span-6"
      );
    });
    return map;
  }, [filteredItems]);

  const modalPlaylist: CinemaModalVideo[] = useMemo(
    () =>
      filteredItems.map((item) => {
        const ytId = item.url ? extractYouTubeVideoId(item.url) : null;
        return {
          id: item.id,
          localVideoUrl: item.videoUrl,
          posterUrl: item.posterUrl,
          youtubeId: !item.videoUrl && ytId ? ytId : undefined,
          externalUrl: item.url || undefined,
          title: item.title,
          subtitle: `${item.category} · ${item.aspect}${item.client ? ` · ${item.client}` : ""}`,
          aspect: item.aspect,
        };
      }),
    [filteredItems]
  );

  return (
    <section
      id="work"
      className="relative border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        {/* Editorial Header + Category Filter Pills */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[var(--accent-solid)] uppercase">
              <Film className="h-3 w-3" />
              <span>Selected Cuts · {SELECTED_WORK.length} Videos</span>
            </div>

            <h2 className="mt-3 font-display text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.92] tracking-[0.02em] text-[var(--text-primary)] uppercase">
              Creative <span className="text-amber-gradient">Reel Gallery</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              YouTube long-form edits, viral reels, brand ads, and event films. Hover for a live preview or click to play in theater mode.
            </p>
          </div>

          {/* Responsive Category Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter portfolio videos by category"
            className="film-scrollbar flex w-full flex-nowrap gap-1.5 overflow-x-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-1.5 sm:w-auto sm:flex-wrap sm:overflow-visible"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              const count =
                category === "All"
                  ? SELECTED_WORK.length
                  : SELECTED_WORK.filter((i) => i.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveCategory(category);
                    setModalIndex(null);
                  }}
                  className={`relative min-h-[40px] shrink-0 whitespace-nowrap rounded-xl px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors cursor-pointer sm:px-3.5 sm:text-[11px] ${
                    active
                      ? "font-semibold text-[var(--accent-contrast)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="bg-amber-gradient absolute inset-0 -z-0 rounded-xl shadow-sm"
                    />
                  )}
                  <span className="relative z-10">
                    {category} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Bento Grid (1-col mobile, 2-col tablet, 12-col laptop) */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <ShowcaseCard
                key={item.id}
                item={item}
                index={idx}
                wideSpanClass={
                  wideSpanById.get(item.id) ?? "col-span-1 sm:col-span-2 lg:col-span-6"
                }
                onPlay={() => setModalIndex(idx)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <CinemaModal
        videos={modalPlaylist}
        activeIndex={modalIndex}
        onClose={() => setModalIndex(null)}
        onChangeIndex={setModalIndex}
      />
    </section>
  );
}
