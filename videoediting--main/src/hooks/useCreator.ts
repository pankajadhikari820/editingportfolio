import { useEffect, useState } from "react";
import type { CreatorApiError, CreatorApiResponse } from "../../api/_youtube";

export type { CreatorApiResponse, CreatorVideo, CreatorChannelInfo } from "../../api/_youtube";

interface CacheEntry {
  timestamp: number;
  data: CreatorApiResponse;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours (matches API s-maxage=21600)
const STORAGE_PREFIX = "pxv_creator_v1_";
const API_DISABLED_KEY = "pxv_creator_api_disabled_v1";

const memoryCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<CreatorFetchOutcome>>();
let apiDisabledMemory = false;

type CreatorFetchOutcome =
  | { ok: true; data: CreatorApiResponse }
  | { ok: false; error: string | null };

function isApiDisabled(): boolean {
  if (apiDisabledMemory) return true;
  try {
    if (window.sessionStorage.getItem(API_DISABLED_KEY) === "1") {
      apiDisabledMemory = true;
      return true;
    }
  } catch {
    // Ignore storage access errors
  }
  return false;
}

function markApiDisabled(): void {
  apiDisabledMemory = true;
  try {
    window.sessionStorage.setItem(API_DISABLED_KEY, "1");
  } catch {
    // Ignore storage access errors
  }
}

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

function fetchCreatorOnce(
  cacheKey: string,
  youtubeHandle?: string,
  youtubeChannelId?: string
): Promise<CreatorFetchOutcome> {
  const existing = inFlightRequests.get(cacheKey);
  if (existing) return existing;

  const params = new URLSearchParams();
  if (youtubeChannelId?.trim()) {
    params.set("channelId", youtubeChannelId.trim());
  } else if (youtubeHandle?.trim()) {
    params.set("handle", youtubeHandle.trim());
  }

  const request = fetch(`/api/creator?${params.toString()}`, {
    headers: { Accept: "application/json" },
  })
    .then(async (res): Promise<CreatorFetchOutcome> => {
      const payload = (await res.json()) as Partial<CreatorApiResponse> & Partial<CreatorApiError>;
      if (payload.code === "NO_API_KEY" || payload.configured === false) {
        markApiDisabled();
        return { ok: false, error: null };
      }
      if (!res.ok || !payload.channel) {
        return { ok: false, error: payload.error || "Unable to fetch creator channel." };
      }
      const data = payload as CreatorApiResponse;
      writeCachedCreator(cacheKey, data);
      return { ok: true, data };
    })
    .catch((err: unknown): CreatorFetchOutcome => ({
      ok: false,
      error: err instanceof Error ? err.message : "Using fallback creator data.",
    }))
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request;
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
  const disabled = isApiDisabled();

  const [fetched, setFetched] = useState<FetchState | null>(null);

  useEffect(() => {
    if (!cacheKey) return;
    if (readCachedCreator(cacheKey) || isApiDisabled()) return;

    let cancelled = false;

    void fetchCreatorOnce(cacheKey, youtubeHandle, youtubeChannelId).then((outcome) => {
      if (cancelled) return;
      if (outcome.ok) {
        setFetched({
          key: cacheKey,
          data: outcome.data,
          error: null,
          isFallback: false,
        });
      } else {
        setFetched({
          key: cacheKey,
          data: null,
          error: outcome.error,
          isFallback: true,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, youtubeHandle, youtubeChannelId]);

  if (!cacheKey) {
    return { data: null, loading: false, error: null, isFallback: false };
  }

  if (cached) {
    return { data: cached, loading: false, error: null, isFallback: false };
  }

  if (disabled) {
    return { data: null, loading: false, error: null, isFallback: true };
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
