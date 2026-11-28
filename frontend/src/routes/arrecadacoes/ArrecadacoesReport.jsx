import { useState } from "react";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import ArrecadacoesReportService from "../../service/ArrecadacoesReportService.js";

import "./ArrecadacoesReport.css";

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}`;
const currentDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

function getPeriod(mode, month, startDate, endDate) {
  return mode === "month" ? { month } : { startDate, endDate };
}

function formatDate(value) {
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR").format(date);
}

export const ArrecadacoesReport = WithAuthGuard(function ArrecadacoesReport() {
  const [mode, setMode] = useState("month");
  const [month, setMonth] = useState(currentMonth);
  const [startDate, setStartDate] = useState(`${today.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(currentDate);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const period = getPeriod(mode, month, startDate, endDate);
  const invalidPeriod =
    mode === "month"
      ? !month
      : !startDate || !endDate || startDate > endDate;

  async function handlePreview(event) {
    event.preventDefault();
    if (invalidPeriod) return;

    setLoading(true);
    setError("");
    try {
      setReport(
        await ArrecadacoesReportService.preview(period),
      );
    } catch (requestError) {
      setError(requestError.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(format) {
    setLoading(true);
    setError("");
    try {
      await ArrecadacoesReportService.download(period, format);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="arrecadacoes-report">
      <header className="arrecadacoes-report__header">
        <div>
          <p className="arrecadacoes-report__eyebrow">Relatórios</p>
          <h1>Relatório de arrecadações</h1>
          <p>Consulte as arrecadações registradas em um período.</p>
        </div>
      </header>

      <form className="arrecadacoes-report__filters" onSubmit={handlePreview}>
        <fieldset>
          <legend>Período do relatório</legend>
          <div className="arrecadacoes-report__mode">
            <label>
              <input
                type="radio"
                name="arrecadacoes-report-mode"
                value="month"
                checked={mode === "month"}
                onChange={() => {
                  setMode("month");
                  setReport(null);
                }}
              />
              Mês e ano
            </label>
            <label>
              <input
                type="radio"
                name="arrecadacoes-report-mode"
                value="period"
                checked={mode === "period"}
                onChange={() => {
                  setMode("period");
                  setReport(null);
                }}
              />
              Período
            </label>
          </div>
          {mode === "month" ? (
            <label className="arrecadacoes-report__date-field">
              Mês e ano
              <input
                type="month"
                value={month}
                onChange={(event) => {
                  setMonth(event.target.value);
                  setReport(null);
                }}
                required
              />
            </label>
          ) : (
            <div className="arrecadacoes-report__date-range">
              <label className="arrecadacoes-report__date-field">
                Data inicial
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setReport(null);
                  }}
                  required
                />
              </label>
              <label className="arrecadacoes-report__date-field">
                Data final
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setReport(null);
                  }}
                  required
                />
              </label>
            </div>
          )}
          {invalidPeriod && (
            <p className="arrecadacoes-report__error" role="alert">
              {mode === "month"
                ? "Selecione um mês válido."
                : "A data inicial deve ser anterior ou igual à data final."}
            </p>
          )}
          <button
            className="arrecadacoes-report__button"
            type="submit"
            disabled={loading || invalidPeriod}
          >
            {loading ? "Gerando..." : "Gerar prévia"}
          </button>
        </fieldset>
      </form>

      {error && (
        <p className="arrecadacoes-report__error" role="alert">
          {error}
        </p>
      )}

      {report && (
        <section className="arrecadacoes-report__results" aria-live="polite">
          <div className="arrecadacoes-report__results-header">
            <div>
              <h2>Resultado</h2>
              <p>
                {formatDate(report.startDate)} a {formatDate(report.endDate)}
              </p>
            </div>
            <div className="arrecadacoes-report__downloads">
              <button
                type="button"
                onClick={() => handleDownload("pdf")}
                disabled={loading}
              >
                Baixar PDF
              </button>
              <button
                type="button"
                onClick={() => handleDownload("xlsx")}
                disabled={loading}
              >
                Baixar Excel
              </button>
            </div>
          </div>

          <dl className="arrecadacoes-report__summary">
            <div>
              <dt>Total de arrecadações</dt>
              <dd>{report.totalCollections}</dd>
            </div>
            <div>
              <dt>Doadores</dt>
              <dd>{report.totalDonors}</dd>
            </div>
            <div>
              <dt>Itens arrecadados</dt>
              <dd>{report.totalQuantity}</dd>
            </div>
          </dl>

          <div className="arrecadacoes-report__table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Doador</th>
                  <th>Produtos</th>
                  <th>Quantidade</th>
                  <th>Armazenamento</th>
                  <th>Vencimento</th>
                  <th>Registrado por</th>
                </tr>
              </thead>
              <tbody>
                {report.collections.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      Nenhuma arrecadação encontrada no período.
                    </td>
                  </tr>
                ) : (
                  report.collections.flatMap((collection) =>
                    collection.items.length
                      ? collection.items.map((item) => (
                          <tr key={`${collection.id}-${item.id}`}>
                            <td>{formatDate(collection.createdAt)}</td>
                            <td>{collection.donorName}</td>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.salaName || "—"}</td>
                            <td>{formatDate(item.expiresAt)}</td>
                            <td>{collection.createdByName}</td>
                          </tr>
                        ))
                      : [
                          <tr key={collection.id}>
                            <td>{formatDate(collection.createdAt)}</td>
                            <td>{collection.donorName}</td>
                            <td>Sem produtos</td>
                            <td>0</td>
                            <td>—</td>
                            <td>—</td>
                            <td>{collection.createdByName}</td>
                          </tr>,
                        ],
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
});
