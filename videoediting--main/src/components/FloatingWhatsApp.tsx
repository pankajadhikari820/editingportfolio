import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "../utils/video";

export function FloatingWhatsApp() {
  const [obscured, setObscured] = useState(false);

  const href = buildWhatsAppUrl({
    customText: "Hi Pankaj, I'd love to chat about editing my upcoming videos.",
  });

  // Observe #contact and footer (including after lazy Suspense chunks mount)
  useEffect(() => {
    const visibleSet = new Set<Element>();
    const observedSet = new Set<Element>();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target);
          } else {
            visibleSet.delete(entry.target);
          }
        }
        setObscured(visibleSet.size > 0);
      },
      { threshold: 0.01, rootMargin: "0px 0px 40px 0px" }
    );

    const attachTargets = () => {
      const candidates = [
        document.getElementById("contact"),
        document.querySelector("footer"),
      ].filter((el): el is HTMLElement => Boolean(el));

      for (const el of candidates) {
        if (!observedSet.has(el)) {
          observedSet.add(el);
          intersectionObserver.observe(el);
        }
      }
    };

    attachTargets();

    const mutationObserver = new MutationObserver(() => {
      attachTargets();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pankaj on WhatsApp"
      data-cursor="CHAT"
      className={`group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-12 min-w-[48px] items-center justify-center gap-2.5 rounded-full bg-amber-gradient px-3.5 shadow-[0_8px_30px_var(--accent-glow)] transition-all duration-250 hover:scale-[1.04] active:scale-[0.97] sm:right-6 sm:bottom-6 sm:h-13 sm:px-5 ${
        obscured
          ? "pointer-events-none translate-y-4 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100"
          : "translate-y-0 opacity-100"
      }`}
    >
      <MessageCircle className="h-5 w-5 shrink-0 fill-current" />
      <span className="hidden text-xs font-semibold tracking-[0.12em] uppercase sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
