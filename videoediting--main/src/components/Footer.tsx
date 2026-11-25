import { ArrowUp, Mail } from "lucide-react";
import { CONTACT, SITE_INFO } from "../data";
import { InstagramIcon, StudioApertureIcon, WhatsAppIcon } from "./BrandIcons";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-12">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="inline-flex items-center gap-2.5 font-display text-2xl tracking-[0.12em] text-[var(--text-primary)] uppercase">
            <StudioApertureIcon className="h-5 w-5 text-[var(--accent-solid)]" />
            <span>{SITE_INFO.brandLogo}</span>
          </p>
          <p className="mt-1.5 text-xs text-[var(--text-muted)] sm:text-[13px]">
            © {SITE_INFO.copyrightYear} {SITE_INFO.name} · {SITE_INFO.brand} ·{" "}
            {SITE_INFO.shortLocation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-solid)] hover:text-[var(--accent-solid)]"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>

          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-solid)] hover:text-[#25D366]"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>

          <a
            href={CONTACT.emailUrl}
            aria-label="Email"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-solid)] hover:text-[var(--accent-solid)]"
          >
            <Mail className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="ml-1 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-[var(--text-secondary)] uppercase transition-colors hover:border-[var(--accent-solid)] hover:text-[var(--accent-solid)] cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
