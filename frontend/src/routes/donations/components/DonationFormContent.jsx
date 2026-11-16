import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Form } from "../../../components/form/Form.jsx";
import { FormControllerProvider } from "../../../components/form/context/FormControllerProvider.jsx";
import { SelectField } from "../../../components/form/input-field/SelectField.jsx";
import { TextAreaField } from "../../../components/form/input-field/TextAreaField.jsx";
import { FormModalCancelButton } from "../../../components/form/modal/button/FormModalCancelButton.jsx";
import { FormModalSubmitButton } from "../../../components/form/modal/button/FormModalSubmitButton.jsx";
import { FormBreadcrumbs } from "../../../components/resource-form/FormBreadcrumbs.jsx";
import ListField from "../../../components/list-field/ListField.jsx";
import Toast from "../../../components/toast/ToastStorage.js";
import DonationsService from "../../../service/DonationsService.js";
import { useListStorage } from "../../../store/list/useListStorage.js";
import getSafeListId from "../../../store/list/getSafeListId.js";
import { useProductQuantities } from "../../families/components/product-quantity/useProductQuantities.js";
import { getStateFromHistory } from "../../../hooks/useStateFromHistory/index.js";
import DonationProductLabel from "./DonationProductLabel.jsx";
import DonationProductFields from "./DonationProductFields.jsx";

