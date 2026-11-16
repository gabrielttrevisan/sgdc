/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const DETAILS_RULE = {
  property: "details",
  validate(value) {
    if (typeof value !== "string") return "Detalhes do atendimento inválidos";

    const trimmed = value.trim();
    if (trimmed.length < 1 || trimmed.length > 255)
      return "Detalhes devem conter entre 1 e 255 caracteres";

    return true;
  },
};

/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const REQUESTS_RULE = {
  property: "requests",
  required: false,
  validate(value) {
    if (!Array.isArray(value)) return "Produtos solicitados inválidos";

    const productIds = new Set();
    for (const request of value) {
      if (
        !request ||
        typeof request !== "object" ||
        !isPositiveSafeInteger(request.productId) ||
        (request.quantity !== undefined &&
          !isPositiveSafeInteger(request.quantity)) ||
        productIds.has(Number(request.productId))
      )
        return "Produtos solicitados inválidos";

      productIds.add(Number(request.productId));
    }

    return true;
  },
};

function isPositiveSafeInteger(value) {
  return (
    (Number.isSafeInteger(value) ||
      (typeof value === "string" && /^\d+$/.test(value))) &&
    Number.isSafeInteger(Number(value)) &&
    Number(value) > 0
  );
}

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_ATTENDANCE_RULES = [
  {
    property: "familyId",
    validate(value) {
      return isPositiveSafeInteger(value) ? true : "Família inválida";
    },
  },
  {
    property: "responsible",
    validate(value) {
      return isPositiveSafeInteger(value) ? true : "Representante inválido";
    },
  },
  DETAILS_RULE,
  REQUESTS_RULE,
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const UPDATE_ATTENDANCE_RULES = [
  { ...DETAILS_RULE, required: false },
  REQUESTS_RULE,
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CANCEL_ATTENDANCE_RULES = [
  {
    property: "reason",
    validate(value) {
      if (typeof value !== "string") return "Motivo do cancelamento inválido";

      const trimmed = value.trim();
      if (trimmed.length === 0 || trimmed.length > 256)
        return "O motivo deve conter entre 1 e 256 caracteres";

      return true;
    },
  },
];
