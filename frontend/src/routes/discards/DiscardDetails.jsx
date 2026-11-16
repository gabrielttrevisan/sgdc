import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ReadOnlyResourceForm } from "../../components/resource-form/read-only/ReadOnlyResourceForm.jsx";
import DiscardsService from "../../service/DiscardsService.js";
import formatDate from "../../lib/format/date.js";
import DiscardDetailsContent from "./components/DiscardDetailsContent.jsx";

export default WithAuthGuard(function DiscardDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        const response = await DiscardsService.getById(id);
        if (response.error) return response;

        const discard = response.data;
        return {
          data: {
            ...discard,
            createdAt: formatDate(discard.createdAt),
            createdBy: discard.createdBy.name,
            products:
              discard.products?.map((product, index) => ({
                id: `${index}-${product.name}`,
                name: product.name,
                quantity: product.quantity,
                roomName: product.roomName,
                details: product.details,
              })) ?? [],
          },
          error: null,
        };
      }}
      breadcrumbs={[{ id: "discards", name: "Descartes" }]}
      title="Visualizar descarte"
      onCancel={() => navigate("/descartes")}
    >
      <DiscardDetailsContent />
    </ReadOnlyResourceForm>
  );
});
