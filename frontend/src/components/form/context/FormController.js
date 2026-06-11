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
 * @prop {IFieldController} input
 */

/**
 * @callback CustomOnSubmitHandler
 * @param {Record<string, string>} data
 * @param {FormController} controller
 * @param {SubmitEvent} event
 * @returns {Promise<boolean>}
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
  /** @type {CustomOnSubmitHandler|null} */
  #onSubmit = null;
  /** @type {OnErrorHandler|null} */
  #onSubmitError = null;

  constructor() {
    super();

    this.validate = this.validate.bind(this);
  }

  /**
   * @param {string} name
   * @param {FieldStateInit} fieldInit
   * @param {IFieldController} input
   */
  registerField(name, fieldInit, input) {
    const required = fieldInit.required ?? false;
    const valid = !required;
    const prevField = this.#fields[name];
    const newField = prevField
      ? { ...prevField, input }
      : {
          ...fieldInit,
          touched: false,
          error: null,
          valid,
          required,
          input,
          name,
        };

    this.#fields = {
      ...this.#fields,
      [name]: newField,
    };

    let fieldValidationTimeout = null;
    let formRevalidationTimeout = null;

    newField.input.onInput(() => {
      const field = this.#fields[name];

      field.touched = true;
      clearTimeout(fieldValidationTimeout);
      clearTimeout(formRevalidationTimeout);

      if (field.mask) input.value = field.mask(input.value);

      if (field.validate)
        fieldValidationTimeout = setTimeout(() => {
          const trimmed =
            typeof input.value === "string" ? input.value.trim() : input.value;
          const result = field.validate(trimmed);

          if (typeof result === "string") {
            this.#isValid = false;
            field.valid = false;
            field.error = result;
          } else {
            field.valid = true;
            field.error = null;
          }

          field.input.setValidity(result);

          this.#emitFieldValidated(field);
        }, 100);

      formRevalidationTimeout = setTimeout(() => {
        this.validate();
      }, 300);
    });
  }

  #emitFieldValidated({ name, valid, error, touched }) {
    this.dispatchEvent(
      new CustomEvent(`validity-change:${name}`, {
        detail: {
          isValid: valid,
          errorMessage: error,
          isTouched: touched,
        },
      }),
    );
  }

  /**
   * @param {CustomOnSubmitHandler} handler
   * @param {OnErrorHandler} [errorHandler]
   */
  handleSubmit(handler, errorHandler) {
    if (
      this.#handleSubmit &&
      this.#onSubmit === handler &&
      this.#onSubmitError === errorHandler
    )
      return this.#handleSubmit;

    this.#onSubmit = handler;
    this.#onSubmitError = errorHandler;

    return (this.#handleSubmit = async (e) => {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("form-submit", { detail: { isSubmitting: true } }),
      );

      await this.validate();

      if (!this.#isValid) {
        this.dispatchEvent(
          new CustomEvent("form-submit", { detail: { isSubmitting: false } }),
        );
        return errorHandler?.("invalid");
      }

      try {
        const formData = Object.entries(this.#fields).reduce(
          (data, [key, field]) => ({ ...data, [key]: field.input.value }),
          {},
        );

        const result = await handler(formData, this, e);

        if (result) this.reset();
      } catch (e) {
        errorHandler?.("error", e);
      }

      this.dispatchEvent(
        new CustomEvent("form-submit", { detail: { isSubmitting: false } }),
      );
    });
  }

  setFieldError(name, error) {
    if (typeof name !== "string" || typeof error !== "string") return;

    const field = this.#fields[name];

    if (!field) return;

    this.#isValid = false;
    field.valid = false;
    field.error = error;
    field.input.setValidity(error);

    this.#emitFieldValidated(field);
    this.dispatchEvent(
      new CustomEvent("form-validity", {
        detail: {
          isValid: this.#isValid,
          controller: this,
        },
      }),
    );
  }

  reset() {
    this.#form.reset();

    Object.entries(this.#fields).forEach(([, field]) => {
      const required = field.required ?? false;
      const valid = !required;

      field.required = required;
      field.valid = valid;
      field.touched = false;
      field.error = null;

      field.input.enable();
      field.input.clear();
      field.input.setValidity(true);

      this.dispatchEvent(
        new CustomEvent(`validity-change:${field.name}`, {
          detail: {
            isValid: field.valid,
            errorMessage: field.error,
            isTouched: field.touched,
          },
        }),
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

      this.#emitFieldValidated(field);

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

  async validateAll() {
    this.#validating = true;

    let isValid = true;
    const fields = Object.entries(this.#fields);

    for (const [, field] of fields) {
      if (!field.validate) continue;

      const result = field.validate(field.input.value);

      if (typeof result === "string") {
        this.#isValid = false;
        field.valid = false;
        field.error = result;
      } else {
        field.valid = true;
        field.error = null;
      }

      field.input.setValidity(result);

      this.#emitFieldValidated(field);
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

  /**
   * @param {HTMLFormElement} form
   */
  registerForm(form) {
    if (form instanceof HTMLFormElement && !this.#form) {
      this.#form = form;
    }
  }

  fill(data, isShow = false) {
    Object.entries(this.#fields).forEach(([, field]) => {
      const value = data[field.name];

      if (value) {
        field.input.fill(field.mask, value);
        field.error = null;
        field.touched = false;
        field.valid = true;
      }

      if (isShow) {
        field.input.disable();
      }
    });
  }

  static create() {
    return new FormController();
  }
}

export default FormController;

/**
 * @typedef {Object} IFieldController
 * @prop {(callback: VoidFunction) => void} onInput
 * @prop {*} value
 * @prop {VoidFunction} clear
 * @prop {(value: true | string) => void} setValidity
 * @prop {(callback: (mask: any, value?: any) => any) => void} [fill]
 * @prop {() => any} getFormData
 * @prop {VoidFunction} enable
 * @prop {VoidFunction} disable
 */
