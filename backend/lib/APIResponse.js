export default class APIResponse {
  /** @type {import("express").Response} */
  #res;

  /**
   * @param {import("express").Response} res
   */
  constructor(res) {
    this.#res = res;
  }

  /**
   * @param {import("express").Response} res
   * @returns {APIResponse}
   */
  static from(res) {
    return new APIResponse(res);
  }

  /**
   * @template T
   * @param {T} data
   * @param {number} code
   */
  success(data, code = 200) {
    this.#res.status(code).send({
      data,
      error: null,
    });
  }

  /**
   *
   * @param {string} code
   * @param {string} message
   * @param {number} status
   * @returns
   */
  error(code, message) {
    /** @type {Issue[]} */
    const issues = [];

    const builder = {
      /**
       * @param {string} code
       * @param {string} description
       */
      withIssue: (code, description) => {
        issues.push({ code, description });
        return builder;
      },
      /**
       * @param {number} status
       */
      send: (status) => {
        this.#res.status(status).send({
          data: null,
          error: {
            code,
            message,
            issues,
          },
        });
      },
      get hasIssues() {
        return issues.length > 0;
      },
    };

    return builder;
  }

  internalError(message = "Erro interno do servidor") {
    this.error("INTERNAL_SERVER_ERROR", message).send(500);
  }

  /**
   * @param {string} message
   */
  notFound(message) {
    this.error("NOT_FOUND", message).send(404);
  }

  badRequest() {
    /** @type {Issue[]} */
    const issues = [];

    const builder = {
      /**
       * @param {string} code
       * @param {string} description
       */
      withIssue: (code, description) => {
        issues.push({ code, description });
        return builder;
      },
      /**
       * @param {number} [status]
       */
      send: (status = 400) => {
        this.#res.status(status).send({
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Falha de Requisição",
            issues,
          },
        });
      },
      get hasIssues() {
        return issues.length > 0;
      },
    };

    return builder;
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
