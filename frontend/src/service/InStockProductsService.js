import CachedAPIClient from "../lib/client/CachedAPIClient";
import { Service } from "./Service";

/** @implements {import("../global").PaginatableService<InStockProduct>} */
class InStockProductsService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<InStockProduct[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("in-stock-products", {
        q: query,
        ...rest,
      });
    } catch {
      return this.internal("Erro ao carregar produtos em estoque");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<InStockProductDetails>>}
   */
  async getById(id) {
    try {
      const response = await this.#client.get(`in-stock-products/${id}`);
      return response;
    } catch {
      return this.internal("Erro ao carregar produto em estoque");
    }
  }
}

/**
 * @typedef {object} InStockProduct
 * @property {number} productId
 * @property {string} name
 * @property {string} expiresAt
 * @property {number} count
 */

/**
 * @typedef {InStockProduct & {
 *   id: number,
 *   productId: number,
 *   rooms: {id: number, name: string, count: number}[],
 *   roomsDescription: string
 * }} InStockProductDetails
 */

export default new InStockProductsService();
