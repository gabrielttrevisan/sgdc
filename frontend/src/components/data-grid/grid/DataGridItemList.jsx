import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"tbody">>} */
export const DataGridItemList = ({ children, className = "", ...props }) => {
  const isMobile = useIsDataGridMobile();

  const itemListClassName = `data-grid__item-list ${className}`;

  if (isMobile)
    return (
      <ul className={itemListClassName} {...props}>
        {children}
      </ul>
    );

  return (
    <tbody className={itemListClassName} {...props}>
      {children}
    </tbody>
  );
};
