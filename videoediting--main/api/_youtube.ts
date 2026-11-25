export interface CreatorVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
  viewCount: number;
  duration: string;
  durationSeconds: number;
  publishedAt: string;
  isShort: boolean;
}

export interface CreatorChannelInfo {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  subscribers: number | null;
  hiddenSubscribers: boolean;
}

export interface CreatorApiResponse {
  channel: CreatorChannelInfo;
  longForm: CreatorVideo[];
  shorts: CreatorVideo[];
}

export interface CreatorApiError {
  error: string;
  configured?: boolean;
  code:
    | "BAD_REQUEST"
    | "NO_API_KEY"
    | "NOT_FOUND"
    | "QUOTA_EXCEEDED"
    | "UPSTREAM_ERROR";
}

export interface HandlerResult {
  status: number;
  headers: Record<string, string>;
  body: CreatorApiResponse | CreatorApiError;
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

const CACHE_HEADERS: Record<string, string> = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
};

const NO_CACHE_HEADERS: Record<string, string> = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

interface YouTubeThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

interface YouTubeChannelItem {
  id?: string;
  snippet?: {
    title?: string;
    customUrl?: string;
    thumbnails?: Record<string, YouTubeThumbnail>;
  };
  statistics?: {
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
}

interface YouTubePlaylistItem {
  contentDetails?: {
    videoId?: string;
  };
}

interface YouTubeVideoItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: Record<string, YouTubeThumbnail>;
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
  };
  status?: {
    privacyStatus?: string;
  };
}

interface YouTubeErrorPayload {
  error?: {
    code?: number;
    message?: string;
    errors?: Array<{ reason?: string }>;
  };
}

export function parseIsoDurationToSeconds(iso: string | undefined): number {
  if (!iso) return 0;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

function pickBestAvatar(thumbnails?: Record<string, YouTubeThumbnail>): string {
  if (!thumbnails) return "";
  return (
    thumbnails.maxres?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ""
  );
}

function hasVerticalThumbnail(thumbnails?: Record<string, YouTubeThumbnail>): boolean {
  if (!thumbnails) return false;
  return Object.values(thumbnails).some(
    (thumb) =>
      typeof thumb?.width === "number" &&
      typeof thumb?.height === "number" &&
      thumb.height > thumb.width
  );
}

function isQuotaError(status: number, payload: YouTubeErrorPayload | null): boolean {
  if (status === 429) return true;
  if (status !== 403 || !payload?.error?.errors) return false;
  return payload.error.errors.some(
    (err) =>
      err.reason === "quotaExceeded" ||
      err.reason === "dailyLimitExceeded" ||
      err.reason === "rateLimitExceeded"
  );
}

async function fetchYouTubeJson<T>(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string
): Promise<{ ok: true; data: T } | { ok: false; status: number; quota: boolean }> {
  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    let errorPayload: YouTubeErrorPayload | null = null;
    try {
      errorPayload = (await response.json()) as YouTubeErrorPayload;
    } catch {
      errorPayload = null;
    }
    return {
      ok: false,
      status: response.status,
      quota: isQuotaError(response.status, errorPayload),
    };
  }

  const data = (await response.json()) as T;
  return { ok: true, data };
}

