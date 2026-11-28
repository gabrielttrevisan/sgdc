export function isFullCalendarMonth(startTimestamp, endTimestamp) {
  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);

  const startsOnFirstDay = start.getUTCDate() === 1;
  const endsOnLastDay =
    end.getUTCDate() ===
    new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0),
    ).getUTCDate();

  return (
    startsOnFirstDay &&
    endsOnLastDay &&
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth()
  );
}
