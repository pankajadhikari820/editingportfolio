import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { ALL_CLIENTS, CLIENT_GROUPS, type ClientItem } from "../data";
import { useCreator } from "../hooks/useCreator";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";
import { formatSubscribers } from "../utils/video";
import { CreatorAvatar } from "./CreatorAvatar";

gsap.registerPlugin(ScrollTrigger);

function MarqueeClientPill({ client }: { client: ClientItem }) {
  const { data, loading } = useCreator(client.youtubeHandle, client.youtubeChannelId);
  const avatarSrc = data?.channel.avatarUrl || client.logoUrl;
  const displayName = data?.channel.name || client.name;

  return (
    <div className="flex shrink-0 items-center gap-3.5">
      <CreatorAvatar
        src={avatarSrc}
        initials={client.initials}
        name={displayName}
        loading={Boolean((client.youtubeHandle || client.youtubeChannelId) && loading)}
        size="xs"
      />
      <span className="font-display text-2xl tracking-[0.08em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--accent-solid)] sm:text-3xl">
        {displayName}
      </span>
      <span
        aria-hidden="true"
        className="ml-3 inline-flex items-center text-[var(--accent-solid)]/80 sm:ml-6"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
          <path d="M8 0L9.9 6.1L16 8L9.9 9.9L8 16L6.1 9.9L0 8L6.1 6.1L8 0Z" />
        </svg>
      </span>
    </div>
  );
}

function ClientCard({ client }: { client: ClientItem }) {
  const { data, loading } = useCreator(client.youtubeHandle, client.youtubeChannelId);

  const displayName = data?.channel.name || client.name;
  const displayHandle = data?.channel.handle || client.handle;
  const avatarSrc = data?.channel.avatarUrl || client.logoUrl;
  const hasYouTubeSource = Boolean(client.youtubeHandle || client.youtubeChannelId);

  const isSingleLink = client.links.length === 1;
  const primaryLink = client.links[0];

  const headerRow = (
    <div className="flex items-center gap-4">
      <CreatorAvatar
        src={avatarSrc}
        initials={client.initials}
        name={displayName}
        loading={hasYouTubeSource && loading}
        size="md"
      />
      <div className="min-w-0">
        <h4 className="truncate text-base font-semibold text-[var(--text-primary)] sm:text-[17px]">
          {displayName}
        </h4>
        <p className="truncate font-mono text-xs text-[var(--text-muted)]">
          {displayHandle}
          {data && !data.channel.hiddenSubscribers && (
            <span className="ml-2 text-[var(--accent-solid)]">
              · {formatSubscribers(data.channel.subscribers)}
            </span>
          )}
        </p>
      </div>
    </div>
  );

  if (isSingleLink && primaryLink) {
    return (
      <a
        href={primaryLink.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="VISIT"
        className="client-card group relative flex min-h-[132px] flex-col justify-between rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-[transform,border-color,box-shadow,background-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--accent-solid)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_12px_36px_var(--accent-glow)] sm:p-6"
      >
        {headerRow}

        <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 text-xs font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-solid)]">
          <span>Visit page →</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </a>
    );
  }

  return (
    <article className="client-card group relative flex min-h-[132px] flex-col justify-between rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-[transform,border-color,box-shadow,background-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--accent-solid)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_12px_36px_var(--accent-glow)] sm:p-6">
      {headerRow}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border-subtle)] pt-3.5">
        {client.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="VISIT"
            className="inline-flex min-h-[44px] items-center gap-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-solid)]"
          >
            <span>{link.label} →</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </article>
  );
}

export function Clients() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray<HTMLElement>(".client-group-block");
      groups.forEach((group) => {
        const cards = group.querySelectorAll(".client-card");
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.62,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative bg-[var(--bg-primary)] py-20 sm:py-28 lg:py-32"
    >
      {/* Header */}
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.24em] text-[var(--accent-solid)] uppercase">
              Clients &amp; Collaborations
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.94] tracking-[0.02em] text-[var(--text-primary)] uppercase [text-wrap:balance]">
              Trusted by creators, brands &amp; agencies
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            From international family channels and travel outfits to Indian food
            creators, music artists, agencies, and campus clubs.
          </p>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Client Marquee Ribbon with Circular Avatars */}
      <div
        aria-label="Client roster marquee"
        className="marquee-wrapper relative my-12 overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-5 sm:my-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent sm:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent sm:w-28"
        />

        <div className="marquee-track items-center gap-6 sm:gap-10">
          {[...ALL_CLIENTS, ...ALL_CLIENTS].map((client, idx) => (
            <MarqueeClientPill key={`${client.name}-${idx}`} client={client} />
          ))}
        </div>
      </div>

      {/* Four Grouped Client Grids */}
      <div className="mx-auto max-w-[1320px] space-y-16 px-5 sm:space-y-20 sm:px-8">
        {CLIENT_GROUPS.map((group, groupIdx) => (
          <div key={group.id} className="client-group-block">
            <div className="mb-7 flex flex-col justify-between gap-2 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-end">
              <div>
                <span className="font-mono text-[11px] tracking-[0.22em] text-[var(--accent-solid)] uppercase">
                  0{groupIdx + 1} · Group
                </span>
                <h3 className="mt-1 font-display text-3xl tracking-[0.04em] text-[var(--text-primary)] uppercase sm:text-4xl">
                  {group.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] sm:text-sm">
                {group.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.clients.map((client) => (
                <ClientCard key={client.name} client={client} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
