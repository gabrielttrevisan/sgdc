import useIsDataGridMobile from "../context/useIsDataGridMobile";

/**
 * @typedef {Object} DataGridItemPropProps
 * @prop {string} heading
 */

/** @type {import("react").FC<import("react").HTMLProps<"tr"> & DataGridItemPropProps>} */
export const DataGridItemProp = ({
  children,
  className = "",
  heading,
  ...props
}) => {
  const isMobile = useIsDataGridMobile();

  const itemPropClassName = `data-grid__item-prop ${className}`;

  if (isMobile) {
    return (
      <div className={itemPropClassName} {...props}>
        <p className="data-grid__item-prop-title">{heading}</p>

        <div>{children}</div>
      </div>
    );
  }

  return (
    <td className={itemPropClassName} {...props}>
      {children}
    </td>
  );
};
