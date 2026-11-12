import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import AttendanceService from "../../service/AttendanceService.js";
import { useNavigate } from "react-router";
import { ReadOnlyResourceForm } from "../../components/resource-form/read-only/ReadOnlyResourceForm.jsx";
import AttendanceDetailsContent from "./components/attendance-details-content/AttendanceDetailsContent.jsx";
import formatDate from "../../lib/format/date.js";

const ATTENDANCE_STATUS_LABELS = {
  OPEN: "Em aberto",
  PARTIAL: "Parcialmente fechada",
  CLOSED: "Fechada",
};

const ATTENDANCE_ITEM_STATUS_LABELS = {
  OPEN: "Em aberto",
  PARTIAL: "Parcialmente fornecido",
  CLOSED: "Fornecido",
};

export default WithAuthGuard(function AttendanceDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        const response = await AttendanceService.getById(id);

        if (response.error) return response;

        const {
          beneficiary,
          attendance,
          cancelledBy,
          cancellationReason,
          requestedItems,
        } = response.data;

        return {
          data: {
            beneficiary: beneficiary.name,
            details: attendance.details,
            status: attendance.cancelledAt
              ? "Cancelado"
              : ATTENDANCE_STATUS_LABELS[attendance.status],
            cancelledBy: cancelledBy?.name,
            cancelledAt: formatDate(attendance.cancelledAt, "Não Informado"),
            cancellationReason,
            products: requestedItems.map(
              ({ product, quantity, providedQuantity, status, inStock }) => ({
                name: `${product.name} (fornecidos ${providedQuantity} de ${quantity}; ${ATTENDANCE_ITEM_STATUS_LABELS[status]}); ${inStock ? "Em estoque" : "Fora de estoque"}`,
              }),
            ),
          },
        };
      }}
      breadcrumbs={[{ id: "attendance", name: "Atendimentos" }]}
      title="Visualizar atendimento"
      onCancel={() => navigate("/atendimentos")}
    >
      <AttendanceDetailsContent />
    </ReadOnlyResourceForm>
  );
});
