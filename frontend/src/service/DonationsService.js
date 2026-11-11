import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import { Service } from "./Service.js";

class DonationsService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {number|string} beneficiaryId
   * @returns {Promise<import("../global").APIResponse<DonationContext>>}
   */
  async getBeneficiaryContext(beneficiaryId) {
    try {
      return await this.#client.get(`donations/context/${beneficiaryId}`);
    } catch {
      return this.internal("Não foi possível carregar os dados para a doação");
    }
  }

  /**
   * @param {DonationToCreate} donation
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create(donation) {
    try {
      return await this.#client.post("donations", donation);
    } catch {
      return this.internal("Falha ao registrar doação");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async cancel(id) {
    try {
      return await this.#client.delete(`donations/${id}`);
    } catch {
      return this.internal("Falha ao cancelar doação");
    }
  }
}

export default new DonationsService();

/**
 * @typedef {object} DonationBatch
 * @property {number} id
 * @property {number} productId
 * @property {string} name
 * @property {string} expiresAt
 * @property {number} count
 */

/**
 * @typedef {object} DonationAttendance
 * @property {number} id
 * @property {string} details
 * @property {{product:{id:number,name:string},quantity:number,stock:DonationBatch[]}[]} requestedItems
 */

/**
 * @typedef {object} DonationContext
 * @property {{id:number,name:string}} beneficiary
 * @property {{id:number,name:string}|null} family
 * @property {{id:number,name:string}[]} representatives
 * @property {DonationAttendance[]} attendances
 */

/**
 * @typedef {object} DonationToCreate
 * @property {number} beneficiaryId
 * @property {number} responsibleId
 * @property {number} [attendanceId]
 * @property {string} details
 * @property {{ispId:number,quantity:number}[]} items
 */
