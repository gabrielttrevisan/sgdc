import sql from "./core/sql.js";
import RecordNotFoundError from "../exception/RecordNotFoundError.js";
import UserCredentialMismatchError from "../exception/UserCredentialMismatchError.js";
import InactiveRoleError from "../exception/InactiveRoleError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import bcrypt from "bcryptjs";
import { RandID } from "../lib/RandID.js";

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
                U.DELETED_AT IS NULL AND
                (USER_NAME = ${user} OR EMAIL = ${user} OR CPF = ${user})
        `.run();

      if (!foundUser) return [null, new RecordNotFoundError("usuário")];

      const isCredentialsOk = await bcrypt.compare(pass, foundUser.pass);

      if (!isCredentialsOk) return [null, new UserCredentialMismatchError()];

      if (foundUser.role_deleted_at) return [null, new InactiveRoleError()];

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

  /**
   * @param {string} user
   * @returns {Promise<[{email: string, token: string}, null] | [null, null] | [null, Error]>}
   */
  static async generateRecoveryToken(user) {
    try {
      const [foundUser] = await sql.query`
        SELECT ID AS id, EMAIL AS email
        FROM USERS
        WHERE
          DELETED_AT IS NULL AND
          (EMAIL = ${user} OR CPF = ${user} OR USER_NAME = ${user})
        LIMIT 1
      `.run();

      if (!foundUser) return [null, null];

      const token = new RandID(16);
      const result = await sql.exec`
        UPDATE USERS
        SET RECOVERY_TOKEN = ${token},
            RECOVERY_TOKEN_GENERATED_AT = CURRENT_TIMESTAMP
        WHERE ID = ${foundUser.id}
      `.run();

      if (result.affectedRows !== 1) {
        return [null, new Error("Falha ao salvar o token de recuperação")];
      }

      return [{ email: foundUser.email, token }, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {{cpf: string, token: string, pass: string}} recovery
   * @returns {Promise<[boolean, null] | [null, Error]>}
   */
  static async resetPassword({ cpf, token, pass }) {
    try {
      const hashedPassword = await bcrypt.hash(pass, 10);
      const result = await sql.exec`
        UPDATE USERS
        SET PASS = ${hashedPassword},
            RECOVERY_TOKEN = NULL,
            RECOVERY_TOKEN_GENERATED_AT = NULL
        WHERE CPF = ${cpf}
          AND RECOVERY_TOKEN = ${token}
          AND RECOVERY_TOKEN_GENERATED_AT >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)
          AND DELETED_AT IS NULL
      `.run();

      return [result.affectedRows === 1, null];
    } catch (error) {
      return [null, error];
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
