import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { ActionList } from "../action-list/ActionList";
import "./DataGrid.css";
import { PaginationInfo } from "../pagination-info/PaginationInfo";
import { PaginationLinks } from "../pagination-links/PaginationLinks";

/**
 * @template T
 * @typedef {Object} DataGridProps
 * @prop {import("../action-list/ActionList").ActionConfig<T>[]} [actionsConfig]
 * @prop {import("../../global").PaginatableService<T>} paginatableService
 * @prop {string} [singularName]
 * @prop {string} [pluralName]
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
    <>
      <table className="data-grid --beneficiaries">
        <tbody>
          {page.items.map((item) => (
            <tr key={item.nationalId} className="beneficiary__row">
              <td className="beneficiary__col --name">{item.name}</td>
              <td className="beneficiary__col --national-id">
                {item.nationalId}
              </td>
              <td className="beneficiary__col --has-request">
                {item.hasOpenRequest ? "SIM" : "NÃO"}
              </td>
              {actionsConfig && (
                <td className="beneficiary__col --actions">
                  <ActionList target={item} actions={actionsConfig} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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
    </>
  );
}
