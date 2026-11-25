import { ArrowUp, Instagram, Mail, MessageCircle } from "lucide-react";
import { CONTACT, SITE_INFO } from "../data";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#080808] py-10 pb-24 sm:py-12 sm:pb-12">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-display text-2xl tracking-[0.12em] text-[#f5f2eb] uppercase">
            {SITE_INFO.brandLogo}
          </p>
          <p className="mt-1.5 text-xs text-[#9e998e] sm:text-[13px]">
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#f5f2eb]/80 transition-colors hover:border-[#ff7a1f]/60 hover:text-[#ff8a1f]"
          >
            <Instagram className="h-4 w-4" />
          </a>

          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#f5f2eb]/80 transition-colors hover:border-[#ff7a1f]/60 hover:text-[#ff8a1f]"
          >
            <MessageCircle className="h-4 w-4" />
          </a>

          <a
            href={CONTACT.emailUrl}
            aria-label="Email"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#f5f2eb]/80 transition-colors hover:border-[#ff7a1f]/60 hover:text-[#ff8a1f]"
          >
            <Mail className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="ml-1 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-[#f5f2eb]/80 uppercase transition-colors hover:border-[#ff7a1f]/60 hover:text-[#ff8a1f] cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
