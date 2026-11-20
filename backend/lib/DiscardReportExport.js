import ExcelJS from "exceljs";

const COLUMNS = [
  { header: "Motivo/Descrição", key: "details", width: 40 },
  { header: "Data", key: "createdAt", width: 16 },
  { header: "Registrado por", key: "createdBy", width: 30 },
  { header: "Produtos descartados", key: "productsDiscarded", width: 30 },
];

function formatDate(value) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  const safeText = /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

function toReportRows(discards) {
  return discards.map((discard) => ({
    details: discard.details,
    createdAt: discard.createdAt,
    createdBy: discard.createdBy.name,
    productsDiscarded: discard.productsDiscarded,
  }));
}

async function createXlsxFile(discards) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Descartes");

  worksheet.columns = COLUMNS;

  worksheet.addRows(
    toReportRows(discards).map((row) => [...Object.values(row), ,]),
  );

  worksheet.getColumn("createdAt").numFmt = "dd/mm/yyyy";

  const firstRow = worksheet.getRow(1);

  if (firstRow) {
    firstRow.font = { ...firstRow.font, bold: true };
  }

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

function createCsvFile(discards) {
  const rows = [
    COLUMNS.map((column) => column.header),
    ...toReportRows(discards).map((row) => [
      row.details,
      formatDate(row.createdAt),
      row.createdBy,
      row.productsDiscarded,
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");

  return Buffer.from(`\uFEFF${csv}`, "utf8");
}

export default async function createDiscardReportFile(discards, format) {
  if (format === "csv") {
    return {
      buffer: createCsvFile(discards),
      contentType: "text/csv; charset=utf-8",
      filename: "relatorio-descartes.csv",
    };
  }

  return {
    buffer: await createXlsxFile(discards),
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename: "relatorio-descartes.xlsx",
  };
}
