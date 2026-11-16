import sql, { transaction } from "./core/sql.js";

export default class AttendanceModel {
  /**
   * Recalculates item and attendance fulfillment status from active donations.
   *
   * @param {Function} tsql
   * @param {number} id
   */
  static async refreshFulfillmentStatus(tsql, id) {
    const requestRows = await tsql.query`
      SELECT
        CAR.PRODUCT_ID,
        CAR.QUANTITY,
        COALESCE(SUM(DI.QUANTITY), 0) AS PROVIDED_QUANTITY
      FROM CLIENT_ATTENDANCE_REQUEST CAR
        LEFT JOIN DONATIONS D
          ON D.ATTENDANCE_ID = CAR.ATTENDANCE_ID
          AND D.CANCELLED_AT IS NULL
        LEFT JOIN DONATION_ITEMS DI
          ON DI.DONATION_ID = D.ID
          AND DI.PRODUCT_ID = CAR.PRODUCT_ID
      WHERE CAR.ATTENDANCE_ID = ${id}
      GROUP BY CAR.PRODUCT_ID, CAR.QUANTITY`.run();

    for (const request of requestRows) {
      const requestedQuantity = Number(request.QUANTITY);
      const providedQuantity = Math.min(
        requestedQuantity,
        Number(request.PROVIDED_QUANTITY),
      );
      const status =
        providedQuantity === 0
          ? "OPEN"
          : providedQuantity >= requestedQuantity
            ? "CLOSED"
            : "PARTIAL";

      await tsql.exec`
        UPDATE CLIENT_ATTENDANCE_REQUEST
        SET PROVIDED_QUANTITY = ${providedQuantity},
            STATUS = ${status}
        WHERE ATTENDANCE_ID = ${id}
          AND PRODUCT_ID = ${request.PRODUCT_ID}`.run();
    }

    const [attendanceStatus] = await tsql.query`
      SELECT
        COUNT(CAR.PRODUCT_ID) AS ITEM_COUNT,
        SUM(CAR.STATUS = 'CLOSED') AS CLOSED_ITEM_COUNT,
        EXISTS (
          SELECT 1
          FROM DONATIONS D
          WHERE D.ATTENDANCE_ID = ${id}
            AND D.CANCELLED_AT IS NULL
        ) AS HAS_ACTIVE_DONATION
      FROM CLIENT_ATTENDANCE_REQUEST CAR
      WHERE CAR.ATTENDANCE_ID = ${id}`.run();

    const itemCount = Number(attendanceStatus.ITEM_COUNT);
    const closedItemCount = Number(attendanceStatus.CLOSED_ITEM_COUNT ?? 0);
    const hasActiveDonation = Boolean(attendanceStatus.HAS_ACTIVE_DONATION);
    const status =
      (itemCount === 0 && hasActiveDonation) ||
      (itemCount > 0 && closedItemCount === itemCount)
        ? "CLOSED"
        : hasActiveDonation
          ? "PARTIAL"
          : "OPEN";

    await tsql.exec`
      UPDATE CLIENT_ATTENDANCES
      SET STATUS = ${status}
      WHERE ID = ${id}`.run();
  }

