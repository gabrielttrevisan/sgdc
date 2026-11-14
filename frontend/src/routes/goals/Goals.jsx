import { useRef } from "react";
import { useNavigate } from "react-router";
import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import GoalsService from "../../service/GoalsService";

import "./Goals.css";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export const Goals = WithAuthGuard(() => {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/GoalsService").Goal>[]} */
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Meta",
      id: "name",
      className: "goal__col --name",
    },
    {
      DataGridCell: ({ startAt }) => <span>{formatDate(startAt)}</span>,
      title: "Início",
      id: "start",
      className: "goal__col",
    },
    {
      DataGridCell: ({ endAt }) => <span>{formatDate(endAt)}</span>,
      title: "Término",
      id: "end",
      className: "goal__col",
    },
    {
      DataGridCell: ({ type }) => <span>{type || "—"}</span>,
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

  return (
    <DataGrid
      ref={dataGridRef}
      columns={columns}
      paginatableService={GoalsService}
      singularName="meta"
      pluralName="Metas"
      rowClassName="goal__row"
      actionsCellClassName="goal__col --actions"
      keyProp="id"
      searchBoxPlaceholder="Buscar por nome ou descrição..."
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Visualizar meta</VisuallyHidden>
            </>
          ),
          onAction: (_type, target) => {
            navigate(`/metas/${target.id}/visualizar`);
          },
        },
      ]}
    >
      <button
        type="button"
        onClick={() => navigate("/metas/cadastrar")}
        className="button-block --solid --btn-safe"
      >
        <AddLargeIcon />
        <span>Cadastrar Meta</span>
      </button>
    </DataGrid>
  );
});
