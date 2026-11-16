import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { SelectField } from "../../components/form/input-field/SelectField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { useFormController } from "../../components/form/context/useFormController";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import Toast from "../../components/toast/ToastStorage";
import MeasuringUnitsService from "../../service/MeasuringTypesService";
import GoalsService from "../../service/GoalsService";

function GoalDurationAutofillButton() {
  const form = useFormController();

  function fill30DayPeriod() {
    const startAt = new Date();
    startAt.setHours(0, 0, 0, 0);

    const endAt = new Date(startAt);
    endAt.setDate(endAt.getDate() + 30);

    const toDateInputValue = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    form.fill({
      startAt: toDateInputValue(startAt),
      endAt: toDateInputValue(endAt),
    });
  }

  return (
    <button
      type="button"
      className="button-block --outline --primary goal__autofill"
      onClick={fill30DayPeriod}
    >
      Preencher período de 30 dias
    </button>
  );
}

export default WithAuthGuard(function GoalForm() {
  const navigate = useNavigate();
  const [unitOptions, setUnitOptions] = useState([
    { label: "Sem unidade de medida", value: "" },
  ]);

  useEffect(() => {
    let active = true;

    MeasuringUnitsService.list({
      page: 1,
      perPage: 500,
      sortKey: "name",
      sortType: "asc",
    }).then(({ data, error }) => {
      if (!active) return;
      if (error?.message) {
        Toast.error(error.message);
        return;
      }

      setUnitOptions((previous) => [
        previous[0],
        ...(data?.items ?? []).map((unit) => ({
          value: String(unit.id),
          label: unit.name,
        })),
      ]);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ResourceForm
      breadcrumbs={[
        { id: "donativos", name: "Donativos" },
        { id: "goals", name: "Metas" },
      ]}
      title="Cadastrar Meta"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/metas")}
      onSubmit={async (data) => {
        const response = await GoalsService.create(data);

        if (response.data?.success) {
          Toast.success("Meta cadastrada com sucesso");
          navigate("/metas");
          return true;
        }

        const description = response.error?.issues?.[0]?.description;
        Toast.error(
          description
            ? `Falha ao cadastrar meta: ${description}`
            : "Falha ao cadastrar meta",
        );
        return false;
      }}
    >
      <InputField
        name="name"
        id="name"
        label="Nome"
        placeholder="Gerado automaticamente pelas datas, se não informado"
        maxLength={128}
      />

      <TextAreaField
        name="description"
        id="description"
        label="Descrição"
        variant="full"
        maxLength={128}
      />

      <GoalDurationAutofillButton />

      <InputField
        name="startAt"
        id="startAt"
        label="Data de início"
        type="date"
        variant="half-left"
        required
        validate={(value) =>
          value ? true : "Informe a data de início da meta"
        }
      />

      <InputField
        name="endAt"
        id="endAt"
        label="Data de término"
        type="date"
        variant="half-right"
        required
        validate={(value, state) => {
          if (!value) return "Informe a data de término da meta";
          if (state.startAt && value < state.startAt)
            return "A data de término deve ser igual ou posterior à data de início";
          return true;
        }}
      />

      <InputField
        name="goal"
        id="goal"
        label="Objetivo (Número de Produtos Doados)"
        type="number"
        min="1"
        step="1"
        required
        variant="half-left"
        validate={(value) =>
          Number.isSafeInteger(Number(value)) && Number(value) > 0
            ? true
            : "Informe um número inteiro maior que zero"
        }
      />

      <SelectField
        name="isGlobal"
        id="isGlobal"
        label="Tipo de meta"
        variant="half-right"
        defaultValue="true"
        options={[
          { label: "Geral", value: "true" },
          { label: "Por unidade de medida", value: "false" },
        ]}
      />

      <SelectField
        name="unitId"
        id="unitId"
        label="Unidade de medida (opcional)"
        options={unitOptions}
      />
    </ResourceForm>
  );
});
