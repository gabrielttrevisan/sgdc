import { InputField } from "../../../components/form/input-field/InputField";
import { SelectField } from "../../../components/form/input-field/SelectField";
import { unmaskDigits } from "../../../lib/functions/unmask";
import { isNationalIdValid } from "../../../lib/validation/isNationalIdValid";
import { CitiesSelectInput } from "./cities-select-input/CitiesSelectInput";

export function BeneficiaryFields({ readOnly = false }) {
  return (
    <>
      <InputField
        name="name"
        required={!readOnly}
        id="name"
        label="Nome Completo"
        readOnly={readOnly}
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();

          if (!trimmed.match(/^([^0-9\d]{2,}\s[^0-9\d]{1,})$/gu))
            return "Nome inválido";

          return true;
        }}
      />

      <SelectField
        name="gender"
        id="gender"
        required={!readOnly}
        label="Sexo"
        disabled={readOnly}
        options={[
          { label: "Feminino", value: "f" },
          { label: "Masculino", value: "m" },
          { label: "Não Informado", value: "o" },
        ]}
        variant="half-left"
      />

      <InputField
        name="nationalId"
        required={!readOnly}
        id="nationalId"
        label="CPF"
        readOnly={readOnly}
        inputMode="numeric"
        variant="half-right"
        mask={(input) =>
          unmaskDigits(input)
            .slice(0, 11)
            .replace(
              /(\d{1,3})(\d{1,3})(\d{1,3})(\d{1,2})/gi,
              (_all, one, two, three, four) => {
                if (four) return `${one}.${two}.${three}-${four}`;
                if (three) return `${one}.${two}.${three}`;
                if (two) return `${one}.${two}`;

                return one;
              },
            )
        }
        validate={(value) => {
          const trimmed = unmaskDigits(value);
          const message = "CPF inválido";

          if (trimmed.length < 11) return message;

          return isNationalIdValid(trimmed) || message;
        }}
      />

      <InputField
        name="phone"
        required={!readOnly}
        id="phone"
        label="Telefone"
        readOnly={readOnly}
        inputMode="numeric"
        variant="half-left"
        mask={(input) =>
          unmaskDigits(input)
            .slice(0, 11)
            .replace(
              /(\d{1,2})(\d{1,5})(\d{1,4})/gi,
              (_all, one, two, three) => {
                if (three) return `(${one}) ${two}-${three}`;
                if (two) return `(${one}) ${two}`;

                return `(${one})`;
              },
            )
        }
        validate={(value) => {
          const trimmed = unmaskDigits(value);

          if (trimmed.length < 10) return "Telefone inválido";

          return true;
        }}
      />

      <InputField
        name="street"
        required={!readOnly}
        id="street"
        label="Logradouro"
        readOnly={readOnly}
        validate={(value) => {
          const trimmed = value.trim();

          if (trimmed.length < 4) return "Logradouro muito curto";
          if (trimmed.length > 140) return "Logradouro muito longo";

          return true;
        }}
      />

      <InputField
        name="number"
        required={!readOnly}
        id="number"
        label="Número"
        readOnly={readOnly}
        inputMode="numeric"
        variant="half-left"
        validate={(value) => (value.trim().length ? true : "Número inválido")}
      />

      <InputField
        name="complement"
        id="complement"
        label="Complemento"
        readOnly={readOnly}
        variant="half-right"
      />

      <InputField
        name="neighborhood"
        required={!readOnly}
        id="neighborhood"
        label="Bairro"
        readOnly={readOnly}
        variant="half-left"
        validate={(value) =>
          value.trim().length ? true : "Bairro inválido"
        }
      />

      <CitiesSelectInput readOnly={readOnly} />
    </>
  );
}