import React, { useRef, useState } from "react";
import { useDeviceCapabilities } from "../hooks/useDeviceCapabilities";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magneticStrength?: number;
  cursorLabel?: string;
}

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type MagneticButtonProps = AnchorProps | ButtonProps;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-amber-gradient font-semibold shadow-[0_0_26px_var(--accent-glow)] hover:shadow-[0_0_38px_var(--accent-glow)] hover:brightness-105",
  secondary:
    "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--accent-solid)] hover:bg-[var(--bg-elevated)] font-medium",
  ghost:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] font-medium",
};

export function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    variant = "primary",
    className = "",
    magneticStrength = 0.22,
    cursorLabel,
    ...rest
  } = props;

  const { canHoverFine, reducedMotion } = useDeviceCapabilities();
  const canMagnet = canHoverFine && !reducedMotion;

  const elementRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canMagnet || !elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({
      x: Math.max(-10, Math.min(10, relX * magneticStrength)),
      y: Math.max(-7, Math.min(7, relY * magneticStrength)),
    });
  };

  const handleMouseLeave = () => {
    if (offset.x !== 0 || offset.y !== 0) {
      setOffset({ x: 0, y: 0 });
    }
  };

  const sharedClasses = [
    "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap shrink-0",
    "min-h-[44px] px-6 py-2.5 text-sm tracking-wide",
    "transition-[transform,box-shadow,background-color,border-color,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:scale-[0.98] select-none cursor-pointer",
    VARIANT_CLASSES[variant],
    className,
  ].join(" ");

  const style: React.CSSProperties = canMagnet
    ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
    : {};

  if ("href" in props && props.href !== undefined) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={(node) => {
          elementRef.current = node;
        }}
        href={props.href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        data-cursor={cursorLabel}
        className={sharedClasses}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={(node) => {
        elementRef.current = node;
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      data-cursor={cursorLabel}
      className={sharedClasses}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
