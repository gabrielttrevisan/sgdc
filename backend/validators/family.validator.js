/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_OR_EDIT_FAMILY_RULES = [
  {
    property: "name",
    validate(value) {
      if (!value || typeof value !== "string") return "Nome inválido";

      const trimmed = value.trim();

      if (!trimmed.match(/^([0-9a-zÀ-ž-\s]{8,64})$/gi))
        return "Nome deve conter apenas caracteres alfanuméricos e entre 8 e  64 caracteres";

      return true;
    },
  },
  {
    property: "participants",
    validate(value) {
      if (!Array.isArray(value)) return "Membros da família invalidos";

      if (value.length < 2)
        return "Uma família deve ter no mínimo 2 integrantes";

      if (
        value.some(
          (participant) =>
            !participant ||
            typeof participant !== "object" ||
            !("id" in participant) ||
            !participant.id.toString().match(/^[\d]+$/i) ||
            isNaN(parseInt(participant.id)) ||
            !("isResponsible" in participant) ||
            typeof participant.isResponsible !== "boolean",
        )
      )
        return "Membros da família invalidos";

      if (value.every((participant) => !participant.isResponsible))
        return "Uma família deve conter ao menos um responsável";

      return true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_FAMILIES_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      const sortKey = value;

      if (!["name"].includes(sortKey))
        return "Chave de ordenação inválida";

      if (sortKey === "name") {
        if (
          !sortType ||
          typeof sortType !== "string" ||
          sortType.trim().length === 0
        )
          return "Tipo de ordenação não informado";

        if (!["asc", "desc"].includes(sortType))
          return "Tipo de ordenação incompatível com chave de ordenação";
      }

      return true;
    },
  },
];
