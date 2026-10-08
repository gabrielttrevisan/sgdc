import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import BillsService from "../../service/BillsService";

import "./Bills.css";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon.jsx";
import { useNavigate } from "react-router";
import { HandMoneyIcon } from "../../components/icons/HandMoneyIcon.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import { useRef } from "react";
import { ScheduleCalendarIcon } from "../../components/icons/ScheduleCalendarIcon.jsx";
import { LargeCloseIcon } from "../../components/icons/LargeCloseIcon.jsx";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal.jsx";

const DESCRIPTION_MAX_LENGTH = 30;

const STATUS_LABELS = {
  PAID: "PAGO",
  UNPAID: "A PAGAR",
  CANCELED: "CANCELADA",
  EXTENDED: "ADIADO",
};

const emptyAction = () => undefined;

function formatDueDate(dueDate) {
  return new Date(dueDate).toLocaleDateString("pt-BR");
}

const BillCancelModalActions = {
  CLOSE: "CLOSE",
  KEEP: "KEEP",
  CANCEL_AND_COPY: "CANCEL-AND-COPY",
  CANCEL: "CANCEL",
};

export const Bills = WithAuthGuard(function Bills() {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);
  const cancelModalRef = useRef(null);

  const columns = [
    {
      DataGridCell: ({ description }) => (
        <span title={description}>
          {description.length > DESCRIPTION_MAX_LENGTH
            ? `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`
            : description}
        </span>
      ),
      title: "Descrição",
      id: "description",
      className: "bill__col --description",
      headingClassName: "--description",
    },
    {
      DataGridCell: ({ dueDate }) => <span>{formatDueDate(dueDate)}</span>,
      title: "Vencimento",
      id: "due-date",
      className: "bill__col --due-date",
      headingClassName: "--due-date",
    },
    {
      DataGridCell: ({ status, extendedFrom }) => {
        const label = STATUS_LABELS[status];
        const suffix =
          status === "EXTENDED" && extendedFrom
            ? ` DE ${formatDueDate(extendedFrom)}`
            : null;

        return (
          <span className={`bill__status-badge --${status.toLowerCase()}`}>
            {label}
            {suffix}
          </span>
        );
      },
      title: "Status",
      id: "status",
      className: "bill__col --status",
      headingClassName: "--status",
    },
  ];

  return (
    <>
      <DataGrid
        columns={columns}
        paginatableService={BillsService}
        singularName="conta a pagar"
        pluralName="contas a pagar"
        keyProp="id"
        sortKeyDefault="due-date"
        sortTypeDefault="desc"
        breakpoint="1200px"
        rowClassName="bill__row"
        ref={dataGridRef}
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver conta</VisuallyHidden>
              </>
            ),
            onAction: (_, target) => {
              navigate(`/contas-a-pagar/${target.id}/visualizar`);
            },
            tooltip: "Visualizar Conta a Pagar",
          },
          {
            type: "pay",
            content: (
              <>
                <HandMoneyIcon />
                <span>Pagar</span>
              </>
            ),
            shouldRender: (target) => {
              return !["PAID", "CANCELED"].includes(target.status);
            },
            onAction: async (_, target) => {
              const [response, error] = await BillsService.pay(target.id);

              if (response) {
                Toast.success("Conta paga com sucesso!");
                dataGridRef.current?.update();
                return;
              }

              Toast.error(
                <>
                  Erro inesperado{" "}
                  {error.issues.length ||
                    (error.description && (
                      <>
                        <br />
                        {error.issues[0].description}
                      </>
                    ))}
                </>,
              );
            },
          },
          {
            type: "extend",
            content: (
              <>
                <ScheduleCalendarIcon />
                <span>Adiar</span>
              </>
            ),
            shouldRender: (target) => target.status === "UNPAID",
            onAction: (_, target) => {
              navigate("/contas-a-pagar/" + target.id + "/adiar");
            },
          },
          {
            type: "cancel",
            content: (
              <>
                <LargeCloseIcon />
                <VisuallyHidden>Cancelar</VisuallyHidden>
              </>
            ),
            onAction: async (_, target) => {
              const confirm = await cancelModalRef.current?.openWithActions();

              switch (confirm) {
                case BillCancelModalActions.CANCEL:
                  navigate(`/contas-a-pagar/${target.id}/cancelar`);
                  break;
                case BillCancelModalActions.CANCEL_AND_COPY:
                  navigate(`/contas-a-pagar/${target.id}/cancelar-e-copiar`);
                  break;
              }
            },
            tooltip: "Cancelar Conta a Pagar",
            shouldRender: (target) =>
              !["CANCELED", "PAID"].includes(target.status),
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/contas-a-pagar/lancar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Lançar Conta a Pagar</span>
        </button>
      </DataGrid>

      <SensitiveModal
        ref={cancelModalRef}
        showCloseButton
        variant="warn"
        customActions={
          <>
            <button
              type="button"
              className="sensitive-modal__action --delete-text"
              data-modal-action={BillCancelModalActions.CANCEL}
            >
              Cancelar a Conta
            </button>

            <button
              type="button"
              className="sensitive-modal__action --delete"
              data-modal-action={BillCancelModalActions.CANCEL_AND_COPY}
            >
              Cancelar a Conta e Criar Cópia
            </button>

            <button
              type="button"
              className="sensitive-modal__action --cancel"
              data-modal-action={BillCancelModalActions.KEEP}
            >
              Manter a Conta
            </button>
          </>
        }
      >
        O beneficiário ainda irá existem e poderá ser recuperado. Dados
        vinculados também serão mantidos.
      </SensitiveModal>
    </>
  );
});
