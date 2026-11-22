import { useRef } from "react";
import { useNavigate } from "react-router";

import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { DataGrid } from "../../components/data-grid/DataGrid.jsx";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal.jsx";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon.jsx";
import { EditIcon } from "../../components/icons/EditIcon.jsx";
import { DeleteIcon } from "../../components/icons/DeleteIcon.jsx";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc.jsx";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc.jsx";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import SalasService from "../../service/SalasService.js";

const Salas = WithAuthGuard(function Armaz() {
  const dataGridRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const columns = [
    {
      DataGridCell: ({ nome }) => <span>{nome}</span>,
      title: "Nome",
      id: "nome",
      sortable: true,
      SortIcon: ({ sortKey, state }) => {
        const style = sortKey === "nome" ? undefined : { opacity: "0.4" };

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
      sortKey: "nome",
      sortType: ["asc", "desc"],
    },
    {
      DataGridCell: ({ descricao }) => (
        <span>{descricao || "Sem descrição cadastrada."}</span>
      ),
      title: "Descrição",
      id: "descricao",
    },
  ];

  return (
    <>
      <SensitiveModal
        ref={modalRef}
        title="Confirmar exclusão"
        confirmLabel="Excluir"
        showCloseButton
      >
        Tem certeza que deseja excluir esta sala?
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={SalasService}
        singularName="local de armazenamento"
        pluralName="locais de armazenamento"
        title="Locais de armazenamento"
        emptyMessage="Nenhum local de armazenamento encontrado"
        keyProp="id"
        sortKeyDefault="nome"
        sortTypeDefault="asc"
        actionsConfig={[
          {
            type: "edit",
            content: (
              <>
                <EditIcon />
                <span>Editar</span>
              </>
            ),
            onAction: async (_, target) => {
              navigate(`/locais-de-armazenamento/cadastro/${target.id}`);
            },
          },
          {
            type: "delete",
            content: (
              <>
                <DeleteIcon />
                <span>Excluir</span>
              </>
            ),
            onAction: async (_, target) => {
              const confirmed = await modalRef.current?.openAsync();

              if (!confirmed) return;

              const { data, error } = await SalasService.delete(target.id);

              if (data?.success) {
                Toast.success("Sala excluída com sucesso");
                dataGridRef.current?.update();
              } else {
                Toast.error(error?.message ?? "Falha ao excluir sala");
              }
            },
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/locais-de-armazenamento/cadastro")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />
          <span>Cadastrar local de armazenamento</span>
        </button>
      </DataGrid>
    </>
  );
});

export default Salas;
