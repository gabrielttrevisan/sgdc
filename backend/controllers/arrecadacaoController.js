
import promisePool from "../config/database.js";

// ============================================
// RF_F1 - LANÇAR ARRECADAÇÃO
// ============================================

export async function criarArrecadacao(req, res) {
  let conexao;

  try {
    const { doadorId, itens } = req.body ?? {};

    const usuarioId = req.auth?.user?.id;

    // ========================================
    // 1. VALIDAR DOADOR
    // ========================================

    const idDoador = Number(doadorId);
    const idUsuario = Number(usuarioId);

    if (
      !Number.isSafeInteger(idDoador) ||
      idDoador <= 0
    ) {
      return res.status(400).json({
        message: "Selecione um doador válido.",
      });
    }

    if (
      !Number.isSafeInteger(idUsuario) ||
      idUsuario <= 0
    ) {
      return res.status(401).json({
        message: "Usuário não autenticado ou inválido.",
      });
    }

    // ========================================
    // 2. VALIDAR LISTA DE PRODUTOS
    // ========================================

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        message: "Adicione pelo menos um produto à arrecadação.",
      });
    }

    const itensValidados = [];

    for (const item of itens) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return res.status(400).json({
          message: "Os dados de um dos produtos são inválidos.",
        });
      }

      const productId = Number(item.productId);
      const quantidade = Number(item.quantidade);
      const salaId = Number(item.salaId);
      const dataVencimento = item.dataVencimento;

      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        return res.status(400).json({
          message: "Produto inválido.",
        });
      }

      if (
        !Number.isSafeInteger(quantidade) ||
        quantidade <= 0
      ) {
        return res.status(400).json({
          message: "A quantidade deve ser um número inteiro maior que zero.",
        });
      }

      if (
        !Number.isSafeInteger(salaId) ||
        salaId <= 0
      ) {
        return res.status(400).json({
          message: "Selecione um local de armazenamento válido.",
        });
      }

      // Validar formato e existência da data
      if (
        typeof dataVencimento !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dataVencimento)
      ) {
        return res.status(400).json({
          message: "Informe uma data de vencimento válida.",
        });
      }

      const [ano, mes, dia] = dataVencimento
        .split("-")
        .map(Number);

      const data = new Date(Date.UTC(ano, mes - 1, dia));

      if (
        data.getUTCFullYear() !== ano ||
        data.getUTCMonth() !== mes - 1 ||
        data.getUTCDate() !== dia
      ) {
        return res.status(400).json({
          message: "A data de vencimento informada não existe.",
        });
      }

      itensValidados.push({
        productId,
        quantidade,
        salaId,
        dataVencimento,
      });
    }

    // ========================================
    // 3. INICIAR TRANSAÇÃO
    // ========================================

    conexao = await promisePool.getConnection();

    await conexao.beginTransaction();

    // ========================================
    // 4. VERIFICAR SE O DOADOR EXISTE
    // ========================================

    const [doadores] = await conexao.execute(
      `
        SELECT ID
        FROM DONORS
        WHERE ID = ?
      `,
      [idDoador]
    );

    if (doadores.length === 0) {
      await conexao.rollback();

      return res.status(404).json({
        message: "Doador não encontrado.",
      });
    }

    // ========================================
    // 5. CRIAR REGISTRO DA ARRECADAÇÃO
    // ========================================

    const [resultado] = await conexao.execute(
      `
        INSERT INTO COLLECTIONS (
          COLLECTED_BY,
          CREATED_BY
        )
        VALUES (?, ?)
      `,
      [idDoador, idUsuario]
    );

    const collectionId = resultado.insertId;

    // ========================================
    // 6. REGISTRAR CADA PRODUTO ARRECADADO
    // ========================================

    for (const item of itensValidados) {

      // Verificar se o produto existe
      const [produtos] = await conexao.execute(
        `
          SELECT ID
          FROM PRODUCTS
          WHERE ID = ? AND DELETED_AT IS NULL
        `,
        [item.productId]
      );

      if (produtos.length === 0) {
        await conexao.rollback();

        return res.status(404).json({
          message: `Produto ${item.productId} não encontrado.`,
        });
      }

      // Verificar se a sala existe
      const [salas] = await conexao.execute(
        `
          SELECT ID
          FROM SALAS
          WHERE ID = ?
        `,
        [item.salaId]
      );

      if (salas.length === 0) {
        await conexao.rollback();

        return res.status(404).json({
          message: `Local de armazenamento ${item.salaId} não encontrado.`,
        });
      }

      // Inserir item da arrecadação
      await conexao.execute(
        `
          INSERT INTO COLLECTED_ITEMS (
            PRODUCT_ID,
            COLLECTION_ID,
            \`COUNT\`,
            SALA_ID,
            EXPIRES_AT
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          item.productId,
          collectionId,
          item.quantidade,
          item.salaId,
          `${item.dataVencimento} 00:00:00`,
        ]
      );
    }

    // ========================================
    // 7. CONFIRMAR TRANSAÇÃO
    // ========================================

    await conexao.commit();

    return res.status(201).json({
      message: "Arrecadação lançada com sucesso!",
      arrecadacao: {
        id: collectionId,
        doadorId: idDoador,
        usuarioId: idUsuario,
        totalProdutos: itensValidados.length,
        itens: itensValidados,
      },
    });

  } catch (error) {

    // ========================================
    // 8. DESFAZER TRANSAÇÃO EM CASO DE ERRO
    // ========================================

    if (conexao) {
      try {
        await conexao.rollback();
      } catch (rollbackError) {
        console.error(
          "Erro ao desfazer transação:",
          rollbackError
        );
      }
    }

    console.error(
      "Erro ao lançar arrecadação:",
      error
    );

    return res.status(500).json({
      message: "Erro ao registrar arrecadação.",
    });

  } finally {

    // Liberar conexão com o MySQL
    if (conexao) {
      conexao.release();
    }

  }
}
