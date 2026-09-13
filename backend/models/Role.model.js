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
   * @param {FindAllRolesFilter} [filter]
   * @returns {Promise<[import("../global.js").PageData<Role>, null] | [null, Error]>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE ID = ${query} OR NAME LIKE ${likeQuery}`
        : sql.empty;
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
                ID, NAME, DESCRIPTION
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
          sortKey,
          sortType,
        },
        null,
      ];
    } catch (error) {
      return [null, error];
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
 */

/**
 * @typedef {Object} Role
 * @prop {number} id
 * @prop {string} name
 * @prop {string|null} [description]
 * @prop {Record<string, string[]>} permissions
 */

/**
 * @typedef {Object} FindAllRolesFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */
