export default class RecordReferenceError extends Error {
  /**
   * @param {string} record
   * @param {ErrorOptions} [options]
   */
  constructor(record, options) {
    super(`Não existe ${record} com o identificador fornecido`, options);
  }
}
