/**
 * @typedef {Object} Beneficiary
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {boolean} hasOpenRequest
 */

const BENEFICIARIES_MOCK_ID = "beneficiaries";

/** @implements {import("../../global").PaginatableService<Beneficiary>} */
class BeneficiariesService {
  constructor() {
    if (!localStorage.getItem(BENEFICIARIES_MOCK_ID))
      localStorage.setItem(
        BENEFICIARIES_MOCK_ID,
        JSON.stringify([
          {
            nationalId: "241.236.019-79",
            name: "Isabel Isis Bernardes",
            hasOpenRequest: true,
          },
          {
            nationalId: "051.161.292-33",
            name: "Julio Juan de Paula",
            hasOpenRequest: true,
          },
          {
            nationalId: "770.129.294-21",
            name: "Marcos Vinicius Cláudio Victor Freitas",
            hasOpenRequest: true,
          },
          {
            nationalId: "629.674.515-09",
            name: "Julia Mariana Lopes",
            hasOpenRequest: false,
          },
          {
            nationalId: "349.292.802-14",
            name: "Ryan Diego Guilherme Ramos",
            hasOpenRequest: false,
          },
          {
            nationalId: "140.476.001-64",
            name: "Nelson Eduardo Rafael Moreira",
            hasOpenRequest: false,
          },
          {
            nationalId: "428.706.224-81",
            name: "Gabriela Emilly Stefany Mendes",
            hasOpenRequest: false,
          },
          {
            nationalId: "314.832.932-54",
            name: "Lucas Enrico Nathan Almeida",
            hasOpenRequest: false,
          },
          {
            nationalId: "746.837.251-93",
            name: "Jaqueline Isabela Liz Martins",
            hasOpenRequest: false,
          },
          {
            nationalId: "491.344.599-52",
            name: "Renan Renan Márcio da Mota",
            hasOpenRequest: false,
          },
          {
            nationalId: "871.100.626-94",
            name: "Enrico Henry Lorenzo da Rocha",
            hasOpenRequest: false,
          },
          {
            nationalId: "468.412.465-78",
            name: "Benjamin José Theo Barros",
            hasOpenRequest: false,
          },
          {
            nationalId: "803.016.236-78",
            name: "Mariana Joana Almeida",
            hasOpenRequest: false,
          },
        ]),
      );
  }

  /**
   * @returns {APIResponse<import("../../components/data-grid/DataGrid").PageData<Beneficiary[]>>}
   */
  #notFound() {
    return {
      data: null,
      error: {
        code: 404,
        message: "Nenhum registro encontrado",
        issues: [],
      },
    };
  }

  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../../components/data-grid/DataGrid").PageData<Beneficiary[]>>}
   */
  #internal(message = "Erro inesperado") {
    return {
      data: null,
      error: {
        code: 500,
        message,
        issues: [],
      },
    };
  }

  /**
   * @param {PaginatedQuery} query
   * @returns {Promise<APIResponse<import("../../components/data-grid/DataGrid").PageData<Beneficiary[]>>>}
   */
  async list(query = { page: 1, perPage: 10 }) {
    try {
      const rawStr = localStorage.getItem(BENEFICIARIES_MOCK_ID);

      if (!rawStr) return this.#notFound();

      const parsed = JSON.parse(rawStr);

      if (!parsed || !Array.isArray(parsed))
        return this.#internal("Erro ao obter dados");

      if (!parsed.length) return this.#notFound();

      const perPage = query.perPage ?? 10;
      const offset = (query.page - 1) * perPage;
      const limit = offset + perPage;
      const page = parsed.slice(offset, limit);

      if (!page || !page.length) return this.#notFound();

      return {
        data: {
          items: page,
          page: query.page,
          totalPages: Math.ceil(parsed.length / perPage),
          totalRecords: parsed.length,
        },
        error: null,
      };
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new BeneficiariesService();
