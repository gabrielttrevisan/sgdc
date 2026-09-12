export function ErrorBoundary({ error }) {
  return (
    <div className="error-boundary">
      <h1 className="error-boundary__title">Erro</h1>

      <p className="error-boundary__description">
        Um erro ocorreu durante a renderização da interface
      </p>

      {error.message && (
        <pre className="error-boundary__reason">{error.message}</pre>
      )}

      {error.stack && <pre className="error-stack">{error.stack}</pre>}
    </div>
  );
}
