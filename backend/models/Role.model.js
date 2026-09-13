import sql from "./core/sql.js";
import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";

export class RoleModel {
  /**
   * @param {Role} role
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ name, description, permissions }) {
    try {
      const created = await sql.exec`
        INSERT INTO ROLES (NAME, DESCRIPTION, PERMISSIONS)
        VALUES (${name}, ${description ?? null}, ${JSON.stringify(permissions)})
      `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      if (error instanceof Error && error.code === "ER_DUP_ENTRY")
        return [
          false,
          new DuplicatedFieldError("nome", "nível de acesso", {
            cause: error,
          }),
        ];

      return [false, error];
    }
  }

  static async findAllWithPermissions() {
    try {
      const roles = await sql.query`
        SELECT ID, PERMISSIONS FROM ROLES
        WHERE DELETED_AT IS NULL
        `.run();

      return [
        roles.map((role) => ({
          id: role.ID,
          permissions: role.PERMISSIONS,
        })),
        null,
      ];
    } catch (e) {
      return [null, e];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<[Role, null] | [null, Error]>}
   */
  static async findById(id) {
    try {
      const roles = await sql.query`
        SELECT ID, NAME, DESCRIPTION, PERMISSIONS
        FROM ROLES
        WHERE ID = ${id}
      `.run();

      if (roles.length === 0) return [null, null];

      const [role] = roles;

      return [
        {
          id: role.ID,
          name: role.NAME,
          description: role.DESCRIPTION,
          permissions: role.PERMISSIONS,
        },
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {FindAllRolesFilter} [filter]
   * @returns {Promise<[import("../global.js").PageData<Role>, null] | [null, Error]>}
   */
  static async findAll({
    query,
    filter,
    sortKey,
    sortType,
    page = 1,
    perPage = 10,
  }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause =
        filter === "inactive"
          ? query
            ? sql`WHERE ID = ${query} OR NAME LIKE ${likeQuery} OR DESCRIPTION LIKE ${likeQuery}`
            : sql.empty
          : query
            ? sql`WHERE DELETED_AT IS NULL AND (ID = ${query} OR NAME LIKE ${likeQuery} OR DESCRIPTION LIKE ${likeQuery})`
            : sql`WHERE DELETED_AT IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`NAME` : sql.empty;
      const orderBySorting =
        sortKey === "name" ? sql([sortType.toUpperCase()]) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[QueriedRole[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT
                ID, NAME, DESCRIPTION,
                CASE
                  WHEN DELETED_AT IS NULL THEN 1
                  ELSE 0
                END AS IS_ACTIVE
              FROM ROLES
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM ROLES
          ${whereClause}`.run(),
      ]);

      const roles = data.map((datum) => {
        /** @type {Role} */
        const role = {
          id: datum.ID,
          name: datum.NAME,
          description: datum.DESCRIPTION,
          isActive: datum.IS_ACTIVE === 1,
        };
        return role;
      });

      return [
        {
          items: roles,
          totalRecords: total,
          page,
          totalPages: Math.ceil(total / perPage),
          query,
          filter,
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
   * @returns {Promise<BooleanTuple>}
   */
  static async delete(id) {
    try {
      const deleted = await sql.exec`
        UPDATE ROLES
        SET DELETED_AT = CURRENT_TIMESTAMP()
        WHERE ID = ${id} AND DELETED_AT IS NULL
      `.run();

      if (deleted.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * @param {{id: number, name: string, description?: string, permissions: Record<string, string[]>}} role
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({ id, name, description, permissions }) {
    try {
      const updated = await sql.exec`
        UPDATE ROLES
        SET NAME = ${name},
            DESCRIPTION = ${description ?? null},
            PERMISSIONS = ${JSON.stringify(permissions)}
        WHERE ID = ${id} AND DELETED_AT IS NULL
      `.run();

      if (updated.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      if (error instanceof Error && error.code === "ER_DUP_ENTRY")
        return [
          false,
          new DuplicatedFieldError("nome", "nível de acesso", {
            cause: error,
          }),
        ];

      return [false, error];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<BooleanTuple>}
   */
  static async restore(id) {
    try {
      const restored = await sql.exec`
        UPDATE ROLES
        SET DELETED_AT = NULL
        WHERE ID = ${id} AND DELETED_AT IS NOT NULL
      `.run();

      if (restored.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }
}

/**
 * @typedef {Object} QueriedRoleWithPerssion
 * @prop {number} ID
 * @prop {Record<string, string[]>} PERMISSIONS
 */

/**
 * @typedef {Object} RoleWithPerssion
 * @prop {number} id
 * @prop {Record<string, string[]>} permissions
 */

/**
 * @typedef {Object} QueriedRole
 * @prop {number} ID
 * @prop {string} NAME
 * @prop {string|null} DESCRIPTION
 * @prop {number} IS_ACTIVE
 */

/**
 * @typedef {Object} Role
 * @prop {number} id
 * @prop {string} name
 * @prop {string|null} [description]
 * @prop {boolean} isActive
 * @prop {Record<string, string[]>} permissions
 */

/**
 * @typedef {Object} FindAllRolesFilter
 * @prop {string} [query]
 * @prop {"inactive"} [filter]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */
