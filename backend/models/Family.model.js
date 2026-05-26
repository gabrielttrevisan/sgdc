import sql, { transaction } from "./core/sql.js";

export default class FamilyModel {
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
   * @param {Family} city
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

          if (!result.affectedRows) return false;

          return true;
        } else return false;
      });
    } catch (error) {
      console.error(error);
      return [false, error];
    }
  }
}

/**
 * @typedef {Object} FindAllCitiesFilter
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
