import { useEffect, useRef } from "react";
import { TourGuideClient } from "@sjmc11/tourguidejs";
import {
  DEFAULT_TOUR_GUIDE_OPTIONS,
  TourGuideContext,
} from "./TourGuideContext.js";

export function TourGuideProvider({ children }) {
  /** @type {import("react").RefObject<TourGuideClient | null>} */
  const tgRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (!tgRef.current) {
      tgRef.current = new TourGuideClient(DEFAULT_TOUR_GUIDE_OPTIONS);
    }

    const tg = tgRef.current;

    return () => {
      isMountedRef.current = false;

      if (tg.isVisible) void tg.exit();

      queueMicrotask(() => {
        if (isMountedRef.current || tgRef.current !== tg) return;

        void tg.destroyListeners();
        tg.dialog.remove();
        tg.backdrop.remove();
        document.body.classList.remove("tg-no-interaction");
        tgRef.current = null;
      });
    };
  }, []);

  return <TourGuideContext value={tgRef}>{children}</TourGuideContext>;
}
