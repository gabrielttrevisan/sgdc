import CachedAPIClient from "../lib/client/CachedAPIClient";
import { Service } from "./Service";

class SessionsService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {SessionToCreate} session
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create(session) {
    try {
      return await this.#client.post("sessions", session);
    } catch {
      return this.internal("Erro inesperado");
    }
  }
}

export default new SessionsService();

/**
 * @typedef {Object} SessionToCreate
 * @prop {number} familyId
 * @prop {number} responsible
 * @prop {string} details
 * @prop {{productId: number, quantity?: number}[]} [requests]
 */
