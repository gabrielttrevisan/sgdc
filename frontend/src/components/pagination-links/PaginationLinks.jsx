/**
 * @callback OnPaginate
 * @param {number} page
 */

/**
 * @typedef {Object} PaginationLinksProps
 * @prop {number} currentPage
 * @prop {number} totalPages
 * @prop {OnPaginateCallback} onPaginate
 */

/** @type {import("react").FC<PaginationLinksProps>} */
export const PaginationLinks = ({ onPaginate, currentPage, totalPages }) => {
  return (
    <nav role="navigation" className="data-grid__pagination-links">
      {Array.from({ length: totalPages }).map((_, index) => {
        const iterPage = index + 1;

        return (
          <button
            key={iterPage}
            className="data-grid__pagination-link"
            aria-current={iterPage === currentPage ? "page" : undefined}
            aria-label={`Ir para a página ${iterPage}`}
            onClick={() => {
              onPaginate(iterPage);
            }}
          >
            {iterPage}
          </button>
        );
      })}
    </nav>
  );
};
