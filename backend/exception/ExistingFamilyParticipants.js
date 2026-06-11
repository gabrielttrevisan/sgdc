export default class ExintingFamilyParticipantsError extends Error {
  #code;

  constructor() {
    super("Alguns beneficiários já tem vínculo familiar");
    this.#code = 1;
  }

  get code() {
    return this.#code;
  }
}
