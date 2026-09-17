import { useNavigate } from "react-router";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import Toast from "../../components/toast/ToastStorage";
import ProductsService from "../../service/ProductsService";
import { ProductsForm } from "./components/ProductsForm";

export default WithAuthGuard(function ProductForm() {
  const navigate = useNavigate();

  return (
    <ResourceForm
      fetchResource={(id) => ProductsService.getById(id)}
      breadcrumbs={[{ id: "products", name: "Produtos" }]}
      title="Cadastrar Produto"
      editTitle="Atualizar Produto"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/produtos")}
      onSubmit={async (data, isEditing) => {
        const response = isEditing
          ? await ProductsService.edit(data)
          : await ProductsService.create(data);

        if (response.data?.success) {
          Toast.success(
            isEditing
              ? "Produto atualizado com sucesso"
              : "Produto cadastrado com sucesso",
          );
          navigate("/produtos");
          return true;
        }

        Toast.error(response.error?.message || "Falha ao salvar produto");
        return false;
      }}
    >
      <ProductsForm />
    </ResourceForm>
  );
});
