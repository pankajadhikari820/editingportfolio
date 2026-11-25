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

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}

export function getExternalPlatformLabel(rawUrl: string): string {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    if (host.includes("instagram.com")) return "Watch on Instagram";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "Watch on YouTube";
    if (host.includes("drive.google.com")) return "Watch on Google Drive";
    return "Open video";
  } catch {
    return "Open video";
  }
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
