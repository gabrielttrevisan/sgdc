import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";
import ExportButton from "../../components/export-button/ExportButton.jsx";
import PrintButton from "../../components/print-button/PrintButton.jsx";
import FilterButton from "../../components/filter-button/FilterButton.jsx";
import HelpButton from "../../components/help-button/HelpButton.jsx";
import useTourGuide from "../../hooks/useTourGuide.js";
import InStockProductsService from "../../service/InStockProductsService.js";
import Toast from "../../components/toast/ToastStorage.js";
import PeriodLabel from "./components/PeriodLabel.jsx";

const reportService = {
  list: (filters) => InStockProductsService.listExpiringReport(filters),
};

function getDays(value) {
  const days = Number(value);
  return (typeof value === "number" || /^\d+$/.test(value ?? "")) &&
    Number.isSafeInteger(days) &&
    days >= 0
    ? days
    : 15;
}

export const ReportExpiringProducts = WithAuthGuard(function () {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filters] = useState(() => ({ days: getDays(state?.days) }));
  const actionsButtonRef = useRef(null);
  const { start, registerStepEl } = useTourGuide("report-expiring-products", {
    onBeforeStart() {
      if (
        matchMedia("(max-width: 768px)").matches &&
        actionsButtonRef.current
      ) {
        actionsButtonRef.current.open();
      }
    },
    onBeforeStepChange(from, to) {
      if (
        !actionsButtonRef.current ||
        !matchMedia("(max-width: 768px)").matches
      )
        return;

      if ((from === 0 && to === 1) || (from === 4 && to === 3)) {
        actionsButtonRef.current.close();
      } else if (from === 3 && to === 4) {
        actionsButtonRef.current.open();
      }
    },
    onFinish() {
      actionsButtonRef.current?.close();
    },
  });

  const columns = [
    {
      DataGridCell: ({ name }) => <span title={name}>{name}</span>,
      title: "Produto",
      id: "name",
    },
    {
      DataGridCell: ({ expiresAt }) => <span>{expiresAt}</span>,
      title: "Data de vencimento",
      id: "expiresAt",
    },
    {
      DataGridCell: ({ count }) => <span>{count}</span>,
      title: "Quantidade a vencer",
      id: "count",
    },
    {
      DataGridCell: ({ roomName }) => <span>{roomName}</span>,
      title: "Sala",
      id: "roomName",
    },
  ];

  const exportReport = async (format) => {
    const response = await InStockProductsService.exportExpiringReport({
      days: String(filters.days),
      format,
    });

    if (!response.data) {
      Toast.error(response.error.message);
      return;
    }

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-produtos-a-vencer.${format === "xls" ? "xlsx" : "csv"}`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <DataGrid
      columns={columns}
      paginatableService={reportService}
      singularName="produto a vencer"
      pluralName="produtos a vencer"
      title={<PeriodLabel {...filters} />}
      keyProp="id"
      noSearch
      getCustomFilter={() => ({ days: String(filters.days) })}
      emptyMessage="Nenhum produto vence no intervalo selecionado"
      afterLabel={<HelpButton onClick={start} />}
      paginationInfoProps={registerStepEl({
        content:
          "Aqui você confere quantos produtos estão sendo exibidos e o total encontrado no período.",
        order: 2,
        title: "Pré-visualização dos resultados",
      })}
      paginationProps={registerStepEl({
        content:
          "Use a paginação para navegar pelos produtos que vencem no intervalo selecionado.",
        order: 3,
        title: "Pré-visualização dos resultados",
      })}
      actionsButtonRef={actionsButtonRef}
      firstActionButtonProps={registerStepEl({
        content:
          "Clique aqui para ver os detalhes do produto em estoque e suas quantidades por sala.",
        order: 4,
        title: "Visualização do produto",
      })}
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Ver produto em estoque</VisuallyHidden>
            </>
          ),
          onAction: (_, target) =>
            navigate(`/produtos-em-estoque/${target.stockId}/visualizar`),
          tooltip: "Visualizar produto em estoque",
        },
      ]}
    >
      <FilterButton
        {...registerStepEl({
          content:
            "Defina por quantos dias a partir de hoje deseja consultar os produtos que vencem.",
          order: 1,
          title: "Filtro",
        })}
        onClick={() =>
          navigate("/relatorios/produtos-a-vencer/filtro", {
            state: filters,
          })
        }
      />

      <ExportButton
        formatProps={registerStepEl({
          content: "Escolha entre exportar o relatório em Excel ou CSV.",
          order: 5,
          title: "Exportação",
        })}
        exportProps={registerStepEl({
          content:
            "Clique para baixar o relatório completo no formato selecionado.",
          order: 6,
          title: "Exportação",
        })}
        onClick={exportReport}
      />
      <PrintButton />
    </DataGrid>
  );
});
