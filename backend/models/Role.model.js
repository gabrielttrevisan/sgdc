import sql from "./core/sql.js";

export class RoleModel {
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
                ID, NAME
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
 */

/**
 * @typedef {Object} FindAllRolesFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */
