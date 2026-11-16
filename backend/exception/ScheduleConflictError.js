export default class ScheduleConflictError extends Error {
  /**
   * @param {ErrorOptions} [options]
   */
  constructor(options) {
    super(
      "O voluntário já possui uma alocação no período informado",
      options,
    );
  }
}
