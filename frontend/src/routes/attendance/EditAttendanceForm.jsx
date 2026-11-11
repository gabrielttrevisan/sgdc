import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import getSafeListId from "../../store/list/getSafeListId";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import { Form } from "../../components/form/Form";
import { FormBreadcrumbs } from "../../components/resource-form/FormBreadcrumbs";
import { FormModalCancelButton } from "../../components/form/modal/button/FormModalCancelButton";
import { FormModalSubmitButton } from "../../components/form/modal/button/FormModalSubmitButton";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { ProductQuantitiesProvider } from "../families/components/product-quantity/provider.jsx";
import { useProductQuantities } from "../families/components/product-quantity/useProductQuantities";
import { useFormController } from "../../components/form/context/useFormController";
import ProductsField from "../../components/form/input-field/products-field/ProductsField.jsx";
import ProductQuantity from "../families/components/product-quantity/ProductQuantity.jsx";
import AttendanceService from "../../service/AttendanceService.js";
import Toast from "../../components/toast/ToastStorage";
import { useListStorage } from "../../store/list/useListStorage";

function EditAttendanceFormContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackListId = useMemo(
    () => `attendance-edit:${id}:${crypto.randomUUID()}`,
    [id],
  );
  const listId = getSafeListId(location.state?.listId) || fallbackListId;
  const list = useListStorage(listId);
  const quantities = useProductQuantities();
  const formRef = useRef(null);
  const formController = useFormController();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    AttendanceService.getById(id).then((response) => {
      if (!isCurrent) return;

      if (!response.data) {
        Toast.error(response.error?.message ?? "Não foi possível carregar atendimento");
        navigate("/atendimentos");
        return;
      }

      if (response.data.attendance.cancelledAt) {
        Toast.error("Atendimentos cancelados não podem ser alterados");
        navigate("/atendimentos");
        return;
      }

      response.data.requestedItems.forEach(({ product, quantity }) => {
        list.append(product.id, product);
        quantities.set(product.id, quantity);
      });
      formController.fill({ details: response.data.attendance.details });

      setIsLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const onAddProduct = () => {
    const data = formRef.current
      ? Object.fromEntries(new FormData(formRef.current))
      : {};

    navigate("/produtos/selecionar", {
      state: {
        from: location.pathname + location.search,
        listId,
        quantities: quantities.asObject(),
        details: data.details,
      },
    });
  };

  return (
    <>
      <FormBreadcrumbs
        breadcrumbs={[{ id: "attendance", name: "Atendimentos" }]}
        title="Alterar atendimento"
      />
      <Form
        onSubmit={async (data) => {
          const response = await AttendanceService.update({
            id,
            details: data.details,
            requests: quantities.all(list.items),
          });

          if (response.data?.success) {
            Toast.success("Atendimento atualizado com sucesso");
            list.close();
            navigate("/atendimentos");
            return true;
          }

          Toast.error(response.error?.message ?? "Falha ao atualizar atendimento");
          return false;
        }}
        className="form-inline"
        ref={formRef}
      >
        {isLoading && <div className="form-inline__loading-overlay" />}

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
          label="Produtos Desejados"
          listId={listId}
          ExtraFields={ProductQuantity}
          onAddProduct={onAddProduct}
        />

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={() => {
              list.close();
              navigate("/atendimentos");
            }}
            className="button-block --outline --primary"
          >
            Cancelar
          </FormModalCancelButton>
          <FormModalSubmitButton>
            <span>Salvar alterações</span>
          </FormModalSubmitButton>
        </footer>
      </Form>
    </>
  );
}

export default WithAuthGuard(function EditAttendanceForm() {
  const { id } = useParams();

  return (
    <ProductQuantitiesProvider key={id}>
      <FormControllerProvider>
        <EditAttendanceFormContent />
      </FormControllerProvider>
    </ProductQuantitiesProvider>
  );
});
