import { SameDueDateError } from "../exception/SameDueDateError.js";
import sql, { transaction } from "./core/sql.js";

export default class BillModel {
  /**
   * @param {FindAllBillsFilter} [filter]
   * @returns {Promise<FindAllBillsTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE DESCRIPTION LIKE ${likeQuery}`
        : sql.empty;
      const orderByColumn =
        sortKey === "descr" ? sql`DESCRIPTION` : sql`STATUS`;
      const orderBySorting =
        sortKey === "descr" ? sql.str(sortType.toUpperCase()) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql`ORDER BY STATUS DESC`;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[BillRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT 
                B.*,
                CASE
                  WHEN B.CANCELED_AT IS NOT NULL THEN "W_CANCELED"
                  WHEN B.PAID_AT IS NOT NULL THEN "X_PAID"
                  WHEN B.EXTENDED_AT IS NOT NULL THEN "Y_EXTENDED"
                  ELSE "Z_UNPAID"
                END AS STATUS
              FROM BILLS B
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT 
              COUNT(*) AS TOTAL
              FROM BILLS B
          ${whereClause}`.run(),
      ]);

      const bills = data.map((datum) => {
        /** @type {ListedBill} */
        const bill = {
          id: datum.ID,
          dueDate: datum.DUE_DATE.toISOString(),
          description: datum.DESCRIPTION,
          value: datum.VALUE,
          status: datum.STATUS.split("_")[1],
          extendedFrom: datum.EXTENDED_FROM
            ? datum.EXTENDED_FROM.toISOString()
            : null,
        };

