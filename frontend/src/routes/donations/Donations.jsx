import { useRef } from "react";
import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { DeleteIcon } from "../../components/icons/DeleteIcon.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon.jsx";
import DonationsService from "../../service/DonationsService.js";

const DETAILS_MAX_LENGTH = 48;

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export const Donations = WithAuthGuard(function Donations() {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);

  const columns = [
    {
      DataGridCell: ({ id }) => <>#{id}</>,
      title: "ID",
      id: "id",
    },
    {
      DataGridCell: ({ beneficiary }) => (
        <span title={beneficiary.name}>
          #{beneficiary.id} - {beneficiary.name}
        </span>
      ),
      title: "Beneficiário",
      id: "beneficiary",
    },
    {
      DataGridCell: ({ details }) => (
        <span title={details}>
          {details.length > DETAILS_MAX_LENGTH
            ? `${details.slice(0, DETAILS_MAX_LENGTH)}...`
            : details}
        </span>
      ),
      title: "Detalhes",
      id: "details",
    },
    {
      DataGridCell: ({ createdAt }) => <span>{formatDate(createdAt)}</span>,
      title: "Data",
      id: "createdAt",
    },
    {
      DataGridCell: ({ isCancelled }) => (
        <span>{isCancelled ? "Cancelada" : "Ativa"}</span>
      ),
      title: "Situação",
      id: "status",
    },
  ];

  return (
    <DataGrid
      ref={dataGridRef}
      columns={columns}
      paginatableService={DonationsService}
      singularName="doação"
      pluralName="doações"
      keyProp="id"
      actionsCellClassName="donation__col --actions"
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Ver doação</VisuallyHidden>
            </>
          ),
          onAction: (_, target) =>
            navigate(`/doacoes/${target.id}/visualizar`),
          tooltip: "Visualizar doação",
        },
        {
          type: "delete",
          content: (
            <>
              <DeleteIcon />
              <VisuallyHidden>Cancelar doação</VisuallyHidden>
            </>
          ),
          onAction: (_, target) =>
            navigate(`/doacoes/cancelar?id=${encodeURIComponent(target.id)}`),
          tooltip: "Cancelar doação",
          shouldRender: (target) => !target.isCancelled,
        },
      ]}
    />
  );
});
