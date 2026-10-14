import { authStore } from "../../store/Auth.store";
import { DefaultFetcher } from "./Fetch";

/**
 * @typedef {Object} APIClientInit
 * @prop {string} [apiUrl]
 * @prop {IFetch} [fetcher]
 */

export default class APIClient {
  #url;
  /** @type {import("./Fetch").IFetcher} */
  #fetcher;

  /**
   *
   * @param {APIClientInit} [init]
   */
  constructor({
    url = import.meta.env.VITE_API_URL,
    fetcher = new DefaultFetcher(),
  } = {}) {
    this.#url = url;
    this.#fetcher = fetcher;
  }

  /**
   * @param {string} path
   * @param {Record<string, string>} [query]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async get(path, query = {}, init = {}) {
    const params = Object.entries(query).filter(([, value]) => Boolean(value));
    const search = new URLSearchParams(params);
    const url = search.size
      ? `${this.#url}${path}?${search.toString()}`
      : `${this.#url}${path}`;

    const response = await this.#fetcher.call(url, {
      ...init,
      headers: this.#getHeaders({ init }),
      method: "GET",
    });

    return response;
  }

  /**
   * @template {T}
   * @param {string} path
   * @param {Record<string, string>} [body]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<T>>}
   */
  async post(path, body = {}, init = {}) {
    const headers = this.#getHeaders({
      init,
      headers: { "Content-Type": "application/json" },
    });

    const response = await this.#fetcher.call(`${this.#url}${path}`, {
      ...init,
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    this.#invalidate(response);

    return response;
  }

  /**
   * @param {string} path
   * @param {Record<string, unknown>} [body]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async patch(path, body = {}, init = {}) {
    const response = await this.#fetcher.call(`${this.#url}${path}`, {
      ...init,
      method: "PATCH",
      headers: this.#getHeaders({
        init,
        headers: { "Content-Type": "application/json" },
      }),
      body: JSON.stringify(body),
    });

    this.#invalidate(response);

    return response;
  }

  /**
   * @param {string} path
   * @param {Record<string, unknown>} [body]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async put(path, body = {}, init = {}) {
    const response = await this.#fetcher.call(`${this.#url}${path}`, {
      ...init,
      method: "PUT",
      headers: this.#getHeaders({
        init,
        headers: { "Content-Type": "application/json" },
      }),
      body: JSON.stringify(body),
    });

    this.#invalidate(response);

    return response;
  }

  /**
   * @param {string} path
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async delete(path, init) {
    const response = await this.#fetcher.call(`${this.#url}${path}`, {
      ...init,
      headers: this.#getHeaders({ init }),
      method: "DELETE",
    });

    this.#invalidate(response);

    return response;
  }

  get url() {
    return this.#url;
  }

  #invalidate(response) {
    if (typeof response === "object" && response && !response.error)
      this.#fetcher.invalidate();
  }

  /**
   * @param {import("../../global").FetchOptions} [init]
   */
  #getHeadersFromFetchOptions(init) {
    if (init && init.headers) {
      if (Array.isArray(init.headers)) return Object.fromEntries(init.headers);
      else if (init.headers instanceof Headers)
        return Object.fromEntries(init.headers.entries());
      else return { ...init.headers };
    }

    return {};
  }

  /**
   * @typedef {Object} HeadersParams
   * @prop {Record<string, string>} [param.headers]
   * @prop {import("../../global").FetchOptions} [param.init]
   */

  /**
   * @param {HeadersParams} [param]
   */
  #getHeaders({ headers, init } = {}) {
    return {
      ...headers,
      ...this.#getHeadersFromFetchOptions(init),
      ...authStore.getHeaders(),
    };
  }
}
