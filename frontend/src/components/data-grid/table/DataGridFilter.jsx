/**
 * @typedef {Object} DataGridFilterProps
 * @prop {boolean} [sortable]
 */

import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"th"> & DataGridFilterProps>} */
export const DataGridFilter = ({ sortable, children, className, ...props }) => {
  const isMobile = useIsDataGridMobile();

  if (isMobile && !sortable) return <></>;

  if (isMobile) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <th className={className} role="columnheader" {...props}>
      <div>{children}</div>
    </th>
  );
};
