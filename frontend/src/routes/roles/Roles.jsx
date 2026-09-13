import { DataGrid } from "../../components/data-grid/DataGrid";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { EditIcon } from "../../components/icons/EditIcon";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { UserIcon } from "../../components/icons/UserIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import RolesService from "../../service/RolesService";
import { useNavigate } from "react-router";
import { useRef } from "react";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import Toast from "../../components/toast/ToastStorage";
import { CloseIconLarge } from "../../components/icons/CloseIconLarge.jsx";

const DESCRIPTION_CLAMP_MAX = 36;

export const Roles = WithAuthGuard(() => {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);
  const modalRef = useRef(null);

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
    {
      DataGridCell: ({ description }) => {
        if (!description) return <span>--</span>;

        return (
          <span>
            {description.length > DESCRIPTION_CLAMP_MAX
              ? `${description.slice(0, DESCRIPTION_CLAMP_MAX + 1)}...`
              : description}
          </span>
        );
      },
      title: "Descrição",
      id: "description",
      className: "roles__col --description",
    },
    {
      DataGridCell: ({ isActive }) => (
        <span
          className={`user__is-active-badge ${isActive ? "--inactive" : "--active"}`}
        >
          <VisuallyHidden>Nível de acesso está ativo: </VisuallyHidden>
          {isActive ? "SIM" : "NÃO"}
        </span>
      ),
      title: "Ativo",
      id: "is-active",
      className: "users__col --is-active",
    },
  ];

  return (
    <>
      <SensitiveModal
        ref={modalRef}
        showCloseButton
        confirmLabel="Desativar mesmo assim"
        title="Deseja realmente desativar esse nível de acesso?"
      >
        Não será possível mais vinculá-lo a novos usuários, porém usuários
        vinculados a ele ainda permanecerão com este nivel de acesso.
        <br />
        Usuários com nível de acesso inativo não conseguirão mais logar no
        sistema.
        <br />É possível reativá-lo a qualquer momento.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
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
            onAction: async (_, target) => {
              navigate(`/niveis-de-acesso/${target.id}`);
            },
          },
          {
            type: "deactivate",
            content: (
              <>
                <CloseIconLarge size="12px" />
                <span>Desativar</span>
              </>
            ),
            onAction: async (_, target) => {
              const confirmed = await modalRef.current?.open();

              if (!confirmed) return;

              const { data, error } = await RolesService.delete(target.id);

              if (data?.success) {
                Toast.success("Nível de acesso deletado com sucesso");
                dataGridRef.current?.update();
              } else if (error) {
                Toast.error(error.issues?.[0]?.description ?? error.message);
              }
            },
            shouldRender: (target) => target.isActive,
          },
          {
            type: "restore",
            content: (
              <>
                <UserIcon />
                <span>Reativar</span>
              </>
            ),
            onAction: async (_, target) => {
              const response = await RolesService.restore(target.id);

              if (response.data?.success) {
                Toast.success("Nível de acesso reativado com sucesso");
                dataGridRef.current?.update();
              } else {
                Toast.error(
                  response.error?.issues?.[0]?.description ??
                    response.error?.message ??
                    "Não foi possível reativar nível de acesso",
                );
              }
            },
            shouldRender: (target) => !target.isActive,
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/niveis-de-acesso/cadastrar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />
          <span>Cadastrar Nível de Acesso</span>
        </button>
      </DataGrid>
    </>
  );
});
