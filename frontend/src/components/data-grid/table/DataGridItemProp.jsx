import useIsDataGridMobile from "../context/useIsDataGridMobile";

/**
 * @typedef {Object} DataGridItemPropProps
 * @prop {string} heading
 */

/** @type {import("react").FC<import("react").HTMLProps<"tr"> & DataGridItemPropProps>} */
export const DataGridItemProp = ({
  children,
  className,
  heading,
  ...props
}) => {
  const isMobile = useIsDataGridMobile();

  if (isMobile) {
    return (
      <div className={className} {...props}>
        <p>{heading}</p>

        <div>{children}</div>
      </div>
    );
  }

  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
};
