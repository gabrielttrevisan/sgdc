/**
 * @param {string} raw
 * @returns {string}
 */
export function censorCPF(raw) {
  return raw.replace(/^(\d{3})(\d{6})(\d{2})$/i, "$1.***.***.-$3");
}
