import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { TESTIMONIALS, type TestimonialItem } from "../data";

function TestimonialCard({
  item,
  onPreviewScreenshot,
}: {
  item: TestimonialItem;
  onPreviewScreenshot: (item: TestimonialItem) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex flex-col justify-between rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div>
        {item.screenshot && !imgError && (
          <button
            type="button"
            onClick={() => onPreviewScreenshot(item)}
            data-cursor="VIEW"
            aria-label={`Inspect message screenshot from ${item.name}`}
            className="group relative mb-5 block w-full overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-primary)] cursor-pointer"
          >
            <img
              src={item.screenshot}
              alt={`Client message from ${item.name}`}
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="max-h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase backdrop-blur-sm">
              <ZoomIn className="h-3 w-3 text-[var(--accent-solid)]" />
              Zoom
            </span>
          </button>
        )}

        <blockquote className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          “{item.text}”
        </blockquote>
      </div>

      <footer className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
          <p className="font-mono text-xs text-[var(--text-muted)]">{item.handle}</p>
        </div>
        {item.platform && (
          <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent-solid)] uppercase">
            {item.platform}
          </span>
        )}
      </footer>
    </article>
  );
}

/**
 * Automatically hidden while TESTIMONIALS in src/data.ts is empty.
 * Supports WhatsApp / Instagram DM screenshot cards with a lightbox preview.
 */
export function Testimonials() {
  const [lightboxItem, setLightboxItem] = useState<TestimonialItem | null>(null);

  useEffect(() => {
    if (!lightboxItem) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxItem]);

  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.2rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase">
            Words from clients
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <TestimonialCard
              key={`${item.name}-${idx}`}
              item={item}
              onPreviewScreenshot={setLightboxItem}
            />
          ))}
        </div>
      </div>

      {/* Screenshot Lightbox Modal */}
      {lightboxItem?.screenshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Screenshot from ${lightboxItem.name}`}
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl overflow-hidden rounded-sm border border-white/15 bg-[#101010] p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-4 px-2">
              <p className="font-mono text-xs tracking-[0.14em] text-[#f5f2eb] uppercase">
                {lightboxItem.name} · {lightboxItem.handle}
              </p>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close screenshot preview"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:border-[#ff7a1f] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <img
              src={lightboxItem.screenshot}
              alt={`Client message screenshot from ${lightboxItem.name}`}
              className="max-h-[78dvh] w-auto rounded-sm object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