export default function DonationFormContent() {
  const { beneficiaryId } = useParams();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const formRef = useRef(null);
  const fallbackListId = useMemo(
    () => `donation-product-list:${beneficiaryId}:${crypto.randomUUID()}`,
    [beneficiaryId],
  );
  const listId = getSafeListId(state?.listId) || fallbackListId;
  const list = useListStorage(listId);
  const quantities = useProductQuantities();
  const [context, setContext] = useState(null);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(
    getStateFromHistory(state, {
      defaultValue: "",
      fromHistory: (value) => value || "",
      prop: "attendanceId",
    }),
  );
  const [selectedResponsibleId, setSelectedResponsibleId] = useState(
    getStateFromHistory(state, {
      defaultValue: "",
      fromHistory: (value) => value || "",
      prop: "responsibleId",
    }),
  );
  const initialDetails = getStateFromHistory(state, {
    defaultValue: null,
    fromHistory: (value) => (typeof value === "string" ? value : null),
    prop: "details",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    DonationsService.getBeneficiaryContext(beneficiaryId).then((response) => {
      if (!active) return;
      if (!response.data) {
        Toast.error(
          response.error?.message ?? "Não foi possível carregar o beneficiário",
        );
        setIsLoading(false);
        return;
      }

      const loadedContext = response.data;
      const attendance = loadedContext.attendances[0] ?? null;
      setContext(loadedContext);
      setSelectedAttendanceId((current) =>
        current &&
        loadedContext.attendances.some(({ id }) => String(id) === current)
          ? current
          : attendance
            ? String(attendance.id)
            : "",
      );
      setSelectedResponsibleId((current) =>
        current &&
        loadedContext.representatives.some(({ id }) => String(id) === current)
          ? current
          : loadedContext.representatives[0]
            ? String(loadedContext.representatives[0].id)
            : "",
      );

      for (const requestedItem of attendance?.requestedItems ?? []) {
        let remaining = requestedItem.quantity - requestedItem.providedQuantity;
        for (const batch of requestedItem.stock) {
          if (batch.count <= 0) continue;
          if (remaining <= 0) break;
          const quantity = Math.min(batch.count, remaining);
          if (!list.has(batch.id)) {
            list.append(batch.id, batch);
            quantities.set(batch.id, quantity);
          }
          remaining -= quantity;
        }
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [beneficiaryId]);

  const attendance =
    context?.attendances.find(
      ({ id }) => String(id) === selectedAttendanceId,
    ) ?? null;
  const attendanceOptions = [
    { label: "Selecione", value: "" },
    ...(context?.attendances ?? []).map(({ id, details }) => ({
      label: `Atendimento ${id} - ${details}`,
      value: String(id),
    })),
  ];
  const representativeOptions = [
    { label: "Selecione", value: "" },
    ...(context?.representatives ?? []).map(({ id, name }) => ({
      label: name,
      value: String(id),
    })),
  ];

  const onAddProduct = () => {
    const data = formRef.current ? new FormData(formRef.current) : new Map();
    navigate("/produtos-em-estoque/selecionar", {
      state: {
        from: location.pathname + location.search,
        listId,
        quantities: quantities.asObject(),
        details: data.get("details") ?? "",
        responsibleId: selectedResponsibleId,
        attendanceId: selectedAttendanceId,
      },
    });
  };

  return (
    <FormControllerProvider>
      <FormBreadcrumbs
        breadcrumbs={[{ id: "donations", name: "Doações" }]}
        title="Doação"
      />

      {!context && !isLoading ? (
        <p>Não foi possível abrir o formulário de doação.</p>
      ) : (
        <Form
          ref={formRef}
          className="form-inline"
          onSubmit={async (data) => {
            const items = list.items.map((item) => {
              const quantity = Number(quantities.get(item.id) ?? 1);
              return {
                ispId: Number(item.ispId),
                roomId: Number(item.roomId),
                quantity,
                availableCount: Number(item.count),
              };
            });
            const invalidItem = items.find(
              ({ ispId, roomId, quantity, availableCount }) =>
                !Number.isSafeInteger(ispId) ||
                ispId <= 0 ||
                !Number.isSafeInteger(roomId) ||
                roomId <= 0 ||
                !Number.isSafeInteger(quantity) ||
                quantity <= 0 ||
                quantity > availableCount,
            );
            if (invalidItem) {
              Toast.error(
                "Informe uma quantidade disponível na sala selecionada",
              );
              return false;
            }

            const response = await DonationsService.create({
              beneficiaryId: Number(beneficiaryId),
              responsibleId: context.family
                ? Number(selectedResponsibleId)
                : null,
              ...(attendance && { attendanceId: attendance.id }),
              details: data.details,
              items: items.map(({ ispId, roomId, quantity }) => ({
                ispId,
                roomId,
                quantity,
              })),
            });

            if (response.data?.success) {
              Toast.success("Doação registrada com sucesso");
              list.close();
              navigate("/beneficiarios");
              return true;
            }

            Toast.error(
              response.error?.issues?.[0]?.description ??
                response.error?.message ??
                "Falha ao registrar doação",
            );
            return false;
          }}
        >
          {isLoading && <div className="form-inline__loading-overlay" />}

          {context && (
            <>
              <TextAreaField
                name="details"
                id="details"
                label="Motivo"
                required
                maxLength={255}
                defaultValue={initialDetails ?? attendance?.details ?? ""}
                validate={(value) =>
                  value.trim().length > 0 && value.trim().length <= 255
                    ? true
                    : "O motivo deve conter entre 1 e 255 caracteres"
                }
              />

              <SelectField
                name="beneficiaryId"
                id="beneficiaryId"
                label="Beneficiário"
                disabled
                options={[
                  {
                    label: context.beneficiary.name,
                    value: String(context.beneficiary.id),
                  },
                ]}
                defaultValue={String(context.beneficiary.id)}
              />

              {context.family && (
                <SelectField
                  name="responsibleId"
                  id="responsibleId"
                  label="Representante Familiar"
                  required
                  disabled={Boolean(attendance) || isLoading}
                  options={representativeOptions}
                  defaultValue={selectedResponsibleId}
                  onChange={(option) => setSelectedResponsibleId(option.value)}
                  validate={(value) =>
                    value &&
                    Number.isInteger(Number(value)) &&
                    Number(value) > 0
                      ? true
                      : "Selecione um representante"
                  }
                />
              )}

              {context.attendances.length > 0 && (
                <SelectField
                  name="attendanceId"
                  id="attendanceId"
                  label="Atendimento"
                  disabled
                  options={attendanceOptions}
                  defaultValue={selectedAttendanceId}
                />
              )}

              <ListField
                label="Doações"
                buttonLabel="Selecionar produtos"
                listId={listId}
                ExtraFields={DonationProductFields}
                onAddProduct={onAddProduct}
                ProductLabel={DonationProductLabel}
              />
            </>
          )}

          <footer>
            <FormModalCancelButton
              type="button"
              onClick={() => {
                list.close();
                navigate("/beneficiarios");
              }}
              className="button-block --outline --primary"
            >
              Cancelar
            </FormModalCancelButton>

            <FormModalSubmitButton>
              <span>Doar</span>
            </FormModalSubmitButton>
          </footer>
        </Form>
      )}
    </FormControllerProvider>
  );
}
