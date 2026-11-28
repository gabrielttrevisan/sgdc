import { createContext } from "react";

export const DEFAULT_TOUR_GUIDE_OPTIONS = {
  exitOnClickOutside: false,
  completeOnFinish: true,
  autoScrollSmooth: true,
  nextLabel: "Próximo →",
  prevLabel: "← Anterior",
  finishLabel: "Entendi",
};

export const TourGuideContext = createContext(null);
