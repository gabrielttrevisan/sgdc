/**
 * @callback OnPaginate
 * @param {number} page
 */

import { VisuallyHidden } from "../accessibility/visually-hidden/VisuallyHidden";

/**
 * @typedef {Object} PaginationLinksProps
 * @prop {number} currentPage
 * @prop {number} totalPages
 * @prop {OnPaginateCallback} onPaginate
 */

/** @type {import("react").FC<PaginationLinksProps>} */
export const PaginationLinks = ({ onPaginate, currentPage, totalPages }) => {
  return (
    <div className="data-grid__pagination-links">
      {Array.from({ length: totalPages }).map((_, index) => {
        const iterPage = index + 1;

        return (
          <button
            key={iterPage}
            className="data-grid__pagination-link"
            aria-current={iterPage === currentPage ? "page" : undefined}
            onClick={() => {
              onPaginate(iterPage);
            }}
          >
            <VisuallyHidden>Ir para a página&nbsp;</VisuallyHidden>
            {iterPage}
          </button>
        );
      })}
    </div>
  );
};
