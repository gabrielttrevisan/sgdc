import { useState } from "react";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import DonationsReportService from "../../service/DonationsReportService.js";

import "./DonationsReport.css";

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}`;
const currentDate = `${currentMonth}-${String(today.getDate()).padStart(2, "0")}`;

function getPeriod(mode, month, startDate, endDate) {
  if (mode === "period") return { startDate, endDate };
  if (!month) return { startDate: "", endDate: "" };
  const [year, selectedMonth] = month.split("-").map(Number);
  const lastDay = new Date(year, selectedMonth, 0).getDate();
  return {
    startDate: `${month}-01`,
    endDate: `${month}-${String(lastDay).padStart(2, "0")}`,
  };
}

function formatDate(value) {
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR").format(date);
}

export const DonationsReport = WithAuthGuard(function DonationsReport() {
  const [mode, setMode] = useState("month");
  const [month, setMonth] = useState(currentMonth);
  const [startDate, setStartDate] = useState(`${today.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(currentDate);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const period = getPeriod(mode, month, startDate, endDate);
  const invalidPeriod =
    !period.startDate || !period.endDate || period.startDate > period.endDate;

  const handlePreview = async (event) => {
    event.preventDefault();
    if (invalidPeriod) return;

    setLoading(true);
    setError("");
    try {
      const response = await DonationsReportService.preview(period);
      if (response.error) throw new Error(response.error.message);
      setReport(response.data);
    } catch (requestError) {
      setError(requestError.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    if (invalidPeriod) return;

    setLoading(true);
    setError("");
    try {
      await DonationsReportService.download(period, format);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="donations-report">
      <header className="donations-report__header">
        <div>
          <p className="donations-report__eyebrow">Relatórios</p>
          <h1>Relatório de doações</h1>
          <p>Consulte as doações por período ou por mês e ano.</p>
        </div>
      </header>

      <form className="donations-report__filters" onSubmit={handlePreview}>
        <fieldset>
          <legend>Período do relatório</legend>
          <div className="donations-report__mode">
            <label>
              <input
                type="radio"
                name="report-period-mode"
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
                name="report-period-mode"
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
            <label className="donations-report__date-field">
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
            <div className="donations-report__date-range">
              <label className="donations-report__date-field">
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
              <label className="donations-report__date-field">
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
            <p className="donations-report__validation" role="alert">
              A data inicial deve ser anterior ou igual à data final.
            </p>
          )}
          <button
            className="donations-report__primary-button"
            type="submit"
            disabled={loading || invalidPeriod}
          >
            {loading ? "Gerando..." : "Gerar prévia"}
          </button>
        </fieldset>
      </form>

      {error && (
        <p className="donations-report__error" role="alert">
          {error}
        </p>
      )}

      {report && (
        <section className="donations-report__results" aria-live="polite">
          <div className="donations-report__results-header">
            <div>
              <h2>Resultado</h2>
              <p>
                {formatDate(report.startDate)} a {formatDate(report.endDate)}
              </p>
            </div>
            <div className="donations-report__downloads">
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

          <dl className="donations-report__summary">
            <div>
              <dt>Total de doações</dt>
              <dd>{report.totalDonations}</dd>
            </div>
            <div>
              <dt>Ativas</dt>
              <dd>{report.activeDonations}</dd>
            </div>
            <div>
              <dt>Canceladas</dt>
              <dd>{report.cancelledDonations}</dd>
            </div>
            <div>
              <dt>Itens doados (ativas)</dt>
              <dd>{report.totalQuantity}</dd>
            </div>
          </dl>

          <div className="donations-report__table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Beneficiário</th>
                  <th>Produtos</th>
                  <th>Quantidade</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {report.donations.length === 0 ? (
                  <tr>
                    <td colSpan="5">Nenhuma doação encontrada no período.</td>
                  </tr>
                ) : (
                  report.donations.map((donation) => (
                    <tr key={donation.id}>
                      <td>{formatDate(donation.createdAt)}</td>
                      <td>{donation.beneficiaryName}</td>
                      <td>
                        {donation.items
                          .map(
                            (item) => `${item.productName} (${item.quantity})`,
                          )
                          .join(", ") || "Sem produtos"}
                      </td>
                      <td>{donation.totalQuantity}</td>
                      <td>
                        {donation.isCancelled ? "Cancelada" : "Ativa"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
});
