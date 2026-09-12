import { useLocation, useNavigate } from "react-router";
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
import { NavSectionContent } from "./NavSectionContent";

/** @type {import("react").FC<NavSectionProps>} */
export const NavSection = (props) => {
  return (
    <div className="nav-section">
      <NavSectionContent {...props} />
    </div>
  );
};
