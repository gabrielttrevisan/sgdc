import { authStore } from "../store/Auth.store.js";
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
        authStore.signIn(
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

  /**
   * @param {{ user: string }} data
   * @returns {Promise<import("../global").APIResponse<{message: string}>>}
   */
  async requestRecoveryToken({ user }) {
    try {
      const client = new APIClient();
      return await client.post("auth/recovery-token", { user });
    } catch (e) {
      return this.internal("Erro inesperado\n" + (e.message ?? ""));
    }
  }

  /**
   * @param {{ cpf: string; token: string; pass: string; confirmPass: string }} data
   * @returns {Promise<import("../global").APIResponse<{message: string}>>}
   */
  async resetPassword({ cpf, token, pass, confirmPass }) {
    try {
      const client = new APIClient();
      return await client.post("auth/reset-password", {
        cpf,
        token,
        pass,
        confirmPass,
      });
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
