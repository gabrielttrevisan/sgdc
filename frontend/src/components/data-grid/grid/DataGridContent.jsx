import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"table">>} */
export const DataGridContent = ({ children, ...props }) => {
  const isMobile = useIsDataGridMobile();

  if (isMobile) return <div {...props}>{children}</div>;

  return <table {...props}>{children}</table>;
};
