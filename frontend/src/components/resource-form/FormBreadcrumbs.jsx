/**
 * @param {{breadcrumbs?: {id: string, name: string}[], title: string}} props
 * @returns {import("react").JSX.Element}
 */
export function FormBreadcrumbs({ breadcrumbs, title }) {
  return (
    <div className="form-inline__breadcrumbs">
      {breadcrumbs && (
        <div className="form-inline__breadcrumb-path">
          {breadcrumbs.map(({ id, name }) => (
            <h3 key={id}>{name}</h3>
          ))}
        </div>
      )}

      <h2 className="form-inline__breadcrumb-path-current">{title}</h2>
    </div>
  );
}