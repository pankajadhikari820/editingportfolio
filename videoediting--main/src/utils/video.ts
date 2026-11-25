import { CONTACT } from "../data";

/**
 * Extracts a YouTube video ID from standard watch, short, share, or embed URLs.
 * Returns null for channel URLs (e.g. youtube.com/@channel), Instagram, Drive, or empty strings.
 */
export function extractYouTubeVideoId(rawUrl: string): string | null {
  if (!rawUrl || !rawUrl.trim()) return null;

  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const vParam = url.searchParams.get("v");
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      const parts = url.pathname.split("/").filter(Boolean);
      if (
        (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") &&
        parts[1] &&
        /^[a-zA-Z0-9_-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Extracts a YouTube @handle or UC... channelId from a channel URL
 * (e.g. https://youtube.com/@thedanielefamily or https://youtube.com/channel/UC...).
 */
export function extractYouTubeChannel(
  rawUrl: string
): { handle?: string; channelId?: string } | null {
  if (!rawUrl || !rawUrl.trim()) return null;

  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "youtube.com" && host !== "m.youtube.com") return null;

    const parts = url.pathname.split("/").filter(Boolean);
    const first = parts[0];
    if (!first) return null;

    if (first.startsWith("@") && first.length > 1) {
      return { handle: first };
    }

    if (first === "channel" && parts[1] && parts[1].startsWith("UC")) {
      return { channelId: parts[1] };
    }
  } catch {
    return null;
  }

  return null;
}

export interface InstagramUrlInfo {
  type: "reel" | "post" | "profile";
  handle?: string;
  shortcode?: string;
  embedUrl?: string;
}

/**
 * Parses Instagram Reel, Post, or Profile URLs without scraping.
 * Reels & Posts provide an official /embed iframe URL; profiles open on Instagram.
 */
export function extractInstagramInfo(rawUrl: string): InstagramUrlInfo | null {
  if (!rawUrl || !rawUrl.trim()) return null;

  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "instagram.com" && host !== "m.instagram.com") return null;

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;

    const first = parts[0] ?? "";
    const second = parts[1] ?? "";

    if ((first === "reel" || first === "reels") && second) {
      return {
        type: "reel",
        shortcode: second,
        embedUrl: `https://www.instagram.com/reel/${encodeURIComponent(second)}/embed/`,
      };
    }

    if (first === "p" && second) {
      return {
        type: "post",
        shortcode: second,
        embedUrl: `https://www.instagram.com/p/${encodeURIComponent(second)}/embed/`,
      };
    }

    // Profile URL: instagram.com/username
    if (first && !["explore", "accounts", "stories", "direct"].includes(first)) {
      return {
        type: "profile",
        handle: `@${first.replace(/^@+/, "")}`,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
}

export function getExternalPlatformLabel(rawUrl: string): string {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    if (host.includes("instagram.com")) return "Watch Reels on Instagram";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "Watch on YouTube";
    if (host.includes("drive.google.com")) return "Watch on Google Drive";
    return "Open video";
  } catch {
    return "Open video";
  }
}

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0";
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 2).replace(/\.?0+$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  }
  return value.toLocaleString("en-US");
}

export function formatSubscribers(count: number | null, hidden?: boolean): string {
  if (hidden || count === null) return "Creator channel";
  return `${formatCompactNumber(count)} subscribers`;
}

export function buildWhatsAppUrl(params?: {
  name?: string;
  projectType?: string;
  message?: string;
  customText?: string;
}): string {
  if (params?.customText) {
    return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(params.customText)}`;
  }

  const lines: string[] = ["Hi Pankaj, I'm reaching out from your portfolio website."];

  if (params?.name?.trim()) {
    lines.push(`Name: ${params.name.trim()}`);
  }
  if (params?.projectType?.trim()) {
    lines.push(`Project Type: ${params.projectType.trim()}`);
  }
  if (params?.message?.trim()) {
    lines.push(`Details: ${params.message.trim()}`);
  }

  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}
