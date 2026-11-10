/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_SESSION_RULES = [
  {
    property: "familyId",
    validate(value) {
      if (
        !(
          Number.isSafeInteger(value) ||
          (typeof value === "string" &&
            /^\d+$/.test(value) &&
            Number.isSafeInteger(Number(value)))
        ) ||
        Number(value) < 1
      )
        return "Família inválida";

      return true;
    },
  },
  {
    property: "responsible",
    validate(value) {
      if (
        !(
          Number.isSafeInteger(value) ||
          (typeof value === "string" &&
            /^\d+$/.test(value) &&
            Number.isSafeInteger(Number(value)))
        ) ||
        Number(value) < 1
      )
        return "Representante inválido";

      return true;
    },
  },
  {
    property: "details",
    validate(value) {
      if (typeof value !== "string") return "Detalhes do atendimento inválidos";

      const trimmed = value.trim();

      if (trimmed.length < 1 || trimmed.length > 255)
        return "Detalhes devem conter entre 1 e 255 caracteres";

      return true;
    },
  },
  {
    property: "requests",
    required: false,
    validate(value) {
      if (!Array.isArray(value)) return "Produtos solicitados inválidos";

      const productIds = new Set();
      for (const request of value) {
        if (
          !request ||
          typeof request !== "object" ||
          !Number.isSafeInteger(request.productId) ||
          request.productId < 1 ||
          (request.quantity !== undefined &&
            (!Number.isSafeInteger(request.quantity) || request.quantity < 1)) ||
          productIds.has(request.productId)
        )
          return "Produtos solicitados inválidos";

        productIds.add(request.productId);
      }

      return true;
    },
  },
];
