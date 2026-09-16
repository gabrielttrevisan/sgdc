import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { useRef } from "react";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import Toast from "../../components/toast/ToastStorage";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import FamiliesService from "../../service/FamiliesService";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { useNavigate } from "react-router";

import "./Families.css";

export const Families = WithAuthGuard(() => {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);
  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/FamiliesService").Family>[]} */
  const columns = [
    {
      DataGridCell: ({ id }) => <>#{id}</>,
      title: "ID",
      id: "national-id",
      className: "family__col --id",
    },
    {
      DataGridCell: ({ name }) => <span>{name.replace(/-+/i, " ")}</span>,
      title: "Nome",
      id: "name",
      className: "family__col --name",
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
            <VisuallyHidden>Ordenar por nome</VisuallyHidden>
          </>
        );
      },
      sortKey: "name",
      sortType: ["asc", "desc"],
    },
    {
      DataGridCell: ({ participants }) => {
        const [first, second, ...rest] = participants;
        const firstTwo = [first, second];

        const firstNames = firstTwo
          .map(
            (participant) =>
              `<span class="participant">${participant.name.split(" ")[0]}</span>`,
          )
          .join(rest.length === 0 ? " e " : ", ");
        const count = rest.length === 0 ? "" : `, +${rest.length}`;

        return (
          <>
            <span dangerouslySetInnerHTML={{ __html: firstNames }} />
            {count}
          </>
        );
      },
      title: "Membros",
      id: "participants",
      className: "family__col --participants",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        A família ainda irá existir e poderá ser recuperada. Dados vinculados
        também serão mantidos.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={FamiliesService}
        singularName="família"
        pluralName="famílias"
        rowClassName="family__row"
        actionsCellClassName="family__col --actions"
        keyProp="id"
        sortKeyDefault="name"
        sortTypeDefault="asc"
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Família</VisuallyHidden>
              </>
            ),
            onAction: async (_type, target) => {
              if (target) {
                navigate(`/familias/${target.id}/visualizar`);
              } else {
                Toast.error("Erro inesperado");
              }
            },
          },
          {
            type: "edit",
            content: (
              <>
                <EditIcon />
                <span>Editar</span>
              </>
            ),
            onAction: async (_type, target) => {
              if (target) {
                navigate(`/familias/${target.id}`);
              } else {
                Toast.error("Erro inesperado");
              }
            },
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
              const confirmed = await modalRef.current?.open();

              if (confirmed) {
                const { data, error } = await FamiliesService.delete(target.id);

                if (data?.success) {
                  Toast.success("Família deletada com sucesso");
                  dataGridRef.current?.update();
                } else if (error?.message) Toast.error(error.message);
              }
            },
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/familias/cadastrar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Cadastrar Família</span>
        </button>
      </DataGrid>
    </>
  );
});
