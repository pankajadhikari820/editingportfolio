import { useCallback, useEffect, useState } from "react";

export type ColorGradeMode = "warm" | "cool" | "daylight";

const STORAGE_KEY = "pankajxvisuals-color-grade";

export const COLOR_GRADE_META: Record<
  ColorGradeMode,
  { label: string; shortLabel: string; lutName: string }
> = {
  warm: {
    label: "Warm 2383 (Dark)",
    shortLabel: "2383 WARM",
    lutName: "KODAK 2383",
  },
  cool: {
    label: "Cool Slate (Dark)",
    shortLabel: "TEAL SLATE",
    lutName: "ARRI TEAL",
  },
  daylight: {
    label: "Daylight Studio (Light)",
    shortLabel: "REC.709 DAY",
    lutName: "DAYLIGHT",
  },
};

function getInitialGrade(): ColorGradeMode {
  if (typeof window === "undefined") return "warm";

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ColorGradeMode | null;
    if (saved === "warm" || saved === "cool" || saved === "daylight") {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  return prefersLight ? "daylight" : "warm";
}

function applyGradeToDom(mode: ColorGradeMode): void {
  const root = document.documentElement;
  root.setAttribute("data-grade", mode);
  if (mode === "daylight") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute(
      "content",
      mode === "daylight" ? "#f5f2eb" : mode === "cool" ? "#080b0f" : "#0a0a0a"
    );
  }
}

export function useColorGrade() {
  const [grade, setGradeState] = useState<ColorGradeMode>(getInitialGrade);

  useEffect(() => {
    applyGradeToDom(grade);
  }, [grade]);

  const setGrade = useCallback((next: ColorGradeMode) => {
    setGradeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const cycleGrade = useCallback(() => {
    setGradeState((prev) => {
      const order: ColorGradeMode[] = ["warm", "cool", "daylight"];
      const next = order[(order.indexOf(prev) + 1) % order.length] ?? "warm";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  return { grade, setGrade, cycleGrade };
}
