import APIClient from "../lib/services/APIClient";

/**
 * @typedef {Object} FamilyParticipant
 * @prop {int} id
 * @prop {string} name
 * @prop {boolean} isResponsible
 */

/**
 * @typedef {Object} Family
 * @prop {int} id
 * @prop {string} name
 * @prop {FamilyParticipant[]} participants
 */

class FamiliesService {
  #client = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Family>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("families", {
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
      const response = await this.#client.delete(`families/${id}`);

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   *
   * @param {Family} family
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({ id, name, participants }) {
    try {
      const response = await this.#client.patch(`families/${id}`, {
        participants: participants.map(({ key, isResponsible }) => ({
          id: key,
          isResponsible,
        })),
        name,
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<Family[]>>}
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

export default new FamiliesService();
