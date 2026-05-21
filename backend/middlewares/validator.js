import APIResponse from "../lib/APIResponse.js";
import isNationalIdValid from "../lib/isNationalIdValid.js";
import unmaskDigits from "../lib/unmaskDigits.js";

/**
 *
 * @param {ValidationRule[]} rules
 * @param {"query"|"body"|"params"} [targetKey]
 * @param {boolean} targetRequired
 * @returns {import("express").Handler}
 */
export default function validator(
  rules,
  targetKey = "body",
  targetRequired = true,
) {
  return (req, res, next) => {
    const response = APIResponse.from(res);
    const target = req[targetKey];

    if (targetRequired)
      if (!target) {
        return response
          .badRequest()
          .withIssue(
            ...{
              query: [
                "MISSING_QUERY_PARAMS",
                "Parâmetros query não fornecidos",
              ],
              body: ["MISSING_REQUEST_BODY", "Corpo da requisição inválido"],
              params: ["MISSING_PARAMS", "Parâmetros não fornecidos"],
            }[targetKey],
          )
          .send();
      } else if (!target) next();

    const errorResponse = response.badRequest();

    for (const rule of rules) {
      const value = target[rule.property];

      if (rule.validate) {
        const validation = rule.validate(value);

        if (typeof validation === "string")
          errorResponse.withIssue("INVALID_FIELD", validation);
      } else if (rule.validator) {
        const validator = COMMON_VALIDATION_CALLBACKS[rule.validator];

        if (!validator) continue;

        const validation = validator(value, rule.validatorErrorMessage);

        if (typeof validation === "string")
          errorResponse.withIssue("INVALID_FIELD", validation);
      }
    }

    if (errorResponse.hasIssues) return errorResponse.send();

    next();
  };
}

const COMMON_VALIDATION_CALLBACKS = {
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
};

/**
 * @typedef {Object} ValidationRule
 * @prop {string} property
 * @prop {"nationalId"|"numericId"|"phone"} [validator]
 * @prop {string} [validatorErrorMessage]
 * @prop {ValidationCallback} [validate]
 */

/**
 * @callback ValidationCallback
 * @param {string|string[]} value
 * @returns {true|string}
 */
