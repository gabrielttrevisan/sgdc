import APIResponse from "../../lib/APIResponse.js";
import isNationalIdValid from "../../lib/isNationalIdValid.js";
import unmaskDigits from "../../lib/unmaskDigits.js";
import COMMON_VALIDATORS from "./common.js";

/**
 *
 * @param {ValidatorOptions} options
 * @returns {import("express").Handler}
 */
export default function validator({
  rules,
  targetKey = "body",
  targetRequired = true,
  atLeastOneProp = true,
  atLeastOnePropMessage = "Nenhum parâmetro válido fornecido",
}) {
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
    let validFieldCount = 0;

    const runValidation =
      /**
       * @param {ValidationRule} rule
       * @param {string} value
       */
      (rule, value) => {
        if (rule.validate) {
          const validation = rule.validate(value);

          if (typeof validation === "string")
            errorResponse.withIssue("INVALID_FIELD", validation);
          else validFieldCount++;
        } else if (rule.validator) {
          const commomValidator = COMMON_VALIDATORS[rule.validator];

          if (commomValidator) {
            const validation = commomValidator(
              value,
              rule.validatorErrorMessage,
            );

            if (typeof validation === "string")
              errorResponse.withIssue("INVALID_FIELD", validation);
            else validFieldCount++;
          }
        }
      };

    for (const rule of rules) {
      const value = target[rule.property];
      const required = rule.required ?? true;

      if (required) {
        runValidation(rule, value);
        COMMON_VALIDATORS.emptiness(value, rule.validatorErrorMessage);
      } else if (value !== null && value !== undefined) {
        runValidation(rule, value);
      }
    }

    if (atLeastOneProp && validFieldCount === 0)
      errorResponse.withIssue("EMPTY_PARAMS", atLeastOnePropMessage);

    if (errorResponse.hasIssues) return errorResponse.send();

    next();
  };
}

/**
 * @typedef {Object} ValidationRule
 * @prop {string} property
 * @prop {keyof typeof COMMON_VALIDATORS} [validator]
 * @prop {string} [validatorErrorMessage]
 * @prop {ValidationCallback} [validate]
 * @prop {boolean} [required]
 */

/**
 * @callback ValidationCallback
 * @param {string|string[]} value
 * @returns {true|string}
 */

/**
 * @typedef {Object} ValidatorOptions
 * @prop {ValidationRule[]} rules
 * @prop {"query"|"body"|"params"} [targetKey]
 * @prop {boolean} [targetRequired]
 * @prop {boolean} [atLeastOneProp]
 * @prop {string} [atLeastOnePropMessage]
 */
