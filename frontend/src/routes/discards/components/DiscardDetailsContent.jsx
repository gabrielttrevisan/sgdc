import { useEffect, useRef } from "react";
import { InputField } from "../../../components/form/input-field/InputField.jsx";
import { TextAreaField } from "../../../components/form/input-field/TextAreaField.jsx";
import ListFieldReadOnly from "../../../components/list-field/ListFieldReadOnly.jsx";
import ReadOnlyResourceFormSection from "../../../components/resource-form/read-only/ReadOnlyResourceFormSection.jsx";
import { useResourceFormContext } from "../../../components/resource-form/context.js";

function DiscardProductDetails({ roomName, quantity, details }) {
  return (
    <>
      <span>
        {quantity} unidade(s) - {roomName}
      </span>
      {details && <span>{details}</span>}
    </>
  );
}

export default function DiscardDetailsContent() {
  const { resource } = useResourceFormContext();
  const productsFieldRef = useRef(null);

  useEffect(() => {
    if (productsFieldRef.current && resource?.products)
      productsFieldRef.current.fill(resource.products);
  }, [resource]);

  return (
    <>
      <ReadOnlyResourceFormSection>
        <h3>Descarte</h3>

        <InputField
          label="Data do registro"
          name="createdAt"
          id="createdAt"
          variant="half-left"
        />

        <InputField
          label="Registrado por"
          name="createdBy"
          id="createdBy"
          variant="half-right"
        />

        <TextAreaField
          label="Motivo/Descrição do Incidente"
          name="details"
          id="details"
          variant="full"
          readOnly
        />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection>
        <h3>Produtos descartados</h3>
        <ListFieldReadOnly
          ref={productsFieldRef}
          ExtraFields={DiscardProductDetails}
        />
      </ReadOnlyResourceFormSection>

      <ReadOnlyResourceFormSection>
        <h3>Voluntários envolvidos</h3>
        <div className="products-field products-field--readonly">
          <div className="products-field__list">
            {resource?.volunteers?.length ? (
              resource.volunteers.map(({ name, details }, index) => (
                <div
                  className="products-field__list-item"
                  key={`${index}-${name}`}
                >
                  <div>{name}</div>
                  {details && <span>{details}</span>}
                </div>
              ))
            ) : (
              <>Nenhum voluntário informado</>
            )}
          </div>
        </div>
      </ReadOnlyResourceFormSection>
    </>
  );
}
