import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"tr">>} */
export const DataGridItemActions = ({ children, className = "", ...props }) => {
  const isMobile = useIsDataGridMobile();

  const itemActionsClassName = `data-grid__item-actions ${className}`;

  if (isMobile) {
    return (
      <div className={itemActionsClassName} {...props}>
        {children}
      </div>
    );
  }

  return (
    <td className={itemActionsClassName} {...props}>
      {children}
    </td>
  );
};
