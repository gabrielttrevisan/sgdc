export default class DuplicatedFieldError extends Error {
  /** @type {string} */
  #field;

  /**
   * @param {string} field
   * @param {string} record
   * @param {ErrorOptions} [options]
   * */
  constructor(field, record, options) {
    super(`Já existe um ${record} com o ${field} fornecido`, options);

    this.#field = field.toUpperCase();
  }

  get field() {
    return this.#field;
  }
}
