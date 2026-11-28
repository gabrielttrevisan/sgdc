import APIResponse from "../lib/APIResponse.js";
import DonationModel, {
  DonationNotFoundError,
  DonationValidationError,
  InsufficientDonationStockError,
} from "../models/Donation.model.js";
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

function formatReportDate(value) {
  const date =
    value instanceof Date
      ? value
      : new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function createPdfReport(report) {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 36, right: 36, bottom: 36, left: 36 },
    });
    const chunks = [];

    document.on("data", (chunk) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    const pageWidth =
      document.page.width -
      document.page.margins.left -
      document.page.margins.right;
    const columns = [
      { title: "Data", width: 70 },
      { title: "Beneficiário", width: 150 },
      { title: "Produtos", width: pageWidth - 70 - 150 - 45 - 75 },
      { title: "Qtd.", width: 45 },
      { title: "Situação", width: 75 },
    ];

    const drawTableHeader = () => {
      let x = document.page.margins.left;
      const y = document.y;
      document.font("Helvetica-Bold").fontSize(9);
      for (const column of columns) {
        document.text(column.title, x, y, { width: column.width });
        x += column.width;
      }
      document.moveDown(0.8);
      document
        .moveTo(document.page.margins.left, document.y)
        .lineTo(document.page.width - document.page.margins.right, document.y)
        .strokeColor("#8b8b8b")
        .stroke();
      document.moveDown(0.4);
    };

    document.font("Helvetica-Bold").fontSize(18).text("Relatório de Doações");
    document
      .font("Helvetica")
      .fontSize(10)
      .text(`Período: ${formatReportDate(report.startDate)} a ${formatReportDate(report.endDate)}`)
      .text(`Emitido em: ${formatReportDate(new Date())}`)
      .moveDown(0.5)
      .text(
        `Doações: ${report.totalDonations} | Ativas: ${report.activeDonations} | Canceladas: ${report.cancelledDonations} | Itens doados (ativas): ${report.totalQuantity}`,
      )
      .moveDown();
    drawTableHeader();

    document.font("Helvetica").fontSize(8);
    for (const donation of report.donations) {
      const products =
        donation.items
          .map((item) => `${item.productName} (${item.quantity})`)
          .join(", ") || "Sem produtos";
      const values = [
        formatReportDate(donation.createdAt),
        donation.beneficiaryName,
        products,
        String(donation.totalQuantity),
        donation.isCancelled ? "Cancelada" : "Ativa",
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

    if (report.donations.length === 0)
      document.text("Nenhuma doação encontrada para o período.");

    document.end();
  });
}

export default class DonationController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async report(req, res) {
    const response = APIResponse.from(res);
    const { startDate, endDate, format = "preview" } = req.query;

    if (
      !isValidDate(startDate) ||
      !isValidDate(endDate) ||
      startDate > endDate
    )
      return response.badRequest("Informe um período válido").send();

    if (!["preview", "pdf", "xlsx"].includes(format))
      return response.badRequest("Formato de relatório inválido").send();

    const [report, error] = await DonationModel.getReport({
      startDate,
      endDate,
    });
    if (error) return response.internalError();
    if (format === "preview") return response.success(report);

    const filename = `relatorio-doacoes-${startDate}-${endDate}`;
    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "SGDC";
      const sheet = workbook.addWorksheet("Doações");
      sheet.mergeCells("A1:H1");
      sheet.getCell("A1").value = "Relatório de Doações";
      sheet.getCell("A1").font = { bold: true, size: 16 };
      sheet.mergeCells("A2:H2");
      sheet.getCell("A2").value =
        `Período: ${formatReportDate(startDate)} a ${formatReportDate(endDate)}`;
      sheet.addRow([]);
      sheet.addRow([
        "Doações",
        report.totalDonations,
        "Ativas",
        report.activeDonations,
        "Canceladas",
        report.cancelledDonations,
        "Itens doados (ativas)",
        report.totalQuantity,
      ]);
      sheet.addRow([]);
      sheet.addRow([
        "Data",
        "Beneficiário",
        "Produtos",
        "Quantidade",
        "Situação",
        "Observação",
        "ID da doação",
      ]);
      const header = sheet.getRow(sheet.rowCount);
      header.font = { bold: true, color: { argb: "FFFFFFFF" } };
      header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF413A64" },
      };

      for (const donation of report.donations) {
        sheet.addRow([
          formatReportDate(donation.createdAt),
          donation.beneficiaryName,
          donation.items
            .map((item) => `${item.productName} (${item.quantity})`)
            .join("; ") || "Sem produtos",
          donation.totalQuantity,
          donation.isCancelled ? "Cancelada" : "Ativa",
          donation.details,
          donation.id,
        ]);
      }

      sheet.columns = [
        { width: 15 },
        { width: 32 },
        { width: 55 },
        { width: 14 },
        { width: 16 },
        { width: 40 },
        { width: 16 },
        { width: 22 },
      ];
      sheet.views = [{ state: "frozen", ySplit: 6 }];
      const buffer = await workbook.xlsx.writeBuffer();
      res
        .set({
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
        })
        .send(Buffer.from(buffer));
      return;
    }

    const buffer = await createPdfReport(report);
    res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      })
      .send(buffer);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, page, perPage } = req.query;
    const [donations, error] = await DonationModel.findAll({
      query: q,
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
    });

    if (error) return response.internalError();
    return response.success(donations);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [donation, error] = await DonationModel.findById(
      parseInt(req.params.id, 10),
    );

    if (error) return response.internalError();
    if (!donation) return response.notFound("Doação não encontrada");
    return response.success(donation);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async getBeneficiaryContext(req, res) {
    const response = APIResponse.from(res);
    const [context, error] = await DonationModel.getBeneficiaryContext(
      parseInt(req.params.id, 10),
    );

    if (error) return response.internalError();
    if (!context) return response.notFound("Beneficiário não encontrado");
    return response.success(context);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const [created, error] = await DonationModel.create(
      req.body,
      req.auth.user.id,
    );

    if (error instanceof InsufficientDonationStockError)
      return response
        .badRequest(error.message)
        .withIssue("INSUFFICIENT_STOCK", error.message)
        .send();
    if (error instanceof DonationValidationError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!created)
      return response.badRequest("Falha ao registrar doação").send();

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async cancel(req, res) {
    const response = APIResponse.from(res);
    const [cancelled, error] = await DonationModel.cancel(
      parseInt(req.params.id, 10),
      req.auth.user.id,
      req.body.details,
    );

    if (error instanceof DonationNotFoundError)
      return response.notFound(error.message);
    if (error instanceof DonationValidationError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!cancelled)
      return response.badRequest("Falha ao cancelar doação").send();

    return response.success({ success: true });
  }
}
