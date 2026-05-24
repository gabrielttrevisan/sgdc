import useIsDataGridMobile from "../context/useIsDataGridMobile";
import { DataGridFilterListMobile } from "./DataGridFilterListMobile";

/** @type {import("react").FC<import("react").HTMLProps<"thead">>} */
export const DataGridFilterList = ({ children, className = "", ...props }) => {
  const isMobile = useIsDataGridMobile();

  const filterListClassName = `data-grid__filter-list ${className}`;

  if (isMobile)
    return (
      <DataGridFilterListMobile className={filterListClassName}>
        {children}
      </DataGridFilterListMobile>
    );

  return (
    <thead className={filterListClassName} {...props}>
      <tr role="row">
        {children}

        <th>Ações</th>
      </tr>
    </thead>
  );
};
