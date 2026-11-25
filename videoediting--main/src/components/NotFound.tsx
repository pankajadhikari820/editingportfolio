import { ArrowLeft, Film } from "lucide-react";
import { SITE_INFO } from "../data";
import { MagneticButton } from "./MagneticButton";

export function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--bg-primary)] px-6 text-center text-[var(--text-primary)]">
      <div className="relative max-w-lg rounded-sm border border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 sm:p-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-px -left-px h-5 w-5 border-t-2 border-l-2 border-[var(--accent-solid)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-px -bottom-px h-5 w-5 border-r-2 border-b-2 border-[var(--accent-solid)]"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent-solid)]/40 bg-[var(--accent-start)]/12 text-[var(--accent-solid)]">
          <Film className="h-6 w-6" />
        </div>

        <p className="mt-5 font-mono text-xs tracking-[0.22em] text-[var(--accent-solid)] uppercase">
          FRAME MISSING · 404
        </p>

        <h1 className="mt-2 font-display text-6xl tracking-[0.04em] uppercase sm:text-7xl">
          Reel Not Found
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          This scene isn&apos;t on the {SITE_INFO.brand} timeline. Head back to the main portfolio cut.
        </p>

        <div className="mt-7 flex justify-center">
          <MagneticButton href="/" variant="primary" className="px-6 py-3 text-xs uppercase tracking-[0.14em]">
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </MagneticButton>
        </div>
      </div>
    </main>
  );
}