        return bill;
      });

      return [
        {
          items: bills,
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
   * @returns {Promise<FindBillByIdTuple>}
   */
  static async findById(id) {
    try {
      /** @type {[FullBillRaw]} */
      const data = await sql.query`
          SELECT
            B.*,
            UC.NAME AS CREATED_BY_NAME,
            UE.NAME AS EXTENDED_BY_NAME,
            UP.NAME AS PAID_BY_NAME,
            UX.NAME AS CANCELED_BY_NAME
          FROM BILLS B
            INNER JOIN USERS UC ON B.CREATED_BY = UC.ID
            LEFT JOIN USERS UE ON B.EXTENDED_BY = UE.ID
            LEFT JOIN USERS UP ON B.PAID_BY = UP.ID
            LEFT JOIN USERS UX ON B.CANCELED_BY = UX.ID
          WHERE B.ID = ${id}`.run();

      if (data.length === 0) return [null, null];

      const [bill] = data;

      /** @type {FullBill} */
      const parsed = {
        id: bill.ID,
        value: parseFloat(bill.VALUE),
        description: bill.DESCRIPTION,
        dueDate: bill.DUE_DATE.toISOString(),
        created: {
          at: bill.CREATED_AT.toISOString(),
          byUser: {
            id: bill.CREATED_BY,
            name: bill.CREATED_BY_NAME,
          },
        },
        canceled:
          bill.CANCELATION_DETAILS &&
          bill.CANCELED_AT &&
          bill.CANCELED_BY &&
          bill.CANCELED_BY_NAME
            ? {
                at: bill.CANCELED_AT.toISOString(),
                details: bill.CANCELATION_DETAILS,
                byUser: {
                  id: bill.CANCELED_BY,
                  name: bill.CANCELED_BY_NAME,
                },
              }
            : null,
        extended:
          bill.EXTENDED_AT &&
          bill.EXTENDED_BY &&
          bill.CANCELED_BY_NAME &&
          bill.EXTENDED_DETAILS &&
          bill.EXTENDED_FROM
            ? {
                at: bill.EXTENDED_AT.toISOString(),
                byUser: { id: bill.EXTENDED_BY, name: bill.EXTENDED_BY_NAME },
                details: bill.EXTENDED_DETAILS,
                from: bill.EXTENDED_FROM.toISOString(),
              }
            : null,
        paid:
          bill.PAID_AT && bill.PAID_BY && bill.PAID_BY_NAME
            ? {
                at: bill.PAID_AT.toISOString(),
                byUser: { id: bill.PAID_BY, name: bill.PAID_BY_NAME },
              }
            : null,
      };

      return [parsed, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {Bill} bill
   * @param {User} auth
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ dueDate, description, value }, { id }) {
    try {
      const created = await sql.exec`
            INSERT INTO BILLS (DUE_DATE, VALUE, DESCRIPTION, CREATED_BY) 
            VALUES (${dueDate}, ${value}, ${description}, ${id})
          `.run();

      if (created.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {CancelAndCopyBill} bill
   * @param {User} user
   * @returns {Promise<BooleanTuple>}
   */
  static async cancelAndCopy(bill, user) {
    try {
      return await transaction(async (tsql) => {
        const updated = await tsql.exec`
            UPDATE BILLS
            SET
              CANCELED_AT = CURRENT_TIMESTAMP,
              CANCELED_BY = ${user.id},
              CANCELATION_DETAILS = ${bill.cancelationDetails}
            WHERE 
              ID = ${bill.id} AND 
              PAID_AT IS NULL AND
              CANCELED_AT IS NULL 
          `.run();

        if (updated.affectedRows !== 1)
          return [null, new Error("Falha ao cancelar")];

        const created = await tsql.exec`
            INSERT INTO BILLS (DUE_DATE, VALUE, DESCRIPTION, CREATED_BY) 
            VALUES (${bill.dueDate}, ${bill.value}, ${bill.description}, ${user.id})
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
   * @param {PayBill} bill
   * @param {User} auth
   * @returns {Promise<BooleanTuple>}
   */
  static async pay(bill, user) {
    try {
      const updated = await sql.exec`
            UPDATE BILLS
            SET
              PAID_AT = CURRENT_TIMESTAMP,
              PAID_BY = ${user.id}
            WHERE 
              ID = ${bill.id} AND
              PAID_AT IS NULL AND
              CANCELED_AT IS NULL 
          `.run();

      if (updated.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {ExtendBill} bill
   * @param {User} auth
   * @returns {Promise<BooleanTuple>}
   */
  static async extend(bill, user) {
    try {
      const response = await sql.query`
        SELECT DUE_DATE 
        FROM BILLS 
        WHERE 
          ID = ${bill.id} AND 
          PAID_AT IS NULL AND
          EXTENDED_AT IS NULL AND
          CANCELED_AT IS NULL 
        `.run();

      if (!Array.isArray(response)) return [false, null];

      const oldDueDate = response[0].DUE_DATE;

      if (Date.parse(oldDueDate) === Date.parse(bill.newDueDate)) {
        return [null, new SameDueDateError()];
      }

      const updated = await sql.exec`
            UPDATE BILLS
            SET
              EXTENDED_AT = CURRENT_TIMESTAMP,
              EXTENDED_BY = ${user.id},
              EXTENDED_DETAILS = ${bill.details},
              EXTENDED_FROM = ${oldDueDate},
              DUE_DATE = ${bill.newDueDate}
            WHERE 
              ID = ${bill.id} AND 
              PAID_AT IS NULL AND
              EXTENDED_AT IS NULL AND
              CANCELED_AT IS NULL 
          `.run();

      if (updated.affectedRows < 1) return [false, null];

      return [true, null];
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {CancelBill} bill
   * @param {User} auth
   * @returns {Promise<BooleanTuple>}
   */
  static async cancel(bill, user) {
    try {
      const updated = await sql.exec`
            UPDATE BILLS
            SET
              CANCELED_AT = CURRENT_TIMESTAMP,
              CANCELED_BY = ${user.id},
              CANCELATION_DETAILS = ${bill.details}
            WHERE 
              ID = ${bill.id} AND 
              PAID_AT IS NULL AND
              CANCELED_AT IS NULL 
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
 * @typedef {Object} FindAllBillsFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<ListedBill>, null]|[null, Error]} FindAllBillsTuple
 */

/**
 * @typedef {[PersistedAllocationType|null, null]|[null, Error]} FindAllocationTypeByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

/**
 * @typedef {Object} BillRaw
 * @prop {int} ID
 * @prop {Date} DUE_DATE
 * @prop {number} VALUE
 * @prop {string} DESCRIPTION
 * @prop {Date} CREATED_AT
 * @prop {number} CREATED_BY
 * @prop {Date|null} EXTENDED_AT
 * @prop {number|null} EXTENDED_BY
 * @prop {Date|null} EXTENDED_FROM
 * @prop {Date|null} PAID_AT
 * @prop {number|null} PAID_BY
 * @prop {Date|null} CANCELED_AT
 * @prop {number|null} CANCELED_BY
 * @prop {string|null} CANCELATION_DETAILS
 * @prop {string} STATUS
 */

/**
 * @typedef {Object} FullBillRaw
 * @prop {int} ID
 * @prop {Date} DUE_DATE
 * @prop {number} VALUE
 * @prop {string} DESCRIPTION
 * @prop {Date} CREATED_AT
 * @prop {number} CREATED_BY
 * @prop {string|null} CREATED_BY_NAME
 * @prop {Date|null} EXTENDED_AT
 * @prop {number|null} EXTENDED_BY
 * @prop {string|null} EXTENDED_BY_NAME
 * @prop {Date|null} EXTENDED_FROM
 * @prop {string|null} EXTENDED_DETAILS
 * @prop {Date|null} PAID_AT
 * @prop {number|null} PAID_BY
 * @prop {string|null} PAID_BY_NAME
 * @prop {Date|null} CANCELED_AT
 * @prop {number|null} CANCELED_BY
 * @prop {string|null} CANCELED_BY_NAME
 * @prop {string|null} CANCELATION_DETAILS
 */

/**
 * @typedef {Object} BillCancelation
 * @prop {string} at
 * @prop {import("../global.js").User} byUser
 * @prop {string} details
 */

/**
 * @typedef {Object} BillExtension
 * @prop {string} at
 * @prop {import("../global.js").User} byUser
 * @prop {string} details
 * @prop {string} from
 */

/**
 * @typedef {Object} FullBill
 * @prop {number} id
 * @prop {string} dueDate
 * @prop {number} value
 * @prop {string} description
 * @prop {import("../global.js").UserTimestamp} created
 * @prop {import("../global.js").UserTimestamp|null} paid
 * @prop {BillCancelation|null} canceled
 * @prop {BillExtension|null} extended
 */

/**
 * @typedef {[FullBill|null, null]|[null, Error]} FindBillByIdTuple
 */

/**
 * @typedef {Object} ListedBill
 * @prop {int} id
 * @prop {string} dueDate
 * @prop {number} value
 * @prop {string} description
 * @prop {'UNPAID'|'PAID'|'EXTENDED'|'CANCELED'} status
 * @prop {string|null} extendedFrom
 **/

/**
 * @typedef {Object} PersistedBill
 * @prop {int} id
 * @prop {Date} dueDate
 * @prop {number} value
 * @prop {string} description
 * @prop {import("../global.js").UserTimestamp} creation
 * @prop {import("../global.js").UserTimestamp|null} extension
 * @prop {import("../global.js").UserTimestamp|null} payment
 * @prop {(import("../global.js").UserTimestamp&{details:string;})|null} cancellation
 */

/**
 * @typedef {Object} Bill
 * @prop {string} name
 * @prop {string} description
 * @prop {string} dueDate
 * @prop {number} value
 */

/**
 * @typedef {Object} CancelAndCopyBill
 * @prop {string} name
 * @prop {string} description
 * @prop {string} dueDate
 * @prop {number} value
 * @prop {string} cancelationDetails
 */

/**
 * @typedef {Object} PayBill
 * @prop {number} id
 */

/**
 * @typedef {Object} ExtendBill
 * @prop {number} id
 * @prop {string} newDueDate
 * @prop {string} details
 */

/**
 * @typedef {Object} CancelBill
 * @prop {number} id
 * @prop {string} details
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
