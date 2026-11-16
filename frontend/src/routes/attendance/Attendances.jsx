import { useNavigate } from "react-router";
import { DataGrid } from "../../components/data-grid/DataGrid";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { LargeCloseIcon } from "../../components/icons/LargeCloseIcon";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import AttendanceService from "../../service/AttendanceService.js";
import formatName from "../../lib/format/name.js";

const DETAILS_MAX_LENGTH = 48;

const ATTENDANCE_STATUS_LABELS = {
  OPEN: "Em aberto",
  PARTIAL: "Parcialmente fechada",
  CLOSED: "Fechada",
};

export const Attendances = WithAuthGuard(function Attendances() {
  const navigate = useNavigate();

  const columns = [
    {
      DataGridCell: ({ id }) => <>#{id}</>,
      title: "ID",
      id: "id",
      className: "attendance__col --id",
    },
    {
      DataGridCell: ({ beneficiary }) => (
        <span title={beneficiary.name}>{formatName(beneficiary.name)}</span>
      ),
      title: "Beneficiário",
      id: "beneficiary",
      className: "attendance__col --beneficiary",
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
      className: "attendance__col --details",
    },
    {
      DataGridCell: ({ isCancelled, status }) => (
        <span
          className={`attendance__status --${isCancelled ? "cancelled" : status.toLowerCase()}`}
        >
          {isCancelled ? "Cancelado" : ATTENDANCE_STATUS_LABELS[status]}
        </span>
      ),
      title: "Situação",
      id: "status",
      className: "attendance__col --status",
    },
  ];

  return (
    <DataGrid
      columns={columns}
      paginatableService={AttendanceService}
      singularName="atendimento"
      pluralName="atendimentos"
      keyProp="id"
      rowClassName="attendance__row"
      actionsCellClassName="attendance__col --actions"
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Ver atendimento</VisuallyHidden>
            </>
          ),
          onAction: (_, target) =>
            navigate(`/atendimentos/${target.id}/visualizar`),
          tooltip: "Visualizar atendimento",
        },
        {
          type: "edit",
          content: (
            <>
              <EditIcon />
              <span>Editar</span>
            </>
          ),
          onAction: (_, target) => navigate(`/atendimento/${target.id}`),
          shouldRender: (target) =>
            !target.isCancelled && target.status !== "CLOSED",
        },
        {
          type: "cancel",
          content: (
            <>
              <LargeCloseIcon />
              <VisuallyHidden>Cancelar atendimento</VisuallyHidden>
            </>
          ),
          onAction: (_, target) =>
            navigate(
              `/atendimentos/cancelar?id=${encodeURIComponent(target.id)}`,
            ),
          tooltip: "Cancelar atendimento",
          shouldRender: (target) =>
            !target.isCancelled && target.status !== "CLOSED",
        },
      ]}
    >
      <button
        type="button"
        onClick={() => navigate("/familias")}
        className="button-block --solid --btn-safe"
      >
        <AddLargeIcon />
        <span>Registrar atendimento</span>
      </button>
    </DataGrid>
  );
});
