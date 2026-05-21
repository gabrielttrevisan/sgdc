export default class APIResponse {
  /**
   * @template T
   * @param {T} data
   */
  static success(data) {
    return {
      data,
      error: null,
    };
  }

  /**
   * @param {string} code
   * @param {string} message
   * @param {Issue[]} issues
   */
  static error(code, message, ...issues) {
    return {
      data: null,
      error: {
        code,
        message,
        issues,
      },
    };
  }

  static internalError() {
    return APIResponse.error("INTERNAL_SERVER_ERROR", "Internal server error");
  }

  /**
   * @param {string} message
   * @param {Issue[]} issues
   */
  static badRequestError(...issues) {
    return APIResponse.error("BAD_REQUEST", "Falha de Requisição", issues);
  }
}

/**
 * @typedef {Object} Issue
 * @prop {string} code
 * @prop {string} description
 */

/**
 * @typedef {Object} APIError
 * @prop {string} code
 * @prop {string} message
 * @prop {Issue[]} [issues]
 */
