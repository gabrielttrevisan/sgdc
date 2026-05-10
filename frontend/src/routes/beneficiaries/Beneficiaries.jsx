import BeneficiariesService from "./BeneficiariesService";
import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { DonateIcon } from "../../components/icons/DonateIcon";
import { ArrowDownIcon } from "../../components/icons/ArrowDownIcon";
import { AtoZIcon } from "../../components/icons/AtoZIcon";
import { useRef } from "react";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import { BeneficiaryFormModal } from "./components/beneficiary-form-modal/BeneficiaryFormModal";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import "./Beneficiaries.css";

export const Beneficiaries = () => {
  const dataGridRef = useRef(null);
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
      sortIcon: <AtoZIcon />,
      sortKey: "name",
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
          className={`beneficiary__request-badge ${hasOpenRequest ? "--warn" : "--none"}`}
        >
          {hasOpenRequest ? "SIM" : "NÃO"}
        </span>
      ),
      title: "Atendimento",
      id: "has-open-request",
      className: "beneficiary__col --has-request",
      sortable: true,
      sortIcon: <ArrowDownIcon />,
      sortKey: "hasOpenRequest",
      headingClassName: "--has-request",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        Os registros vinculados ao beneficiário não poderão ser recuperados.
      </SensitiveModal>

      <FormControllerProvider>
        <BeneficiaryFormModal
          ref={formModalRef}
          onSubmit={{
            create: async (data) => {
              await BeneficiariesService.create(data);
              dataGridRef.current?.update();
              formModalRef.current?.close();
            },
            edit: async (data) => {
              await BeneficiariesService.edit(data);
              dataGridRef.current?.update();
              formModalRef.current?.close();
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
        actionsConfig={[
          {
            type: "show",
            content: <ShowIcon />,
            onAction: console.log,
          },
          {
            type: "edit",
            content: (
              <>
                <EditIcon />
                <span>Editar</span>
              </>
            ),
            onAction: (type, target) => {
              formModalRef.current?.toggle(target);
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
            onAction: console.log,
          },
          {
            type: "delete",
            content: (
              <>
                <DeleteIcon />
                <span>Deletar</span>
              </>
            ),
            onAction: (type, target) => {
              modalRef.current?.open().then((confirmed) => {
                if (confirmed)
                  BeneficiariesService.delete(target.nationalId).then(() =>
                    dataGridRef.current?.update(),
                  );
              });
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
