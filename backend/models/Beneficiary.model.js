import sql from "./core/sql.js";

/**
 * @typedef {Object} FindAllFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<Beneficiary>, null]|[null, Error]} FindAllTuple
 */

export default class BeneficiaryModel {
  /**
   * @param {FindAllFilter} [filter]
   * @returns {Promise<FindAllTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE FULL_NAME LIKE ${likeQuery} OR NATIONAL_ID LIKE ${likeQuery}`
        : sql.empty;
      const orderByColumn =
        sortKey === "name" ? sql`FULL_NAME` : sql`HAS_OPEN_REQUEST`;
      const orderBySorting =
        sortKey === "name" ? sql([sortType.toUpperCase()]) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[BeneficiaryRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT 
            NATIONAL_ID, 
            FULL_NAME,
            0 AS HAS_OPEN_REQUEST
          FROM BENEFICIARIES
          ${whereClause}
          ${orderByClause}
          ${limitClause}`.run(),
        sql.query`SELECT COUNT(*) AS TOTAL FROM BENEFICIARIES`.run(),
      ]);

      const beneficiaries = data.map((datum) => {
        /** @type {Beneficiary} */
        const beneficiary = {
          name: datum.FULL_NAME,
          nationalId: datum.NATIONAL_ID.replace(
            /^(\d{3})(\d{6})(\d{2})$/i,
            "$1.***.***.-$3",
          ),
          hasOpenRequest: datum.HAS_OPEN_REQUEST ? "sim" : "não",
        };

        return beneficiary;
      });

      return [
        {
          items: beneficiaries,
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
 * @typedef {Object} Beneficiary
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} BeneficiaryRaw
 * @prop {string} NATIONAL_ID
 * @prop {string} FULL_NAME
 * @prop {0|1} HAS_OPEN_REQUEST
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
