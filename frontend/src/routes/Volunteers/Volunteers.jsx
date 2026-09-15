import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { DonateIcon } from "../../components/icons/DonateIcon";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import Toast from "../../components/toast/ToastStorage";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import VolunteerService from "../../service/VolunteerService";

export const Volunteers = WithAuthGuard(() => {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);

  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/VolunteerService").Volunteer>[]} */
  const columns = [
  {
    DataGridCell: ({ name }) => <span>{name}</span>,
    title: "Nome",
    id: "name",
    className: "volunteer__col --name",
    sortable: true,
    SortIcon: ({ sortKey, state }) => {
      const style =
        sortKey === "name" ? undefined : { opacity: "0.4" };

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
    DataGridCell: ({ nationalId }) => <>{nationalId}</>,
    title: "CPF",
    id: "national-id",
    className: "volunteer__col --national-id",
  },
  {
    DataGridCell: ({ phone }) => <>{phone}</>,
    title: "Telefone",
    id: "phone",
    className: "volunteer__col --phone",
  },
];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        O voluntário ainda irá existir e poderá ser recuperado. Dados
        vinculados também serão mantidos.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={VolunteerService}
        singularName="voluntário"
        pluralName="voluntários"
        rowClassName="volunteer__row"
        actionsCellClassName="volunteer__col --actions"
        keyProp="nationalId"
        sortKeyDefault="name"
        sortTypeDefault="asc"
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Voluntário</VisuallyHidden>
              </>
            ),
            onAction: (_type, target) => {
              navigate(`/voluntarios/${target.id}/visualizar`);
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
            onAction: (_type, target) => {
              navigate(`/voluntarios/${target.id}`);
            },
          },
          {
            type: "donate",
            content: (
              <>
                <DonateIcon />
                <span>Alocar</span>
              </>
            ),
            onAction: async () => {
              Toast.warn("Funcionalidade de Alocação (RF_F) em desenvolvimento.");
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
                const { data, error } = await VolunteerService.delete(
                  target.id,
                );

                if (data?.success) {
                  Toast.success(
                    "Voluntário deletado com sucesso",
                  );

                  dataGridRef.current?.update();
                } else if (error?.message) {
                  Toast.error(error.message);
                }
              }
            },
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/voluntarios/cadastrar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Cadastrar Voluntário</span>
        </button>
      </DataGrid>
    </>
  );
});