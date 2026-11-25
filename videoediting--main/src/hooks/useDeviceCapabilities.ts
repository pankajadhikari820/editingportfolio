import { useEffect, useState } from "react";

interface NavigatorWithExtras extends Navigator {
  connection?: {
    saveData?: boolean;
  };
}

export interface DeviceCapabilities {
  reducedMotion: boolean;
  canHoverFine: boolean;
  lowPowerDevice: boolean;
  saveData: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>(() => {
    if (typeof window === "undefined") {
      return {
        reducedMotion: false,
        canHoverFine: false,
        lowPowerDevice: false,
        saveData: false,
      };
    }

    const nav = window.navigator as NavigatorWithExtras;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
    const saveData = Boolean(nav.connection?.saveData);

    return {
      reducedMotion,
      canHoverFine,
      lowPowerDevice: reducedMotion || cores <= 4 || saveData,
      saveData,
    };
  });

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => {
      const nav = window.navigator as NavigatorWithExtras;
      const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
      const saveData = Boolean(nav.connection?.saveData);
      const reducedMotion = motionMq.matches;
      const canHoverFine = pointerMq.matches;

      setCaps({
        reducedMotion,
        canHoverFine,
        lowPowerDevice: reducedMotion || cores <= 4 || saveData,
        saveData,
      });
    };

    motionMq.addEventListener("change", update);
    pointerMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      pointerMq.removeEventListener("change", update);
    };
  }, []);

  return caps;
}
