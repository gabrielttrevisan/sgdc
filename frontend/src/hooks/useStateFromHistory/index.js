import { useState } from "react";
import { useLocation } from "react-router";

export default function useStateFromHistory({
  fromHistory,
  defaultValue,
  prop,
}) {
  const { state } = useLocation();

  return useState(
    getStateFromHistory(state, { fromHistory, defaultValue, prop }),
  );
}

export function getStateFromHistory(
  state,
  { fromHistory, defaultValue, prop },
) {
  const raw = state?.[prop];
  return fromHistory(raw) ?? defaultValue;
}
