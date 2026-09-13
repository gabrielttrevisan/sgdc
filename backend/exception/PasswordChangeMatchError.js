export default class PasswordChangeMatchError extends Error {
  /** @param {ErrorOptions} [options] */
  constructor(options) {
    super("A nova senha deve ser diferente da senha atual", options);
  }
}