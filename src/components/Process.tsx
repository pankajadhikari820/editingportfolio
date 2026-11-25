import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "../data";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
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
              scrub: 0.6,
            },
          }
        );
      }

      gsap.fromTo(
        ".process-step-card",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative border-t border-white/[0.08] py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[#ff8a1f] uppercase">
              Workflow
            </p>
            <h2 className="mt-2 font-display text-5xl leading-[0.94] tracking-[0.02em] text-[#f5f2eb] uppercase sm:text-6xl lg:text-7xl">
              From raw footage to final cut
            </h2>
          </div>

          <p className="max-w-sm text-sm text-[#9e998e] sm:text-base">
            Four clear steps designed to keep remote production fast, smooth,
            and stress-free.
          </p>
        </div>

        {/* Desktop Animated Timeline Progress Rail */}
        <div className="relative mt-14 hidden lg:block">
          <div className="h-[2px] w-full bg-white/[0.08]">
            <div
              ref={lineRef}
              className="h-full w-full origin-left bg-amber-gradient"
            />
          </div>
        </div>

        {/* 4-Step Editorial Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-8">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="process-step-card relative flex flex-col justify-between rounded-sm border border-white/[0.08] bg-[#111111] p-6 transition-colors duration-200 hover:border-[#ff7a1f]/45"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-semibold tracking-[0.18em] text-[#ff8a1f]">
                    STEP {item.step}
                  </span>
                  <span className="tabular-nums text-[#9e998e]">
                    {item.timecode}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-3xl tracking-[0.03em] text-[#f5f2eb] uppercase">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#f5f2eb]/75">
                  {item.description}
                </p>
              </div>

              <div
                aria-hidden="true"
                className="mt-6 h-px w-10 bg-amber-gradient opacity-70"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
