import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import VolunteerService from "../../service/VolunteerService";
import { VolunteerFields } from "./components/VolunteerFields";
import { ReadOnlyResourceForm } from "../../components/resource-form/read-only/ReadOnlyResourceForm.jsx";

export default WithAuthGuard(function VolunteerDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        return await VolunteerService.getById(id);
      }}
      breadcrumbs={[
        {
          id: "volunteers",
          name: "Voluntários",
        },
      ]}
      title="Dados do Voluntário"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/voluntarios")}
    >
      <VolunteerFields readOnly />
    </ReadOnlyResourceForm>
  );
});
