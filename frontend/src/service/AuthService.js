import { auth } from "../store/Auth.store.js";
import APIClient from "../lib/client/APIClient.js";
import { Service } from "./Service.js";

class AuthService extends Service {
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
      return this.internal("Erro inesperado\n" + (e.message ?? ""));
    }
  }
}

export default new AuthService();

/**
 * @typedef {Object} AuthToken
 * @prop {string} token
 * @prop {string} user.id
 * @prop {string} user.name
 */
