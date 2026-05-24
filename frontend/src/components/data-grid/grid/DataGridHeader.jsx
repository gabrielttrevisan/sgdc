import useShouldStick from "../../../hooks/useShouldStick";

/** @type {import("react").FC<import("react").HTMLProps<"div">>} */
export const DataGridHeader = ({ children, className = "", ...props }) => {
  const [shouldStick, sentinel] = useShouldStick();

  return (
    <>
      {sentinel}

      <div
        className={`data-grid__header ${shouldStick ? "--sticky" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
};
