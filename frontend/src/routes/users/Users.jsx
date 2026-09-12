import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { ShowIcon } from "../../components/icons/ShowIcon.jsx";
import { EditIcon } from "../../components/icons/EditIcon.jsx";
import { ArrowDownIcon } from "../../components/icons/ArrowDownIcon.jsx";
import { ArrowUpIcon } from "../../components/icons/ArrowUpIcon.jsx";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc.jsx";
import { useRef } from "react";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal.jsx";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import UsersService from "../../service/UsersService.js";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc.jsx";

import "./Users.css";
import { UserForbidIcon } from "../../components/icons/UserForbidIcon.jsx";
import { UserIcon } from "../../components/icons/UserIcon.jsx";
import { useNavigate } from "react-router";

export const Users = WithAuthGuard(() => {
  const dataGridRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal.jsx").SensitiveModalRef>} */
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleCreate = () => navigate("/usuarios/cadastrar");

  /** @type {import("../../components/data-grid/DataGrid.jsx").DataGridColumn<import("../../service/BeneficiariesService.js").Beneficiary>[]} */
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Nome",
      id: "name",
      className: "users__col --name",
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
      DataGridCell: ({ username }) => <>{username}</>,
      title: "Nome de Usuário",
      id: "username",
      className: "users__col --national-id",
    },
    {
      DataGridCell: ({ isActive }) => (
        <span
          className={`user__is-active-badge ${isActive ? "--inactive" : "--active"}`}
        >
          <VisuallyHidden>Usuário está ativo: </VisuallyHidden>
          {isActive ? "SIM" : "NÃO"}
        </span>
      ),
      title: "Ativo",
      id: "is-active",
      className: "users__col --is-active",
    },
    {
      DataGridCell: ({ role }) => (
        <span className={`user__role-badge --${role.name.toLowerCase()}`}>
          {role.name.toUpperCase()}
        </span>
      ),
      title: "Nível de Acesso",
      id: "role",
      className: "users__col --role",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        O usuário ainda irá existir e poderá ser recuperado. Dados vinculados
        também serão mantidos.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={UsersService}
        singularName="usuário"
        pluralName="usuários"
        rowClassName="users__row"
        actionsCellClassName="users__col --actions"
        keyProp="id"
        sortKeyDefault="name"
        sortTypeDefault="asc"
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Beneficiário</VisuallyHidden>
              </>
            ),
            onAction: async (_type, target) => {},
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
              navigate("/usuarios/" + target.id);
            },
          },
          {
            type: "deactivate",
            content: (
              <>
                <UserForbidIcon />
                <span>Desativar</span>
              </>
            ),
            onAction: async (_type, target) => {
              const response = await UsersService.deactivate(target.id);

              if (response.data?.success) {
                Toast.success("Usuário desativado com sucesso");
                dataGridRef.current?.update();
              } else {
                Toast.error(
                  response.error?.message ??
                    "Não foi possível desativar usuário",
                );
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
            onAction: async (_type, target) => {
              const response = await UsersService.activate(target.id);

              if (response.data?.success) {
                Toast.success("Usuário reativado com sucesso");
                dataGridRef.current?.update();
              } else {
                Toast.error(
                  response.error?.message ??
                    "Não foi possível reativar usuário",
                );
              }
            },
            shouldRender: (target) => !target.isActive,
          },
        ]}
      >
        <button
          type="button"
          onClick={handleCreate}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Cadastrar Usuário</span>
        </button>
      </DataGrid>
    </>
  );
});
