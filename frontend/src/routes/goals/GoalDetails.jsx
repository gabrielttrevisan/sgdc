import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ReadOnlyResourceForm } from "../../components/resource-form/read-only/ReadOnlyResourceForm.jsx";
import GoalsService from "../../service/GoalsService";

export default WithAuthGuard(function GoalDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        const response = await GoalsService.getById(id);
        return response.data
          ? {
              ...response,
              data: {
                ...response.data,
                isGlobal: response.data.isGlobal ? "Sim" : "Não",
                unitName: response.data.unitName || "—",
              },
            }
          : response;
      }}
      breadcrumbs={[
        { id: "donativos", name: "Donativos" },
        { id: "goals", name: "Metas" },
      ]}
      title="Dados da Meta"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/metas")}
    >
      <InputField name="name" id="name" label="Nome" readOnly />
      <TextAreaField
        name="description"
        id="description"
        label="Descrição"
        readOnly
      />
      <InputField
        name="startAt"
        id="startAt"
        label="Data de início"
        type="date"
        variant="half-left"
        readOnly
      />
      <InputField
        name="endAt"
        id="endAt"
        label="Data de término"
        type="date"
        variant="half-right"
        readOnly
      />
      <InputField
        name="goal"
        id="goal"
        label="Objetivo"
        type="number"
        variant="half-left"
        readOnly
      />
      <InputField
        name="percentage"
        id="percentage"
        label="Atingimento"
        variant="half-right"
        readOnly
      />
      <InputField
        name="isGlobal"
        id="isGlobal"
        label="Meta geral"
        variant="half-left"
        readOnly
      />
      <InputField
        name="unitName"
        id="unitName"
        label="Unidade de medida"
        variant="half-right"
        readOnly
      />
      <InputField name="type" id="type" label="Tipo" readOnly />
    </ReadOnlyResourceForm>
  );
});
