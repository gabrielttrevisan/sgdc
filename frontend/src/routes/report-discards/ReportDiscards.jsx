import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import DiscardsService from "../../service/DiscardsService.js";
import formatDate from "../../lib/format/date.js";
import ExportButton from "../../components/export-button/ExportButton.jsx";
import { FilterIcon } from "lucide-react";
import getSafeListId from "../../store/list/getSafeListId.js";

export const ReportDiscards = WithAuthGuard(function Discards() {
  const dataGridRef = useRef(null);
  const navigate = useNavigate();
  const { state: historyState } = useLocation();
  const [filters] = useState(() => ({
    startAt:
      typeof historyState?.startAt === "string" ? historyState.startAt : "",
    endAt: typeof historyState?.endAt === "string" ? historyState.endAt : "",
    products: Array.isArray(historyState?.products)
      ? historyState.products
      : [],
  }));
  const [listId] = useState(
    () =>
      getSafeListId(historyState?.listId) ||
      `report-discard-products:${crypto.randomUUID()}`,
  );
  const formatRef = useRef(null);

  const columns = [
    {
      DataGridCell: ({ details }) => <span title={details}>{details}</span>,
      title: "Motivo/Descrição",
      id: "details",
    },
    {
      DataGridCell: ({ createdAt }) => <span>{formatDate(createdAt)}</span>,
      title: "Data",
      id: "createdAt",
    },
    {
      DataGridCell: ({ createdBy }) => <span>{createdBy.name}</span>,
      title: "Registrado por",
      id: "createdBy",
    },
  ];

  const getCustomFilter = useCallback(
    () => ({
      startAt: encodeURIComponent(filters.startAt),
      endAt: encodeURIComponent(filters.endAt),
      products: encodeURIComponent(filters.products.map((product) => product.id)),
    }),
    [filters],
  );

  return (
    <DataGrid
      ref={dataGridRef}
      columns={columns}
      paginatableService={DiscardsService}
      singularName="descarte"
      pluralName="descartes"
      keyProp="id"
      noSearch
      searchBoxPlaceholder="Buscar por motivo, produto ou voluntário..."
      getCustomFilter={getCustomFilter}
    >
      <button
        type="button"
        className="button-block --outline --primary"
        onClick={() =>
          navigate("/relatorios/descartes/filtro", {
            state: { ...filters, listId },
          })
        }
      >
        <FilterIcon size={16} />
        <span>Filtrar</span>
      </button>

      <ExportButton ref={formatRef} />
    </DataGrid>
  );
});
