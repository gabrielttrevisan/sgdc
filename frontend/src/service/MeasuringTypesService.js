import APIClient from "../lib/services/APIClient";

/**
 * @typedef {Object} MeasuringUnit
 * @prop {number} id
 * @prop {string} name
 * @prop {string} symbol
 */

/** @implements {import("../global").PaginatableService<MeasuringUnit>} */
class MeasuringUnitsService {
  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<MeasuringUnit[]>>}
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

  #client = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<MeasuringUnit[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("measuring-units", {
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
      const response = await this.#client.delete(`measuring-units/${id}`);

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {MeasuringUnit} measuringUnit
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({ name, symbol }) {
    try {
      const response = await this.#client.post("measuring-units", {
        name: name.trim(),
        symbol: symbol.trim(),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {MeasuringUnit} measuringUnit
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({ id, name, symbol }) {
    try {
      const response = await this.#client.patch(`measuring-units/${id}`, {
        name: name.trim(),
        symbol: symbol.trim(),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new MeasuringUnitsService();
