import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import FamiliesService from "../../service/FamiliesService";
import Toast from "../../components/toast/ToastStorage";
import { FamilyParticipantsField } from "./components/family-form-modal/FamilyParticipantsField";

import "./components/family-form-modal/FamilyFormModal.css";

export default WithAuthGuard(function FamilyForm() {
  const navigate = useNavigate();

  return (
    <ResourceForm
      fetchResource={async (id) => await FamiliesService.getById(id)}
      breadcrumbs={[{ id: "families", name: "Famílias" }]}
      title="Cadastrar Família"
      editTitle="Atualizar Dados da Família"
      onCancel={() => navigate("/familias")}
      onSubmit={async (data, isEditing) => {
        const response = isEditing
          ? await FamiliesService.edit(data)
          : await FamiliesService.create(data);

        if (response.data?.success) {
          Toast.success(
            isEditing
              ? "Família editada com sucesso"
              : "Família cadastrada com sucesso",
          );
          navigate("/familias");
          return true;
        }

        Toast.error(
          response.error?.issues?.[0]?.description ??
            `Falha ao ${isEditing ? "editar" : "cadastrar"} família`,
        );
        return false;
      }}
    >
      <InputField
        name="name"
        required
        id="name"
        label="Apelido"
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();
          return trimmed.match(/^([0-9a-zÀ-ž-\s]{8,64})$/gi)
            ? true
            : "Apelido inválido";
        }}
      />

      <FamilyParticipantsField />
    </ResourceForm>
  );
});