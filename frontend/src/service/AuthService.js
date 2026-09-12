import { auth } from "../store/Auth.store.js";
import APIClient from "../lib/client/APIClient.js";

class AuthService {
  /**
   * @param {{ user: string; pass: string }} user
   * @returns {Promise<import("../global").APIResponse<AuthToken>>}
   */
  async signIn({ user, pass }) {
    try {
      const client = new APIClient();
      /** @type {import("../global").APIResponse<AuthToken>} */
      const response = await client.post("auth/sign-in", { user, pass });

      if (typeof response.data?.token === "string") {
        auth.signIn(
          response.data.token,
          response.data.user.id,
          response.data.user.name,
          response.data.menu,
        );
      }

      return response;
    } catch (e) {
      return this.#internal("Erro inesperado");
    }
  }

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
}

export default new AuthService();

/**
 * @typedef {Object} AuthToken
 * @prop {string} token
 * @prop {string} user.id
 * @prop {string} user.name
 */
