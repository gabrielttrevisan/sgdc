import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { useResourceFormContext } from "../../components/resource-form/context.js";
import DonationsService from "../../service/DonationsService.js";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("pt-BR");
}

function DonationDetailsContent() {
  const { resource } = useResourceFormContext();

  if (!resource) return null;

  const { donation, beneficiary, createdBy, cancelledBy, attendance, items } =
    resource;

  return (
    <div className="donation-details">
      <section>
        <h3>Doação #{donation.id}</h3>
        <p>
          <strong>Beneficiário:</strong> #{beneficiary.id} - {beneficiary.name}
        </p>
        <p>
          <strong>Família:</strong> {beneficiary.family?.name ?? "—"}
        </p>
        <p>
          <strong>Detalhes:</strong> {donation.details}
        </p>
        <p>
          <strong>Criada em:</strong> {formatDateTime(donation.createdAt)}
        </p>
        <p>
          <strong>Criada por:</strong> {createdBy.name} (#{createdBy.id})
        </p>
        <p>
          <strong>Situação:</strong>{" "}
          {donation.cancelledAt ? "Cancelada" : "Ativa"}
        </p>
        {cancelledBy && (
          <>
            <p>
              <strong>Cancelada em:</strong>{" "}
              {formatDateTime(donation.cancelledAt)}
            </p>
            <p>
              <strong>Cancelada por:</strong> {cancelledBy.name} (#
              {cancelledBy.id})
            </p>
            {donation.cancellationDetails && (
              <p>
                <strong>Motivo do cancelamento:</strong>{" "}
                {donation.cancellationDetails}
              </p>
            )}
          </>
        )}
      </section>

      <section>
        <h3>Produtos doados</h3>
        {items.length > 0 ? (
          <ul>
            {items.map(({ product, quantity }) => (
              <li key={product.id}>
                #{product.id} - {product.name} (quantidade: {quantity})
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum produto registrado.</p>
        )}
      </section>

      <section>
        <h3>Atendimento relacionado</h3>
        {attendance ? (
          <>
            <p>
              <strong>Atendimento:</strong> #{attendance.id}
            </p>
            <p>
              <strong>Beneficiário atendido:</strong> {attendance.attendee.name}{" "}
              (#{attendance.attendee.id})
            </p>
            <p>
              <strong>Data do atendimento:</strong>{" "}
              {formatDateTime(attendance.attendedAt)}
            </p>
            <p>
              <strong>Detalhes:</strong> {attendance.details}
            </p>
          </>
        ) : (
          <p>Esta doação não está vinculada a um atendimento.</p>
        )}
      </section>
    </div>
  );
}

export default WithAuthGuard(function DonationDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={(id) => DonationsService.getById(id)}
      breadcrumbs={[{ id: "donations", name: "Doações" }]}
      title="Visualizar doação"
      onCancel={() => navigate("/doacoes")}
    >
      <DonationDetailsContent />
    </ReadOnlyResourceForm>
  );
});
