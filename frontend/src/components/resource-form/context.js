import { useContext } from "react";
import { createContext } from "react";

export const ResourceFormContext = createContext({ isEditing: false, id: undefined, resource: undefined });

export function useResourceFormContext() {
  return useContext(ResourceFormContext);
}
