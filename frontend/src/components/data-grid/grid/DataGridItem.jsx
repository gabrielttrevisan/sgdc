import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"tr">>} */
export const DataGridItem = ({
  children,
  className = "",
  isSelectable = false,
  ...props
}) => {
  const isMobile = useIsDataGridMobile();

  const selectableClass = isSelectable ? ` data-grid__item--selectable` : "";
  const clazzName = className ? ` ${className} ` : "";
  const itemClassName = `data-grid__item${selectableClass}${clazzName}`;

  if (isMobile) {
    return (
      <li className={itemClassName} {...props}>
        {children}
      </li>
    );
  }

  return (
    <tr className={itemClassName} role="row" {...props}>
      {children}
    </tr>
  );
};
