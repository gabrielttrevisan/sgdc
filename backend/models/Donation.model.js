import sql, { transaction } from "./core/sql.js";
import InStockProductModel from "./InStockProduct.model.js";

export class DonationValidationError extends Error {}
export class DonationNotFoundError extends Error {}
export class InsufficientDonationStockError extends Error {}

export default class DonationModel {
  /**
   * @param {number} beneficiaryId
   * @returns {Promise<[{beneficiary: object, family: object|null, representatives: object[], attendances: object[]}|null, Error|null]>}
   */
  static async getBeneficiaryContext(beneficiaryId) {
    try {
      const beneficiaryRows = await sql.query`
        SELECT
          B.ID,
          B.FULL_NAME,
          CASE WHEN F.ID IS NULL THEN NULL ELSE FP.FAM_ID END AS FAMILY_ID,
          F.NAME AS FAMILY_NAME
        FROM BENEFICIARIES B
          LEFT JOIN FAMILY_PARTICIPANTS FP ON FP.BEN_ID = B.ID
          LEFT JOIN FAMILIES F ON F.ID = FP.FAM_ID AND F.DELETED_AT IS NULL
        WHERE B.ID = ${beneficiaryId} AND B.DELETED_AT IS NULL
        ORDER BY FP.FAM_ID
        LIMIT 1`.run();

      if (beneficiaryRows.length === 0) return [null, null];

      const beneficiary = beneficiaryRows[0];
      let representatives = [];

      if (beneficiary.FAMILY_ID) {
        const representativeRows = await sql.query`
          SELECT B.ID, B.FULL_NAME
          FROM FAMILY_PARTICIPANTS FP
            INNER JOIN BENEFICIARIES B ON B.ID = FP.BEN_ID
          WHERE FP.FAM_ID = ${beneficiary.FAMILY_ID}
            AND FP.IS_RESPOSIBLE = 1
            AND B.DELETED_AT IS NULL
          ORDER BY B.FULL_NAME`.run();

        representatives = representativeRows.map((row) => ({
          id: row.ID,
          name: row.FULL_NAME,
        }));
      }

      const attendanceRows = await sql.query`
        SELECT
          CA.ID AS ATTENDANCE_ID,
          CA.DETAILS AS ATTENDANCE_DETAILS,
          CAR.PRODUCT_ID,
          P.NAME AS PRODUCT_NAME,
          CAR.QUANTITY AS REQUESTED_QUANTITY,
          ISP.ID AS ISP_ID,
          ISP.COUNT AS STOCK_COUNT,
          DATE_FORMAT(DATE(ISP.EXPIRES_AT), '%Y-%m-%d') AS EXPIRES_AT
        FROM CLIENT_ATTENDANCES CA
          LEFT JOIN CLIENT_ATTENDANCE_REQUEST CAR
            ON CAR.ATTENDANCE_ID = CA.ID
          LEFT JOIN PRODUCTS P ON P.ID = CAR.PRODUCT_ID
          LEFT JOIN IN_STOCK_PRODUCTS ISP
            ON ISP.PRODUCT_ID = CAR.PRODUCT_ID AND ISP.COUNT > 0
        WHERE CA.BENEFICIARY_ID = ${beneficiaryId}
          AND CA.CANCELLED_AT IS NULL
        ORDER BY CA.ID DESC, P.NAME, ISP.EXPIRES_AT, ISP.ID`.run();

      const attendances = new Map();
      for (const row of attendanceRows) {
        if (!attendances.has(row.ATTENDANCE_ID)) {
          attendances.set(row.ATTENDANCE_ID, {
            id: row.ATTENDANCE_ID,
            details: row.ATTENDANCE_DETAILS,
            requestedItems: [],
          });
        }

        if (!row.PRODUCT_ID || !row.ISP_ID) continue;

        const attendance = attendances.get(row.ATTENDANCE_ID);
        let requestedItem = attendance.requestedItems.find(
          (item) => item.product.id === row.PRODUCT_ID,
        );

        if (!requestedItem) {
          requestedItem = {
            product: { id: row.PRODUCT_ID, name: row.PRODUCT_NAME },
            quantity: row.REQUESTED_QUANTITY,
            stock: [],
          };
          attendance.requestedItems.push(requestedItem);
        }

        requestedItem.stock.push({
          id: row.ISP_ID,
          productId: row.PRODUCT_ID,
          name: row.PRODUCT_NAME,
          expiresAt: row.EXPIRES_AT,
          count: row.STOCK_COUNT,
        });
      }

      return [
        {
          beneficiary: { id: beneficiary.ID, name: beneficiary.FULL_NAME },
          family: beneficiary.FAMILY_ID
            ? { id: beneficiary.FAMILY_ID, name: beneficiary.FAMILY_NAME }
            : null,
          representatives,
          attendances: [...attendances.values()],
        },
        null,
      ];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {{beneficiaryId:number, responsibleId:number, attendanceId?:number, details:string, items:{ispId:number,quantity:number}[]}} donation
   * @param {number} userId
   * @returns {Promise<[boolean, Error|null]>}
   */
  static async create(
    { beneficiaryId, responsibleId, attendanceId, details, items },
    userId,
  ) {
    try {
      beneficiaryId = Number(beneficiaryId);
      responsibleId = Number(responsibleId);
      attendanceId = attendanceId == null ? undefined : Number(attendanceId);
      items = items.map(({ ispId, quantity }) => ({
        ispId: Number(ispId),
        quantity: Number(quantity),
      }));

      return await transaction(async (tx) => {
        const familyRows = await tx.query`
          SELECT F.ID AS FAMILY_ID
          FROM BENEFICIARIES B
            INNER JOIN FAMILY_PARTICIPANTS FP ON FP.BEN_ID = B.ID
            INNER JOIN FAMILIES F ON F.ID = FP.FAM_ID
          WHERE B.ID = ${beneficiaryId}
            AND B.DELETED_AT IS NULL
            AND F.DELETED_AT IS NULL
          ORDER BY F.ID
          LIMIT 1
          FOR UPDATE`.run();

        if (familyRows.length !== 1)
          return [
            false,
            new DonationValidationError(
              "O beneficiário precisa pertencer a uma família ativa",
            ),
          ];

        const familyId = familyRows[0].FAMILY_ID;
        const representativeRows = await tx.query`
          SELECT BEN_ID
          FROM FAMILY_PARTICIPANTS
          WHERE FAM_ID = ${familyId}
            AND BEN_ID = ${responsibleId}
            AND IS_RESPOSIBLE = 1
          FOR UPDATE`.run();

        if (representativeRows.length !== 1)
          return [
            false,
            new DonationValidationError(
              "O representante não pertence à família do beneficiário",
            ),
          ];

        if (attendanceId !== undefined) {
          const attendanceRows = await tx.query`
            SELECT ID
            FROM CLIENT_ATTENDANCES
            WHERE ID = ${attendanceId}
              AND BENEFICIARY_ID = ${beneficiaryId}
              AND CANCELLED_AT IS NULL
            FOR UPDATE`.run();

          if (attendanceRows.length !== 1)
            return [
              false,
              new DonationValidationError(
                "O atendimento não pertence ao beneficiário ou está cancelado",
              ),
            ];
        }

        const ispIds = items.map(({ ispId }) => ispId);
        const stockRows = await tx.query`
          SELECT
            ID,
            PRODUCT_ID,
            COUNT,
            DATE_FORMAT(DATE(EXPIRES_AT), '%Y-%m-%d') AS EXPIRES_AT
          FROM IN_STOCK_PRODUCTS
          WHERE ID IN (${tx.join(",", ...ispIds.map((id) => tx`${id}`))})
          ORDER BY ID
          FOR UPDATE`.run();
        const stockById = new Map(stockRows.map((row) => [row.ID, row]));

        if (stockById.size !== items.length) {
          return [
            false,
            new DonationValidationError(
              "Um ou mais produtos não existem no estoque",
            ),
          ];
        }

        const changes = [];
        const donationItems = [];

        for (const item of items) {
          const stock = stockById.get(item.ispId);
          if (stock.COUNT < item.quantity)
            return [
              false,
              new InsufficientDonationStockError(
                "Estoque insuficiente para um ou mais produtos",
              ),
            ];

          const roomRows = await tx.query`
            SELECT ID, ROOM_ID, STORED_COUNT
            FROM ISP_IN_ROOM
            WHERE ISP_ID = ${stock.ID} AND STORED_COUNT > 0
            ORDER BY ID
            FOR UPDATE`.run();

          let roomQuantity = Math.min(
            item.quantity,
            roomRows.reduce((total, room) => total + room.STORED_COUNT, 0),
          );
          const roomChanges = [];

          for (const room of roomRows) {
            if (roomQuantity === 0) break;
            const quantity = Math.min(room.STORED_COUNT, roomQuantity);
            roomQuantity -= quantity;
            roomChanges.push({ id: room.ROOM_ID, count: -quantity });
            donationItems.push({
              stockId: stock.ID,
              productId: stock.PRODUCT_ID,
              quantity,
              roomId: room.ROOM_ID,
            });
          }

          const allocatedToRooms = roomChanges.reduce(
            (total, room) => total - room.count,
            0,
          );
          changes.push({
            stockId: stock.ID,
            productId: stock.PRODUCT_ID,
            expiresAt: stock.EXPIRES_AT,
            total: -allocatedToRooms,
            rooms: roomChanges,
          });

          const unallocatedQuantity = item.quantity - allocatedToRooms;
          if (unallocatedQuantity > 0) {
            changes.push({
              stockId: stock.ID,
              productId: stock.PRODUCT_ID,
              expiresAt: stock.EXPIRES_AT,
              total: -unallocatedQuantity,
              rooms: [],
            });
            donationItems.push({
              stockId: stock.ID,
              productId: stock.PRODUCT_ID,
              quantity: unallocatedQuantity,
              roomId: null,
            });
          }
        }

        const [stockUpdated, stockError] =
          await InStockProductModel.updateStock(changes, tx);
        if (!stockUpdated) return [false, stockError];

        const result = await tx.exec`
          INSERT INTO DONATIONS
            (BENEFICIARY_ID, FAMILY_ID, REPRESENTATIVE_ID, ATTENDANCE_ID,
             DETAILS, CREATED_BY)
          VALUES
            (${beneficiaryId}, ${familyId}, ${responsibleId},
             ${attendanceId ?? null}, ${details.trim()}, ${userId})`.run();

        if (!result.insertId)
          return [false, new Error("Falha ao registrar doação")];

        const itemValues = tx.join(
          ",",
          ...donationItems.map(
            (item) =>
              tx`(${result.insertId}, ${item.productId}, ${item.stockId},
                  ${item.quantity}, ${item.roomId})`,
          ),
        );
        const insertedItems = await tx.exec`
          INSERT INTO DONATION_ITEMS
            (DONATION_ID, PRODUCT_ID, ISP_ID, QUANTITY, ROOM_ID)
          VALUES ${itemValues}`.run();

        if (insertedItems.affectedRows !== donationItems.length)
          return [false, new Error("Falha ao registrar os produtos da doação")];

        return [true, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<[boolean, Error|null]>}
   */
  static async cancel(id, userId) {
    try {
      return await transaction(async (tx) => {
        const donations = await tx.query`
          SELECT ID, CANCELLED_AT
          FROM DONATIONS
          WHERE ID = ${id}
          FOR UPDATE`.run();

        if (donations.length === 0)
          return [false, new DonationNotFoundError("Doação não encontrada")];
        if (donations[0].CANCELLED_AT)
          return [false, new DonationValidationError("A doação já foi cancelada")];

        const items = await tx.query`
          SELECT
            DI.ISP_ID,
            DI.PRODUCT_ID,
            DI.ROOM_ID,
            SUM(DI.QUANTITY) AS QUANTITY,
            DATE_FORMAT(DATE(ISP.EXPIRES_AT), '%Y-%m-%d') AS EXPIRES_AT
          FROM DONATION_ITEMS DI
            INNER JOIN IN_STOCK_PRODUCTS ISP ON ISP.ID = DI.ISP_ID
          WHERE DI.DONATION_ID = ${id}
          GROUP BY DI.ISP_ID, DI.PRODUCT_ID, DI.ROOM_ID, DATE(ISP.EXPIRES_AT)
          `.run();

        if (items.length === 0)
          return [
            false,
            new DonationValidationError("A doação não possui produtos"),
          ];

        const changes = [];
        const byStock = new Map();

        for (const item of items) {
          if (!byStock.has(item.ISP_ID)) {
            byStock.set(item.ISP_ID, {
              productId: item.PRODUCT_ID,
              expiresAt: item.EXPIRES_AT,
              roomItems: [],
              unallocatedQuantity: 0,
            });
          }
          const stock = byStock.get(item.ISP_ID);
          if (item.ROOM_ID === null) stock.unallocatedQuantity += item.QUANTITY;
          else
            stock.roomItems.push({
              id: item.ROOM_ID,
              count: item.QUANTITY,
            });
        }

        for (const [stockId, stock] of byStock) {
          if (stock.roomItems.length > 0) {
            const roomTotal = stock.roomItems.reduce(
              (total, room) => total + room.count,
              0,
            );
            changes.push({
              stockId,
              productId: stock.productId,
              expiresAt: stock.expiresAt,
              total: roomTotal,
              rooms: stock.roomItems,
            });
          }

          if (stock.unallocatedQuantity > 0) {
            changes.push({
              stockId,
              productId: stock.productId,
              expiresAt: stock.expiresAt,
              total: stock.unallocatedQuantity,
              rooms: [],
            });
          }
        }

        const [stockUpdated, stockError] =
          await InStockProductModel.updateStock(changes, tx);
        if (!stockUpdated) return [false, stockError];

        const cancelled = await tx.exec`
          UPDATE DONATIONS
          SET CANCELLED_AT = CURRENT_TIMESTAMP,
              CANCELLED_BY = ${userId}
          WHERE ID = ${id} AND CANCELLED_AT IS NULL`.run();

        if (cancelled.affectedRows !== 1)
          return [false, new Error("Falha ao cancelar doação")];

        return [true, null];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }
}
