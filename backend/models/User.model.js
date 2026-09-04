import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";
import RecordReferenceError from "../exception/RecordReferenceError.js";
import sql from "./core/sql.js";
import bcrypt from "bcryptjs";

export default class UserModel {
  /**
   * @param {User} user
   * @param {import("../global.js").IAuthContext} authContext
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ nationalId, email, name, pass, userName, roleId }, auth) {
    try {
      const hash = await bcrypt.hash(pass, 10);

      const created = await sql.exec`
            INSERT INTO USERS
                (EMAIL, CPF, NAME, ROLE_ID, USER_NAME, PASS, CREATED_BY, UPDATED_BY)
            VALUES 
                (${email}, ${nationalId}, ${name}, ${roleId},
                 ${userName}, ${hash}, ${auth.userId}, ${auth.userId})
          `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      if (error instanceof Error && "code" in error) {
        if (error.code === "ER_DUP_ENTRY") {
          if (/CPF/i.test(error.message))
            return [
              false,
              new DuplicatedFieldError("CPF", "usuário", { cause: error }),
            ];

          if (/EMAIL/i.test(error.message))
            return [
              false,
              new DuplicatedFieldError("e-mail", "usuário", { cause: error }),
            ];

          return [
            false,
            new DuplicatedFieldError("nome de usuário", "usuário", {
              cause: error,
            }),
          ];
        }

        if (error.code === "ER_NO_REFERENCED_ROW") {
          return [
            false,
            new RecordReferenceError("perfil de usuário", { cause: error }),
          ];
        }

        return [false, error];
      }

      return [false, error];
    }
  }

  
}

/**
 * @typedef {Object} User
 * @prop {string} name
 * @prop {string} email
 * @prop {string} nationalId
 * @prop {string} userName
 * @prop {string} pass
 * @prop {number} roleId
 */
