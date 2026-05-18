import { useEffect, useState } from "react";
import useMatchMediaContext from "./useMatchMediaContext";

/**
 * @param {string} query
 * @param {boolean} init
 * @returns {boolean}
 */
export default function useMatchMedia(query, init = false) {
  const [matches, setMatches] = useState(init);
  const breakpoints = useMatchMediaContext();

  useEffect(() => {
    breakpoints.matches(query, (e) => {
      setMatches(e.matches);
    });
  }, []);

  return matches;
}
