/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_USER_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome inválido ou não fornecido";

      if (typeof value !== "string" || value.trim().length === 0)
        return message;

      const trimmed = value.trim();

      if (!trimmed.match(/^([^0-9\d]{2,}\s[^0-9\d]{1,})$/gu)) return message;

      return true;
    },
  },
  {
    property: "nationalId",
    validator: "nationalId",
  },
  {
    property: "email",
    validator: "email",
  },
  {
    property: "pass",
    validate: (value) => {
      const message = "Senha inválido ou não fornecido";

      if (typeof value !== "string" || value.trim().length === 0)
        return message;

      const trimmed = value.trim();

      if (!/([A-Z])/.test(trimmed)) return message;
      if (!/([0-9])/.test(trimmed)) return message;
      if (!/([!'"@#$%¨&*()\_\-\+={}\[\]^~?\/:;>.<,])/.test(trimmed))
        return message;

      return true;
    },
  },
  {
    property: "roleId",
    validator: "numericId",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_USER_RULES = CREATE_USER_RULES
  .filter((rule) => rule.property !== "nationalId")
  .map((rule) => ({
    ...rule,
    property: rule.property === "pass" ? "newPass" : rule.property,
    required: false,
  }))
  .concat({
    property: "pass",
    required: false,
    validate: (value) =>
      typeof value === "string" && value.trim().length > 0
        ? true
        : "Senha atual inválida ou não fornecida",
  });

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_USERS_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      const sortKey = value;
      const isValidSortKey = ["name", "is-active"].includes(sortKey);

      if (!isValidSortKey) return "Chave de ordenação inválida";

      if (isValidSortKey) {
        if (
          !sortType ||
          typeof sortType !== "string" ||
          sortType.trim().length === 0
        )
          return "Tipo de ordenação não informado";

        if (!["asc", "desc"].includes(sortType))
          return "Tipo de ordenação incompatível com chave de ordenação";
      } else {
        return "Chave de ordenação inválida";
      }

      return true;
    },
  },
];
