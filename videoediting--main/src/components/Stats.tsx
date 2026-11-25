import { useEffect, useRef, useState } from "react";
import { STATS, type StatItem } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";

function AnimatedCounter({
  stat,
  active,
  reducedMotion,
}: {
  stat: StatItem;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || reducedMotion) return;

    const duration = 1100;
    const startTime = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * stat.value));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setCount(stat.value);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, stat.value, reducedMotion]);

  const displayCount = reducedMotion ? stat.value : count;

  return (
    <span className="font-display text-[clamp(3.2rem,6vw,5.25rem)] leading-none tracking-wide text-[var(--text-primary)] tabular-nums">
      {displayCount}
      <span className="text-amber-gradient">{stat.suffix}</span>
    </span>
  );
}

export function Stats() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const { reducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      ref={containerRef}
      aria-label="Key milestones"
      className="relative border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid grid-cols-2 divide-y divide-[var(--border-subtle)] sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-between px-4 py-8 sm:px-7 sm:py-11 ${
                idx % 2 === 1 ? "border-l border-[var(--border-subtle)] lg:border-l-0" : ""
              } ${idx >= 2 ? "sm:border-t sm:border-[var(--border-subtle)] lg:border-t-0" : ""}`}
            >
              <span className="mb-4 font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                0{idx + 1} · Metric
              </span>

              <AnimatedCounter
                stat={stat}
                active={inView}
                reducedMotion={reducedMotion}
              />

              <div className="mt-3">
                <p className="text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:text-[13px]">
                  {stat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
