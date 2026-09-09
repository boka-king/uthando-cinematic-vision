import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Google Analytics is off until a measurement ID is supplied as
 * VITE_GA_MEASUREMENT_ID. With no ID present this renders nothing and loads
 * no third-party script.
 */
const GA_ID = import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!GA_ID) return;
    if (!document.getElementById("ga-src")) {
      const script = document.createElement("script");
      script.id = "ga-src";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
    }
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
