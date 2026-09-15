/**
 * @implements {import("..").IFieldController}
 */
export default class CheckboxFieldController {
  #input;

  constructor(input) {
    if (
      !(input instanceof HTMLInputElement) ||
      input.type !== "checkbox"
    ) {
      throw new TypeError(
        "CheckboxFieldController can only control checkbox inputs",
      );
    }

    this.#input = input;
  }

  enable() {
    this.#input.disabled = false;
  }

  disable() {
    this.#input.disabled = true;
  }

  fill(_mask, value) {
    this.#input.checked = Boolean(value);
  }

  clear() {
    this.#input.checked = false;
  }

  getFormData() {
    return this.#input.checked;
  }

  onInput(listener) {
    this.#input.addEventListener("change", listener);
  }

  setValidity(value) {
    if (typeof value === "string") {
      this.#input.ariaInvalid = "true";
    } else {
      this.#input.ariaInvalid = "false";
    }
  }

  get value() {
    return this.#input.checked;
  }

  set value(value) {
    this.#input.checked = Boolean(value);
  }

  get element() {
    return this.#input;
  }
}