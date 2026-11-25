import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, TOOLS } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-row",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative border-t border-white/[0.08] bg-[#0d0d0d] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Sticky Header + Editing Suite */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase">
                Services
              </p>
              <h2 className="mt-2 font-display text-5xl leading-[0.94] tracking-[0.02em] text-[#f5f2eb] uppercase sm:text-6xl [text-wrap:balance]">
                Every format, one standard
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#9e998e] sm:text-base">
                Clean pacing, crisp audio, and story-first editing tailored to
                each platform — whether it is a 20-minute YouTube episode or a
                35-second reel.
              </p>

              {/* Editing Tools Suite */}
              <div className="mt-10 border-t border-white/[0.08] pt-6">
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#9e998e] uppercase">
                  Editing Suite
                </p>

                <div className="mt-4 space-y-3">
                  {TOOLS.map((tool) => (
                    <div
                      key={tool.name}
                      className="flex items-center gap-4 rounded-sm border border-white/[0.08] bg-[#121212] px-4 py-3.5"
                    >
                      <div
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#ff7a1f]/40 bg-[#ff5a1f]/10 font-mono text-sm font-semibold text-[#ff9a2e]"
                      >
                        {tool.shortCode}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f5f2eb]">
                          {tool.name}
                        </p>
                        <p className="text-xs text-[#9e998e]">{tool.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Service List */}
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:col-span-8">
            {SERVICES.map((service) => (
              <div
                key={service.number}
                className="service-row group grid grid-cols-1 gap-4 py-7 transition-colors duration-200 hover:bg-white/[0.015] sm:grid-cols-12 sm:gap-6 sm:px-4 sm:py-9"
              >
                <div className="font-mono text-xs tracking-[0.2em] text-[#ff8a1f] sm:col-span-2 sm:pt-1.5">
                  {service.number}
                </div>

                <div className="sm:col-span-10">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-3xl tracking-[0.03em] text-[#f5f2eb] uppercase transition-colors group-hover:text-[#ff8a1f] sm:text-4xl">
                      {service.title}
                    </h3>
                    <a
                      href="#contact"
                      aria-label={`Enquire about ${service.title}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#9e998e] transition-all duration-200 group-hover:border-[#ff7a1f]/60 group-hover:text-[#ff8a1f]"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#f5f2eb]/75 sm:text-[15px]">
                    {service.description}
                  </p>

                  <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-[#9e998e] uppercase">
                    {service.deliverables}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
