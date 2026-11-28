import { useRef } from "react";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import ExportButton from "../../components/export-button/ExportButton.jsx";
import PrintButton from "../../components/print-button/PrintButton.jsx";
import HelpButton from "../../components/help-button/HelpButton.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import useTourGuide from "../../hooks/useTourGuide.js";
import GoalsService from "../../service/GoalsService.js";

const reportService = {
  list: (filters) => GoalsService.listReport(filters),
};

export const ReportGoals = WithAuthGuard(function ReportGoals() {
  const actionsButtonRef = useRef(null);
  const { start, registerStepEl } = useTourGuide("report-goals", {
    onBeforeStart() {
      if (matchMedia("(max-width: 768px)").matches) {
        actionsButtonRef.current?.close();
      }
    },
    onBeforeStepChange(from, to) {
      if (
        !actionsButtonRef.current ||
        !matchMedia("(max-width: 768px)").matches
      )
        return;

      if (from < 2 && to >= 2) {
        actionsButtonRef.current.open();
      } else if (from >= 2 && to < 2) {
        actionsButtonRef.current.close();
      }
    },
    onFinish() {
      actionsButtonRef.current?.close();
    },
  });

  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Meta",
      id: "name",
      className: "goal__col --name",
    },
    {
      DataGridCell: ({ startAt }) => (
        <span>{formatDate(startAt, "Não Informado")}</span>
      ),
      title: "Início",
      id: "start",
      className: "goal__col",
    },
    {
      DataGridCell: ({ endAt }) => (
        <span>{formatDate(endAt, "Não Informado")}</span>
      ),
      title: "Término",
      id: "end",
      className: "goal__col",
    },
    {
      DataGridCell: ({ type }) => (
        <span style={{ textTransform: "uppercase" }}>
          {type || "Não Identificado"}
        </span>
      ),
      title: "Tipo",
      id: "type",
      className: "goal__col",
    },
    {
      DataGridCell: ({ goal }) => <span>{goal}</span>,
      title: "Objetivo",
      id: "goal",
      className: "goal__col",
    },
    {
      DataGridCell: ({ percentage }) => <span>{percentage}</span>,
      title: "Atingimento",
      id: "percentage",
      className: "goal__col",
    },
  ];

  const exportReport = async (format) => {
    const response = await GoalsService.exportReport({ format });

    if (!response.data) {
      Toast.error(response.error.message);
      return;
    }

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-metas.${format === "xls" ? "xlsx" : "csv"}`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <DataGrid
      columns={columns}
      paginatableService={reportService}
      singularName="meta"
      pluralName="Metas"
      rowClassName="goal__row"
      actionsCellClassName="goal__col --actions"
      keyProp="id"
      noSearch
      emptyMessage="Nenhuma meta encontrada"
      afterLabel={<HelpButton onClick={start} />}
      paginationInfoProps={registerStepEl({
        content:
          "Aqui você confere quantas metas estão sendo exibidas e o total encontrado.",
        order: 1,
        title: "Pré-visualização dos resultados",
      })}
      paginationProps={registerStepEl({
        content: "Use a paginação para navegar pelas metas do relatório.",
        order: 2,
        title: "Pré-visualização dos resultados",
      })}
      actionsButtonRef={actionsButtonRef}
    >
      <ExportButton
        formatProps={registerStepEl({
          content: "Escolha entre exportar o relatório em Excel ou CSV.",
          order: 3,
          title: "Exportação",
        })}
        exportProps={registerStepEl({
          content:
            "Clique para baixar o relatório completo no formato selecionado.",
          order: 4,
          title: "Exportação",
        })}
        onClick={exportReport}
      />
      <PrintButton />
    </DataGrid>
  );
});
