import sql, { transaction } from "./core/sql.js";
import RecordNotFoundError from "../exception/RecordNotFoundError.js";
import ScheduleConflictError from "../exception/ScheduleConflictError.js";
import AllocationTypeInUseError from "../exception/AllocationTypeInUseError.js";

const ALLOCATION_SELECT = sql`
  A.ID AS ID,
  A.START_AT AS START_AT,
  A.END_AT AS END_AT,
  A.NOTES AS NOTES,
  V.ID AS VOLUNTEER_ID,
  V.NAME AS VOLUNTEER_NAME,
  AT.ID AS ALLOCATION_TYPE_ID,
  AT.NAME AS ALLOCATION_TYPE_NAME
`;

const ALLOCATION_FROM = sql`
  FROM ALLOCATIONS A
  INNER JOIN VOLUNTEERS V ON V.ID = A.VOLUNTEER_ID
  INNER JOIN ALLOCATION_TYPES AT ON AT.ID = A.ALLOCATION_TYPE_ID
`;

/**
 * @typedef {Object} FindAllAllocationsFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {Object} Allocation
 * @prop {number} id
 * @prop {number} volunteerId
 * @prop {string} volunteerName
 * @prop {number} allocationTypeId
 * @prop {string} allocationTypeName
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string|null} notes
 */

/**
 * @typedef {[import("../global.js").PageData<Allocation>, null]|[null, Error]} FindAllAllocationsTuple
 */

