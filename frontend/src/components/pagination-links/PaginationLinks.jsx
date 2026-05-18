/**
 * @callback OnPaginate
 * @param {number} page
 */

/**
 * @typedef {Object} PaginationLinksProps
 * @prop {number} currentPage
 * @prop {number} totalPages
 * @prop {OnPaginateCallback} onPaginate
 * @prop {string} [buttonClassName]
 */

/** @type {import("react").FC<PaginationLinksProps & import("react").HTMLProps<"div">>} */
export const PaginationLinks = ({
  onPaginate,
  currentPage,
  totalPages,
  className,
  buttonClassName,
}) => {
  return (
    <nav role="navigation" className={className}>
      {Array.from({ length: totalPages }).map((_, index) => {
        const iterPage = index + 1;

        return (
          <button
            key={iterPage}
            className={buttonClassName}
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
