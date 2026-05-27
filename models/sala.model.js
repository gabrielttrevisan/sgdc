import sql from "./core/sql.js";

export default class SalaModel {

  static async findAll({
    query,
    page = 1,
    perPage = 10
  }) {

    try {

      const likeQuery =
        `%${query || ""}%`;

      const whereClause = query
        ? sql`
          WHERE NOME LIKE ${likeQuery}
        `
        : sql.empty;

      const limitClause =
        sql`
          LIMIT ${perPage}
          OFFSET ${(page - 1) * perPage}
        `;

      const [data, [{ TOTAL: total }]]
        = await Promise.all([

        sql.query`
          SELECT
            ID,
            NOME,
            CAPACIDADE,
            DESCRICAO
          FROM SALAS
          ${whereClause}
          ${limitClause}
        `.run(),

        sql.query`
          SELECT COUNT(*) AS TOTAL
          FROM SALAS
        `.run()

      ]);

      const salas = data.map(
        (sala) => ({

          id: sala.ID,

          nome: sala.NOME,

          capacidade:
            sala.CAPACIDADE,

          descricao:
            sala.DESCRICAO,

        })
      );

      return [

        {

          items: salas,

          totalRecords: total,

          page,

          totalPages:
            Math.ceil(
              total / perPage
            ),

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
        SELECT *
        FROM SALAS
        WHERE ID = ${id}
      `.run();

      if (!data.length)
        return [null, null];

      const sala = data[0];

      return [

        {

          id: sala.ID,

          nome: sala.NOME,

          capacidade:
            sala.CAPACIDADE,

          descricao:
            sala.DESCRICAO,

        },

        null,

      ];

    } catch (error) {

      return [null, error];

    }

  }

  static async create({
    nome,
    capacidade,
    descricao
  }) {

    try {

      const created = await sql.exec`
        INSERT INTO SALAS
        (
          NOME,
          CAPACIDADE,
          DESCRICAO
        )
        VALUES
        (
          ${nome},
          ${capacidade},
          ${descricao}
        )
      `.run();

      if (
        created.affectedRows < 1
      )
        return [false, null];

      return [true, null];

    } catch (error) {

      return [false, error];

    }

  }

  static async edit({
    id,
    nome,
    capacidade,
    descricao
  }) {

    try {

      const updated =
        await sql.exec`

        UPDATE SALAS

        SET

          NOME=${nome},

          CAPACIDADE=${capacidade},

          DESCRICAO=${descricao}

        WHERE ID=${id}

      `.run();

      if (
        updated.affectedRows < 1
      )
        return [false, null];

      return [true, null];

    } catch (error) {

      return [false, error];

    }

  }

  static async delete(id) {

    try {

      const deleted =
        await sql.exec`

        DELETE FROM SALAS

        WHERE ID=${id}

      `.run();

      if (
        deleted.affectedRows < 1
      )
        return [false, null];

      return [true, null];

    } catch (error) {

      return [false, error];

    }

  }

}