import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import { Service } from "./Service.js";

/** @implements {import("../global").PaginatableService<Attendance>} */
class AttendanceService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Attendance>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("attendances", { q: query, ...rest });
    } catch {
      return this.internal("Não foi possível carregar atendimentos");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<AttendanceDetails>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`attendances/${id}`);
    } catch {
      return this.internal("Não foi possível carregar atendimento");
    }
  }

  /**
   * @param {AttendanceToCreate} attendance
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async create(attendance) {
    try {
      return await this.#client.post("attendances", attendance);
    } catch {
      return this.internal("Falha ao registrar atendimento");
    }
  }

  /**
   * @param {AttendanceToUpdate} attendance
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async update({ id, details, requests }) {
    try {
      return await this.#client.put(`attendances/${id}`, { details, requests });
    } catch {
      return this.internal("Falha ao atualizar atendimento");
    }
  }

  /**
   * @param {{id: number|string, reason: string}} attendance
   * @returns {Promise<import("../global").APIResponse<{success: boolean}>>}
   */
  async cancel({ id, reason }) {
    try {
      return await this.#client.patch(`attendances/${id}/cancel`, {
        reason: reason.trim(),
      });
    } catch {
      return this.internal("Falha ao cancelar atendimento");
    }
  }
}

export default new AttendanceService();

/**
 * @typedef {Object} Attendance
 * @prop {number} id
 * @prop {string} details
 * @prop {{id: number, name: string}} beneficiary
 * @prop {boolean} isCancelled
 */

/**
 * @typedef {Object} AttendanceDetails
 * @prop {{id: number, details: string, cancelledAt: string|null}} attendance
 * @prop {{id: number, name: string}} beneficiary
 * @prop {{id: number, name: string}|null} cancelledBy
 * @prop {string|null} cancellationReason
 * @prop {{product: {id: number, name: string}, quantity: number, inStock: boolean}[]} requestedItems
 */

/**
 * @typedef {Object} AttendanceToCreate
 * @prop {number} familyId
 * @prop {number} responsible
 * @prop {string} details
 * @prop {{productId: number, quantity?: number}[]} [requests]
 */

/**
 * @typedef {Object} AttendanceToUpdate
 * @prop {number|string} id
 * @prop {string} details
 * @prop {{productId: number, quantity?: number}[]} requests
 */
