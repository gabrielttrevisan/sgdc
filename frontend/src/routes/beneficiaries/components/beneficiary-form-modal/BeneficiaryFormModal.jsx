import { FormModal } from "../../../../components/form-modal/FormModal";
import { InputField } from "../../../../components/form/input-field/InputField";
import { unmaskDigits } from "../../../../lib/functions/unmask";

/**
 * @typedef {Object} BeneficiaryFormModalProps
 * @prop {import("../../../../components/form-modal/FormModal").FormModalRef} [ref]
 */

/** @type {import("react").FC<BeneficiaryFormModalProps>} */
export const BeneficiaryFormModal = ({ ref }) => {
  return (
    <FormModal ref={ref} title="Beneficiário" editLabel="Atualizar Dados">
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

      <InputField
        name="nationalId"
        required={true}
        id="nationalId"
        label="CPF"
        inputMode="numeric"
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
        validate={() => true}
      />

      <InputField
        name="neighborhood"
        required={true}
        id="neighborhood"
        label="Bairro"
        validate={(value) => {
          const trimmed = value.trim();

          if (!trimmed.length) return "Bairro inválido";

          return true;
        }}
      />
    </FormModal>
  );
};
