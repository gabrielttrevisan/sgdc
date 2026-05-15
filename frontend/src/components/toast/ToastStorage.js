import { useSyncExternalStore } from "react";

class ToastStorage {
  /** @type {import("../../global").ToastMessage[]} */
  #toasties = [];
  /** @type {Array<VoidFunction>} */
  #subscribers = [];

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);

    this.burn = this.burn.bind(this);
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
  burn(type, message, options = undefined) {
    const key = `toasty:${Date.now()}:${this.#slug(message)}`;

    this.#toasties = [
      {
        ...options,
        type,
        message,
        key,
      },
      ...this.#toasties,
    ];

    this.#emit();

    setTimeout(() => {
      this.#toasties = this.#toasties.filter((toasty) => toasty.key !== key);
      this.#emit();
    }, options?.customTimeout ?? 4000);
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
    this.burn("error", message, options);
  }

  success(message, options = undefined) {
    this.burn("success", message, options);
  }

  none(message, options = undefined) {
    this.burn("none", message, options);
  }

  warn(message, options = undefined) {
    this.burn("warn", message, options);
  }

  getSnapshot() {
    return this.#toasties;
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

const Toaster = new ToastStorage();

export default Toaster;

export function useToasties() {
  return useSyncExternalStore(Toaster.subscribe, Toaster.getSnapshot);
}

export function useToast() {
  const { burn, success, error, warn, none } = Toaster;

  return { burn, success, error, warn, none };
}
