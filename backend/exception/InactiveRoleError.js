export default class InactiveRoleError extends Error {
  /** @param {ErrorOptions} [options] */
  constructor(options) {
    super("O nível de acesso do usuário está inativo", options);
  }
}