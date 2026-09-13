import sql from "./core/sql.js";
import RecordNotFoundError from "../exception/RecordNotFoundError.js";
import UserCredentialMismatchError from "../exception/UserCredentialMismatchError.js";
import InactiveRoleError from "../exception/InactiveRoleError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";

export default class AuthModel {
  /**
   * @param {number} userId
   * @param {string} pass
   * @returns {Promise<[boolean, null] | [null, Error]>}
   */
  static async checkPassword(userId, pass) {
    try {
      const [foundUser] = await sql.query`
        SELECT PASS AS pass
        FROM USERS
        WHERE ID = ${userId}
      `.run();

      if (!foundUser) return [null, new RecordNotFoundError("usuário")];

      return [await bcrypt.compare(pass, foundUser.pass), null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {User} user
   * @returns {Promise<[null, Error] | [AuthToken, null]>}
   */
  static async signIn({ user, pass }) {
    try {
      const [foundUser] = await sql.query`
            SELECT
              U.pass, U.id, U.name,
              R.permissions, R.deleted_at AS role_deleted_at, U.role_id
            FROM users U
              INNER JOIN roles R
                ON R.ID = U.ROLE_ID
            WHERE
                USER_NAME = ${user} OR
                EMAIL = ${user} OR
                CPF = ${user}
        `.run();

      if (!foundUser) return [null, new RecordNotFoundError("usuário")];

      const isCredentialsOk = await bcrypt.compare(pass, foundUser.pass);

      if (!isCredentialsOk) return [null, new UserCredentialMismatchError()];

      if (foundUser.role_deleted_at)
        return [null, new InactiveRoleError()];

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        roleId: foundUser.role_id,
      };

      return [
        {
          token: jwt.sign({ user: userData }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
          }),
          user: userData,
          permissions: foundUser.permissions,
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
 * @typedef {Object} UserData
 * @prop {string} name
 * @prop {number} id
 * @prop {number} roleId
 */

/**
 * @typedef {Object} AuthToken
 * @prop {string} token
 * @prop {UserData} user
 * @prop {Record<string, string[]>} permissions
 */
