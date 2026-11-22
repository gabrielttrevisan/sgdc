import { useNavigate } from "react-router";

import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { InputField } from "../../components/form/input-field/InputField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import Toast from "../../components/toast/ToastStorage";
import SalasService from "../../service/SalasService.js";
import useTourGuide from "../../hooks/useTourGuide.js";
import HelpButton from "../../components/help-button/HelpButton.jsx";

const SalaForm = WithAuthGuard(function SalaForm() {
  const navigate = useNavigate();
  const { start, registerStepEl } = useTourGuide("sala-form");

  const title = (
    <>
      <span>Cadastrar Local de Armazenamento</span>
      <HelpButton onClick={start} />
    </>
  );
  const editTitle = (
    <>
      <span>Atualizar Local de Armazenamento</span>
      <HelpButton onClick={start} />
    </>
  );

  return (
    <ResourceForm
      fetchResource={(id) => SalasService.getById(id)}
      breadcrumbs={[{ id: "salas", name: "Locais de armazenamento" }]}
      title={title}
      editTitle={editTitle}
      onCancel={() => navigate("/locais-de-armazenamento")}
      submitButtonProps={registerStepEl({
        title: "Registro de Local de Armazenamento",
        order: 3,
        content:
          "Clique para registrar local de armazenamento após preencher os campos obrigatórios",
      })}
      cancelButtonProps={registerStepEl({
        title: "Cancelamento",
        order: 4,
        content:
          "Caso não queira mais registrar um novo local, clique em cancelar para voltar à listagem de locais de armazenamento",
      })}
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
        {...registerStepEl({
          title: "Registro de Local de Armazenamento",
          order: 1,
          content:
            "Nome do local de armazenamento.<br/>Campo obrigatório e com no mínimo 3 e no máximo 120 caracteres.",
        })}
      />

      <TextAreaField
        name="descricao"
        id="descricao"
        label="Descrição"
        placeholder="Descrição opcional"
        variant="full"
        {...registerStepEl({
          title: "Registro de Local de Armazenamento",
          order: 2,
          content: "Descrição detalhada da sala.<br/>Campo opcional.",
        })}
      />
    </ResourceForm>
  );
});

export default SalaForm;
