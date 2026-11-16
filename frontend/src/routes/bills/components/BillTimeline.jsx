import { useResourceFormContext } from "../../../components/resource-form/context";
import { BillTimelineCard } from "./BillTimelineCard";

import "./BillTimeline.css";
import formatDate from "../../../lib/format/date";

export function BillTimeline() {
  /** @type {{resource:import("../../../service/BillsService").FullBill|null;}} */
  const { resource } = useResourceFormContext();

  if (!resource) return;

  return (
    <div className="bill-timeline">
      {resource.created && (
        <BillTimelineCard
          {...resource.created}
          title="Registro Inicial"
          preffix="Registrada"
        />
      )}

      {resource.extended && (
        <BillTimelineCard
          {...resource.extended}
          title="Adiamento"
          preffix="Adiada"
        >
          {resource.extended.from && (
            <p>
              Adiado de {formatDate(resource.extended.from)} para{" "}
              {formatDate(resource.dueDate)}
            </p>
          )}

          {resource.extended.details && (
            <p className="bill-timeline-card__details">
              <strong>Motivo: </strong>
              {resource.extended.details}
            </p>
          )}
        </BillTimelineCard>
      )}

      {resource.canceled && (
        <BillTimelineCard
          {...resource.canceled}
          title="Cancelamento"
          preffix="Cancelada"
        >
          {resource.canceled.details && (
            <p className="bill-timeline-card__details">
              <strong>Motivo: </strong>
              {resource.canceled.details}
            </p>
          )}
        </BillTimelineCard>
      )}

      {resource.paid && (
        <BillTimelineCard {...resource.paid} title="Pagamento" preffix="Paga">
          {resource.paid.details && (
            <p className="bill-timeline-card__details">
              <strong>Detalhes do Pagamento: </strong>
              {resource.paid.details}
            </p>
          )}
          {resource.paid.paidValue && (
            <p className="bill-timeline-card__details">
              <strong>Valor do Pagamento: </strong>
              {resource.paid.paidValue.toLocaleString("pt-br", {
                currency: "BRL",
                style: "currency",
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </BillTimelineCard>
      )}
    </div>
  );
}
