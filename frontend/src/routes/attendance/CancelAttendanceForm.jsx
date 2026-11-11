import { useNavigate, useSearchParams } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { InputHidden } from "../../components/form/input-field/InputHidden";
import AttendanceService from "../../service/AttendanceService.js";
import Toast from "../../components/toast/ToastStorage";

export default WithAuthGuard(function CancelAttendanceForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <ResourceForm
      title="Cancelar atendimento"
      breadcrumbs={[{ id: "attendance", name: "Atendimentos" }]}
      onCancel={() => navigate("/atendimentos")}
      onSubmit={async (data) => {
        if (!id) {
          Toast.error("Atendimento inválido");
          return false;
        }

        const response = await AttendanceService.cancel({
          id,
          reason: data.reason,
        });

        if (response.data?.success) {
          Toast.success("Atendimento cancelado com sucesso");
          navigate("/atendimentos");
          return true;
        }

        Toast.error(response.error?.message ?? "Falha ao cancelar atendimento");
        return false;
      }}
    >
      <InputHidden name="id" id="id" value={id ?? ""} />
      <TextAreaField
        name="reason"
        id="reason"
        label="Motivo do Cancelamento"
        required
        maxLength={256}
        validate={(value) =>
          value.trim().length > 0 && value.trim().length <= 256
            ? true
            : "O motivo deve conter entre 1 e 256 caracteres"
        }
      />
    </ResourceForm>
  );
});
