export class Service {
  /**
   * @param {string} [message]
   * @returns {APIResponse<import("../components/data-grid/DataGrid").PageData<any>>}
   */
  internal(message = "Erro inesperado") {
    return {
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
        issues: [],
      },
    };
  }
}
