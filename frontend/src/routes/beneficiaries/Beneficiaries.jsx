import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { DonateIcon } from "../../components/icons/DonateIcon";
import { ArrowDownIcon } from "../../components/icons/ArrowDownIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import Toast from "../../components/toast/ToastStorage";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import BeneficiariesService from "../../service/BeneficiariesService";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";

import "./Beneficiaries.css";

export const Beneficiaries = WithAuthGuard(() => {
  const navigate = useNavigate();
  const dataGridRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/BeneficiariesService").Beneficiary>[]} */
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Nome",
      id: "name",
      className: "beneficiary__col --name",
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
      DataGridCell: ({ nationalId }) => <>{nationalId}</>,
      title: "CPF",
      id: "national-id",
      className: "beneficiary__col --national-id",
    },
    {
      DataGridCell: ({ hasOpenRequest }) => (
        <span
          className={`beneficiary__request-badge ${hasOpenRequest === "sim" ? "--warn" : "--none"}`}
        >
          <VisuallyHidden>Beneficiário possui atendimento: </VisuallyHidden>
          {hasOpenRequest.toUpperCase()}
        </span>
      ),
      title: "Atendimento",
      id: "has-open-request",
      className: "beneficiary__col --has-request",
      sortable: true,
      SortIcon: ({ sortKey }) => (
        <>
          <ArrowDownIcon
            style={sortKey === "request" ? undefined : { opacity: "0.4" }}
          />
          <VisuallyHidden>
            Mostrar beneficiários com atendimento aberto primeiro
          </VisuallyHidden>
        </>
      ),
      sortKey: "request",
      headingClassName: "--has-request",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        O beneficiário ainda irá existem e poderá ser recuperado. Dados
        vinculados também serão mantidos.
      </SensitiveModal>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={BeneficiariesService}
        singularName="beneficiário"
        pluralName="beneficiários"
        rowClassName="beneficiary__row"
        actionsCellClassName="beneficiary__col --actions"
        keyProp="nationalId"
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
            onAction: (_type, target) => {
              navigate(`/beneficiarios/${target.id}/visualizar`);
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
              navigate(`/beneficiarios/${target.id}`);
            },
          },
          {
            type: "donate",
            content: (
              <>
                <DonateIcon />
                <span>Doar</span>
              </>
            ),
            onAction: async () => {
              Toast.warn("Função não implementada!");
            },
            buttonProps: { disabled: true },
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
                const { data, error } = await BeneficiariesService.delete(
                  target.id,
                );

                if (data?.success) {
                  Toast.success("Beneficiário deletado com sucesso");
                  dataGridRef.current?.update();
                } else if (error?.message) Toast.error(error.message);
              }
            },
          },
        ]}
      >
        <button
          type="button"
          onClick={() => navigate("/beneficiarios/cadastrar")}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Cadastrar Beneficiário</span>
        </button>
      </DataGrid>
    </>
  );
});
