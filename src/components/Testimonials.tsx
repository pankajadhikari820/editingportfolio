import { useState } from "react";
import { TESTIMONIALS, type TestimonialItem } from "../data";

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex flex-col justify-between rounded-sm border border-white/[0.09] bg-[#111111] p-6">
      <div>
        {item.screenshot && !imgError && (
          <div className="mb-5 overflow-hidden rounded-sm border border-white/[0.08] bg-[#0a0a0a]">
            <img
              src={item.screenshot}
              alt={`Client message from ${item.name}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="max-h-60 w-full object-cover"
            />
          </div>
        )}

        <blockquote className="text-sm leading-relaxed text-[#f5f2eb]/85 sm:text-base">
          “{item.text}”
        </blockquote>
      </div>

      <footer className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <div>
          <p className="text-sm font-semibold text-[#f5f2eb]">{item.name}</p>
          <p className="font-mono text-xs text-[#9e998e]">{item.handle}</p>
        </div>
      </footer>
    </article>
  );
}

/**
 * Automatically hidden while TESTIMONIALS in src/data.ts is empty.
 * Add real client quotes/screenshots in src/data.ts to reveal this section.
 */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative border-t border-white/[0.08] bg-[#0d0d0d] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-5xl leading-[0.94] tracking-[0.02em] text-[#f5f2eb] uppercase sm:text-6xl">
            Words from clients
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <TestimonialCard key={`${item.name}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
