import ExcelJS from "exceljs";

const COLUMNS = [
  { header: "Meta", key: "name", width: 35 },
  { header: "Início", key: "startAt", width: 16 },
  { header: "Término", key: "endAt", width: 16 },
  { header: "Tipo", key: "type", width: 24 },
  { header: "Valor da meta", key: "goal", width: 18 },
  { header: "Percentual alcançado", key: "percentage", width: 24 },
];

function escapeCsvValue(value) {
  const text = String(value ?? "");
  const safeText = /^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

function toReportRows(goals) {
  return goals.map((goal) => ({
    name: goal.name,
    startAt: goal.startAt,
    endAt: goal.endAt,
    type: goal.type,
    goal: goal.goal,
    percentage: goal.percentage,
  }));
}

async function createXlsxFile(goals) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Metas");
  worksheet.columns = COLUMNS;
  worksheet.addRows(
    toReportRows(goals).map((row) => [
      row.name,
      row.startAt ? new Date(`${row.startAt}T00:00:00`) : null,
      row.endAt ? new Date(`${row.endAt}T00:00:00`) : null,
      row.type,
      row.goal,
      row.percentage,
    ]),
  );
  worksheet.getColumn("startAt").numFmt = "dd/mm/yyyy";
  worksheet.getColumn("endAt").numFmt = "dd/mm/yyyy";
  worksheet.getRow(1).font = { bold: true };

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

function createCsvFile(goals) {
  const rows = [
    COLUMNS.map((column) => column.header),
    ...toReportRows(goals).map((row) => Object.values(row)),
  ];
  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
  return Buffer.from(`\uFEFF${csv}`, "utf8");
}

export default async function createGoalReportFile(goals, format) {
  if (format === "csv") {
    return {
      buffer: createCsvFile(goals),
      contentType: "text/csv; charset=utf-8",
      filename: "relatorio-metas.csv",
    };
  }

  return {
    buffer: await createXlsxFile(goals),
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename: "relatorio-metas.xlsx",
  };
}
