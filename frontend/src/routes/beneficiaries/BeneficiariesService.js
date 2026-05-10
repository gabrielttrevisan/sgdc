/**
 * @typedef {Object} Beneficiary
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {"m"|"f"|"o"} gender
 * @prop {string} family
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {string} city
 * @prop {string} state
 * @prop {boolean} hasOpenRequest
 */

import { BENEFICIARIES_MOCK } from "./mock";

const BENEFICIARIES_MOCK_ID = "beneficiaries";

/** @implements {import("../../global").PaginatableService<Beneficiary>} */
class BeneficiariesService {
  constructor() {
    if (!localStorage.getItem(BENEFICIARIES_MOCK_ID))
      localStorage.setItem(
        BENEFICIARIES_MOCK_ID,
        JSON.stringify(BENEFICIARIES_MOCK),
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
   * @returns {Beneficiary[]}
   */
  #getFromLocalStorage() {
    const rawStr = localStorage.getItem(BENEFICIARIES_MOCK_ID);

    if (!rawStr) return this.#notFound();

    const parsed = JSON.parse(rawStr);

    return parsed;
  }

  /**
   * @param {import("../../global").PaginatedQuery} query
   * @returns {Promise<APIResponse<import("../../components/data-grid/DataGrid").PageData<Beneficiary[]>>>}
   */
  async list(query = { page: 1, perPage: 10 }) {
    try {
      let parsed = this.#getFromLocalStorage();

      if (!parsed || !Array.isArray(parsed))
        return this.#internal("Erro ao obter dados");

      if (!parsed.length) return this.#notFound();

      if (query.sortBy) {
        const [first] = parsed;
        const type = typeof first[query.sortBy];

        if (type === "number" || type === "bigint")
          parsed = parsed.sort((a, b) => a[query.sortBy] - b[query.sortBy]);
        else if (type === "string")
          parsed = parsed.sort((a, b) =>
            a[query.sortBy]
              .toLowerCase()
              .localeCompare(b[query.sortBy].toLowerCase()),
          );
        else if (type === "boolean")
          parsed = parsed.sort((a) => (a[query.sortBy] ? -1 : 1));
      }

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
          sortBy: query.sortBy,
        },
        error: null,
      };
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  async delete(id) {
    try {
      const parsed = this.#getFromLocalStorage();

      if (!parsed || !Array.isArray(parsed))
        return this.#internal("Erro ao obter dados");

      if (!parsed.length) return this.#notFound();

      const filtered = parsed.filter((item) => item.nationalId !== id);

      localStorage.setItem(BENEFICIARIES_MOCK_ID, JSON.stringify(filtered));
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Beneficiary} beneficiary
   * @returns
   */
  async create(beneficiary) {
    try {
      const parsed = this.#getFromLocalStorage();

      if (!parsed || !Array.isArray(parsed))
        return this.#internal("Erro ao obter dados");

      if (!parsed.length) return this.#notFound();

      parsed.push({
        ...beneficiary,
        hasOpenRequest: Math.random() * 1000 > 901 ? true : false,
      });

      localStorage.setItem(BENEFICIARIES_MOCK_ID, JSON.stringify(parsed));
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new BeneficiariesService();
