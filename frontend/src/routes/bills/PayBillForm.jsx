import { useNavigate } from "react-router";
import { TextAreaField } from "../../components/form/input-field/TextAreaField.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import BillsService from "../../service/BillsService.js";
import { Fragment } from "react";
import { InputField } from "../../components/form/input-field/InputField.jsx";

export default WithAuthGuard(function PayBillForm() {
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
      title="Dar Baixa Conta a Pagar"
      onCancel={goToResourceListing}
      onSubmit={async (data, hasId) => {
        if (!hasId) {
          return Toast.error(
            <>
              Erro inesperado
              <br />
              Por favor, atualize a página
            </>,
          );
        }

        const [response] = await BillsService.pay({
          details: data.details,
          id: data.id,
          paidValue: parseFloat(data.paidValue),
        });

        if (response.data?.success) {
          Toast.success("Baixa realizada com sucesso");
          goToResourceListing();

          return true;
        } else if (response.error) {
          if (response.error.issues.length) {
            return Toast.error(
              <>
                Falha ao dar baixa em conta a pagar
                <br />
                {response.error.issues.map((issue) => (
                  <Fragment key={issue.code}>{issue.description}</Fragment>
                ))}
              </>,
            );
          }

          Toast.error("Falha ao dar baixa em conta a pagar");
        }

        return false;
      }}
    >
      <InputField
        name="paidValue"
        required
        id="paidValue"
        label="Valor Pago"
        type="number"
        variant="full"
        step="0.5"
        validate={(value) => {
          const parsed = parseFloat(value);

          if (isNaN(parsed) || parsed <= 0.1)
            return "Valor pago inválido. Deve ser numérico e maior que 0.1";

          return true;
        }}
      />

      <TextAreaField
        name="details"
        required
        id="details"
        label="Detlhes do Pagamento"
        placeholder="Pago via Pix, detalhes, etc."
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
