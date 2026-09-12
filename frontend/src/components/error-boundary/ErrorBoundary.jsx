export function ErrorBoundary({ children }) {
  try {
    return <>{children}</>;
  } catch (e) {
    debugger;
    console.error(e);

    return (
      <div className="error-boundary">
        <h1 className="error-boundary__title">Erro</h1>
        <p className="error-boundary__description">
          Um erro ocorreu durante a renderização da interface
        </p>
        <pre className="error-boundary__reason">{e.message}</pre>
      </div>
    );
  }
}

export function WithErrorBoundary(Component) {
  return (props) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
