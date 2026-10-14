import APIClient from "./APIClient";
import { CachedFetcher } from "./Fetch";

/**
 * @typedef {Object} CachedAPIClientOptions
 * @prop {number} [staleTime]
 * @prop {string} [apiUrl]
 */

export default class CachedAPIClient extends APIClient {
  /**
   * @param {CachedAPIClientOptions} [options]
   */
  constructor({ apiUrl, staleTime } = {}) {
    super({
      apiUrl,
      fetcher: new CachedFetcher(
        staleTime ?? CachedAPIClient.STALE_ITME_ONE_HOURS,
      ),
    });
  }

  static get STALE_ITME_ONE_HOURS() {
    return 3_600_000;
  }

  static get STALE_TIME_ONE_WEEK() {
    return 604_800_000;
  }
}
