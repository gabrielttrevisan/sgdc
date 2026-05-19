import { useEffect, useRef, useState } from "react";

/** @type {import("react").FC<import("react").HTMLProps<"div">>} */
export const DataGridHeader = ({ children, className = "", ...props }) => {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) setIsSticky(false);
          else setIsSticky(true);
        },
        {
          rootMargin: "0px 0px 0px 0px",
          threshold: [0],
        },
      );

      observer.observe(ref.current);

      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <>
      <div ref={ref} className="data-grid__header-visibility-sentinel"></div>

      <div
        className={`data-grid__header ${isSticky ? "--sticky" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
};
