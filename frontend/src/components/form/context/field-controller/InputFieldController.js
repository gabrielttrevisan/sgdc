/**
 * @implements {import("..").IFieldController}
 */
export default class InputFieldController {
  #input;

  constructor(input) {
    if (
      !(input instanceof HTMLInputElement) &&
      !(input instanceof HTMLTextAreaElement)
    )
      throw new TypeError(
        "InputFieldController can only control HTMLInputElement",
      );

    this.#input = input;
  }

  enable() {
    this.#input.readOnly = false;
  }

  disable() {
    this.#input.readOnly = true;
  }

  fill(mask, value) {
    if (!mask) {
      if (value) this.#input.value = value;

      return;
    }

    this.#input.value = mask(value ?? this.#input.value);
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
