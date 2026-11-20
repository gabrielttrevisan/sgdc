import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Form } from "../../../components/form/Form.jsx";
import { InputField } from "../../../components/form/input-field/InputField.jsx";
import { FormModalCancelButton } from "../../../components/form/modal/button/FormModalCancelButton.jsx";
import { FormModalSubmitButton } from "../../../components/form/modal/button/FormModalSubmitButton.jsx";
import ListField from "../../../components/list-field/ListField.jsx";
import { FormBreadcrumbs } from "../../../components/resource-form/FormBreadcrumbs.jsx";
import Toast from "../../../components/toast/ToastStorage.js";
import getSafeListId from "../../../store/list/getSafeListId.js";
import { useListStorage } from "../../../store/list/useListStorage.js";
import { ReportDiscardsDatePresets } from "./ReportDiscardsDatePresets.jsx";
import { getDateTimestamp } from "../utils/getDateTimestamp.js";
import { isFullCalendarMonth } from "../utils/isFullCalendarMonth.js";
import useTourGuide from "../../../hooks/useTourGuide.js";
import HelpButton from "../../../components/help-button/HelpButton.jsx";

const MAX_RANGE_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function ReportDiscardsFilterFormContent() {
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
  const { start, registerStepEl } = useTourGuide("report-discards-filter-form");
  const initialProducts = Array.isArray(initialState?.products)
    ? initialState.products
    : [];
  const startAt =
    typeof initialState?.startAt === "string" ? initialState.startAt : "";
  const endAt =
    typeof initialState?.endAt === "string" ? initialState.endAt : "";

  useEffect(() => {
    if (products.items.length === 0) {
      initialProducts.forEach((product) =>
        products.append(product.id, product),
      );
    }
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
        breadcrumbs={[
          { id: "discards-report", name: "Relatório de descartes" },
        ]}
        title={
          <>
            <span>Filtrar descartes</span>
            <HelpButton onClick={start} />
          </>
        }
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
        style={{ "--grid-columns": 2 }}
      >
        <ReportDiscardsDatePresets
          currentMonthProps={registerStepEl({
            content:
              "Utilize essa funcionalidade para preencher data inicial com o primeiro dia do mês atual e data final com o último dia do mês atual.",
            order: 1,
            title: "Período do Relatório",
          })}
          next30DaysProps={registerStepEl({
            content:
              "Utilize esse botão para autopreencher data final com o valor de data inicial mais 30 dias",
            order: 2,
            title: "Período do Relatório",
          })}
        />

        <InputField
          name="startAt"
          id="startAt"
          label="Data Inicial"
          type="date"
          variant="half-left"
          required
          defaultValue={startAt}
          validate={(value) =>
            !Number.isNaN(getDateTimestamp(value))
              ? true
              : "Informe uma data de início válida"
          }
          {...registerStepEl({
            content:
              "Informe a data inicial da emissão do relatório.<br/>Serão exibidos apenas descartes registrados após essa data.",
            order: 3,
            title: "Período do Relatório",
          })}
        />

        <InputField
          name="endAt"
          id="endAt"
          label="Data Final"
          type="date"
          variant="half-right"
          required
          defaultValue={endAt}
          validate={(value, state) => {
            if (Number.isNaN(getDateTimestamp(value))) {
              return "Informe uma data de fim válida";
            }

            const startTimestamp = getDateTimestamp(state.startAt);
            if (Number.isNaN(startTimestamp)) {
              return "Informe uma data de início válida";
            }

            const endTimestamp = getDateTimestamp(value);
            const duration = (endTimestamp - startTimestamp) / DAY_IN_MS;

            if (duration < 0) {
              return "A data de fim deve ser igual ou posterior à data de início";
            }
            if (
              duration > MAX_RANGE_DAYS &&
              !isFullCalendarMonth(startTimestamp, endTimestamp)
            ) {
              return "O intervalo entre as datas não pode exceder 30 dias";
            }

            return true;
          }}
          {...registerStepEl({
            content:
              "Informe a data final da emissão do relatório.<br/>Serão exibidos apenas descartes registrados antes dessa data.<br/><strong>A diferença entre data inicial e final não pode ser superior a 30 dias.",
            order: 3,
            title: "Período do Relatório",
          })}
        />

        <ListField
          label="Produtos"
          buttonLabel="Selecionar produtos"
          listId={listId}
          onAddProduct={navigateToProductSelection}
          noItemSelectedMessage="Nenhum produto selecionado"
          style={{ gridColumn: "1 / 3" }}
          buttonProps={registerStepEl({
            content:
              "Clique aqui para selecionar ou remover produtos.<br/>Se houverem produtos selecionados, serão exibidos apenas descartes que contem esses produtos.<br/>Do contrário não haverá filtragem por produto.",
            order: 4,
            title: "Seleção de Produtos",
          })}
          firstRemoveButtonProps={registerStepEl({
            content:
              "Utilize esse botão vermelho com ícone de 'X' para remover o produto da filtragem",
            order: 5,
            title: "Seleção de Produtos",
          })}
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
