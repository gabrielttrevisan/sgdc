import { FormModal } from "../../../../components/form/modal/FormModal";
import { InputField } from "../../../../components/form/input-field/InputField";
import { InputHidden } from "../../../../components/form/input-field/InputHidden";

import "./FamilyFormModal.css";
import { ItemListField } from "../../../../components/form/input-field/item-list/ItemListField";
import { CloseIconLarge } from "../../../../components/icons/CloseIconLarge";
import { VisuallyHidden } from "../../../../components/accessibility/visually-hidden/VisuallyHidden";
import { useRef } from "react";
import NoFamilyBeneficiariesService from "../../../../service/NoFamilyBeneficiariesService";

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

          if (!trimmed.match(/^([0-9a-zÀ-ž-\s]{8,})$/gi)) return message;

          return true;
        }}
      />

      <ItemListField
        name="participants"
        label="Familiares"
        required
        searchService={NoFamilyBeneficiariesService}
        propKey="nationalId"
        ref={listRef}
        parse={(item) => ({
          key: item.nationalId ?? item.id,
          name: item.name,
          isResponsible: item.isResponsible ?? false,
        })}
        validate={(items) => {
          if (!Array.isArray(items) || items.length < 2)
            return "Uma família deve conter pelo menos dois integrantes";

          if (items.every((item) => !item.isResponsible))
            return "Toda família deve ter no mínimo um responsável";

          return true;
        }}
        Checkbox={({
          onChange,
          onRemove,
          name,
          id,
          isResponsible,
          disabled,
        }) => {
          return (
            <div className="family-participant">
              <span className="name">{name}</span>

              <label className="is-responsible">
                <input
                  type="checkbox"
                  name="is-responsible"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onChange({ key: id, name, isResponsible: checked });
                  }}
                  defaultChecked={isResponsible}
                  disabled={disabled}
                />
                <span>É Responsável</span>
              </label>

              {!disabled && (
                <button type="button" onClick={onRemove}>
                  <CloseIconLarge size={16} />
                  <VisuallyHidden>Remover {name} da Família</VisuallyHidden>
                </button>
              )}
            </div>
          );
        }}
      />
    </FormModal>
  );
};
