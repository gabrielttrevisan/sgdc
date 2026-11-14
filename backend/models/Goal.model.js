import sql from "./core/sql.js";

/**
 * @typedef {Object} FindAllGoalsFilter
 * @prop {string} [query]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

export default class GoalModel {
  /**
   * @param {FindAllGoalsFilter} filter
   */
  static async findAll({ query, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE G.NAME LIKE ${likeQuery} OR G.DESCRIPTION LIKE ${likeQuery}`
        : sql.empty;
      const progressJoin = sql`
        LEFT JOIN (
          SELECT GR.GOAL_ID, SUM(A.VALOR) AS COMPLETED
          FROM GOAL_REGISTRIES GR
          INNER JOIN ARRECADACOES A ON A.ID = GR.ITEM_DRIVE_ID
          GROUP BY GR.GOAL_ID
        ) GP ON GP.GOAL_ID = G.ID
      `;

      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT
            G.ID,
            G.NAME,
            DATE_FORMAT(G.START_AT, '%Y-%m-%d') AS START_AT,
            DATE_FORMAT(G.END_AT, '%Y-%m-%d') AS END_AT,
            G.GOAL,
            G.IS_GLOBAL,
            MU.NAME AS UNIT_NAME,
            COALESCE(GP.COMPLETED, 0) AS COMPLETED
          FROM GOALS G
          LEFT JOIN MEASURING_UNITS MU ON MU.ID = G.UNIT_ID
          ${progressJoin}
          ${whereClause}
          ORDER BY G.START_AT DESC, G.ID DESC
          LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
        `.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM GOALS G
          ${whereClause}
        `.run(),
      ]);

      return [
        {
          items: data.map((row) => GoalModel.#toListItem(row)),
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
   */
  static async findById(id) {
    try {
      const rows = await sql.query`
        SELECT
          G.ID,
          G.NAME,
          G.DESCRIPTION,
          DATE_FORMAT(G.START_AT, '%Y-%m-%d') AS START_AT,
          DATE_FORMAT(G.END_AT, '%Y-%m-%d') AS END_AT,
          G.GOAL,
          G.IS_GLOBAL,
          MU.NAME AS UNIT_NAME,
          COALESCE(GP.COMPLETED, 0) AS COMPLETED
        FROM GOALS G
        LEFT JOIN MEASURING_UNITS MU ON MU.ID = G.UNIT_ID
        LEFT JOIN (
          SELECT GR.GOAL_ID, SUM(A.VALOR) AS COMPLETED
          FROM GOAL_REGISTRIES GR
          INNER JOIN ARRECADACOES A ON A.ID = GR.ITEM_DRIVE_ID
          GROUP BY GR.GOAL_ID
        ) GP ON GP.GOAL_ID = G.ID
        WHERE G.ID = ${id}
        LIMIT 1
      `.run();

      if (rows.length === 0) return [null, null];

      return [GoalModel.#toDetails(rows[0]), null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  /**
   * @param {GoalToCreate} goal
   * @param {number} createdBy
   */
  static async create(goal, createdBy) {
    try {
      if (goal.unitId !== null) {
        const units = await sql.query`
          SELECT ID
          FROM MEASURING_UNITS
          WHERE ID = ${goal.unitId}
            AND DELETED_AT IS NULL
          LIMIT 1
        `.run();

        if (units.length === 0) return [null, "UNIT_NOT_FOUND"];
      }

      const result = await sql.exec`
        INSERT INTO GOALS (
          NAME,
          DESCRIPTION,
          START_AT,
          END_AT,
          GOAL,
          IS_GLOBAL,
          UNIT_ID,
          CREATED_BY
        )
        VALUES (
          ${goal.name},
          ${goal.description},
          ${goal.startAt},
          ${goal.endAt},
          ${goal.goal},
          ${goal.isGlobal ? 1 : 0},
          ${goal.unitId},
          ${createdBy}
        )
      `.run();

      return [{ id: result.insertId }, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }

  static #toListItem(row) {
    const isGlobal = Boolean(row.IS_GLOBAL);

    return {
      id: row.ID,
      name: row.NAME,
      startAt: GoalModel.#toDateString(row.START_AT),
      endAt: GoalModel.#toDateString(row.END_AT),
      type: isGlobal ? "geral" : row.UNIT_NAME || "—",
      goal: Number(row.GOAL),
      percentage: GoalModel.#percentage(row.COMPLETED, row.GOAL),
    };
  }

  static #toDetails(row) {
    const isGlobal = Boolean(row.IS_GLOBAL);

    return {
      id: row.ID,
      name: row.NAME,
      description: row.DESCRIPTION,
      startAt: GoalModel.#toDateString(row.START_AT),
      endAt: GoalModel.#toDateString(row.END_AT),
      goal: Number(row.GOAL),
      isGlobal,
      unitName: row.UNIT_NAME,
      type: isGlobal ? "geral" : row.UNIT_NAME || "—",
      percentage: GoalModel.#percentage(row.COMPLETED, row.GOAL),
    };
  }

  static #percentage(completed, goal) {
    const target = Number(goal);
    if (!target) return "0%";

    return `${Math.round((Number(completed) / target) * 100)}%`;
  }

  static #toDateString(value) {
    if (value == null) return null;
    if (typeof value === "string") return value.slice(0, 10);

    const date = new Date(value);
    return date.toISOString().slice(0, 10);
  }
}

/**
 * @typedef {Object} GoalToCreate
 * @prop {string} name
 * @prop {string|null} description
 * @prop {string} startAt
 * @prop {string} endAt
 * @prop {number} goal
 * @prop {boolean} isGlobal
 * @prop {number|null} unitId
 */
