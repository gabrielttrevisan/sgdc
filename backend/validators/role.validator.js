/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_ROLE_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome de nível de acesso inválido";

      if (typeof value !== "string") return message;

      const trimmed = value.trim();

      if (
        trimmed.length === 0 ||
        trimmed.length > 64 ||
        !trimmed.match(/^([-A-zÀ-ž\s]+)$/i)
      )
        return message;

      return true;
    },
  },
  {
    property: "permissions",
    validate: (value) => {
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.keys(value).length === 0
      )
        return "Permissões inválidas";

      const hasInvalidPermission = Object.entries(value).some(
        ([resource, actions]) =>
          resource.trim().length === 0 ||
          !Array.isArray(actions) ||
          actions.length === 0 ||
          actions.some(
            (action) => typeof action !== "string" || action.trim().length === 0,
          ),
      );

      return hasInvalidPermission ? "Permissões inválidas" : true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_ROLES_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      const sortKey = value;

      if (sortKey === "name") {
        if (!sortType) {
          return `Tipo de ordenação não informado`;
        }

        if (!["asc", "desc"].includes(sortType))
          return `Tipo de ordenação não compatível com chave de ordenação`;
      } else {
        return "Chave de ordenação inválida";
      }

      return true;
    },
  },
];
