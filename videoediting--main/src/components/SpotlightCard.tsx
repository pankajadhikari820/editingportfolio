import React, { useRef, useState } from "react";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * 21st.dev-inspired spotlight card with cursor-tracking ambient radial sheen
 * and crisp hairline border illumination on desktop pointer devices.
 */
export function SpotlightCard({
  children,
  className = "",
  ...rest
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false });
  const { canHoverFine, reducedMotion } = useDeviceCapabilities();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverFine || reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    if (coords.active) {
      setCoords((prev) => ({ ...prev, active: false }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-[border-color,box-shadow,transform] duration-300 ${className}`}
      {...rest}
    >
      {canHoverFine && !reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px z-0 rounded-xl transition-opacity duration-300"
          style={{
            opacity: coords.active ? 1 : 0,
            background: `radial-gradient(360px circle at ${coords.x}px ${coords.y}px, var(--accent-glow), transparent 65%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
