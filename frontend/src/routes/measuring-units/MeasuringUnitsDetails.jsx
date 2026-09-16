import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import MeasuringUnitsService from "../../service/MeasuringTypesService";

export default WithAuthGuard(function MeasuringUnitsDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => await MeasuringUnitsService.getById(id)}
      breadcrumbs={[
        { id: "donativos", name: "Donativos" },
        { id: "measuring-units", name: "Unidades de Medida" },
      ]}
      title="Dados da Unidade de Medida"
      onCancel={() => navigate("/unidades-de-medida")}
    >
      <InputField name="name" id="name" label="Nome" readOnly />
      <InputField
        name="symbol"
        id="symbol"
        label="Unidade de Medida (Abreviação/Símbolo)"
        readOnly
        variant="half-left"
      />
    </ReadOnlyResourceForm>
  );
});