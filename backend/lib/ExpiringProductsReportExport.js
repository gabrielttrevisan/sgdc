import ExcelJS from "exceljs";

const COLUMNS = [
  { header: "Produto", key: "name", width: 35 },
  { header: "Data de vencimento", key: "expiresAt", width: 20 },
  { header: "Quantidade a vencer", key: "count", width: 22 },
  { header: "Sala", key: "roomName", width: 30 },
];

function escapeCsvValue(value) {
  const text = String(value ?? "");
  const safeText = /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

function toReportRows(products) {
  return products.map((product) => ({
    name: product.name,
    expiresAt: product.expiresAt,
    count: product.count,
    roomName: product.roomName,
  }));
}

async function createXlsxFile(products) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Produtos a vencer");
  worksheet.columns = COLUMNS;
  worksheet.addRows(
    toReportRows(products).map((row) => {
      const [day, month, year] = row.expiresAt.split("/").map(Number);
      return {
        ...row,
        expiresAt: new Date(year, month - 1, day),
      };
    }),
  );
  worksheet.getColumn("expiresAt").numFmt = "dd/mm/yyyy";
  worksheet.getRow(1).font = { bold: true };

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

function createCsvFile(products) {
  const rows = [
    COLUMNS.map((column) => column.header),
    ...toReportRows(products).map((row) => Object.values(row)),
  ];
  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
  return Buffer.from(`\uFEFF${csv}`, "utf8");
}

export default async function createExpiringProductsReportFile(
  products,
  format,
) {
  if (format === "csv") {
    return {
      buffer: createCsvFile(products),
      contentType: "text/csv; charset=utf-8",
      filename: "relatorio-produtos-a-vencer.csv",
    };
  }

  return {
    buffer: await createXlsxFile(products),
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename: "relatorio-produtos-a-vencer.xlsx",
  };
}
