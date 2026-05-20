import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"tr">>} */
export const DataGridItem = ({ children, className = "", ...props }) => {
  const isMobile = useIsDataGridMobile();

  const itemClassName = `data-grid__item ${className}`;

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
