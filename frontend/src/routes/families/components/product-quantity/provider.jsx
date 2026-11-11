import { QuantitiesContext } from "./context";
import useStateFromHistory from "../../../../hooks/useStateFromHistory";

export function ProductQuantitiesProvider({ children }) {
  const [quantities] = useStateFromHistory({
    defaultValue: new Map(),
    fromHistory(value) {
      if (typeof value !== "object" || !value) return new Map();

      return new Map(Object.entries(value));
    },
    prop: "quantities",
  });

  return <QuantitiesContext value={quantities}>{children}</QuantitiesContext>;
}
