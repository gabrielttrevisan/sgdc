import { auth } from "../../store/Auth.store";

export default class APIClient {
  #url;

  constructor(url = "http://localhost:3004/", noCredentials = false) {
    this.#url = url;
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

    const rawResponse = await fetch(url, {
      ...init,
      headers: this.#getHeaders({ init }),
      method: "GET",
    });
    const response = await rawResponse.json();

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

    const rawResponse = await fetch(`${this.#url}${path}`, {
      ...init,
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const response = await rawResponse.json();

    return response;
  }

  /**
   * @param {string} path
   * @param {Record<string, unknown>} [body]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async patch(path, body = {}, init = {}) {
    const rawResponse = await fetch(`${this.#url}${path}`, {
      ...init,
      method: "PATCH",
      headers: this.#getHeaders({
        init,
        headers: { "Content-Type": "application/json" },
      }),
      body: JSON.stringify(body),
    });
    const response = await rawResponse.json();

    return response;
  }

  /**
   * @param {string} path
   * @param {Record<string, unknown>} [body]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async put(path, body = {}, init = {}) {
    const rawResponse = await fetch(`${this.#url}${path}`, {
      ...init,
      method: "PUT",
      headers: this.#getHeaders({
        init,
        headers: { "Content-Type": "application/json" },
      }),
      body: JSON.stringify(body),
    });
    const response = await rawResponse.json();

    return response;
  }

  /**
   * @param {string} path
   * @param {import("../../global").FetchOptions} [init]
   * @returns {Promise<import("../../global").APIResponse<any>>}
   */
  async delete(path, init) {
    const rawResponse = await fetch(`${this.#url}${path}`, {
      ...init,
      headers: this.#getHeaders({ init }),
      method: "DELETE",
    });
    const response = await rawResponse.json();

    return response;
  }

  get url() {
    return this.#url;
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
      ...auth.getHeaders(),
    };
  }
}
