import useMatchMedia from "../../media-query/useMatchMedia";
import { DataGridHeaderActionsMobile } from "./DataGridHeaderActionsMobile";

/** @type {import("react").FC<import("react").HTMLProps<"div">>} */
export const DataGridHeaderActions = ({
  children,
  className = "",
  ...props
}) => {
  const isMobile = useMatchMedia("(max-width: 768px)");

  const headerActionsClassName = `data-grid__header-actions ${className}`;

  if (isMobile) {
    return (
      <DataGridHeaderActionsMobile className={headerActionsClassName}>
        {children}
      </DataGridHeaderActionsMobile>
    );
  }

  return (
    <div className={headerActionsClassName} {...props}>
      {children}
    </div>
  );
};
