import { useState } from "react";

/**
 * @template T
 * @typedef {Object} DataGridProps
 * @prop {import("../action-list/ActionList").ActionConfig<T>[]} [actionsConfig]
 * @prop {import("../../global").PaginatableService<T>} paginatableService
 */

/**
 * @template T
 * @param {DataGridProps<T>} props
 * @returns {import("react").JSX.Element}
 */
export function DataGrid({ actionsConfig, paginatableService }) {
  /** @type {[PageData<T>, import("react").Dispatch<import("react").SetStateAction<import("../../global").PageData<T>>>]} */
  const [page, setPage] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    paginatableService.list().then((response) => {
      setPage(
        response.data ?? {
          items: [],
          page: 1,
          totalPages: 1,
          totalRecords: 0,
        },
      );
    });
  }, []);

  return <></>;
}
