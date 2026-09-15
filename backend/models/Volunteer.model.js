import sql from "./core/sql.js";

/**
 * @typedef {Object} FindAllVolunteersFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<Volunteer>, null]|[null, Error]} FindAllVolunteersTuple
 */

/**
 * @typedef {[Volunteer|null, null]|[null, Error]} FindVolunteerByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

export default class VolunteerModel {
  /**
   * @param {FindAllVolunteersFilter} filter
   * @returns {Promise<FindAllVolunteersTuple>}
   */
  static async findAll({
    query,
    sortKey,
    sortType,
    page = 1,
    perPage = 10,
  }) {
    try {
      const likeQuery = `%${query}%`;

      const whereClause = query
        ? sql`
            WHERE deleted_at IS NULL
            AND (
              name LIKE ${likeQuery}
              OR nationalId LIKE ${likeQuery}
            )
          `
        : sql`WHERE deleted_at IS NULL`;

      const orderByColumn =
        sortKey === "name" ? sql`name` : sql.empty;

      const orderBySorting = sortKey
        ? sql([sortType.toUpperCase()])
        : sql`DESC`;

      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;

      const limitClause = sql`
        LIMIT ${perPage}
        OFFSET ${(page - 1) * perPage}
      `;

      /** @type {[VolunteerRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT
            id,
            name,
            gender,
            nationalId,
            phone,
            phoneSecondary,
            hasWhatsApp,
            hasWhatsAppSecondary,
            street,
            number,
            complement,
            neighborhood,
            city,
            state
          FROM volunteers
          ${whereClause}
          ${orderByClause}
          ${limitClause}
        `.run(),

        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM volunteers
          ${whereClause}
        `.run(),
      ]);

      const volunteers = data.map((datum) => {
        /** @type {Volunteer} */
        const volunteer = {
          id: datum.id,
          name: datum.name,
          gender: datum.gender,
          nationalId: datum.nationalId,
          phone: datum.phone,
          phoneSecondary: datum.phoneSecondary,
          hasWhatsApp: Boolean(datum.hasWhatsApp),
          hasWhatsAppSecondary: Boolean(datum.hasWhatsAppSecondary),
          street: datum.street,
          number: datum.number,
          complement: datum.complement,
          neighborhood: datum.neighborhood,
          city: datum.city,
          state: datum.state,
        };

        return volunteer;
      });

      return [
        {
          items: volunteers,
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
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<FindVolunteerByIdTuple>}
   */
  static async findById(id) {
    try {
      const data = await sql.query`
        SELECT
          id,
          name,
          gender,
          nationalId,
          phone,
          phoneSecondary,
          hasWhatsApp,
          hasWhatsAppSecondary,
          street,
          number,
          complement,
          neighborhood,
          city,
          state
        FROM volunteers
        WHERE id = ${id}
          AND deleted_at IS NULL
      `.run();

      if (data.length === 0) return [null, null];

      const [volunteer] = data;

      /** @type {Volunteer} */
      const parsed = {
        id: volunteer.id,
        name: volunteer.name,
        gender: volunteer.gender,
        nationalId: volunteer.nationalId,
        phone: volunteer.phone,
        phoneSecondary: volunteer.phoneSecondary,
        hasWhatsApp: Boolean(volunteer.hasWhatsApp),
        hasWhatsAppSecondary: Boolean(volunteer.hasWhatsAppSecondary),
        street: volunteer.street,
        number: volunteer.number,
        complement: volunteer.complement,
        neighborhood: volunteer.neighborhood,
        city: volunteer.city,
        state: volunteer.state,
      };

      return [parsed, null];
    } catch (error) {
      console.error(error);
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
        UPDATE volunteers
        SET deleted_at = CURRENT_TIMESTAMP()
        WHERE id = ${id}
          AND deleted_at IS NULL
      `.run();

      if (deleted.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {Volunteer} volunteer
   * @returns {Promise<BooleanTuple>}
   */
  static async create({
    name,
    gender,
    nationalId,
    phone,
    phoneSecondary,
    hasWhatsApp,
    hasWhatsAppSecondary,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  }) {
    try {
      const existing = await sql.query`
        SELECT id
        FROM volunteers
        WHERE nationalId = ${nationalId}
          AND deleted_at IS NULL
      `.run();

      if (existing.length > 0) {
        return [
          false,
          {
            isDuplicate: true,
            message: "Este CPF ou RG já está cadastrado!",
          },
        ];
      }

      const whats1 = hasWhatsApp ? 1 : 0;
      const whats2 = hasWhatsAppSecondary ? 1 : 0;

      const parsedGender =
        gender && gender !== "Selecione" ? gender : "o";

      const parsedStreet = street || null;
      const parsedNumber = number || null;
      const parsedComplement = complement || null;
      const parsedNeighborhood = neighborhood || null;
      const parsedCity = city || null;
      const parsedState = state || null;

      const created = await sql.exec`
        INSERT INTO volunteers (
          name,
          gender,
          nationalId,
          phone,
          phoneSecondary,
          hasWhatsApp,
          hasWhatsAppSecondary,
          street,
          number,
          complement,
          neighborhood,
          city,
          state
        )
        VALUES (
          ${name},
          ${parsedGender},
          ${nationalId},
          ${phone},
          ${phoneSecondary},
          ${whats1},
          ${whats2},
          ${parsedStreet},
          ${parsedNumber},
          ${parsedComplement},
          ${parsedNeighborhood},
          ${parsedCity},
          ${parsedState}
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
   * @param {Volunteer} volunteer
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({
    id,
    name,
    gender,
    nationalId,
    phone,
    phoneSecondary,
    hasWhatsApp,
    hasWhatsAppSecondary,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  }) {
    try {
      const updateName = name
        ? sql`name = ${name}`
        : sql.empty;

      const updateGender = gender
        ? sql`gender = ${gender}`
        : sql.empty;

      const updateNationalId = nationalId
        ? sql`nationalId = ${nationalId}`
        : sql.empty;

      const updatePhone = phone
        ? sql`phone = ${phone}`
        : sql.empty;

      const updatePhoneSecondary = phoneSecondary
        ? sql`phoneSecondary = ${phoneSecondary}`
        : sql.empty;

      const updateHasWhatsApp =
        hasWhatsApp !== undefined
          ? sql`hasWhatsApp = ${hasWhatsApp ? 1 : 0}`
          : sql.empty;

      const updateHasWhatsAppSecondary =
        hasWhatsAppSecondary !== undefined
          ? sql`hasWhatsAppSecondary = ${
              hasWhatsAppSecondary ? 1 : 0
            }`
          : sql.empty;

      const updateStreet = street
        ? sql`street = ${street}`
        : sql.empty;

      const updateNumber = number
        ? sql`number = ${number}`
        : sql.empty;

      const updateComplement = complement
        ? sql`complement = ${complement}`
        : sql.empty;

      const updateNeighborhood = neighborhood
        ? sql`neighborhood = ${neighborhood}`
        : sql.empty;

      const updateCity = city
        ? sql`city = ${city}`
        : sql.empty;

      const updateState = state
        ? sql`state = ${state}`
        : sql.empty;

      const updateStatements = sql.join(
        ", ",
        updateName,
        updateGender,
        updateNationalId,
        updatePhone,
        updatePhoneSecondary,
        updateHasWhatsApp,
        updateHasWhatsAppSecondary,
        updateStreet,
        updateNumber,
        updateComplement,
        updateNeighborhood,
        updateCity,
        updateState,
        sql`updated_at = CURRENT_TIMESTAMP()`,
      );

      const updated = await sql.exec`
        UPDATE volunteers
        SET ${updateStatements}
        WHERE id = ${id}
          AND deleted_at IS NULL
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
 * @typedef {Object} Volunteer
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {string} phoneSecondary
 * @prop {"m"|"f"|"o"} gender
 * @prop {boolean} hasWhatsApp
 * @prop {boolean} hasWhatsAppSecondary
 * @prop {string|null} street
 * @prop {string|null} number
 * @prop {string|null} complement
 * @prop {string|null} neighborhood
 * @prop {string|null} city
 * @prop {string|null} state
 */

/**
 * @typedef {Object} VolunteerRaw
 * @prop {number} id
 * @prop {string} nationalId
 * @prop {string} name
 * @prop {string} phone
 * @prop {string} phoneSecondary
 * @prop {"m"|"f"|"o"} gender
 * @prop {0|1} hasWhatsApp
 * @prop {0|1} hasWhatsAppSecondary
 * @prop {string|null} street
 * @prop {string|null} number
 * @prop {string|null} complement
 * @prop {string|null} neighborhood
 * @prop {string|null} city
 * @prop {string|null} state
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} TOTAL
 */