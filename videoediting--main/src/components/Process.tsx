import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const playheadRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [playheadPct, setPlayheadPct] = useState(0);
  const { reducedMotion, lowPowerDevice } = useDeviceCapabilities();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (!lowPowerDevice && lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              end: "bottom 75%",
              scrub: 0.5,
              onUpdate: (self) => {
                setPlayheadPct(Math.round(self.progress * 100));
                if (playheadRef.current) {
                  playheadRef.current.style.left = `${self.progress * 100}%`;
                }
              },
            },
          }
        );
      }

      gsap.fromTo(
        ".process-step-card",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
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
  }, [reducedMotion, lowPowerDevice]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
              Editing Workflow
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase">
              From raw footage to final cut
            </h2>
          </div>

          <p className="max-w-sm text-sm text-[var(--text-muted)] sm:text-base">
            Four clear NLE timeline stages designed to keep remote production fast,
            smooth, and stress-free.
          </p>
        </div>

        {/* Premiere Pro-Style Scrubbing Timeline Ruler & Track Bar */}
        <div className="mt-12 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5">
          {/* Timecode Ruler */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5 font-mono text-[10px] tracking-[0.16em] text-[var(--text-muted)] uppercase">
            <span>SEQ · PANKAJ_MASTER_V1</span>
            <span className="tabular-nums text-[var(--accent-solid)]">
              24.00 FPS · {playheadPct}%
            </span>
          </div>

          {/* Scrubbing Track + Playhead */}
          <div className="relative mt-4 hidden lg:block">
            <div className="relative h-9 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2">
              <div className="grid h-full grid-cols-4 items-center gap-2">
                {PROCESS_STEPS.map((s) => (
                  <div
                    key={s.step}
                    className="flex h-6 items-center justify-between rounded-[2px] border border-[var(--accent-solid)]/35 bg-[var(--accent-start)]/12 px-2.5 font-mono text-[10px] text-[var(--text-primary)]"
                  >
                    <span className="text-[var(--accent-solid)]">{s.track}</span>
                    <span className="tabular-nums text-[var(--text-muted)]">{s.timecode}</span>
                  </div>
                ))}
              </div>

              {/* Scroll-driven Playhead Scrubber */}
              {!reducedMotion && !lowPowerDevice && (
                <div
                  ref={playheadRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[2px] bg-[var(--accent-solid)] shadow-[0_0_12px_var(--accent-glow)]"
                >
                  <span className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[var(--accent-solid)]" />
                </div>
              )}
            </div>

            <div className="mt-2 h-[2px] w-full bg-[var(--border-subtle)]">
              <div
                ref={lineRef}
                className="h-full w-full origin-left bg-amber-gradient"
              />
            </div>
          </div>

          {/* 4-Step Editorial Clips Grid */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="process-step-card relative flex flex-col justify-between rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 transition-colors duration-200 hover:border-[var(--accent-solid)]/60"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold tracking-[0.16em] text-[var(--accent-solid)]">
                      {item.track}
                    </span>
                    <span className="tabular-nums text-[var(--text-muted)]">
                      {item.timecode}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-3xl tracking-[0.03em] text-[var(--text-primary)] uppercase">
                    {item.step} · {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="mt-5 h-px w-10 bg-amber-gradient opacity-75"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
