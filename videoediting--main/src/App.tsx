import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IntroLoader } from "./components/IntroLoader";
import { CustomCursor } from "./components/CustomCursor";
import { Navbar } from "./components/Navbar";
import { TimelineProgress } from "./components/TimelineProgress";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { About } from "./components/About";
import { Work } from "./components/Work";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { NotFound } from "./components/NotFound";
import { useColorGrade } from "./hooks/useColorGrade";
import { useDeviceCapabilities } from "./hooks/useDeviceCapabilities";
import { initAnalytics } from "./utils/analytics";

gsap.registerPlugin(ScrollTrigger);

const CreatorSpotlight = lazy(() =>
  import("./components/CreatorSpotlight").then((m) => ({ default: m.CreatorSpotlight }))
);
const Clients = lazy(() =>
  import("./components/Clients").then((m) => ({ default: m.Clients }))
);
const BeforeAfter = lazy(() =>
  import("./components/BeforeAfter").then((m) => ({ default: m.BeforeAfter }))
);
const CaseStudies = lazy(() =>
  import("./components/CaseStudies").then((m) => ({ default: m.CaseStudies }))
);
const Services = lazy(() =>
  import("./components/Services").then((m) => ({ default: m.Services }))
);
const Process = lazy(() =>
  import("./components/Process").then((m) => ({ default: m.Process }))
);
const Testimonials = lazy(() =>
  import("./components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const Contact = lazy(() =>
  import("./components/Contact").then((m) => ({ default: m.Contact }))
);
const Footer = lazy(() =>
  import("./components/Footer").then((m) => ({ default: m.Footer }))
);

function SectionFallback() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8">
      <div className="skeleton-shimmer h-40 w-full rounded-xl border border-[var(--border-subtle)]" />
    </div>
  );
}

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const { grade, cycleGrade } = useColorGrade();
  const { reducedMotion, lowPowerDevice } = useDeviceCapabilities();

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const isNotFound = pathname !== "/" && pathname !== "/index.html";

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (isNotFound || reducedMotion || lowPowerDevice) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const destination = document.querySelector(href);
      if (destination) {
        e.preventDefault();
        lenis.scrollTo(destination as HTMLElement, { offset: -64 });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [isNotFound, reducedMotion, lowPowerDevice]);

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <div
      className={`relative min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)] ${
        lowPowerDevice ? "low-power" : ""
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] focus:rounded-full focus:bg-[var(--accent-start)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <div aria-hidden="true" className="film-grain-overlay" />
      <TimelineProgress />
      <IntroLoader onComplete={handleIntroComplete} />
      <CustomCursor />

      <Navbar grade={grade} onCycleGrade={cycleGrade} />

      <main id="main-content">
        <Hero ready={introFinished} />
        <Stats />
        <About />

        {/* Creative Video Showcase Grid (All 12 Uploaded Cuts) */}
        <Work />

        {/* Auto Creator Spotlight (YouTube API Proxy + Fallback) */}
        <ErrorBoundary sectionName="Creator Spotlight">
          <Suspense fallback={<SectionFallback />}>
            <CreatorSpotlight />
          </Suspense>
        </ErrorBoundary>

        {/* Clients & Collaborations */}
        <ErrorBoundary sectionName="Clients">
          <Suspense fallback={<SectionFallback />}>
            <Clients />
          </Suspense>
        </ErrorBoundary>

        {/* Before / After Lab (Real Video Breakdowns + Color Grade Slider) */}
        <Suspense fallback={<SectionFallback />}>
          <BeforeAfter />
        </Suspense>

        {/* Case Studies */}
        <Suspense fallback={<SectionFallback />}>
          <CaseStudies />
        </Suspense>

        {/* Services + Editing Suite (Premiere Pro, After Effects, CapCut) */}
        <Suspense fallback={<SectionFallback />}>
          <Services />
        </Suspense>

        {/* Workflow Process */}
        <Suspense fallback={<SectionFallback />}>
          <Process />
        </Suspense>

        {/* Testimonials (Auto-hidden while empty) */}
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>

        {/* Smart Contact Form + Direct Channels */}
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <FloatingWhatsApp />
    </div>
  );
}
