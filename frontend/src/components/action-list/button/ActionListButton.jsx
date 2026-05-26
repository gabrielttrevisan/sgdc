import { useCallback, useState } from "react";

/**
 * @typedef {Object} ActionListButtonProps
 * @prop {import("react").ReactNode} children
 */

/** @type {import("react").FC<Pick<import("../ActionList").ActionConfig, "type" | "className" | "onAction" | "target"> & ActionListButtonProps>} */
export const ActionListButton = ({
  type,
  className = "",
  onAction,
  target,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const loadingClassName = loading ? "--loading" : "";
  const typeClassName = "--" + type;

  return (
    <button
      className={`button-block --solid --action ${typeClassName} ${className} ${loadingClassName}`}
      onClick={useCallback(
        async (e) => {
          setLoading(true);

          await onAction(type, target, e);

          setLoading(false);
        },
        [type, target],
      )}
    >
      {children}
    </button>
  );
};
