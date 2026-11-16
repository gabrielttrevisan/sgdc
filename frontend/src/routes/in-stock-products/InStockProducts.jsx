import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import InStockProductsService from "../../service/InStockProductsService";
import { useNavigate } from "react-router";

export const InStockProducts = WithAuthGuard(function InStockProductsPage() {
  const navigate = useNavigate();
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Nome do produto",
      id: "name",
    },
    {
      DataGridCell: ({ expiresAt }) => <span>{expiresAt}</span>,
      title: "Data de vencimento",
      id: "expiresAt",
    },
    {
      DataGridCell: ({ count }) => <span>{count}</span>,
      title: "Quantidade em estoque",
      id: "count",
    },
  ];

  return (
    <DataGrid
      columns={columns}
      paginatableService={InStockProductsService}
      singularName="produto em estoque"
      pluralName="produtos em estoque"
      keyProp="id"
      searchBoxPlaceholder="Buscar produtos em estoque..."
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Ver produto em estoque</VisuallyHidden>
            </>
          ),
          onAction: (_type, target) =>
            navigate(`/produtos-em-estoque/${target.id}/visualizar`),
        },
      ]}
    />
  );
});
