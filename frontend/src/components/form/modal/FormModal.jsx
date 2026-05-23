import { useCallback, useImperativeHandle, useRef, useState } from "react";
import { CloseIconLarge } from "../../icons/CloseIconLarge";
import { Form } from "../Form";
import "./FormModal.css";
import { useFormController } from "../context/useFormController";

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
  const [loading, setLoading] = useState(false);

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
          dialogRef.current?.showModal();
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
      setLoading(true);

      let result = await onSubmit[mode](...params);

      setLoading(false);

      return result;
    },
    [mode],
  );

  return (
    <dialog ref={dialogRef} className={`form-modal ${className ?? ""}`}>
      <Form onSubmit={handleSubmit} className="form-modal__form">
        <header>
          <h2>{title}</h2>

          <button type="button" onClick={handleClose} className="button-close">
            <CloseIconLarge />
          </button>
        </header>

        <div className="form-modal__content">{children}</div>

        <footer>
          <button
            type="button"
            onClick={handleClose}
            className="button-block --outline --primary"
            disabled={loading}
          >
            {mode === "show" ? "Fechar" : cancelLabel}
          </button>

          <button
            type="submit"
            className={`button-block --solid --primary ${loading ? "--loading" : ""}`}
            disabled={loading}
            hidden={mode === "show"}
          >
            <span>{submitLabel}</span>
          </button>
        </footer>
      </Form>
    </dialog>
  );
};
