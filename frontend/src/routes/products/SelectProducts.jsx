import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc";
import { DataGridMultiSelect } from "../../components/data-grid/DataGridMultiSelect";
import ProductsService from "../../service/ProductsService";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import getSafeListId from "../../store/list/getSafeListId";

export const SelectProducts = WithAuthGuard(function SelectProducts() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const listId = getSafeListId(state.listId);

  if (!listId || !state.from) return <></>;

  const handleClick = () => {
    navigate(state.from, { state: { ...state, listId } });
  };

  return (
    <DataGridMultiSelect
      columns={[
        {
          DataGridCell: ({ name }) => <span>{name}</span>,
          title: "Produto",
          id: "name",
          sortable: true,
          sortKey: "name",
          sortType: ["asc", "desc"],
          SortIcon: ({ sortKey, state }) => (
            <>
              {state === "desc" ? (
                <AtoZIconDesc
                  style={sortKey === "name" ? undefined : { opacity: "0.4" }}
                />
              ) : (
                <AtoZIconAsc
                  style={sortKey === "name" ? undefined : { opacity: "0.4" }}
                />
              )}
              <VisuallyHidden>Ordenar por nome</VisuallyHidden>
            </>
          ),
        },
      ]}
      paginatableService={ProductsService}
      singularName="produto"
      pluralName="produtos"
      keyProp="id"
      sortKeyDefault="name"
      sortTypeDefault="asc"
      searchBoxPlaceholder="Buscar produtos..."
      listId={listId}
      title={"Selecionar Produtos para Arrecadação"}
    >
      <button
        type="button"
        onClick={handleClick}
        className="button-block --solid"
      >
        <AddLargeIcon />
        <span>Selecionar</span>
      </button>
    </DataGridMultiSelect>
  );
});
