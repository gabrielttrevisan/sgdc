export default class UserCredentialMismatchError extends Error {
  /** @param {ErrorOptions} [options] */
  constructor(options) {
    super(`Nome de usuário ou senha incorretos`, options);
  }
}
