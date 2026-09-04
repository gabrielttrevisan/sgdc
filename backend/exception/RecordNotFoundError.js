export default class RecordNotFoundError extends Error {
  /**
   * @param {string} record
   * @param {ErrorOptions} options
   */
  constructor(record, options) {
    super(`O ${record} não foi encontrado`, options);
  }
}
