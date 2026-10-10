import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useNavContext } from "../context/useNavContext";

export function NavSectionAccordion({ title, id, children, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const { open, selected } = useNavContext();
  const { pathname } = useLocation();

  const handleOnClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

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
    <>
      <button
        type="button"
        aria-controls={`accordion-region-${id}`}
        aria-expanded={isActuallyOpen}
        onClick={handleOnClick}
        className="nav-section__button"
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
    </>
  );
}
