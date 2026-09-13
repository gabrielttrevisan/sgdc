import { useResourceFormContext } from "./context";

export function ResourceConditionalField({ children, editingOnly = true }) {
  const { isEditing } = useResourceFormContext();

  if (isEditing === editingOnly) return <>{children}</>;

  return <></>;
}
