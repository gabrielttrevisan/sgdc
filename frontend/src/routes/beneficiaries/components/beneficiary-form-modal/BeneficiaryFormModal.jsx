import { FormModal } from "../../../../components/form/modal/FormModal";
import { InputField } from "../../../../components/form/input-field/InputField";
import { SelectField } from "../../../../components/form/input-field/SelectField";
import { unmaskDigits } from "../../../../lib/functions/unmask";
import "./BeneficiaryFormModal.css";

/**
 * @typedef {Object} BeneficiaryFormModalProps
 * @prop {import("../../../../components/form/modal/FormModal").FormModalRef} [ref]
 * @prop {Record<"create"|"edit",import("../../../../components/form/context/FormController").CustomOnSubmitHandler>} onSubmit
 */

/** @type {import("react").FC<BeneficiaryFormModalProps>} */
export const BeneficiaryFormModal = ({ ref, onSubmit }) => {
  return (
    <FormModal
      ref={ref}
      title="Beneficiário"
      editLabel="Atualizar Dados"
      className="beneficiary-form-modal"
      onSubmit={onSubmit}
    >
      <InputField
        name="name"
        required={true}
        id="name"
        label="Nome Completo"
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();
          const message = "Nome inválido";

          if (!trimmed.match(/^([^0-9\d]{2,}\s[^0-9\d]{1,})$/gu))
            return message;

          return true;
        }}
      />

      <SelectField
        name="gender"
        id="gender"
        required={true}
        label="Sexo"
        validate={(value) => {
          if (!["f", "m", "o"].includes(value)) return "Sexo inválido";

          return true;
        }}
        options={[
          { label: "Feminino", value: "f" },
          { label: "Masculino", value: "m" },
          { label: "Não Informado", value: "o" },
        ]}
        variant="half-left"
      />

      <InputField
        name="nationalId"
        required={true}
        id="nationalId"
        label="CPF"
        inputMode="numeric"
        variant="half-right"
        mask={(input) =>
          unmaskDigits(input)
            .slice(0, 11)
            .replace(
              /(\d{1,3})(\d{1,3})(\d{1,3})(\d{1,2})/gi,
              (_all, one, two, three, four) => {
                if (four) return `${one}.${two}.${three}-${four}`;
                else if (three) return `${one}.${two}.${three}`;
                else if (two) return `${one}.${two}`;

                return one;
              },
            )
        }
        validate={(value) => {
          const trimmed = value.trim();
          const message = "CPF inválido";

          if (trimmed.length < 11) return message;

          return true;
        }}
      />

      <InputField
        name="phone"
        required={true}
        id="phone"
        label="Telefone"
        inputMode="numeric"
        variant="half-left"
        mask={(input) =>
          unmaskDigits(input)
            .slice(0, 11)
            .replace(
              /(\d{1,2})(\d{1,5})(\d{1,4})/gi,
              (_all, one, two, three) => {
                if (three) return `(${one}) ${two}-${three}`;
                else if (two) return `(${one}) ${two}`;

                return `(${one})`;
              },
            )
        }
        validate={(value) => {
          const trimmed = unmaskDigits(value);
          const message = "Telefone inválido";

          if (trimmed.length < 10) return message;

          return true;
        }}
      />

      <SelectField
        name="family"
        id="family"
        required={true}
        label="Família"
        disabled
        options={[]}
        variant="half-right"
      />

      <InputField
        name="street"
        required={true}
        id="street"
        label="Logradouro"
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length < 4) return "Logradouro muito curto";
          else if (trimmed.length > 140) return "Logradouro muito longo";

          return true;
        }}
      />

      <InputField
        name="number"
        required={true}
        id="number"
        label="Número"
        inputMode="numeric"
        variant="half-left"
        validate={(value) => {
          const trimmed = value.trim();

          if (!trimmed.length) return "Número inválido";

          return true;
        }}
      />

      <InputField
        name="complement"
        required={false}
        id="complement"
        label="Complemento"
        variant="half-right"
      />

      <InputField
        name="neighborhood"
        required={true}
        id="neighborhood"
        label="Bairro"
        variant="half-left"
        validate={(value) => {
          const trimmed = value.trim();

          if (!trimmed.length) return "Bairro inválido";

          return true;
        }}
      />

      <SelectField
        name="state"
        id="state"
        required={true}
        label="Estado"
        disabled
        options={[{ label: "São Paulo", value: "sp" }]}
        variant="half-right"
      />

      <SelectField
        name="city"
        id="city"
        required={true}
        label="Cidade"
        disabled
        options={[{ label: "Presidente Prudente", value: 1 }]}
        variant="half-left"
      />
    </FormModal>
  );
};
