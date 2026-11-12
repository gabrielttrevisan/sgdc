import { InputField } from "../../../../components/form/input-field/InputField";
import { TextAreaField } from "../../../../components/form/input-field/TextAreaField";
import { useResourceFormContext } from "../../../../components/resource-form/context";
import { useEffect, useRef } from "react";
import ProductsFieldReadOnly from "../../../../components/form/input-field/products-field/ProductsFieldReadOnly";
import ReadOnlyResourceFormSection from "../../../../components/resource-form/read-only/ReadOnlyResourceFormSection";

export default function DonationDetailsContent() {
  const { resource } = useResourceFormContext();
  const productsFieldRef = useRef(null);

  useEffect(() => {
    if (productsFieldRef.current && resource?.items) {
      productsFieldRef.current.fill(resource.items);
    }
  }, [productsFieldRef, resource]);

  return (
    <div className="donation-details">
      <ReadOnlyResourceFormSection>
        <h3>Doação</h3>

        <InputField
          label="Beneficiário"
          name="beneficiary"
          id="beneficiary"
          variant="half-left"
        />

        <InputField
          label="Família"
          name="familyName"
          id="familyName"
          style={{ textTransform: "capitalize" }}
          variant="half-right"
        />

        <InputField
          label="Situação"
          name="status"
          id="status"
          variant="half-left"
        />

        <InputField
          label="Doação Registrada Em"
          name="createdAt"
          id="createdAt"
          variant="half-right"
        />

        <TextAreaField
          label="Detalhes"
          name="details"
          id="details"
          variant="full"
        />

        <InputField
          label="Registrado Por"
          name="registry"
          id="registry"
          variant="full"
        />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection>
        <h3>Produtos doados</h3>

        <ProductsFieldReadOnly ref={productsFieldRef} />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection hidden={!resource?.cancelledBy}>
        <h3>Cancelamento</h3>

        <InputField
          label="Situação"
          name="cancelledBy"
          id="cancelledBy"
          variant="half-left"
        />

        <InputField
          label="Doação Registrada Em"
          name="cancelledAt"
          id="cancelledAt"
          variant="half-right"
        />

        <TextAreaField
          label="Detalhes"
          name="cancellationDetails"
          id="cancellationDetails"
          variant="full"
        />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection hidden={!resource?.attendance}>
        <h3>Atendimento</h3>

        <InputField
          label="Beneficiário Atendimento"
          name="attendee"
          id="attendee"
          variant="half-left"
        />

        <InputField
          label="Data"
          name="attendedAt"
          id="attendedAt"
          variant="half-right"
        />

        <TextAreaField
          label="Detalhes"
          name="attendanceDetails"
          id="attendanceDetails"
          variant="full"
        />
      </ReadOnlyResourceFormSection>
    </div>
  );
}
