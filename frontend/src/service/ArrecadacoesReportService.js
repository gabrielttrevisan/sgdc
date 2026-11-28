import { authStore } from "../store/Auth.store.js";

class ArrecadacoesReportService {
  #url = `${import.meta.env.VITE_API_URL}arrecadacoes/report`;

  async #request({ format, ...filters }) {
    const params = new URLSearchParams({ ...filters, format });
    const response = await fetch(`${this.#url}?${params}`, {
      headers: authStore.getHeaders(),
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(
        body?.error?.message || "Não foi possível gerar o relatório.",
      );
    }

    return response;
  }

  async preview(period) {
    const response = await this.#request({ ...period, format: "preview" });
    const body = await response.json();
    return body.data;
  }

  async download(period, format) {
    const response = await this.#request({ ...period, format });
    const file = await response.blob();
    const extension = format === "xlsx" ? "xlsx" : "pdf";
    const periodLabel = period.month
      ? period.month
      : `${period.startDate}-${period.endDate}`;
    const filename = `relatorio-arrecadacoes-${periodLabel}.${extension}`;
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export default new ArrecadacoesReportService();
