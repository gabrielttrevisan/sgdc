import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGridMultiSelect } from "../../components/data-grid/DataGridMultiSelect.jsx";
import VolunteerService from "../../service/VolunteerService.js";
import getSafeListId from "../../store/list/getSafeListId.js";

export const SelectVolunteers = WithAuthGuard(function SelectVolunteers() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const listId = getSafeListId(state?.listId);

  if (!listId || !state?.from) return <></>;

  return (
    <DataGridMultiSelect
      columns={[
        {
          DataGridCell: ({ name }) => <span>{name}</span>,
          title: "Nome",
          id: "name",
        },
        {
          DataGridCell: ({ phone }) => <span>{phone}</span>,
          title: "Telefone",
          id: "phone",
        },
      ]}
      paginatableService={VolunteerService}
      singularName="voluntário"
      pluralName="voluntários"
      keyProp="id"
      searchBoxPlaceholder="Buscar voluntários..."
      listId={listId}
      title="Selecionar voluntários envolvidos"
    >
      <button
        type="button"
        onClick={() => navigate(state.from, { state: { ...state, listId } })}
        className="button-block --solid --primary"
      >
        <span>Selecionar</span>
      </button>
    </DataGridMultiSelect>
  );
});
