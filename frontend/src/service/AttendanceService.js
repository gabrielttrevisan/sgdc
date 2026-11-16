import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import BeneficiariesService from "./BeneficiariesService.js";
import FamiliesService from "./FamiliesService.js";
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
      const response = await this.#client.post("attendances", attendance);

      if (response.data && !response.error) {
        BeneficiariesService.invalidate();
        FamiliesService.invalidate();
      }

      return response;
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
      const response = this.#client.put(`attendances/${id}`, {
        details,
        requests,
      });

      if (response.data && !response.error) {
        BeneficiariesService.invalidate();
        FamiliesService.invalidate();
      }

      return response;
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
      const response = await this.#client.patch(`attendances/${id}/cancel`, {
        reason: reason.trim(),
      });

      if (response.data && !response.error) {
        BeneficiariesService.invalidate();
        FamiliesService.invalidate();
      }

      return response;
    } catch {
      return this.internal("Falha ao cancelar atendimento");
    }
  }

  invalidate() {
    this.#client.invalidate();
  }
}

export default new AttendanceService();

/**
 * @typedef {Object} Attendance
 * @prop {number} id
 * @prop {string} details
 * @prop {{id: number, name: string}} beneficiary
 * @prop {boolean} isCancelled
 * @prop {"OPEN"|"PARTIAL"|"CLOSED"} status
 */

/**
 * @typedef {Object} AttendanceDetails
 * @prop {{id: number, details: string, status: "OPEN"|"PARTIAL"|"CLOSED", cancelledAt: string|null}} attendance
 * @prop {{id: number, name: string}} beneficiary
 * @prop {{id: number, name: string}|null} cancelledBy
 * @prop {string|null} cancellationReason
 * @prop {{product: {id: number, name: string}, quantity: number, providedQuantity: number, status: "OPEN"|"PARTIAL"|"CLOSED", inStock: boolean}[]} requestedItems
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
