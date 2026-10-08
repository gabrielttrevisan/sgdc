import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import { TextAreaField } from "../../components/form/input-field/TextAreaField.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import BillsService from "../../service/BillsService.js";
import { Fragment } from "react";

export default WithAuthGuard(function CancelAndCopyBillForm() {
  const navigate = useNavigate();

  const goToResourceListing = () => {
    navigate("/contas-a-pagar");
  };

  return (
    <ResourceForm
      fetchResource={async (id) => await BillsService.getById(id)}
      breadcrumbs={[
        { id: "intitucional", name: "Institucional" },
        { id: "contas-a-pagar", name: "Contas a Pagar" },
      ]}
      title="Cancelar e Lançar Conta a Pagar"
      onCancel={goToResourceListing}
      onSubmit={async (data) => {
        const response = await BillsService.cancelAndCopy({
          description: data.description,
          dueDate: new Date(data.dueDate),
          value: data.value,
          cancelationDetails: data.cancelationDetails,
          id: data.id,
        });

        if (response.data?.success) {
          Toast.success("Conta a pagar lançada com sucesso");
          goToResourceListing();

          return true;
        } else if (response.error) {
          if (response.error.issues.length) {
            Toast.error(
              <>
                Falha ao lançar conta a pagar
                <br />
                {response.error.issues.map((issue) => (
                  <Fragment key={issue.code}>{issue.description}</Fragment>
                ))}
              </>,
            );
          }

          Toast.error("Falha ao lançar conta a pagar");
        }

        return false;
      }}
    >
      <InputField
        name="dueDate"
        required
        id="dueDate"
        label="Data de Vencimento"
        type="date"
        variant="half-left"
        validate={(value) => {
          const trimmed = value.trim();
          const date = Date.parse(trimmed);

          if (isNaN(date)) return "Data de vencimento inválida";

          if (date <= Date.now()) return "A data de vencimento deve ser futura";

          return true;
        }}
      />

      <InputField
        name="value"
        required
        id="value"
        label="Valor"
        type="number"
        variant="half-right"
        step="0.5"
        validate={(value) => {
          const parsed = parseFloat(value);

          if (isNaN(parsed) || parsed <= 0.1)
            return "Valor inválido. Deve ser numérico e maior que 0.1";

          return true;
        }}
      />

      <TextAreaField
        name="description"
        required
        id="description"
        label="Descrição/Detalhes"
        placeholder="Aluguel, manutenção de encanamento, manutenção ar condicionado..."
        variant="full"
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length === 0 || trimmed.length > 256)
            return "Descrição não pode ser vazia ou conter mais que 256 caracteres";

          return true;
        }}
      />

      <TextAreaField
        name="cancelationDetails"
        required
        id="cancelationDetails"
        label="Motivo do Cancelamento"
        placeholder="Dados incorretos, lançamento incorreto, negociação, etc."
        variant="full"
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length === 0 || trimmed.length > 256)
            return "O motivo não pode ser vazio ou conter mais que 256 caracteres";

          return true;
        }}
      />
    </ResourceForm>
  );
});