/**
 * @typedef {[Allocation|null, null]|[null, Error]} FindAllocationByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

export default class AllocationModel {
  /**
   * @param {FindAllAllocationsFilter} filter
   * @returns {Promise<FindAllAllocationsTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`
            WHERE A.DELETED_AT IS NULL
            AND (V.NAME LIKE ${likeQuery} OR AT.NAME LIKE ${likeQuery})
          `
        : sql`WHERE A.DELETED_AT IS NULL`;
      const orderByColumn =
        sortKey === "volunteer" ? sql`V.NAME` : sql`A.START_AT`;
      const orderBySorting = sql.str((sortType ?? "desc").toUpperCase());
      const orderByClause = sql`ORDER BY ${orderByColumn} ${orderBySorting}`;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[AllocationRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
            SELECT ${ALLOCATION_SELECT}
            ${ALLOCATION_FROM}
            ${whereClause}
            ${orderByClause}
            ${limitClause}
          `.run(),
        sql.query`
            SELECT COUNT(*) AS TOTAL
            ${ALLOCATION_FROM}
            ${whereClause}
          `.run(),
      ]);

      return [
        {
          items: data.map((datum) => AllocationModel.#toAllocation(datum)),
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
   * @returns {Promise<FindAllocationByIdTuple>}
   */
  static async findById(id) {
    try {
      const data = await sql.query`
        SELECT ${ALLOCATION_SELECT}
        ${ALLOCATION_FROM}
        WHERE A.ID = ${id}
          AND A.DELETED_AT IS NULL
        LIMIT 1
      `.run();

      if (data.length === 0) return [null, null];

      return [AllocationModel.#toAllocation(data[0]), null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {number} volunteerId
   * @returns {Promise<FindAllocationByIdTuple>}
   */
  static async findCurrentByVolunteer(volunteerId) {
    try {
      const data = await sql.query`
        SELECT ${ALLOCATION_SELECT}
        ${ALLOCATION_FROM}
        WHERE A.VOLUNTEER_ID = ${volunteerId}
          AND A.DELETED_AT IS NULL
          AND A.START_AT <= NOW()
          AND A.END_AT > NOW()
        ORDER BY A.START_AT DESC
        LIMIT 1
      `.run();

      if (data.length === 0) return [null, null];

      return [AllocationModel.#toAllocation(data[0]), null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {AllocationToCreate} allocation
   * @returns {Promise<BooleanTuple>}
   */
  static async create({
    volunteerId,
    allocationTypeId,
    startAt,
    endAt,
    notes,
  }) {
    const start = AllocationModel.#toDate(startAt);
    const end = AllocationModel.#toDate(endAt);

    try {
      return await transaction(async (tsql) => {
        const volunteers = await tsql.query`
          SELECT ID
          FROM VOLUNTEERS
          WHERE ID = ${volunteerId}
            AND DELETED_AT IS NULL
          FOR UPDATE
        `.run();

        if (volunteers.length === 0)
          return [null, new RecordNotFoundError("voluntário")];

        const types = await tsql.query`
          SELECT ID
          FROM ALLOCATION_TYPES
          WHERE ID = ${allocationTypeId}
            AND DELETED_AT IS NULL
          FOR UPDATE
        `.run();

        if (types.length === 0)
          return [null, new RecordNotFoundError("tipo de alocação")];

        const typeInUse = await AllocationModel.#isTypeUsedByOtherVolunteer(
          tsql,
          { allocationTypeId, volunteerId },
        );

        if (typeInUse) return [null, new AllocationTypeInUseError()];

        const conflict = await AllocationModel.#hasConflict(tsql, {
          volunteerId,
          start,
          end,
        });

        if (conflict) return [null, new ScheduleConflictError()];

        const created = await tsql.exec`
          INSERT INTO ALLOCATIONS (
            VOLUNTEER_ID,
            ALLOCATION_TYPE_ID,
            START_AT,
            END_AT,
            NOTES
          )
          VALUES (
            ${volunteerId},
            ${allocationTypeId},
            ${start},
            ${end},
            ${notes}
          )
        `.run();

        if (created.affectedRows < 1) return [false, null];

        return [true, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {AllocationToEdit} allocation
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({ id, allocationTypeId, startAt, endAt, notes }) {
    const start = AllocationModel.#toDate(startAt);
    const end = AllocationModel.#toDate(endAt);

    try {
      return await transaction(async (tsql) => {
        const allocations = await tsql.query`
          SELECT ID, VOLUNTEER_ID
          FROM ALLOCATIONS
          WHERE ID = ${id}
            AND DELETED_AT IS NULL
          FOR UPDATE
        `.run();

        if (allocations.length === 0)
          return [null, new RecordNotFoundError("registro de alocação")];

        const volunteerId = allocations[0].VOLUNTEER_ID;

        await tsql.query`
          SELECT ID
          FROM VOLUNTEERS
          WHERE ID = ${volunteerId}
          FOR UPDATE
        `.run();

        const types = await tsql.query`
          SELECT ID
          FROM ALLOCATION_TYPES
          WHERE ID = ${allocationTypeId}
            AND DELETED_AT IS NULL
          FOR UPDATE
        `.run();

        if (types.length === 0)
          return [null, new RecordNotFoundError("tipo de alocação")];

        const typeInUse = await AllocationModel.#isTypeUsedByOtherVolunteer(
          tsql,
          { allocationTypeId, volunteerId },
        );

        if (typeInUse) return [null, new AllocationTypeInUseError()];

        const conflict = await AllocationModel.#hasConflict(tsql, {
          volunteerId,
          start,
          end,
          excludeId: id,
        });

        if (conflict) return [null, new ScheduleConflictError()];

        const updated = await tsql.exec`
          UPDATE ALLOCATIONS
          SET
            ALLOCATION_TYPE_ID = ${allocationTypeId},
            START_AT = ${start},
            END_AT = ${end},
            NOTES = ${notes},
            UPDATED_AT = CURRENT_TIMESTAMP()
          WHERE ID = ${id}
            AND DELETED_AT IS NULL
        `.run();

        if (updated.affectedRows < 1) return [false, null];

        return [true, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<BooleanTuple>}
   */
  static async delete(id) {
    try {
      const deleted = await sql.exec`
        UPDATE ALLOCATIONS
        SET DELETED_AT = CURRENT_TIMESTAMP()
        WHERE ID = ${id}
          AND DELETED_AT IS NULL
      `.run();

      if (deleted.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   *
   * @param {import("./core/sql.js").SqlFunctor} tsql
   * @param {{volunteerId: number, start: Date, end: Date, excludeId?: number}} params
   * @returns {Promise<boolean>}
   */
  static async #hasConflict(tsql, { volunteerId, start, end, excludeId }) {
    const excludeClause = excludeId ? sql`AND ID <> ${excludeId}` : sql.empty;

    const conflict = await tsql.query`
      SELECT ID
      FROM ALLOCATIONS
      WHERE VOLUNTEER_ID = ${volunteerId}
        AND DELETED_AT IS NULL
        ${excludeClause}
        AND START_AT < ${end}
        AND END_AT > ${start}
      LIMIT 1
    `.run();

    return conflict.length > 0;
  }

  /**
   * @param {import("./core/sql.js").SqlFunctor} tsql
   * @param {{allocationTypeId: number, volunteerId: number}} params
   * @returns {Promise<boolean>}
   */
  static async #isTypeUsedByOtherVolunteer(
    tsql,
    { allocationTypeId, volunteerId },
  ) {
    const usage = await tsql.query`
      SELECT ID
      FROM ALLOCATIONS
      WHERE ALLOCATION_TYPE_ID = ${allocationTypeId}
        AND DELETED_AT IS NULL
        AND VOLUNTEER_ID <> ${volunteerId}
      LIMIT 1
    `.run();

    return usage.length > 0;
  }

  /**
   * @param {AllocationRaw} raw
   * @returns {Allocation}
   */
  static #toAllocation(raw) {
    return {
      id: raw.ID,
      volunteerId: raw.VOLUNTEER_ID,
      volunteerName: raw.VOLUNTEER_NAME,
      allocationTypeId: raw.ALLOCATION_TYPE_ID,
      allocationTypeName: raw.ALLOCATION_TYPE_NAME,
      startAt: AllocationModel.#toISOString(raw.START_AT),
      endAt: AllocationModel.#toISOString(raw.END_AT),
      notes: raw.NOTES,
    };
  }

  /**
   * @param {Date|string} value
   * @returns {string}
   */
  static #toISOString(value) {
    return value instanceof Date ? value.toISOString() : value;
  }

  /**
   * @param {Date|string|number} value
   * @returns {Date}
   */
  static #toDate(value) {
    const ms = new Date(value).getTime();

    return new Date(Math.floor(ms / 1000) * 1000);
  }
}

/**
 * @typedef {Object} AllocationToCreate
 * @prop {number} volunteerId
 * @prop {number} allocationTypeId
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string|null} notes
 */

/**
 * @typedef {Object} AllocationToEdit
 * @prop {number} id
 * @prop {number} allocationTypeId
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {string|null} notes
 */

/**
 * @typedef {Object} AllocationRaw
 * @prop {number} ID
 * @prop {number} VOLUNTEER_ID
 * @prop {string} VOLUNTEER_NAME
 * @prop {number} ALLOCATION_TYPE_ID
 * @prop {string} ALLOCATION_TYPE_NAME
 * @prop {Date|string} START_AT
 * @prop {Date|string} END_AT
 * @prop {string|null} NOTES
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} TOTAL
 */
