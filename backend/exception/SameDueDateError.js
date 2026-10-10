export class SameDueDateError extends Error {
  /**
   * @param {ErrorOptions} [options]
   */
  constructor(options) {
    super("A nova e a antiga data de vencimento são iguais", options);
  }
}
