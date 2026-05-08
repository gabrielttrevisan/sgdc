import { useImperativeHandle, useRef } from "react";
import "./SensitiveModal.css";

export const SensitiveModal = ({
  ref,
  message = "Deseja realmente deletar esse registro?",
}) => {
  const dialogRef = useRef(null);
  const deleteRef = useRef(null);
  const cancelRef = useRef(null);

  useImperativeHandle(
    ref,
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
              {
                once: true,
              },
            );

            cancelRef.current.addEventListener(
              "click",
              () => {
                dialogRef.current.close();
                resolve(false);
              },
              {
                once: true,
              },
            );
          });
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
          Deletar
        </button>

        <button
          type="button"
          ref={cancelRef}
          className="sensitive-modal__action --cancel"
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );
};
