import APIClient from "../lib/client/APIClient";
import { unmaskDigits } from "../lib/functions/unmask";
import { authStore } from "../store/Auth.store";
import { Service } from "./Service";

/**
 * @typedef {Object} City
 * @prop {int} id
 * @prop {string} name
 * @prop {string} state
 */

class UsersService extends Service {
  #client = new APIClient();

  /**
   * @param {import("../global").PaginatedQuery} query
   * @returns {Promise<import("../global").APIResponse<import("../components/data-grid/DataGrid").PageData<User[]>>>}
   */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("users", {
        q: query,
        ...rest,
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<APIUser>>}
   */
  async getById(id) {
    try {
      const response = await this.#client.get(`users/${id}`);

      return response;
    } catch (error) {
      return this.internal("Erro inesperado\n" + (error.message ?? ""));
    }
  }

  /**
   * @param {UnpersistedUser} user
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async create({ cpf, email, name, password, role, username }) {
    try {
      const response = await this.#client.post("users", {
        name: name.trim(),
        pass: password,
        nationalId: unmaskDigits(cpf),
        email: email.trim(),
        roleId: role,
        userName: username.trim(),
      });

      return response;
    } catch {
      return this.internal("Erro inesperado");
    }
  }

  /**
   * @param {EditUser} user
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async edit({ id, email, name, password, newPassword, roleId, username }) {
    try {
      const response = await this.#client.patch(`users/${id}`, {
        email: email.trim(),
        name: name.trim(),
        pass: password || undefined,
        newPass: newPassword || undefined,
        roleId,
        username: username.trim(),
      });
      
      if (authStore.match(id)) {
        authStore.signOut();
      }

      return response;
    } catch {
      return this.internal("Não foi possível atualizar usuário");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async deactivate(id) {
    try {
      const response = await this.#client.patch("users/deactivate/" + id);

      return response;
    } catch {
      return this.internal("Não foi possível desativar usuário");
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<import("../global").APIResponse<{success:boolean}>>}
   */
  async activate(id) {
    try {
      const response = await this.#client.patch("users/activate/" + id);

      return response;
    } catch {
      return this.internal("Não foi possível reativar usuário");
    }
  }
}

export default new UsersService();

/**
 * @typedef {Object} UserRole
 * @prop {number} id
 * @prop {string} name
 */

/**
 * @typedef {Object} User
 * @prop {string} name
 * @prop {string} username
 * @prop {number} isActive
 * @prop {number} id
 * @prop {UserRole} role
 */

/**
 * @typedef {Object} UnpersistedUser
 * @prop {string} name
 * @prop {string} username
 * @prop {string} email
 * @prop {string} cpf
 * @prop {number} role
 * @prop {string} password
 */
/**
 * @typedef {Object} EditUser
 * @prop {string} id
 * @prop {string} name
 * @prop {string} username
 * @prop {string} email
 * @prop {number} roleId
 * @prop {string} [password]
 * @prop {string} [newPassword]
 */

/**
 * @typedef {Object} APIUser
 * @prop {string} name
 * @prop {string} username
 * @prop {string} email
 * @prop {number} roleId
 */
