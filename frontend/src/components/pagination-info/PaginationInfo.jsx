/**
 * @typedef {Object} PaginationInfoProps
 * @prop {number} perPage
 * @prop {number} totalRecords
 * @prop {string} [pluralName]
 * @prop {string} [singularName]
 */

/** @type {import("react").FC<PaginationInfoProps>} */
export const PaginationInfo = ({
  perPage,
  totalRecords,
  pluralName = "registros",
  singularName = "registro",
}) => {
  return (
    <div aria-live="polite">
      Exibindo {perPage} de {totalRecords}&nbsp;
      {perPage > 1 ? pluralName : singularName}
    </div>
  );
};
