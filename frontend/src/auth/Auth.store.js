import { useSyncExternalStore } from "react";

class AuthStore {
  static TOKEN_KEY = "token";

  #token = null;
  #user = null;
  #subscribers = new Set();

  constructor() {
    const token = localStorage.getItem(AuthStore.TOKEN_KEY);

    if (token) {
      this.#token = token;
      this.#user = this.#getUserData(token);
    }

    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  signIn(token) {
    if (!this.#token) {
      this.#token = token;
      this.#user = this.#getUserData();
      localStorage.setItem(AuthStore.TOKEN_KEY, this.#token);
      this.#emit();
    }
  }

  signOut() {
    this.#token = null;
    this.#user = null;
    localStorage.removeItem(AuthStore.TOKEN_KEY);
    this.#emit();
  }

  #emit() {
    this.#subscribers.forEach((sub) => sub());
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
    this.#subscribers.add(subscriber);

    return () => {
      this.#subscribers.delete(subscriber);
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

export const auth = new AuthStore();

export function useAuth() {
  return useSyncExternalStore(auth.subscribe, auth.getSnapshot);
}
