import { useNavigate } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ReadOnlyResourceForm } from "../../components/resource-form/read-only/ReadOnlyResourceForm.jsx";
import DonationsService from "../../service/DonationsService.js";
import DonationDetailsContent from "./components/donation-details-content/DonationDetailsContent.jsx";
import formatDate from "../../lib/format/date.js";

export default WithAuthGuard(function DonationDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        const response = await DonationsService.getById(id);

        if (response.error) return response;

        const data = response.data;
        const {
          beneficiary,
          donation,
          createdBy,
          cancelledBy,
          items,
          attendance,
        } = data;

        return {
          data: {
            ...data,
            beneficiary: `#${beneficiary.id} - ${beneficiary.name}`,
            familyName: beneficiary.family?.name ?? "Não Informado",
            createdAt: formatDate(donation.createdAt),
            details: donation.details,
            status: donation.cancelledAt ? "Revertida" : "Realizada",
            registry: `${createdBy.name}`,
            cancelledBy: cancelledBy?.name,
            cancelledAt: formatDate(donation?.cancelledAt, "Não Informado"),
            cancellationDetails: donation?.cancellationDetails,
            items:
              items?.map((item) => ({
                name: `${item.quantity} unidades de ${item.product.name}`,
              })) ?? [],
            attendedAt: formatDate(attendance?.attendedAt, "Não Informado"),
            attendanceDetails: attendance?.details,
            attendee: attendance?.attendee?.name,
          },
          error: null,
        };
      }}
      breadcrumbs={[{ id: "donations", name: "Doações" }]}
      title="Visualizar doação"
      onCancel={() => navigate("/doacoes")}
    >
      <DonationDetailsContent />
    </ReadOnlyResourceForm>
  );
});
