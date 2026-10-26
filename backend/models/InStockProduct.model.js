import sql, { transaction } from "./core/sql.js";

/**
 * @typedef {object} StockRoomChange
 * @property {number} id
 * @property {number} count
 */

/**
 * @typedef {object} StockChange
 * @property {number} productId
 * @property {number} total
 * @property {Date|string} expiresAt
 * @property {StockRoomChange[]} rooms
 */

/**
 * @typedef {object} FindAllInStockProductsFilter
 * @property {string} [query] Texto para pesquisar pelo nome do produto.
 * @property {number} [page] Número da página, começando em 1.
 * @property {number} [perPage] Quantidade de itens por página.
 */

/**
 * @typedef {object} InStockProductRaw
 * @property {number} ID
 * @property {number} PRODUCT_ID
 * @property {string} NAME
 * @property {string} EXPIRES_AT
 * @property {number} COUNT
 */

/**
 * @typedef {object} PersistedInStockProduct
 * @property {number} id
 * @property {number} productId
 * @property {string} name
 * @property {string} expiresAt Data de validade no formato DD/MM/YYYY.
 * @property {number} count
 */

/**
 * @typedef {object} InStockProductDetailRaw
 * @property {number} ID
 * @property {number} PRODUCT_ID
 * @property {string} NAME
 * @property {string} EXPIRES_AT
 * @property {number} COUNT
 */

/**
 * @typedef {object} InStockProductRoomRaw
 * @property {number} ID
 * @property {string} NAME
 * @property {number} COUNT
 */

/**
 * @typedef {object} InStockProductRoom
 * @property {number} id
 * @property {string} name
 * @property {number} count
 */

/**
 * @typedef {object} PersistedInStockProductDetails
 * @property {number} id
 * @property {number} productId
 * @property {string} name
 * @property {string} expiresAt Data de validade no formato DD/MM/YYYY.
 * @property {number} count
 * @property {InStockProductRoom[]} rooms
 */

/**
 * @typedef {[PersistedInStockProductDetails|null, null]|[null, Error]} FindInStockProductByIdTuple
 */

/**
 * @typedef {object} FindAllInStockProductsPage
 * @property {PersistedInStockProduct[]} items
 * @property {number} totalRecords
 * @property {number} page
 * @property {number} totalPages
 * @property {string} [query]
 */

/**
 * @typedef {[FindAllInStockProductsPage, null]|[null, Error]} FindAllInStockProductsTuple
 */

/**
 * @typedef {{TOTAL: number}[]} CountRaw
 */

