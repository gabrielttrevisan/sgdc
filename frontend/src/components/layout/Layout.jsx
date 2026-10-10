import { NavLink, Outlet } from "react-router";
import { useState } from "react";
import { NavSection } from "../nav/section/NavSection.jsx";
import { Nav } from "../nav/Nav.jsx";
import sgdcLogo from "../../assets/sgdc-logo.png";
import { ToastTray } from "../toast/ToastTray.jsx";
import { BoxIcon } from "./icon/BoxIcon.jsx";
import { PeopleIcon } from "./icon/PeopleIcon.jsx";
import { authStore } from "../../store/Auth.store.js";
import { GraphIcon } from "./icon/GraphIcon.jsx";
import { FilePlotIcon } from "./icon/FilePlotIcon.jsx";
import { HouseIcon } from "./icon/HouseIcon.jsx";
import { UserControls } from "./UserControls.jsx";

import "./Layout.css";

/**
 * @typedef {Object} LayoutProps
 * @prop {import("react").ReactNode} children
 */

const MENU_ICON = {
  dashboard: GraphIcon,
  box: BoxIcon,
  people: PeopleIcon,
  file: FilePlotIcon,
  house: HouseIcon,
};

/** @type {import("react").FC<LayoutProps>} */
export const Layout = () => {
  const [menuItems] = useState(() => authStore.menu);

  return (
    <>
      <div className="sgdc-layout">
        <aside>
          <div className="scdc-layout__img-wrapper">
            <img src={sgdcLogo} alt="SGDC" className="sgdc-logo" />
          </div>

          <Nav>
            {menuItems?.map((menuItem) => {
              const Icon = MENU_ICON[menuItem.icon];

              return (
                <NavSection
                  title={menuItem.title}
                  id={menuItem.id}
                  key={menuItem.id}
                  icon={Icon ? <Icon /> : undefined}
                  to={menuItem.path}
                >
                  {menuItem.subItems?.map((subItem) => {
                    return (
                      <NavLink
                        key={`${menuItem.id}-${subItem.id}`}
                        to={subItem.path}
                      >
                        {subItem.title}
                      </NavLink>
                    );
                  })}
                </NavSection>
              );
            })}
          </Nav>

          <UserControls />
        </aside>

        <main>
          <Outlet />
        </main>
      </div>

      <ToastTray />
    </>
  );
};
