import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { FormControllerProvider } from "../form/context/FormControllerProvider";
import { Form } from "../form/Form";
import { FormModalCancelButton } from "../form/modal/button/FormModalCancelButton";
import { useFormController } from "../form/context/useFormController";
import { ResourceFormContext } from "./context";
import { FormBreadcrumbs } from "./FormBreadcrumbs";
import Toast from "../toast/ToastStorage";
import "./ReadOnlyResourceForm.css";

/**
 * @param {Object} props
 * @param {(id: string) => Promise<any>} props.fetchResource
 * @param {import("react").ReactNode} props.children
 * @param {import("react").ReactNode} [props.actions]
 * @param {string} props.title
 * @param {{id: string, name: string}[]} [props.breadcrumbs]
 * @param {string} [props.idParamKey]
 * @param {string} [props.gridColumns]
 * @param {import("react").MouseEventHandler<HTMLButtonElement>} props.onCancel
 */
function ReadOnlyResourceFormContent({
  fetchResource,
  children,
  actions,
  title,
  breadcrumbs,
  idParamKey = "id",
  gridColumns,
  onCancel,
}) {
  const { [idParamKey]: id } = useParams();
  const form = useFormController();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedResource, setLoadedResource] = useState(null);
  const [resource, setResource] = useState(null);

  useEffect(() => {
    if (!id || id === loadedResource) return;

    setIsLoading(true);

    fetchResource(id)
      .then((resource) => {
        if (resource.data) {
          form.fill(resource.data);
          setResource(resource.data);
          setLoadedResource(id);
        }
      })
      .catch((error) => Toast.error(error.message))
      .finally(() => setIsLoading(false));
  }, [id, loadedResource]);

  return (
    <ResourceFormContext value={{ isEditing: false, id, resource }}>
      <FormBreadcrumbs breadcrumbs={breadcrumbs} title={title} />

      <Form
        onSubmit={async () => false}
        className="form-inline form-inline--readonly"
        style={{ "--grid-columns": gridColumns }}
      >
        {isLoading && <div className="form-inline__loading-overlay" />}

        {children}

        {actions}

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={onCancel}
            className="button-block --outline --primary"
          >
            Voltar
          </FormModalCancelButton>
        </footer>
      </Form>
    </ResourceFormContext>
  );
}

export function ReadOnlyResourceForm({ children, ...props }) {
  return (
    <FormControllerProvider>
      <ReadOnlyResourceFormContent {...props}>
        {children}
      </ReadOnlyResourceFormContent>
    </FormControllerProvider>
  );
}
