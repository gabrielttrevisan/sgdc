import CachedAPIClient from "../lib/client/CachedAPIClient.js";
import { Service } from "./Service.js";

class GoalsService extends Service {
  #client = new CachedAPIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../global").PageData<Goal[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      return await this.#client.get("goals", { q: query, ...rest });
    } catch {
      return this.internal("Não foi possível carregar as metas");
    }
  }

  /**
   * @param {number|string} id
   * @returns {Promise<import("../global").APIResponse<GoalDetails>>}
   */
  async getById(id) {
    try {
      return await this.#client.get(`goals/${id}`);
    } catch {
      return this.internal("Não foi possível carregar a meta");
    }
  }

  /**
   * @param {GoalToCreate} goal
   * @returns {Promise<import("../global").APIResponse<{success:boolean,id:number}>>}
   */
  async create(goal) {
    try {
      return await this.#client.post("goals", {
        ...goal,
        name: goal.name?.trim() || undefined,
        description: goal.description?.trim() || null,
        goal: Number(goal.goal),
        unitId: goal.unitId ? Number(goal.unitId) : null,
        isGlobal: goal.isGlobal === true || goal.isGlobal === "true",
      });
    } catch {
      return this.internal("Não foi possível cadastrar a meta");
    }
  }
}

export default new GoalsService();

/**
 * @typedef {Object} Goal
 * @prop {number} id
 * @prop {string} name
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string} type
 * @prop {number} goal
 * @prop {string} percentage
 */

/**
 * @typedef {Goal & {
 *   description:string|null,
 *   isGlobal:boolean,
 *   unitName:string|null
 * }} GoalDetails
 */

/**
 * @typedef {Object} GoalToCreate
 * @prop {string} [name]
 * @prop {string} [description]
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string|number} goal
 * @prop {string} isGlobal
 * @prop {string} [unitId]
 */
