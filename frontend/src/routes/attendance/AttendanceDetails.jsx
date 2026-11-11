import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { useResourceFormContext } from "../../components/resource-form/context";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import AttendanceService from "../../service/AttendanceService.js";
import { useNavigate } from "react-router";

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
            {resource.requestedItems.map(({ product, quantity, inStock }) => (
              <li key={product.id}>
                #{product.id} - {product.name} (quantidade: {quantity}) —{" "}
                {inStock ? "Em estoque" : "Fora de estoque"}
              </li>
            ))}
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
