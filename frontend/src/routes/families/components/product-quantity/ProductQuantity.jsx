import UIntField from "../../../../components/uint-field/UIntField";
import { useProductQuantities } from "./useProductQuantities";

const DEFAULT_QUANTITY = 1;

export default function ProductQuantity({ id, name }) {
  const quantities = useProductQuantities();

  const onQuantityChange = (quantity) => {
    quantities.set(id, quantity);
  };

  const quantity = quantities.get(id) ?? DEFAULT_QUANTITY;

  return (
    <UIntField
      id={`product-${id}`}
      name={`product-${id}`}
      label={`Quantidade do produto ${name}`}
      defaultValue={quantity}
      onIncrease={onQuantityChange}
      onDecrease={onQuantityChange}
    />
  );
}
