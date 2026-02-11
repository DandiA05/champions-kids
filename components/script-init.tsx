"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScriptInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Determine if we should run the init logic.
    // We check if window.POTENZA exists.
    if (
      typeof window !== "undefined" &&
      (window as any).POTENZA &&
      (window as any).POTENZA.init
    ) {
      // Timeout to ensure DOM is ready and previous page cleanup is done
      setTimeout(() => {
        (window as any).POTENZA.init();
      }, 100);
    }
  }, [pathname]);

  return null;
}
