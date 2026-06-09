import ExintingFamilyParticipantsError from "../exception/ExistingFamilyParticipants.js";
import sql, { transaction } from "./core/sql.js";

export default class FamilyModel {
  /**
   * @param {FindAllFamiliesFilter} [filter]
   * @returns {Promise<FindAllFamiliesTuple>}
   */
  static async findAll({ query, sortKey, sortType, page = 1, perPage = 10 }) {
    try {
      const likeQuery = `%${query}%`;
      const whereClause = query
        ? sql`WHERE F.DELETED_AT IS NULL AND (F.NAME LIKE ${likeQuery})`
        : sql`WHERE F.DELETED_AT IS NULL`;
      const orderByColumn = sortKey === "name" ? sql`NAME` : sql.empty;
      const orderBySorting =
        sortKey === "name" ? sql.str(sortType.toUpperCase()) : sql`DESC`;
      const orderByClause = sortKey
        ? sql`ORDER BY ${orderByColumn} ${orderBySorting}`
        : sql.empty;
      const limitClause = sql`LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

      /** @type {[FamilyRaw[], CountRaw[]]} */
      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
              SELECT
                F.ID, F.NAME,
                FP.BEN_ID, B.FULL_NAME AS BEN_NAME,
                FP.IS_RESPOSIBLE
              FROM FAMILIES F
                INNER JOIN FAMILY_PARTICIPANTS FP
                  ON FP.FAM_ID = F.ID
                INNER JOIN BENEFICIARIES B
                  ON B.ID = FP.BEN_ID
              ${whereClause}
              ${orderByClause}
              ${limitClause}`.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM FAMILIES F
          ${whereClause}`.run(),
      ]);

      /** @type {Map.<int, PersistedFamily>} */
      const families = data.reduce(
        /**
         * @param {Map.<int, PersistedFamily>} map
         * @param {FamilyRaw} datum
         * @returns {Map.<int, PersistedFamily>}
         */
        (map, datum) => {
          /** @type {PersistedFamily | undefined} */
          let family = map.get(datum.ID);

          if (family) {
            family.participants.push({
              id: datum.BEN_ID,
              isResponsible: Boolean(datum.IS_RESPOSIBLE),
              name: datum.BEN_NAME,
            });
          } else {
            family = {
              id: datum.ID,
              name: datum.NAME,
              participants: [
                {
                  id: datum.BEN_ID,
                  isResponsible: Boolean(datum.IS_RESPOSIBLE),
                  name: datum.BEN_NAME,
                },
              ],
            };
          }

          map.set(family.id, family);

          return map;
        },
        new Map(),
      );

      return [
        {
          items: Array.from(families.values()),
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
   * @returns {Promise<BooleanTuple>}
   */
  static async delete(id) {
    try {
      const deleted = await sql.exec`
            UPDATE FAMILIES
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
            UPDATE FAMILIES
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
   * @param {Family} family
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ name, participants }) {
    try {
      return await transaction(async (tsql) => {
        const family = await tsql.exec`
          INSERT INTO FAMILIES (NAME)
          VALUES (${name})
        `.run();

        if (family.insertId) {
          const participantsValues = tsql.join(
            ",",
            ...participants.map(
              (participant) =>
                tsql`(${participant.beneficiaryId}, ${family.insertId}, ${participant.isResponsible ? 1 : 0})`,
            ),
          );

          const result = await tsql.exec`
            INSERT INTO family_participants
              (BEN_ID, FAM_ID, IS_RESPOSIBLE)
            VALUES
              ${participantsValues}
          `.run();

          if (!result.affectedRows)
            return [false, new Error("Falha ao cadastrar família")];

          return [true];
        } else return [false, new Error("Falha ao cadastrar família")];
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }

  /**
   * @param {PersistedFamily} city
   * @returns {Promise<BooleanTuple>}
   */
  static async edit({ id, name, participants }) {
    try {
      return await transaction(async (tsql) => {
        const family = await tsql.exec`
          UPDATE FAMILIES
          SET NAME = ${name}
          WHERE ID = ${id}
        `.run();

        if (family.affectedRows) {
          /** @type {{ BEN_ID: number }[]} */
          const previousParticipants = await tsql.query`
            SELECT BEN_ID FROM FAMILY_PARTICIPANTS WHERE FAM_ID = ${id}
          `.run();

          const previousParticipantsSet = new Set(
            previousParticipants.map(
              (previousParticipant) => previousParticipant.BEN_ID,
            ),
          );

          const participantsSet = new Set(
            participants.map((participant) => participant.id),
          );

          /** @type {Set<number>} */
          const participantsToDeleteSet =
            previousParticipantsSet.difference(participantsSet);
          /** @type {Set<number>} */
          const participantsToInsertSet = participantsSet.difference(
            previousParticipantsSet.intersection(participantsSet),
          );

          if (participantsToInsertSet.size) {
            const participantsValues = tsql.join(
              ",",
              ...participants
                .filter((participant) =>
                  participantsToInsertSet.has(participant.id),
                )
                .map(
                  (participant) =>
                    tsql`(${participant.id}, ${id}, ${participant.isResponsible ? 1 : 0})`,
                ),
            );

            const result = await tsql.exec`
              INSERT INTO FAMILY_PARTICIPANTS
                (BEN_ID, FAM_ID, IS_RESPOSIBLE)
              VALUES
                ${participantsValues}
            `.run();

            if (!result.affectedRows)
              return [false, new Error("Falha ao adicionar novos familiares")];
          }

          if (participantsToDeleteSet.size) {
            const participantsToDelete = [...participantsToDeleteSet].map(
              (id) => sql.str(id),
            );

            await tsql.exec`
              DELETE FROM FAMILY_PARTICIPANTS
               WHERE BEN_ID IN (${tsql.join(",", ...participantsToDelete)})
            `.run();
          }

          return [true, null];
        } else return [false, new Error("Falha ao editar família")];
      });
    } catch (error) {
      return [false, error];
    }
  }
}

/**
 * @typedef {Object} FindAllFamiliesFilter
 * @prop {string} [query]
 * @prop {string} [sortKey]
 * @prop {string} [sortType]
 * @prop {number} [page]
 * @prop {number} [perPage]
 */

/**
 * @typedef {[import("../global.js").PageData<PersistedFamily>, null]|[null, Error]} FindAllFamiliesTuple
 */

/**
 * @typedef {[PersistedFamily|null, null]|[null, Error]} FindFamilyByIdTuple
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */

/**
 * @typedef {Object} FamilyRaw
 * @prop {number} ID
 * @prop {string} NAME
 * @prop {number} BEN_ID
 * @prop {string} BEN_NAME
 * @prop {number} IS_RESPOSIBLE
 */

/**
 * @typedef {Object} PersistedFamily
 * @prop {number} id
 * @prop {string} name
 * @prop {PersistedFamilyParticipant[]} participants
 */

/**
 * @typedef {Object} Family
 * @prop {string} name
 * @prop {FamilyParticipant[]} participants
 */

/**
 * @typedef {Object} FamilyParticipant
 * @prop {number} beneficiaryId
 * @prop {boolean} isResponsible
 */

/**
 * @typedef {Object} PersistedFamilyParticipant
 * @prop {number} id
 * @prop {boolean} isResponsible
 * @prop {string} name
 */

/**
 * @typedef {Object} FamilyEdit
 * @prop {int} id
 * @prop {string} [name]
 * @prop {number[]} [participants]
 */

/**
 * @typedef {Object} CountRaw
 * @prop {number} COUNT
 */
