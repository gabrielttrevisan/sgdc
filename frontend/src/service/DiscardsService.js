import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import { Service } from "./Service.js";
import InStockProductsService from "./InStockProductsService.js";

class DiscardsService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Discard[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("discards", { q: query, ...rest });
    } catch {
      return this.internal("Não foi possível carregar os descartes");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<DiscardDetails>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`discards/${id}`);
    } catch {
      return this.internal("Não foi possível carregar o descarte");
    }
  }

  /**
   * @param {DiscardToCreate} discard
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create(discard) {
    try {
      const response = await this.#client.post("discards", discard);

      if (response.data && !response.error) {
        this.#client.invalidate();
        InStockProductsService.invalidate();
      }

      return response;
    } catch {
      return this.internal("Falha ao registrar descarte");
    }
  }
}

/**
 * @typedef {object} Discard
 * @property {number} id
 * @property {string} details
 * @property {string} createdAt
 * @property {number|null} allocationId
 * @property {number} productsDiscarded
 * @property {{id:number,name:string}} createdBy
 */

/**
 * @typedef {object} DiscardDetails
 * @property {number} id
 * @property {string} details
 * @property {string} createdAt
 * @property {{id:number,name:string}} createdBy
 * @property {{name:string,quantity:number,roomName:string,details:string|null}[]} products
 * @property {{name:string,details:string|null}[]} volunteers
 */

/**
 * @typedef {object} DiscardToCreate
 * @property {string} details
 * @property {{ispInRoomId:number,quantity:number}[]} products
 * @property {{id:number}[]} volunteers
 */

export default new DiscardsService();
