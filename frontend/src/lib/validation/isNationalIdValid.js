/**
 * @param {string} nationalId
 * @returns {boolean}
 */
export function isNationalIdValid(nationalId) {
  const match = nationalId.match(/^(\d{9})-?(\d{2})$/);

  if (!match) return false;

  const [, first, last] = match;

  if (!first || first.length < 9 || !last || last.length < 2) return false;

  const numbers = first
    .split("")
    .map(Number)
    .filter((n) => !isNaN(n));

  if (numbers.length < 9) return false;

  let sum = 0;
  let firstMark;

  for (let i = 1; i <= 9; i++) {
    sum = sum + numbers[i - 1] * (11 - i);
  }

  firstMark = (sum * 10) % 11;

  if (firstMark === 10 || firstMark === 11) {
    firstMark = 0;
  }

  if (firstMark.toString() !== last[0]) {
    return false;
  }

  numbers.push(firstMark);

  let lastMark;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += numbers[i - 1] * (12 - i);
  }

  lastMark = (sum * 10) % 11;

  if (lastMark === 10 || lastMark === 11) {
    lastMark = 0;
  }

  if (lastMark.toString() !== last[1]) {
    return false;
  }

  return true;
}
