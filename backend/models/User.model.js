import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";
import PasswordChangeMatchError from "../exception/PasswordChangeMatchError.js";
import RecordReferenceError from "../exception/RecordReferenceError.js";
import sql from "./core/sql.js";
import bcrypt from "bcryptjs";

export default class UserModel {
  /**
   * @param {FindAllUsersFilter} [filter]
   * @returns {Promise<[PersistedUser[], null] | [null, Error]>}
   */
  static async findAll({
    query,
    sortKey,
    sortType,
    page = 1,
    perPage = 10,
  } = {}) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE U.NAME LIKE ${likeQuery} OR U.CPF LIKE ${likeQuery} OR U.EMAIL LIKE ${likeQuery} OR U.USER_NAME LIKE ${likeQuery}`
        : sql.empty;
      const orderByColumn = sortKey === "name" ? sql`U.NAME` : sql.empty;
      const orderBySorting =
        sortKey === "name" ? sql.str(sortType.toUpperCase()) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${sql.join(",", orderByColumn.isEmpty ? sql.empty : sql.join(" ", orderByColumn, orderBySorting), sql`IS_ACTIVE ASC`)}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[QueriedUser[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT
                U.NAME, U.USER_NAME, U.ID,
                U.ROLE_ID, R.NAME AS ROLE_NAME,
                CASE
                  WHEN DELETED_AT IS NULL THEN 1
                  ELSE 0
                END AS IS_ACTIVE
              FROM USERS U
                INNER JOIN ROLES R ON R.ID = U.ROLE_ID
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM USERS U
          ${whereClause}`.run(),
      ]);

      const users = data.map((datum) => {
        /** @type {PersistedUser} */
        const user = {
          id: datum.ID,
          name: datum.NAME,
          isActive: datum.IS_ACTIVE === 1,
          username: datum.USER_NAME,
          role: {
            id: datum.ROLE_ID,
            name: datum.ROLE_NAME,
          },
        };

        return user;
      });

      return [
        {
          items: users,
          totalRecords: total,
          page,
          totalPages: Math.ceil(total / perPage),
          query,
          sortKey,
          sortType,
        },
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<PersistedUser>}
   */
  static async findById(id) {
    try {
      /** @type {[QueriedSingleUserRaw]} */
      const data = await sql.query`
          SELECT
            U.NAME, U.USER_NAME,
            U.EMAIL, U.CPF,
            U.ROLE_ID
          FROM USERS U
          WHERE U.ID = ${id}`.run();

      if (data.length === 0) return [null, null];

      const [user] = data;

      /** @type {PersistedSingleUser} */
      const parsed = {
        email: user.EMAIL,
        name: user.NAME,
        roleId: user.ROLE_ID,
        username: user.USER_NAME,
      };

      return [parsed, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {User} user
   * @param {import("../global.js").IAuthContext} authContext
   * @returns {Promise<BooleanTuple>}
   */
  static async create(
    { nationalId, email, name, pass, userName, roleId },
    userId,
  ) {
    try {
      const hash = await bcrypt.hash(pass, 10);

      const created = await sql.exec`
            INSERT INTO USERS
                (EMAIL, CPF, NAME, ROLE_ID, USER_NAME, PASS, CREATED_BY, UPDATED_BY)
            VALUES
                (${email}, ${nationalId}, ${name}, ${roleId},
                 ${userName}, ${hash}, ${userId}, ${userId})
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

  /**
   * @param {EditUser} user
   * @param {import("../global.js").IAuthContext} authContext
   * @returns {Promise<BooleanTuple>}
   */
  static async edit(
    { id, name, pass, newPass, username, email, roleId },
    userId,
  ) {
    try {
      if (newPass && newPass === pass)
        return [false, new PasswordChangeMatchError()];

      const updateName = name ? sql`NAME = ${name}` : sql.empty;
      const updatePass = newPass
        ? sql`PASS = ${await bcrypt.hash(newPass, 10)}`
        : sql.empty;
      const updateUsername = username
        ? sql`USER_NAME = ${username}`
        : sql.empty;
      const updateEmail = email ? sql`EMAIL = ${email}` : sql.empty;
      const updateRoleId = roleId ? sql`ROLE_ID = ${roleId}` : sql.empty;
      const userIdToEdit = id === userId ? userId : id;

      if (!userIdToEdit)
        return [null, new Error("ID do usuário não fornecido")];

      const updateStatements = sql.join(
        ", ",
        updateName,
        updateEmail,
        updatePass,
        updateUsername,
        updateRoleId,
        sql`UPDATED_AT = CURRENT_TIMESTAMP()`,
        sql`UPDATED_BY = ${userId}`,
      );

      const updated = await sql.exec`
          UPDATE USERS
          SET ${updateStatements}
          WHERE ID = ${userIdToEdit}
        `.run();

      if (updated.affectedRows < 1) return [false, null];

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

  static async deactivate(id, userId) {
    try {
      const deactivated = await sql.exec`
        UPDATE USERS
        SET DELETED_AT = CURRENT_TIMESTAMP(),
            DELETED_BY = ${userId}
        WHERE ID = ${id}
      `.run();

      if (deactivated.affectedRows === 0)
        return [false, new Error("Usuário inexistente")];

      return [true, null];
    } catch (e) {
      return [false, e];
    }
  }

  static async reactivate(id) {
    try {
      const deactivated = await sql.exec`
        UPDATE USERS
        SET DELETED_AT = NULL,
            DELETED_BY = NULL
        WHERE ID = ${id}
      `.run();

      if (deactivated.affectedRows === 0)
        return [false, new Error("Usuário inexistente")];

      return [true, null];
    } catch (e) {
      return [false, e];
    }
  }
}

/**
 * @typedef {Object} FindAllUsersFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {Object} User
 * @prop {string} name
 * @prop {string} email
 * @prop {string} nationalId
 * @prop {string} userName
 * @prop {string} pass
 * @prop {number} roleId
 */

/**
 * @typedef {Object} QueriedUser
 * @prop {string} NAME
 * @prop {string} USER_NAME
 * @prop {number} IS_ACTIVE
 * @prop {number} ID
 * @prop {number} ROLE_ID
 * @prop {string} ROLE_NAME
 */

/**
 * @typedef {Object} QueriedSingleUserRaw
 * @prop {string} NAME
 * @prop {string} USER_NAME
 * @prop {string} EMAIL
 * @prop {number} ROLE_ID
 */

/**
 * @typedef {Object} PersistedSingleUser
 * @prop {string} name
 * @prop {string} username
 * @prop {string} email
 * @prop {number} roleId
 */

/**
 * @typedef {Object} PersistedUserRole
 * @prop {number} id
 * @prop {string} name
 */

/**
 * @typedef {Object} PersistedUser
 * @prop {string} name
 * @prop {string} username
 * @prop {number} isActive
 * @prop {number} id
 * @prop {PersistedUserRole} role
 */

/**
 * @typedef {Object} EditUser
 * @prop {string} [name]
 * @prop {string} [username]
 * @prop {string} [email]
 * @prop {string} [pass]
 * @prop {string} [newPass]
 * @prop {number} id
 * @prop {number} roleId
 */
