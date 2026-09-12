import { useParams } from "react-router";
import { FormControllerProvider } from "../form/context/FormControllerProvider";
import { Form } from "../form/Form";
import { FormModalCancelButton } from "../form/modal/button/FormModalCancelButton";
import { FormModalSubmitButton } from "../form/modal/button/FormModalSubmitButton";
import { useEffect, useState } from "react";
import Toast from "../toast/ToastStorage";
import { InputHidden } from "../form/input-field/InputHidden";
import { useFormController } from "../form/context/useFormController";
import { ResourceFormContext } from "./context";

/**
 * @typedef {Object} Breadcrumb
 * @prop {string} id
 * @prop {string} name
 */

/**
 * @callback ResourceFormOnSubmit
 * @param {Record<string, string>} data
 * @param {boolean} isEditing
 * @param {FormController} controller
 * @param {SubmitEvent} event
 * @returns {Promise<boolean>}
 */

/**
 * @typedef {Object} ResourceFormContentProps
 * @prop {string} [idParamKey]
 * @prop {(id: string) => Promise<any>} [fetchResource]
 * @prop {string} [className]
 * @prop {import("react").ReactNode} children
 * @prop {string} title
 * @prop {string} [editTitle]
 * @prop {Breadcrumb[]} breadcrumbs
 * @prop {ResourceFormOnSubmit} onSubmit
 * @prop {import("react").MouseEventHandler<HTMLButtonElement>} onCancel
 * @prop {string} [gridColumns]
 */

/**
 * @typedef {Object} EditFormState
 * @prop {boolean} isLoading
 * @prop {string|null} loadedResource
 */

/**
 * @param {ResourceFormContentProps}
 * @returns {import("react").JSX.Element}
 */
function ResourceFormContent({
  idParamKey = "id",
  fetchResource,
  className = "",
  children,
  title,
  editTitle,
  breadcrumbs,
  onSubmit,
  onCancel,
  gridColumns,
}) {
  const { [idParamKey]: id } = useParams();
  const form = useFormController();
  /** @type {[EditFormState, import("react").Dispatch<import("react").SetStateAction<ResourceFormContentProps>>]} */
  const [editState, setEditState] = useState({
    isLoading: false,
    loadedResource: null,
  });

  const { submitLabel, actualTitle } = id
    ? { submitLabel: "Atualizar Dados", actualTitle: editTitle ?? title }
    : { submitLabel: "Cadastrar", actualTitle: title };
  const variantClass = className ? `form-inline--${className}` : "";
  const isEditing = Boolean(id);

  /** @type {import("../form/context/FormController").CustomOnSubmitHandler} */
  const handleSubmit = async (data, controller, event) => {
    return await onSubmit(data, isEditing, controller, event);
  };

  useEffect(() => {
    if (id && id !== editState.loadedResource) {
      setEditState({ isLoading: true, loadedResource: null });

      fetchResource(id)
        .then((resource) => {
          if (resource.data) {
            setEditState({ isLoading: false, loadedResource: id });
            form.fill(resource.data);
          }
        })
        .catch((e) => {
          setEditState({ isLoading: false, loadedResource: null });

          Toast.error(e.message);
        });
    }
  }, [id]);

  return (
    <ResourceFormContext value={{ isEditing: Boolean(id), id }}>
      <div className="form-inline__breadcrumbs">
        {breadcrumbs && (
          <div className="form-inline__breadcrumb-path">
            {breadcrumbs.map(({ id, name }) => (
              <h3 key={id}>{name}</h3>
            ))}
          </div>
        )}

        <h2 className="form-inline__breadcrumb-path-current">{actualTitle}</h2>
      </div>

      <Form
        onSubmit={handleSubmit}
        className={`form-inline ${variantClass}`}
        style={{ "--grid-columns": gridColumns }}
      >
        {editState.isLoading && (
          <div className="form-inline__loading-overlay" />
        )}

        {id && <InputHidden name="id" id="id" value={id} />}

        {children}

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={onCancel}
            className="button-block --outline --primary"
          >
            Cancelar
          </FormModalCancelButton>

          <FormModalSubmitButton>
            <span>{submitLabel}</span>
          </FormModalSubmitButton>
        </footer>
      </Form>
    </ResourceFormContext>
  );
}

/**
 * @param {ResourceFormContentProps}
 * @returns {import("react").JSX.Element}
 */
export function ResourceForm({ children, ...props }) {
  return (
    <FormControllerProvider>
      <ResourceFormContent {...props}>{children}</ResourceFormContent>
    </FormControllerProvider>
  );
}
