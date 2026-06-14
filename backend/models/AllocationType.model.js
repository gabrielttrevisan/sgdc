import sql from "./core/sql.js";

export default class AllocationTypeModel {
  /**
   * @param {FindAllAllocationTypesFilter} [filter]
   * @returns {Promise<FindAllAllocationTypesTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE DELETED_AT IS NULL AND (NAME LIKE ${likeQuery} OR DESCRIPTION LIKE ${likeQuery})`
        : sql`WHERE DELETED_AT IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`NAME` : sql.empty;
      const orderBySorting =
        sortKey === "name" ? sql.str(sortType.toUpperCase()) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[AllocationTypeRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT 
                ID, NAME, DESCRIPTION
              FROM ALLOCATION_TYPES
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL 
          FROM ALLOCATION_TYPES 
          ${whereClause}`.run(),
      ]);

      const allocationTypes = data.map((datum) => {
        /** @type {PersistedAllocationType} */
        const allocationType = {
          id: datum.ID,
          name: datum.NAME,
          description: datum.DESCRIPTION,
        };

        return allocationType;
      });

      return [
        {
          items: allocationTypes,
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
   * @returns {Promise<BooleanTuple>}
   */
  static async delete(id) {
    try {
      const deleted = await sql.exec`
            UPDATE ALLOCATION_TYPES 
            SET DELETED_AT = CURRENT_TIMESTAMP() 
            WHERE ID = ${id}
          `.run();

      if (deleted.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
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
            UPDATE ALLOCATION_TYPES 
            SET DELETED_AT = NULL
            WHERE ID = ${id}
          `.run();

      if (restored.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * @param {AllocationType} city
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ name, description }) {
    try {
      const created = await sql.exec`
            INSERT INTO ALLOCATION_TYPES (NAME, DESCRIPTION) 
            VALUES (${name}, ${description ?? ""})
          `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * @param {AllocationTypeEdit} city
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({ id, name, description }) {
    try {
      const updateName = name ? sql`NAME = ${name}` : sql.empty;
      const updateDescription = description
        ? sql`DESCRIPTION = ${description}`
        : sql.empty;

      const updateStatements = sql.join(
        ", ",
        updateName,
        updateDescription,
        sql`UPDATED_AT = CURRENT_TIMESTAMP()`,
      );

      const updated = await sql.exec`
            UPDATE ALLOCATION_TYPES
            SET ${updateStatements}
            WHERE ID = ${id}
          `.run();

      if (updated.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }
}

/**
 * @typedef {Object} FindAllAllocationTypesFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<PersistedAllocationType>, null]|[null, Error]} FindAllAllocationTypesTuple
 */

/**
 * @typedef {[PersistedAllocationType|null, null]|[null, Error]} FindAllocationTypeByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

/**
 * @typedef {Object} AllocationTypeRaw
 * @prop {int} ID
 * @prop {string} NAME
 * @prop {string} DESCRIPTION
 */

/**
 * @typedef {Object} PersistedAllocationType
 * @prop {int} id
 * @prop {string} name
 * @prop {string} description
 */

/**
 * @typedef {Object} AllocationType
 * @prop {string} name
 * @prop {string} description
 */

/**
 * @typedef {Object} AllocationTypeEdit
 * @prop {int} id
 * @prop {string} [name]
 * @prop {string} [description]
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
