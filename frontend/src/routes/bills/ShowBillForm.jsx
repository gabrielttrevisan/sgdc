import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import { TextAreaField } from "../../components/form/input-field/TextAreaField.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import BillsService from "../../service/BillsService.js";
import { Fragment } from "react";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { BillTimeline } from "./components/BillTimeline.jsx";

export default WithAuthGuard(function ShowBillForm() {
  const navigate = useNavigate();

  const goToResourceListing = () => {
    navigate("/contas-a-pagar");
  };

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => await BillsService.getById(id)}
      breadcrumbs={[
        { id: "intitucional", name: "Institucional" },
        { id: "contas-a-pagar", name: "Contas a Pagar" },
      ]}
      title="Visualizar Conta a Pagar"
      onCancel={goToResourceListing}
      gridColumns="repeat(2, 50%)"
      actions={<BillTimeline />}
    >
      <InputField
        name="dueDate"
        required
        id="dueDate"
        label="Data de Vencimento"
        variant="half-left"
        disabled
        aria-disabled="true"
        mask={(value) => {
          const date =
            typeof value === "string"
              ? new Date(value)
              : value instanceof Date
                ? value
                : null;

          if (!date) return value;

          return date.toLocaleDateString("pt-br", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }}
      />

      <InputField
        name="value"
        required
        id="value"
        label="Valor"
        variant="half-right"
        readOnly
        mask={(value) => {
          const number = Number(value);

          if (isNaN(number) || !Number.isFinite(number)) return "R$ 00,00";

          return number.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
            maximumFractionDigits: 2,
          });
        }}
      />

      <TextAreaField
        name="description"
        required
        id="description"
        label="Descrição/Detalhes"
        placeholder="Aluguel, manutenção de encanamento, manutenção ar condicionado..."
        variant="full"
        readOnly
      />
    </ReadOnlyResourceForm>
  );
});
