import { useSyncExternalStore } from "react";
import { AuthChangeEvent } from "./auth/AuthChangeEvent";

/**
 * @typedef {Object} User
 * @prop {number} id
 * @prop {string} name
 * @prop {number} roleId
 * @prop {string} token
 */

class AuthStore {
  static #TOKEN_KEY = "token";
  static #MENU_KEY = "menu";

  #token = null;
  /** @type {User|null} */
  #user = null;
  #menu = [];
  #signedIn = false;

  #target = new EventTarget();

  constructor() {
    const token = localStorage.getItem(AuthStore.#TOKEN_KEY);
    const menu = JSON.parse(localStorage.getItem(AuthStore.#MENU_KEY));

    if (token && menu) {
      this.#token = token;
      this.#user = this.#getUserData(token);
      this.#signedIn = true;
      this.#menu = menu;

      this.#emit(true, menu);
    } else {
      this.#emit(false);
    }

    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);

    window.addEventListener("storage", (e) => {
      if (
        e.key === AuthStore.#TOKEN_KEY &&
        e.oldValue !== e.newValue &&
        this.#signedIn
      )
        this.signOut();
    });
  }

  signIn(token, userId, userName, menu) {
    if (!this.#token) {
      this.#signedIn = true;
      this.#token = token;
      this.#user = { id: userId, name: userName };
      this.#menu = menu;
      localStorage.setItem(AuthStore.#TOKEN_KEY, this.#token);
      localStorage.setItem(AuthStore.#MENU_KEY, JSON.stringify(this.#menu));
      this.#emit(false, menu);
    }
  }

  signOut() {
    this.#signedIn = false;
    this.#token = null;
    this.#user = null;
    this.#menu = [];
    localStorage.removeItem(AuthStore.#TOKEN_KEY);
    localStorage.removeItem(AuthStore.#MENU_KEY);
    this.#emit(false);
  }

  match(id) {
    const testedId = typeof id === "number" ? id : parseInt(id);
    
    return this.#user?.id === testedId;
  }

  get menu() {
    return structuredClone(this.#menu);
  }

  #emit(isSignedIn, menu) {
    this.#target.dispatchEvent(new AuthChangeEvent(isSignedIn, menu));
  }

  #getUserData() {
    if (!this.#token) return null;

    try {
      const base64Url = this.#token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const decoded = JSON.parse(jsonPayload);

      return {
        ...decoded.user,
        token: this.#token,
      };
    } catch (error) {
      console.error("Failed to parse JWT token:", error);
      return null;
    }
  }

  subscribe(subscriber) {
    this.#target.addEventListener(AuthChangeEvent.EVENT_TYPE, subscriber);

    return () => {
      this.#target.removeEventListener(AuthChangeEvent.EVENT_TYPE, subscriber);
    };
  }

  getSnapshot() {
    return this.#user;
  }

  getHeaders() {
    if (this.#token) return { Authorization: `Bearer ${this.#token}` };

    return {};
  }
}

export const authStore = new AuthStore();

export function useAuth() {
  return useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
}
