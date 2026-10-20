import APIClient from "../lib/client/APIClient.js";
import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import { Service } from "./Service.js";

/**
 * Converte um valor de `<input type="datetime-local">` para uma data ISO 8601,
 * evitando ambiguidade de fuso horário no envio ao back-end.
 *
 * @param {string} value
 * @returns {string}
 */
function toISOString(value) {
  if (!value) return value;

  const date = new Date(value);

  return isNaN(date.getTime()) ? value : date.toISOString();
}

class AllocationsService extends Service {
  #client = new CachedAPIClient();
  #freshClient = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Allocation>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("allocations", { q: query, ...rest });
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<Allocation>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`allocations/${id}`);
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * Busca a alocação em andamento do voluntário. Retorna `data: null` quando
   * não há alocação vigente no momento atual.
   *
   * @param {number|string} volunteerId
   * @returns {Promise<import("../global").APIResponse<Allocation>>}
   */
  async getCurrent(volunteerId) {
    try {
      return await this.#freshClient.get(`allocations/volunteer/${volunteerId}`);
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {AllocationToCreate} allocation
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({ volunteerId, allocationTypeId, startAt, endAt, notes }) {
    try {
      return await this.#client.post("allocations", {
        volunteerId: Number(volunteerId),
        allocationTypeId: Number(allocationTypeId),
        startAt: toISOString(startAt),
        endAt: toISOString(endAt),
        notes: notes ?? "",
      });
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {AllocationToEdit} allocation
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({ id, allocationTypeId, startAt, endAt, notes }) {
    try {
      return await this.#client.patch(`allocations/${id}`, {
        allocationTypeId: Number(allocationTypeId),
        startAt: toISOString(startAt),
        endAt: toISOString(endAt),
        notes: notes ?? "",
      });
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async delete(id) {
    try {
      return await this.#client.delete(`allocations/${id}`);
    } catch {
      return this.internal("Erro inesperado");
    }
  }
}

export default new AllocationsService();

/**
 * @typedef {Object} Allocation
 * @prop {number} id
 * @prop {number} volunteerId
 * @prop {string} volunteerName
 * @prop {number} allocationTypeId
 * @prop {string} allocationTypeName
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string|null} notes
 */

/**
 * @typedef {Object} AllocationToCreate
 * @prop {number|string} volunteerId
 * @prop {number|string} allocationTypeId
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string} [notes]
 */

/**
 * @typedef {Object} AllocationToEdit
 * @prop {number|string} id
 * @prop {number|string} allocationTypeId
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string} [notes]
 */
