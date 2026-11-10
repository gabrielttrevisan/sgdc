import { transaction } from "./core/sql.js";

export default class SessionModel {
  /**
   * @param {SessionToCreate} session
   * @returns {Promise<BooleanTuple>}
   */
  static async create({ familyId, responsible, details, requests = [] }) {
    try {
      return await transaction(async (tsql) => {
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

        const createdSession = await tsql.exec`
          INSERT INTO client_sessions (BENEFICIARY_ID, DETAILS)
          VALUES (${responsible}, ${details.trim()})
        `.run();

        if (!createdSession.insertId)
          return [false, new Error("Falha ao registrar atendimento")];

        if (requests.length > 0) {
          const requestValues = tsql.join(
            ",",
            ...requests.map(
              ({ productId, quantity = 1 }) =>
                tsql`(${createdSession.insertId}, ${productId}, ${quantity})`,
            ),
          );

          const createdRequests = await tsql.exec`
            INSERT INTO client_session_request (CS_ID, PRODUCT_ID, QUANTITY)
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
}

/**
 * @typedef {Object} SessionToCreate
 * @prop {number} familyId
 * @prop {number} responsible
 * @prop {string} details
 * @prop {{productId: number, quantity?: number}[]} [requests]
 */

/**
 * @typedef {[boolean, null]|[false, Error]} BooleanTuple
 */
