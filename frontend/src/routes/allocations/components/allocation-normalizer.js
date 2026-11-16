/**
 * @param {string} value
 * @returns {string}
 */
export function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "";

  const pad = (part) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * @param {import("../../../service/AllocationsService").Allocation} allocation
 * @returns {Record<string, unknown>}
 */
export function normalizeAllocation(allocation) {
  return {
    ...allocation,
    startAt: toDateTimeLocal(allocation.startAt),
    endAt: toDateTimeLocal(allocation.endAt),
    notes: allocation.notes ?? "",
  };
}
