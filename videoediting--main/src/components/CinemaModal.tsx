import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Keyboard, ExternalLink } from "lucide-react";
import { getYouTubeEmbedUrl } from "../utils/video";

export interface CinemaModalVideo {
  id: string;
  localVideoUrl?: string;
  posterUrl?: string;
  youtubeId?: string;
  embedUrl?: string;
  externalUrl?: string;
  title: string;
  subtitle?: string;
  aspect: "16:9" | "9:16";
}

interface CinemaModalProps {
  videos: CinemaModalVideo[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex?: (index: number) => void;
}

export function CinemaModal({
  videos,
  activeIndex,
  onClose,
  onChangeIndex,
}: CinemaModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [pausedIndex, setPausedIndex] = useState<number | null>(null);
  const [hudFeedback, setHudFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const isOpen = activeIndex !== null && Boolean(videos[activeIndex]);
  const current = activeIndex !== null ? videos[activeIndex] : undefined;
  const paused = pausedIndex === activeIndex && activeIndex !== null;
  const isLocalVideo = Boolean(current?.localVideoUrl);
  const isYouTube = Boolean(current?.youtubeId);
  const supportsNleKeys = isLocalVideo || isYouTube;

  const showHud = useCallback((text: string) => {
    setHudFeedback(text);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setHudFeedback(null);
    }, 1100);
  }, []);

  const postYouTubeCommand = useCallback((func: string, args: unknown[] = []) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com"
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], video, iframe, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }

      if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        videos.length > 1 &&
        onChangeIndex &&
        activeIndex !== null
      ) {
        e.preventDefault();
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const nextIdx = (activeIndex + delta + videos.length) % videos.length;
        onChangeIndex(nextIdx);
        showHud(delta > 0 ? "NEXT CUT →" : "← PREV CUT");
        return;
      }

      if (!supportsNleKeys) return;

      if (e.key === " " || e.key.toLowerCase() === "k") {
        if (e.key === " " && document.activeElement?.tagName === "BUTTON") {
          return;
        }
        e.preventDefault();
        if (isLocalVideo && videoElRef.current) {
          if (videoElRef.current.paused) {
            void videoElRef.current.play();
            setPausedIndex(null);
            showHud("▶ PLAY (K)");
          } else {
            videoElRef.current.pause();
            setPausedIndex(activeIndex);
            showHud("II PAUSE (K)");
          }
          return;
        }

        setPausedIndex((prev) => {
          const nextPaused = prev !== activeIndex;
          postYouTubeCommand(nextPaused ? "pauseVideo" : "playVideo");
          showHud(nextPaused ? "II PAUSE (K)" : "▶ PLAY (K)");
          return nextPaused ? activeIndex : null;
        });
      } else if (e.key.toLowerCase() === "j") {
        e.preventDefault();
        if (isLocalVideo && videoElRef.current) {
          videoElRef.current.currentTime = Math.max(0, videoElRef.current.currentTime - 5);
          showHud("◄◄ J -5s");
          return;
        }
        postYouTubeCommand("seekTo", [0, true]);
        showHud("◄◄ J SHUTTLE (REWIND)");
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        if (isLocalVideo && videoElRef.current) {
          videoElRef.current.currentTime = Math.min(
            videoElRef.current.duration || 0,
            videoElRef.current.currentTime + 5
          );
          showHud("►► L +5s");
          return;
        }
        postYouTubeCommand("setPlaybackRate", [1.5]);
        postYouTubeCommand("playVideo");
        setPausedIndex(null);
        showHud("►► L SHUTTLE 1.5×");
      } else if (e.key.toLowerCase() === "m" && isLocalVideo && videoElRef.current) {
        e.preventDefault();
        videoElRef.current.muted = !videoElRef.current.muted;
        showHud(videoElRef.current.muted ? "MUTED (M)" : "AUDIO ON (M)");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [
    isOpen,
    isLocalVideo,
    supportsNleKeys,
    activeIndex,
    videos.length,
    onClose,
    onChangeIndex,
    postYouTubeCommand,
    showHud,
  ]);

  if (!isOpen || !current) return null;

  const isVertical = current.aspect === "9:16";
  const hasMultiple = videos.length > 1 && Boolean(onChangeIndex);
  const iframeSrc = current.youtubeId
    ? getYouTubeEmbedUrl(current.youtubeId)
    : current.embedUrl ?? "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/92 p-3 backdrop-blur-md sm:p-6"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-xl border border-white/15 bg-[#101010] shadow-2xl ${
          isVertical ? "max-w-[420px]" : "max-w-4xl"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#ff8a1f] uppercase">
              {current.subtitle ?? `${current.aspect} · Cinema Player`}
            </p>
            <h3 className="truncate font-display text-xl tracking-[0.04em] text-[#f5f2eb] uppercase sm:text-2xl">
              {current.title}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {current.externalUrl && (
              <a
                href={current.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open original video page"
                className="flex h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 font-mono text-[10px] tracking-[0.12em] text-[#f5f2eb] uppercase transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f]"
              >
                <span className="hidden sm:inline">Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {hasMultiple && activeIndex !== null && onChangeIndex && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onChangeIndex((activeIndex - 1 + videos.length) % videos.length)
                  }
                  aria-label="Previous video"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#f5f2eb] transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f] cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeIndex((activeIndex + 1) % videos.length)}
                  aria-label="Next video"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#f5f2eb] transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f] cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close video player"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#f5f2eb] transition-colors hover:border-[#ff7a1f] hover:text-[#ff8a1f] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Responsive Video Stage (unmounts cleanly on close) */}
        <div
          className={`relative flex w-full items-center justify-center bg-black ${
            isVertical ? "aspect-[9/16] max-h-[74dvh]" : "aspect-video max-h-[74dvh]"
          }`}
        >
          {isLocalVideo && current.localVideoUrl ? (
            <video
              ref={videoElRef}
              key={current.localVideoUrl}
              src={current.localVideoUrl}
              poster={current.posterUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain bg-black"
            />
          ) : (
            iframeSrc && (
              <iframe
                ref={iframeRef}
                key={iframeSrc}
                src={iframeSrc}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )
          )}

          {hudFeedback && (
            <div
              aria-live="polite"
              className="pointer-events-none absolute top-4 left-4 rounded-md border border-[#ff7a1f]/60 bg-black/85 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-[#ffb020] uppercase backdrop-blur-sm"
            >
              {hudFeedback}
            </div>
          )}
        </div>

        {/* Bottom NLE Shortcut Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] bg-[#0c0c0c] px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-[#9e998e] uppercase sm:px-5">
          <span className="inline-flex items-center gap-1.5 text-[#f5f2eb]/70">
            <Keyboard className="h-3.5 w-3.5 text-[#ff8a1f]" />
            {supportsNleKeys ? (
              <>
                NLE Keys:{" "}
                <span className="text-[#f5f2eb]">
                  {isLocalVideo ? "Space/K · J/L · M" : "Space / J K L"}
                </span>
                {paused ? " · Paused" : ""}
              </>
            ) : (
              <span>Preview Player</span>
            )}
          </span>
          <span>
            {hasMultiple && activeIndex !== null
              ? `Cut ${activeIndex + 1}/${videos.length} · ← / → Switch · ESC Close`
              : "ESC or Click Outside to Close"}
          </span>
        </div>
      </div>
    </div>
  );
}
