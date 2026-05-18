import { useEffect, useState } from "react";
import { MediaQueryContext } from "./context";

export const MatchMediaProvider = ({ children }) => {
  /** @type {[Map<string, MediaQueryList>, import("react").Dispatch<import("react").SetStateAction<Map<string, MediaQueryList>>>]} */
  const [mediaQueries, setMediaQueries] = useState(new Map());

  /** @type {MapUpdaterCallback} */
  const updateMap = (query, mediaQueryState) => {
    setMediaQueries((prev) => {
      const newMap = new Map(prev.entries());

      newMap.set(query, mediaQueryState);

      return newMap;
    });
  };

  /** @type {import("./context").MediaQueryMatchCheckCallback} */
  const matches = (query, changeHandler) => {
    let mediaQueryList = mediaQueries.get(query);
    const listener = (e) => {
      changeHandler({ matches: e.matches, query, nativeEvent: e });
    };

    if (!mediaQueryList) {
      mediaQueryList = window.matchMedia(query);

      updateMap(query, mediaQueryList);
    }

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  };

  useEffect(() => {
    return () => {
      mediaQueries?.clear();
    };
  }, []);

  return <MediaQueryContext value={{ matches }}>{children}</MediaQueryContext>;
};

/**
 * @callback MapUpdaterCallback
 * @param {string} query
 * @param {MediaQueryList} mediaQueryList
 * @returns {void}
 */
