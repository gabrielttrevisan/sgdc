import { ActionList } from "../../action-list/ActionList";
import useIsDataGridMobile from "../context/useIsDataGridMobile";

/** @type {import("react").FC<import("react").HTMLProps<"tr"> & import("../../action-list/ActionList").ActionListProps>} */
export const DataGridItemActions = ({
  children,
  className = "",
  target,
  actions,
  ...props
}) => {
  const isMobile = useIsDataGridMobile();

  const itemActionsClassName = `data-grid__item-actions ${className}`;

  if (isMobile) {
    return (
      <div className={itemActionsClassName} {...props}>
        <ActionList target={target} actions={actions} isXL={!isMobile} />
      </div>
    );
  }

  return (
    <td className={itemActionsClassName} {...props}>
      <ActionList target={target} actions={actions} isXL={!isMobile} />
    </td>
  );
};
