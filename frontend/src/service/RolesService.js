import APIClient from "../lib/client/APIClient";
import { Service } from "./Service";

/**
 * @typedef {Object} Role
 * @prop {int} id
 * @prop {string} name
 */

class RolesService extends Service {
  #client = new APIClient();

  /**
   * @param {string|null} state
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Role>>}
   */
  async list(state) {
    try {
      const response = await this.#client.get("roles", {
        perPage: 40,
        ...(state ? { q: state } : {}),
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }
}

export default new RolesService();
