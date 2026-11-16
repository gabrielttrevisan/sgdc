import ProductQuantity from "../../families/components/product-quantity/ProductQuantity";

export default function DonationProductFields({ id, name, roomName }) {
  return (
    <>
      <span>{roomName}</span>
      <ProductQuantity id={id} name={name} />
    </>
  );
}
