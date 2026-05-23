export default class APIClient {
  #url;

  constructor(url = "http://localhost:3004/") {
    this.#url = url;
  }

  /**
   * @param {string} path
   * @param {Record<string, string>} [query]
   * @param {import("../../global").FetchOptions} [init]
   * @returns {import("../../global").APIResponse<any>}
   */
  async get(path, query, init) {
    const params = Object.entries(query).filter(([, value]) => Boolean(value));
    const search = new URLSearchParams(params);
    const url = search.size
      ? `${this.#url}${path}?${search.toString()}`
      : `${this.#url}${path}`;

    const rawResponse = await fetch(url, {
      ...init,
      method: "GET",
    });
    const response = await rawResponse.json();

    return response;
  }

  get url() {
    return this.#url;
  }
}
