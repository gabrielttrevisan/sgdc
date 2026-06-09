/**
 * @implements {IFieldController}
 */
export default class SelectFieldController {
  #input;

  constructor(input) {
    if (!(input instanceof HTMLSelectElement))
      throw new TypeError(
        "SelectFieldController can only control HTMLSelectElement",
      );

    this.#input = input;
  }

  enable() {
    this.#input.disabled = false;
  }

  disable() {
    this.#input.disabled = true;
  }

  fill(_mask, _value) {
    return;
  }

  clear() {
    this.#input.value = "";
  }

  getFormData() {
    return this.#input.value;
  }

  onInput(listener) {
    this.#input.addEventListener("input", listener);
  }

  setValidity(value) {
    if (typeof value === "string") {
      this.#input.ariaInvalid = "true";
      this.#input.setCustomValidity(value);
    } else {
      this.#input.ariaInvalid = "false";
      this.#input.setCustomValidity("");
    }
  }

  get value() {
    return this.#input.value;
  }

  set value(value) {
    this.#input.value = value;
  }
}
