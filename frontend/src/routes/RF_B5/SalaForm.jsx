import { useNavigate } from "react-router";

import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { InputField } from "../../components/form/input-field/InputField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import Toast from "../../components/toast/ToastStorage";
import SalasService from "../../service/SalasService.js";

const SalaForm = WithAuthGuard(function SalaForm() {
  const navigate = useNavigate();

  return (
    <ResourceForm
      fetchResource={(id) => SalasService.getById(id)}
      breadcrumbs={[{ id: "salas", name: "Locais de armazenamento" }]}
      title="Cadastrar Local de Armazenamento"
      editTitle="Atualizar Local de Armazenamento"
      onCancel={() => navigate("/locais-de-armazenamento")}
      onSubmit={async (data, isEditing) => {
        const response = isEditing
          ? await SalasService.edit(data)
          : await SalasService.create(data);

        if (response.data?.success) {
          Toast.success(
            isEditing
              ? "Local de armazenamento atualizado com sucesso"
              : "Local de armazenamento cadastrado com sucesso",
          );
          navigate("/locais-de-armazenamento");
          return true;
        }

        Toast.error(
          response.error?.issues?.[0]?.description ??
            response.error?.message ??
            `Falha ao ${isEditing ? "atualizar" : "cadastrar"} local de armazenamento`,
        );
        return false;
      }}
    >
      <InputField
        name="nome"
        id="nome"
        label="Nome"
        placeholder="Nome do local de armazenamento"
        required
        maxLength={120}
        validate={(value) =>
          value.trim().length >= 3
            ? true
            : "O nome deve conter pelo menos 3 caracteres"
        }
      />

      <TextAreaField
        name="descricao"
        id="descricao"
        label="Descrição"
        placeholder="Descrição opcional"
        variant="full"
      />
    </ResourceForm>
  );
});

export default SalaForm;
