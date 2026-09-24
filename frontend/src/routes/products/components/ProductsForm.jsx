import { useEffect, useState } from "react";
import { InputField } from "../../../components/form/input-field/InputField";
import { SelectField } from "../../../components/form/input-field/SelectField";
import { TextAreaField } from "../../../components/form/input-field/TextAreaField";
import MeasuringUnitsService from "../../../service/MeasuringTypesService";
import Toast from "../../../components/toast/ToastStorage";

export function ProductsForm() {
  const [measuringUnits, setMeasuringUnits] = useState([]);

  useEffect(() => {
    MeasuringUnitsService.list({ page: 1, perPage: 100 }).then((response) => {
      if (response.data) setMeasuringUnits(response.data.items);
      else Toast.error(response.error?.message || "Erro ao carregar unidades");
    });
  }, []);

  return (
    <>
      <InputField
        name="name"
        required
        id="name"
        label="Nome do Produto"
        validate={(value) => {
          const length = value.trim().length;

          if (length < 8) return "O nome deve ter pelo menos 8 caracteres";
          if (length > 120) return "O nome não pode ter mais que 120 caracteres";

          return true;
        }}
      />

      <SelectField
        name="measuringUnitId"
        required
        id="measuringUnitId"
        label="Unidade de Medida"
        options={[
          { label: "Selecione", value: "" },
          ...measuringUnits.map((unit) => ({
            label: `${unit.name} (${unit.symbol})`,
            value: String(unit.id),
          })),
        ]}
      />

      <InputField
        name="isPerishable"
        id="isPerishable"
        type="checkbox"
        label="É perecível"
      />

      <InputField
        name="needRefrigeration"
        id="needRefrigeration"
        type="checkbox"
        label="Necessita de refrigeração"
      />

      <TextAreaField
        name="description"
        id="description"
        label="Descrição"
        validate={(value) => {
          const length = value.trim().length;

          if (length > 140)
            return "A descrição não pode ter mais que 140 caracteres";

          return true;
        }}
      />
    </>
  );
}
