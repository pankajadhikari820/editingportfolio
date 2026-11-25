/**
 * Optional cookie-free analytics initializer.
 * Activate by setting VITE_PLAUSIBLE_DOMAIN or VITE_GA_ID in your deployment env vars.
 * Zero cookies are set by default.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;

  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  const gaId = import.meta.env.VITE_GA_ID as string | undefined;

  if (plausibleDomain && plausibleDomain.trim()) {
    const script = document.createElement("script");
    script.defer = true;
    script.setAttribute("data-domain", plausibleDomain.trim());
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  if (gaId && gaId.trim()) {
    const cleanId = gaId.trim();
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cleanId)}`;
    document.head.appendChild(script);

    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer?.push(args);
    };
    w.gtag("js", new Date());
    w.gtag("config", cleanId, {
      client_storage: "none",
      anonymize_ip: true,
    });
  }
}
