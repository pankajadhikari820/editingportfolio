import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { CLIENT_GROUPS, MARQUEE_CLIENTS } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function Clients() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray<HTMLElement>(".client-group-block");
      groups.forEach((group) => {
        const cards = group.querySelectorAll(".client-card");
        gsap.fromTo(
          cards,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 82%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-36"
    >
      {/* Header */}
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase">
              Clients & Collaborations
            </p>
            <h2 className="mt-2 font-display text-5xl leading-[0.94] tracking-[0.02em] text-[#f5f2eb] uppercase sm:text-6xl lg:text-7xl [text-wrap:balance]">
              Trusted by creators, brands & agencies
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#9e998e] sm:text-base">
            From international family channels and travel outfits to Indian food
            creators, music artists, agencies, and campus clubs.
          </p>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Client Marquee Ribbon */}
      <div
        aria-label="Client roster marquee"
        className="marquee-wrapper relative my-12 overflow-hidden border-y border-white/[0.08] bg-[#0e0e0e] py-5 sm:my-16"
      >
        {/* Edge fade masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0e0e0e] to-transparent sm:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0e0e0e] to-transparent sm:w-28"
        />

        <div className="marquee-track items-center gap-8 sm:gap-12">
          {[...MARQUEE_CLIENTS, ...MARQUEE_CLIENTS].map((clientName, idx) => (
            <div
              key={`${clientName}-${idx}`}
              className="flex shrink-0 items-center gap-8 sm:gap-12"
            >
              <span className="font-display text-2xl tracking-[0.08em] text-[#f5f2eb]/70 uppercase transition-colors hover:text-[#ff8a1f] sm:text-3xl">
                {clientName}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-xs text-[#ff7a1f]/70"
              >
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Four Grouped Client Grids */}
      <div className="mx-auto max-w-[1320px] space-y-16 px-5 sm:space-y-20 sm:px-8">
        {CLIENT_GROUPS.map((group, groupIdx) => (
          <div key={group.id} className="client-group-block">
            {/* Group Header */}
            <div className="mb-7 flex flex-col justify-between gap-2 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-end">
              <div>
                <span className="font-mono text-[11px] tracking-[0.22em] text-[#ff8a1f] uppercase">
                  0{groupIdx + 1} · Group
                </span>
                <h3 className="mt-1 font-display text-3xl tracking-[0.04em] text-[#f5f2eb] uppercase sm:text-4xl">
                  {group.title}
                </h3>
              </div>
              <p className="text-xs text-[#9e998e] sm:text-sm">
                {group.subtitle}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.clients.map((client) => {
                const isSingleLink = client.links.length === 1;
                const primaryLink = client.links[0];

                if (isSingleLink) {
                  return (
                    <a
                      key={client.name}
                      href={primaryLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="VISIT"
                      className="client-card group relative flex flex-col justify-between rounded-sm border border-white/[0.09] bg-[#111111] p-5 transition-[transform,border-color,box-shadow,background-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#ff7a1f]/60 hover:bg-[#151412] hover:shadow-[0_12px_36px_rgba(255,90,31,0.12)] sm:p-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ff7a1f]/35 bg-gradient-to-br from-[#ff5a1f]/20 to-[#ffb020]/10 font-display text-xl tracking-wider text-[#f5f2eb] transition-all duration-250 group-hover:border-transparent group-hover:bg-amber-gradient group-hover:text-[#0a0a0a]">
                          {client.initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-base font-semibold text-[#f5f2eb] sm:text-[17px]">
                            {client.name}
                          </h4>
                          <p className="truncate font-mono text-xs text-[#9e998e]">
                            {client.handle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs font-medium text-[#f5f2eb]/75 transition-colors group-hover:text-[#ff8a1f]">
                        <span>Visit page →</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  );
                }

                // Multi-platform client card (e.g. Instagram + YouTube)
                return (
                  <article
                    key={client.name}
                    className="client-card group relative flex flex-col justify-between rounded-sm border border-white/[0.09] bg-[#111111] p-5 transition-[transform,border-color,box-shadow,background-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#ff7a1f]/60 hover:bg-[#151412] hover:shadow-[0_12px_36px_rgba(255,90,31,0.12)] sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#ff7a1f]/35 bg-gradient-to-br from-[#ff5a1f]/20 to-[#ffb020]/10 font-display text-xl tracking-wider text-[#f5f2eb] transition-all duration-250 group-hover:border-transparent group-hover:bg-amber-gradient group-hover:text-[#0a0a0a]">
                        {client.initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-semibold text-[#f5f2eb] sm:text-[17px]">
                          {client.name}
                        </h4>
                        <p className="truncate font-mono text-xs text-[#9e998e]">
                          {client.handle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-3.5">
                      {client.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="VISIT"
                          className="inline-flex min-h-[32px] items-center gap-1 text-xs font-medium text-[#f5f2eb]/80 transition-colors hover:text-[#ff8a1f]"
                        >
                          <span>{link.label} →</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
