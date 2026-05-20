import { useState, useCallback } from "react";
import { VisuallyHidden } from "../accessibility/visually-hidden/VisuallyHidden";
import useMatchMedia from "../media-query/useMatchMedia";
import NavContextProvider from "./context/Provider";
import { MenuIcon } from "../icons/MenuIcon";

/**
 * @typedef {Object} NavProps
 * @prop {import("react").ReactNode} children
 */

/** @type {import("react").FC<NavProps>} */
export const Nav = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMatchMedia("(max-width: 1255px)");

  const onClickToClose = useCallback((e) => {
    const mainMenu = e.target.closest("#main-nav");
    const mainMenuButton = e.target.closest("#main-nav-button");

    if (mainMenu || !mainMenuButton) setIsOpen(false);
  }, []);

  const toggle = () => {
    setIsOpen((prev) => {
      const newIsOpen = !prev;

      if (isMobile) {
        if (newIsOpen) window.addEventListener("click", onClickToClose);
        else window.removeEventListener("click", onClickToClose);
      }

      return newIsOpen;
    });
  };

  return (
    <>
      {isMobile && (
        <button
          type="button"
          onClick={toggle}
          className="main-menu-button"
          id="main-nav-button"
        >
          <MenuIcon size={20} />
          <VisuallyHidden>
            {isOpen ? "Fechar Menu Principal" : "Abrir Menu Principal"}
          </VisuallyHidden>
        </button>
      )}

      <NavContextProvider>
        <nav
          id="main-nav"
          className={isMobile ? "--mobile" : undefined}
          hidden={isMobile && !isOpen}
        >
          {children}
        </nav>
      </NavContextProvider>
    </>
  );
};
