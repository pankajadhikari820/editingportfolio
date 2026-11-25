import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [data-cursor], input, textarea, select") as HTMLElement | null;
      if (interactive) {
        setHovered(true);
        setLabel(interactive.getAttribute("data-cursor") || "");
      } else {
        setHovered(false);
        setLabel("");
      }
    };

    const onLeave = () => {
      setVisible(false);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Outer viewfinder ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          label
            ? "h-16 w-16 border-[#ff7a1f]/80 bg-[#ff5a1f]/15 backdrop-blur-[2px]"
            : hovered
              ? "h-11 w-11 border-[#ff7a1f]/75 bg-[#ff5a1f]/10"
              : "h-7 w-7 border-white/35 bg-transparent"
        }`}
      >
        {label && (
          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#f5f2eb] uppercase">
            {label}
          </span>
        )}
      </div>

      {/* Precision center crosshair dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full bg-[#ff7a1f] transition-opacity duration-150 will-change-transform ${
          label ? "h-0 w-0 opacity-0" : "h-1.5 w-1.5 opacity-95"
        }`}
      />
    </div>
  );
}
