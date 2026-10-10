import APIClient from "../lib/client/APIClient";

/**
 * @typedef {Object} Bill
 * @prop {number} id
 * @prop {string} dueDate
 * @prop {string} description
 * @prop {number} value
 * @prop {"PAID"|"UNPAID"|"CANCELED"|"EXTENDED"} status
 */

/**
 * @typedef {Object} BillToCreate
 * @prop {Date} dueDate
 * @prop {string} description
 * @prop {number} value
 */

/**
 * @typedef {Object} BillToCancelAndCopy
 * @prop {Date} dueDate
 * @prop {string} description
 * @prop {number} value
 * @prop {number} id
 * @prop {string} cancelationDetails
 */

/**
 * @typedef {Object} BillToExtend
 * @prop {Date} newDueDate
 * @prop {string} details
 * @prop {number} id
 */

/**
 * @typedef {Object} BillToCancel
 * @prop {string} details
 * @prop {number} id
 */

/** @implements {import("../global").PaginatableService<Bill>} */
class BillsService {
  #client = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Bill>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("bills", { q: query, ...rest });
    } catch {
      return {
        data: null,
        error: {
          code: 500,
          message: "Erro inesperado",
          issues: [],
        },
      };
    }
  }

  /**
   * @param {BillToCreate} bill
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({ description, value, dueDate: d }) {
    try {
      const trimmedDesc = description.trim();
      const dueDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${(d.getDate() + 1).toString().padStart(2, "0")}`;

      const response = await this.#client.post("bills", {
        description: trimmedDesc,
        dueDate,
        value: parseFloat(value),
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {BillToCancelAndCopy} bill
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async cancelAndCopy({
    description,
    value,
    dueDate: d,
    id,
    cancelationDetails,
  }) {
    try {
      const trimmedDesc = description.trim();
      const dueDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${(d.getDate() + 1).toString().padStart(2, "0")}`;

      const response = await this.#client.post(`bills/${id}/cancel-and-copy`, {
        description: trimmedDesc,
        dueDate,
        value: parseFloat(value),
        cancelationDetails,
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {string} billId
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async pay(billId) {
    try {
      const response = await this.#client.patch("bills/" + billId);

      return [response, null];
    } catch {
      return this.internal("Erro inesperado");
    }
  }

   /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<FullBill>>}
   */
  async getById(id) {
    try {
      const response = await this.#client.get(`bills/${id}`);

      return response;
    } catch (error) {
      return this.internal("Erro inesperado\n" + (error.message ?? ""));
    }
  }

  /**
   * @param {BillToExtend} bill
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async extend({ details, newDueDate: d, id }) {
    try {
      const trimmedDetails = details.trim();
      const newDueDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${(d.getDate() + 1).toString().padStart(2, "0")}`;

      const response = await this.#client.patch("bills/" + id + "/extend", {
        details: trimmedDetails,
        newDueDate,
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {BillToCancel} bill
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async cancel({ details, id }) {
    try {
      const trimmedDetails = details.trim();
      const response = await this.#client.patch("bills/" + id + "/cancel", {
        details: trimmedDetails,
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }
}

export default new BillsService();

/**
 * @typedef {Object} BillCancelation
 * @prop {string} at
 * @prop {import("../global.js").User} byUser
 * @prop {string} details
 */

/**
 * @typedef {Object} BillExtension
 * @prop {string} at
 * @prop {import("../global.js").User} byUser
 * @prop {string} details
 * @prop {string} from
 */

/**
 * @typedef {Object} FullBill
 * @prop {number} id
 * @prop {string} dueDate
 * @prop {number} value
 * @prop {string} description
 * @prop {import("../global.js").UserTimestamp} created
 * @prop {import("../global.js").UserTimestamp|null} paid
 * @prop {BillCancelation|null} canceled
 * @prop {BillExtension|null} extended
 */
