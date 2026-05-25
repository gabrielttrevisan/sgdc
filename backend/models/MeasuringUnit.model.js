import sql from "./core/sql.js";

export default class MeasuringUnitModel {
  /**
   * @param {FindAllMeasuringUnitsFilter} [filter]
   * @returns {Promise<FindAllMeasuringUnitsTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE DELETED_AT IS NULL AND (NAME LIKE ${likeQuery} OR SYMBOL LIKE ${likeQuery})`
        : sql`WHERE DELETED_AT IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`NAME` : sql.empty;
      const orderBySorting =
        sortKey === "name" ? sql.str(sortType.toUpperCase()) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[MeasuringUnitRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT 
                ID, NAME, SYMBOL
              FROM MEASURING_UNITS
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL 
          FROM ALLOCATION_TYPES 
          ${whereClause}`.run(),
      ]);

      const measuringUnits = data.map((datum) => {
        /** @type {PersistedMeasuringUnit} */
        const measuringUnit = {
          id: datum.ID,
          name: datum.NAME,
          symbol: datum.SYMBOL,
        };

        return measuringUnit;
      });

      return [
        {
          items: measuringUnits,
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
      const isDeleted = await sql.exec`
            UPDATE MEASURING_UNITS 
            SET DELETED_AT = CURRENT_TIMESTAMP() 
            WHERE ID = ${id}
          `.run();

      if (isDeleted.affectedRows < 1) return [false, null];

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
            UPDATE MEARUSING_UNITS 
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
   * @param {MeasuringUnit} measuringUnit
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ name, symbol }) {
    try {
      const created = await sql.exec`
            INSERT INTO MEASURING_UNITS (NAME, SYMBOL) 
            VALUES (${name}, ${symbol})
          `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * @param {MeasuringUnitEdit} measuringUnit
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({ id, name, symbol }) {
    try {
      const updateName = name ? sql`NAME = ${name}` : sql.empty;
      const updateSymbol = symbol ? sql`SYMBOL = ${symbol}` : sql.empty;

      const updateStatements = sql.join(
        ", ",
        updateName,
        updateSymbol,
        sql`UPDATED_AT = CURRENT_TIMESTAMP()`,
      );

      const updated = await sql.exec`
            UPDATE MEASURING_UNITS
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
 * @typedef {Object} FindAllMeasuringUnitsFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<PersistedMeasuringUnit>, null]|[null, Error]} FindAllMeasuringUnitsTuple
 */

/**
 * @typedef {[PersistedMeasuringUnit|null, null]|[null, Error]} FindMeasuringUnitByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

/**
 * @typedef {Object} MeasuringUnitRaw
 * @prop {int} ID
 * @prop {string} NAME
 * @prop {string} SYMBOL
 */

/**
 * @typedef {Object} PersistedMeasuringUnit
 * @prop {int} id
 * @prop {string} name
 * @prop {string} symbol
 */

/**
 * @typedef {Object} MeasuringUnit
 * @prop {string} name
 * @prop {string} symbol
 */

/**
 * @typedef {Object} MeasuringUnitEdit
 * @prop {int} id
 * @prop {string} [name]
 * @prop {string} [symbol]
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
