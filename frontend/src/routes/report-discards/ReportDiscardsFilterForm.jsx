import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { Form } from "../../components/form/Form.jsx";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider.jsx";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import { FormModalCancelButton } from "../../components/form/modal/button/FormModalCancelButton.jsx";
import { FormModalSubmitButton } from "../../components/form/modal/button/FormModalSubmitButton.jsx";
import ListField from "../../components/list-field/ListField.jsx";
import { FormBreadcrumbs } from "../../components/resource-form/FormBreadcrumbs.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import getSafeListId from "../../store/list/getSafeListId.js";
import { useListStorage } from "../../store/list/useListStorage.js";

const MAX_RANGE_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDateTimestamp(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return NaN;

  return timestamp;
}

function ReportDiscardsFilterFormContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const initialState = location.state;
  const listId = useMemo(
    () =>
      getSafeListId(initialState?.listId) ||
      `report-discard-products:${crypto.randomUUID()}`,
    [],
  );
  const products = useListStorage(listId);
  const initialProducts = Array.isArray(initialState?.products)
    ? initialState.products
    : [];
  const startAt =
    typeof initialState?.startAt === "string" ? initialState.startAt : "";
  const endAt =
    typeof initialState?.endAt === "string" ? initialState.endAt : "";

  useEffect(() => {
    if (products.items.length === 0)
      initialProducts.forEach((product) => products.append(product.id, product));
  }, [listId]);

  const navigateToReport = (filters) =>
    navigate("/relatorios/descartes", {
      state: { ...filters, listId },
    });

  const navigateToProductSelection = () => {
    const formData = formRef.current
      ? Object.fromEntries(new FormData(formRef.current))
      : {};

    navigate("/produtos/selecionar", {
      state: {
        from: location.pathname + location.search,
        listId,
        startAt: formData.startAt ?? startAt,
        endAt: formData.endAt ?? endAt,
        products: products.items,
      },
    });
  };

  return (
    <>
      <FormBreadcrumbs
        breadcrumbs={[{ id: "discards-report", name: "Relatório de descartes" }]}
        title="Filtrar descartes"
      />
      <Form
        ref={formRef}
        className="form-inline"
        onSubmit={async (data) => {
          if (products.items.length === 0) {
            Toast.error("Selecione ao menos um produto");
            return false;
          }

          navigateToReport({
            startAt: data.startAt,
            endAt: data.endAt,
            products: products.items,
          });
          return true;
        }}
      >
        <InputField
          name="startAt"
          id="startAt"
          label="Data de início"
          type="date"
          variant="half-left"
          required
          defaultValue={startAt}
          validate={(value) =>
            !Number.isNaN(getDateTimestamp(value))
              ? true
              : "Informe uma data de início válida"
          }
        />
        <InputField
          name="endAt"
          id="endAt"
          label="Data de fim"
          type="date"
          variant="half-right"
          required
          defaultValue={endAt}
          validate={(value, state) => {
            if (Number.isNaN(getDateTimestamp(value)))
              return "Informe uma data de fim válida";

            const startTimestamp = getDateTimestamp(state.startAt);
            if (Number.isNaN(startTimestamp))
              return "Informe uma data de início válida";

            const duration =
              (getDateTimestamp(value) - startTimestamp) / DAY_IN_MS;
            if (duration < 0)
              return "A data de fim deve ser igual ou posterior à data de início";
            if (duration > MAX_RANGE_DAYS)
              return "O intervalo entre as datas não pode exceder 30 dias";

            return true;
          }}
        />
        <ListField
          label="Produtos"
          buttonLabel="Selecionar produtos"
          listId={listId}
          onAddProduct={navigateToProductSelection}
          noItemSelectedMessage="Nenhum produto selecionado"
        />

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={() =>
              navigateToReport({
                startAt,
                endAt,
                products: initialProducts,
              })
            }
            className="button-block --outline --primary"
          >
            Cancelar
          </FormModalCancelButton>
          <FormModalSubmitButton>
            <span>Filtrar</span>
          </FormModalSubmitButton>
        </footer>
      </Form>
    </>
  );
}

export const ReportDiscardsFilterForm = WithAuthGuard(function () {
  return (
    <FormControllerProvider>
      <ReportDiscardsFilterFormContent />
    </FormControllerProvider>
  );
});
