import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"td">>} */
export const DataGridEmptyMessage = ({
  children,
  colSpan,
  className,
  ...props
}) => {
  const isMobile = useIsDataGridMobile();

  if (isMobile) return <div className={className}>{children}</div>;

  return (
    <tr>
      <td {...props} className={className} colSpan={colSpan}>
        {children}
      </td>
    </tr>
  );
};
