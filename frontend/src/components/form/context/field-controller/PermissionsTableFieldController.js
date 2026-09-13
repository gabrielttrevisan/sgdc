/**
 * @implements {import("..").IFieldController}
 */
export default class PermissionsTableFieldController {
  /** @type {HTMLElement & { forceUpdate(): void; }} */
  #input;

  constructor(input) {
    this.#input = input;
  }

  enable() {
    this.#input
      .querySelectorAll("select")
      .forEach((select) => (select.disabled = false));
  }

  disable() {
    this.#input
      .querySelectorAll("select")
      .forEach((select) => (select.disabled = true));
  }

  fill(_mask, value) {
    this.#input.dataset.value =
      typeof value === "string" ? value : JSON.stringify(value ?? {});
    this.#input.forceUpdate(value);
  }

  clear() {
    this.#input.dataset.value = "{}";
  }

  getFormData() {
    return this.value;
  }

  onInput(listener) {
    this.#input.addEventListener("input", listener);
  }

  setValidity(value) {
    this.#input.ariaInvalid = typeof value === "string" ? "true" : "false";
  }

  get value() {
    return this.#input.dataset.value ?? "{}";
  }

  set value(value) {
    this.#input.dataset.value = value;
  }

  get element() {
    return this.#input;
  }
}
