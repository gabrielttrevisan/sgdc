import { useSyncExternalStore } from "react";

class ToastStorage {
  /** @type {import("../../global").ToastMessage[]} */
  #toasts = [];
  /** @type {Array<VoidFunction>} */
  #subscribers = [];

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);

    this.burn = this.show.bind(this);
    this.error = this.error.bind(this);
    this.success = this.success.bind(this);
    this.warn = this.warn.bind(this);
    this.none = this.none.bind(this);
  }

  /**
   * @param {import("../../global").ToastType} type
   * @param {string} message
   * @param {import("../../global").ToastMessageOptions} options
   */
  show(type, message, options = undefined) {
    const key = `toast:${Date.now()}:${this.#slug(message)}`;

    const removeToast = () => {
      this.#toasts = this.#toasts.filter((toasty) => toasty.key !== key);
      this.#emit();
    };

    const toast = {
      ...options,
      type,
      message,
      key,
      timeout: setTimeout(() => removeToast(), options?.customTimeout ?? 4000),
    };

    const theOnesToPop = this.#toasts.splice(6);

    this.#toasts = [toast, ...this.#toasts];

    this.#emit();

    theOnesToPop.forEach((toast) => this.#pop(toast));
  }

  #pop(toast) {
    clearTimeout(toast.timeout);
  }

  pop(key) {
    if (typeof key !== "string") return;

    this.#toasts = this.#toasts.filter((toast) => {
      if (toast.key === key) {
        this.#pop(toast.timeout);
        return false;
      }

      return true;
    });
    this.#emit();
  }

  #emit() {
    this.#subscribers.forEach((subscriber) => subscriber());
  }

  /**
   * @param {string} value
   * @returns {string}
   */
  #slug(value) {
    return value
      .trim()
      .toLocaleLowerCase()
      .replace(/[@#$!'"%&*(){}[\]?/\\:;.><,|_=+§¬¢£³²¹ºª°]/g, "")
      .replace(/\s{1,}/g, "-")
      .slice(0, 32)
      .replace(/[àáãâ]/g, "a")
      .replace(/[éèê]/g, "e")
      .replace(/[íîïì]/g, "i")
      .replace(/[ôóòõö]/g, "o")
      .replace(/[úùûü]/g, "u")
      .replace(/[ç]/g, "c");
  }

  error(message, options = undefined) {
    this.show("error", message, options);
  }

  success(message, options = undefined) {
    this.show("success", message, options);
  }

  none(message, options = undefined) {
    this.show("none", message, options);
  }

  warn(message, options = undefined) {
    this.show("warn", message, options);
  }

  getSnapshot() {
    return this.#toasts;
  }

  subscribe(listener) {
    this.#subscribers.push(listener);

    return () => {
      this.#subscribers = this.#subscribers.filter(
        (subscriber) => subscriber !== listener,
      );
    };
  }
}

const Toast = new ToastStorage();

export default Toast;

export function useToasts() {
  return useSyncExternalStore(Toast.subscribe, Toast.getSnapshot);
}
