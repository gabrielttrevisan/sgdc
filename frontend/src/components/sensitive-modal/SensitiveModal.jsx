import { useImperativeHandle, useRef } from "react";
import "./SensitiveModal.css";
import { CloseIconLarge } from "../icons/CloseIconLarge";

/**
 * @callback OpenSensitiveModal
 * @returns {Promise<boolean>}
 */

/**
 * @typedef {Object} SensitiveModalRef
 * @prop {OpenSensitiveModal} open
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
 */

/** @type {import("react").FC<SensitiveModalProps>} */
export const SensitiveModal = ({
  ref,
  title = "Deseja realmente deletar esse registro?",
  cancelLabel = "Cancelar",
  confirmLabel = "Deletar",
  children,
  showCloseButton,
}) => {
  /** @type {import("react").RefObject<HTMLDialogElement>} */
  const dialogRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const deleteRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const cancelRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const closeRef = useRef(null);

  useImperativeHandle(
    ref,
    /**
     * @returns {SensitiveModalRef}
     */
    () => ({
      open() {
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
      get dialog() {
        return dialogRef.current;
      },
    }),
    [dialogRef, deleteRef, cancelRef, closeRef, showCloseButton],
  );

  return (
    <dialog ref={dialogRef} className="sensitive-modal">
      <div className="sensitive-modal__content">
        <header>
          <span>{title}</span>

          {showCloseButton && (
            <button type="button" ref={closeRef}>
              <CloseIconLarge />
            </button>
          )}
        </header>

        {children && <p>{children}</p>}
      </div>

      <div className="sensitive-modal__actions">
        <button
          type="button"
          ref={deleteRef}
          className="sensitive-modal__action --delete"
        >
          {confirmLabel}
        </button>

        <button
          type="button"
          ref={cancelRef}
          className="sensitive-modal__action --cancel"
        >
          {cancelLabel}
        </button>
      </div>
    </dialog>
  );
};
