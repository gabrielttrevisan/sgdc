import APIClient from "../lib/client/APIClient";
import { Service } from "./Service";

/**
 * @typedef {Object} Role
 * @prop {int} id
 * @prop {string} name
 * @prop {string|null} description
 */

class RolesService extends Service {
  #client = new APIClient();

  /**
   * @param {{filter?: "inactive", query?: string, page?: number, perPage?: number}} [query]
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Role>>}
   */
  async list(
    { query, filter = "inactive", ...rest } = { page: 1, perPage: 10 },
  ) {
    try {
      const response = await this.#client.get("roles", {
        q: query,
        filter,
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

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<Role>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`roles/${id}`);
    } catch {
      return this.internal("Não foi possível carregar nível de acesso");
    }
  }

  async edit({ id, name, description, permissions }) {
    try {
      return await this.#client.patch(`roles/${id}`, {
        name: name.trim(),
        description: description?.trim() || undefined,
        permissions,
      });
    } catch {
      return this.internal("Não foi possível editar nível de acesso");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async delete(id) {
    try {
      return await this.#client.delete(`roles/${id}`);
    } catch {
      return this.internal("Não foi possível deletar nível de acesso");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async restore(id) {
    try {
      return await this.#client.patch(`roles/activate/${id}`);
    } catch {
      return this.internal("Não foi possível reativar nível de acesso");
    }
  }
}

export default new RolesService();
