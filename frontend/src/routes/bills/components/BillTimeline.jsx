import { useResourceFormContext } from "../../../components/resource-form/context";
import { BillTimelineCard } from "./BillTimelineCard";

import "./BillTimeline.css";

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
          userPreffix="Registrada por"
        />
      )}

      {resource.extended && (
        <BillTimelineCard
          {...resource.extended}
          title="Adiamento"
          userPreffix="Adiada por"
        />
      )}

      {resource.canceled && (
        <BillTimelineCard
          {...resource.canceled}
          title="Cancelamento"
          userPreffix="Cancelada por"
        />
      )}

      {resource.paid && (
        <BillTimelineCard
          {...resource.paid}
          title="Pagamento"
          userPreffix="Paga por"
        />
      )}
    </div>
  );
}
