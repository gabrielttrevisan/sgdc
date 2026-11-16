export default function InStockProductRoom({ name, quantity }) {
  return (
    <div className="in-stock-product-room">
      <div className="in-stock-product-room__name">Local: {name}</div>
      <div className="in-stock-product-room__quantity">
        Quantidade: {quantity}
      </div>
    </div>
  );
}
