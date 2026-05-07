import { useCallback, useEffect, useState } from "react";
import { ActionList } from "../action-list/ActionList";
import { PaginationInfo } from "../pagination-info/PaginationInfo";
import { PaginationLinks } from "../pagination-links/PaginationLinks";
import "./DataGrid.css";

/**
 * @template T
 * @typedef {Object} DataGridColumn
 * @prop {string} title
 * @prop {import("react").ElementType<T>} DataGridCell
 * @prop {string} [className]
 * @prop {string} id
 */

/**
 * @template T
 * @typedef {Object} DataGridProps
 * @prop {import("../action-list/ActionList").ActionConfig<T>[]} [actionsConfig]
 * @prop {import("../../global").PaginatableService<T>} paginatableService
 * @prop {DataGridColumn[]} columns
 * @prop {string} [singularName]
 * @prop {string} [pluralName]
 * @prop {string} [title]
 */

/**
 * @template T
 * @param {DataGridProps<T>} props
 * @returns {import("react").JSX.Element}
 */
export function DataGrid({
  actionsConfig,
  paginatableService,
  pluralName,
  singularName,
  title,
  columns,
}) {
  /** @type {[PageData<T>, import("react").Dispatch<import("react").SetStateAction<import("../../global").PageData<T>>>]} */
  const [page, setPage] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const goToPage = useCallback(
    (count = 1) => {
      paginatableService
        .list({
          page: count,
        })
        .then((response) => {
          console.log(response);
          setPage(
            response.data ?? {
              items: [],
              page: 1,
              totalPages: 1,
              totalRecords: 0,
            },
          );
        });
    },
    [setPage, paginatableService],
  );

  useEffect(() => {
    goToPage(1);
  }, [goToPage]);

  return (
    <section className="data-grid">
      <div className="data-grid__header">
        <h2 className="data-grid__title">{title ?? pluralName}</h2>
      </div>

      <div className="data-grid__table-wrapper">
        <table className="data-grid__table --beneficiaries">
          <thead>
            <tr>
              {columns.map((column) => (
                <th>{column.title}</th>
              ))}

              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {page.items.map((item) => (
              <tr key={item.nationalId} className="beneficiary__row">
                {columns.map((column) => (
                  <td key={column.id} className={column.className}>
                    <column.DataGridCell {...item} />
                  </td>
                ))}

                {actionsConfig && (
                  <td className="beneficiary__col --actions">
                    <ActionList target={item} actions={actionsConfig} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-grid__pagination">
        <PaginationInfo
          perPage={page.items.length}
          totalRecords={page.totalRecords}
          pluralName={pluralName}
          singularName={singularName}
        />

        <PaginationLinks
          currentPage={page.page}
          onPaginate={(toPage) => goToPage(toPage)}
          totalPages={page.totalPages}
        />
      </div>
    </section>
  );
}
