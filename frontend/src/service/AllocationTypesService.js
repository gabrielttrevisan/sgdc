import APIClient from "../lib/services/APIClient";

/**
 * @typedef {Object} AllocationType
 * @prop {number} id
 * @prop {string} name
 * @prop {string} description
 */

/** @implements {import("../global").PaginatableService<AllocationType>} */
class AllocationTypesService {
  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<AllocationType[]>>}
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
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<AllocationType[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("allocation-types", {
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
      const response = await this.#client.delete(`allocation-types/${id}`);

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {AllocationType} allocationType
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({ name, description }) {
    try {
      const response = await this.#client.post("allocation-types", {
        name: name.trim(),
        description: description.trim(),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {AllocationType} allocationType
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({ id, name, description }) {
    try {
      const response = await this.#client.patch(`allocation-types/${id}`, {
        name: name.trim(),
        description: description.trim(),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new AllocationTypesService();
