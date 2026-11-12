function isPositiveSafeInteger(value) {
  return (
    (Number.isSafeInteger(value) ||
      (typeof value === "string" && /^\d+$/.test(value))) &&
    Number.isSafeInteger(Number(value)) &&
    Number(value) > 0
  );
}

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_DONATION_RULES = [
  {
    property: "beneficiaryId",
    validate: (value) =>
      isPositiveSafeInteger(value) ? true : "Beneficiário inválido",
  },
  {
    property: "responsibleId",
    required: false,
    validate: (value) =>
      value === null || isPositiveSafeInteger(value)
        ? true
        : "Representante inválido",
  },
  {
    property: "attendanceId",
    required: false,
    validate: (value) =>
      value === null || isPositiveSafeInteger(value)
        ? true
        : "Atendimento inválido",
  },
  {
    property: "details",
    validate(value) {
      if (typeof value !== "string") return "Motivo da doação inválido";
      const trimmed = value.trim();
      return trimmed.length > 0 && trimmed.length <= 255
        ? true
        : "O motivo deve conter entre 1 e 255 caracteres";
    },
  },
  {
    property: "items",
    validate(value) {
      if (!Array.isArray(value) || value.length === 0)
        return "Selecione ao menos um produto";

      const ispIds = new Set();
      for (const item of value) {
        if (
          !item ||
          typeof item !== "object" ||
          !isPositiveSafeInteger(item.ispId) ||
          !isPositiveSafeInteger(item.quantity) ||
          ispIds.has(Number(item.ispId))
        )
          return "Produtos da doação inválidos";
        ispIds.add(Number(item.ispId));
      }

      return true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CANCEL_DONATION_RULES = [
  {
    property: "details",
    validate(value) {
      if (typeof value !== "string")
        return "Motivo do cancelamento inválido";
      const trimmed = value.trim();
      return trimmed.length > 0 && trimmed.length <= 255
        ? true
        : "O motivo deve conter entre 1 e 255 caracteres";
    },
  },
];
