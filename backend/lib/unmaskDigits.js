/**
 * @param {string} value
 * @returns {string}
 */
export default function unmaskDigits(value) {
  return value.trim().replace(/[\D]/g, "");
}
