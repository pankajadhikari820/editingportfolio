import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { CONTACT, SITE_INFO } from "../data";
import { MagneticButton } from "./MagneticButton";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#clients" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-[#0a0a0a]/85 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-8 px-5 sm:h-[72px] sm:px-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="#top"
            className="font-display text-2xl tracking-[0.12em] text-[#f5f2eb] whitespace-nowrap shrink-0 transition-colors hover:text-[#ff8a1f] sm:text-[1.7rem]"
          >
            {SITE_INFO.brandLogo}
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-1 text-sm font-medium tracking-wide text-[#f5f2eb]/75 whitespace-nowrap shrink-0 transition-colors hover:text-[#f5f2eb]"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-amber-gradient transition-transform duration-200 group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: Single primary CTA (desktop) + Mobile menu toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:block">
              <MagneticButton
                href="#contact"
                variant="primary"
                className="min-h-[40px] px-5 py-2 text-xs uppercase tracking-[0.12em]"
                cursorLabel="HIRE"
              >
                Hire me
              </MagneticButton>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-overlay"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-[#f5f2eb] transition-colors hover:border-[#ff7a1f]/60 md:hidden cursor-pointer"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile navigation overlay */}
      <div
        id="mobile-nav-overlay"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-[#0a0a0a]/98 px-6 pt-24 pb-8 backdrop-blur-2xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="flex min-h-[60px] items-baseline justify-between border-b border-white/[0.08] py-3 font-display text-5xl tracking-[0.06em] text-[#f5f2eb] transition-colors hover:text-[#ff8a1f]"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-[#9e998e]">0{idx + 1}</span>
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-4 pt-6">
          <MagneticButton
            href="#contact"
            onClick={handleLinkClick}
            variant="primary"
            className="w-full py-3.5 text-sm uppercase tracking-[0.14em]"
          >
            Hire me
          </MagneticButton>

          <div className="flex items-center justify-between text-xs text-[#9e998e]">
            <span>{SITE_INFO.shortLocation}</span>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#f5f2eb]/80 hover:text-[#ff8a1f]"
            >
              <span>{CONTACT.instagramHandle}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
