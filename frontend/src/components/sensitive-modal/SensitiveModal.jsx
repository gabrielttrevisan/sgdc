import { useImperativeHandle, useRef } from "react";
import "./SensitiveModal.css";

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
 * @prop {string} [message]
 * @prop {string} [confirmLabel]
 * @prop {string} [cancelLabel]
 * @prop {SensitiveModalRef} [ref]
 */

/** @type {import("react").FC<SensitiveModalProps>} */
export const SensitiveModal = ({
  ref,
  message = "Deseja realmente deletar esse registro?",
  cancelLabel = "Cancelar",
  confirmLabel = "Deletar",
}) => {
  /** @type {import("react").RefObject<HTMLDialogElement>} */
  const dialogRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const deleteRef = useRef(null);
  /** @type {import("react").RefObject<HTMLButtonElement>} */
  const cancelRef = useRef(null);

  useImperativeHandle(
    ref,
    /**
     * @returns {SensitiveModalRef}
     */
    () => ({
      open() {
        if (dialogRef.current && deleteRef.current && cancelRef.current) {
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
          });
        } else {
          return Promise.reject(new Error("DOM elements unavailable"));
        }
      },
      get dialog() {
        return dialogRef.current;
      },
    }),
    [dialogRef, deleteRef, cancelRef],
  );

  return (
    <dialog ref={dialogRef} className="sensitive-modal">
      <div className="sensitive-modal__content">{message}</div>

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
