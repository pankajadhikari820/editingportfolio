import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "../utils/video";

export function FloatingWhatsApp() {
  const href = buildWhatsAppUrl({
    customText: "Hi Pankaj, I'd love to chat about editing my upcoming videos.",
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Pankaj on WhatsApp"
      data-cursor="CHAT"
      className="group fixed right-4 bottom-[max(1.1rem,env(safe-area-inset-bottom))] z-40 flex h-13 items-center gap-2.5 rounded-full bg-amber-gradient px-4 text-[#0a0a0a] shadow-[0_8px_30px_rgba(255,90,31,0.38)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_12px_36px_rgba(255,138,31,0.55)] active:scale-[0.97] sm:right-6 sm:bottom-6 sm:h-13 sm:px-5"
    >
      <MessageCircle className="h-5 w-5 shrink-0 fill-current" />
      <span className="hidden text-xs font-semibold tracking-[0.12em] uppercase sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
