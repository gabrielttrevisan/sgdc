import sql from "./core/sql.js";
import RecordNotFoundError from "../exception/RecordNotFoundError.js";
import UserCredentialMismatchError from "../exception/UserCredentialMismatchError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";

export default class AuthModel {
  /**
   * @param {User} user
   * @returns {Promise<[null, Error] | [AuthToken, null]>}
   */
  static async signIn({ user, pass }) {
    try {
      const [foundUser] = await sql.query`
            SELECT pass, id, name
            FROM users
            WHERE
                USER_NAME = ${user} OR
                EMAIL = ${user} OR
                CPF = ${user}
        `.run();

      if (!foundUser) return [null, new RecordNotFoundError("usuário")];

      const isCredentialsOk = await bcrypt.compare(pass, foundUser.pass);

      if (!isCredentialsOk) return [null, new UserCredentialMismatchError()];

      const { id, name } = foundUser;

      return [
        {
          token: jwt.sign({ user: { id, name } }, env.JWT_SECRET),
        },
        null,
      ];
    } catch (e) {
      return [null, e];
    }
  }
}

/**
 * @typedef {Object} Auth
 * @prop {string} user
 * @prop {string} pass
 */

/**
 * @typedef {Object} AuthToken
 * @prop {string} token
 */
