import { authStore } from "../store/Auth.store";

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

<<<<<<< HEAD
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
=======
const BASE_URL = "http://localhost:3004";

export const VolunteerService = {
  /**
   * @param {string} query
   * @param {string} sortKey
   * @param {string} sortType
   * @returns {Promise<Volunteer[]>}
   */
  async getAll(query = "", sortKey = "name", sortType = "asc") {
    const params = new URLSearchParams();

    if (query.trim()) params.append("q", query.trim());
    if (sortKey) params.append("sortKey", sortKey);
    if (sortType) params.append("sortType", sortType);

    const url = `${BASE_URL}/volunteers?${params.toString()}`;
    const response = await fetch(url, { headers: authStore.getHeaders() });

    if (!response.ok) throw new Error("Erro ao buscar voluntários");

    const json = await response.json();
    return json.data.items;
  },
>>>>>>> origin/main

/**
 * @typedef {Object} Gender
 * @prop {string} id
 * @prop {string} name
 */

import { unmaskDigits } from "../lib/functions/unmask";
import APIClient from "../lib/client/APIClient";

class VolunteerService {
  /**
<<<<<<< HEAD
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
=======
   * @param {Volunteer} volunteer
   * @returns {Promise<any>}
   */
  async save(volunteer) {
    const cleanedData = {
      ...volunteer,
      nationalId: volunteer.nationalId
        ? volunteer.nationalId.replace(/\D/g, "")
        : "",
      phone: volunteer.phone ? volunteer.phone.replace(/\D/g, "") : "",
      phoneSecondary: volunteer.phoneSecondary
        ? volunteer.phoneSecondary.replace(/\D/g, "")
        : "",
      gender:
        !volunteer.gender || volunteer.gender === "Selecione"
          ? "o"
          : volunteer.gender,
    };

    const isEdit = !!cleanedData.id;
    const url = isEdit
      ? `${BASE_URL}/volunteers/${cleanedData.id}`
      : `${BASE_URL}/volunteers`;
    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...authStore.getHeaders(),
>>>>>>> origin/main
      },
    };
  }

  #client = new APIClient();

  /**
<<<<<<< HEAD
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
=======
   * @param {number|string} id
   * @returns {Promise<any>}
   */
  async delete(id) {
    const response = await fetch(`${BASE_URL}/volunteers/${id}`, {
      method: "DELETE",
      headers: authStore.getHeaders(),
    });

    if (!response.ok) throw new Error("Erro ao deletar voluntário");

    return await response.json();
  },
};
>>>>>>> origin/main
