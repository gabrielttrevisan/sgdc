import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import MeasuringUnitsService from "../../service/MeasuringTypesService";
import Toast from "../../components/toast/ToastStorage";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";

import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";

export default WithAuthGuard(function MeasuringUnitsForm() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/unidades-de-medida");
  };

  return (
    <ResourceForm
      fetchResource={async (id) => await MeasuringUnitsService.getById(id)}
      breadcrumbs={[
        { id: "donativos", name: "Donativos" },
        { id: "measuring-units", name: "Unidades de Medida" },
      ]}
      title="Cadastrar Unidade de Medida"
      onCancel={handleCancel}
      onSubmit={async (data, isEditing) => {
        if (isEditing) {
          const response = await MeasuringUnitsService.edit(data);

          if (response.data?.success) {
            Toast.success("Unidade de medida cadastrada com sucesso");
            navigate("/unidades-de-medida");
            return true;
          } else if (response.error) {
            Toast.error("Falha ao cadastrar unidade de medida");
          }

          return false;
        }

        const response = await MeasuringUnitsService.create(data);

        if (response.data?.success) {
          Toast.success("Unidade de medida cadastrada com sucesso");
          navigate("/unidades-de-medida");
          return true;
        } else if (response.error) {
          Toast.error("Falha ao cadastrar unidade de medida");
        }

        return false;
      }}
    >
      <InputField
        name="name"
        required
        id="name"
        label="Nome"
        placeholder="Quilograma, litro, grama..."
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length === 0 || trimmed.length > 32)
            return "O nome não pode ser vazio ou ter mais que 32 caracteres";

          return true;
        }}
      />

      <InputField
        name="symbol"
        required
        id="symbol"
        label="Unidade de Medida (Abreviação/Símbolo)"
        placeholder="kg, g, l, ml..."
        variant="half-left"
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length === 0 || trimmed.length > 8)
            return "O nome não pode ser vazio ou ter mais que 8 caracteres";

          return true;
        }}
      />
    </ResourceForm>
  );
});
