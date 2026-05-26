import sql from "./core/sql.js";

export default class CityModel {
  /**
   * @param {FindAllCitiesFilter} [filter]
   * @returns {Promise<FindAllCitiesTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE DELETED_AT IS NULL AND STATE LIKE ${likeQuery}`
        : sql`WHERE DELETED_AT IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`NAME` : sql.empty;
      const orderBySorting =
        sortKey === "name" ? sql([sortType.toUpperCase()]) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[CityRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT 
                ID, NAME, STATE
              FROM CITIES
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL 
          FROM CITIES 
          ${whereClause}`.run(),
      ]);

      const cities = data.map((datum) => {
        /** @type {PersistedCity} */
        const city = {
          id: datum.ID,
          name: datum.NAME,
          state: datum.STATE.toUpperCase(),
        };

        return city;
      });

      return [
        {
          items: cities,
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
   * @returns {Promise<FindCityByIdTuple>}
   */
  static async findById(id) {
    try {
      /** @type {[CityRaw]} */
      const data = await sql.query`
            SELECT 
              ID, NAME, STATE
            FROM CITIES
            WHERE ID = ${id}`.run();

      if (data.length === 0) return [null, null];

      const [city] = data;

      /** @type {PersistedCity} */
      const parsed = {
        id: city.ID,
        name: city.NAME,
        state: city.STATE.toUpperCase(),
      };

      return [parsed, null];
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
            UPDATE CITIES 
            SET DELETED_AT = CURRENT_TIMESTAMP() 
            WHERE ID = ${id}
          `.run();

      if (deleted.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
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
            UPDATE CITIES 
            SET DELETED_AT = NULL
            WHERE ID = ${id}
          `.run();

      if (restored.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {City} city
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ name, state }) {
    try {
      const created = await sql.exec`
            INSERT INTO CITIES (NAME, STATE) 
            VALUES (${name}, ${state})
          `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {CityEdit} city
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({ id, name, state }) {
    try {
      const updateName = name ? sql`NAME = ${name}` : sql.empty;
      const updateState = state ? sql`STATE = ${state}` : sql.empty;

      const updateStatements = sql.join(
        ", ",
        updateName,
        updateState,
        sql`UPDATED_AT = CURRENT_TIMESTAMP()`,
      );

      const updated = await sql.exec`
            UPDATE CITIES
            SET ${updateStatements}
            WHERE ID = ${id}
          `.run();

      if (updated.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }
}

/**
 * @typedef {Object} FindAllCitiesFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<PersistedCity>, null]|[null, Error]} FindAllCitiesTuple
 */

/**
 * @typedef {[PersistedCity|null, null]|[null, Error]} FindCityByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

/**
 * @typedef {Object} CityRaw
 * @prop {int} ID
 * @prop {string} NAME
 * @prop {string} STATE
 */

/**
 * @typedef {Object} PersistedCity
 * @prop {int} id
 * @prop {string} name
 * @prop {string} state
 */

/**
 * @typedef {Object} City
 * @prop {string} name
 * @prop {string} state
 */

/**
 * @typedef {Object} CityEdit
 * @prop {int} id
 * @prop {string} [name]
 * @prop {string} [state]
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
