import { FormModal } from "../../../../components/form/modal/FormModal";
import { InputField } from "../../../../components/form/input-field/InputField";
import { InputHidden } from "../../../../components/form/input-field/InputHidden";

import "./AllocationTypeFormModal.css";
import { TextAreaField } from "../../../../components/form/input-field/TextAreaField";

/**
 * @typedef {Object} AllocationTypeFormModalProps
 * @prop {import("../../../../components/form/modal/FormModal").FormModalRef} [ref]
 * @prop {Record<"create"|"edit",import("../../../../components/form/context/FormController").CustomOnSubmitHandler>} onSubmit
 */

/** @type {import("react").FC<AllocationTypeFormModalProps>} */
export const AllocationTypeFormModal = ({ ref, onSubmit }) => {
  return (
    <FormModal
      ref={ref}
      title="Tipo de Alocação"
      editLabel="Atualizar Dados"
      className="beneficiary-form-modal"
      onSubmit={onSubmit}
    >
      <InputHidden name="id" id="id" />

      <InputField
        name="name"
        required
        id="name"
        label="Nome - Descrição Breve"
        placeholder="Limpeza, Transporte de Doação, etc..."
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length === 0 || trimmed.length > 32)
            return "O nome não pode ser vazio ou ter mais que 32 caracteres";

          return true;
        }}
      />

      <TextAreaField
        name="description"
        label="Detalhes"
        placeholder="Descrição mais detalhada da atuação..."
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length > 65)
            return "O detalhe não pode ser vazio ou ter mais que 65 caracteres";

          return true;
        }}
      />
    </FormModal>
  );
};
