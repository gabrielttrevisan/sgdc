import "./ActionList.css";

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
          <button
            className={`action-list__action --${action.type} ${action.className ?? ""}`}
            onClick={(e) => action.onAction(action.type, target, e)}
            key={action.type}
          >
            {action.content}
          </button>
        );
      })}
    </div>
  );
}
