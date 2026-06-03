import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { DonateIcon } from "../../components/icons/DonateIcon";
import { ArrowDownIcon } from "../../components/icons/ArrowDownIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { useRef } from "react";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import { BeneficiaryFormModal } from "./components/beneficiary-form-modal/BeneficiaryFormModal";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import Toast from "../../components/toast/ToastStorage";

import "./Beneficiaries.css";
import BeneficiariesService from "../../service/BeneficiariesService";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";

export const Beneficiaries = () => {
  const dataGridRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/form/modal/FormModal").FormModalRef>} */
  const formModalRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("./BeneficiariesService").Beneficiary>[]} */
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

      <FormControllerProvider>
        <BeneficiaryFormModal
          ref={formModalRef}
          onSubmit={{
            create: async (data) => {
              const response = await BeneficiariesService.create(data);

              if (response.data?.success) {
                dataGridRef.current?.update();
                formModalRef.current?.close();
                Toast.success("Beneficiário cadastrado com sucesso");

                return true;
              } else if (response.error) {
                Toast.error(
                  <>
                    <strong>Falha ao cadastrar beneficiário</strong>
                    <br />
                    <span>{response.error.issues?.[0]?.description}</span>
                  </>,
                );
              }

              return false;
            },
            edit: async (data) => {
              const reponse = await BeneficiariesService.edit(data);

              if (reponse.data?.success) {
                dataGridRef.current?.update();
                formModalRef.current?.close();
                Toast.success("Beneficiário editado com sucesso");

                return true;
              } else if (reponse.error) {
                Toast.error("Falha ao editar beneficiário");
              }

              return false;
            },
          }}
        />
      </FormControllerProvider>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={BeneficiariesService}
        singularName="beneficiário"
        pluralName="beneficiários"
        rowClassName="beneficiary__row"
        actionsCellClassName="beneficiary__col --actions"
        keyProp="nationalId"
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Beneficiário</VisuallyHidden>
              </>
            ),
            onAction: async (_type, target) => {
              const { data, error } = await BeneficiariesService.getById(
                target.id,
              );

              if (error?.message) {
                Toast.error(error.message);
              } else if (data) {
                formModalRef.current?.toggle(
                  {
                    ...data,
                    gender: data.gender.id.toLowerCase(),
                    state: data.city.state.toLowerCase(),
                    city: data.city.id,
                  },
                  "show",
                );
              } else {
                Toast.error(error.message);
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
              const { data, error } = await BeneficiariesService.getById(
                target.id,
              );

              if (error?.message) {
                Toast.error(error.message);
              } else if (data) {
                formModalRef.current?.toggle({
                  ...data,
                  gender: data.gender.id.toLowerCase(),
                  state: data.city.state.toLowerCase(),
                  city: data.city.id,
                });
              } else {
                Toast.error(error.message);
              }
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
          onClick={() => formModalRef.current?.toggle()}
          className="button-block --solid --btn-safe"
        >
          <AddLargeIcon />

          <span>Cadastrar Beneficiário</span>
        </button>
      </DataGrid>
    </>
  );
};
