import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"tr">>} */
export const DataGridItemActions = ({ children, className, ...props }) => {
  const isMobile = useIsDataGridMobile();

  if (isMobile) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <td className={className} {...props}>
      {children}
    </td>
  );
};
