import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Play,
  Eye,
  Users,
  Sparkles,
  ExternalLink,
  Youtube,
  CheckCircle2,
  Film,
} from "lucide-react";
import { FEATURED_YOUTUBE_CREATORS, SELECTED_WORK, type ClientItem } from "../data";
import { useCreator, type CreatorVideo } from "../hooks/useCreator";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { extractYouTubeVideoId, formatCompactNumber, formatSubscribers } from "../utils/video";
import { CreatorAvatar } from "./CreatorAvatar";
import { CinemaModal, type CinemaModalVideo } from "./CinemaModal";

type SpotlightFilter = "all" | "long" | "shorts";

interface ThumbnailImageProps {
  videoId: string;
  alt: string;
  isShort: boolean;
}

function YouTubeThumbnail({ videoId, alt, isShort }: ThumbnailImageProps) {
  const [useFallback, setUseFallback] = useState(false);

  const src = useFallback
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <img
      src={src}
      alt={alt}
      width={isShort ? 360 : 640}
      height={isShort ? 640 : 360}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!useFallback) setUseFallback(true);
      }}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

function CreatorSpotlightCard({
  client,
  filter,
  onlyEditedByMe,
  onOpenPlaylist,
}: {
  client: ClientItem;
  filter: SpotlightFilter;
  onlyEditedByMe: boolean;
  onOpenPlaylist: (videos: CinemaModalVideo[], startIndex: number) => void;
}) {
  const { data, loading } = useCreator(client.youtubeHandle, client.youtubeChannelId);

  const displayName = data?.channel.name || client.name;
  const avatarSrc = data?.channel.avatarUrl || client.logoUrl;
  const youtubeLink =
    client.links.find((l) => l.platform === "youtube")?.url ||
    (client.youtubeHandle ? `https://youtube.com/${client.youtubeHandle}` : "#");

  const featuredSet = useMemo(
    () => new Set((client.featuredVideoIds ?? []).map((id) => id.trim()).filter(Boolean)),
    [client.featuredVideoIds]
  );

  // Merge API videos with any manual featuredVideoIds not already in the top list
  const videos: CreatorVideo[] = useMemo(() => {
    const longList = data?.longForm ?? [];
    const shortList = data?.shorts ?? [];

    let selected: CreatorVideo[] = [];
    if (filter === "long") {
      selected = longList.slice(0, 3);
    } else if (filter === "shorts") {
      selected = shortList.slice(0, 3);
    } else {
      selected = [...longList, ...shortList]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 3);
    }

    // If API is unavailable or empty, hydrate manual featuredVideoIds so cards remain playable
    if (selected.length === 0 && featuredSet.size > 0) {
      selected = Array.from(featuredSet)
        .slice(0, 3)
        .map((id, idx) => {
          const matchedWork = SELECTED_WORK.find(
            (w) => extractYouTubeVideoId(w.url) === id
          );
          return {
            id,
            title: matchedWork?.title ?? `${displayName} — Featured Cut 0${idx + 1}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            fallbackThumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            viewCount: 0,
            duration: matchedWork?.duration ?? "YouTube",
            durationSeconds: 0,
            publishedAt: "",
            isShort: filter === "shorts",
          };
        });
    }

    if (onlyEditedByMe) {
      const existingIds = new Set(selected.map((v) => v.id));
      const allFetched = [...longList, ...shortList];
      const extraEdited = Array.from(featuredSet)
        .filter((id) => !existingIds.has(id))
        .map((id, idx) => {
          const found = allFetched.find((v) => v.id === id);
          if (found) return found;
          return {
            id,
            title: `${displayName} — Edited Cut 0${idx + 1}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            fallbackThumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            viewCount: 0,
            duration: "Featured",
            durationSeconds: 0,
            publishedAt: "",
            isShort: false,
          };
        });

      return [...selected, ...extraEdited]
        .filter((v) => featuredSet.has(v.id))
        .slice(0, 3);
    }

    return selected;
  }, [data, filter, onlyEditedByMe, featuredSet, displayName]);

  const modalQueue: CinemaModalVideo[] = useMemo(
    () =>
      videos.map((v) => ({
        id: v.id,
        youtubeId: v.id,
        title: v.title,
        subtitle: `${displayName} · ${v.isShort ? "Short (9:16)" : "Long-form (16:9)"}`,
        aspect: v.isShort ? "9:16" : "16:9",
      })),
    [videos, displayName]
  );

  const { reducedMotion } = useDeviceCapabilities();

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
    >
      {/* Top 35mm Sprocket Accent */}
      <div
        aria-hidden="true"
        className="sprocket-rail-horizontal w-full border-b border-white/[0.08]"
      />

      <div className="p-5 sm:p-7 lg:p-8">
        {/* Creator Card Header */}
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <CreatorAvatar
              src={avatarSrc}
              initials={client.initials}
              name={displayName}
              loading={loading}
              size="lg"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="truncate font-display text-3xl tracking-[0.04em] text-[#f5f2eb] uppercase sm:text-4xl">
                  {displayName}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff7a1f]/45 bg-[#ff5a1f]/12 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-[#ffb020] uppercase">
                  <Sparkles className="h-3 w-3" />
                  Edited by Pankaj
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[#9e998e]">
                <span>{data?.channel.handle || client.handle}</span>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#f5f2eb]/85">
                  <Users className="h-3.5 w-3.5 text-[#ff8a1f]" />
                  {loading
                    ? "Loading channel..."
                    : data
                      ? formatSubscribers(data.channel.subscribers, data.channel.hiddenSubscribers)
                      : client.spotlightRole || "YouTube Creator"}
                </span>
              </div>
            </div>
          </div>

          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="VISIT"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-xs tracking-[0.14em] text-[#f5f2eb] uppercase transition-colors hover:border-[#ff7a1f]/70 hover:text-[#ff8a1f] sm:self-center"
          >
            <Youtube className="h-4 w-4 text-[#ff5a1f]" />
            <span>Visit Channel</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Videos Grid */}
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-[0.18em] text-[#9e998e] uppercase">
            <span>
              {onlyEditedByMe
                ? "Videos tagged as Edited by Pankaj"
                : "Top videos from this channel"}
            </span>
            {!loading && videos.length > 0 && (
              <span className="text-[#ff8a1f]">
                0{videos.length}{" "}
                {filter === "shorts" ? "Shorts" : filter === "long" ? "Long-form" : "Top Cuts"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className="overflow-hidden rounded-sm border border-white/[0.08] bg-[#0c0c0c]"
                >
                  <div className="skeleton-shimmer aspect-video w-full" />
                  <div className="space-y-2.5 p-4">
                    <div className="skeleton-shimmer h-4 w-4/5 rounded-sm" />
                    <div className="skeleton-shimmer h-3 w-1/2 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${client.name}-${filter}-${onlyEditedByMe ? "edited" : "all"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {videos.map((video, idx) => {
                  const isEditedTag = featuredSet.has(video.id);
                  return (
                    <button
                      key={video.id}
                      type="button"
                      data-cursor="PLAY"
                      onClick={() => onOpenPlaylist(modalQueue, idx)}
                      className="group relative flex flex-col overflow-hidden rounded-sm border border-white/[0.09] bg-[#0c0c0c] text-left transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-1 hover:border-[#ff7a1f]/65 hover:shadow-[0_12px_32px_rgba(255,90,31,0.14)] cursor-pointer"
                    >
                      {/* Film Frame Strip */}
                      <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#141312] px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-[#9e998e] uppercase">
                        <span className="text-[#ff8a1f]">
                          {video.isShort ? "9:16 SHORT" : "16:9 VIDEO"}
                        </span>
                        <span className="tabular-nums">{video.duration}</span>
                      </div>

                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <YouTubeThumbnail
                          videoId={video.id}
                          alt={video.title}
                          isShort={video.isShort}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
                        />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ff8a1f]/75 bg-[#0a0a0a]/80 text-[#f5f2eb] backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:border-transparent group-hover:bg-amber-gradient group-hover:text-[#0a0a0a]">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </div>

                        {/* Optional Edited by Pankaj badge (strictly when in featuredVideoIds) */}
                        {isEditedTag && (
                          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-sm border border-[#ff7a1f]/60 bg-[#0a0a0a]/85 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-[#ffb020] uppercase backdrop-blur-sm">
                            <CheckCircle2 className="h-3 w-3" />
                            Edited by Pankaj
                          </span>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-[#f5f2eb] transition-colors group-hover:text-[#ff8a1f]">
                          {video.title}
                        </h4>

                        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono text-[11px] text-[#9e998e]">
                          <span className="inline-flex items-center gap-1.5 tabular-nums">
                            <Eye className="h-3.5 w-3.5 text-[#ff8a1f]" />
                            {video.viewCount > 0
                              ? `${formatCompactNumber(video.viewCount)} views`
                              : "Play in theater"}
                          </span>
                          <span className="text-[#f5f2eb]/70">Watch →</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-start justify-between gap-4 rounded-sm border border-dashed border-white/15 bg-[#0c0c0c] p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Film className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a1f]" />
                <div>
                  <p className="text-sm font-medium text-[#f5f2eb]">
                    {onlyEditedByMe && featuredSet.size === 0
                      ? `No individual video IDs are pinned in featuredVideoIds for ${displayName} yet.`
                      : `Explore ${displayName}'s videos directly on YouTube.`}
                  </p>
                  <p className="mt-1 text-xs text-[#9e998e]">
                    {onlyEditedByMe && featuredSet.size === 0
                      ? "Add specific YouTube video IDs to featuredVideoIds in src/data.ts or turn off the Edited by me filter to browse top channel uploads."
                      : "Live YouTube channel highlights appear automatically when YOUTUBE_API_KEY is configured on the server."}
                  </p>
                </div>
              </div>

              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs tracking-[0.14em] text-[#f5f2eb] uppercase transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f]"
              >
                Open YouTube
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function CreatorSpotlight() {
  const [filter, setFilter] = useState<SpotlightFilter>("all");
  const [onlyEditedByMe, setOnlyEditedByMe] = useState(false);
  const [modalState, setModalState] = useState<{
    videos: CinemaModalVideo[];
    index: number | null;
  }>({ videos: [], index: null });

  if (FEATURED_YOUTUBE_CREATORS.length === 0) {
    return null;
  }

  const filterTabs: Array<{ id: SpotlightFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "long", label: "Long-form" },
    { id: "shorts", label: "Shorts" },
  ];

  return (
    <section
      id="spotlight"
      className="relative border-b border-white/[0.08] bg-[#0a0a0a] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* Header + Controls */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase">
              Creator Spotlight
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.94] tracking-[0.02em] text-[#f5f2eb] uppercase [text-wrap:balance]">
              Channels I&apos;ve edited for
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9e998e] sm:text-base">
              Top videos from these channels — synced automatically from YouTube with live subscriber counts and direct theater playback.
            </p>
          </div>

          {/* Filter Tabs + Edited-by-me Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Filter creator videos"
              className="inline-flex rounded-full border border-white/12 bg-[#111111] p-1"
            >
              {filterTabs.map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(tab.id)}
                    className={`min-h-[40px] rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer ${
                      active
                        ? "bg-amber-gradient font-semibold text-[#0a0a0a]"
                        : "text-[#9e998e] hover:text-[#f5f2eb]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-pressed={onlyEditedByMe}
              onClick={() => setOnlyEditedByMe((prev) => !prev)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer ${
                onlyEditedByMe
                  ? "border-[#ff7a1f] bg-[#ff5a1f]/15 text-[#ffb020]"
                  : "border-white/12 bg-[#111111] text-[#9e998e] hover:border-white/25 hover:text-[#f5f2eb]"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Edited by me</span>
            </button>
          </div>
        </div>

        {/* Creator Cards Stack */}
        <div className="mt-10 space-y-8 sm:mt-12">
          {FEATURED_YOUTUBE_CREATORS.map((client) => (
            <CreatorSpotlightCard
              key={client.youtubeChannelId || client.youtubeHandle || client.name}
              client={client}
              filter={filter}
              onlyEditedByMe={onlyEditedByMe}
              onOpenPlaylist={(videos, startIndex) =>
                setModalState({ videos, index: startIndex })
              }
            />
          ))}
        </div>
      </div>

      {/* Shared Cinema Player Modal */}
      <CinemaModal
        videos={modalState.videos}
        activeIndex={modalState.index}
        onClose={() => setModalState({ videos: [], index: null })}
        onChangeIndex={(nextIdx) =>
          setModalState((prev) => ({ ...prev, index: nextIdx }))
        }
      />
    </section>
  );
}
