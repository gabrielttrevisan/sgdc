import { FormModal } from "../../../../components/form/modal/FormModal";
import { InputField } from "../../../../components/form/input-field/InputField";
import { InputHidden } from "../../../../components/form/input-field/InputHidden";

import "./MeasuringUnitFormModal.css";

/**
 * @typedef {Object} MeasuringUnitFormModalProps
 * @prop {import("../../../../components/form/modal/FormModal").FormModalRef} [ref]
 * @prop {Record<"create"|"edit",import("../../../../components/form/context/FormController").CustomOnSubmitHandler>} onSubmit
 */

/** @type {import("react").FC<MeasuringUnitFormModalProps>} */
export const MeasuringUnitFormModal = ({ ref, onSubmit }) => {
  return (
    <FormModal
      ref={ref}
      title="Unidade de Medida"
      editLabel="Atualizar Dados"
      className="measuring-unit-form-modal"
      onSubmit={onSubmit}
    >
      <InputHidden name="id" id="id" />

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
    </FormModal>
  );
};
