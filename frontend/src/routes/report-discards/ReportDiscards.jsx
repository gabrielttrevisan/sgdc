import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import DiscardsService from "../../service/DiscardsService.js";
import formatDate from "../../lib/format/date.js";
import ExportButton from "../../components/export-button/ExportButton.jsx";
import getSafeListId from "../../store/list/getSafeListId.js";
import { FilterIcon } from "../../components/icons/FilterIcon.jsx";
import useTourGuide from "../../hooks/useTourGuide.js";
import HelpButton from "../../components/help-button/HelpButton.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";

const reportDiscardsService = {
  list: (filters) => DiscardsService.listReport(filters),
};

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
  const actionsButtonRef = useRef(null);
  const { start, registerStepEl } = useTourGuide("report-discards", {
    onBeforeStart() {
      const isMobile = matchMedia("(max-width: 768px)").matches;

      if (isMobile && actionsButtonRef.current) {
        actionsButtonRef.current.open();
      }
    },
    onBeforeStepChange(from, to) {
      if (actionsButtonRef.current) {
        const isMobile = matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
          if ((from === 0 && to === 1) || (from === 3 && to === 2)) {
            actionsButtonRef.current.close();
          } else if (from === 2) {
            actionsButtonRef.current.open();
          }
        }
      }
    },
    onFinish() {
      if (actionsButtonRef.current) {
        actionsButtonRef.current.close();
      }
    },
  });

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
      startAt: filters.startAt,
      endAt: filters.endAt,
      products: filters.products.map((product) => product.id).join(","),
    }),
    [filters],
  );

  return (
    <DataGrid
      ref={dataGridRef}
      columns={columns}
      paginatableService={reportDiscardsService}
      singularName="descarte"
      pluralName="descartes"
      keyProp="id"
      noSearch
      searchBoxPlaceholder="Buscar por motivo, produto ou voluntário..."
      getCustomFilter={getCustomFilter}
      afterLabel={<HelpButton onClick={start} />}
      paginationInfoProps={registerStepEl({
        content:
          "Aqui estão exibidos a quantidade de registros mostrados e o total de registros do relatório",
        order: 2,
        title: "Pré-visualização de Resultados",
      })}
      paginationProps={registerStepEl({
        content:
          "Utilize a paginação para pré-visualizar os resultados do relatório",
        order: 3,
        title: "Pré-visualização de Resultados",
      })}
      actionsButtonRef={actionsButtonRef}
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Ver descarte</VisuallyHidden>
            </>
          ),
          onAction: (_, target) =>
            navigate(`/descartes/${target.id}/visualizar`),
          tooltip: "Visualizar descarte",
        },
      ]}
    >
      <button
        type="button"
        className="button-block --outline --primary"
        {...registerStepEl({
          content:
            "Clique em 'Filtrar' para configurar o período de ocorrência dos descartes e quais produtos foram descartados",
          order: 1,
          title: "Filtro",
        })}
        onClick={() =>
          navigate("/relatorios/descartes/filtro", {
            state: { ...filters, listId },
          })
        }
      >
        <FilterIcon size={16} />
        <span>Filtrar</span>
      </button>

      <ExportButton
        ref={formatRef}
        formatProps={registerStepEl({
          order: 4,
          title: "Exportação",
          content:
            "Clique no botão branco para selecionar o formato de exportação desejado",
        })}
        exportProps={registerStepEl({
          order: 5,
          title: "Exportação",
          content:
            "Clique no botão verde para exportar os descartes no formato selecionado.<br/>Todo resultados serão exportados em um único arquivo.",
        })}
      />
    </DataGrid>
  );
});
