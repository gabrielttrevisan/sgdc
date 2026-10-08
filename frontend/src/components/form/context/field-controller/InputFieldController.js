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
    if (this.#input.type === "date") {
      if (value) {
        const d = new Date(value);

        this.#input.value = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      }

      return;
    }

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
    } else {
      this.#input.ariaInvalid = "false";
    }
  }

  get value() {
    return this.#input.value;
  }

  set value(value) {
    this.#input.value = value;
  }

  get element() {
    return this.#input;
  }
}
