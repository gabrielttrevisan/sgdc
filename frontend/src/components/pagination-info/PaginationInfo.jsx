/**
 * @typedef {Object} PaginationInfoProps
 * @prop {number} perPage
 * @prop {number} totalRecords
 * @prop {string} [pluralName]
 * @prop {string} [singularName]
 */

/** @type {import("react").FC<PaginationInfoProps & import("react").HTMLProps<"div">>} */
export const PaginationInfo = ({
  perPage,
  totalRecords,
  pluralName = "registros",
  singularName = "registro",
  ...props
}) => {
  return (
    <div aria-live="polite" {...props}>
      Exibindo {perPage} de {totalRecords}&nbsp;
      {perPage > 1 ? pluralName : singularName}
    </div>
  );
};
