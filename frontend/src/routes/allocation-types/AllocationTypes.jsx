import { DataGrid } from "../../components/data-grid/DataGrid";
import { ShowIcon } from "../../components/icons/ShowIcon";
import { EditIcon } from "../../components/icons/EditIcon";
import { DeleteIcon } from "../../components/icons/DeleteIcon";
import { AtoZIconAsc } from "../../components/icons/AtoZIconAsc";
import { useRef } from "react";
import { SensitiveModal } from "../../components/sensitive-modal/SensitiveModal";
import { AddLargeIcon } from "../../components/icons/AddLargeIcon";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import { VisuallyHidden } from "../../components/accessibility/visually-hidden/VisuallyHidden";
import Toast from "../../components/toast/ToastStorage";
import { AtoZIconDesc } from "../../components/icons/AtoZIconDesc";
import AllocationTypesService from "../../service/AllocationTypesService";

import "./AllocationTypes.css";
import { AllocationTypeFormModal } from "./components/allocation-type-form-modal/AllocationTypeFormModal";

export const AllocationTypes = () => {
  const dataGridRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/form/modal/FormModal").FormModalRef>} */
  const formModalRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/AllocationTypesService").AllocationType>[]} */
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Nome",
      id: "name",
      className: "allocation-type__col --name",
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
      DataGridCell: ({ description }) => <span>{description}</span>,
      title: "Descrição",
      id: "description",
      className: "allocation-type__col --description",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        O tipo de alocação ainda irá existem e poderá ser recuperado. Dados
        vinculados também serão mantidos.
      </SensitiveModal>

      <FormControllerProvider>
        <AllocationTypeFormModal
          ref={formModalRef}
          onSubmit={{
            create: async (data) => {
              const response = await AllocationTypesService.create(data);

              if (response.data?.success) {
                dataGridRef.current?.update();
                formModalRef.current?.close();
                Toast.success("Tipo de alocação cadastrado com sucesso");

                return true;
              } else if (response.error) {
                Toast.error("Falha ao cadastrar tipo de alocação");
              }

              return false;
            },
            edit: async (data) => {
              const reponse = await AllocationTypesService.edit(data);

              if (reponse.data?.success) {
                dataGridRef.current?.update();
                formModalRef.current?.close();
                Toast.success("Tipo de alocação editado com sucesso");

                return true;
              } else if (reponse.error) {
                Toast.error("Falha ao editar tipo de alocação");
              }

              return false;
            },
          }}
        />
      </FormControllerProvider>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={AllocationTypesService}
        singularName="tipo de alocação"
        pluralName="tipos de alocação"
        rowClassName="beneficiary__row"
        actionsCellClassName="allocation-type__col --actions"
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Tipo de Alocação</VisuallyHidden>
              </>
            ),
            onAction: async (_, target) => {
              formModalRef.current?.toggle(target, "show");
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
            onAction: async (_, target) => {
              formModalRef.current?.toggle(target);
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
                const { data, error } = await AllocationTypesService.delete(
                  target.id,
                );

                if (data?.success) {
                  Toast.success("Tipo de alocação deletado com sucesso");
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

          <span>Cadastrar Tipo de Alocação</span>
        </button>
      </DataGrid>
    </>
  );
};
