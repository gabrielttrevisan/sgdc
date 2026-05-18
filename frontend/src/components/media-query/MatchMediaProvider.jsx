import { useEffect, useState } from "react";
import { MediaQueryContext } from "./context";

export const MatchMediaProvider = ({ children }) => {
  /** @type {[Map<string, MediaQueryList>, import("react").Dispatch<import("react").SetStateAction<Map<string, MediaQueryList>>>]} */
  const [breakpoints, setBreakpoints] = useState(new Map());

  /** @type {MapUpdaterCallback} */
  const updateMap = (breakpoint, mediaQueryList) => {
    setBreakpoints((prev) => {
      const newMap = new Map(prev.entries());

      newMap.set(breakpoint, mediaQueryList);

      return newMap;
    });
  };

  /** @type {import("./context").MediaQueryMatchCheckCallback} */
  const matches = (query, changeHandler) => {
    let mediaQueryList = breakpoints.get(query);

    if (!mediaQueryList) {
      mediaQueryList = window.matchMedia(query);

      mediaQueryList.onchange = (e) => {
        changeHandler({ matches: e.matches, query, nativeEvent: e });
      };

      updateMap(query, mediaQueryList);
    }

    return mediaQueryList.matches;
  };

  useEffect(() => {
    return () => {
      for (const mediaQueryList of breakpoints.values()) {
        mediaQueryList.onchange = null;
      }

      breakpoints.clear();
    };
  }, []);

  return (
    <MediaQueryContext
      value={{
        breakpoints,
        matches,
      }}
    >
      {children}
    </MediaQueryContext>
  );
};

/**
 * @callback MapUpdaterCallback
 * @param {string} query
 * @param {MediaQueryList} mediaQueryList
 * @returns {void}
 */
