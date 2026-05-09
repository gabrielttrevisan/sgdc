/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { ActionList } from "../action-list/ActionList";
import { PaginationInfo } from "../pagination-info/PaginationInfo";
import { PaginationLinks } from "../pagination-links/PaginationLinks";
import "./DataGrid.css";

/**
 * @typedef {"none"|"asc"|"desc"} SortState
 */

/**
 * @typedef {Record<SortState, import("react").ReactNode>} SortIcons
 */

/**
 * @template T
 * @typedef {Object} DataGridColumn
 * @prop {string} title
 * @prop {import("react").ElementType<T>} DataGridCell
 * @prop {string} [className]
 * @prop {string} [headingClassName]
 * @prop {string} id
 * @prop {boolean} [sortable]
 * @prop {SortIcons} [sortIcon]
 * @prop {keyof T} [sortKey]
 */

/**
 * @template T
 * @typedef {Object} DataGridRef
 * @prop {VoidFunction} update
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
 * @prop {DataGridRef<T>} [ref]
 * @prop {string} [rowClassName]
 * @prop {string} [actionsCellClassName]
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
  ref,
  actionsCellClassName,
  rowClassName,
}) {
  /** @type {[PageData<T>, import("react").Dispatch<import("react").SetStateAction<import("../../global").PageData<T>>>]} */
  const [page, setPage] = useState({
    items: [],
    page: 1,
    sortBy: undefined,
    totalPages: 1,
    totalRecords: 0,
  });

  const getPage = useCallback(
    (count = 1, sortBy = undefined) => {
      paginatableService
        .list({
          page: count,
          sortBy: sortBy,
        })
        .then((response) => {
          setPage(
            response.data ?? {
              items: [],
              page: 1,
              sortBy,
              totalPages: 1,
              totalRecords: 0,
            },
          );
        });
    },
    [paginatableService],
  );

  useEffect(() => {
    getPage(1);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      update() {
        getPage(1);
      },
    }),
    [getPage],
  );

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
                <th key={column.id} className={column.headingClassName}>
                  <div>
                    <span>{column.title}</span>

                    {column.sortable && (
                      <button
                        type="button"
                        onClick={() => {
                          if (page.sortBy !== column.sortKey)
                            getPage(1, column.sortKey);
                          else getPage(1);
                        }}
                      >
                        {column.sortIcon}
                      </button>
                    )}
                  </div>
                </th>
              ))}

              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {page.items.map((item) => (
              <tr key={item.nationalId} className={rowClassName}>
                {columns.map((column) => (
                  <td key={column.id} className={column.className}>
                    <column.DataGridCell {...item} />
                  </td>
                ))}

                {actionsConfig && (
                  <td className={actionsCellClassName}>
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
          onPaginate={(toPage) => getPage(toPage, page.sortBy)}
          totalPages={page.totalPages}
        />
      </div>
    </section>
  );
}
