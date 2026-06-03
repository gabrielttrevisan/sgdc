import { useCallback, useImperativeHandle, useRef, useState } from "react";
import { CloseIconLarge } from "../../icons/CloseIconLarge";
import { Form } from "../Form";
import "./FormModal.css";
import { useFormController } from "../context/useFormController";
import { FormModalSubmitButton } from "./button/FormModalSubmitButton";
import { FormModalCancelButton } from "./button/FormModalCancelButton";

/**
 * @callback OpenFormModalCallback
 * @param {Record<string, string>} [data]
 * @param {"show"} [show]
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
 * @prop {"create"|"edit"|"show"} [mode]
 * @prop {string} [cancelLabel]
 * @prop {string} [editLabel]
 * @prop {string} [createLabel]
 * @prop {VoidFunction} [onClose]
 * @prop {Record<"create"|"edit", import("../context/FormController").CustomOnSubmitHandler>} [onSubmit]
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
      toggle(data, show) {
        if (dialogRef.current?.open) {
          dialogRef.current.close();
          controller.reset();
        } else {
          dialogRef.current?.show();
          if (data) {
            controller.fill(data, show !== undefined);
            setMode(show ? show : "edit");
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
  const handleSubmit = useCallback(
    async (...params) => {
      let result = await onSubmit[mode](...params);

      return result;
    },
    [mode],
  );

  return (
    <dialog ref={dialogRef} className="form-modal">
      <div className="form-modal__wrapper">
        <Form
          onSubmit={handleSubmit}
          className={`form-modal__form ${className ?? ""}`}
        >
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

          <div className="form-modal__content">{children}</div>

          <footer>
            <FormModalCancelButton
              type="button"
              onClick={handleClose}
              className="button-block --outline --primary"
            >
              {mode === "show" ? "Fechar" : cancelLabel}
            </FormModalCancelButton>

            <FormModalSubmitButton hidden={mode === "show"}>
              <span>{submitLabel}</span>
            </FormModalSubmitButton>
          </footer>
        </Form>
      </div>
    </dialog>
  );
};
