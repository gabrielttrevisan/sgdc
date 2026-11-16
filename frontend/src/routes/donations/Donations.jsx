import { useRef } from "react";
import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon.jsx";
import DonationsService from "../../service/DonationsService.js";
import formatName from "../../lib/format/name.js";
import formatDate from "../../lib/format/date.js";

export const Donations = WithAuthGuard(function Donations() {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);

  const columns = [
    {
      DataGridCell: ({ beneficiary }) => (
        <span title={beneficiary.name}>{formatName(beneficiary.name)}</span>
      ),
      title: "Beneficiário",
      id: "beneficiary",
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
          onAction: (_, target) => navigate(`/doacoes/${target.id}/visualizar`),
          tooltip: "Visualizar doação",
        },
      ]}
    />
  );
});
