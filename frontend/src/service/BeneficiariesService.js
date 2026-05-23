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

import APIClient from "../lib/services/APIClient";

const BENEFICIARIES_MOCK_ID = "beneficiaries";

/** @implements {import("../../global").PaginatableService<Beneficiary>} */
class BeneficiariesService {
  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<Beneficiary[]>>}
   */
  #notFound(message = "Nenhum registro encontrado") {
    return {
      data: null,
      error: {
        code: 404,
        message,
        issues: [],
      },
    };
  }

  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<Beneficiary[]>>}
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

  #client = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<Beneficiary[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("beneficiaries", {
        q: query,
        ...rest,
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async delete(id) {
    try {
      const parsed = this.#getFromLocalStorage();

      if (!parsed || !Array.isArray(parsed))
        return this.#internal("Erro ao obter dados");

      if (!parsed.length) return this.#notFound();

      const filtered = parsed.filter((item) => item.nationalId !== id);

      localStorage.setItem(BENEFICIARIES_MOCK_ID, JSON.stringify(filtered));

      return {
        data: { success: true },
        error: null,
      };
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Beneficiary} beneficiary
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
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

      return {
        data: { success: true },
        error: null,
      };
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Beneficiary} beneficiary
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit(beneficiary) {
    try {
      const parsed = this.#getFromLocalStorage();

      if (!parsed || !Array.isArray(parsed))
        return this.#internal("Erro ao obter dados");

      if (!parsed.length) return this.#notFound();

      const targetIndex = parsed.findIndex(
        (i) => i.nationalId === beneficiary.nationalId,
      );

      if (targetIndex === -1) this.#notFound("Beneficiário não encontrado");

      parsed[targetIndex] = Object.assign({}, parsed[targetIndex], beneficiary);

      localStorage.setItem(BENEFICIARIES_MOCK_ID, JSON.stringify(parsed));

      return {
        data: { success: true },
        error: null,
      };
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new BeneficiariesService();
