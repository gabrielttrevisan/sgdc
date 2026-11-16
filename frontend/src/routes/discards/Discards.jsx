import { useRef } from "react";
import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon.jsx";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon.jsx";
import DiscardsService from "../../service/DiscardsService.js";
import formatDate from "../../lib/format/date.js";

export const Discards = WithAuthGuard(function Discards() {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);

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
      DataGridCell: ({ productsDiscarded }) => <span>{productsDiscarded}</span>,
      title: "Produtos descartados",
      id: "productsDiscarded",
    },
    {
      DataGridCell: ({ createdBy }) => <span>{createdBy.name}</span>,
      title: "Registrado por",
      id: "createdBy",
    },
  ];

  return (
    <DataGrid
      ref={dataGridRef}
      columns={columns}
      paginatableService={DiscardsService}
      singularName="descarte"
      pluralName="descartes"
      keyProp="id"
      actionsCellClassName="discard__col --actions"
      searchBoxPlaceholder="Buscar por motivo, produto ou voluntário..."
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
        onClick={() => navigate("/descartes/cadastrar")}
        className="button-block --solid --btn-safe"
      >
        <AddLargeIcon />
        <span>Registrar descarte</span>
      </button>
    </DataGrid>
  );
});