export default class InStockProductModel {
  /**
   * Lista os produtos em estoque, agrupados por produto e data de validade,
   * em ordem de vencimento mais próximo.
   *
   * @param {FindAllInStockProductsFilter} filter
   * @returns {Promise<FindAllInStockProductsTuple>}
   */
  static async findAll({ query, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query ?? ""}%`;
      const whereClause = query
        ? sql`WHERE P.NAME LIKE ${likeQuery}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[InStockProductRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT
            STOCK.ID,
            STOCK.PRODUCT_ID,
            STOCK.NAME,
            DATE_FORMAT(STOCK.EXPIRATION_DATE, '%d/%m/%Y') AS EXPIRES_AT,
            STOCK.COUNT
          FROM (
            SELECT
              MIN(ISP.ID) AS ID,
              P.ID AS PRODUCT_ID,
              P.NAME,
              DATE(ISP.EXPIRES_AT) AS EXPIRATION_DATE,
              SUM(ISP.COUNT) AS COUNT
            FROM IN_STOCK_PRODUCTS ISP
            INNER JOIN PRODUCTS P ON P.ID = ISP.PRODUCT_ID
            ${whereClause}
            GROUP BY P.ID, P.NAME, DATE(ISP.EXPIRES_AT)
            HAVING SUM(ISP.COUNT) <> 0
          ) AS STOCK
          ORDER BY STOCK.EXPIRATION_DATE ASC
          ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM (
            SELECT ISP.PRODUCT_ID, DATE(ISP.EXPIRES_AT) AS EXPIRATION_DATE
            FROM IN_STOCK_PRODUCTS ISP
            INNER JOIN PRODUCTS P ON P.ID = ISP.PRODUCT_ID
            ${whereClause}
            GROUP BY ISP.PRODUCT_ID, DATE(ISP.EXPIRES_AT)
            HAVING SUM(ISP.COUNT) <> 0
          ) AS STOCK_GROUPS`.run(),
      ]);

      return [
        {
          items: data.map((datum) => ({
            id: datum.ID,
            productId: datum.PRODUCT_ID,
            name: datum.NAME,
            expiresAt: datum.EXPIRES_AT,
            count: datum.COUNT,
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
   * Busca os dados de um registro de produto em estoque e as salas onde está
   * armazenado.
   *
   * @param {number} id
   * @returns {Promise<FindInStockProductByIdTuple>}
   */
  static async findById(id) {
    try {
      /** @type {InStockProductDetailRaw[]} */
      const stockRows = await sql.query`
        SELECT
          ISP.ID,
          P.ID AS PRODUCT_ID,
          P.NAME,
          DATE_FORMAT(DATE(ISP.EXPIRES_AT), '%d/%m/%Y') AS EXPIRES_AT,
          ISP.COUNT
        FROM IN_STOCK_PRODUCTS ISP
        INNER JOIN PRODUCTS P ON P.ID = ISP.PRODUCT_ID
        WHERE ISP.ID = ${id}`.run();

      if (stockRows.length === 0) return [null, null];

      const stock = stockRows[0];
      /** @type {InStockProductRoomRaw[]} */
      const rooms = await sql.query`
        SELECT
          S.ID,
          S.NOME AS NAME,
          SUM(IR.STORED_COUNT) AS COUNT
        FROM ISP_IN_ROOM IR
        INNER JOIN SALAS S ON S.ID = IR.ROOM_ID
        WHERE IR.ISP_ID = ${id}
        GROUP BY S.ID, S.NOME
        ORDER BY S.NOME`.run();

      return [
        {
          id: stock.ID,
          productId: stock.PRODUCT_ID,
          name: stock.NAME,
          expiresAt: stock.EXPIRES_AT,
          count: stock.COUNT,
          rooms: rooms.map((room) => ({
            id: room.ID,
            name: room.NAME,
            count: room.COUNT,
          })),
        },
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * Aplica alterações ao estoque, agrupando registros por produto e data de
   * validade. Atualiza as quantidades apenas das salas informadas.
   *
   * @param {StockChange[]} changes
   * @returns {Promise<[boolean, Error|null]>}
   */
  static async updateStock(changes) {
    try {
      const validChanges = InStockProductModel.#validateChanges(changes);

      return await transaction(async (tx) => {
        for (const change of validChanges) {
          const stockRows = await tx.query`
            SELECT ID
            FROM IN_STOCK_PRODUCTS
            WHERE PRODUCT_ID = ${change.productId}
              AND DATE(EXPIRES_AT) = ${change.expiresAt}
            LIMIT 1
            FOR UPDATE`.run();

          let stockId;

          if (stockRows.length > 0) {
            stockId = stockRows[0].ID;
            await tx.exec`
              UPDATE IN_STOCK_PRODUCTS
              SET COUNT = COUNT + ${change.total}
              WHERE ID = ${stockId}`.run();
          } else {
            const result = await tx.exec`
              INSERT INTO IN_STOCK_PRODUCTS
                (PRODUCT_ID, COUNT, EXPIRES_AT, CREATED_AT)
              VALUES (
                ${change.productId},
                ${change.total},
                ${change.expiresAt},
                CURRENT_TIMESTAMP
              )`.run();

            stockId = result.insertId;
          }

          for (const room of change.rooms) {
            const roomRows = await tx.query`
              SELECT ID
              FROM ISP_IN_ROOM
              WHERE ISP_ID = ${stockId} AND ROOM_ID = ${room.id}
              LIMIT 1
              FOR UPDATE`.run();

            if (roomRows.length > 0) {
              await tx.exec`
                UPDATE ISP_IN_ROOM
                SET STORED_COUNT = STORED_COUNT + ${room.count}
                WHERE ID = ${roomRows[0].ID}`.run();
            } else {
              await tx.exec`
                INSERT INTO ISP_IN_ROOM (ISP_ID, ROOM_ID, STORED_COUNT)
                VALUES (${stockId}, ${room.id}, ${room.count})`.run();
            }
          }
        }

        return [true, null];
      });
    } catch (error) {
      return [false, error];
    }
  }

  /**
   * @param {StockChange[]} changes
   * @returns {Array<StockChange & {expiresAt: string}>}
   */
  static #validateChanges(changes) {
    if (!Array.isArray(changes)) {
      throw new TypeError("As alterações de estoque devem ser um array");
    }

    return changes.map((change) => {
      if (
        !change ||
        !Number.isSafeInteger(change.productId) ||
        change.productId <= 0 ||
        !Number.isSafeInteger(change.total) ||
        !Array.isArray(change.rooms)
      ) {
        throw new TypeError(
          "Cada alteração de estoque deve conter productId, total e rooms válidos",
        );
      }

      const rooms = change.rooms.map((room) => {
        if (
          !room ||
          !Number.isSafeInteger(room.id) ||
          room.id <= 0 ||
          !Number.isSafeInteger(room.count)
        ) {
          throw new TypeError(
            "Cada alteração de sala deve conter id e count válidos",
          );
        }

        return room;
      });

      const roomsTotal = rooms.reduce((total, room) => total + room.count, 0);

      if (rooms.length > 0) {
        if (roomsTotal > change.total) {
          throw new RangeError(
            "A soma das quantidades das salas não pode ser maior que o total do produto",
          );
        } else if (roomsTotal < change.total) {
          throw new RangeError(
            "A soma das quantidades das salas não pode ser menor que o total do produto",
          );
        }
      }

      return {
        ...change,
        expiresAt: InStockProductModel.#formatExpirationDate(change.expiresAt),
        rooms,
      };
    });
  }

  /**
   * Converte uma data para o formato YYYY-MM-DD usado no agrupamento do estoque.
   *
   * @param {Date|string} value
   * @returns {string}
   */
  static #formatExpirationDate(value) {
    const date =
      value instanceof Date ? value.toISOString().slice(0, 10) : value;

    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)) ||
      new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date
    ) {
      throw new TypeError(
        "expiresAt deve ser uma data válida no formato YYYY-MM-DD",
      );
    }

    return date;
  }
}
