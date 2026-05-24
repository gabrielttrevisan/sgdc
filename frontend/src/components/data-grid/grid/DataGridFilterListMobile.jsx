import useShouldStick from "../../../hooks/useShouldStick";

export const DataGridFilterListMobile = ({
  className = "",
  children,
  ...props
}) => {
  const [shouldStick, sentinel] = useShouldStick({
    rootMargin: "40px 0px 0px 0px",
  });

  const filterClassName = `${className} ${shouldStick ? "--sticky" : ""}`;

  return (
    <>
      {sentinel}

      <div className={filterClassName} {...props}>
        {children}
      </div>
    </>
  );
};
