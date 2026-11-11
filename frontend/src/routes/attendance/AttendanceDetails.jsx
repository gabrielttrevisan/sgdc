import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { useResourceFormContext } from "../../components/resource-form/context";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import AttendanceService from "../../service/AttendanceService.js";
import { useNavigate } from "react-router";

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

function AttendanceDetailsContent() {
  const { resource } = useResourceFormContext();

  if (!resource) return null;

  return (
    <div className="attendance-details">
      <section>
        <h3>Atendimento #{resource.attendance.id}</h3>
        <p>
          <strong>Beneficiário:</strong> {resource.beneficiary.name} (#
          {resource.beneficiary.id})
        </p>
        <p>
          <strong>Detalhes:</strong> {resource.attendance.details}
        </p>
        <p>
          <strong>Situação:</strong>{" "}
          {resource.attendance.cancelledAt
            ? "Cancelado"
            : ATTENDANCE_STATUS_LABELS[resource.attendance.status]}
        </p>
        <p>
          <strong>Cancelado por:</strong>{" "}
          {resource.cancelledBy
            ? `${resource.cancelledBy.name} (#${resource.cancelledBy.id})`
            : "Não cancelado"}
        </p>
        {resource.cancellationReason && (
          <p>
            <strong>Motivo do cancelamento:</strong>{" "}
            {resource.cancellationReason}
          </p>
        )}
      </section>

      <section>
        <h3>Produtos solicitados</h3>
        {resource.requestedItems.length ? (
          <ul>
            {resource.requestedItems.map(
              ({ product, quantity, providedQuantity, status, inStock }) => (
              <li key={product.id}>
                #{product.id} - {product.name} (fornecido: {providedQuantity} de{" "}
                {quantity}; {ATTENDANCE_ITEM_STATUS_LABELS[status]}) —{" "}
                {inStock ? "Em estoque" : "Fora de estoque"}
              </li>
              ),
            )}
          </ul>
        ) : (
          <p>Nenhum produto solicitado.</p>
        )}
      </section>
    </div>
  );
}

export default WithAuthGuard(function AttendanceDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={(id) => AttendanceService.getById(id)}
      breadcrumbs={[{ id: "attendance", name: "Atendimentos" }]}
      title="Visualizar atendimento"
      onCancel={() => navigate("/atendimentos")}
    >
      <AttendanceDetailsContent />
    </ReadOnlyResourceForm>
  );
});
