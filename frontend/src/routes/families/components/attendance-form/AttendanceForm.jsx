import { useLocation, useNavigate, useParams } from "react-router";
import getSafeListId from "../../../../store/list/getSafeListId";
import { useEffect, useMemo, useRef, useState } from "react";
import { useListStorage } from "../../../../store/list/useListStorage";
import { useProductQuantities } from "../product-quantity/useProductQuantities";
import FamiliesService from "../../../../service/FamiliesService";
import AttendanceService from "../../../../service/AttendanceService.js";
import Toast from "../../../../components/toast/ToastStorage";
import { Form } from "../../../../components/form/Form";
import { FormControllerProvider } from "../../../../components/form/context/FormControllerProvider";
import { SelectField } from "../../../../components/form/input-field/SelectField";
import { TextAreaField } from "../../../../components/form/input-field/TextAreaField";
import { FormModalCancelButton } from "../../../../components/form/modal/button/FormModalCancelButton";
import { FormModalSubmitButton } from "../../../../components/form/modal/button/FormModalSubmitButton";
import { FormBreadcrumbs } from "../../../../components/resource-form/FormBreadcrumbs";
import ListField from "../../../../components/list-field/ListField.jsx";
import ProductQuantity from "../product-quantity/ProductQuantity.jsx";
import { getStateFromHistory } from "../../../../hooks/useStateFromHistory/index.js";

export function AttendanceForm() {
  const { id } = useParams();
  const { state } = useLocation();
  const fallbackListId = useMemo(
    () => `attendance-product-list:${id}:${crypto.randomUUID()}`,
    [id],
  );
  const listId = getSafeListId(state?.listId) || fallbackListId;
  const navigate = useNavigate();
  const [family, setFamily] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const list = useListStorage(listId);
  const quantities = useProductQuantities();
  const formRef = useRef(null);
  const defaultResponsible = getStateFromHistory(state, {
    defaultValue: "",
    fromHistory(value) {
      if (!value) return "";

      return value;
    },
    prop: "responsible",
  });
  const defaultDetails = getStateFromHistory(state, {
    defaultValue: "",
    fromHistory(value) {
      if (!value) return "";

      return value;
    },
    prop: "details",
  });

  useEffect(() => {
    let isCurrent = true;

    FamiliesService.getById(id).then((response) => {
      if (!isCurrent) return;

      if (response.data) {
        setFamily(response.data);
      } else {
        Toast.error(
          response.error?.message ?? "Não foi possível carregar família",
        );
      }

      setIsLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const responsibleOptions = [
    { label: "Selecione", value: "" },
    ...(family?.participants ?? [])
      .filter(({ isResponsible }) => isResponsible)
      .map(({ id: participantId, name }) => ({
        label: name,
        value: String(participantId),
      })),
  ];

  const onAddProduct = () => {
    const data = formRef.current ? new FormData(formRef.current) : new Map();
    const responsible = data.get("responsible");
    const details = data.get("details");

    navigate("/produtos/selecionar", {
      state: {
        from: location.pathname + location.search,
        listId,
        quantities: quantities.asObject(),
        responsible,
        details,
      },
    });
  };

  return (
    <FormControllerProvider>
      <FormBreadcrumbs
        breadcrumbs={[{ id: "families", name: "Famílias" }]}
        title="Atendimento"
      />

      <Form
        onSubmit={async (data) => {
          const requests = quantities.all(list.items);

          const response = await AttendanceService.create({
            familyId: Number(id),
            responsible: Number(data.responsible),
            details: data.details,
            ...(requests.length > 0 && { requests }),
          });

          if (response.data?.success) {
            Toast.success("Atendimento registrado com sucesso");
            list.close();
            navigate("/atendimentos");
            return true;
          }

          Toast.error(
            response.error?.issues?.[0]?.description ??
              response.error?.message ??
              "Falha ao registrar atendimento",
          );
          return false;
        }}
        className="form-inline"
        ref={formRef}
      >
        {isLoading && <div className="form-inline__loading-overlay" />}

        <SelectField
          name="responsible"
          id="responsible"
          label="Representante"
          required
          disabled={isLoading || !family}
          options={responsibleOptions}
          validate={(value) =>
            value && Number.isInteger(Number(value)) && Number(value) > 0
              ? true
              : "Selecione um representante"
          }
          defaultValue={defaultResponsible}
        />

        <TextAreaField
          name="details"
          id="details"
          label="Detalhes do Atendimento"
          required
          maxLength={255}
          validate={(value) =>
            value.trim().length > 0 && value.trim().length <= 255
              ? true
              : "Detalhes devem conter entre 1 e 255 caracteres"
          }
          defaultValue={defaultDetails}
        />

        <ListField
          label="Produtos Desejados"
          buttonLabel="Selecionar produtos"
          listId={listId}
          ExtraFields={ProductQuantity}
          onAddProduct={onAddProduct}
        />

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={() => {
              list.close();
              navigate("/familias");
            }}
            className="button-block --outline --primary"
          >
            Cancelar
          </FormModalCancelButton>

          <FormModalSubmitButton>
            <span>Registrar Atendimento</span>
          </FormModalSubmitButton>
        </footer>
      </Form>
    </FormControllerProvider>
  );
}
