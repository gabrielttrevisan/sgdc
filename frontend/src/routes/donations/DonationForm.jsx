import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { Form } from "../../components/form/Form.jsx";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider.jsx";
import { SelectField } from "../../components/form/input-field/SelectField.jsx";
import { TextAreaField } from "../../components/form/input-field/TextAreaField.jsx";
import { FormModalCancelButton } from "../../components/form/modal/button/FormModalCancelButton.jsx";
import { FormModalSubmitButton } from "../../components/form/modal/button/FormModalSubmitButton.jsx";
import { FormBreadcrumbs } from "../../components/resource-form/FormBreadcrumbs.jsx";
import ProductsField from "../../components/form/input-field/products-field/ProductsField.jsx";
import Toast from "../../components/toast/ToastStorage.js";
import DonationsService from "../../service/DonationsService.js";
import { useListStorage } from "../../store/list/useListStorage.js";
import getSafeListId from "../../store/list/getSafeListId.js";
import { ProductQuantitiesProvider } from "../families/components/product-quantity/provider.jsx";
import { useProductQuantities } from "../families/components/product-quantity/useProductQuantities.js";
import ProductQuantity from "../families/components/product-quantity/ProductQuantity.jsx";
import { getStateFromHistory } from "../../hooks/useStateFromHistory/index.js";

function DonationFormContent() {
  const { beneficiaryId } = useParams();
  const { state } = useLocation();
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
        Toast.error(response.error?.message ?? "Não foi possível carregar o beneficiário");
        setIsLoading(false);
        return;
      }

      const loadedContext = response.data;
      const attendance = loadedContext.attendances[0] ?? null;
      setContext(loadedContext);
      setSelectedAttendanceId((current) =>
        current && loadedContext.attendances.some(
          ({ id }) => String(id) === current,
        )
          ? current
          : attendance
            ? String(attendance.id)
            : "",
      );
      setSelectedResponsibleId((current) =>
        current &&
        loadedContext.representatives.some(
          ({ id }) => String(id) === current,
        )
          ? current
          : loadedContext.representatives[0]
            ? String(loadedContext.representatives[0].id)
            : "",
      );

      for (const requestedItem of attendance?.requestedItems ?? []) {
        let remaining = requestedItem.quantity;
        for (const batch of requestedItem.stock) {
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
            if (!context?.family) {
              Toast.error("O beneficiário precisa pertencer a uma família ativa");
              return false;
            }

            const response = await DonationsService.create({
              beneficiaryId: Number(beneficiaryId),
              responsibleId: Number(selectedResponsibleId),
              ...(attendance && { attendanceId: attendance.id }),
              details: data.details,
              items: list.items.map((item) => ({
                ispId: Number(item.id),
                quantity: Number(quantities.get(item.id) ?? 1),
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
                  value && Number.isInteger(Number(value)) && Number(value) > 0
                    ? true
                    : "Selecione um representante"
                }
              />

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

              <ProductsField
                label="Doações"
                listId={listId}
                ExtraFields={ProductQuantity}
                onAddProduct={onAddProduct}
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

export default WithAuthGuard(function DonationForm() {
  const { beneficiaryId } = useParams();
  return (
    <ProductQuantitiesProvider key={beneficiaryId}>
      <DonationFormContent />
    </ProductQuantitiesProvider>
  );
});
