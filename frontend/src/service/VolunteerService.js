/**
 * @typedef {Object} Volunteer
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {string} phoneSecondary
 * @prop {"m"|"f"|"o"} gender
 * @prop {boolean} hasWhatsApp
 * @prop {boolean} hasWhatsAppSecondary
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {string} city
 * @prop {string} state
 */

/**
 * @typedef {Object} APIVolunteer
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {string} phoneSecondary
 * @prop {Gender} gender
 * @prop {boolean} hasWhatsApp
 * @prop {boolean} hasWhatsAppSecondary
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {City} city
 * @prop {string} state
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

import { unmaskDigits } from "../lib/functions/unmask";
import APIClient from "../lib/client/APIClient";

class VolunteerService {
  /**
   * @param {string} [message]
   * @returns {import("../global").APIResponse<null>}
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
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<Volunteer[]>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("volunteers", {
        q: query,
        ...rest,
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<APIVolunteer>>}
   */
  async getById(id) {
    try {
      const response = await this.#client.get(`volunteers/${id}`);

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Volunteer} volunteer
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({
    id: _,
    phone,
    phoneSecondary,
    nationalId,
    complement,
    ...volunteer
  }) {
    try {
      const response = await this.#client.post("volunteers", {
        ...volunteer,
        phone: unmaskDigits(phone),
        phoneSecondary: unmaskDigits(phoneSecondary),
        nationalId: unmaskDigits(nationalId),
        ...(complement === "" ? {} : { complement }),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {Volunteer} volunteer
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({
    id,
    phone,
    phoneSecondary,
    nationalId,
    complement,
    ...volunteer
  }) {
    try {
      const response = await this.#client.patch(`volunteers/${id}`, {
        ...volunteer,
        phone: unmaskDigits(phone),
        phoneSecondary: unmaskDigits(phoneSecondary),
        nationalId: unmaskDigits(nationalId),
        ...(complement === "" ? {} : { complement }),
      });

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async delete(id) {
    try {
      const response = await this.#client.delete(`volunteers/${id}`);

      return response;
    } catch {
      return this.#internal("Erro inesperado");
    }
  }
}

export default new VolunteerService();