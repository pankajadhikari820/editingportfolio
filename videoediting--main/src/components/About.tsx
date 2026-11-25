import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Globe, Film } from "lucide-react";
import { ABOUT, SITE_INFO } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const { reducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[var(--bg-primary)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: 35mm Film Frame Portrait Slot */}
          <div className="about-reveal lg:col-span-5">
            <div className="relative flex h-full min-h-[380px] overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div
                aria-hidden="true"
                className="sprocket-rail-vertical shrink-0 border-r border-[var(--border-subtle)]"
              />

              <div className="relative flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[var(--accent-solid)] uppercase">
                  <span>35MM · PORTRAIT</span>
                  <span>FRAME 01A</span>
                </div>

                {/* Image container — drops in /public/pankaj.jpg seamlessly with darkroom fallback */}
                <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[#151412]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 left-3 z-10 h-4 w-4 border-t border-l border-white/40"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 right-3 z-10 h-4 w-4 border-t border-r border-white/40"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-white/40"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-white/40"
                  />

                  {!imgFailed && ABOUT.photoUrl ? (
                    <img
                      src={ABOUT.photoUrl}
                      alt={ABOUT.photoAlt}
                      width={768}
                      height={960}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => setImgFailed(true)}
                      className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      aria-label={ABOUT.photoAlt}
                      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-6 text-center"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 35%, rgba(255, 110, 31, 0.24) 0%, rgba(28, 22, 18, 0.92) 52%, #0e0e0e 100%)",
                      }}
                    >
                      <svg
                        viewBox="0 0 260 260"
                        className="pointer-events-none absolute h-72 w-72 opacity-25"
                        aria-hidden="true"
                      >
                        <circle
                          cx="130"
                          cy="130"
                          r="116"
                          fill="none"
                          stroke="#ff8a1f"
                          strokeWidth="0.75"
                          strokeDasharray="6 6"
                        />
                        <circle
                          cx="130"
                          cy="130"
                          r="84"
                          fill="none"
                          stroke="#f5f2eb"
                          strokeWidth="0.75"
                          strokeOpacity="0.4"
                        />
                        <line x1="130" y1="8" x2="130" y2="252" stroke="#f5f2eb" strokeOpacity="0.12" />
                        <line x1="8" y1="130" x2="252" y2="130" stroke="#f5f2eb" strokeOpacity="0.12" />
                      </svg>

                      <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#ff7a1f]/45 bg-[#0a0a0a]/75 shadow-[0_0_40px_rgba(255,90,31,0.2)]">
                        <span className="font-display text-4xl tracking-[0.1em] text-amber-gradient">
                          PA
                        </span>
                      </div>

                      <p className="relative z-10 mt-5 font-display text-2xl tracking-[0.1em] text-[#f5f2eb] uppercase">
                        {SITE_INFO.name}
                      </p>
                      <p className="relative z-10 mt-1 font-mono text-[11px] tracking-[0.18em] text-[#9e998e] uppercase">
                        {SITE_INFO.brand} · Editor
                      </p>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                  />
                  <div className="pointer-events-none absolute inset-x-4 bottom-3 z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-white/80 uppercase">
                    <span>{SITE_INFO.handle}</span>
                    <span>ISO 400</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                  <span>HALDWANI, UK</span>
                  <span>EXP · 3+ YRS</span>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="sprocket-rail-vertical shrink-0 border-l border-[var(--border-subtle)]"
              />
            </div>
          </div>

          {/* Right: Editorial Bio & Core Facts */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="about-reveal font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
              About the Editor
            </p>

            <h2 className="about-reveal mt-3 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase [text-wrap:balance]">
              {ABOUT.headline}
            </h2>

            <p className="about-reveal mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg sm:leading-[1.75]">
              {ABOUT.bio}
            </p>

            <dl className="about-reveal mt-10 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {ABOUT.highlights.map((item, idx) => (
                <div
                  key={item.label}
                  className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-12 sm:items-center sm:gap-4"
                >
                  <dt className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[var(--text-muted)] uppercase sm:col-span-4">
                    {idx === 0 && <MapPin className="h-3.5 w-3.5 text-[var(--accent-solid)]" />}
                    {idx === 1 && <Film className="h-3.5 w-3.5 text-[var(--accent-solid)]" />}
                    {idx === 2 && <Globe className="h-3.5 w-3.5 text-[var(--accent-solid)]" />}
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium text-[var(--text-primary)] sm:col-span-8 sm:text-[15px]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
