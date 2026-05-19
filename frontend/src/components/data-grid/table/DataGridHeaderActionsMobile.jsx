import { Children, useCallback, useState } from "react";
import { AppsIcon } from "../../icons/AppsIcon";

/** @type {import("react").FC<import("react").HTMLProps<"div">>} */
export const DataGridHeaderActionsMobile = ({
  children,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickToClose = useCallback((e) => {
    const dataGridActions = e.target.closest("#datagrid-actions");
    const dataGridActionsButton = e.target.closest("#datagrid-actions-button");

    if (!dataGridActions && !dataGridActionsButton) setIsOpen(false);
  }, []);

  const toggle = () => {
    setIsOpen((prev) => {
      const newIsOpen = !prev;

      if (newIsOpen) window.addEventListener("click", onClickToClose);
      else window.removeEventListener("click", onClickToClose);

      return newIsOpen;
    });
  };

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="datagrid-actions"
        className="data-grid__header-actions-mobile"
        onClick={toggle}
        id="datagrid-actions-button"
      >
        <AppsIcon size={24} />
      </button>

      <div
        className={className}
        {...props}
        hidden={!isOpen}
        id="datagrid-actions"
      >
        {Children.map(children, (child, index) => {
          return (
            <div className="data-grid__header-action" key={index}>
              {child}
            </div>
          );
        })}
      </div>
    </>
  );
};
