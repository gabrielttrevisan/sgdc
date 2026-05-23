import APIClient from "../lib/services/APIClient";

/**
 * @typedef {Object} City
 * @prop {int} id
 * @prop {string} name
 * @prop {string} state
 */

class CitiesService {
  #client = new APIClient();

  /**
   * @param {string|null} state
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<City>>}
   */
  async list(state) {
    try {
      const response = await this.#client.get("cities", {
        perPage: 40,
        ...(state ? { q: state } : {}),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<Beneficiary[]>>}
   */
  #internal(message = "Erro inesperado") {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
        issues: [],
      },
    };
  }
}

export default new CitiesService();
