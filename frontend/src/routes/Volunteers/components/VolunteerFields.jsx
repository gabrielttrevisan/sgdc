import { InputField } from "../../../components/form/input-field/InputField";
import { SelectField } from "../../../components/form/input-field/SelectField";
import { CheckboxField } from "../../../components/form/input-field/CheckboxField";
import { unmaskDigits } from "../../../lib/functions/unmask";

export function VolunteerFields({ readOnly = false }) {
  return (
    <>
      <InputField
        name="name"
        required={!readOnly}
        id="name"
        label="Nome Completo"
        placeholder="Insira seu nome completo"
        readOnly={readOnly}
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();

          if (!trimmed.match(/^([^0-9\d]{2,}\s[^0-9\d]{1,})$/gu)) {
            return "Nome inválido";
          }

          return true;
        }}
      />

      <SelectField
        name="gender"
        id="gender"
        label="Sexo"
        disabled={readOnly}
        options={[
          { label: "Selecione", value: "" },
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
        label="CPF ou RG"
        placeholder="123.456.789-00"
        readOnly={readOnly}
        inputMode="numeric"
        variant="half-right"
        mask={(input) => {
          const digits = unmaskDigits(input).slice(0, 11);

          if (digits.length <= 9) {
            return digits;
          }

          return digits.replace(
            /(\d{1,3})(\d{1,3})(\d{1,3})(\d{1,2})/,
            (_all, one, two, three, four) =>
              four
                ? `${one}.${two}.${three}-${four}`
                : `${one}.${two}.${three}`,
          );
        }}
        validate={(value) => {
          const digits = unmaskDigits(value);

          if (digits.length === 11) {
            return true;
          }

          if (digits.length >= 7 && digits.length <= 9) {
            return true;
          }

          return "CPF ou RG inválido";
        }}
      />

      <InputField
        name="phone"
        required={!readOnly}
        id="phone"
        label="Telefone Principal"
        placeholder="(00) 00000-0000"
        readOnly={readOnly}
        inputMode="numeric"
        variant="half-left"
        mask={(input) => {
          const digits = unmaskDigits(input).slice(0, 11);

          if (digits.length <= 2) {
            return digits;
          }

          if (digits.length <= 7) {
            return digits.replace(
              /(\d{2})(\d+)/,
              "($1) $2",
            );
          }

          return digits.replace(
            /(\d{2})(\d{5})(\d{1,4})/,
            "($1) $2-$3",
          );
        }}
        validate={(value) => {
          const trimmed = unmaskDigits(value);

          if (trimmed.length < 10) {
            return "Telefone inválido";
          }

          return true;
        }}
      />

      <CheckboxField
        name="hasWhatsApp"
        id="hasWhatsApp"
        label="Tem WhatsApp"
        disabled={readOnly}
      />

      <InputField
        name="phoneSecondary"
        required={!readOnly}
        id="phoneSecondary"
        label="Telefone Secundário"
        placeholder="(00) 00000-0000"
        readOnly={readOnly}
        inputMode="numeric"
        variant="half-left"
        mask={(input) => {
          const digits = unmaskDigits(input).slice(0, 11);

          if (digits.length <= 2) {
            return digits;
          }

          if (digits.length <= 7) {
            return digits.replace(/(\d{2})(\d+)/, "($1) $2");
          }

          return digits.replace(
            /(\d{2})(\d{5})(\d{1,4})/,
            "($1) $2-$3",
          );
        }}
      />

      <CheckboxField
        name="hasWhatsApp"
        id="hasWhatsApp"
        label="Tem WhatsApp"
        disabled={readOnly}
      />

      <InputField
        name="street"
        id="street"
        label="Logradouro (Rua)"
        placeholder="Rua, Avenida, etc."
        readOnly={readOnly}
      />

      <InputField
        name="number"
        id="number"
        label="Nº"
        placeholder="0123"
        readOnly={readOnly}
        inputMode="numeric"
      />

      <InputField
        name="complement"
        id="complement"
        label="Complemento"
        placeholder="Casa, Apartamento, etc."
        readOnly={readOnly}
      />

      <InputField
        name="neighborhood"
        id="neighborhood"
        label="Bairro"
        placeholder="Vila, Jardim, etc."
        readOnly={readOnly}
      />

      <SelectField
        name="city"
        id="city"
        label="Cidade"
        disabled={readOnly}
        options={[
          {
            label: "Presidente Prudente",
            value: "Presidente Prudente",
          },
          {
            label: "Álvares Machado",
            value: "Álvares Machado",
          },
          {
            label: "Regente Feijó",
            value: "Regente Feijó",
          },
        ]}
        variant="half-left"
      />

      <SelectField
        name="state"
        id="state"
        label="Estado"
        disabled={readOnly}
        options={[
          {
            label: "São Paulo",
            value: "SP",
          },
        ]}
        variant="half-right"
      />
    </>
  );
}