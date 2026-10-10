import useIsDataGridMobile from "../context/useIsDataGridMobile";

export function DataGridWrapper({ children, loading }) {
  const isMobile = useIsDataGridMobile();

  const xlClassName = isMobile ? "" : " --xl";
  const wrapperClassName =
    "data-grid__table-wrapper data-grid__has-overlay" + xlClassName;
  const overlayClassName = "data-grid__loading-overlay" + xlClassName;

  return (
    <div className={wrapperClassName} aria-busy={loading}>
      {loading && (
        <div className={overlayClassName}>
          <p>Carregando</p>
        </div>
      )}

      {children}
    </div>
  );
}
