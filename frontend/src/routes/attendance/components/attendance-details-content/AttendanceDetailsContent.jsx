import { useResourceFormContext } from "../../../../components/resource-form/context";
import ReadOnlyResourceFormSection from "../../../../components/resource-form/read-only/ReadOnlyResourceFormSection";
import { InputField } from "../../../../components/form/input-field/InputField";
import { TextAreaField } from "../../../../components/form/input-field/TextAreaField";
import ProductsFieldReadOnly from "../../../../components/form/input-field/products-field/ProductsFieldReadOnly";
import { useEffect, useRef } from "react";

export default function AttendanceDetailsContent() {
  const { resource } = useResourceFormContext();
  const productFieldRef = useRef(null);

  useEffect(() => {
    if (productFieldRef.current && resource?.products) {
      productFieldRef.current.fill(resource.products);
    }
  }, [resource, productFieldRef]);

  return (
    <div className="attendance-details">
      <ReadOnlyResourceFormSection>
        <h3>Atendimento</h3>

        <InputField
          name="beneficiary"
          id="beneficiary"
          label="Beneficiário"
          variant="half-left"
        />

        <TextAreaField
          name="details"
          id="details"
          label="Detalhes"
          variant="full"
        />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection>
        <h3>Produtos solicitados</h3>

        <ProductsFieldReadOnly ref={productFieldRef} />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection hidden={!resource?.cancelledBy}>
        <h3>Cancelamento</h3>

        <InputField
          name="cancelledBy"
          id="cancelledBy"
          label="Usuário"
          variant="half-left"
        />

        <InputField
          name="cancelledAt"
          id="cancelledAt"
          label="Data"
          variant="half-right"
        />

        <TextAreaField
          name="cancellationReason"
          id="cancellationReason"
          label="Motivo"
          variant="full"
        />
      </ReadOnlyResourceFormSection>
    </div>
  );
}
