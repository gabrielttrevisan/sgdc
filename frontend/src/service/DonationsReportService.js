import { authStore } from "../store/Auth.store.js";

class DonationsReportService {
  #url = `${import.meta.env.VITE_API_URL}donations/report`;

  async #request({ startDate, endDate, format }) {
    const params = new URLSearchParams({ startDate, endDate, format });
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
    return response.json();
  }

  async download(period, format) {
    const response = await this.#request({ ...period, format });
    const file = await response.blob();
    const extension = format === "xlsx" ? "xlsx" : "pdf";
    const filename = `relatorio-doacoes-${period.startDate}-${period.endDate}.${extension}`;
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

export default new DonationsReportService();
