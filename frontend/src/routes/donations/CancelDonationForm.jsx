import { useNavigate, useSearchParams } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { InputHidden } from "../../components/form/input-field/InputHidden.jsx";
import { TextAreaField } from "../../components/form/input-field/TextAreaField.jsx";
import DonationsService from "../../service/DonationsService.js";
import Toast from "../../components/toast/ToastStorage.js";

export default WithAuthGuard(function CancelDonationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <ResourceForm
      title="Cancelar doação"
      breadcrumbs={[{ id: "donations", name: "Doações" }]}
      onCancel={() => navigate("/doacoes")}
      onSubmit={async (data) => {
        if (!id) {
          Toast.error("Doação inválida");
          return false;
        }

        const response = await DonationsService.cancel(id, data.details);
        if (response.data?.success) {
          Toast.success("Doação cancelada com sucesso");
          navigate("/doacoes");
          return true;
        }

        Toast.error(
          response.error?.issues?.[0]?.description ??
            response.error?.message ??
            "Falha ao cancelar doação",
        );
        return false;
      }}
    >
      <InputHidden name="id" id="id" value={id ?? ""} />
      <TextAreaField
        name="details"
        id="details"
        label="Motivo do cancelamento"
        required
        maxLength={255}
        validate={(value) =>
          value.trim().length > 0 && value.trim().length <= 255
            ? true
            : "O motivo deve conter entre 1 e 255 caracteres"
        }
      />
    </ResourceForm>
  );
});
