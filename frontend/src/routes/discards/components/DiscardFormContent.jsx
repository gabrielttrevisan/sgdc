import { useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Form } from "../../../components/form/Form.jsx";
import { FormControllerProvider } from "../../../components/form/context/FormControllerProvider.jsx";
import { TextAreaField } from "../../../components/form/input-field/TextAreaField.jsx";
import { FormModalCancelButton } from "../../../components/form/modal/button/FormModalCancelButton.jsx";
import { FormModalSubmitButton } from "../../../components/form/modal/button/FormModalSubmitButton.jsx";
import { FormBreadcrumbs } from "../../../components/resource-form/FormBreadcrumbs.jsx";
import ListField from "../../../components/list-field/ListField.jsx";
import Toast from "../../../components/toast/ToastStorage.js";
import DiscardsService from "../../../service/DiscardsService.js";
import { useListStorage } from "../../../store/list/useListStorage.js";
import getSafeListId from "../../../store/list/getSafeListId.js";
import { useProductQuantities } from "../../families/components/product-quantity/useProductQuantities.js";
import { getStateFromHistory } from "../../../hooks/useStateFromHistory/index.js";
import ProductQuantity from "../../families/components/product-quantity/ProductQuantity.jsx";
import Tabs from "../../../components/tab/Tabs.jsx";
import TabPanel from "../../../components/tab/TabPanel.jsx";
import TabsList from "../../../components/tab/TabsList.jsx";
import TabButton from "../../../components/tab/TabButton.jsx";

const DETAILS_MAX_LENGTH = 255;
const DEFAULT_QUANTITY = 1;

function DiscardProductFields({ id, name, roomName }) {
  return (
    <>
      <span>{roomName}</span>
      <ProductQuantity id={id} name={name} />
    </>
  );
}

export default function DiscardFormContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const quantities = useProductQuantities();
  const productListId = useMemo(
    () => `discard-products:${crypto.randomUUID()}`,
    [],
  );
  const volunteerListId = useMemo(
    () => `discard-volunteers:${crypto.randomUUID()}`,
    [],
  );
  const safeProductListId =
    getSafeListId(location.state?.productListId) || productListId;
  const safeVolunteerListId =
    getSafeListId(location.state?.volunteerListId) || volunteerListId;
  const products = useListStorage(safeProductListId);
  const volunteers = useListStorage(safeVolunteerListId);
  const initialDetails = getStateFromHistory(location.state, {
    defaultValue: "",
    fromHistory: (value) => (typeof value === "string" ? value : ""),
    prop: "details",
  });

  const getDetails = () =>
    formRef.current ? (new FormData(formRef.current).get("details") ?? "") : "";

  const navigateToSelection = (path, listId, selectionType) => {
    navigate(path, {
      state: {
        from: location.pathname + location.search,
        listId,
        productListId: safeProductListId,
        volunteerListId: safeVolunteerListId,
        quantities: quantities.asObject(),
        details: getDetails(),
        selectionType,
      },
    });
  };

  const closeLists = () => {
    products.close();
    volunteers.close();
  };

  return (
    <FormControllerProvider>
      <FormBreadcrumbs
        breadcrumbs={[{ id: "discards", name: "Descartes" }]}
        title="Registrar descarte"
      />

      <Form
        ref={formRef}
        className="form-inline"
        onSubmit={async (data) => {
          if (products.items.length === 0) {
            Toast.error("Selecione ao menos um produto");
            return false;
          }

          const discardProducts = products.items.map((item) => ({
            ispInRoomId: Number(item.ispInRoomId),
            quantity: Number(quantities.get(item.id) ?? DEFAULT_QUANTITY),
            availableCount: Number(item.count),
          }));
          const invalidProduct = discardProducts.find(
            ({ ispInRoomId, quantity, availableCount }) =>
              !Number.isSafeInteger(ispInRoomId) ||
              ispInRoomId <= 0 ||
              !Number.isSafeInteger(quantity) ||
              quantity <= 0 ||
              quantity > availableCount,
          );
          if (invalidProduct) {
            Toast.error(
              "Informe uma quantidade disponível na sala selecionada",
            );
            return false;
          }

          const response = await DiscardsService.create({
            details: data.details,
            products: discardProducts.map(({ ispInRoomId, quantity }) => ({
              ispInRoomId,
              quantity,
            })),
            volunteers: volunteers.items.map(({ id }) => ({ id: Number(id) })),
          });

          if (response.data?.success) {
            Toast.success("Descarte registrado com sucesso");
            closeLists();
            navigate("/descartes");
            return true;
          }

          Toast.error(
            response.error?.issues?.[0]?.description ??
              response.error?.message ??
              "Falha ao registrar descarte",
          );
          return false;
        }}
      >
        <TextAreaField
          name="details"
          id="details"
          label="Motivo/Descrição do Incidente"
          required
          maxLength={DETAILS_MAX_LENGTH}
          defaultValue={initialDetails}
          validate={(value) =>
            value.trim().length >= 8 &&
            value.trim().length <= DETAILS_MAX_LENGTH
              ? true
              : "A descrição deve conter entre 8 e 255 caracteres"
          }
        />

        <Tabs style={{ gridColumn: "1 / 3" }}>
          <TabsList>
            <TabButton id="products">Produtos</TabButton>
            <TabButton id="volunteers">Voluntários</TabButton>
          </TabsList>

          <TabPanel id="products">
            <ListField
              label="Produtos"
              buttonLabel="Selecionar produtos"
              listId={safeProductListId}
              ExtraFields={DiscardProductFields}
              onAddProduct={() =>
                navigateToSelection(
                  "/produtos-em-estoque/selecionar-descarte",
                  safeProductListId,
                  "discard",
                )
              }
              variant="combined"
              noItemSelectedMessage="Nenhum produto selecionado"
            />
          </TabPanel>

          <TabPanel id="volunteers">
            <ListField
              variant="combined"
              label="Voluntários"
              buttonLabel="Selecionar voluntários"
              listId={safeVolunteerListId}
              onAddProduct={() =>
                navigateToSelection(
                  "/voluntarios/selecionar",
                  safeVolunteerListId,
                  "volunteer",
                )
              }
              noItemSelectedMessage="Nenhum voluntário selecionado"
            />
          </TabPanel>
        </Tabs>

        <footer>
          <FormModalCancelButton
            type="button"
            onClick={() => {
              closeLists();
              navigate("/descartes");
            }}
            className="button-block --outline --primary"
          >
            Cancelar
          </FormModalCancelButton>

          <FormModalSubmitButton>
            <span>Registrar descarte</span>
          </FormModalSubmitButton>
        </footer>
      </Form>
    </FormControllerProvider>
  );
}
