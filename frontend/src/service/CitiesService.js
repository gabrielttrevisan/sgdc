import CachedAPIClient from "../lib/client/CachedAPIClient";
import { Service } from "./Service";

/**
 * @typedef {Object} City
 * @prop {int} id
 * @prop {string} name
 * @prop {string} state
 */

class CitiesService extends Service {
  #client = new CachedAPIClient({
    // CRUD isn't implemented for this resource, so it does not need to be updated
    staleTime: CachedAPIClient.STALE_TIME_ONE_WEEK,
  });

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
