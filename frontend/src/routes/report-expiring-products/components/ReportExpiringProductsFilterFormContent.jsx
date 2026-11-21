import { useLocation, useNavigate } from "react-router";
import { Form } from "../../../components/form/Form.jsx";
import { InputField } from "../../../components/form/input-field/InputField.jsx";
import { FormModalCancelButton } from "../../../components/form/modal/button/FormModalCancelButton.jsx";
import { FormModalSubmitButton } from "../../../components/form/modal/button/FormModalSubmitButton.jsx";
import { FormBreadcrumbs } from "../../../components/resource-form/FormBreadcrumbs.jsx";

function getInitialDays(value) {
  const days = Number(value);
  return (typeof value === "number" || /^\d+$/.test(value ?? "")) &&
    Number.isSafeInteger(days) &&
    days >= 0
    ? days
    : 15;
}

export function ReportExpiringProductsFilterFormContent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const days = getInitialDays(state?.days);
  const navigateToReport = (nextDays) =>
    navigate("/relatorios/produtos-a-vencer", {
      state: { days: nextDays },
    });

  return (
    <>
      <FormBreadcrumbs
        breadcrumbs={[
          { id: "expiring-products-report", name: "Produtos a vencer" },
        ]}
        title="Filtrar produtos a vencer"
      />
      <Form
        className="form-inline"
        onSubmit={async (data) => {
          navigateToReport(Number(data.days));
          return true;
        }}
        style={{ "--grid-columns": 2 }}
      >
        <InputField
          name="days"
          id="days"
          label="Dias a partir de hoje"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={days}
          validate={(value) =>
            /^\d+$/.test(value) && Number.isSafeInteger(Number(value))
              ? true
              : "Informe um número inteiro de dias maior ou igual a zero"
          }
        />
        <footer>
          <FormModalCancelButton
            type="button"
            onClick={() => navigateToReport(days)}
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
