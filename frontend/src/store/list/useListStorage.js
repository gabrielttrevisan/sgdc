import { useSyncExternalStore } from "react";
import listStorageFactory from "./ListStorageFactory";

export function useListStorage(customId) {
  const list = listStorageFactory.openList(customId);
  const items = useSyncExternalStore(list.subscribe, list.getItems);

  return {
    items,
    close: list.close,
    append: list.append,
    remove: list.delete,
    toggle: list.toggle,
    has: list.has,
  };
}
