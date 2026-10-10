import { useImperativeHandle, useRef } from "react";
import "./SensitiveModal.css";
import { LargeCloseIcon } from "../icons/LargeCloseIcon";

/**
 * @callback OpenSensitiveModal
 * @returns {Promise<boolean>}
 */

/**
 * @typedef {Object} SensitiveModalRef
 * @prop {OpenSensitiveModal} openAsync
 * @prop {() => Promise<string>} openWithActions
 * @prop {HTMLDialogElement} dialog
 */

/**
 * @typedef {Object} SensitiveModalProps
 * @prop {string} [title]
 * @prop {string} [confirmLabel]
 * @prop {string} [cancelLabel]
 * @prop {SensitiveModalRef} [ref]
 * @prop {import("react")} [children]
 * @prop {string} [showCloseButton]
 * @prop {import("react").ReactNode} [customActions]
 * @prop {"danger"|"warn"} [variant]
 */

/** @type {import("react").FC<SensitiveModalProps>} */
export const SensitiveModal = ({
  ref,
  title = "Deseja realmente deletar esse registro?",
  cancelLabel = "Cancelar",
  confirmLabel = "Deletar",
  children,
  showCloseButton,
  customActions,
  variant = "danger",
}) => {
  /** @type {import("react").RefObject<HTMLDialogElement>} */
  const dialogRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const deleteRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const cancelRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const closeRef = useRef(null);
  /** @type {import("react").RefObject<HTMLDivElement>} */
  const actionsRef = useRef(null);

  useImperativeHandle(
    ref,
    /**
     * @returns {SensitiveModalRef}
     */
    () => ({
      openAsync() {
        if (dialogRef.current && deleteRef.current && cancelRef.current) {
          if (showCloseButton && !closeRef.current)
            return Promise.reject(new Error("DOM elements unavailable"));

          dialogRef.current.showModal();

          return new Promise((resolve) => {
            deleteRef.current.addEventListener(
              "click",
              () => {
                dialogRef.current.close();
                resolve(true);
              },
              { once: true },
            );

            cancelRef.current.addEventListener(
              "click",
              () => {
                dialogRef.current.close();
                resolve(false);
              },
              { once: true },
            );

            closeRef.current.addEventListener(
              "click",
              () => {
                dialogRef.current.close();
                resolve(false);
              },
              { once: true },
            );
          });
        } else {
          return Promise.reject(new Error("DOM elements unavailable"));
        }
      },
      openWithActions() {
        if (dialogRef.current && actionsRef.current) {
          if (showCloseButton && !closeRef.current)
            return Promise.reject(new Error("DOM elements unavailable"));

          /** @type {NodeListOf<HTMLElement>} */
          const actions = actionsRef.current.querySelectorAll(
            "[data-modal-action]",
          );

          dialogRef.current.showModal();

          return new Promise((resolve) => {
            actions.forEach((action) => {
              if (!action.dataset.modalAction) return;

              action.addEventListener(
                "click",
                () => {
                  dialogRef.current.close();
                  resolve(action.dataset.modalAction);
                },
                { once: true },
              );
            });

            closeRef.current.addEventListener(
              "click",
              () => {
                dialogRef.current.close();
                resolve("CLOSE");
              },
              { once: true },
            );
          });
        } else {
          return Promise.reject(new Error("DOM elements unavailable"));
        }
      },
      get dialog() {
        return dialogRef.current;
      },
    }),
    [dialogRef, deleteRef, cancelRef, closeRef, showCloseButton],
  );

  return (
    <dialog
      ref={dialogRef}
      className={`sensitive-modal sensitive-modal--${variant}`}
    >
      <div className="sensitive-modal__content">
        <header>
          <span>{title}</span>

          {showCloseButton && (
            <button type="button" ref={closeRef} className="button-close">
              <LargeCloseIcon />
            </button>
          )}
        </header>

        {children && <p>{children}</p>}
      </div>

      <div className="sensitive-modal__actions" ref={actionsRef}>
        {customActions ? (
          <>{customActions}</>
        ) : (
          <>
            <button
              type="button"
              ref={deleteRef}
              className="sensitive-modal__action --delete"
              data-modal-action="CONFIRM"
            >
              {confirmLabel}
            </button>

            <button
              type="button"
              ref={cancelRef}
              className="sensitive-modal__action --cancel"
              data-modal-action="CANCEL"
            >
              {cancelLabel}
            </button>
          </>
        )}
      </div>
    </dialog>
  );
};
