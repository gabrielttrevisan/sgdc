import { FormModal } from "../../../../components/form/modal/FormModal";
import { InputField } from "../../../../components/form/input-field/InputField";
import { InputHidden } from "../../../../components/form/input-field/InputHidden";

import "./FamilyFormModal.css";
import { ItemListField } from "../../../../components/form/input-field/item-list/ItemListField";
import { CloseIconLarge } from "../../../../components/icons/CloseIconLarge";
import { VisuallyHidden } from "../../../../components/accessibility/visually-hidden/VisuallyHidden";
import { useRef } from "react";
import NoFamilyBeneficiariesService from "../../../../service/NoFamilyBeneficiariesService";
import { FamilyParticipantsField } from "./FamilyParticipantsField";

/**
 * @typedef {Object} FamilyFormModalProps
 * @prop {import("../../../../components/form/modal/FormModal").FormModalRef} [ref]
 * @prop {Record<"create"|"edit",import("../../../../components/form/context/FormController").CustomOnSubmitHandler>} onSubmit
 */

/** @type {import("react").FC<FamilyFormModalProps>} */
export const FamilyFormModal = ({ ref, onSubmit }) => {
  const listRef = useRef();

  return (
    <FormModal
      ref={ref}
      title="Família"
      editLabel="Atualizar Dados"
      className="family-form-modal"
      onSubmit={onSubmit}
      onClose={() => {
        listRef.current?.reset?.();
      }}
    >
      <InputHidden name="id" id="id" />

      <InputField
        name="name"
        required={true}
        id="name"
        label="Apelido"
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();
          const message = "Apelido inválido";

          if (!trimmed.match(/^([0-9a-zÀ-ž-\s]{8,64})$/gi)) return message;

          return true;
        }}
      />

      <FamilyParticipantsField ref={listRef} />
    </FormModal>
  );
};
