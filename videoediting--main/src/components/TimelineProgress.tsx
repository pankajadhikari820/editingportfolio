import { useEffect, useState } from "react";

const TRACKED_SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "spotlight", label: "Spotlight" },
  { id: "clients", label: "Clients" },
  { id: "lab", label: "Lab" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export function TimelineProgress() {
  const [scrollPct, setScrollPct] = useState(0);
  const [activeId, setActiveId] = useState("top");

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
      setScrollPct(pct);

      let current = "top";
      for (const sec of TRACKED_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.42) {
          current = sec.id;
        }
      }
      setActiveId(current);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2.5px] bg-transparent"
      >
        <div
          className="h-full origin-left bg-amber-gradient transition-[width] duration-75"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <nav
        aria-label="Section markers"
        className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex"
      >
        {TRACKED_SECTIONS.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              aria-label={`Jump to ${sec.label}`}
              title={sec.label}
              className="group flex h-6 items-center gap-2 px-1"
            >
              <span
                className={`font-mono text-[9px] tracking-[0.16em] uppercase transition-opacity duration-200 ${
                  isActive
                    ? "text-[var(--accent-solid)] opacity-100"
                    : "text-[var(--text-muted)] opacity-0 group-hover:opacity-100"
                }`}
              >
                {sec.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-200 ${
                  isActive
                    ? "h-2.5 w-2.5 bg-[var(--accent-solid)] shadow-[0_0_10px_var(--accent-glow)]"
                    : "h-1.5 w-1.5 bg-[var(--border-strong)] group-hover:bg-[var(--text-primary)]"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
