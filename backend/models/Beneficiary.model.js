import sql from "./core/sql.js";

/**
 * @typedef {Object} FindAllBeneficiariesFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<TinyBeneficiary>, null]|[null, Error]} FindAllBeneficiariesTuple
 */

/**
 * @typedef {[PersistedBeneficiary|null, null]|[null, Error]} FindBeneficiaryByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

export default class BeneficiaryModel {
  /**
   * @param {FindAllBeneficiariesFilter} [filter]
   * @returns {Promise<FindAllBeneficiariesTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE DELETED_AT IS NULL AND (FULL_NAME LIKE ${likeQuery} OR NATIONAL_ID LIKE ${likeQuery})`
        : sql`WHERE DELETED_AT IS NULL`;
      const orderByColumn =
        sortKey === "name" ? sql`FULL_NAME` : sql`HAS_OPEN_REQUEST`;
      const orderBySorting =
        sortKey === "name" ? sql([sortType.toUpperCase()]) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[TinyBeneficiaryRaw[], CountRaw[]]} */
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
        sql.query`SELECT COUNT(*) AS TOTAL FROM BENEFICIARIES WHERE DELETED_AT IS NULL`.run(),
      ]);

      const beneficiaries = data.map((datum) => {
        /** @type {TinyBeneficiary} */
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
      /** @type {[FullPersistedBeneficiaryRaw]} */
      const data = await sql.query`
          SELECT 
            B.*,
            C.NAME AS CITY_NAME,
            C.STATE AS STATE,
            0 AS HAS_OPEN_REQUEST
          FROM BENEFICIARIES B
            INNER JOIN CITIES C ON C.ID = B.CITY_ID
          WHERE B.ID = ${id}`.run();

      if (data.length === 0) return [null, null];

      const [beneficiary] = data;

      /** @type {PersistedBeneficiary} */
      const parsed = {
        id: beneficiary.ID,
        city: {
          id: beneficiary.CITY_ID,
          name: beneficiary.CITY_NAME,
          state: beneficiary.STATE,
        },
        complement: beneficiary.COMPLEMENT,
        family: null,
        gender: {
          id: beneficiary.GENDER.toUpperCase(),
          name: {
            O: "Não Informado",
            M: "Masculino",
            F: "Feminino",
          }[beneficiary.GENDER.toUpperCase()],
        },
        hasOpenRequest: beneficiary.HAS_OPEN_REQUEST ? "sim" : "não",
        name: beneficiary.FULL_NAME,
        nationalId: beneficiary.NATIONAL_ID,
        neighborhood: beneficiary.NEIGHBORHOOD,
        number: beneficiary.HOUSE_NUMBER,
        phone: beneficiary.PHONE,
        street: beneficiary.street,
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
          UPDATE BENEFICIARIES 
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
          UPDATE BENEFICIARIES 
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
   * @param {Beneficiary} beneficiary
   * @returns {Promise<BooleanTuple>}
   */
  static async create({
    name,
    gender,
    nationalId,
    phone,
    street,
    number,
    complement,
    neighborhood,
    city,
  }) {
    try {
      const created = await sql.exec`
          INSERT INTO BENEFICIARIES (
            FULL_NAME, GENDER, NATIONAL_ID,
            PHONE, STREET, HOUSE_NUMBER, COMPLEMENT,
            NEIGHBORHOOD, CITY_ID
          ) VALUES (
            ${name}, ${gender}, ${nationalId},
            ${phone}, ${street}, ${number}, ${complement},
            ${neighborhood}, ${city}
          )
        `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {BeneficiaryEdit} beneficiary
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({
    id,
    name,
    gender,
    nationalId,
    phone,
    street,
    number,
    complement,
    neighborhood,
    city,
  }) {
    try {
      const updateName = name ? sql`FULL_NAME = ${name}` : sql.empty;
      const updateGender = gender ? sql`GENDER = ${gender}` : sql.empty;
      const updateNationalId = nationalId
        ? sql`NATIONAL_ID = ${nationalId}`
        : sql.empty;
      const updatePhone = phone ? sql`PHONE = ${phone}` : sql.empty;
      const updateStreet = street ? sql`STREET = ${street}` : sql.empty;
      const updateNumber = number ? sql`HOUSE_NUMBER = ${number}` : sql.empty;
      const updateComplement = complement
        ? sql`COMPLEMENT = ${complement}`
        : sql.empty;
      const updateNeighborhood = neighborhood
        ? sql`NEIGHBORHOOD = ${neighborhood}`
        : sql.empty;
      const updateCity = city ? sql`CITY_ID = ${city}` : sql.empty;

      const updateStatements = sql.join(
        ", ",
        updateName,
        updateGender,
        updateNationalId,
        updatePhone,
        updateStreet,
        updateNumber,
        updateComplement,
        updateNeighborhood,
        updateCity,
      );

      const updated = await sql.exec`
          UPDATE BENEFICIARIES
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
 * @typedef {Object} TinyBeneficiary
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} TinyBeneficiaryRaw
 * @prop {number} ID
 * @prop {string} NATIONAL_ID
 * @prop {string} FULL_NAME
 * @prop {0|1} HAS_OPEN_REQUEST
 */

/**
 * @typedef {Object} Beneficiary
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
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} PersistedBeneficiary
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {Gender} gender
 * @prop {string} family
 * @prop {string} street
 * @prop {string} number
 * @prop {string} complement
 * @prop {string} neighborhood
 * @prop {City} city
 * @prop {boolean} hasOpenRequest
 */

/**
 * @typedef {Object} Gender
 * @prop {string} id
 * @prop {string} name
 */

/**
 * @typedef {Object} FullPersistedBeneficiaryRaw
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
 * @prop {string} CITY_ID
 * @prop {string} CITY_NAME
 * @prop {0|1} HAS_OPEN_REQUEST
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */

/**
 * @typedef {Object} City
 * @prop {string} name
 * @prop {number} id
 * @prop {string} state
 */

/**
 * @typedef {Object} BeneficiaryEdit
 * @prop {number} id
 * @prop {string} [nationalId]
 * @prop {string} [name]
 * @prop {string} [phone]
 * @prop {"m"|"f"|"o"} [gender]
 * @prop {string} family
 * @prop {string} [street]
 * @prop {string} [number]
 * @prop {string} [complement]
 * @prop {string} [neighborhood]
 * @prop {string} [city]
 */
