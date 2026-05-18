import { useEffect, useState } from "react";
import { MediaQueryContext } from "./context";

export const MatchMediaProvider = ({ children }) => {
  /** @type {[Map<string, import("./context").MediaQueryState>, import("react").Dispatch<import("react").SetStateAction<Map<string, import("./context").MediaQueryState>>>]} */
  const [mediaQueryStates, setMediaQueryStates] = useState(new Map());

  /** @type {MapUpdaterCallback} */
  const updateMap = (breakpoint, mediaQueryState) => {
    setMediaQueryStates((prev) => {
      const newMap = new Map(prev.entries());

      newMap.set(breakpoint, mediaQueryState);

      return newMap;
    });
  };

  /** @type {import("./context").MediaQueryMatchCheckCallback} */
  const matches = (query, changeHandler) => {
    let mediaQueryState = mediaQueryStates.get(query);
    const listener = (e) => {
      changeHandler({ matches: e.matches, query, nativeEvent: e });
    };

    if (!mediaQueryState) {
      mediaQueryState = {
        list: window.matchMedia(query),
        listeners: [listener],
      };

      mediaQueryState.list.addEventListener("change", listener);

      updateMap(query, mediaQueryState);
    } else {
      mediaQueryState.listeners.add(listener);
    }

    return mediaQueryState.list.matches;
  };

  useEffect(() => {
    return () => {
      for (const [, mediaQueryState] of mediaQueryStates) {
        mediaQueryState.listeners.forEach((listener) =>
          mediaQueryState.list.removeEventListener("change", listener),
        );
      }

      mediaQueryStates.clear();
    };
  }, []);

  return <MediaQueryContext value={{ matches }}>{children}</MediaQueryContext>;
};

/**
 * @callback MapUpdaterCallback
 * @param {string} query
 * @param {import("./context").MediaQueryState} mediaQueryState
 * @returns {void}
 */
