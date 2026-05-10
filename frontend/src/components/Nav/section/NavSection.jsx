import { useLocation } from "react-router";
import { useNavContext } from "../context/useNavContext";
import "./NavSection.css";

/**
 * @typedef {Object} NavSectionProps
 * @prop {string|import("react").ReactNode} title
 * @prop {string} id
 * @prop {import("react").ReactNode} children
 * @prop {import("react").ReactNode} icon
 */

import { useCallback, useEffect, useState } from "react";

/** @type {import("react").FC<NavSectionProps>} */
export const NavSection = ({ title, id, children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { open, selected } = useNavContext();
  const { pathname } = useLocation();

  const handleOnClick = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const hasActive =
      document.querySelector(`#accordion-region-${id} a.active`) !== null;

    if (hasActive) {
      open(id);
      setIsOpen(hasActive);
    } else setIsOpen(false);
  }, [id, pathname]);

  const isSelected = selected === id;
  const isActuallyOpen = isSelected ? isOpen && selected === id : isOpen;

  return (
    <div className="nav-section">
      <button
        type="button"
        aria-controls={`accordion-region-${id}`}
        aria-expanded={isActuallyOpen}
        onClick={handleOnClick}
      >
        {icon}

        {title}
      </button>

      <ul
        className="nav-section__content"
        role="region"
        id={`accordion-region-${id}`}
        aria-labelledby={`accordion-button-${id}`}
        hidden={!isActuallyOpen}
      >
        {children}
      </ul>
    </div>
  );
};
