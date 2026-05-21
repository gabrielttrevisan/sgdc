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
 * @typedef {[import("../global.js").PageData<Beneficiary>, null]|[null, Error]} FindAllBeneficiariesTuple
 */

/**
 * @typedef {[FullBeneficiary|null, null]|[null, Error]} FindBeneficiaryByIdTuple
 */

export default class BeneficiaryModel {
  /**
   * @param {FindAllFilter} [filter]
   * @returns {Promise<FindAllBeneficiariesTuple>}
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
            ID,
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
          id: datum.ID,
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

  /**
   * @param {number} id
   * @returns {Promise<FindBeneficiaryByIdTuple>}
   */
  static async findById(id) {
    try {
      /** @type {[FullBeneficiaryRaw]} */
      const data = await sql.query`
          SELECT 
            B.*,
            0 AS HAS_OPEN_REQUEST
          FROM BENEFICIARIES B
          WHERE B.ID = ${id}`.run();

      if (data.length === 0) return [null, null];

      const [beneficiary] = data;

      /** @type {FullBeneficiary} */
      const parsed = {
        id: beneficiary.ID,
        city: beneficiary.CITY,
        complement: beneficiary.COMPLEMENT,
        family: null,
        gender: {
          O: "Não Informado",
          M: "Masculino",
          F: "Feminino",
        }[beneficiary.GENDER.toUpperCase()],
        hasOpenRequest: beneficiary.HAS_OPEN_REQUEST ? "sim" : "não",
        name: beneficiary.FULL_NAME,
        nationalId: beneficiary.NATIONAL_ID,
        neighborhood: beneficiary.NEIGHBORHOOD,
        number: beneficiary.HOUSE_NUMBER,
        phone: beneficiary.PHONE,
        state: beneficiary.STATE,
        street: beneficiary.street,
      };

      return [parsed, null];
    } catch (error) {
      return [null, error];
    }
  }
}

/**
 * @typedef {Object} Beneficiary
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} BeneficiaryRaw
 * @prop {number} ID
 * @prop {string} NATIONAL_ID
 * @prop {string} FULL_NAME
 * @prop {0|1} HAS_OPEN_REQUEST
 */

/**
 * @typedef {Object} FullBeneficiary
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {"m"|"f"|"o"} gender
 * @prop {string} family
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {string} city
 * @prop {string} state
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} FullBeneficiaryRaw
 * @prop {number} ID
 * @prop {string} FULL_NAME
 * @prop {string} GENDER
 * @prop {string} NATIONAL_ID
 * @prop {string} PHONE
 * @prop {string} STREET
 * @prop {string} HOUSE_NUMBER
 * @prop {string} COMPLEMENT
 * @prop {string} NEIGHBORHOOD
 * @prop {string} STATE
 * @prop {string} CITY
 * @prop {0|1} HAS_OPEN_REQUEST
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
