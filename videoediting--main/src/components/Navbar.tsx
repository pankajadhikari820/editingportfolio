import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { CONTACT, SITE_INFO } from "../data";
import { COLOR_GRADE_META, type ColorGradeMode } from "../hooks/useColorGrade";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { StudioApertureIcon } from "./BrandIcons";
import { MagneticButton } from "./MagneticButton";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Spotlight", href: "#spotlight" },
  { label: "Clients", href: "#clients" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  grade: ColorGradeMode;
  onCycleGrade: () => void;
}

export function Navbar({ grade, onCycleGrade }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevOpenRef = useRef(false);
  const { reducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      if (prevOpenRef.current) {
        toggleBtnRef.current?.focus();
      }
      prevOpenRef.current = false;
      return;
    }

    prevOpenRef.current = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const firstLink = drawerRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const gradeInfo = COLOR_GRADE_META[grade];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-b border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-[var(--bg-primary)]/90 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:h-[72px] sm:gap-8 sm:px-8">
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-display text-lg tracking-[0.11em] text-[var(--text-primary)] whitespace-nowrap shrink-0 transition-colors hover:text-[var(--accent-solid)] sm:gap-2.5 sm:text-[1.7rem]"
          >
            <StudioApertureIcon className="h-5 w-5 text-[var(--accent-solid)] sm:h-6 sm:w-6" />
            <span>{SITE_INFO.brandLogo}</span>
          </a>

          {/* Desktop Navigation (1024px+ so 768px tablets never crowd) */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex xl:gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-2 text-sm font-medium tracking-wide text-[var(--text-secondary)] whitespace-nowrap shrink-0 transition-colors hover:text-[var(--text-primary)]"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-amber-gradient transition-transform duration-200 group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          {/* LUT Switch + Desktop CTA + Mobile/Tablet Drawer Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onCycleGrade}
              data-cursor="LUT"
              aria-label={`Color grade preset: ${gradeInfo.label}. Click to switch LUT.`}
              title={`Color grade: ${gradeInfo.label}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[var(--text-primary)] uppercase transition-colors hover:border-[var(--accent-solid)] hover:text-[var(--accent-solid)] cursor-pointer sm:px-3.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--accent-solid)]" />
              <span className="hidden sm:inline">{gradeInfo.shortLabel}</span>
            </button>

            <div className="hidden lg:block">
              <MagneticButton
                href="#contact"
                variant="primary"
                className="min-h-[44px] px-5 py-2 text-xs uppercase tracking-[0.12em]"
                cursorLabel="HIRE"
              >
                Hire me
              </MagneticButton>
            </div>

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-overlay"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent-solid)] lg:hidden cursor-pointer"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Animated Full-Screen Mobile & Tablet Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={drawerRef}
            id="mobile-nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={reducedMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex h-[100dvh] flex-col justify-between overflow-y-auto bg-[var(--bg-primary)]/98 px-6 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Mobile links" className="flex flex-col gap-1">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  initial={reducedMotion ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: reducedMotion ? 0 : idx * 0.045 }}
                  className="flex min-h-[56px] items-baseline justify-between border-b border-[var(--border-subtle)] py-3 font-display text-4xl tracking-[0.06em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent-solid)] sm:text-5xl"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    0{idx + 1}
                  </span>
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 pt-6">
              <button
                type="button"
                onClick={onCycleGrade}
                className="flex min-h-[44px] w-full items-center justify-between rounded-sm border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2.5 font-mono text-xs tracking-[0.14em] text-[var(--text-primary)] uppercase cursor-pointer"
              >
                <span>Color Grade LUT</span>
                <span className="text-[var(--accent-solid)]">{gradeInfo.label}</span>
              </button>

              <MagneticButton
                href="#contact"
                onClick={handleLinkClick}
                variant="primary"
                className="w-full py-3.5 text-sm uppercase tracking-[0.14em]"
              >
                Hire me
              </MagneticButton>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{SITE_INFO.shortLocation}</span>
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1 text-[var(--text-primary)] hover:text-[var(--accent-solid)]"
                >
                  <span>{CONTACT.instagramHandle}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
