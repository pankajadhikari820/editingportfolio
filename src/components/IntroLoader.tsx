import { useEffect, useState } from "react";
import { SITE_INFO } from "../data";

interface IntroLoaderProps {
  onComplete: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [step, setStep] = useState<number>(3);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDone(true);
      onComplete();
      return;
    }

    const t1 = window.setTimeout(() => setStep(2), 360);
    const t2 = window.setTimeout(() => setStep(1), 720);
    const t3 = window.setTimeout(() => setShutterOpen(true), 1060);
    const t4 = window.setTimeout(() => {
      setDone(true);
      onComplete();
    }, 1520);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setShutterOpen(true);
    window.setTimeout(() => {
      setDone(true);
      onComplete();
    }, 220);
  };

  if (done) return null;

  return (
    <div
      role="status"
      aria-label="Loading portfolio reel"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] transition-opacity duration-300 ${
        shutterOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Top & bottom cinema shutter blades */}
      <div
        aria-hidden="true"
        className={`fixed inset-x-0 top-0 h-1/2 bg-[#070707] border-b border-white/10 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          shutterOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 h-1/2 bg-[#070707] border-t border-white/10 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          shutterOpen ? "translate-y-full" : "translate-y-0"
        }`}
      />

      {/* Center Academy film leader countdown reticle */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 ${
          shutterOpen ? "scale-110 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
          {/* Outer film leader ring */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.2"
            />
            <circle
              cx="100"
              cy="100"
              r="74"
              fill="none"
              stroke="url(#loaderAmber)"
              strokeWidth="1.5"
              strokeDasharray="10 6"
            />
            <line x1="100" y1="6" x2="100" y2="194" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <line x1="6" y1="100" x2="194" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <defs>
              <linearGradient id="loaderAmber" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5a1f" />
                <stop offset="100%" stopColor="#ffb020" />
              </linearGradient>
            </defs>
          </svg>

          <span
            key={step}
            className="font-display text-8xl leading-none tracking-wider text-amber-gradient tabular-nums sm:text-9xl"
          >
            {step}
          </span>
        </div>

        <p className="mt-6 font-mono text-xs tracking-[0.28em] text-[#9e998e] uppercase">
          {SITE_INFO.brandLogo} · 24 FPS
        </p>
      </div>

      {/* Immediate skip control */}
      <button
        type="button"
        onClick={handleSkip}
        className="fixed right-5 bottom-6 z-20 min-h-[44px] rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs tracking-[0.18em] text-[#f5f2eb]/80 uppercase transition-colors hover:border-[#ff7a1f]/60 hover:text-white cursor-pointer"
      >
        Skip intro
      </button>
    </div>
  );
}
