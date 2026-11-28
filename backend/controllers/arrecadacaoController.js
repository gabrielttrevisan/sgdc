
import promisePool from "../config/database.js";
<<<<<<< HEAD
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getReportPeriod({ month, startDate, endDate }) {
  if (month !== undefined) {
    if (
      typeof month !== "string" ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
      startDate !== undefined ||
      endDate !== undefined
    )
      return null;

    const [year, monthNumber] = month.split("-").map(Number);
    const monthStart = `${month}-01`;
    const lastDay = new Date(
      Date.UTC(year, monthNumber, 0),
    ).getUTCDate();
    const monthEnd = `${month}-${String(lastDay).padStart(2, "0")}`;

    return isValidDate(monthStart) ? { startDate: monthStart, endDate: monthEnd } : null;
  }

  if (
    !isValidDate(startDate) ||
    !isValidDate(endDate) ||
    startDate > endDate
  )
    return null;

  return { startDate, endDate };
}

function formatReportDate(value) {
  const date =
    value instanceof Date
      ? value
      : new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR").format(date);
}

function getReportRows(report) {
  return report.collections.flatMap((collection) =>
    collection.items.length
      ? collection.items.map((item) => ({
          createdAt: collection.createdAt,
          donorName: collection.donorName,
          productName: item.productName,
          quantity: item.quantity,
          salaName: item.salaName || "—",
          expiresAt: item.expiresAt,
          createdByName: collection.createdByName,
        }))
      : [
          {
            createdAt: collection.createdAt,
            donorName: collection.donorName,
            productName: "Sem produtos",
            quantity: 0,
            salaName: "—",
            expiresAt: null,
            createdByName: collection.createdByName,
          },
        ],
  );
}

function createPdfReport(report) {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 36, right: 32, bottom: 36, left: 32 },
    });
    const chunks = [];
    const rows = getReportRows(report);
    const pageWidth =
      document.page.width -
      document.page.margins.left -
      document.page.margins.right;
    const columns = [
      { title: "Data", width: 58 },
      { title: "Doador", width: 115 },
      { title: "Produto", width: pageWidth - 58 - 115 - 55 - 120 - 58 - 125 },
      { title: "Quantidade", width: 55 },
      { title: "Armazenamento", width: 120 },
      { title: "Vencimento", width: 58 },
      { title: "Registrado por", width: 125 },
    ];

    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    const drawTableHeader = () => {
      let x = document.page.margins.left;
      const y = document.y;
      document.font("Helvetica-Bold").fontSize(8);
      for (const column of columns) {
        document.text(column.title, x, y, { width: column.width });
        x += column.width;
      }
      document.moveDown(0.8);
      document
        .moveTo(document.page.margins.left, document.y)
        .lineTo(
          document.page.width - document.page.margins.right,
          document.y,
        )
        .strokeColor("#8b8b8b")
        .stroke();
      document.moveDown(0.4);
    };

    document.font("Helvetica-Bold").fontSize(18).text("Relatório de Arrecadações");
    document
      .font("Helvetica")
      .fontSize(10)
      .text(
        `Período: ${formatReportDate(report.startDate)} a ${formatReportDate(report.endDate)}`,
      )
      .text(`Emitido em: ${formatReportDate(new Date())}`)
      .moveDown(0.5)
      .text(
        `Arrecadações: ${report.totalCollections} | Doadores: ${report.totalDonors} | Itens arrecadados: ${report.totalQuantity}`,
      )
      .moveDown();
    drawTableHeader();

    document.font("Helvetica").fontSize(8);
    for (const row of rows) {
      const values = [
        formatReportDate(row.createdAt),
        row.donorName,
        row.productName,
        String(row.quantity),
        row.salaName,
        formatReportDate(row.expiresAt),
        row.createdByName,
      ];
      const rowHeight = Math.max(
        ...columns.map((column, index) =>
          document.heightOfString(values[index], {
            width: column.width - 6,
          }),
        ),
      );

      if (
        document.y + rowHeight + 12 >
        document.page.height - document.page.margins.bottom
      ) {
        document.addPage();
        drawTableHeader();
        document.font("Helvetica").fontSize(8);
      }

      let x = document.page.margins.left;
      const y = document.y;
      for (let index = 0; index < columns.length; index += 1) {
        document.text(values[index], x, y, {
          width: columns[index].width - 6,
        });
        x += columns[index].width;
      }
      document.y = y + rowHeight + 8;
    }

    if (rows.length === 0)
      document.text("Nenhuma arrecadação encontrada no período.");

    document.end();
  });
}
=======
import InStockProductModel from "../models/InStockProduct.model.js";
import { createSQLFunctor } from "../models/core/sql.js";
>>>>>>> cd827e630c6be5bb8f8ad3a5b7e7d3661bb00a0d

// ============================================
// RF_F1 - LANÇAR ARRECADAÇÃO
// ============================================

