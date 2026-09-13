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
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("roles", {
        q: query,
        ...rest,
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  async create({ name, description, permissions }) {
    try {
      return await this.#client.post("roles", {
        name: name.trim(),
        description: description?.trim() || undefined,
        permissions,
      });
    } catch {
      return this.internal("Não foi possível cadastrar nível de acesso");
    }
  }
}

export default new RolesService();
