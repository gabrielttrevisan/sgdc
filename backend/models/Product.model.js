import sql from "./core/sql.js";

/**
 * @typedef {Object} FindAllProductsFilter
 * @prop {string} [query] Search text matched against product name or description.
 * @prop {string} [sortKey] Supported value: `name`.
 * @prop {string} [sortType] Supported values: `asc` or `desc`.
 * @prop {number} [page] One-based page number.
 * @prop {number} [perPage] Number of products per page.
 */

/**
 * @typedef {[import("../global.js").PageData<PersistedProduct>, null]|[null, Error]} FindAllProductsTuple
 */

/**
 * @typedef {[PersistedProduct|null, null]|[null, Error]} FindProductByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

export default class ProductModel {
  /**
   * Find active products using optional search, sorting, and pagination.
   *
   * @param {FindAllProductsFilter} filter
   * @returns {Promise<FindAllProductsTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query ?? ""}%`;
      const whereClause = query
        ? sql`WHERE P.DELETED_AT IS NULL AND (P.NAME LIKE ${likeQuery} OR P.DESCRIPTION LIKE ${likeQuery})`
        : sql`WHERE P.DELETED_AT IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`P.NAME` : sql.empty;
      const orderBySorting = sortKey
        ? sql.str(sortType.toUpperCase())
        : sql.empty;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[ProductRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT P.ID, P.NAME, P.DESCRIPTION, P.MEASURING_UNIT_ID,
            P.NEEDS_REFRIGERATION, P.IS_PERISHABLE,
            M.NAME AS MEASURING_UNIT_NAME, M.SYMBOL AS MEASURING_UNIT_SYMBOL
          FROM PRODUCTS P
            INNER JOIN MEASURING_UNITS M ON M.ID = P.MEASURING_UNIT_ID
          ${whereClause}
          ${orderByClause}
          ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM PRODUCTS P
          ${whereClause}`.run(),
      ]);

      return [
        {
          items: data.map(parseProduct),
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
   * Find one active product by its identifier.
   *
   * @param {number} id Product identifier.
   * @returns {Promise<FindProductByIdTuple>}
   */
  static async findById(id) {
    try {
      /** @type {ProductRaw[]} */
      const data = await sql.query`
        SELECT P.ID, P.NAME, P.DESCRIPTION, P.MEASURING_UNIT_ID,
          P.NEEDS_REFRIGERATION, P.IS_PERISHABLE,
          M.NAME AS MEASURING_UNIT_NAME, M.SYMBOL AS MEASURING_UNIT_SYMBOL
        FROM PRODUCTS P
          INNER JOIN MEASURING_UNITS M ON M.ID = P.MEASURING_UNIT_ID
        WHERE P.ID = ${id} AND P.DELETED_AT IS NULL`.run();

      return [data.length ? parseProduct(data[0]) : null, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * Soft-delete an active product.
   *
   * @param {number} id Product identifier.
   * @returns {Promise<BooleanTuple>}
   */
  static async delete(id) {
    try {
      const deleted = await sql.exec`
        UPDATE PRODUCTS
        SET DELETED_AT = CURRENT_TIMESTAMP()
        WHERE ID = ${id} AND DELETED_AT IS NULL`.run();

      return [deleted.affectedRows > 0, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * Restore a previously soft-deleted product.
   *
   * @param {number} id Product identifier.
   * @returns {Promise<BooleanTuple>}
   */
  static async restore(id) {
    try {
      const restored = await sql.exec`
        UPDATE PRODUCTS
        SET DELETED_AT = NULL
        WHERE ID = ${id} AND DELETED_AT IS NOT NULL`.run();

      return [restored.affectedRows > 0, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * Create a product.
   *
   * @param {ProductInput} product Product data to persist.
   * @returns {Promise<BooleanTuple>}
   */
  static async create({
    name,
    description,
    measuringUnitId,
    needRefrigeration,
    isPerishable,
  }) {
    try {
      const created = await sql.exec`
        INSERT INTO PRODUCTS (
          NAME, DESCRIPTION, MEASURING_UNIT_ID,
          NEEDS_REFRIGERATION, IS_PERISHABLE
        ) VALUES (
          ${name}, ${description}, ${measuringUnitId},
          ${needRefrigeration}, ${isPerishable}
        )`.run();

      return [created.affectedRows > 0, null];
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * Update the supplied fields of an active product.
   *
   * @param {ProductEdit} product Product identifier and fields to update.
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({
    id,
    name,
    description,
    measuringUnitId,
    needRefrigeration,
    isPerishable,
  }) {
    try {
      const updateStatements = sql.join(
        ", ",
        name ? sql`NAME = ${name}` : sql.empty,
        description !== undefined ? sql`DESCRIPTION = ${description}` : sql.empty,
        measuringUnitId ? sql`MEASURING_UNIT_ID = ${measuringUnitId}` : sql.empty,
        needRefrigeration !== undefined
          ? sql`NEEDS_REFRIGERATION = ${needRefrigeration}`
          : sql.empty,
        isPerishable !== undefined
          ? sql`IS_PERISHABLE = ${isPerishable}`
          : sql.empty,
        sql`UPDATED_AT = CURRENT_TIMESTAMP()`,
      );

      const updated = await sql.exec`
        UPDATE PRODUCTS
        SET ${updateStatements}
        WHERE ID = ${id} AND DELETED_AT IS NULL`.run();

      return [updated.affectedRows > 0, null];
    } catch (error) {
      return [false, error];
    }
  }
}

/**
 * Convert a raw product query row into the API/domain representation.
 *
 * @param {ProductRaw} product Raw product row returned by MySQL.
 * @returns {PersistedProduct}
 */
function parseProduct(product) {
  return {
    id: product.ID,
    name: product.NAME,
    description: product.DESCRIPTION,
    needRefrigeration: Boolean(product.NEEDS_REFRIGERATION),
    isPerishable: Boolean(product.IS_PERISHABLE),
    measuringUnit: {
      id: product.MEASURING_UNIT_ID,
      name: product.MEASURING_UNIT_NAME,
      symbol: product.MEASURING_UNIT_SYMBOL,
    },
  };
}

/**
 * @typedef {Object} ProductInput
 * @prop {string} name Product name.
 * @prop {string|null} [description] Optional product description.
 * @prop {number} measuringUnitId Measuring unit identifier.
 * @prop {boolean} needRefrigeration Whether refrigeration is required.
 * @prop {boolean} isPerishable Whether the product is perishable.
 */

/**
 * @typedef {Object} ProductEdit
 * @prop {number} id Product identifier.
 * @prop {string} [name] Replacement product name.
 * @prop {string|null} [description] Replacement description, including null.
 * @prop {number} [measuringUnitId] Replacement measuring unit identifier.
 * @prop {boolean} [needRefrigeration] Replacement refrigeration flag.
 * @prop {boolean} [isPerishable] Replacement perishability flag.
 */

/**
 * @typedef {Object} PersistedProduct
 * @prop {number} id Product identifier.
 * @prop {string} name Product name.
 * @prop {string|null} description Product description.
 * @prop {boolean} needRefrigeration Whether refrigeration is required.
 * @prop {boolean} isPerishable Whether the product is perishable.
 * @prop {PersistedMeasuringUnit} measuringUnit Product measuring unit.
 */

/**
 * @typedef {Object} PersistedMeasuringUnit
 * @prop {number} id Measuring unit identifier.
 * @prop {string} name Measuring unit name.
 * @prop {string} symbol Measuring unit symbol.
 */

/**
 * @typedef {Object} ProductRaw
 * @prop {number} ID
 * @prop {string} NAME
 * @prop {string|null} DESCRIPTION
 * @prop {number} MEASURING_UNIT_ID
 * @prop {0|1} NEEDS_REFRIGERATION
 * @prop {0|1} IS_PERISHABLE
 * @prop {string} MEASURING_UNIT_NAME
 * @prop {string} MEASURING_UNIT_SYMBOL
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} TOTAL
 */
