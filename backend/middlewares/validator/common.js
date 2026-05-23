import isNationalIdValid from "../../lib/isNationalIdValid.js";
import unmaskDigits from "../../lib/unmaskDigits.js";

/**
 * @callback CommonValidatorCallback
 * @param {string|string[]|null|undefined} value
 * @param {string} [customMessage]
 * @returns {true|string}
 */

const COMMON_VALIDATORS = {
  nationalId: (value, customMessage) => {
    const message = customMessage ?? "CPF inválido ou não fornecido";

    if (typeof value !== "string") return message;

    const trimmed = unmaskDigits(value);

    if (trimmed.length !== 11) return message;

    if (!isNationalIdValid(value)) return message;

    return true;
  },
  phone: (value, customMessage) => {
    const message = customMessage ?? "Telefone inválido ou não fornecido";

    if (typeof value !== "string") return message;

    const trimmed = unmaskDigits(value);

    if (![10, 11].includes(trimmed.length)) return message;

    return true;
  },
  numericId: (value, customMessage) => {
    const message = customMessage ?? "Identificador inválido ou não fornecido";

    if (typeof value == "string") {
      const trimmed = value.trim();

      if (!trimmed.length) return message;

      const parsed = parseInt(value);

      if (isNaN(parsed) || parsed < 1) return message;
    } else if (typeof value === "number") {
      const parsed = parseInt(value);

      if (isNaN(parsed) || parsed < 1) return message;
    } else return message;

    return true;
  },
  state: (value, customMessage) => {
    const message = customMessage ?? "Estado inválido ou não fornecido";

    if (typeof value !== "string") return message;

    const trimmed = value.trim();

    if (trimmed.length != 2) return message;

    if (
      !trimmed.match(
        /^(A(?:C|L|P|M)|BA|CE|DF|ES|GO|M(?:A|T|S|G)|P(?:A|B|R|E|I)|R(?:J|N|S|O|R)|S(?:P|C|E)|TO)$/i,
      )
    )
      return message;

    return true;
  },
  emptiness: (value, customMessage) => {
    const message = customMessage ?? "Campo vazio";
    const isEmpty = (v) =>
      v === null ||
      v === undefined ||
      (typeof v === "string" && v.trim().length === 0);

    if (isEmpty(value) || (Array.isArray(value) && value.some(isEmpty)))
      return message;

    return true;
  },
};

export default COMMON_VALIDATORS;
