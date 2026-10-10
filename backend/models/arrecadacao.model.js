import db from "../config/database.js";

let schemaReady;

async function ensureArrecadacoesSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS arrecadacoes (
          ID INT AUTO_INCREMENT PRIMARY KEY,
          VALOR DECIMAL(10,2) NOT NULL,
          DATA_ARRECADACAO DATE NOT NULL,
          TIPO_ARRECADACAO VARCHAR(80) NOT NULL DEFAULT 'Doação em dinheiro',
          DESCRICAO VARCHAR(255),
          CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const [columns] = await db.query(
        "SHOW COLUMNS FROM arrecadacoes LIKE 'TIPO_ARRECADACAO'",
      );

      if (columns.length === 0) {
        await db.query(`
          ALTER TABLE arrecadacoes
          ADD COLUMN TIPO_ARRECADACAO VARCHAR(80)
          NOT NULL DEFAULT 'Doação em dinheiro'
        `);
      }
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }

  await schemaReady;
}

export async function listarArrecadacoes() {
  await ensureArrecadacoesSchema();

  const [rows] = await db.query(`
    SELECT
      ID AS id,
      VALOR AS valor,
      DATA_ARRECADACAO AS dataArrecadacao,
      TIPO_ARRECADACAO AS tipoArrecadacao,
      DESCRICAO AS descricao,
      CREATED_AT AS createdAt
    FROM arrecadacoes
    ORDER BY DATA_ARRECADACAO DESC, ID DESC
  `);

  return rows;
}

export async function criarArrecadacao(data) {
  await ensureArrecadacoesSchema();

  const connection = await db.getConnection();

  try {

    // Inicia a transação
    await connection.beginTransaction();

    const sql = `
      INSERT INTO arrecadacoes
      (
        VALOR,
        DATA_ARRECADACAO,
        TIPO_ARRECADACAO,
        DESCRICAO
      )
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [
      data.valor,
      data.dataArrecadacao,
      data.tipoArrecadacao,
      data.descricao
    ]);

    // Confirma a operação
    await connection.commit();

    return {
      id: result.insertId,
      valor: data.valor,
      dataArrecadacao: data.dataArrecadacao,
      tipoArrecadacao: data.tipoArrecadacao,
      descricao: data.descricao
    };

  } catch (error) {

    // Se alguma coisa der errado,
    // desfaz a transação
    await connection.rollback();

    throw error;

  } finally {

    // Devolve a conexão para o pool
    connection.release();
  }
}

export async function atualizarArrecadacao(id, data) {
  await ensureArrecadacoesSchema();

  const [result] = await db.query(
    `UPDATE arrecadacoes
     SET VALOR = ?, DATA_ARRECADACAO = ?, TIPO_ARRECADACAO = ?, DESCRICAO = ?
     WHERE ID = ?`,
    [data.valor, data.dataArrecadacao, data.tipoArrecadacao, data.descricao, id],
  );

  if (result.affectedRows > 0) return true;

  const [rows] = await db.query(
    "SELECT ID FROM arrecadacoes WHERE ID = ?",
    [id],
  );
  return rows.length > 0;
}

export async function excluirArrecadacao(id) {
  await ensureArrecadacoesSchema();

  const [result] = await db.query(
    "DELETE FROM arrecadacoes WHERE ID = ?",
    [id],
  );

  return result.affectedRows;
}