  /**
   * @param {AttendanceToCreate} attendance
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ familyId, responsible, details, requests = [] }) {
    try {
      return await transaction(async (tsql) => {
        const family = await tsql.query`
          SELECT ID
          FROM FAMILIES
          WHERE ID = ${familyId} AND DELETED_AT IS NULL
          FOR UPDATE`.run();

        if (family.length !== 1) return [false, null];

        const familyMembers = await tsql.query`
          SELECT FP.BEN_ID
          FROM FAMILY_PARTICIPANTS FP
            INNER JOIN FAMILIES F ON F.ID = FP.FAM_ID
          WHERE
            F.ID = ${familyId} AND
            F.DELETED_AT IS NULL AND
            FP.BEN_ID = ${responsible} AND
            FP.IS_RESPOSIBLE = 1
        `.run();

        if (familyMembers.length !== 1) return [false, null];

        const openAttendances = await tsql.query`
          SELECT CA.ID
          FROM FAMILY_PARTICIPANTS FP
            INNER JOIN CLIENT_ATTENDANCES CA
              ON CA.BENEFICIARY_ID = FP.BEN_ID
          WHERE FP.FAM_ID = ${familyId}
            AND CA.CANCELLED_AT IS NULL
            AND CA.STATUS <> 'CLOSED'
          LIMIT 1`.run();

        if (openAttendances.length > 0)
          return [false, new OpenAttendanceExistsError()];

        const createdAttendance = await tsql.exec`
          INSERT INTO client_attendances (BENEFICIARY_ID, DETAILS)
          VALUES (${responsible}, ${details.trim()})
        `.run();

        if (!createdAttendance.insertId)
          return [false, new Error("Falha ao registrar atendimento")];

        if (requests.length > 0) {
          const requestValues = tsql.join(
            ",",
            ...requests.map(
              ({ productId, quantity = 1 }) =>
                tsql`(${createdAttendance.insertId}, ${productId}, ${quantity}, 0, 'OPEN')`,
            ),
          );
          const createdRequests = await tsql.exec`
            INSERT INTO client_attendance_request
              (ATTENDANCE_ID, PRODUCT_ID, QUANTITY, PROVIDED_QUANTITY, STATUS)
            VALUES ${requestValues}
          `.run();

          if (createdRequests.affectedRows !== requests.length)
            return [false, new Error("Falha ao registrar produtos solicitados")];
        }

        return [true, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {FindAllAttendancesFilter} filter
   * @returns {Promise<FindAllAttendancesTuple>}
   */
  static async findAll({ query, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query ?? ""}%`;
      const whereClause = query
        ? sql`WHERE B.FULL_NAME LIKE ${likeQuery}
            OR CA.DETAILS LIKE ${likeQuery}
            OR CAST(CA.ID AS CHAR) LIKE ${likeQuery}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT
            CA.ID,
            CA.DETAILS,
            CA.CANCELLED_AT,
            CA.STATUS,
            B.ID AS BENEFICIARY_ID,
            B.FULL_NAME AS BENEFICIARY_NAME
          FROM CLIENT_ATTENDANCES CA
            INNER JOIN BENEFICIARIES B ON B.ID = CA.BENEFICIARY_ID
          ${whereClause}
          ORDER BY CA.ID DESC
          ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM CLIENT_ATTENDANCES CA
            INNER JOIN BENEFICIARIES B ON B.ID = CA.BENEFICIARY_ID
          ${whereClause}`.run(),
      ]);

      return [
        {
          items: data.map((row) => ({
            id: row.ID,
            details: row.DETAILS,
            beneficiary: {
              id: row.BENEFICIARY_ID,
              name: row.BENEFICIARY_NAME,
            },
            isCancelled: row.CANCELLED_AT !== null,
            status: row.STATUS,
          })),
          totalRecords: total,
          page,
          totalPages: Math.ceil(total / perPage),
          query,
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
   * @returns {Promise<FindAttendanceByIdTuple>}
   */
  static async findById(id) {
    try {
      const rows = await sql.query`
        SELECT
          CA.ID,
          CA.DETAILS,
          CA.CANCELLED_AT,
          CA.STATUS,
          CA.CANCELLATION_REASON,
          CA.CANCELLED_BY,
          B.ID AS BENEFICIARY_ID,
          B.FULL_NAME AS BENEFICIARY_NAME,
          U.ID AS CANCELLED_USER_ID,
          U.NAME AS CANCELLED_USER_NAME
        FROM CLIENT_ATTENDANCES CA
          INNER JOIN BENEFICIARIES B ON B.ID = CA.BENEFICIARY_ID
          LEFT JOIN USERS U ON U.ID = CA.CANCELLED_BY
        WHERE CA.ID = ${id}`.run();

      if (rows.length === 0) return [null, null];

      const [row] = rows;
      const requestedItems = await sql.query`
        SELECT
          P.ID AS PRODUCT_ID,
          P.NAME AS PRODUCT_NAME,
          CAR.QUANTITY,
          CAR.PROVIDED_QUANTITY,
          CAR.STATUS,
          CASE WHEN COALESCE(STOCK.TOTAL, 0) > 0 THEN 1 ELSE 0 END AS IN_STOCK
        FROM CLIENT_ATTENDANCE_REQUEST CAR
          INNER JOIN PRODUCTS P ON P.ID = CAR.PRODUCT_ID
          LEFT JOIN (
            SELECT PRODUCT_ID, SUM(COUNT) AS TOTAL
            FROM IN_STOCK_PRODUCTS
            GROUP BY PRODUCT_ID
          ) STOCK ON STOCK.PRODUCT_ID = P.ID
        WHERE CAR.ATTENDANCE_ID = ${id}
        ORDER BY P.NAME`.run();

      return [
        {
          attendance: {
            id: row.ID,
            details: row.DETAILS,
            status: row.STATUS,
            cancelledAt: row.CANCELLED_AT
              ? row.CANCELLED_AT.toISOString()
              : null,
          },
          beneficiary: {
            id: row.BENEFICIARY_ID,
            name: row.BENEFICIARY_NAME,
          },
          cancelledBy:
            row.CANCELLED_USER_ID && row.CANCELLED_USER_NAME
              ? { id: row.CANCELLED_USER_ID, name: row.CANCELLED_USER_NAME }
              : null,
          cancellationReason: row.CANCELLATION_REASON,
          requestedItems: requestedItems.map((item) => ({
            product: { id: item.PRODUCT_ID, name: item.PRODUCT_NAME },
            quantity: item.QUANTITY,
            providedQuantity: item.PROVIDED_QUANTITY,
            status: item.STATUS,
            inStock: Boolean(item.IN_STOCK),
          })),
        },
        null,
      ];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {AttendanceToUpdate} attendance
   * @returns {Promise<BooleanTuple>}
   */
  static async update({ id, details, requests }) {
    try {
      return await transaction(async (tsql) => {
        const existing = await tsql.query`
          SELECT ID, STATUS
          FROM CLIENT_ATTENDANCES
          WHERE ID = ${id} AND CANCELLED_AT IS NULL
          FOR UPDATE`.run();

        if (existing.length !== 1) return [false, null];
        if (existing[0].STATUS === "CLOSED")
          return [false, new ClosedAttendanceError()];

        if (details !== undefined) {
          await tsql.exec`
            UPDATE CLIENT_ATTENDANCES
            SET DETAILS = ${details.trim()}
            WHERE ID = ${id}`.run();
        }

        if (requests !== undefined) {
          await tsql.exec`
            DELETE FROM CLIENT_ATTENDANCE_REQUEST
            WHERE ATTENDANCE_ID = ${id}`.run();

          if (requests.length > 0) {
            const requestValues = tsql.join(
              ",",
              ...requests.map(
                ({ productId, quantity = 1 }) =>
                  tsql`(${id}, ${productId}, ${quantity}, 0, 'OPEN')`,
              ),
            );
            const createdRequests = await tsql.exec`
              INSERT INTO CLIENT_ATTENDANCE_REQUEST
                (ATTENDANCE_ID, PRODUCT_ID, QUANTITY, PROVIDED_QUANTITY, STATUS)
              VALUES ${requestValues}`.run();

            if (createdRequests.affectedRows !== requests.length)
              return [false, new Error("Falha ao atualizar produtos solicitados")];
          }
        }

        await this.refreshFulfillmentStatus(tsql, id);

        return [true, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {{id: number, reason: string}} attendance
   * @param {User} user
   * @returns {Promise<BooleanTuple>}
   */
  static async cancel({ id, reason }, user) {
    try {
      return await transaction(async (tsql) => {
        const attendances = await tsql.query`
          SELECT ID, STATUS, CANCELLED_AT
          FROM CLIENT_ATTENDANCES
          WHERE ID = ${id}
          FOR UPDATE`.run();

        if (attendances.length !== 1 || attendances[0].CANCELLED_AT)
          return [false, null];
        if (attendances[0].STATUS === "CLOSED")
          return [false, new ClosedAttendanceError()];

        const cancelled = await tsql.exec`
          UPDATE CLIENT_ATTENDANCES
          SET
            CANCELLED_AT = CURRENT_TIMESTAMP,
            CANCELLED_BY = ${user.id},
            CANCELLATION_REASON = ${reason.trim()}
          WHERE ID = ${id} AND CANCELLED_AT IS NULL`.run();

        return [cancelled.affectedRows === 1, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }
}

export class ClosedAttendanceError extends Error {
  constructor() {
    super("Atendimentos fechados não podem ser alterados ou cancelados");
    this.name = "ClosedAttendanceError";
  }
}

export class OpenAttendanceExistsError extends Error {
  constructor() {
    super("A família já possui um atendimento em aberto");
    this.name = "OpenAttendanceExistsError";
  }
}

/**
 * @typedef {{productId: number, quantity?: number}[]} AttendanceRequest
 */

/**
 * @typedef {Object} AttendanceToCreate
 * @prop {number} familyId
 * @prop {number} responsible
 * @prop {string} details
 * @prop {AttendanceRequest} [requests]
 */

/**
 * @typedef {Object} AttendanceToUpdate
 * @prop {number} id
 * @prop {string} [details]
 * @prop {AttendanceRequest} [requests]
 */

/**
 * @typedef {Object} FindAllAttendancesFilter
 * @prop {string} [query]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

/**
 * @typedef {[import("../global.js").PageData<AttendanceListItem>, null]|[null, Error]} FindAllAttendancesTuple
 */

/**
 * @typedef {[AttendanceDetails|null, null]|[null, Error]} FindAttendanceByIdTuple
 */

/**
 * @typedef {Object} AttendanceListItem
 * @prop {number} id
 * @prop {string} details
 * @prop {{id: number, name: string}} beneficiary
 * @prop {boolean} isCancelled
 * @prop {"OPEN"|"PARTIAL"|"CLOSED"} status
 */

/**
 * @typedef {Object} AttendanceDetails
 * @prop {{id: number, details: string, cancelledAt: string|null}} attendance
 * @prop {{id: number, name: string}} beneficiary
 * @prop {{id: number, name: string}|null} cancelledBy
 * @prop {string|null} cancellationReason
 * @prop {{product: {id: number, name: string}, quantity: number, providedQuantity: number, status: "OPEN"|"PARTIAL"|"CLOSED", inStock: boolean}[]} requestedItems
 */
