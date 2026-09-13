import { NavLink } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc";

import "./NotFoundPage.css";

export const NotFoundPage = WithAuthGuard(function () {
  return (
    <div className="not-found-page">
      <div className="not-found-page__header">
        <h1 className="not-found-page__title">404</h1>
        <p className="not-found-page__subtitle">Página não encontrada</p>
      </div>

      <NavLink to="/" className="not-found-page__link">
        Voltar para Página Inicial
      </NavLink>
    </div>
  );
});
