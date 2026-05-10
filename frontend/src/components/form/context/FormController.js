/**
 * @callback MaskStringCallback
 * @param {string} input
 * @return {string}
 */

/**
 * @callback ValidateFieldCallback
 * @param {string} value
 * @param {Record<string, FieldState>} state
 * @return {true|string}
 */

/**
 * @typedef {Object} FieldStateInit
 * @prop {boolean} required
 * @prop {MaskStringCallback} [mask]
 * @prop {ValidateFieldCallback} validate
 */

/**
 * @typedef {Object} FieldState
 * @prop {boolean} required
 * @prop {string} name
 * @prop {MaskStringCallback} mask
 * @prop {boolean} touched
 * @prop {string|null} error
 * @prop {boolean} valid
 * @prop {HTMLInputElement} input
 */

class FormController extends EventTarget {
  /** @type {Record<string, FieldState>} */
  #fields = {};
  /** @type {HTMLFormElement|null} */
  #form = null;
  /** @type {boolean} */
  #isValid = false;

  /**
   * @param {string} name
   * @param {FieldStateInit} field
   * @param {HTMLInputElement} input
   */
  pushField(name, field, input) {
    const required = field.required ?? false;
    const valid = !required;

    this.#fields = {
      ...this.#fields,
      [name]: {
        ...field,
        touched: false,
        error: null,
        valid,
        required,
        input,
        name,
      },
    };

    if (field.mask) {
      let timeout = null;

      input.addEventListener("input", () => {
        const field = this.#fields[name];

        field.touched = true;
        clearTimeout(timeout);

        input.value = field.mask(input.value);

        timeout = setTimeout(() => {
          const trimmed = input.value.trim();
          const result = field.validate(trimmed);

          if (typeof result === "string") {
            this.#isValid = false;
            field.valid = false;
            field.error = result;
            field.input.ariaInvalid = "true";
            field.input.setCustomValidity(result);
          } else {
            field.valid = true;
            field.error = null;
            field.input.ariaInvalid = "false";
            field.input.setCustomValidity("");
          }

          this.dispatchEvent(
            new CustomEvent(`validity-change:${field.name}`, {
              detail: {
                isValid: field.valid,
                errorMessage: field.error,
                isTouched: field.touched,
              },
            }),
          );
        }, 10);
      });
    }
  }

  setForm(form) {
    if (form instanceof HTMLFormElement && !this.#form) this.#form = form;
  }

  static create() {
    return new FormController();
  }
}

export default FormController;
