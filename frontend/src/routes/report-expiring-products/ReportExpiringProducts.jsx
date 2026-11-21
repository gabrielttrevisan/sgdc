import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { FilterIcon } from "../../components/icons/FilterIcon.jsx";
import ExportButton from "../../components/export-button/ExportButton.jsx";
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
    >
      <button
        type="button"
        className="button-block --outline --primary"
        onClick={() =>
          navigate("/relatorios/produtos-a-vencer/filtro", {
            state: filters,
          })
        }
      >
        <FilterIcon size={16} />
        <span>Filtrar</span>
      </button>
      <ExportButton onClick={exportReport} />
    </DataGrid>
  );
});
