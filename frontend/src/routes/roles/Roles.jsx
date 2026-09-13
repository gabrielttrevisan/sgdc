import { DataGrid } from "../../components/data-grid/DataGrid";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { EditIcon } from "../../components/icons/EditIcon";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import RolesService from "../../service/RolesService";

export const Roles = WithAuthGuard(() => {
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Título",
      id: "name",
      className: "roles__col --name",
      sortable: true,
      SortIcon: ({ sortKey, state }) => {
        const style = sortKey === "name" ? undefined : { opacity: "0.4" };

        return (
          <>
            {!state || state === "asc" ? (
              <AtoZIconAsc style={style} />
            ) : (
              <AtoZIconDesc style={style} />
            )}
            <VisuallyHidden>Ordenar por título</VisuallyHidden>
          </>
        );
      },
      sortKey: "name",
      sortType: ["asc", "desc"],
    },
  ];

  return (
    <DataGrid
      columns={columns}
      paginatableService={RolesService}
      singularName="nível de acesso"
      pluralName="níveis de acesso"
      rowClassName="roles__row"
      actionsCellClassName="roles__col --actions"
      keyProp="id"
      sortKeyDefault="name"
      sortTypeDefault="asc"
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <ShowIcon />
              <VisuallyHidden>Ver nível de acesso</VisuallyHidden>
            </>
          ),
        },
        {
          type: "edit",
          content: (
            <>
              <EditIcon />
              <span>Editar</span>
            </>
          ),
        },
      ]}
    />
  );
});
