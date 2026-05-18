import { useContext } from "react";
import { MediaQueryContext } from "./context";

export default function useMatchMediaContext() {
  const ctx = useContext(MediaQueryContext);

  if (!ctx)
    throw new Error(
      "useMatchMediaContext must be used within MatchMediaProvider",
    );

  return ctx;
}
