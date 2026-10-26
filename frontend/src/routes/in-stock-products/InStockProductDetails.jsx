import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import InStockProductsService from "../../service/InStockProductsService";
import InStockProductRooms from "./InStockProductRooms.jsx";

export const InStockProductDetails = WithAuthGuard(
  function InStockProductDetailsPage() {
    const navigate = useNavigate();

    return (
      <ReadOnlyResourceForm
        fetchResource={(id) => InStockProductsService.getById(id)}
        breadcrumbs={[{ id: "in-stock-products", name: "Produtos em estoque" }]}
        title="Dados do Produto em Estoque"
        gridColumns="1fr 1fr"
        onCancel={() => navigate("/produtos-em-estoque")}
      >
        <InputField name="id" id="id" label="ID do estoque" readOnly />
        <InputField
          name="productId"
          id="productId"
          label="ID do produto"
          readOnly
        />
        <InputField name="name" id="name" label="Nome do produto" readOnly />
        <InputField
          name="expiresAt"
          id="expiresAt"
          label="Data de vencimento"
          readOnly
        />
        <InputField
          name="count"
          id="count"
          label="Quantidade total em estoque"
          readOnly
        />

        <InStockProductRooms />
      </ReadOnlyResourceForm>
    );
  },
);
