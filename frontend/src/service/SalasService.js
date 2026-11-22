import CachedAPIClient from "../lib/client/CachedAPIClient";
import { Service } from "./Service";

/** @typedef {Object} Sala
 * @prop {number} id
 * @prop {string} nome
 * @prop {number} capacidade
 * @prop {string|null} descricao
 */

/** @implements {import("../global").PaginatableService<Sala>} */
class SalasService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Sala>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("salas", {
        q: query,
        ...rest,
      });
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<Sala>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`salas/${id}`);
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async delete(id) {
    try {
      return await this.#client.delete(`salas/${id}`);
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {{nome: string, capacidade: number, descricao?: string}} sala
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async create({ nome, capacidade, descricao }) {
    try {
      return await this.#client.post("salas", {
        nome: nome.trim(),
        capacidade: Number(capacidade),
        descricao: descricao?.trim() ?? "",
      });
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {{id: number|string, nome: string, capacidade: number, descricao?: string}} sala
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async edit({ id, nome, capacidade, descricao }) {
    try {
      return await this.#client.patch(`salas/${id}`, {
        nome: nome.trim(),
        capacidade: Number(capacidade),
        descricao: descricao?.trim() ?? "",
      });
    } catch {
      return this.internal("Erro inesperado");
    }
  }
}

export default new SalasService();
