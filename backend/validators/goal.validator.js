const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_GOAL_RULES = [
  {
    property: "startAt",
    validate: (value) =>
      isValidDate(value) ? true : "Informe uma data de início válida",
  },
  {
    property: "endAt",
    validate: (value, target) => {
      if (!isValidDate(value)) return "Informe uma data de término válida";
      if (isValidDate(target.startAt) && value < target.startAt)
        return "A data de término deve ser igual ou posterior à data de início";

      return true;
    },
  },
  {
    property: "goal",
    validate: (value) => {
      const parsed = Number(value);
      return Number.isSafeInteger(parsed) && parsed > 0
        ? true
        : "A meta deve ser um número inteiro maior que zero";
    },
  },
  {
    property: "name",
    required: false,
    validate: (value) =>
      typeof value === "string" && value.trim().length <= 128
        ? true
        : "O nome deve ter no máximo 128 caracteres",
  },
  {
    property: "description",
    required: false,
    validate: (value) =>
      typeof value === "string" && value.length <= 128
        ? true
        : "A descrição deve ter no máximo 128 caracteres",
  },
  {
    property: "unitId",
    required: false,
    validate: (value) => {
      const parsed = Number(value);
      return Number.isSafeInteger(parsed) && parsed > 0
        ? true
        : "Unidade de medida inválida";
    },
  },
  {
    property: "isGlobal",
    required: false,
    validate: (value) =>
      value === true || value === false || value === "true" || value === "false"
        ? true
        : "Tipo de meta inválido",
  },
];
