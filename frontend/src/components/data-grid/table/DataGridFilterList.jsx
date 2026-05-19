import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"thead">>} */
export const DataGridFilterList = ({ children, ...props }) => {
  const isMobile = useIsDataGridMobile();

  if (isMobile) return <div>{children}</div>;

  return (
    <thead {...props}>
      <tr role="row">
        {children}

        <th>Ações</th>
      </tr>
    </thead>
  );
};