export async function consultarRelatorioArrecadacoes(req, res) {
  const { format = "preview" } = req.query;
  const period = getReportPeriod(req.query);

  if (!period) {
    return res.status(400).json({
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Informe um mês ou um período válido.",
      },
    });
  }

  const { startDate, endDate } = period;

  if (!["preview", "pdf", "xlsx"].includes(format)) {
    return res.status(400).json({
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Formato de relatório inválido.",
      },
    });
  }

  try {
    const [rows] = await promisePool.execute(
      `
        SELECT
          C.ID AS collectionId,
          C.CREATED_AT AS createdAt,
          D.ID AS donorId,
          D.NAME AS donorName,
          U.NAME AS createdByName,
          CI.ID AS itemId,
          CI.\`COUNT\` AS quantity,
          P.NAME AS productName,
          S.NOME AS salaName,
          CI.EXPIRES_AT AS expiresAt
        FROM COLLECTIONS C
          INNER JOIN DONORS D ON D.ID = C.COLLECTED_BY
          INNER JOIN USERS U ON U.ID = C.CREATED_BY
          LEFT JOIN COLLECTED_ITEMS CI ON CI.COLLECTION_ID = C.ID
          LEFT JOIN PRODUCTS P ON P.ID = CI.PRODUCT_ID
          LEFT JOIN SALAS S ON S.ID = CI.SALA_ID
        WHERE C.CREATED_AT >= ?
          AND C.CREATED_AT < DATE_ADD(?, INTERVAL 1 DAY)
        ORDER BY C.CREATED_AT DESC, C.ID DESC, CI.ID ASC
      `,
      [startDate, endDate],
    );

    const collections = new Map();
    for (const row of rows) {
      let collection = collections.get(row.collectionId);
      if (!collection) {
        collection = {
          id: row.collectionId,
          createdAt: row.createdAt,
          donorId: row.donorId,
          donorName: row.donorName,
          createdByName: row.createdByName,
          totalQuantity: 0,
          items: [],
        };
        collections.set(row.collectionId, collection);
      }

      if (row.itemId !== null) {
        const quantity = Number(row.quantity);
        collection.items.push({
          id: row.itemId,
          productName: row.productName,
          quantity,
          salaName: row.salaName,
          expiresAt: row.expiresAt,
        });
        collection.totalQuantity += quantity;
      }
    }

    const reportCollections = Array.from(collections.values());
    const report = {
      startDate,
      endDate,
      totalCollections: reportCollections.length,
      totalDonors: new Set(reportCollections.map(({ donorId }) => donorId))
        .size,
      totalQuantity: reportCollections.reduce(
        (total, collection) => total + collection.totalQuantity,
        0,
      ),
      collections: reportCollections,
    };

    if (format === "preview") {
      return res.json({ data: report, error: null });
    }

    const filename = `relatorio-arrecadacoes-${startDate}-${endDate}`;
    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "SGDC";
      const sheet = workbook.addWorksheet("Arrecadações");
      sheet.mergeCells("A1:G1");
      sheet.getCell("A1").value = "Relatório de Arrecadações";
      sheet.getCell("A1").font = { bold: true, size: 16 };
      sheet.mergeCells("A2:G2");
      sheet.getCell("A2").value =
        `Período: ${formatReportDate(startDate)} a ${formatReportDate(endDate)}`;
      sheet.mergeCells("A3:G3");
      sheet.getCell("A3").value =
        `Emitido em: ${formatReportDate(new Date())}`;
      sheet.addRow([]);
      sheet.addRow([
        "Arrecadações",
        report.totalCollections,
        "Doadores",
        report.totalDonors,
        "Itens arrecadados",
        report.totalQuantity,
      ]);
      sheet.addRow([]);
      sheet.addRow([
        "Data",
        "Doador",
        "Produto",
        "Quantidade",
        "Armazenamento",
        "Vencimento",
        "Registrado por",
      ]);
      const header = sheet.getRow(sheet.rowCount);
      header.font = { bold: true, color: { argb: "FFFFFFFF" } };
      header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF413A64" },
      };

      for (const row of getReportRows(report)) {
        sheet.addRow([
          formatReportDate(row.createdAt),
          row.donorName,
          row.productName,
          row.quantity,
          row.salaName,
          formatReportDate(row.expiresAt),
          row.createdByName,
        ]);
      }

      sheet.columns = [
        { width: 15 },
        { width: 28 },
        { width: 32 },
        { width: 15 },
        { width: 28 },
        { width: 16 },
        { width: 28 },
      ];
      sheet.views = [{ state: "frozen", ySplit: 7 }];
      if (sheet.rowCount >= 7)
        sheet.autoFilter = `A7:G${sheet.rowCount}`;

      const buffer = await workbook.xlsx.writeBuffer();
      return res
        .set({
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
        })
        .send(Buffer.from(buffer));
    }

    const buffer = await createPdfReport(report);
    return res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      })
      .send(buffer);
  } catch (error) {
    console.error("Erro ao consultar relatório de arrecadações:", error);
    return res.status(500).json({
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível consultar o relatório de arrecadações.",
      },
    });
  }
}

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
    // 7. ATUALIZAR O ESTOQUE
    // ========================================

    const stockChanges = itensValidados.map((item) => ({
      productId: item.productId,
      total: item.quantidade,
      expiresAt: item.dataVencimento,
      rooms: [{
        id: item.salaId,
        count: item.quantidade,
      }],
    }));

    const [stockUpdated, stockError] =
      await InStockProductModel.updateStock(
        stockChanges,
        createSQLFunctor(conexao)
      );

    if (!stockUpdated) {
      await conexao.rollback();

      console.error(
        "Erro ao atualizar o estoque da arrecadação:",
        stockError
      );

      return res.status(500).json({
        message: "Erro ao atualizar o estoque.",
      });
    }

    // ========================================
    // 8. CONFIRMAR TRANSAÇÃO
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
