/* eslint-disable react-hooks/exhaustive-deps */
import {
  Activity,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ActionList } from "../action-list/ActionList";
import { PaginationInfo } from "../pagination-info/PaginationInfo";
import { PaginationLinks } from "../pagination-links/PaginationLinks";
import { SearchBox } from "../search-box/SearchBox";
import Toast from "../toast/ToastStorage";
import "./DataGrid.css";
import { DataGridContent } from "./grid/DataGridContent";
import { DataGridFilterList } from "./grid/DataGridFilterList";
import { DataGridItemList } from "./grid/DataGridItemList";
import { DataGridEmptyMessage } from "./grid/DataGridEmptyMessage";
import { DataGridItem } from "./grid/DataGridItem";
import { DataGridItemProp } from "./grid/DataGridItemProp";
import { DataGridItemActions } from "./grid/DataGridItemActions";
import { DataGridFilter } from "./grid/DataGridFilter";
import { IsDataGridMobileProvider } from "./context/IsDataGridMobileProvider";
import { DataGridHeader } from "./grid/DataGridHeader";
import { DataGridHeaderActions } from "./grid/DataGridHeaderActions";

/**
 * @typedef {"none"|"asc"|"desc"} SortState
 */

/**
 * @typedef {Object} SortIconProps
 * @prop {string} [state]
 * @prop {string} [sortKey]
 */

/**
 * @callback SortIcon
 * @param {SortIconProps} props
 * @returns {import("react").JSX.Element}
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
 * @prop {SortIcon} [SortIcon]
 * @prop {keyof T} [sortKey]
 * @prop {string[]} [sortType]
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
 * @prop {keyof T|(item: T) => string} keyProp
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
  rowClassName = "",
  children,
  searchBoxPlaceholder,
  keyProp,
}) {
  /** @type {[import("../../global").AsyncPageData<T>, import("react").Dispatch<import("react").SetStateAction<import("../../global").AsyncPageData<T>>>]} */
  const [page, setPage] = useState({
    items: [],
    page: 1,
    sortKey: undefined,
    sortType: undefined,
    totalPages: 1,
    totalRecords: 0,
    query: undefined,
    loading: false,
  });

  const getPage = useCallback(
    (
      count = 1,
      sortKey = undefined,
      query = undefined,
      sortType = undefined,
    ) => {
      setPage((prev) => ({ ...prev, loading: true }));

      paginatableService
        .list({
          page: count,
          sortKey: sortKey,
          sortType,
          query,
        })
        .then((response) => {
          if (!response.data) {
            Toast.error(response.error.message);

            setPage({
              items: [],
              page: 1,
              sortKey,
              sortType,
              totalPages: 1,
              totalRecords: 0,
              query,
              loading: false,
            });

            return;
          }

          setPage({
            ...response.data,
            sortType,
            loading: false,
          });
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
    <IsDataGridMobileProvider>
      <section className="data-grid">
        <DataGridHeader>
          <h2 className="data-grid__title" id={`data-grid-title-${pluralName}`}>
            {title ?? pluralName}
          </h2>

          <DataGridHeaderActions>
            <SearchBox
              onSearch={(query) =>
                getPage(1, page.sortKey, query, page.sortType)
              }
              onReset={() => getPage(1, page.sortKey, undefined, page.sortType)}
              placeholder={
                searchBoxPlaceholder
                  ? searchBoxPlaceholder
                  : `Buscar ${pluralName?.toLocaleLowerCase() ?? "registros"}...`
              }
              gridId={`data-grid-${pluralName}`}
            />

            {children}
          </DataGridHeaderActions>
        </DataGridHeader>

        <div
          className="data-grid__table-wrapper data-grid__has-overlay"
          aria-busy={page.loading}
        >
          <Activity mode={page.loading ? "visible" : "hidden"}>
            <div className="data-grid__loading-overlay">
              <p>Carregando</p>
            </div>
          </Activity>

          <DataGridContent
            className="data-grid__table --beneficiaries"
            role="grid"
            id={`data-grid-${pluralName}`}
            aria-rowcount={page.items.length}
            aria-labelledby={`data-grid-title-${pluralName}`}
          >
            <DataGridFilterList>
              {columns.map((column) => (
                <DataGridFilter
                  key={column.id}
                  className={column.headingClassName}
                  sortable={column.sortable}
                >
                  <span>{column.title}</span>

                  {column.sortable && (
                    <button
                      type="button"
                      onClick={() => {
                        if (column.sortType) {
                          if (!page.sortType)
                            getPage(
                              1,
                              column.sortKey,
                              page.query,
                              column.sortType[0],
                            );
                          else {
                            const index = column.sortType.findIndex(
                              (i) => i === page.sortType,
                            );

                            if (index === column.sortType.length - 1)
                              getPage(1);
                            else
                              getPage(
                                1,
                                column.sortKey,
                                page.query,
                                column.sortType[index + 1],
                              );
                          }
                        } else if (page.sortKey !== column.sortKey) {
                          getPage(1, column.sortKey, page.query);
                        } else getPage(1, page.query);
                      }}
                    >
                      <column.SortIcon
                        sortKey={page.sortKey}
                        state={page.sortType}
                      />
                    </button>
                  )}
                </DataGridFilter>
              ))}
            </DataGridFilterList>

            <DataGridItemList>
              {page.items.length === 0 && (
                <DataGridEmptyMessage
                  colSpan={1 + columns.length}
                  className="data-grid__no-results"
                >
                  Nenhum resultado encontrado
                </DataGridEmptyMessage>
              )}

              {page.items.map((item) => (
                <DataGridItem
                  key={
                    typeof keyProp === "function"
                      ? keyProp(item)
                      : item[keyProp]
                  }
                  className={rowClassName}
                  role="row"
                >
                  {columns.map((column) => (
                    <DataGridItemProp
                      key={column.id}
                      className={column.className}
                      heading={column.title}
                    >
                      <column.DataGridCell {...item} />
                    </DataGridItemProp>
                  ))}

                  {actionsConfig && (
                    <DataGridItemActions className={actionsCellClassName}>
                      <ActionList target={item} actions={actionsConfig} />
                    </DataGridItemActions>
                  )}
                </DataGridItem>
              ))}
            </DataGridItemList>
          </DataGridContent>
        </div>

        <div className="data-grid__pagination">
          <PaginationInfo
            perPage={page.items.length}
            totalRecords={page.totalRecords}
            pluralName={pluralName}
            singularName={singularName}
            className="data-grid__pagination-info"
          />

          <PaginationLinks
            currentPage={page.page}
            onPaginate={(toPage) =>
              getPage(toPage, page.sortKey, page.query, page.sortType)
            }
            totalPages={page.totalPages}
            className="data-grid__pagination-links"
            buttonClassName="data-grid__pagination-link"
          />
        </div>
      </section>
    </IsDataGridMobileProvider>
  );
}
