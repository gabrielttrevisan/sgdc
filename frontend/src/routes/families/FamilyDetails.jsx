import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import FamiliesService from "../../service/FamiliesService";
import { FamilyParticipantsField } from "./components/family-form-modal/FamilyParticipantsField";

export default WithAuthGuard(function FamilyDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => await FamiliesService.getById(id)}
      breadcrumbs={[{ id: "families", name: "Famílias" }]}
      title="Dados da Família"
      onCancel={() => navigate("/familias")}
    >
      <InputField name="name" id="name" label="Apelido" readOnly />
      <FamilyParticipantsField readOnly />
    </ReadOnlyResourceForm>
  );
});