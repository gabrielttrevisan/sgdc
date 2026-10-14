export class CachedFetcher {
  /** @type {Map<string, CachedResponse>} */
  #cache;
  #staleTime;

  constructor(staleTime = 604_800_000) {
    this.#cache = new Map();
    this.#staleTime = staleTime;
  }

  /**
   * @param {string} key
   * @param {Record<string, unknown>} value
   */
  #updateCache(key, value) {
    this.#cache.set(key, {
      data: value,
      cachedAt: Date.now(),
    });
  }

  /**
   * @param {RequestInfo | URL} url
   * @param {RequestInit} init
   * @param {string} key
   * @returns {Record<string, unknown>}
   */
  async #fetch(url, init, key) {
    const raw = await fetch(url, init);
    const json = await raw.json();

    this.#updateCache(key, json);

    return json;
  }

  /**
   * @param {RequestInfo | URL} url
   * @param {RequestInit} [init]
   * @returns {Record<string, unknown>}
   */
  async call(url, init = undefined) {
    const key = this.#getKey(url, init);

    if (key) {
      const cached = this.#cache.get(key);

      if (!cached) return await this.#fetch(url, init, key);

      const diff = Date.now() - cached.cachedAt;
      const isStale = diff >= this.#staleTime;

      if (isStale) return await this.#fetch(url, init, key);

      return cached.data;
    }

    return await this.#fetch(url, init, key);
  }

  /**
   * @param {RequestInfo | URL} url
   * @param {RequestInit} [init]
   * @returns {false|string}
   */
  #getKey(url, init = undefined) {
    const method = this.#getMethod(init);

    if (!["QUERY", "GET"].includes(method)) return false;

    const keyUrl = this.#getUrl(method, url, init);

    return `${method}:${keyUrl}`;
  }

  /**
   * @param {RequestInit} [init]
   * @returns {string}
   */
  #getMethod(init) {
    if (!init || !init.method) return "GET";

    return init.method.toUpperCase();
  }

  /**
   * @param {"GET"|"QUERY"} method
   * @param {RequestInfo | URL} url
   * @param {RequestInit} [init]
   * @returns {|string}
   */
  #getUrl(method, url, init) {
    if (method === "GET" || !init?.body) return url;

    const parsedBody = init.body.toString();

    return `${url}?${parsedBody}`;
  }

  invalidate() {
    this.#cache.clear();
    this.#cache = new Map();
  }
}

/**
 * @implements {IFetcher}
 */
export class DefaultFetcher {
  /**
   * @param {RequestInfo | URL} url
   * @param {RequestInit} [init]
   * @returns {Record<string, unknown>}
   */
  async call(url, init) {
    return await fetch(url, init);
  }
}

/**
 * @typedef {Object} CachedResponse
 * @prop {Record<string, unknown>} data
 * @prop {number} cachedAt
 */

/**
 * @callback FetchCallback
 * @param {RequestInfo | URL} url
 * @param {RequestInit} [init]
 * @returns {Promise<import("../../global").APIResponse<any>>}
 */

/**
 * @typedef {Object} IFetcher
 * @prop {FetchCallback} call
 * @prop {VoidFunction} invalidate
 */
