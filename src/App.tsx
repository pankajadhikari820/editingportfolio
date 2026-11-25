import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IntroLoader } from "./components/IntroLoader";
import { CustomCursor } from "./components/CustomCursor";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { About } from "./components/About";
import { Work } from "./components/Work";
import { Clients } from "./components/Clients";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

  // Initialize Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.25,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Smooth-scroll internal hash anchors via Lenis
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
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f2eb]">
      {/* Subtle 35mm animated film grain overlay */}
      <div aria-hidden="true" className="film-grain-overlay" />

      {/* Skippable film countdown intro (< 1.6s) */}
      <IntroLoader onComplete={handleIntroComplete} />

      {/* Desktop viewfinder custom cursor */}
      <CustomCursor />

      {/* 1. Sticky Glass Navbar */}
      <Navbar />

      <main>
        {/* 2. Full-screen Viewfinder Hero */}
        <Hero ready={introFinished} />

        {/* 3. Count-up Stats */}
        <Stats />

        {/* 4. About + 35mm Film Frame Portrait */}
        <About />

        {/* 5. Selected Work (Pinned Horizontal Film Strip) */}
        <Work />

        {/* 6. Clients & Collaborations (4 Groups + Marquee) */}
        <Clients />

        {/* 7. Services + Premiere Pro / CapCut Suite */}
        <Services />

        {/* 8. 4-Step Animated Workflow Process */}
        <Process />

        {/* 9. Testimonials (Auto-hidden while empty) */}
        <Testimonials />

        {/* 10. Contact Form (Web3Forms + Prefilled WhatsApp) */}
        <Contact />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* 12. Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </div>
  );
}
