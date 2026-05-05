import { NavLink } from "react-router";
import "./Layout.css"

/**
 * @typedef {Object} LayoutProps
 * @prop {import("react").ReactNode} children
 */

/** @type {import("react").FC<LayoutProps>} */
export const Layout = ({ children }) => {
  return (
    <div className="sgdc-layout">
      <aside>
        <nav>
          <div>
            <h2>Donativos</h2>

            <NavLink to="/donativos">Donativos</NavLink>
            <NavLink to="/donativos">Donativos</NavLink>
            <NavLink to="/donativos">Donativos</NavLink>
            <NavLink to="/donativos">Donativos</NavLink>
            <NavLink to="/donativos">Donativos</NavLink>
            <NavLink to="/donativos">Donativos</NavLink>
            <NavLink to="/donativos">Donativos</NavLink>
          </div>
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  );
};
