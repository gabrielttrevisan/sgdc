/**
 * @param {string} value
 * @returns {string}
 */
export function unmaskDigits(value) {
  return value.trim().replace(/[\D]/g, "");
}
