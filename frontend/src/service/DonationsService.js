import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import InStockProductsService from "./InStockProductsService.js";
import AttendanceService from "./AttendanceService.js";
import BeneficiariesService from "./BeneficiariesService.js";
import FamiliesService from "./FamiliesService.js";
import { Service } from "./Service.js";

class DonationsService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Donation[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("donations", { q: query, ...rest });
    } catch {
      return this.internal("Não foi possível carregar doações");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<DonationDetails>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`donations/${id}`);
    } catch {
      return this.internal("Não foi possível carregar a doação");
    }
  }

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
      const response = await this.#client.post("donations", donation);

      if (response.data && !response.error) {
        InStockProductsService.invalidate();
        AttendanceService.invalidate();
        BeneficiariesService.invalidate();
        FamiliesService.invalidate();
      }

      return response;
    } catch {
      return this.internal("Falha ao registrar doação");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async cancel(id, details) {
    try {
      const response = await this.#client.delete(`donations/${id}`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details }),
      });

      if (response.data && !response.error) {
        InStockProductsService.invalidate();
        AttendanceService.invalidate();
        BeneficiariesService.invalidate();
        FamiliesService.invalidate();
      }

      return response;
    } catch {
      return this.internal("Falha ao cancelar doação");
    }
  }
}

export default new DonationsService();

/**
 * @typedef {object} Donation
 * @property {number} id
 * @property {string} details
 * @property {string} createdAt
 * @property {{id:number,name:string}} beneficiary
 * @property {boolean} isCancelled
 */

/**
 * @typedef {object} DonationDetails
 * @property {{id:number,details:string,createdAt:string,cancelledAt:string|null,cancellationDetails:string|null}} donation
 * @property {{id:number,name:string,family:{id:number,name:string}|null}} beneficiary
 * @property {{id:number,name:string}} createdBy
 * @property {{id:number,name:string}|null} cancelledBy
 * @property {{id:number,details:string,attendedAt:string|null,attendee:{id:number,name:string}}|null} attendance
 * @property {{product:{id:number,name:string},quantity:number}[]} items
 */

/**
 * @typedef {object} DonationBatch
 * @property {string} id
 * @property {number} ispId
 * @property {number} roomId
 * @property {string} roomName
 * @property {number} productId
 * @property {string} name
 * @property {string} expiresAt
 * @property {number} count
 */

/**
 * @typedef {object} DonationAttendance
 * @property {number} id
 * @property {string} details
 * @property {"OPEN"|"PARTIAL"|"CLOSED"} status
 * @property {{product:{id:number,name:string},quantity:number,providedQuantity:number,status:"OPEN"|"PARTIAL"|"CLOSED",stock:DonationBatch[]}[]} requestedItems
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
 * @property {number|null} responsibleId
 * @property {number} [attendanceId]
 * @property {string} details
 * @property {{ispId:number,roomId:number,quantity:number}[]} items
 */
