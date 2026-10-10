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
 * @callback ConditionCallback
 * @param {T} target
 * @return {boolean}
 */

/**
 * @template T
 * @typedef {Object} ActionConfig
 * @prop {string} type
 * @prop {import("react").ReactNode} content
 * @prop {OnActionHandler<T>} [onAction]
 * @prop {string} [className]
 * @prop {Partial<import("react").HTMLProps<"button">>} [buttonProps]
 * @prop {ConditionCallback} [shouldRender]
 * @prop {ReactNode} [tooltip]
 */

/**
 * @template T
 * @typedef {Object} ActionListProps
 * @prop {ActionConfig<T>[]} actions
 * @prop {T} target
 * @prop {boolean} [isXL]
 */

/**
 * @template T
 * @param {ActionListProps<T>} props
 */
export function ActionList({ actions, target, isXL = false }) {
  const renderableActions = actions.filter(
    (action) => !action.shouldRender || action.shouldRender(target),
  );

  return (
    <div className="action-list">
      {renderableActions.map((action) => {
        return (
          <ActionListButton
            {...action.buttonProps}
            className={action.className}
            onAction={action.onAction}
            target={target}
            type={action.type}
            key={action.type}
            isXL={isXL}
            tooltip={action.tooltip}
          >
            {action.content}
          </ActionListButton>
        );
      })}
    </div>
  );
}
