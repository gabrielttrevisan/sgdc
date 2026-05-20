import { useEffect, useState } from "react";
import useMatchMediaContext from "./useMatchMediaContext";
import { useResolvedPath } from "react-router";

/**
 * @param {string} query
 * @param {boolean} init
 * @returns {boolean}
 */
export default function useMatchMedia(query, init = false) {
  const [matches, setMatches] = useState(init);
  const mediaQuery = useMatchMediaContext();
  const path = useResolvedPath();

  useEffect(() => {
    const cleanUp = mediaQuery.matches(
      query,
      (e) => {
        setMatches(e.matches);
      },
      init,
    );

    return () => cleanUp();
  }, [query]);

  useEffect(() => {
    const list = window.matchMedia(query);

    setMatches(list.matches);
  }, [path.pathname]);

  return matches;
}
