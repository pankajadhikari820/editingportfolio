import { motion } from "motion/react";
import { ArrowRight, FileEdit } from "lucide-react";
import { CASE_STUDIES } from "../data";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { SpotlightCard } from "./SpotlightCard";

export function CaseStudies() {
  const { reducedMotion } = useDeviceCapabilities();

  if (CASE_STUDIES.length === 0) return null;

  return (
    <section
      id="case-studies"
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
              Edit Breakdown
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase">
              Problem → Cut → Outcome
            </h2>
          </div>

          <p className="max-w-md text-sm text-[var(--text-muted)] sm:text-base">
            How pacing, sound design, and story structure solve real retention bottlenecks.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: reducedMotion ? 0 : idx * 0.08 }}
            >
              <SpotlightCard className="flex h-full flex-col justify-between p-6 hover:-translate-y-1 hover:border-[var(--accent-solid)]/60">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent-solid)] uppercase">
                          0{idx + 1} · {study.format}
                        </span>
                        <h3 className="mt-1 font-display text-3xl tracking-[0.04em] text-[var(--text-primary)] uppercase">
                          {study.client}
                        </h3>
                      </div>

                      {study.isPlaceholderMetric && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--border-strong)] px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)] uppercase">
                          <FileEdit className="h-3 w-3" />
                          Editable Metric
                        </span>
                      )}
                    </div>

                    <dl className="mt-5 space-y-4 text-sm">
                      <div>
                        <dt className="font-mono text-[10px] tracking-[0.18em] text-[var(--text-muted)] uppercase">
                          01 · Problem
                        </dt>
                        <dd className="mt-1 leading-relaxed text-[var(--text-secondary)]">
                          {study.problem}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-mono text-[10px] tracking-[0.18em] text-[var(--accent-solid)] uppercase">
                          02 · What I did
                        </dt>
                        <dd className="mt-1 leading-relaxed text-[var(--text-secondary)]">
                          {study.action}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-mono text-[10px] tracking-[0.18em] text-emerald-400 uppercase">
                          03 · Result
                        </dt>
                        <dd className="mt-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs leading-relaxed text-[var(--text-primary)]">
                          {study.result}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {study.deliverables.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href="#contact"
                      className="inline-flex min-h-[44px] items-center gap-1 font-mono text-[11px] tracking-[0.14em] text-[var(--accent-solid)] uppercase hover:underline"
                    >
                      Book similar <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
