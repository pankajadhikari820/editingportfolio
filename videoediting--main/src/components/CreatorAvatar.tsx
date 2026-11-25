import { useState } from "react";

interface CreatorAvatarProps {
  src?: string;
  initials: string;
  name: string;
  loading?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<NonNullable<CreatorAvatarProps["size"]>, { box: string; px: number; text: string }> = {
  xs: { box: "h-7 w-7", px: 28, text: "text-xs" },
  sm: { box: "h-10 w-10", px: 40, text: "text-sm" },
  md: { box: "h-12 w-12", px: 48, text: "text-xl" },
  lg: { box: "h-16 w-16", px: 64, text: "text-2xl" },
};

export function CreatorAvatar({
  src,
  initials,
  name,
  loading = false,
  size = "md",
}: CreatorAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const dims = SIZE_CLASSES[size];
  const hasImage = Boolean(src && src.trim().length > 0 && !imgError);

  return (
    <div
      className={`relative shrink-0 rounded-full p-[2px] bg-gradient-to-br from-[#ff5a1f]/75 via-[#ffb020]/50 to-white/20 shadow-[0_0_16px_rgba(255,90,31,0.14)] ${dims.box}`}
    >
      {/* Film-frame registration notches */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#ffb020]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#ff5a1f]"
      />

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#131210]">
        {/* Shimmering skeleton while loading or waiting for image */}
        {(loading || (hasImage && !imgLoaded)) && (
          <div
            aria-hidden="true"
            className="skeleton-shimmer absolute inset-0 rounded-full"
          />
        )}

        {hasImage ? (
          <img
            src={src}
            alt={`${name} avatar`}
            width={dims.px}
            height={dims.px}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          !loading && (
            <span
              className={`font-display tracking-wider text-[#f5f2eb] ${dims.text}`}
            >
              {initials}
            </span>
          )
        )}
      </div>
    </div>
  );
}
