import { useContext } from "react";
import { createContext } from "react";

export const ResourceFormContext = createContext({ isEditing: false });

export function useResourceFormContext() {
  return useContext(ResourceFormContext);
}
