import { useResourceFormContext } from "../../../components/resource-form/context";

const actionLabels = {
  create: "Cadastro",
  update: "Atualização",
  delete: "Exclusão",
};

function formatActionDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export function UserTimeline() {
  const { resource } = useResourceFormContext();
  const actions = resource?.actions ?? [];

  return (
    <section className="resource-actions" aria-label="Histórico de ações">
      <h3 className="resource-actions__title">Histórico de ações</h3>
      <div className="resource-actions__list">
        {actions.map((action) => (
          <article
            className="resource-action-card"
            key={`${action.type}-${action.date}`}
          >
            <span className="resource-action-card__type">
              {actionLabels[action.type] ?? action.type}
            </span>
            <p className="resource-action-card__meta">
              Data: {formatActionDate(action.date)}
            </p>
            <p className="resource-action-card__meta">
              Usuário: {action.userId} - {action.userName}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}