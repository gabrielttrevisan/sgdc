import { VisuallyHidden } from "../../../../components/accessibility/visually-hidden/VisuallyHidden";
import { ItemListField } from "../../../../components/form/input-field/item-list/ItemListField";
import { useFormModal } from "../../../../components/form/modal/context/FormModalContext";
import { CloseIconLarge } from "../../../../components/icons/CloseIconLarge";
import NoFamilyBeneficiariesService from "../../../../service/NoFamilyBeneficiariesService";

export function FamilyParticipantsField({ ref }) {
  const { mode } = useFormModal();

  return (
    <ItemListField
      name="participants"
      label="Familiares"
      required
      searchService={NoFamilyBeneficiariesService}
      propKey="nationalId"
      ref={ref}
      showSearch={mode !== "show"}
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
      Checkbox={({ onChange, onRemove, name, id, isResponsible, disabled }) => {
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
  );
}
