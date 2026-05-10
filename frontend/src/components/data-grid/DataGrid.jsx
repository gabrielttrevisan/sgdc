/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { ActionList } from "../action-list/ActionList";
import { PaginationInfo } from "../pagination-info/PaginationInfo";
import { PaginationLinks } from "../pagination-links/PaginationLinks";
import { SearchBox } from "../search-box/SearchBox";
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
 * @prop {import("react").ReactNode} [children]
 * @prop {string} [searchBoxPlaceholder]
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
  children,
  searchBoxPlaceholder,
}) {
  /** @type {[PageData<T>, import("react").Dispatch<import("react").SetStateAction<import("../../global").PageData<T>>>]} */
  const [page, setPage] = useState({
    items: [],
    page: 1,
    sortBy: undefined,
    totalPages: 1,
    totalRecords: 0,
    query: undefined,
  });

  const getPage = useCallback(
    (count = 1, sortBy = undefined, query = undefined) => {
      paginatableService
        .list({
          page: count,
          sortBy: sortBy,
          query,
        })
        .then((response) => {
          setPage(
            response.data ?? {
              items: [],
              page: 1,
              sortBy,
              totalPages: 1,
              totalRecords: 0,
              query,
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

        <div className="data-grid__header-actions">
          <SearchBox
            onSearch={(query) => getPage(1, undefined, query)}
            onReset={() => getPage(1, undefined, undefined)}
            placeholder={
              searchBoxPlaceholder
                ? searchBoxPlaceholder
                : `Buscar ${pluralName?.toLocaleLowerCase() ?? "registros"}...`
            }
          />

          {children}
        </div>
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
