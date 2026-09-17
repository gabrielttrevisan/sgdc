import { useRef } from "react";
import { useNavigate } from "react-router";
import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import Toast from "../../components/toast/ToastStorage";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import ProductsService from "../../service/ProductsService";

import "./css/products.css";

export default WithAuthGuard(function Products() {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);
  const deleteModalRef = useRef(null);

  const columns = [
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
            <AtoZIconDesc style={sortKey === "name" ? undefined : { opacity: "0.4" }} />
          ) : (
            <AtoZIconAsc style={sortKey === "name" ? undefined : { opacity: "0.4" }} />
          )}
          <VisuallyHidden>Ordenar por nome</VisuallyHidden>
        </>
      ),
    },
    {
      DataGridCell: ({ measuringUnitName, measuringUnitSymbol }) => (
        <span>{measuringUnitName} ({measuringUnitSymbol})</span>
      ),
      title: "Unidade",
      id: "measuring-unit",
    },
    {
      DataGridCell: ({ isPerishable }) => <span>{isPerishable ? "Sim" : "Não"}</span>,
      title: "Perecível",
      id: "perishable",
    },
    {
      DataGridCell: ({ needRefrigeration }) => (
        <span>{needRefrigeration ? "Sim" : "Não"}</span>
      ),
      title: "Refrigeração",
      id: "refrigeration",
    },
    {
      DataGridCell: ({ description }) => <span>{description || ""}</span>,
      title: "Descrição",
      id: "description",
    },
  ];

  return (
    <>
      <SensitiveModal ref={deleteModalRef} showCloseButton>
        O produto será removido, mas poderá ser recuperado posteriormente.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={ProductsService}
        singularName="produto"
        pluralName="produtos"
        keyProp="id"
        sortKeyDefault="name"
        sortTypeDefault="asc"
        searchBoxPlaceholder="Buscar produtos..."
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver produto</VisuallyHidden>
              </>
            ),
            onAction: (_type, target) =>
              navigate(`/produtos/${target.id}/visualizar`),
          },
          {
            type: "edit",
            content: (
              <>
                <EditIcon />
                <span>Editar</span>
              </>
            ),
            onAction: (_type, target) => navigate(`/produtos/${target.id}`),
          },
          {
            type: "delete",
            content: (
              <>
                <DeleteIcon />
                <span>Deletar</span>
              </>
            ),
            onAction: async (_type, target) => {
              if (!(await deleteModalRef.current?.open())) return;

              const response = await ProductsService.delete(target.id);
              if (response.data?.success) {
                Toast.success("Produto deletado com sucesso");
                dataGridRef.current?.update();
              } else if (response.error?.message) Toast.error(response.error.message);
            },
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/produtos/cadastrar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />
          <span>Cadastrar Produto</span>
        </button>
      </DataGrid>
    </>
  );
});
