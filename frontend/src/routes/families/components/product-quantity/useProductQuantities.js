import { useContext } from "react";
import { QuantitiesContext } from "./context";

export function useProductQuantities() {
  const ctx = useContext(QuantitiesContext);

  return {
    set(id, quantity) {
      ctx.set(id.toString(), quantity);
    },
    get(id) {
      return ctx.get(id.toString());
    },
    all(products) {
      return products.map((product) => ({
        productId: Number(product.id),
        quantity: ctx.get(product.id.toString()) ?? 1,
      }));
    },
    asObject() {
      return Object.fromEntries(ctx.entries());
    },
  };
}
