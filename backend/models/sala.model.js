import sql from "./core/sql.js";

export default class SalaModel {

  static async findAll({
    query,
    sortKey,
    sortType,
    page = 1,
    perPage = 10,
  }) {
    try {
      const likeQuery = `%${query || ""}%`;
      const whereClause = query
        ? sql`WHERE NOME LIKE ${likeQuery} OR DESCRICAO LIKE ${likeQuery}`
        : sql.empty;
      const orderByClause =
        sortKey === "nome" && sortType === "desc"
          ? sql`ORDER BY NOME DESC`
          : sql`ORDER BY NOME ASC`;
      const limitClause = sql`
        LIMIT ${perPage}
        OFFSET ${(page - 1) * perPage}
      `;

      const [data, [{ TOTAL: total }]] = await Promise.all([
        sql.query`
          SELECT
            ID,
            NOME,
            DESCRICAO
          FROM SALAS
          ${whereClause}
          ${orderByClause}
          ${limitClause}
        `.run(),
        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM SALAS
          ${whereClause}
        `.run(),
      ]);

      const salas = data.map((sala) => ({
        id: sala.ID,
        nome: sala.NOME,
        descricao: sala.DESCRICAO,
      }));

      return [
        {
          items: salas,
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

  static async findById(id) {

    try {

      const data = await sql.query`

        SELECT ID, NOME, DESCRICAO

        FROM SALAS

        WHERE ID=${id}

      `.run();

      if(!data.length)
        return [null,null];

      const sala = data[0];

      return [

        {

          id:sala.ID,

          nome:sala.NOME,

          descricao:
            sala.DESCRICAO,

        },

        null

      ];

    } catch(error){

      return [null,error];

    }

  }

  static async create({
    nome,
    descricao
  }) {

    try {

      const created =
        await sql.exec`

        INSERT INTO SALAS
        (
          NOME,
          DESCRICAO
        )

        VALUES
        (
          ${nome},
          ${descricao}
        )

      `.run();

      return [
        created.affectedRows > 0,
        null
      ];

    } catch(error){

      return [false,error];

    }

  }

  static async edit({
    id,
    nome,
    descricao
  }) {

    try {

      const updated =
        await sql.exec`

        UPDATE SALAS

        SET

          NOME=${nome},

          DESCRICAO=${descricao}

        WHERE ID=${id}

      `.run();

      return [
        updated.affectedRows > 0,
        null
      ];

    } catch(error){

      return [false,error];

    }

  }

  static async delete(id) {

    try {

      const deleted =
        await sql.exec`

        DELETE FROM SALAS

        WHERE ID=${id}

      `.run();

      return [
        deleted.affectedRows > 0,
        null
      ];

    } catch(error){

      return [false,error];

    }

  }

}