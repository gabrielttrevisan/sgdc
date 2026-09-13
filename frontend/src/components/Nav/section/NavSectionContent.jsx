import { NavLink } from "react-router";
import { NavSectionAccordion } from "./NavSectionAccordion";

export function NavSectionContent({ title, to, children, icon, ...props }) {
  if (to)
    return (
      <NavLink to={to} className="nav-section__button">
        {icon}

        {title}
      </NavLink>
    );

  return (
    <NavSectionAccordion {...props} title={title} icon={icon}>
      {children}
    </NavSectionAccordion>
  );
}
