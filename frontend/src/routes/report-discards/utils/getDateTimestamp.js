export function getDateTimestamp(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;

  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return NaN;
  }

  return timestamp;
}
