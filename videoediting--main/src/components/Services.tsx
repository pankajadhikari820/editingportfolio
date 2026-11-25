import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, TOOLS } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { SpotlightCard } from "./SpotlightCard";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-row",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.62,
          stagger: 0.08,
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
      id="services"
      ref={sectionRef}
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Sticky Header + Editing Suite (Premiere Pro, After Effects & CapCut) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
                Services &amp; Suite
              </p>
              <h2 className="mt-2 font-display text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase [text-wrap:balance]">
                Every format, one standard
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                Clean pacing, crisp audio, After Effects motion polish, and story-first editing tailored to each platform.
              </p>

              <div className="mt-10 border-t border-[var(--border-subtle)] pt-6">
                <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                  Editing Suite
                </p>

                <div className="mt-4 space-y-3">
                  {TOOLS.map((tool) => (
                    <SpotlightCard
                      key={tool.name}
                      className="rounded-lg border-[var(--border-subtle)] hover:border-[var(--accent-solid)]/60"
                    >
                      <div className="flex items-center gap-4 px-4 py-3.5">
                        <div
                          aria-hidden="true"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold"
                          style={{
                            borderColor: `${tool.accent}66`,
                            backgroundColor: `${tool.accent}18`,
                            color: tool.accent,
                          }}
                        >
                          {tool.shortCode}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {tool.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{tool.role}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Service List */}
          <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)] lg:col-span-8">
            {SERVICES.map((service) => (
              <div
                key={service.number}
                className="service-row group grid grid-cols-1 gap-4 py-7 transition-colors duration-200 hover:bg-[var(--bg-surface)]/45 sm:grid-cols-12 sm:gap-6 sm:px-4 sm:py-9"
              >
                <div className="font-mono text-xs tracking-[0.2em] text-[var(--accent-solid)] sm:col-span-2 sm:pt-1.5">
                  {service.number}
                </div>

                <div className="sm:col-span-10">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-3xl tracking-[0.03em] text-[var(--text-primary)] uppercase transition-colors group-hover:text-[var(--accent-solid)] sm:text-4xl">
                      {service.title}
                    </h3>
                    <a
                      href="#contact"
                      aria-label={`Enquire about ${service.title}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--text-muted)] transition-all duration-200 group-hover:border-[var(--accent-solid)] group-hover:text-[var(--accent-solid)]"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                    {service.description}
                  </p>

                  <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-[var(--text-muted)] uppercase">
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
