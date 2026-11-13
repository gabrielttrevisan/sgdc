import sql, { transaction } from "./core/sql.js";
import InStockProductModel from "./InStockProduct.model.js";

export class DiscardValidationError extends Error {}
export class InsufficientDiscardStockError extends Error {}

export default class DiscardModel {
  /**
   * @param {{query?: string, page?: number, perPage?: number}} filter
   * @returns {Promise<[object|null, Error|null]>}
   */
  static async findAll({ query, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query ?? ""}%`;
      const whereClause = query
        ? sql`WHERE EXISTS (
              SELECT 1
              FROM ISPD_PRODUCTS DP
                INNER JOIN ISP_IN_ROOM IR ON IR.ID = DP.IN_STOCK_PRODUCT_ID
                INNER JOIN IN_STOCK_PRODUCTS ISP ON ISP.ID = IR.ISP_ID
                INNER JOIN PRODUCTS P ON P.ID = ISP.PRODUCT_ID
              WHERE DP.DISCARD_ID = D.ID AND P.NAME LIKE ${likeQuery}
            )
            OR EXISTS (
              SELECT 1
              FROM DISCARD_VOLUNTEERS DV
                INNER JOIN VOLUNTEERS V ON V.ID = DV.VOLUNTEER_ID
              WHERE DV.DISCARD_ID = D.ID AND V.NAME LIKE ${likeQuery}
            )`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;
      const [rows, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT
            D.ID,
            D.DETAILS,
            D.CREATED_AT,
            D.ALLOCATION_ID,
            COALESCE((
              SELECT SUM(DP.QUANTITY)
              FROM ISPD_PRODUCTS DP
              WHERE DP.DISCARD_ID = D.ID
            ), 0) AS PRODUCTS_DISCARDED,
            U.ID AS CREATED_BY_ID,
            U.NAME AS CREATED_BY_NAME
          FROM ISP_DISCARDS D
            INNER JOIN USERS U ON U.ID = D.CREATED_BY
          ${whereClause}
          ORDER BY D.CREATED_AT DESC, D.ID DESC
          ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM ISP_DISCARDS D
          ${whereClause}`.run(),
      ]);

      return [
        {
          items: rows.map((row) => ({
            id: row.ID,
            details: row.DETAILS,
            createdAt: row.CREATED_AT,
            allocationId: row.ALLOCATION_ID,
            productsDiscarded: Number(row.PRODUCTS_DISCARDED),
            createdBy: { id: row.CREATED_BY_ID, name: row.CREATED_BY_NAME },
          })),
          totalRecords: total,
          page,
          totalPages: Math.ceil(total / perPage),
          query,
        },
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<[object|null, Error|null]>}
   */
  static async findById(id) {
    try {
      const rows = await sql.query`
        SELECT
          D.ID,
          D.DETAILS,
          D.CREATED_AT,
          U.ID AS CREATED_BY_ID,
          U.NAME AS CREATED_BY_NAME
        FROM ISP_DISCARDS D
          INNER JOIN USERS U ON U.ID = D.CREATED_BY
        WHERE D.ID = ${id}`.run();

      if (rows.length === 0) return [null, null];

      const [products, volunteers] = await Promise.all([
        sql.query`
          SELECT
            P.NAME AS PRODUCT_NAME,
            DP.QUANTITY,
            S.NOME AS ROOM_NAME,
            DP.DETAILS
          FROM ISPD_PRODUCTS DP
            INNER JOIN ISP_IN_ROOM IR ON IR.ID = DP.IN_STOCK_PRODUCT_ID
            INNER JOIN IN_STOCK_PRODUCTS ISP ON ISP.ID = IR.ISP_ID
            INNER JOIN PRODUCTS P ON P.ID = ISP.PRODUCT_ID
            INNER JOIN SALAS S ON S.ID = IR.ROOM_ID
          WHERE DP.DISCARD_ID = ${id}
          ORDER BY P.NAME`.run(),
        sql.query`
          SELECT V.NAME, DV.DETAILS
          FROM DISCARD_VOLUNTEERS DV
            INNER JOIN VOLUNTEERS V ON V.ID = DV.VOLUNTEER_ID
          WHERE DV.DISCARD_ID = ${id}
          ORDER BY V.NAME`.run(),
      ]);
      const discard = rows[0];

      return [
        {
          id: discard.ID,
          details: discard.DETAILS,
          createdAt: discard.CREATED_AT,
          createdBy: {
            id: discard.CREATED_BY_ID,
            name: discard.CREATED_BY_NAME,
          },
          products: products.map((product) => ({
            name: product.PRODUCT_NAME,
            quantity: product.QUANTITY,
            roomName: product.ROOM_NAME,
            details: product.DETAILS,
          })),
          volunteers: volunteers.map((volunteer) => ({
            name: volunteer.NAME,
            details: volunteer.DETAILS,
          })),
        },
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @param {{details:string, allocationId?:number|null, products:{ispInRoomId:number,quantity:number,details?:string|null}[], volunteers:{id:number,details?:string|null}[]}} discard
   * @param {number|string} userId
   * @returns {Promise<[boolean, Error|null]>}
   */
  static async create(
    { details, allocationId, products, volunteers },
    userId,
  ) {
    try {
      const normalizedProducts = products.map((product) => ({
        ispInRoomId: Number(product.ispInRoomId),
        quantity: Number(product.quantity),
        details: product.details ?? null,
      }));
      const normalizedVolunteers = volunteers.map((volunteer) => ({
        id: Number(volunteer.id),
        details: volunteer.details ?? null,
      }));

      return await transaction(async (tx) => {
        const roomIds = [
          ...new Set(normalizedProducts.map((product) => product.ispInRoomId)),
        ];
        const roomList = tx.join(",", ...roomIds.map((id) => tx`${id}`));
        const stockRows = await tx.query`
          SELECT
            IR.ID,
            IR.ISP_ID,
            IR.ROOM_ID,
            ISP.PRODUCT_ID,
            DATE_FORMAT(DATE(ISP.EXPIRES_AT), '%Y-%m-%d') AS EXPIRES_AT
          FROM ISP_IN_ROOM IR
            INNER JOIN IN_STOCK_PRODUCTS ISP ON ISP.ID = IR.ISP_ID
          WHERE IR.ID IN (${roomList})
          ORDER BY IR.ID
          FOR UPDATE`.run();
        const stockByRoomId = new Map(stockRows.map((row) => [row.ID, row]));

        if (stockByRoomId.size !== roomIds.length)
          return [
            false,
            new DiscardValidationError(
              "Um ou mais produtos não existem no estoque",
            ),
          ];

        const changesByLocation = new Map();
        for (const product of normalizedProducts) {
          const stock = stockByRoomId.get(product.ispInRoomId);
          const key = `${stock.ISP_ID}:${stock.ROOM_ID}`;
          const change = changesByLocation.get(key) ?? {
            stockId: stock.ISP_ID,
            productId: stock.PRODUCT_ID,
            expiresAt: stock.EXPIRES_AT,
            total: 0,
            rooms: [{ id: stock.ROOM_ID, count: 0 }],
          };
          change.total -= product.quantity;
          change.rooms[0].count -= product.quantity;
          changesByLocation.set(key, change);
        }

        const result = await tx.exec`
          INSERT INTO ISP_DISCARDS (DETAILS, ALLOCATION_ID, CREATED_BY)
          VALUES (${details.trim()}, ${allocationId ?? null}, ${Number(userId)})`.run();

        if (!result.insertId)
          return [false, new Error("Falha ao registrar descarte")];

        const [stockUpdated, stockError] = await InStockProductModel.updateStock(
          [...changesByLocation.values()],
          tx,
        );
        if (!stockUpdated) {
          if (stockError instanceof RangeError)
            return [
              false,
              new InsufficientDiscardStockError(stockError.message),
            ];
          return [false, stockError];
        }

        const productValues = tx.join(
          ",",
          ...normalizedProducts.map(
            (product) =>
              tx`(${result.insertId}, ${product.ispInRoomId}, ${product.quantity}, ${product.details})`,
          ),
        );
        await tx.exec`
          INSERT INTO ISPD_PRODUCTS
            (DISCARD_ID, IN_STOCK_PRODUCT_ID, QUANTITY, DETAILS)
          VALUES ${productValues}`.run();

        if (normalizedVolunteers.length > 0) {
          const volunteerValues = tx.join(
            ",",
            ...normalizedVolunteers.map(
              (volunteer) =>
                tx`(${result.insertId}, ${volunteer.id}, ${volunteer.details})`,
            ),
          );
          await tx.exec`
            INSERT INTO DISCARD_VOLUNTEERS (DISCARD_ID, VOLUNTEER_ID, DETAILS)
            VALUES ${volunteerValues}`.run();
        }

        return [true, null];
      });
    } catch (error) {
      return [false, error];
    }
  }
}
