export default class AllocationTypeInUseError extends Error {
  /**
   * @param {ErrorOptions} [options]
   */
  constructor(options) {
    super("Este tipo de alocação já está em uso por outro voluntário", options);
  }
}
