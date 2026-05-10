import { useCallback, useImperativeHandle, useRef } from "react";
import { CloseIconLarge } from "../icons/CloseIconLarge";
import "./FormModal.css";
import { Form } from "../form/Form";
import { FormControllerProvider } from "../form/context/FormControllerProvider";
import { FormGrid } from "../form/grid/FormGrid";

/**
 * @typedef {Object} FormModalRef
 * @prop {VoidFunction} toggle
 * @prop {VoidFunction} close
 * @prop {HTMLDialogElement|null} dialog
 */

/**
 * @typedef {Object} FormModalProps
 * @prop {string} title
 * @prop {"create"|"edit"} [mode]
 * @prop {string} [cancelLabel]
 * @prop {string} [editLabel]
 * @prop {string} [createLabel]
 * @prop {VoidFunction} [onClose]
 * @prop {VoidFunction} [onSubmit]
 * @prop {import("react").Ref<FormModalRef>} [ref]
 * @prop {import("react").ReactNode} children
 * @prop {string} [className]
 */

/** @type {import("react").FC<FormModalProps>} */
export const FormModal = ({
  children,
  title,
  ref,
  cancelLabel = "Cancelar",
  createLabel = "Cadastrar",
  mode = "create",
  editLabel = "Alterar",
  onClose,
  onSubmit,
  className,
}) => {
  /** @type {import("react").Ref<HTMLDialogElement>} */
  const dialogRef = useRef();

  useImperativeHandle(
    ref,
    () => ({
      close() {
        dialogRef.current?.close();
      },
      toggle() {
        if (dialogRef.current?.open) dialogRef.current.close();
        else dialogRef.current?.showModal();
      },
      get dialog() {
        return dialogRef.current;
      },
    }),
    [dialogRef],
  );

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    onClose?.();
  }, [dialogRef, onClose]);

  const submitLabel = mode === "create" ? createLabel : editLabel;

  return (
    <dialog ref={dialogRef} className={`form-modal ${className ?? ""}`}>
      <FormControllerProvider>
        <Form onSubmit={onSubmit} className="form-modal__form">
          <header>
            <h2>{title}</h2>

            <button
              type="button"
              onClick={handleClose}
              className="button-close"
            >
              <CloseIconLarge />
            </button>
          </header>

          <FormGrid className="form-modal__content">{children}</FormGrid>

          <footer>
            <button
              type="button"
              onClick={handleClose}
              className="button-block --outline --primary"
            >
              {cancelLabel}
            </button>

            <button type="submit" className="button-block --solid --primary">
              {submitLabel}
            </button>
          </footer>
        </Form>
      </FormControllerProvider>
    </dialog>
  );
};
