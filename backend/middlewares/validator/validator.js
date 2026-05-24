import APIResponse from "../../lib/APIResponse.js";
import isNationalIdValid from "../../lib/isNationalIdValid.js";
import unmaskDigits from "../../lib/unmaskDigits.js";
import COMMON_RULES_VALIDATION_CALLBACKS from "./common.js";

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
          const validation = rule.validate(value, target);

          if (typeof validation === "string")
            errorResponse.withIssue("INVALID_FIELD", validation);
          else validFieldCount++;
        } else if (rule.validator) {
          const commomValidator =
            COMMON_RULES_VALIDATION_CALLBACKS[rule.validator];

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
        COMMON_RULES_VALIDATION_CALLBACKS.emptiness(
          value,
          rule.validatorErrorMessage,
        );
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
 * @prop {keyof typeof COMMON_RULES_VALIDATION_CALLBACKS} [validator]
 * @prop {string} [validatorErrorMessage]
 * @prop {ValidationCallback} [validate]
 * @prop {boolean} [required]
 */

/**
 * @callback ValidationCallback
 * @param {string|string[]|number} value
 * @param {Record<string,string[]|string>} target
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

/** @type {RequestValidator} */
export const validateRequest = new Proxy(
  {},
  {
    get(_, property) {
      if (["body", "urlParams", "query"].includes(property)) {
        /** @type {ValidatorOptions} */
        const options = {
          targetKey: property,
          rules: [],
        };

        const builder = {
          withRules(rules) {
            options.rules = rules;
            return builder;
          },
          canHaveNoValidProp() {
            options.atLeastOneProp = false;
            return builder;
          },
          shouldHaveAtLeastOneValidProp(message) {
            options.atLeastOneProp = true;
            options.atLeastOnePropMessage = true;
            return builder;
          },
          canBeEmpty() {
            options.targetRequired = true;
            return builder;
          },
          middleware() {
            return validator(options);
          },
        };

        return () => builder;
      }

      return undefined;
    },
  },
);

/**
 * @typedef {Object} RequestValidator
 * @prop {ValidatorBuilderCallback} body
 * @prop {ValidatorBuilderCallback} urlParams
 * @prop {ValidatorBuilderCallback} query
 */

/**
 * @callback ValidatorBuilderCallback
 * @returns {ValidatorBuilder}
 */

/**
 * @typedef {Object} ValidatorBuilder
 * @prop {ValidatorWithRulesCallback} withRules
 * @prop {ValidatorBuilderCallback} canHaveNoValidProp
 * @prop {ValidatorWithAtLeastOneValidPropCallback} shouldHaveAtLeastOneValidProp
 * @prop {ValidatorBuilderCallback} canBeEmpty
 * @prop {GetValidatorMiddleware} middleware
 */

/**
 * @callback ValidatorWithRulesCallback
 * @param {ValidationRule[]}
 * @returns {ValidatorBuilder}
 */

/**
 * @callback ValidatorBuilderCallback
 * @returns {ValidatorBuilder}
 */

/**
 * @callback ValidatorWithAtLeastOneValidPropCallback
 * @param {string} [message]
 * @returns {ValidatorBuilder}
 */

/**
 * @callback GetValidatorMiddleware
 * @returns {import("express").Handler}
 */
