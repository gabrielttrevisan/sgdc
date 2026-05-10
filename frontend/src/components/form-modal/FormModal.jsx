import { useCallback, useImperativeHandle, useRef, useState } from "react";
import { CloseIconLarge } from "../icons/CloseIconLarge";
import { Form } from "../form/Form";
import { FormGrid } from "../form/grid/FormGrid";
import "./FormModal.css";
import { useFormController } from "../form/context/useFormController";

/**
 * @callback OpenFormModalCallback
 * @param {Record<string, string>} [data]
 * @returns {void}
 */

/**
 * @typedef {Object} FormModalRef
 * @prop {OpenFormModalCallback} toggle
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
 * @prop {Record<"create"|"edit", import("../form/context/FormController").CustomOnSubmitHandler>} [onSubmit]
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
  mode: defaultMode = "create",
  editLabel = "Alterar",
  onClose,
  onSubmit,
  className,
}) => {
  /** @type {import("react").Ref<HTMLDialogElement>} */
  const dialogRef = useRef();
  const controller = useFormController();
  const [mode, setMode] = useState(defaultMode);

  useImperativeHandle(
    ref,
    () => ({
      close() {
        dialogRef.current?.close();
        controller.reset();
      },
      toggle(data) {
        if (dialogRef.current?.open) {
          dialogRef.current.close();
          controller.reset();
        } else {
          dialogRef.current?.showModal();
          if (data) {
            controller.fill(data);
            setMode("edit");
          } else {
            setMode("create");
          }
        }
      },
      get dialog() {
        return dialogRef.current;
      },
    }),
    [dialogRef, controller],
  );

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    controller.reset();
    onClose?.();
  }, [dialogRef, onClose, controller]);

  const submitLabel = mode === "create" ? createLabel : editLabel;
  const handleSubmit = onSubmit[mode];

  return (
    <dialog ref={dialogRef} className={`form-modal ${className ?? ""}`}>
      <Form onSubmit={handleSubmit} className="form-modal__form">
        <header>
          <h2>{title}</h2>

          <button type="button" onClick={handleClose} className="button-close">
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
    </dialog>
  );
};
