import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import { TextAreaField } from "../../components/form/input-field/TextAreaField.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import BillsService from "../../service/BillsService.js";
import { Fragment } from "react";

export default WithAuthGuard(function ExtendBillForm() {
  const navigate = useNavigate();

  const goToResourceListing = () => {
    navigate("/contas-a-pagar");
  };

  return (
    <ResourceForm
      fetchResource={async (id) => ({ data: { id } })}
      breadcrumbs={[
        { id: "intitucional", name: "Institucional" },
        { id: "contas-a-pagar", name: "Contas a Pagar" },
      ]}
      title="Adiar Conta a Pagar"
      onCancel={goToResourceListing}
      onSubmit={async (data, hasId) => {
        if (!hasId) {
          Toast.error(
            <>
              Erro inesperado
              <br />
              Por favor, atualize a página
            </>,
          );
          return;
        }

        const response = await BillsService.extend({
          details: data.details,
          newDueDate: new Date(data.newDueDate),
          id: data.id,
        });

        if (response.data?.success) {
          Toast.success("Conta a pagar adiada com sucesso");
          goToResourceListing();

          return true;
        } else if (response.error) {
          if (response.error.issues.length) {
            Toast.error(
              <>
                Falha ao adiar conta a pagar
                <br />
                {response.error.issues.map((issue) => (
                  <Fragment key={issue.code}>{issue.description}</Fragment>
                ))}
              </>,
            );
          }

          Toast.error("Falha ao adiar conta a pagar");
        }

        return false;
      }}
    >
      <InputField
        name="newDueDate"
        required
        id="newDueDate"
        label="Nova Data de Vencimento"
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

      <TextAreaField
        name="details"
        required
        id="details"
        label="Motivo do Adiamento"
        placeholder="Negociação com provedor, erro de cadastro, etc."
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
