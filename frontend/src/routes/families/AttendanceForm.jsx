import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { Form } from "../../components/form/Form";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import { SelectField } from "../../components/form/input-field/SelectField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { FormModalCancelButton } from "../../components/form/modal/button/FormModalCancelButton";
import { FormModalSubmitButton } from "../../components/form/modal/button/FormModalSubmitButton";
import { FormBreadcrumbs } from "../../components/resource-form/FormBreadcrumbs";
import FamiliesService from "../../service/FamiliesService";
import SessionsService from "../../service/SessionsService";
import Toast from "../../components/toast/ToastStorage";
import ProductsField from "./components/ProductsField.jsx";
import { useListStorage } from "../../store/list/useListStorage.js";

export default WithAuthGuard(function AttendanceForm() {
  const { id } = useParams();
  const listId = `attendance-product-list:${id}:${crypto.randomUUID()}`;
  const navigate = useNavigate();
  const [family, setFamily] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const productsRef = useRef(null);
  const list = useListStorage(listId);

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

  return (
    <FormControllerProvider>
      <FormBreadcrumbs
        breadcrumbs={[{ id: "families", name: "Famílias" }]}
        title="Atendimento"
      />

      <Form
        onSubmit={async (data) => {
          const response = await SessionsService.create({
            familyId: Number(id),
            responsible: Number(data.responsible),
            details: data.details,
          });

          if (response.data?.success) {
            Toast.success("Atendimento registrado com sucesso");
            navigate("/familias");
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
        />

        <ProductsField
          ref={productsRef}
          label="Produtos Desejados"
          listId={listId}
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
});
