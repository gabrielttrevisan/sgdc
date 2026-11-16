const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const TEN_HOURS_IN_MS = 10 * 60 * 60 * 1000;
const NOTES_MAX_LENGTH = 255;
const ALLOWED_SORT_KEYS = ["start", "volunteer"];

/**
 * @param {unknown} value
 * @returns {number|null}
 */
function parseDateTime(value) {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  const parsed = Date.parse(value);

  return isNaN(parsed) ? null : parsed;
}

/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const VOLUNTEER_RULE = {
  property: "volunteerId",
  validate: (value) => {
    const parsed = parseInt(value);

    if (isNaN(parsed) || parsed < 1) return "Voluntário inválido";

    return true;
  },
};

/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const ALLOCATION_TYPE_RULE = {
  property: "allocationTypeId",
  validate: (value) => {
    const parsed = parseInt(value);

    if (isNaN(parsed) || parsed < 1) return "Tipo de alocação inválido";

    return true;
  },
};

/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const START_AT_RULE = {
  property: "startAt",
  validate: (value) => {
    const start = parseDateTime(value);

    if (start === null) return "Data e hora de início inválidas";

    if (start < Date.now() - THIRTY_DAYS_IN_MS)
      return "A data de início não pode ser anterior a 30 dias";

    return true;
  },
};

/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const END_AT_RULE = {
  property: "endAt",
  validate: (value, target) => {
    const end = parseDateTime(value);

    if (end === null) return "Data e hora de término inválidas";

    const start = parseDateTime(target.startAt);

    if (start === null) return true;

    if (end <= start)
      return "A data de término deve ser posterior à data de início";

    if (end - start > TEN_HOURS_IN_MS)
      return "A duração da alocação não pode exceder 10 horas";

    return true;
  },
};

/** @type {import("../middlewares/validator/validator.js").ValidationRule} */
const NOTES_RULE = {
  property: "notes",
  required: false,
  validate: (value) => {
    if (value === null || value === undefined) return true;

    if (typeof value !== "string") return "Observações inválidas";

    if (value.length > NOTES_MAX_LENGTH)
      return `As observações devem ter no máximo ${NOTES_MAX_LENGTH} caracteres`;

    return true;
  },
};

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_ALLOCATION_RULES = [
  VOLUNTEER_RULE,
  ALLOCATION_TYPE_RULE,
  START_AT_RULE,
  END_AT_RULE,
  NOTES_RULE,
];

/**
 * Na edição o voluntário é imutável, portanto ele não é validado no corpo.
 *
 * @type {import("../middlewares/validator/validator.js").ValidationRule[]}
 */
export const EDIT_ALLOCATION_BODY_RULES = [
  ALLOCATION_TYPE_RULE,
  START_AT_RULE,
  END_AT_RULE,
  NOTES_RULE,
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_ALLOCATIONS_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (
        !value ||
        typeof value !== "string" ||
        value.trim().length === 0
      )
        return "Chave de ordenação inválida";

      if (!ALLOWED_SORT_KEYS.includes(value))
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      if (!sortType) return "Tipo de ordenação não informado";

      if (!["asc", "desc"].includes(sortType))
        return "Tipo de ordenação não compatível";

      return true;
    },
  },
];
