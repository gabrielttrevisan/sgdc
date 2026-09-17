import { useNavigate } from "react-router";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { InputField } from "../../components/form/input-field/InputField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import ProductsService from "../../service/ProductsService";

export default WithAuthGuard(function ProductDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={(id) => ProductsService.getById(id)}
      breadcrumbs={[{ id: "products", name: "Produtos" }]}
      title="Dados do Produto"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/produtos")}
    >
      <InputField name="name" id="name" label="Nome do Produto" readOnly />

      <InputField
        name="measuringUnitName"
        id="measuringUnitName"
        label="Unidade de Medida"
        readOnly
      />
      <InputField
        name="isPerishable"
        id="isPerishable"
        type="checkbox"
        label="É perecível"
        disabled
      />

      <InputField
        name="needRefrigeration"
        id="needRefrigeration"
        type="checkbox"
        label="Necessita de refrigeração"
        disabled
      />

      <TextAreaField
        name="description"
        id="description"
        label="Descrição"
        readOnly
      />
    </ReadOnlyResourceForm>
  );
});
