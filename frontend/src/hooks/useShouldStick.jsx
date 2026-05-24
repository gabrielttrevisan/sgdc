import { useEffect, useRef, useState } from "react";

/**
 * @param {IntersectionObserverInit} [observerInit]
 * @returns {[shouldStick: boolean, sentinel: import("react").ReactNode]}
 */
export default function useShouldStick(observerInit) {
  const [shouldStick, setShouldStick] = useState(false);
  const ref = useRef();
  const observerRef = useRef();

  useEffect(() => {
    if (ref.current) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      observerRef.current = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) setShouldStick(false);
          else setShouldStick(true);
        },
        {
          rootMargin: "0px 0px 0px 0px",
          threshold: [0],
          ...observerInit,
        },
      );

      observerRef.current.observe(ref.current);

      return () => observerRef.current.disconnect();
    }
  }, [ref, observerInit]);

  return [shouldStick, <div ref={ref}></div>];
}
