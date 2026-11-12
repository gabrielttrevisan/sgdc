import { useLocation, useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc";
import { DataGridMultiSelect } from "../../components/data-grid/DataGridMultiSelect";
import InStockProductsService from "../../service/InStockProductsService";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import getSafeListId from "../../store/list/getSafeListId";

const InStockBatchesService = {
  list: (query) => InStockProductsService.listBatches(query),
};

export const SelectInStockProducts = WithAuthGuard(function SelectInStockProducts() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const listId = getSafeListId(state?.listId);

  if (!listId || !state?.from) return <></>;

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
          SortIcon: ({ sortKey, state: sortState }) => (
            <>
              {sortState === "desc" ? (
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
        {
          DataGridCell: ({ expiresAt }) => <span>{expiresAt}</span>,
          title: "Validade",
          id: "expiresAt",
        },
        {
          DataGridCell: ({ count }) => <span>{count}</span>,
          title: "Disponível",
          id: "count",
        },
        {
          DataGridCell: ({ roomName }) => <span>{roomName}</span>,
          title: "Sala",
          id: "roomName",
        },
      ]}
      paginatableService={InStockBatchesService}
      singularName="lote"
      pluralName="produtos em estoque"
      keyProp="id"
      sortKeyDefault="name"
      sortTypeDefault="asc"
      searchBoxPlaceholder="Buscar produtos em estoque..."
      listId={listId}
      title="Selecionar produtos para doação"
    >
      <button
        type="button"
        onClick={() => navigate(state.from, { state: { ...state, listId } })}
        className="button-block --solid --primary"
      >
        <AddLargeIcon />
        <span>Selecionar</span>
      </button>
    </DataGridMultiSelect>
  );
});
