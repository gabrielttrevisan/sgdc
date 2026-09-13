export default class ForeignKeyViolationError extends Error {
  /**
   * @param {string} record
   * @param {ErrorOptions} [options]
   */
  constructor(record, options) {
    super(`Não é possível remover o ${record} porque existem registros vinculados`, options);
  }
}