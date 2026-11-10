import { useListStorage } from "../../../store/list/useListStorage";
import { DataGridItemActions } from "./DataGridItemActions";
import { CheckIcon } from "lucide-react";

export default function DataGridMultiSelectButton({
  actionsCellClassName,
  item,
  listId,
  itemId,
}) {
  const { toggle, has } = useListStorage(listId);
  const isChecked = has(itemId);

  return (
    <DataGridItemActions
      className={actionsCellClassName}
      target={item}
      actions={[
        {
          type: "select",
          content: <>{isChecked && <CheckIcon size={16} />}</>,
          onAction: () => toggle(itemId, item),
          buttonProps: {
            role: "checkbox",
            "aria-checked": isChecked,
          },
        },
      ]}
    />
  );
}
