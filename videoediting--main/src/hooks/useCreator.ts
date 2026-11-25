import { useEffect, useState } from "react";
import type { CreatorApiResponse } from "../../api/_youtube";

export type { CreatorApiResponse, CreatorVideo, CreatorChannelInfo } from "../../api/_youtube";

interface CacheEntry {
  timestamp: number;
  data: CreatorApiResponse;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours (matches API s-maxage=21600)
const STORAGE_PREFIX = "pxv_creator_v1_";
const memoryCache = new Map<string, CacheEntry>();

function buildCacheKey(youtubeHandle?: string, youtubeChannelId?: string): string | null {
  if (youtubeChannelId?.trim()) return `id:${youtubeChannelId.trim()}`;
  if (youtubeHandle?.trim()) {
    return `handle:${youtubeHandle.trim().replace(/^@+/, "").toLowerCase()}`;
  }
  return null;
}

function readCachedCreator(key: string): CreatorApiResponse | null {
  const now = Date.now();
  const mem = memoryCache.get(key);
  if (mem && now - mem.timestamp < CACHE_TTL_MS) {
    return mem.data;
  }

  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (parsed && typeof parsed.timestamp === "number" && now - parsed.timestamp < CACHE_TTL_MS) {
      memoryCache.set(key, parsed);
      return parsed.data;
    }
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore storage quota or private-mode errors
  }

  return null;
}

function writeCachedCreator(key: string, data: CreatorApiResponse): void {
  const entry: CacheEntry = { timestamp: Date.now(), data };
  memoryCache.set(key, entry);
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Ignore storage quota errors
  }
}

export interface UseCreatorResult {
  data: CreatorApiResponse | null;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

interface FetchState {
  key: string;
  data: CreatorApiResponse | null;
  error: string | null;
  isFallback: boolean;
}

export function useCreator(
  youtubeHandle?: string,
  youtubeChannelId?: string
): UseCreatorResult {
  const cacheKey = buildCacheKey(youtubeHandle, youtubeChannelId);
  const cached = cacheKey ? readCachedCreator(cacheKey) : null;

  const [fetched, setFetched] = useState<FetchState | null>(null);

  useEffect(() => {
    if (!cacheKey) return;
    if (readCachedCreator(cacheKey)) return;

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (youtubeChannelId?.trim()) {
      params.set("channelId", youtubeChannelId.trim());
    } else if (youtubeHandle?.trim()) {
      params.set("handle", youtubeHandle.trim());
    }

    fetch(`/api/creator?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        const payload = (await res.json()) as CreatorApiResponse & { error?: string };
        if (!res.ok || !payload.channel) {
          throw new Error(payload.error || "Unable to fetch creator channel.");
        }
        writeCachedCreator(cacheKey, payload);
        setFetched({
          key: cacheKey,
          data: payload,
          error: null,
          isFallback: false,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setFetched({
          key: cacheKey,
          data: null,
          error: err instanceof Error ? err.message : "Using fallback creator data.",
          isFallback: true,
        });
      });

    return () => {
      controller.abort();
    };
  }, [cacheKey, youtubeHandle, youtubeChannelId]);

  if (!cacheKey) {
    return { data: null, loading: false, error: null, isFallback: false };
  }

  if (cached) {
    return { data: cached, loading: false, error: null, isFallback: false };
  }

  if (fetched && fetched.key === cacheKey) {
    return {
      data: fetched.data,
      loading: false,
      error: fetched.error,
      isFallback: fetched.isFallback,
    };
  }

  return { data: null, loading: true, error: null, isFallback: false };
}