export async function handleCreatorQuery(
  query: { handle?: string; channelId?: string },
  apiKey: string | undefined
): Promise<HandlerResult> {
  if (!apiKey || !apiKey.trim()) {
    return {
      status: 200,
      headers: NO_CACHE_HEADERS,
      body: {
        configured: false,
        error: "YouTube API key is not configured on the server.",
        code: "NO_API_KEY",
      },
    };
  }

  const rawHandle = query.handle?.trim() ?? "";
  const rawChannelId = query.channelId?.trim() ?? "";

  if (!rawHandle && !rawChannelId) {
    return {
      status: 400,
      headers: NO_CACHE_HEADERS,
      body: {
        error: "Provide either a ?handle=@name or ?channelId=UC... query parameter.",
        code: "BAD_REQUEST",
      },
    };
  }

  const channelParams: Record<string, string> = {
    part: "snippet,statistics,contentDetails",
  };

  if (rawChannelId) {
    if (!/^UC[a-zA-Z0-9_-]{10,}$/.test(rawChannelId)) {
      return {
        status: 400,
        headers: NO_CACHE_HEADERS,
        body: { error: "Invalid YouTube channelId format.", code: "BAD_REQUEST" },
      };
    }
    channelParams.id = rawChannelId;
  } else {
    const cleanHandle = rawHandle.replace(/^@+/, "");
    if (!/^[a-zA-Z0-9._-]{2,60}$/.test(cleanHandle)) {
      return {
        status: 400,
        headers: NO_CACHE_HEADERS,
        body: { error: "Invalid YouTube handle format.", code: "BAD_REQUEST" },
      };
    }
    channelParams.forHandle = `@${cleanHandle}`;
  }

  try {
    // 1. Cheap channels.list call (1 quota unit)
    const channelRes = await fetchYouTubeJson<{ items?: YouTubeChannelItem[] }>(
      "channels",
      channelParams,
      apiKey
    );

    if (!channelRes.ok) {
      return {
        status: channelRes.quota ? 429 : 502,
        headers: NO_CACHE_HEADERS,
        body: {
          error: channelRes.quota
            ? "YouTube API quota exceeded. Please try again later."
            : "Failed to fetch channel metadata from YouTube.",
          code: channelRes.quota ? "QUOTA_EXCEEDED" : "UPSTREAM_ERROR",
        },
      };
    }

    const channelItem = channelRes.data.items?.[0];
    if (!channelItem || !channelItem.id) {
      return {
        status: 404,
        headers: NO_CACHE_HEADERS,
        body: {
          error: "YouTube channel was not found.",
          code: "NOT_FOUND",
        },
      };
    }

    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    const channelInfo: CreatorChannelInfo = {
      id: channelItem.id,
      name: channelItem.snippet?.title ?? "YouTube Creator",
      handle:
        channelItem.snippet?.customUrl ??
        (rawHandle ? `@${rawHandle.replace(/^@+/, "")}` : channelItem.id),
      avatarUrl: pickBestAvatar(channelItem.snippet?.thumbnails),
      subscribers: channelItem.statistics?.hiddenSubscriberCount
        ? null
        : Number(channelItem.statistics?.subscriberCount ?? 0),
      hiddenSubscribers: Boolean(channelItem.statistics?.hiddenSubscriberCount),
    };

    if (!uploadsPlaylistId) {
      return {
        status: 200,
        headers: CACHE_HEADERS,
        body: { channel: channelInfo, longForm: [], shorts: [] },
      };
    }

    // 2. Fetch last ~100 uploads via playlistItems.list (max 2 calls, 1 unit each)
    const videoIds: string[] = [];
    let nextPageToken: string | undefined;

    for (let page = 0; page < 2; page += 1) {
      const playlistParams: Record<string, string> = {
        part: "contentDetails",
        playlistId: uploadsPlaylistId,
        maxResults: "50",
      };
      if (nextPageToken) {
        playlistParams.pageToken = nextPageToken;
      }

      const playlistRes = await fetchYouTubeJson<{
        items?: YouTubePlaylistItem[];
        nextPageToken?: string;
      }>("playlistItems", playlistParams, apiKey);

      if (!playlistRes.ok) {
        if (playlistRes.quota) {
          return {
            status: 429,
            headers: NO_CACHE_HEADERS,
            body: {
              error: "YouTube API quota exceeded.",
              code: "QUOTA_EXCEEDED",
            },
          };
        }
        break;
      }

      for (const item of playlistRes.data.items ?? []) {
        const vid = item.contentDetails?.videoId;
        if (vid && !videoIds.includes(vid)) {
          videoIds.push(vid);
        }
      }

      nextPageToken = playlistRes.data.nextPageToken;
      if (!nextPageToken) break;
    }

    if (videoIds.length === 0) {
      return {
        status: 200,
        headers: CACHE_HEADERS,
        body: { channel: channelInfo, longForm: [], shorts: [] },
      };
    }

    // 3. Batch videos.list in groups of 50 (1 unit per call)
    const allVideos: CreatorVideo[] = [];

    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);
      const videosRes = await fetchYouTubeJson<{ items?: YouTubeVideoItem[] }>(
        "videos",
        {
          part: "snippet,statistics,contentDetails,status",
          id: chunk.join(","),
        },
        apiKey
      );

      if (!videosRes.ok) {
        if (videosRes.quota) {
          return {
            status: 429,
            headers: NO_CACHE_HEADERS,
            body: {
              error: "YouTube API quota exceeded.",
              code: "QUOTA_EXCEEDED",
            },
          };
        }
        continue;
      }

      for (const v of videosRes.data.items ?? []) {
        const id = v.id;
        const title = v.snippet?.title ?? "";
        const privacy = v.status?.privacyStatus;

        // Skip private, deleted, or unlisted items
        if (!id || privacy !== "public") continue;
        if (title === "Private video" || title === "Deleted video") continue;

        const durationSeconds = parseIsoDurationToSeconds(v.contentDetails?.duration);
        if (durationSeconds <= 0) continue;

        const description = v.snippet?.description ?? "";
        const hasShortsTag = /#shorts?\b/i.test(`${title}\n${description}`);
        const verticalThumb = hasVerticalThumbnail(v.snippet?.thumbnails);

        const isShort = durationSeconds <= 180 && (hasShortsTag || verticalThumb);
        const viewCount = Number(v.statistics?.viewCount ?? 0);

        allVideos.push({
          id,
          title,
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          fallbackThumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          viewCount: Number.isFinite(viewCount) ? viewCount : 0,
          duration: formatDuration(durationSeconds),
          durationSeconds,
          publishedAt: v.snippet?.publishedAt ?? "",
          isShort,
        });
      }
    }

    const sortedByViews = (list: CreatorVideo[]) =>
      [...list].sort((a, b) => b.viewCount - a.viewCount);

    const longForm = sortedByViews(allVideos.filter((v) => !v.isShort)).slice(0, 3);
    const shorts = sortedByViews(allVideos.filter((v) => v.isShort)).slice(0, 3);

    return {
      status: 200,
      headers: CACHE_HEADERS,
      body: {
        channel: channelInfo,
        longForm,
        shorts,
      },
    };
  } catch {
    return {
      status: 500,
      headers: NO_CACHE_HEADERS,
      body: {
        error: "Unexpected error while loading YouTube creator data.",
        code: "UPSTREAM_ERROR",
      },
    };
  }
}
