import "./ActionList.css";
import { ActionListButton } from "./button/ActionListButton";

/**
 * @template T
 * @callback OnActionHandler
 * @param {string} type
 * @param {T} target
 * @param {import("react").MouseEvent<HTMLButtonElement, MouseEvent>} event
 * @returns {Promise<void>}
 */

/**
 * @template T
 * @typedef {Object} ActionConfig
 * @prop {string} type
 * @prop {import("react").ReactNode} content
 * @prop {OnActionHandler<T>} onAction
 * @prop {string} [className]
 * @prop {Partial<import("react").HTMLProps<"button">>} [buttonProps]
 */

/**
 * @template T
 * @typedef {Object} ActionListProps
 * @prop {ActionConfig<T>[]} actions
 * @prop {T} target
 */

/**
 * @template T
 * @param {ActionListProps<T>} props
 */
export function ActionList({ actions, target }) {
  return (
    <div className="action-list">
      {actions.map((action) => {
        return (
          <ActionListButton
            {...action.buttonProps}
            className={action.className}
            onAction={action.onAction}
            target={target}
            type={action.type}
            key={action.type}
          >
            {action.content}
          </ActionListButton>
        );
      })}
    </div>
  );
}
