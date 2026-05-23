/**
 * @typedef {Object} Beneficiary
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {"m"|"f"|"o"} gender
 * @prop {string} family
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {string} city
 * @prop {string} state
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} APIBeneficiary
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {Gender} gender
 * @prop {string} family
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {City} city
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} City
 * @prop {number} id
 * @prop {string} name
 * @prop {string} state
 */

/**
 * @typedef {Object} Gender
 * @prop {string} id
 * @prop {string} name
 */

/**
 * @typedef {Object} TinyBeneficiary
 * @prop {number} id
 * @prop {string} name
 * @prop {string} nationalId
 * @prop {"sim"|"não"} hasOpenRequest
 */

import { unmaskDigits } from "../lib/functions/unmask";
import APIClient from "../lib/services/APIClient";

/** @implements {import("../../global").PaginatableService<Beneficiary>} */
class BeneficiariesService {
  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<Beneficiary[]>>}
   */
  #internal(message = "Erro inesperado") {
    return {
      data: null,
      error: {
        code: 500,
        message,
        issues: [],
      },
    };
  }

  #client = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<TinyBeneficiary[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("beneficiaries", {
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
      const response = await this.#client.delete(`beneficiaries/${id}`);

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Beneficiary} beneficiary
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({ id: _, phone, nationalId, complement, ...beneficiary }) {
    try {
      const response = await this.#client.post("beneficiaries", {
        ...beneficiary,
        phone: unmaskDigits(phone),
        nationalId: unmaskDigits(nationalId),
        ...(complement === "" ? {} : { complement }),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<APIBeneficiary>>}
   */
  async getById(id) {
    try {
      const response = await this.#client.get(`beneficiaries/${id}`);

      return response;
    } catch (error) {
      console.log(error);
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Beneficiary} beneficiary
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({ id, phone, nationalId, complement, ...beneficiary }) {
    try {
      const response = await this.#client.patch(`beneficiaries/${id}`, {
        ...beneficiary,
        phone: unmaskDigits(phone),
        nationalId: unmaskDigits(nationalId),
        ...(complement === "" ? {} : { complement }),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new BeneficiariesService();
