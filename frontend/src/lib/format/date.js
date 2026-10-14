export default function formatDate(
  value,
  invalidDateMessage = "DATA INVÁLIDA",
) {
  if (!value || !["string", "number"].includes(typeof value))
    return invalidDateMessage;

  const date = new Date(value);
  const time = date.getTime();

  if (isNaN(time) || !Number.isFinite(time)) return invalidDateMessage;

  return date.toLocaleDateString("pt-br", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
