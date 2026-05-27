/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const IDENTIFY_PARAM_RULES = [
  {
    property: "id",
    validator: "numericId",
    validatorErrorMessage: "Identificador não fornecido ou inválido",
  },
];
