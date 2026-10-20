import { useRef } from "react";
import { useNavigate } from "react-router";
import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import Toast from "../../components/toast/ToastStorage";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import AllocationsService from "../../service/AllocationsService";

import "./Allocations.css";

const NOTES_CLAMP_MAX = 30;

/**
 * @param {string} value
 * @returns {string}
 */
function formatDateTime(value) {
  const date = new Date(value);

  if (isNaN(date.getTime())) return "--";

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const Allocations = WithAuthGuard(() => {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);

  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/AllocationsService").Allocation>[]} */
  const columns = [
    {
      DataGridCell: ({ volunteerName }) => <span>{volunteerName}</span>,
      title: "Voluntário",
      id: "volunteer",
      className: "allocation__col --volunteer",
    },
    {
      DataGridCell: ({ allocationTypeName }) => (
        <span>{allocationTypeName}</span>
      ),
      title: "Tipo de Alocação",
      id: "allocation-type",
      className: "allocation__col --type",
    },
    {
      DataGridCell: ({ startAt }) => <span>{formatDateTime(startAt)}</span>,
      title: "Início",
      id: "start",
      className: "allocation__col --start",
      sortable: true,
      SortIcon: ({ sortKey, state }) => {
        const style = sortKey === "start" ? undefined : { opacity: "0.4" };

        return (
          <>
            {!state || state === "asc" ? (
              <AtoZIconAsc style={style} />
            ) : (
              <AtoZIconDesc style={style} />
            )}

            <VisuallyHidden>Ordenar por início</VisuallyHidden>
          </>
        );
      },
      sortKey: "start",
      sortType: ["asc", "desc"],
    },
    {
      DataGridCell: ({ endAt }) => <span>{formatDateTime(endAt)}</span>,
      title: "Término",
      id: "end",
      className: "allocation__col --end",
    },
    {
      DataGridCell: ({ notes }) => {
        if (!notes) return <span>--</span>;

        const text =
          notes.length > NOTES_CLAMP_MAX
            ? notes.slice(0, NOTES_CLAMP_MAX + 1) + "..."
            : notes;

        return <span>{text}</span>;
      },
      title: "Observações",
      id: "notes",
      className: "allocation__col --notes",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        A alocação ainda irá existir e poderá ser recuperada. Dados vinculados
        também serão mantidos.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={AllocationsService}
        singularName="alocação"
        pluralName="alocações"
        rowClassName="allocation__row"
        actionsCellClassName="allocation__col --actions"
        keyProp="id"
        sortKeyDefault="start"
        sortTypeDefault="desc"
        searchBoxPlaceholder="Buscar por voluntário ou tipo de alocação..."
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Alocação</VisuallyHidden>
              </>
            ),
            onAction: (_type, target) => {
              navigate(`/alocacoes/${target.id}/visualizar`);
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
              navigate(`/alocacoes/${target.id}`);
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
                const { data, error } = await AllocationsService.delete(
                  target.id,
                );

                if (data?.success) {
                  Toast.success("Alocação deletada com sucesso");
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
          onClick={() => navigate("/alocacoes/cadastrar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Cadastrar Alocação</span>
        </button>
      </DataGrid>
    </>
  );
});
