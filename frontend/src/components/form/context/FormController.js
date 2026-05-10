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
 * @prop {ValidateFieldCallback} [validate]
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

/**
 * @callback CustomOnSubmitHandler
 * @param {Record<string, string>} data
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */

/**
 * @callback OnErrorHandler
 * @param {"invalid"|"error"} type
 * @param {Error} [error]
 * @returns {void}
 */

/**
 * @callback OnSubmitHandler
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */

class FormController extends EventTarget {
  /** @type {Record<string, FieldState>} */
  #fields = {};
  /** @type {HTMLFormElement|null} */
  #form = null;
  /** @type {boolean} */
  #isValid = false;
  /** @type {boolean} */
  #validating = false;
  /** @type {OnSubmitHandler|null} */
  #handleSubmit = null;

  constructor() {
    super();

    this.validate = this.validate.bind(this);
  }

  /**
   * @param {string} name
   * @param {FieldStateInit} field
   * @param {HTMLInputElement} input
   */
  registerField(name, field, input) {
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

    let fieldValidationTimeout = null;
    let formRevalidationTimeout = null;

    input.addEventListener("input", () => {
      const field = this.#fields[name];

      field.touched = true;
      clearTimeout(fieldValidationTimeout);
      clearTimeout(formRevalidationTimeout);

      if (field.mask) input.value = field.mask(input.value);

      if (field.validate)
        fieldValidationTimeout = setTimeout(() => {
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

      formRevalidationTimeout = setTimeout(() => {
        this.validate();
      }, 300);
    });
  }

  /**
   * @param {CustomOnSubmitHandler} handler
   * @param {OnErrorHandler} [errorHandler]
   */
  handleSubmit(handler, errorHandler) {
    if (this.#handleSubmit) return this.#handleSubmit;

    return (this.#handleSubmit = async (e) => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("form-submit", { detail: { isSubmitting: true } }),
      );

      if (!this.#isValid) return errorHandler?.("invalid");

      try {
        const formData = Object.entries(this.#fields).reduce(
          (data, [key, field]) => ({ ...data, [key]: field.input.value }),
          {},
        );

        await handler(formData, e);
      } catch (e) {
        errorHandler?.("error", e);
      }

      this.dispatchEvent(
        new CustomEvent("form-submit", { detail: { isSubmitting: false } }),
      );
    });
  }

  async validate() {
    this.#validating = true;

    let isValid = true;
    const fields = Object.entries(this.#fields);

    for (const [, field] of fields) {
      if (!field.validate) continue;

      const result = field.validate(field.input.value);

      if (typeof result === "string") {
        isValid = false;
        break;
      }
    }

    this.#validating = false;
    this.#isValid = isValid;
    this.dispatchEvent(
      new CustomEvent("form-validity", {
        detail: {
          isValid,
          controller: this,
        },
      }),
    );
  }

  get isValid() {
    return this.#isValid;
  }

  get validating() {
    return this.#validating;
  }

  setForm(form) {
    if (form instanceof HTMLFormElement && !this.#form) this.#form = form;
  }
  /**
   * @param {HTMLFormElement} form
   */
  registerForm(form) {
    if (form instanceof HTMLFormElement && !this.#form) {
      this.#form = form;
    }
  }

  static create() {
    return new FormController();
  }
}

export default FormController;
