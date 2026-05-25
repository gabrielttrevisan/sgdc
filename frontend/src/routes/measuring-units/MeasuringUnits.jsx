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
import MeasuringUnitsService from "../../service/MeasuringTypesService";
import { MeasuringUnitFormModal } from "./components/measuring-unit-form-modal/MeasuringUnitFormModal";

import "./MeasuringUnits.css";

export const MeasuringUnits = () => {
  const dataGridRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/sensitive-modal/SensitiveModal").SensitiveModalRef>} */
  const modalRef = useRef(null);
  /** @type {import("react").RefObject<import("../../components/form/modal/FormModal").FormModalRef>} */
  const formModalRef = useRef(null);

  /** @type {import("../../components/data-grid/DataGrid").DataGridColumn<import("../../service/MeasuringTypesService").AllocationType>[]} */
  const columns = [
    {
      DataGridCell: ({ name }) => <span>{name}</span>,
      title: "Nome",
      id: "name",
      className: "measuring-unit__col --name",
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
      DataGridCell: ({ symbol }) => <em>{symbol}</em>,
      title: "Abreviação/Símbolo",
      id: "symbol",
      className: "measuring-unit__col --symbol",
    },
  ];

  return (
    <>
      <SensitiveModal ref={modalRef} showCloseButton>
        A unidade ainda irá existir e poderá ser recuperada. Dados vinculados a
        ela também serão mantidos.
      </SensitiveModal>

      <FormControllerProvider>
        <MeasuringUnitFormModal
          ref={formModalRef}
          onSubmit={{
            create: async (data) => {
              const response = await MeasuringUnitsService.create(data);

              if (response.data?.success) {
                dataGridRef.current?.update();
                formModalRef.current?.close();
                Toast.success("Unidade de medida cadastrada com sucesso");

                return true;
              } else if (response.error) {
                Toast.error("Falha ao cadastrar unidade de medida");
              }

              return false;
            },
            edit: async (data) => {
              const reponse = await MeasuringUnitsService.edit(data);

              if (reponse.data?.success) {
                dataGridRef.current?.update();
                formModalRef.current?.close();
                Toast.success("Unidade de medida editada com sucesso");

                return true;
              } else if (reponse.error) {
                Toast.error("Falha ao editar unidade de medida");
              }

              return false;
            },
          }}
        />
      </FormControllerProvider>

      <DataGrid
        ref={dataGridRef}
        columns={columns}
        paginatableService={MeasuringUnitsService}
        singularName="unidade de medida"
        pluralName="unidades de medida"
        rowClassName="measuring-unit__row"
        actionsCellClassName="measuring-unit__col --actions"
        actionsConfig={[
          {
            type: "show",
            content: (
              <>
                <ShowIcon />
                <VisuallyHidden>Ver Unidade de Medida</VisuallyHidden>
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
                const { data, error } = await MeasuringUnitsService.delete(
                  target.id,
                );

                if (data?.success) {
                  Toast.success("Unidade de medida deletada com sucesso");
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

          <span>Cadastrar Unidade de Medida</span>
        </button>
      </DataGrid>
    </>
  );
};
